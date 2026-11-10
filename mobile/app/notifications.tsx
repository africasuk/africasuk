import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Package,
  Tag,
  Truck,
  ShieldCheck,
  Info,
  ShoppingBag,
} from "lucide-react-native";

import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase/client";

type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
};

const COLORS = {
  green: "#16833B",
  dark: "#18181b",
  muted: "#71717a",
  border: "#eeeeee",
  background: "#f8f9fa",
  white: "#ffffff",
};

function getNotificationIcon(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("order")) return Package;
  if (normalized.includes("deliver")) return Truck;
  if (normalized.includes("product")) return ShoppingBag;
  if (normalized.includes("promo") || normalized.includes("offer"))
    return Tag;
  if (normalized.includes("security")) return ShieldCheck;

  return Info;
}

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "";

  const now = new Date();
  const diff = now.getTime() - value.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";

  if (days < 7) return `${days} days ago`;

  return value.toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year:
      value.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications],
  );

  const filteredNotifications = useMemo(
    () =>
      filter === "unread"
        ? notifications.filter((item) => !item.is_read)
        : notifications,
    [notifications, filter],
  );

  const fetchNotifications = useCallback(
    async (id: string, showLoader = false) => {
      if (showLoader) setLoading(true);

      setError(null);

      try {
        const { data, error: fetchError } = await (
          supabase as any
        )
          .from("notifications")
          .select(
            "id, user_id, title, body, type, data, is_read, created_at",
          )
          .eq("user_id", id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setNotifications((data ?? []) as Notification[]);
      } catch (err) {
        console.error("Notifications fetch failed:", err);
        setError("Unable to load notifications. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  // Load notifications and listen for live updates
  useEffect(() => {
    let active = true;
    let channel: any = null;

    const initialize = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!active) return;

        if (!user) {
          setUserId(null);
          setNotifications([]);
          setLoading(false);
          return;
        }

        setUserId(user.id);

        await fetchNotifications(user.id, true);

        if (!active) return;

        channel = supabase
          .channel(`notifications-${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`,
            },
            () => {
              if (active) {
                void fetchNotifications(user.id);
              }
            },
          )
          .subscribe();
      } catch (err) {
        console.error("Notifications initialization failed:", err);
        if (active) {
          setError("Unable to load your notifications.");
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      active = false;

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [fetchNotifications]);

  const onRefresh = () => {
    if (!userId) return;

    setRefreshing(true);
    void fetchNotifications(userId);
  };

  const markAsRead = async (notification: Notification) => {
    if (notification.is_read || !userId) return;

    // Update UI immediately
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, is_read: true }
          : item,
      ),
    );

    const { error: updateError } = await (supabase as any)
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notification.id)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Failed to mark notification as read:", updateError);
      void fetchNotifications(userId);
    }
  };

  const markAllAsRead = async () => {
    if (!userId || unreadCount === 0 || markingAll) return;

    setMarkingAll(true);

    const previousNotifications = notifications;

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        is_read: true,
      })),
    );

    const { error: updateError } = await (supabase as any)
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (updateError) {
      console.error("Failed to mark all as read:", updateError);
      setNotifications(previousNotifications);
    }

    setMarkingAll(false);
  };

  const renderNotification = ({
    item,
  }: {
    item: Notification;
  }) => {
    const Icon = getNotificationIcon(item.type);

    return (
      <Pressable
        onPress={() => void markAsRead(item)}
        style={({ pressed }) => [
          styles.notificationCard,
          !item.is_read && styles.unreadCard,
          pressed && styles.cardPressed,
        ]}
      >
        <View
          style={[
            styles.notificationIcon,
            !item.is_read && styles.unreadIcon,
          ]}
        >
          <Icon
            size={21}
            color={COLORS.green}
            strokeWidth={1.9}
          />
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeading}>
            <Text
              style={[
                styles.notificationTitle,
                !item.is_read && styles.unreadTitle,
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {!item.is_read && (
              <View style={styles.unreadDot} />
            )}
          </View>

          <Text style={styles.notificationBody}>
            {item.body}
          </Text>

          <Text style={styles.notificationDate}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.white}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10}
        >
          <ArrowLeft size={22} color={COLORS.dark} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            Stay updated with your activity
          </Text>
        </View>

        <View style={styles.headerBell}>
          <Bell size={21} color={COLORS.green} />
          {unreadCount > 0 && (
            <View style={styles.headerDot} />
          )}
        </View>
      </View>

      {/* Filters and mark all */}
      <View style={styles.toolbar}>
        <View style={styles.filters}>
          <Pressable
            onPress={() => setFilter("all")}
            style={[
              styles.filterButton,
              filter === "all" && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === "all" && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter("unread")}
            style={[
              styles.filterButton,
              filter === "unread" && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === "unread" && styles.activeFilterText,
              ]}
            >
              Unread
              {unreadCount > 0 ? ` (${unreadCount})` : ""}
            </Text>
          </Pressable>
        </View>

        {unreadCount > 0 && (
          <Pressable
            onPress={markAllAsRead}
            disabled={markingAll}
            style={styles.markAllButton}
          >
            {markingAll ? (
              <ActivityIndicator
                size="small"
                color={COLORS.green}
              />
            ) : (
              <>
                <CheckCheck
                  size={15}
                  color={COLORS.green}
                />
                <Text style={styles.markAllText}>
                  Mark all read
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* Notification list */}
      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator
            size="large"
            color={COLORS.green}
          />
          <Text style={styles.stateText}>
            Loading notifications...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Info size={36} color="#9ca3af" />

          <Text style={styles.emptyTitle}>
            Something went wrong
          </Text>

          <Text style={styles.emptyDescription}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => {
              if (userId) {
                void fetchNotifications(userId, true);
              }
            }}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : !userId ? (
        <View style={styles.centerState}>
          <View style={styles.emptyIcon}>
            <Bell size={34} color={COLORS.green} />
          </View>

          <Text style={styles.emptyTitle}>
            Sign in to continue
          </Text>

          <Text style={styles.emptyDescription}>
            Please sign in to view your notifications.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={[
            styles.listContent,
            filteredNotifications.length === 0 &&
              styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.green}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerState}>
              <View style={styles.emptyIcon}>
                <Bell size={34} color={COLORS.green} />
              </View>

              <Text style={styles.emptyTitle}>
                {filter === "unread"
                  ? "You're all caught up!"
                  : "No notifications yet"}
              </Text>

              <Text style={styles.emptyDescription}>
                {filter === "unread"
                  ? "You have no unread notifications."
                  : "We'll let you know when something important happens."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.dark,
    letterSpacing: -0.4,
  },

  headerSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
  },

  headerBell: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#eff8f1",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  headerDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  filters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },

  activeFilter: {
    backgroundColor: "#eaf5ed",
  },

  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
  },

  activeFilterText: {
    color: COLORS.green,
  },

  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
  },

  markAllText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.green,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 35,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  unreadCard: {
    backgroundColor: "#f5fbf6",
    borderColor: "#e1f0e4",
  },

  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  unreadIcon: {
    backgroundColor: "#e5f3e8",
  },

  notificationContent: {
    flex: 1,
  },

  notificationHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  notificationTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.dark,
    lineHeight: 20,
  },

  unreadTitle: {
    fontWeight: "700",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },

  notificationBody: {
    fontSize: 12,
    lineHeight: 19,
    color: "#666666",
    marginTop: 5,
  },

  notificationDate: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 9,
    fontWeight: "500",
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
    paddingBottom: 50,
  },

  stateText: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 12,
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: "#eff8f1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.dark,
    textAlign: "center",
  },

  emptyDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 8,
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: COLORS.green,
  },

  retryText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
});