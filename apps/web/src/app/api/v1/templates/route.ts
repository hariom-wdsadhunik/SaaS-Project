import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const templates = [
    {
      id: "tmpl-101",
      name: "VIP Property Viewing Reminder",
      category: "APPOINTMENT_REMINDER",
      channel: "WHATSAPP",
      bodyTemplate: "Hi {{contact_name}}, confirming your walkthrough for {{property_name}} on {{start_time}}.",
      variables: ["contact_name", "property_name", "start_time"],
    },
    {
      id: "tmpl-102",
      name: "Conveyancing Closing Follow-up",
      category: "CLOSING",
      channel: "EMAIL",
      subjectTemplate: "Closing Documents for {{property_name}}",
      bodyTemplate: "Dear {{contact_name}}, please review the attached contract agreement.",
      variables: ["contact_name", "property_name"],
    },
  ];

  return NextResponse.json({ version: "v1", success: true, count: templates.length, data: templates });
}
