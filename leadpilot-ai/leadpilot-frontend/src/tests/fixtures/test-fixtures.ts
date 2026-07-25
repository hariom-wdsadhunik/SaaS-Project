import { ContactEntity } from "@/domain/contact/types";
import { TaskEntity } from "@/domain/task/types";

export const mockContactFixture: ContactEntity = {
  id: "cnt-999",
  fullName: "Test User",
  designation: "Software Engineer",
  companyName: "Acme Corp",
  email: "test.user@acme.com",
  phone: "+1 555 0199",
  status: "ACTIVE",
  tags: ["TestTag"],
  assignedAgentName: "Alex Morgan",
  lastActivity: "2026-07-25T10:00:00Z",
  createdAt: "2026-07-25T10:00:00Z",
};

export const mockTaskFixture: TaskEntity = {
  id: "tsk-999",
  title: "Test Task Title",
  description: "Test description for unit testing.",
  status: "TODO",
  priority: "HIGH",
  category: "FOLLOW_UP",
  dueDate: "2026-07-26T12:00:00Z",
  assignedAgentName: "Alex Morgan",
  createdAt: "2026-07-25T10:00:00Z",
  updatedAt: "2026-07-25T10:00:00Z",
};
