import { GET as getCommunications } from "@/app/api/v1/communications/route";
import { GET as getMessages } from "@/app/api/v1/messages/route";
import { GET as getTemplates } from "@/app/api/v1/templates/route";
import { GET as getNotifications } from "@/app/api/v1/notifications/route";

describe("API v1 Versioned Endpoints Unit Tests", () => {
  test("GET /api/v1/communications returns v1 versioned conversation response", async () => {
    const req = new Request("http://localhost:3000/api/v1/communications?id=a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d");
    const res = await getCommunications(req);
    const body = await res.json();

    expect(body.version).toBe("v1");
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
  });

  test("GET /api/v1/messages returns versioned message list", async () => {
    const req = new Request("http://localhost:3000/api/v1/messages?q=Walkthrough");
    const res = await getMessages(req);
    const body = await res.json();

    expect(body.version).toBe("v1");
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("GET /api/v1/templates returns message templates", async () => {
    const res = await getTemplates();
    const body = await res.json();

    expect(body.version).toBe("v1");
    expect(body.success).toBe(true);
    expect(body.count).toBeGreaterThan(0);
  });

  test("GET /api/v1/notifications returns user notifications", async () => {
    const req = new Request("http://localhost:3000/api/v1/notifications?userId=agent-001");
    const res = await getNotifications(req);
    const body = await res.json();

    expect(body.version).toBe("v1");
    expect(body.success).toBe(true);
  });
});
