import { redirect } from "next/navigation";

// Üye alanı /panel'e taşındı — eski bağlantıları yönlendir.
export default function ProgramlarimRedirect() {
  redirect("/panel/programlarim");
}
