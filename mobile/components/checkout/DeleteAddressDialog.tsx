import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { createClient } from "@/lib/auth/client";


interface Props {
  id: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onDeleted?: () => void;
}

export default function DeleteAddressDialog({
  id,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const [deleting, setDeleting] = useState(false);

async function handleDelete() {
  try {
    setDeleting(true);

    const supabase = createClient();

    const { error } = await (supabase as any)
      .from("addresses")
      .delete()
      .eq("id", id);

    if (error) throw error;

    Alert.alert("Success", "Address deleted.");

    onOpenChange(false);
    onDeleted?.();
  } catch (error) {
    console.error(error);

    Alert.alert(
      "Delete Failed",
      error instanceof Error
        ? error.message
        : "Unable to delete address."
    );
  } finally {
    setDeleting(false);
  }
}

  function handleClose() {
    if (deleting) return;
    onOpenChange(false);
  }

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Delete Address</Text>

          <Text style={styles.description}>
            Are you sure you want to delete this address? This action cannot be
            undone.
          </Text>

          <View style={styles.actions}>
            <Pressable
              disabled={deleting}
              onPress={handleClose}
              style={[
                styles.button,
                styles.cancelButton,
                deleting && styles.disabledButton,
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              disabled={deleting}
              onPress={() => {
                void handleDelete();
              }}
              style={[
                styles.button,
                styles.deleteButton,
                deleting && styles.disabledButton,
              ]}
            >
              {deleting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.deleteText}>Deleting...</Text>
                </View>
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  cancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  deleteButton: {
    backgroundColor: "#e11d48",
  },
  deleteText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});