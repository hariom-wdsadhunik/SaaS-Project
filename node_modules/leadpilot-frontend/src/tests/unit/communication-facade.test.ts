import { CommunicationFacade } from "@/domain/communication/CommunicationFacade";

describe("Communication Facade Unit Tests", () => {
  test("CommunicationFacade validates email address", () => {
    expect(CommunicationFacade.validateRecipient("EMAIL", "test@brokerage.com")).toBe(true);
    expect(CommunicationFacade.validateRecipient("EMAIL", "invalid-email")).toBe(false);
  });

  test("CommunicationFacade validates WhatsApp phone number", () => {
    expect(CommunicationFacade.validateRecipient("WHATSAPP", "+14155552671")).toBe(true);
  });
});
