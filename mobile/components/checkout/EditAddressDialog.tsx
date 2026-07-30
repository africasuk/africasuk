import { Modal, View, Text, StyleSheet } from "react-native";
import type { Address } from "@africasuk/types";

import ManualAddressForm from "./ManualAddressForm";

interface Props {
  open: boolean;
  address: Address | null;
  onOpenChange(open: boolean): void;
  onSuccess?: () => void | Promise<void>;
}

export default function EditAddressDialog({
  open,
  address,
  onOpenChange,
  onSuccess,
}: Props) {
  if (!address) {
    return null;
  }

  async function handleSuccess() {
    await Promise.resolve(onSuccess?.());
    onOpenChange(false);
  }

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Address</Text>

          <ManualAddressForm
            mode="edit"
            address={address}
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
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
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
});