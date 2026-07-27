import { AITool } from "./Tool";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";
import { supabaseAppointmentRepository } from "@/infrastructure/repositories/SupabaseAppointmentRepository";

export class AppointmentTool implements AITool {
  name(): string {
    return "appointment_intelligence_tool";
  }

  description(): string {
    return "Analyzes calendar appointments including today's meetings, upcoming schedules, meeting history, linked contacts, leads, deals, tasks, and attendee responses.";
  }

  category(): string {
    return "Calendar";
  }

  requiredPermission(): ToolPermissionLevel {
    return "READ";
  }

  validate(params: Record<string, unknown>): boolean {
    return (
      typeof params.appointmentId === "string" ||
      params.filter === "today" ||
      params.filter === "upcoming" ||
      !params.appointmentId
    );
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const appointmentId = params.appointmentId as string | undefined;

    if (appointmentId) {
      const app = await supabaseAppointmentRepository.getAppointmentById(appointmentId);
      if (!app) {
        return {
          toolName: this.name(),
          success: false,
          data: { error: `Appointment record with ID ${appointmentId} not found.` },
          timestamp: new Date().toISOString(),
        };
      }

      const attendees = await supabaseAppointmentRepository.getAppointmentAttendees(appointmentId);
      const activity = await supabaseAppointmentRepository.getAppointmentActivity(appointmentId);
      const reminders = await supabaseAppointmentRepository.getAppointmentReminders(appointmentId);

      return {
        toolName: this.name(),
        success: true,
        data: {
          appointmentId: app.id,
          title: app.title,
          description: app.description,
          location: app.location,
          meetingType: app.meetingType,
          status: app.status,
          startTime: app.startTime,
          endTime: app.endTime,
          assignedTo: app.assignedTo,
          linkedContact: app.contactId || "None",
          linkedLead: app.leadId || "None",
          linkedDeal: app.dealId || "None",
          linkedTask: app.taskId || "None",
          attendeeCount: attendees.length,
          attendees,
          reminderCount: reminders.length,
          activityCount: activity.length,
          recentActivity: activity.slice(0, 5),
        },
        timestamp: new Date().toISOString(),
      };
    }

    const allApps = await supabaseAppointmentRepository.getAppointments();
    const now = new Date();

    const todayMeetings = allApps.filter((a) => {
      const d = new Date(a.startTime);
      return d.toDateString() === now.toDateString() && a.status !== "CANCELLED";
    });

    const upcomingMeetings = allApps.filter((a) => {
      const d = new Date(a.startTime);
      return d > now && a.status !== "CANCELLED" && a.status !== "COMPLETED";
    });

    return {
      toolName: this.name(),
      success: true,
      data: {
        totalAppointments: allApps.length,
        todayCount: todayMeetings.length,
        upcomingCount: upcomingMeetings.length,
        todayMeetingsSummary: todayMeetings.map((a) => ({
          id: a.id,
          title: a.title,
          start: a.startTime,
          status: a.status,
          type: a.meetingType,
        })),
        upcomingMeetingsSummary: upcomingMeetings.slice(0, 5).map((a) => ({
          id: a.id,
          title: a.title,
          start: a.startTime,
          status: a.status,
          type: a.meetingType,
        })),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
