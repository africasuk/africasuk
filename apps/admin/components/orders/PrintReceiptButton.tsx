"use client";

import { Printer } from "lucide-react";

export default function PrintReceiptButton() {
  const handlePrint = () => {
    const receipt = document.getElementById(
      "africasuk-receipt",
    );

    if (!receipt) {
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=400,height=800",
    );

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AfricaSuk Receipt</title>

          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              width: 80mm;
              background: #fff;
              color: #000;
              font-family: Arial, Helvetica, sans-serif;
            }

            body {
              font-size: 11px;
            }

            .receipt-inner {
              width: 72mm;
              margin: 0 auto;
              padding: 4mm 0;
            }

            .receipt-logo {
              display: block;
              width: 32mm;
              height: auto;
              margin: 0 auto 3mm;
            }

            .receipt-title {
              text-align: center;
              font-size: 14px;
              font-weight: 700;
              margin-bottom: 3mm;
            }

            .receipt-divider {
              border-top: 1px dashed #000;
              margin: 3mm 0;
            }

            .receipt-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 4mm;
              margin: 1.5mm 0;
              line-height: 1.35;
            }

            .receipt-section-title {
              font-size: 11px;
              font-weight: 700;
              margin-bottom: 1.5mm;
            }

            .receipt-item {
              margin-bottom: 3mm;
            }

            .receipt-item-name {
              font-weight: 700;
              line-height: 1.35;
            }

            .receipt-item-meta {
              font-size: 10px;
              margin-top: 0.5mm;
            }

            .receipt-total {
              display: flex;
              justify-content: space-between;
              gap: 4mm;
              font-size: 14px;
              font-weight: 700;
              margin: 2mm 0;
            }

            .receipt-qr {
              text-align: center;
              margin-top: 5mm;
            }

            .receipt-qr-image {
              display: block;
              width: 30mm;
              height: 30mm;
              margin: 0 auto 2mm;
            }

            .receipt-footer {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              gap: 1mm;
              font-size: 10px;
              line-height: 1.3;
            }

            @media print {
              html,
              body {
                width: 80mm;
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>

        <body>
          ${receipt.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    const images =
      printWindow.document.images;

    const waitForImages = Array.from(
      images,
    ).map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.onload = () => resolve();
          image.onerror = () => resolve();
        }),
    );

    Promise.all(waitForImages).then(() => {
      printWindow.focus();
      printWindow.print();
    });
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
    >
      <Printer className="h-4 w-4" />
      Print Receipt
    </button>
  );
}