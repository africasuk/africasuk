"use server";

import {
  ExchangeRateRepository,
} from "@africasuk/database";

import {
  ExchangeRateService,
} from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentExchangeRate() {
  const supabase =
    await createServerSupabaseClient();

  const service =
    new ExchangeRateService(
      new ExchangeRateRepository(
        supabase,
      ),
    );

  return service.getCurrent();
}

export async function getExchangeRateHistory() {
  const supabase =
    await createServerSupabaseClient();

  const service =
    new ExchangeRateService(
      new ExchangeRateRepository(
        supabase,
      ),
    );

  return service.getHistory();
}

export async function updateExchangeRate(
  rate: number,
  notes?: string,
) {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Unauthorized."
    );
  }

  const service =
    new ExchangeRateService(
      new ExchangeRateRepository(
        supabase,
      ),
    );

  return service.updateRate(
    {
      rate,
      notes,
    },
    user.id,
  );
}