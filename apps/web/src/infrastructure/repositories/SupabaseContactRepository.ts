import { ContactRepository } from "@/contracts/contact/repository";
import { ContactEntity, ContactFilterState, ContactStatus, ContactTimelineEvent } from "@/domain/contact/types";
import { ContactFormInput } from "@/lib/validations/contact-form";
import { supabase } from "@/lib/supabase/client";
import { platformAuditLogger } from "@/platform/audit";
import { supabaseLeadRepository } from "@/services/supabase-lead-repository";

export class SupabaseContactRepository implements ContactRepository {
  async getContacts(filters?: Partial<ContactFilterState>): Promise<ContactEntity[]> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[SupabaseContactRepository] getContacts error:", error.message);
      throw new Error(`Database error fetching contacts: ${error.message}`);
    }

    const mapped: ContactEntity[] = (data || []).map((item) => this.mapRowToEntity(item));

    return this.applyFilters(mapped, filters);
  }

  async getContactById(id: string): Promise<ContactEntity | null> {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`[SupabaseContactRepository] getContactById(${id}) error:`, error.message);
      throw new Error(`Database error fetching contact ${id}: ${error.message}`);
    }

    if (!data) return null;
    return this.mapRowToEntity(data);
  }

  async createContact(input: ContactFormInput): Promise<ContactEntity> {
    const fullName = `${input.firstName} ${input.lastName}`;
    const tagsArray = input.tags
      ? input.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Buyer"];

    const newRecord = {
      full_name: fullName,
      email: input.email || "",
      phone: input.phone || "",
      company: input.companyName || "",
      job_title: input.designation || "",
      status: input.status || "ACTIVE",
      tags: JSON.stringify(tagsArray),
      notes: input.notes || "",
      is_favorite: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("contacts")
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      console.error("[SupabaseContactRepository] createContact error:", error.message);
      throw new Error(`Database error creating contact: ${error.message}`);
    }

    const created = this.mapRowToEntity(data);

    // Initial timeline entry
    await this.appendTimelineEvent({
      contactId: created.id,
      eventType: "Contact Created",
      title: "Contact Profile Created",
      description: `Created contact profile for ${fullName}.`,
    });

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "CONTACT",
      entityIds: [created.id],
      payload: { event: "Contact Created", fullName, email: created.email },
      timestamp: new Date().toISOString(),
    });

    return created;
  }

  async updateContact(id: string, input: ContactFormInput): Promise<ContactEntity> {
    const fullName = `${input.firstName} ${input.lastName}`;
    const tagsArray = input.tags
      ? input.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Buyer"];

    const { data, error } = await supabase
      .from("contacts")
      .update({
        full_name: fullName,
        email: input.email || "",
        phone: input.phone || "",
        company: input.companyName || "",
        job_title: input.designation || "",
        status: input.status,
        tags: JSON.stringify(tagsArray),
        notes: input.notes || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseContactRepository] updateContact(${id}) error:`, error.message);
      throw new Error(`Database error updating contact ${id}: ${error.message}`);
    }

    const updated = this.mapRowToEntity(data);

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "CONTACT",
      entityIds: [id],
      payload: { event: "Contact Updated", fullName },
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async deleteContact(id: string): Promise<boolean> {
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) {
      console.error(`[SupabaseContactRepository] deleteContact(${id}) error:`, error.message);
      throw new Error(`Database error deleting contact ${id}: ${error.message}`);
    }

    platformAuditLogger.log({
      action: "DELETE",
      entityType: "CONTACT",
      entityIds: [id],
      payload: { event: "Contact Deleted", contactId: id },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  async deleteContacts(ids: string[]): Promise<boolean> {
    const { error } = await supabase.from("contacts").delete().in("id", ids);

    if (error) {
      console.error("[SupabaseContactRepository] deleteContacts error:", error.message);
      throw new Error(`Database error deleting contacts: ${error.message}`);
    }

    platformAuditLogger.log({
      action: "DELETE",
      entityType: "CONTACT",
      entityIds: ids,
      payload: { event: "Contacts Bulk Deleted", count: ids.length },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  async searchContacts(query: string): Promise<ContactEntity[]> {
    return this.getContacts({ search: query });
  }

  async favoriteContact(id: string, isFavorite: boolean): Promise<ContactEntity> {
    const { data, error } = await supabase
      .from("contacts")
      .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseContactRepository] favoriteContact(${id}) error:`, error.message);
      throw new Error(`Database error updating favorite status: ${error.message}`);
    }

    const updated = this.mapRowToEntity(data);

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "CONTACT",
      entityIds: [id],
      payload: { event: "Favorite Changed", contactId: id, isFavorite },
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async archiveContact(id: string): Promise<ContactEntity> {
    const { data, error } = await supabase
      .from("contacts")
      .update({ status: "ARCHIVED", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseContactRepository] archiveContact(${id}) error:`, error.message);
      throw new Error(`Database error archiving contact: ${error.message}`);
    }

    const updated = this.mapRowToEntity(data);

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "CONTACT",
      entityIds: [id],
      payload: { event: "Contact Archived", contactId: id },
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async convertLeadToContact(leadId: string): Promise<{ contact: ContactEntity; lead: unknown }> {
    const lead = await supabaseLeadRepository.getLeadById(leadId);
    if (!lead) {
      throw new Error(`Lead with ID ${leadId} not found`);
    }

    // Create contact record preserving lead details
    const newContactRecord = {
      lead_id: lead.id,
      full_name: lead.fullName,
      email: lead.email || "",
      phone: lead.phone || "",
      company: "Independent Client",
      job_title: "Qualified Client",
      avatar_url: lead.avatarUrl,
      status: "VIP",
      tags: JSON.stringify(["Converted Lead", "VIP", "Buyer"]),
      notes: `Converted from lead ${lead.id} (${lead.source}). AI Propensity Score: ${lead.aiPropensityScore}.`,
      is_favorite: true,
      created_at: new Date().toISOString(),
    };

    const { data: contactData, error: contactError } = await supabase
      .from("contacts")
      .insert([newContactRecord])
      .select()
      .single();

    if (contactError) {
      console.error("[SupabaseContactRepository] convertLeadToContact insert error:", contactError.message);
      throw new Error(`Database error converting lead to contact: ${contactError.message}`);
    }

    const createdContact = this.mapRowToEntity(contactData);

    // Update lead status to 'QUALIFIED' and retain in database (Do NOT delete lead)
    const updatedLead = await supabaseLeadRepository.changeStatus(leadId, "QUALIFIED");

    // Append timeline entries: Lead Created & Lead Converted
    await this.appendTimelineEvent({
      contactId: createdContact.id,
      eventType: "Lead Created",
      title: "Initial Lead Inquiry Captured",
      description: `Lead originally captured via ${lead.source} on ${new Date(lead.createdAt).toLocaleDateString()}.`,
    });

    await this.appendTimelineEvent({
      contactId: createdContact.id,
      eventType: "Lead Converted",
      title: "Lead Converted to Primary CRM Contact",
      description: `Lead ${lead.id} successfully converted to Contact profile with VIP status.`,
    });

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "CONTACT",
      entityIds: [createdContact.id],
      payload: { event: "Lead Converted", leadId: lead.id, contactId: createdContact.id },
      timestamp: new Date().toISOString(),
    });

    return { contact: createdContact, lead: updatedLead };
  }

  async getTimelineEvents(contactId: string): Promise<ContactTimelineEvent[]> {
    const { data, error } = await supabase
      .from("contact_timeline")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`[SupabaseContactRepository] getTimelineEvents(${contactId}) error:`, error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: String(row.id),
      contactId: String(row.contact_id),
      eventType: String(row.event_type),
      title: String(row.title),
      description: row.description ? String(row.description) : undefined,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: String(row.created_at),
    }));
  }

  async appendTimelineEvent(event: Omit<ContactTimelineEvent, "id" | "createdAt">): Promise<ContactTimelineEvent> {
    const { data, error } = await supabase
      .from("contact_timeline")
      .insert([
        {
          contact_id: event.contactId,
          event_type: event.eventType,
          title: event.title,
          description: event.description || "",
          metadata: event.metadata || {},
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[SupabaseContactRepository] appendTimelineEvent error:", error.message);
      throw new Error(`Database error appending timeline event: ${error.message}`);
    }

    return {
      id: String(data.id),
      contactId: String(data.contact_id),
      eventType: String(data.event_type),
      title: String(data.title),
      description: data.description ? String(data.description) : undefined,
      metadata: (data.metadata as Record<string, unknown>) || {},
      createdAt: String(data.created_at),
    };
  }

  private mapRowToEntity(row: Record<string, unknown>): ContactEntity {
    let parsedTags: string[] = [];
    const tagsVal = row.tags;
    if (Array.isArray(tagsVal)) {
      parsedTags = tagsVal as string[];
    } else if (typeof tagsVal === "string") {
      try {
        parsedTags = JSON.parse(tagsVal);
      } catch {
        parsedTags = [tagsVal];
      }
    }

    return {
      id: String(row.id),
      leadId: row.lead_id ? String(row.lead_id) : null,
      fullName: String(row.full_name || ""),
      avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
      jobTitle: String(row.job_title || ""),
      designation: String(row.job_title || ""),
      company: String(row.company || ""),
      companyName: String(row.company || ""),
      email: String(row.email || ""),
      phone: String(row.phone || ""),
      address: String(row.address || ""),
      city: String(row.city || ""),
      state: String(row.state || ""),
      country: String(row.country || ""),
      status: (row.status as ContactStatus) || "ACTIVE",
      isFavorite: !!row.is_favorite,
      tags: parsedTags,
      notes: String(row.notes || ""),
      assignedAgentName: "Alex Morgan",
      agentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      lastActivity: String(row.updated_at || row.created_at),
      createdAt: String(row.created_at || new Date().toISOString()),
      updatedAt: String(row.updated_at || new Date().toISOString()),
    };
  }

  private applyFilters(contacts: ContactEntity[], filters?: Partial<ContactFilterState>): ContactEntity[] {
    if (!filters) return contacts;
    return contacts.filter((contact) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = contact.fullName.toLowerCase().includes(q);
        const matchesEmail = contact.email.toLowerCase().includes(q);
        const matchesPhone = contact.phone.toLowerCase().includes(q);
        const matchesCompany = contact.company.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCompany) return false;
      }
      if (filters.status && contact.status !== filters.status) return false;
      if (filters.company && contact.company !== filters.company) return false;
      if (filters.assignedAgent && contact.assignedAgentName !== filters.assignedAgent) return false;
      if (filters.tag && !contact.tags.includes(filters.tag)) return false;
      if (filters.isFavorite !== undefined && contact.isFavorite !== filters.isFavorite) return false;
      return true;
    });
  }
}

export const supabaseContactRepository = new SupabaseContactRepository();
