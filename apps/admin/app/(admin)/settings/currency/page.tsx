import {
  getCurrentExchangeRate,
  getExchangeRateHistory,
} from "@/actions/exchange-rates";


import { ExchangeRateCard } from "@/components/settings/ExchangeRateCard";
import { ExchangeRateForm } from "@/components/settings/ExchangeRateForm";
import { ExchangeRateHistory } from "@/components/settings/ExchangeRateHistory";
import PageHeader from "@/components/shared/PageHeader";

export default async function CurrencySettingsPage() {
  const [currentRate, history] =
    await Promise.all([
      getCurrentExchangeRate(),
      getExchangeRateHistory(),
    ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Currency Settings"
        description="Manage the daily USD to SSP exchange rate."
      />

      <ExchangeRateCard
        rate={currentRate}
      />

      <ExchangeRateForm
        currentRate={currentRate}
      />

      <ExchangeRateHistory
        history={history}
      />
    </div>
  );
}