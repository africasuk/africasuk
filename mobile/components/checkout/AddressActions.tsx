import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MoreVertical, Pencil, Star, Trash2 } from "lucide-react-native";

import DeleteAddressDialog from "./DeleteAddressDialog";
import { createClient } from "@/lib/auth/client";

interface Props {
  id: string;
  isDefault: boolean;
  onEdit(): void;
  onRefresh?: () => void;
}

export default function AddressActions({
  id,
  isDefault,
  onEdit,
  onRefresh,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loadingDefault, setLoadingDefault] = useState(false);

  async function handleDefault() {
    try {
      setLoadingDefault(true);
      setMenuOpen(false);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please log in again.");
      }

      // Reset existing default flags for this user
      const { error: resetError } = await (supabase as any)
        .from("addresses")
        .update({
          is_default: false,
        })
        .eq("user_id", user.id);

      if (resetError) throw resetError;

      // Assign target address as default
      const { error: updateError } = await (supabase as any)
        .from("addresses")
        .update({
          is_default: true,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      onRefresh?.();
    } catch (error) {
      console.error("Default address update error:", error);
      Alert.alert(
        "Update Failed",
        error instanceof Error ? error.message : "Unable to set default address."
      );
    } finally {
      setLoadingDefault(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <Pressable
        style={({ pressed }) => [
          styles.triggerButton,
          pressed && styles.triggerButtonPressed,
        ]}
        onPress={() => setMenuOpen(true)}
        hitSlop={8}
      >
        {loadingDefault ? (
          <ActivityIndicator size="small" color="#18181b" />
        ) : (
          <MoreVertical size={16} color="#71717a" strokeWidth={1.8} />
        )}
      </Pressable>

      {/* Menu Action Sheet Modal */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuContainer}>
            {/* Edit Option */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                setMenuOpen(false);
                onEdit();
              }}
            >
              <Pencil size={15} color="#18181b" strokeWidth={1.8} />
              <Text style={styles.menuItemText}>Edit Address</Text>
            </Pressable>

            {/* Set as Default Option */}
            {!isDefault && (
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                disabled={loadingDefault}
                onPress={() => {
                  void handleDefault();
                }}
              >
                <Star size={15} color="#18181b" strokeWidth={1.8} />
                <Text style={styles.menuItemText}>Set as Default</Text>
              </Pressable>
            )}

            {/* Delete Option */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                styles.deleteMenuItem,
                pressed && styles.deleteMenuItemPressed,
              ]}
              onPress={() => {
                setMenuOpen(false);
                setDeleteOpen(true);
              }}
            >
              <Trash2 size={15} color="#dc2626" strokeWidth={1.8} />
              <Text style={styles.deleteText}>Delete Address</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Delete Address Confirmation Dialog */}
      <DeleteAddressDialog
        id={id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={onRefresh}
      />
    </>
  );
}

const styles = StyleSheet.create({
  triggerButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f5",
  },

  triggerButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  menuContainer: {
    width: "100%",
    maxWidth: 240,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingVertical: 4,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  menuItemPressed: {
    backgroundColor: "#f4f4f5",
  },

  menuItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  deleteMenuItem: {
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
  },

  deleteMenuItemPressed: {
    backgroundColor: "#fef2f2",
  },

  deleteText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#dc2626",
    letterSpacing: -0.1,
  },
});