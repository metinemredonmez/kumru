import { redirect } from "next/navigation";

// Üye alanı /panel'e taşındı — eski program bağlantılarını yönlendir.
export default async function ProgramSlugRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/panel/programlarim/${slug}`);
}
