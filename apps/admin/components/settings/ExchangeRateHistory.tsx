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
  history: ExchangeRate[];
}

export function ExchangeRateHistory({
  history,
}: Props) {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Exchange Rate History
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3">
                Date
              </th>

              <th className="pb-3">
                Pair
              </th>

              <th className="pb-3">
                Rate
              </th>

              <th className="pb-3">
                Notes
              </th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-muted-foreground"
                >
                  No exchange rates found.
                </td>
              </tr>
            ) : (
              history.map((rate) => {
                const effectiveDate =
                  rate.effectiveDate
                    ? new Date(
                        rate.effectiveDate,
                      )
                    : null;

                return (
                  <tr
                    key={rate.id}
                    className="border-b last:border-0"
                  >
                    <td className="py-4">
                      {effectiveDate &&
                      isValid(
                        effectiveDate,
                      )
                        ? format(
                            effectiveDate,
                            "dd MMM yyyy",
                          )
                        : "Not available"}
                    </td>

                    <td className="py-4">
                      {rate.baseCurrency} →{" "}
                      {rate.targetCurrency}
                    </td>

                    <td className="py-4 font-medium">
                      {rate.rate.toLocaleString()}
                    </td>

                    <td className="py-4">
                      {rate.notes ??
                        "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}