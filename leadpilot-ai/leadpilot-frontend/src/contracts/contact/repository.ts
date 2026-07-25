import { ContactEntity, ContactFilterState } from "@/domain/contact/types";
import { ContactFormInput } from "@/lib/validations/contact-form";

export interface ContactRepository {
  getContacts(filters?: Partial<ContactFilterState>): Promise<ContactEntity[]>;
  getContactById(id: string): Promise<ContactEntity | null>;
  createContact(input: ContactFormInput): Promise<ContactEntity>;
  updateContact(id: string, input: ContactFormInput): Promise<ContactEntity>;
  deleteContacts(ids: string[]): Promise<boolean>;
}
