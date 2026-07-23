import { cookies } from "next/headers";
import { defaultLocale, getDictionary, type Locale } from "@africasuk/i18n";
import { createClient } from "@/lib/auth/server";

import TopBar from "./TopBar";
import MainHeader from "./MainHeader";

export default async function Header() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) ?? defaultLocale;
  const dictionary = getDictionary(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="sticky top-0 z-50 w-full bg-white">
      {/* Keeping TopBar simplified and lightweight */}
      <TopBar />

      {/* Passing the strictly typed auth and translation context down */}
      <MainHeader user={user} dictionary={dictionary} />
    </div>
  );
}