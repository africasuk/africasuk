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

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/addresses/${id}/default`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ?? "Failed to update default address."
        );
      }

      Alert.alert("Success", "Default address updated.");
      onRefresh?.();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoadingDefault(false);
    }
  }

  return (
    <>
      {/* Action Menu Trigger Button */}
      <Pressable
        style={styles.triggerButton}
        onPress={() => setMenuOpen(true)}
        hitSlop={8}
      >
        {loadingDefault ? (
          <ActivityIndicator size="small" color="#6b7280" />
        ) : (
          <MoreVertical size={20} color="#6b7280" />
        )}
      </Pressable>

      {/* Action Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuContainer}>
            {/* Edit Option */}
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onEdit();
              }}
            >
              <Pencil size={18} color="#374151" />
              <Text style={styles.menuItemText}>Edit</Text>
            </Pressable>

            {/* Set Default Option */}
            {!isDefault && (
              <Pressable
                style={styles.menuItem}
                disabled={loadingDefault}
                onPress={() => {
                  void handleDefault();
                }}
              >
                <Star size={18} color="#374151" />
                <Text style={styles.menuItemText}>Set Default</Text>
              </Pressable>
            )}

            {/* Delete Option */}
            <Pressable
              style={[styles.menuItem, styles.deleteMenuItem]}
              onPress={() => {
                setMenuOpen(false);
                setDeleteOpen(true);
              }}
            >
              <Trash2 size={18} color="#ef4444" />
              <Text style={[styles.menuItemText, styles.deleteText]}>
                Delete
              </Text>
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
    padding: 6,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  menuContainer: {
    width: 220,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  deleteMenuItem: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  deleteText: {
    color: "#ef4444",
  },
});