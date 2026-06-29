import { redirect } from "next/navigation";

export default function TemplateGalleryRedirect() {
  redirect("/dashboard/admin/templates");
}