import { redirect } from "next/navigation";

export default function AiStatusPage() {
  redirect("/dashboard/admin/ai-settings");
}