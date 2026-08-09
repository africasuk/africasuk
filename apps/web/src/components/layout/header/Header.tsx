import {
  defaultLocale,
  getDictionary,
  type Locale,
} from "@africasuk/i18n";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import TopBar from "./TopBar";
import MainHeader from "./MainHeader";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();

  const locale =
    (cookieStore.get("locale")?.value as Locale) ??
    defaultLocale;

  const dictionary = getDictionary(locale);

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <TopBar />

      <MainHeader
        user={user}
        dictionary={dictionary}
      />
    </>
  );
}