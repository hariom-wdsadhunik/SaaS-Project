import { AppointmentRepository } from "@/contracts/appointment/repository";
import {
  AppointmentActivityEntity,
  AppointmentAttendee,
  AppointmentEntity,
  AppointmentFilterState,
  AppointmentReminder,
  AppointmentStatus,
  MeetingType,
} from "@/domain/appointment/types";
import { AppointmentFormInput } from "@/lib/validations/appointment-form";
import { supabase } from "@/lib/supabase/client";
import { platformAuditLogger } from "@/platform/audit";
import { supabaseContactRepository } from "./SupabaseContactRepository";

export class SupabaseAppointmentRepository implements AppointmentRepository {
  async getAppointments(filters?: Partial<AppointmentFilterState>): Promise<AppointmentEntity[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("start_time", { ascending: true });

    if (error) {
      console.error("[SupabaseAppointmentRepository] getAppointments error:", error.message);
      throw new Error(`Database error fetching appointments: ${error.message}`);
    }

    const mapped: AppointmentEntity[] = (data || []).map((row) => this.mapRowToEntity(row));
    return this.applyFilters(mapped, filters);
  }

  async getAppointmentById(id: string): Promise<AppointmentEntity | null> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`[SupabaseAppointmentRepository] getAppointmentById(${id}) error:`, error.message);
      throw new Error(`Database error fetching appointment ${id}: ${error.message}`);
    }

    if (!data) return null;
    return this.mapRowToEntity(data);
  }

  async createAppointment(input: AppointmentFormInput): Promise<AppointmentEntity> {
    const newRecord = {
      title: input.title,
      description: input.description || "",
      location: input.location || "Online Video Link",
      meeting_type: input.meetingType || "VIDEO",
      status: input.status || "SCHEDULED",
      start_time: new Date(input.startTime).toISOString(),
      end_time: new Date(input.endTime).toISOString(),
      timezone: "UTC",
      contact_id: input.contactId || null,
      lead_id: input.leadId || null,
      deal_id: input.dealId || null,
      task_id: input.taskId || null,
      created_by: "System Admin",
      assigned_to: input.assignedTo || "Alex Morgan",
      meeting_link: input.meetingLink || null,
      notes: input.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("appointments")
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      console.error("[SupabaseAppointmentRepository] createAppointment error:", error.message);
      throw new Error(`Database error creating appointment: ${error.message}`);
    }

    const created = this.mapRowToEntity(data);

    await this.appendActivityEvent({
      appointmentId: created.id,
      eventType: "Appointment Created",
      title: "Appointment Created",
      description: `Meeting "${created.title}" scheduled for ${new Date(created.startTime).toLocaleString()}.`,
    });

    if (created.contactId) {
      try {
        await supabaseContactRepository.appendTimelineEvent({
          contactId: created.contactId,
          eventType: "Appointment",
          title: `Appointment Created: ${created.title}`,
          description: `Type: ${created.meetingType}, Location: ${created.location}, Time: ${new Date(created.startTime).toLocaleString()}`,
        });
      } catch (err) {
        console.warn("[SupabaseAppointmentRepository] Timeline append warning:", err);
      }
    }

    // Schedule default reminder foundation
    try {
      const reminderTime = new Date(new Date(created.startTime).getTime() - 24 * 60 * 60 * 1000).toISOString();
      await this.scheduleReminder(created.id, "EMAIL", reminderTime);
    } catch {
      // Non-blocking reminder initialization
    }

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [created.id],
      payload: { event: "Appointment Created", title: created.title, start: created.startTime },
      timestamp: new Date().toISOString(),
    });

    return created;
  }

  async updateAppointment(id: string, input: AppointmentFormInput): Promise<AppointmentEntity> {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        title: input.title,
        description: input.description || "",
        location: input.location,
        meeting_type: input.meetingType,
        status: input.status,
        start_time: new Date(input.startTime).toISOString(),
        end_time: new Date(input.endTime).toISOString(),
        assigned_to: input.assignedTo,
        meeting_link: input.meetingLink || null,
        notes: input.notes || null,
        contact_id: input.contactId || null,
        lead_id: input.leadId || null,
        deal_id: input.dealId || null,
        task_id: input.taskId || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseAppointmentRepository] updateAppointment(${id}) error:`, error.message);
      throw new Error(`Database error updating appointment ${id}: ${error.message}`);
    }

    const updated = this.mapRowToEntity(data);

    await this.appendActivityEvent({
      appointmentId: updated.id,
      eventType: "Appointment Updated",
      title: "Appointment Details Updated",
      description: `Updated schedule or location for "${updated.title}".`,
    });

    if (updated.contactId) {
      try {
        await supabaseContactRepository.appendTimelineEvent({
          contactId: updated.contactId,
          eventType: "Appointment",
          title: `Appointment Updated: ${updated.title}`,
          description: `Updated status: ${updated.status}, Start: ${new Date(updated.startTime).toLocaleString()}`,
        });
      } catch (err) {
        console.warn("[SupabaseAppointmentRepository] Timeline update warning:", err);
      }
    }

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "SYSTEM",
      entityIds: [id],
      payload: { event: "Appointment Updated", title: updated.title },
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) {
      console.error(`[SupabaseAppointmentRepository] deleteAppointment(${id}) error:`, error.message);
      throw new Error(`Database error deleting appointment ${id}: ${error.message}`);
    }

    platformAuditLogger.log({
      action: "DELETE",
      entityType: "SYSTEM",
      entityIds: [id],
      payload: { event: "Appointment Deleted", appointmentId: id },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  async confirmAppointment(id: string): Promise<AppointmentEntity> {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status: "CONFIRMED", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseAppointmentRepository] confirmAppointment(${id}) error:`, error.message);
      throw new Error(`Database error confirming appointment ${id}: ${error.message}`);
    }

    const confirmed = this.mapRowToEntity(data);

    await this.appendActivityEvent({
      appointmentId: confirmed.id,
      eventType: "Confirmed",
      title: "Appointment Confirmed",
      description: `Meeting "${confirmed.title}" confirmed by attendees.`,
    });

    if (confirmed.contactId) {
      try {
        await supabaseContactRepository.appendTimelineEvent({
          contactId: confirmed.contactId,
          eventType: "Appointment",
          title: `Appointment Confirmed: ${confirmed.title}`,
          description: `Confirmed for ${new Date(confirmed.startTime).toLocaleString()}`,
        });
      } catch (err) {
        console.warn("[SupabaseAppointmentRepository] Timeline confirm warning:", err);
      }
    }

    platformAuditLogger.log({
      action: "CHANGE_STATUS",
      entityType: "SYSTEM",
      entityIds: [id],
      payload: { event: "Appointment Confirmed", id },
      timestamp: new Date().toISOString(),
    });

    return confirmed;
  }

  async cancelAppointment(id: string, reason?: string): Promise<AppointmentEntity> {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status: "CANCELLED", notes: reason ? `Cancelled: ${reason}` : null, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseAppointmentRepository] cancelAppointment(${id}) error:`, error.message);
      throw new Error(`Database error cancelling appointment ${id}: ${error.message}`);
    }

    const cancelled = this.mapRowToEntity(data);

    await this.appendActivityEvent({
      appointmentId: cancelled.id,
      eventType: "Cancelled",
      title: "Appointment Cancelled",
      description: reason || `Meeting "${cancelled.title}" was cancelled.`,
    });

    if (cancelled.contactId) {
      try {
        await supabaseContactRepository.appendTimelineEvent({
          contactId: cancelled.contactId,
          eventType: "Appointment",
          title: `Appointment Cancelled: ${cancelled.title}`,
          description: reason || "Meeting cancelled.",
        });
      } catch (err) {
        console.warn("[SupabaseAppointmentRepository] Timeline cancel warning:", err);
      }
    }

    platformAuditLogger.log({
      action: "CHANGE_STATUS",
      entityType: "SYSTEM",
      entityIds: [id],
      payload: { event: "Appointment Cancelled", id, reason },
      timestamp: new Date().toISOString(),
    });

    return cancelled;
  }

  async completeAppointment(id: string): Promise<AppointmentEntity> {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status: "COMPLETED", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseAppointmentRepository] completeAppointment(${id}) error:`, error.message);
      throw new Error(`Database error completing appointment ${id}: ${error.message}`);
    }

    const completed = this.mapRowToEntity(data);

    await this.appendActivityEvent({
      appointmentId: completed.id,
      eventType: "Completed",
      title: "Appointment Completed",
      description: `Meeting "${completed.title}" concluded successfully.`,
    });

    if (completed.contactId) {
      try {
        await supabaseContactRepository.appendTimelineEvent({
          contactId: completed.contactId,
          eventType: "Appointment",
          title: `Meeting Finished: ${completed.title}`,
          description: `Meeting completed by ${completed.assignedTo}.`,
        });
      } catch (err) {
        console.warn("[SupabaseAppointmentRepository] Timeline complete warning:", err);
      }
    }

    platformAuditLogger.log({
      action: "CHANGE_STATUS",
      entityType: "SYSTEM",
      entityIds: [id],
      payload: { event: "Appointment Completed", id },
      timestamp: new Date().toISOString(),
    });

    return completed;
  }

  async searchAppointments(query: string): Promise<AppointmentEntity[]> {
    return this.getAppointments({ search: query });
  }

  async filterAppointments(filters: Partial<AppointmentFilterState>): Promise<AppointmentEntity[]> {
    return this.getAppointments(filters);
  }

  async getAppointmentActivity(appointmentId: string): Promise<AppointmentActivityEntity[]> {
    const { data, error } = await supabase
      .from("appointment_activity")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`[SupabaseAppointmentRepository] getAppointmentActivity(${appointmentId}) error:`, error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: String(row.id),
      appointmentId: String(row.appointment_id),
      eventType: String(row.event_type),
      title: String(row.title),
      description: row.description ? String(row.description) : undefined,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: String(row.created_at),
    }));
  }

  async getAppointmentAttendees(appointmentId: string): Promise<AppointmentAttendee[]> {
    const { data, error } = await supabase
      .from("appointment_attendees")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(`[SupabaseAppointmentRepository] getAppointmentAttendees(${appointmentId}) error:`, error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: String(row.id),
      appointmentId: String(row.appointment_id),
      name: String(row.name),
      email: String(row.email),
      role: row.role as "ORGANIZER" | "ATTENDEE" | "GUEST",
      status: row.status as "ACCEPTED" | "DECLINED" | "TENTATIVE",
      createdAt: String(row.created_at),
    }));
  }

  async getAppointmentReminders(appointmentId: string): Promise<AppointmentReminder[]> {
    const { data, error } = await supabase
      .from("appointment_reminders")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error(`[SupabaseAppointmentRepository] getAppointmentReminders(${appointmentId}) error:`, error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: String(row.id),
      appointmentId: String(row.appointment_id),
      channel: row.channel as "EMAIL" | "SMS" | "WHATSAPP" | "PUSH",
      scheduledAt: String(row.scheduled_at),
      sentAt: row.sent_at ? String(row.sent_at) : undefined,
      status: row.status as "PENDING" | "SENT" | "FAILED" | "CANCELLED",
      createdAt: String(row.created_at),
    }));
  }

  async scheduleReminder(
    appointmentId: string,
    channel: "EMAIL" | "SMS" | "WHATSAPP" | "PUSH",
    scheduledAt: string
  ): Promise<AppointmentReminder> {
    const { data, error } = await supabase
      .from("appointment_reminders")
      .insert([
        {
          appointment_id: appointmentId,
          channel,
          scheduled_at: scheduledAt,
          status: "PENDING",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseAppointmentRepository] scheduleReminder error:`, error.message);
      throw new Error(`Database error scheduling reminder: ${error.message}`);
    }

    const reminder: AppointmentReminder = {
      id: String(data.id),
      appointmentId: String(data.appointment_id),
      channel: data.channel as "EMAIL" | "SMS" | "WHATSAPP" | "PUSH",
      scheduledAt: String(data.scheduled_at),
      sentAt: data.sent_at ? String(data.sent_at) : undefined,
      status: data.status as "PENDING" | "SENT" | "FAILED" | "CANCELLED",
      createdAt: String(data.created_at),
    };

    await this.appendActivityEvent({
      appointmentId,
      eventType: "Reminder Scheduled",
      title: "Reminder Notification Scheduled",
      description: `${channel} reminder queued for ${new Date(scheduledAt).toLocaleString()}.`,
    });

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [appointmentId],
      payload: { event: "Reminder Scheduled", channel, scheduledAt },
      timestamp: new Date().toISOString(),
    });

    return reminder;
  }

  private async appendActivityEvent(event: {
    appointmentId: string;
    eventType: string;
    title: string;
    description?: string;
  }): Promise<void> {
    try {
      await supabase.from("appointment_activity").insert([
        {
          appointment_id: event.appointmentId,
          event_type: event.eventType,
          title: event.title,
          description: event.description || "",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.warn("[SupabaseAppointmentRepository] Activity append exception:", err);
    }
  }

  private mapRowToEntity(row: Record<string, unknown>): AppointmentEntity {
    return {
      id: String(row.id),
      title: String(row.title || ""),
      description: row.description ? String(row.description) : undefined,
      location: String(row.location || "Online Video Link"),
      meetingType: (row.meeting_type as MeetingType) || "VIDEO",
      status: (row.status as AppointmentStatus) || "SCHEDULED",
      startTime: String(row.start_time || new Date().toISOString()),
      endTime: String(row.end_time || new Date().toISOString()),
      timezone: String(row.timezone || "UTC"),
      contactId: row.contact_id ? String(row.contact_id) : undefined,
      leadId: row.lead_id ? String(row.lead_id) : undefined,
      dealId: row.deal_id ? String(row.deal_id) : undefined,
      taskId: row.task_id ? String(row.task_id) : undefined,
      createdBy: String(row.created_by || "System Admin"),
      assignedTo: String(row.assigned_to || "Alex Morgan"),
      meetingLink: row.meeting_link ? String(row.meeting_link) : undefined,
      notes: row.notes ? String(row.notes) : undefined,
      createdAt: String(row.created_at || new Date().toISOString()),
      updatedAt: String(row.updated_at || new Date().toISOString()),
    };
  }

  private applyFilters(
    appointments: AppointmentEntity[],
    filters?: Partial<AppointmentFilterState>
  ): AppointmentEntity[] {
    if (!filters) return appointments;
    return appointments.filter((app) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = app.title.toLowerCase().includes(q);
        const matchesDesc = (app.description || "").toLowerCase().includes(q);
        const matchesLoc = app.location.toLowerCase().includes(q);
        const matchesAssignee = app.assignedTo.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesAssignee) return false;
      }
      if (filters.status && app.status !== filters.status) return false;
      if (filters.meetingType && app.meetingType !== filters.meetingType) return false;
      if (filters.assignedTo && app.assignedTo !== filters.assignedTo) return false;
      if (filters.startDate && new Date(app.startTime) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(app.endTime) > new Date(filters.endDate)) return false;
      return true;
    });
  }
}

export const supabaseAppointmentRepository = new SupabaseAppointmentRepository();
