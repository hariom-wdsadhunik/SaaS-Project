import React from "react";
import { EntityStatusBadge } from "@/platform/ui/entity-status-badge";

const meta = {
  title: "Design System/EntityStatusBadge",
  component: EntityStatusBadge,
};

export default meta;

export const Active = () => <EntityStatusBadge status="ACTIVE" />;
export const Completed = () => <EntityStatusBadge status="COMPLETED" />;
export const Pending = () => <EntityStatusBadge status="PENDING" />;
export const Closed = () => <EntityStatusBadge status="CLOSED" />;
