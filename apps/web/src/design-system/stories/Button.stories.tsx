import React from "react";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Design System/Button",
  component: Button,
};

export default meta;

export const Default = () => <Button variant="default">Primary Button</Button>;
export const Outline = () => <Button variant="outline">Outline Button</Button>;
export const Danger = () => <Button variant="danger">Danger Action</Button>;
export const Loading = () => <Button isLoading>Processing...</Button>;
