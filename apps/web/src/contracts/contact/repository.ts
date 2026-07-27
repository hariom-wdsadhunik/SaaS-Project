import { ContactEntity, ContactFilterState, ContactTimelineEvent } from "@/domain/contact/types";
import { ContactFormInput } from "@/lib/validations/contact-form";

export interface ContactRepository {
  getContacts(filters?: Partial<ContactFilterState>): Promise<ContactEntity[]>;
  getContactById(id: string): Promise<ContactEntity | null>;
  createContact(input: ContactFormInput): Promise<ContactEntity>;
  updateContact(id: string, input: ContactFormInput): Promise<ContactEntity>;
  deleteContact(id: string): Promise<boolean>;
  deleteContacts(ids: string[]): Promise<boolean>;
  searchContacts(query: string): Promise<ContactEntity[]>;
  favoriteContact(id: string, isFavorite: boolean): Promise<ContactEntity>;
  archiveContact(id: string): Promise<ContactEntity>;
  convertLeadToContact(leadId: string): Promise<{ contact: ContactEntity; lead: unknown }>;
  getTimelineEvents(contactId: string): Promise<ContactTimelineEvent[]>;
  appendTimelineEvent(event: Omit<ContactTimelineEvent, "id" | "createdAt">): Promise<ContactTimelineEvent>;
}
