
"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  Bell,
  Package,
  Megaphone,
  Gift,
  MessageSquareText,
  Send,
  Users,
  Smartphone,
  History,
  Search,
  X,
  Loader2,
  Eye,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  createNotificationCampaign,
  getNotificationCampaigns,
  getNotificationOverview,
  getNotificationProducts,
  sendNotificationCampaign,
} from "@/app/actions/notifications";

type CampaignType =
  | "PRODUCT_PROMOTION"
  | "ANNOUNCEMENT"
  | "SPECIAL_GREETING"
  | "CUSTOM";

interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null;
  url: string;
}

interface Campaign {
  id: string;
  title: string;
  body: string;
  campaign_type: CampaignType;
  status: string;
  created_at: string;
  total_recipients: number;
  successful_deliveries: number;
  failed_deliveries: number;
}

interface Overview {
  totalNotifications: number;
  registeredDevices: number;
  campaignsSent: number;
  eligibleCustomers: number;
}

const campaignTypes = [
  {
    id: "PRODUCT_PROMOTION" as const,
    title: "Product Promotion",
    description: "Promote products directly to interested customers.",
    icon: Package,
  },
  {
    id: "ANNOUNCEMENT" as const,
    title: "Announcement",
    description: "Share marketplace news and important updates.",
    icon: Megaphone,
  },
  {
    id: "SPECIAL_GREETING" as const,
    title: "Special Greetings",
    description: "Send greetings for holidays and special occasions.",
    icon: Gift,
  },
  {
    id: "CUSTOM" as const,
    title: "Custom Notification",
    description: "Create a notification with your own message and link.",
    icon: MessageSquareText,
  },
];

const emptyOverview: Overview = {
  totalNotifications: 0,
  registeredDevices: 0,
  campaignsSent: 0,
  eligibleCustomers: 0,
};

export default function NotificationsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [overview, setOverview] = useState<Overview>(emptyOverview);

  const [selectedType, setSelectedType] =
    useState<CampaignType | null>(null);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [campaignToSend, setCampaignToSend] =
    useState<Campaign | null>(null);

  const [isPending, startTransition] = useTransition();

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId),
    [products, selectedProductId]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
      ),
    [products, productSearch]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productData, campaignData, overviewData] = await Promise.all([
        getNotificationProducts(),
        getNotificationCampaigns(),
        getNotificationOverview(),
      ]);

      setProducts(productData as Product[]);
      setCampaigns(campaignData as Campaign[]);
      setOverview(overviewData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialData() {
      try {
        const [productData, campaignData, overviewData] =
          await Promise.all([
            getNotificationProducts(),
            getNotificationCampaigns(),
            getNotificationOverview(),
          ]);

        if (cancelled) return;

        setProducts(productData as Product[]);
        setCampaigns(campaignData as Campaign[]);
        setOverview(overviewData);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load notifications."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  function resetComposer() {
    setSelectedType(null);
    setSelectedProductId("");
    setProductSearch("");
    setTitle("");
    setBody("");
    setTargetUrl("");
    setImageUrl("");
    setShowPreview(false);
    setError("");
    setSuccess("");
  }

  function handleCampaignType(type: CampaignType) {
    setSelectedType(type);
    setSelectedProductId("");
    setTitle("");
    setBody("");
    setTargetUrl("");
    setImageUrl("");
    setError("");
    setSuccess("");
  }

  async function handleSaveDraft() {
    if (!selectedType) return;

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const result = await createNotificationCampaign({
          title,
          body,
          campaignType: selectedType,
          productId:
            selectedType === "PRODUCT_PROMOTION"
              ? selectedProductId
              : null,
          targetUrl: targetUrl || null,
          imageUrl: imageUrl || null,
        });

        await loadData();
        resetComposer();

        setSuccess(
          `Campaign draft saved successfully. ID: ${result.campaignId}`
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not save campaign."
        );
      }
    });
  }

  async function handleSendCampaign() {
    if (!campaignToSend) return;

    const campaignId = campaignToSend.id;

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const result = await sendNotificationCampaign(campaignId);

        setCampaignToSend(null);

        setSuccess(
          `Campaign processed: ${result.sent} sent, ${result.failed} failed out of ${result.total} customers.`
        );

        await loadData();
      } catch (err) {
        setCampaignToSend(null);

        setError(
          err instanceof Error ? err.message : "Failed to send campaign."
        );

        await loadData();
      }
    });
  }

  const stats = [
    {
      label: "Total Notifications",
      value: overview.totalNotifications,
      description: "Notifications created",
      icon: Bell,
    },
    {
      label: "Registered Devices",
      value: overview.registeredDevices,
      description: "Devices with push tokens",
      icon: Smartphone,
    },
    {
      label: "Campaigns Sent",
      value: overview.campaignsSent,
      description: "Completed campaigns",
      icon: Send,
    },
    {
      label: "Eligible Customers",
      value: overview.eligibleCustomers,
      description: "Marketing opt-in customers",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notification Center"
        description="Manage customer notifications, promotions and marketing campaigns."
      />

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p>{error}</p>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-400">
          {success}
          <button onClick={() => setSuccess("")} aria-label="Dismiss message">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold tabular-nums">
                    {loading ? "—" : stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Campaign types */}
      {!selectedType && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Create a Campaign</h2>
            <p className="text-sm text-muted-foreground">
              Select the type of notification you want to create.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {campaignTypes.map((campaign) => {
              const Icon = campaign.icon;

              return (
                <Card
                  key={campaign.id}
                  className="cursor-pointer transition-colors hover:border-emerald-500"
                  onClick={() => handleCampaignType(campaign.id)}
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{campaign.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {campaign.description}
                      </p>
                      <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Create campaign →
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Composer */}
      {selectedType && (
        <Card>
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {campaignTypes.find((item) => item.id === selectedType)?.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Compose and preview your notification.
                </p>
              </div>

              <Button variant="ghost" size="sm" onClick={resetComposer}>
                <X className="mr-1 h-4 w-4" />
                Close
              </Button>
            </div>

            {/* Product selector */}
            {selectedType === "PRODUCT_PROMOTION" && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Product</label>

                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    placeholder="Search products..."
                    className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:border-emerald-600"
                  />
                </div>

                <select
                  value={selectedProductId}
                  onChange={(event) => setSelectedProductId(event.target.value)}
                  className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">Choose a product</option>
                  {filteredProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                {selectedProduct && (
                  <div className="flex items-center gap-4 rounded-lg border p-3">
                    {selectedProduct.imageUrl ? (
                      <div
                        role="img"
                        aria-label={selectedProduct.name}
                        className="h-16 w-16 shrink-0 rounded-md border bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url("${selectedProduct.imageUrl.replace(/["\\]/g, "")}")`,
                        }}
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {selectedProduct.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedProduct.price !== null
                          ? `Starting price: $${selectedProduct.price.toLocaleString()}`
                          : "Price unavailable"}
                      </p>
                      <a
                        href={selectedProduct.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400"
                      >
                        View product page
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Message fields */}
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="notification-title"
              >
                Notification Title
              </label>
              <input
                id="notification-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                placeholder="Enter notification title"
                className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-600"
              />
              <p className="text-right text-xs text-muted-foreground">
                {title.length}/120
              </p>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="notification-body"
              >
                Notification Message
              </label>
              <textarea
                id="notification-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Write your notification message..."
                className="w-full resize-y rounded-md border bg-background p-3 text-sm outline-none focus:border-emerald-600"
              />
              <p className="text-right text-xs text-muted-foreground">
                {body.length}/500
              </p>
            </div>

            {selectedType !== "PRODUCT_PROMOTION" && (
              <>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="target-url"
                  >
                    Destination Link (optional)
                  </label>
                  <input
                    id="target-url"
                    type="url"
                    value={targetUrl}
                    onChange={(event) => setTargetUrl(event.target.value)}
                    placeholder="https://africasuk.com/..."
                    className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="image-url">
                    Image URL (optional)
                  </label>
                  <input
                    id="image-url"
                    type="url"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    placeholder="https://..."
                    className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-600"
                  />
                </div>
              </>
            )}

            {/* Audience notice */}
            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-medium">Marketing audience</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Campaigns are sent only to customers who enabled marketing
                  notifications and have a registered push device.
                </p>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="space-y-3 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notification Preview</h3>
                  <Badge variant="secondary">Preview</Badge>
                </div>

                <div className="mx-auto max-w-md rounded-2xl border bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-emerald-600 p-2 text-white">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Africa Suk</p>
                      <p className="text-xs text-muted-foreground">Now</p>
                    </div>
                  </div>

                  <p className="mt-4 font-semibold">
                    {title || "Notification title"}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                    {body || "Your notification message will appear here."}
                  </p>

                  {imageUrl && (
                    <div
                      className="mt-3 h-36 rounded-lg border bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url("${imageUrl.replace(/["\\]/g, "")}")`,
                      }}
                    />
                  )}

                  {targetUrl && (
                    <p className="mt-3 break-all text-xs text-emerald-700 dark:text-emerald-400">
                      {targetUrl}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-5">
              <Button
                variant="outline"
                onClick={() => setShowPreview((value) => !value)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? "Hide Preview" : "Preview"}
              </Button>

              <Button
                onClick={handleSaveDraft}
                disabled={
                  isPending ||
                  !title.trim() ||
                  !body.trim() ||
                  (selectedType === "PRODUCT_PROMOTION" && !selectedProductId)
                }
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign history */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Campaign History</h2>
            <p className="text-sm text-muted-foreground">
              View your saved and previously sent campaigns.
            </p>
          </div>
          <History className="h-5 w-5 text-muted-foreground" />
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading campaigns...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No campaigns yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your campaigns will appear here after you save them.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{campaign.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {campaign.body}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(campaign.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <Badge
                        variant={
                          campaign.status === "SENT" ? "default" : "secondary"
                        }
                      >
                        {campaign.status}
                      </Badge>

                      <span className="text-xs text-muted-foreground">
                        {campaign.successful_deliveries ?? 0} accepted
                      </span>

                      {campaign.status === "DRAFT" && (
                        <Button
                          size="sm"
                          disabled={isPending}
                          onClick={() => setCampaignToSend(campaign)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <p className="text-xs text-muted-foreground">
        Only draft campaigns can be sent. Expo acceptance is recorded as
        successful submission; it does not guarantee the device displayed it.
      </p>

      {/* Custom campaign confirmation dialog */}
      <AlertDialog
        open={!!campaignToSend}
        onOpenChange={(open) => {
          if (!open && !isPending) {
            setCampaignToSend(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Send className="h-6 w-6" />
            </div>

            <AlertDialogTitle>
              Send notification campaign?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This campaign will be sent to eligible customers who have
              enabled marketing notifications and registered a push device.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {campaignToSend && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <div>
                <p className="font-semibold">{campaignToSend.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {campaignToSend.body}
                </p>
              </div>

              <div className="flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-muted-foreground">
                  Eligible customers
                </span>
                <span className="font-semibold tabular-nums">
                  {overview.eligibleCustomers}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Customers without a registered push device will not receive
                this notification.
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleSendCampaign();
              }}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Confirm Send
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
