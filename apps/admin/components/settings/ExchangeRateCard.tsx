import type {
  ExchangeRate,
} from "@africasuk/types";

import {
  format,
  isValid,
} from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  rate: ExchangeRate | null;
}

export function ExchangeRateCard({
  rate,
}: Props) {
  const effectiveDate =
    rate?.effectiveDate
      ? new Date(rate.effectiveDate)
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Current Exchange Rate
        </CardTitle>
      </CardHeader>

      <CardContent>
        {rate ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Currency Pair
              </p>

              <p className="text-xl font-semibold">
                {rate.baseCurrency} →{" "}
                {rate.targetCurrency}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Current Rate
              </p>

              <p className="text-4xl font-bold">
                {rate.rate.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Effective Date
              </p>

              <p>
                {effectiveDate &&
                isValid(effectiveDate)
                  ? format(
                      effectiveDate,
                      "dd MMM yyyy",
                    )
                  : "Not available"}
              </p>
            </div>

            {rate.notes && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Notes
                </p>

                <p>{rate.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No exchange rate found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}