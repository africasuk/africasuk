"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type {
  ExchangeRate,
} from "@africasuk/types";

import { updateExchangeRate } from "@/actions/exchange-rates";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  currentRate: ExchangeRate | null;
}

export function ExchangeRateForm({
  currentRate,
}: Props) {
  const router =
    useRouter();

  const [pending, startTransition] =
    useTransition();

  const [rate, setRate] =
    useState(
      currentRate?.rate.toString() ??
        "",
    );

  const [notes, setNotes] =
    useState("");

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const value =
      Number(rate);

    if (
      Number.isNaN(value) ||
      value <= 0
    ) {
      alert(
        "Enter a valid exchange rate.",
      );

      return;
    }

    startTransition(
      async () => {
        await updateExchangeRate(
          value,
          notes,
        );

        router.refresh();
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Update Exchange Rate
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label>
              USD → SSP Rate
            </Label>

            <Input
              type="number"
              min="1"
              step="0.01"
              value={rate}
              onChange={(e) =>
                setRate(
                  e.target.value,
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              Notes
            </Label>

            <Textarea
              rows={3}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value,
                )
              }
              placeholder="Optional"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
          >
            {pending
              ? "Saving..."
              : "Update Rate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}