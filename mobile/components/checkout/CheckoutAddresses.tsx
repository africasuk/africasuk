import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MapPin } from "lucide-react-native";

import type { Address } from "@africasuk/types";

import AddAddressDialog from "./AddAddressDialog";
import EditAddressDialog from "./EditAddressDialog";
import AddressActions from "./AddressActions";
import { useCheckout } from "./CheckoutContext";

interface Props {
  initialAddresses: Address[];
  onRefresh?: () => void;
}

export default function CheckoutAddresses({
  initialAddresses,
  onRefresh,
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { selectedAddress, setSelectedAddress } = useCheckout();

  useEffect(() => {
    if (!selectedAddress && initialAddresses.length > 0) {
      setSelectedAddress(
        initialAddresses.find((address) => address.isDefault) ??
          initialAddresses[0]
      );
    }
  }, [initialAddresses, selectedAddress, setSelectedAddress]);

  const isEmpty = initialAddresses.length === 0;

  return (
    <>
      <View style={styles.container}>
        {/* Section Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <Text style={styles.helperText}>Select or add destination</Text>
          </View>

          <AddAddressDialog onSuccess={onRefresh} />
        </View>

        {/* Empty State vs Address List */}
        {isEmpty ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <MapPin size={22} color="#71717a" strokeWidth={1.75} />
            </View>
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptyDescription}>
              Add your delivery address to proceed with your order.
            </Text>
            <View style={styles.emptyActionWrapper}>
              <AddAddressDialog onSuccess={onRefresh} />
            </View>
          </View>
        ) : (
          <View style={styles.addressList}>
            {initialAddresses.map((address) => {
              const isSelected = selectedAddress?.id === address.id;

              return (
                <Pressable
                  key={address.id}
                  onPress={() => setSelectedAddress(address)}
                  style={({ pressed }) => [
                    styles.addressCard,
                    isSelected && styles.selectedCard,
                    pressed && styles.pressedState,
                  ]}
                >
                  {/* Card Header */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.labelGroup}>
                      {/* Custom Radio Button */}
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>

                      <Text style={styles.addressLabel}>{address.label}</Text>

                      {address.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                        </View>
                      )}
                    </View>

                    <AddressActions
                      id={address.id}
                      isDefault={address.isDefault}
                      onRefresh={onRefresh}
                      onEdit={() => {
                        setEditingAddress(address);
                        setEditOpen(true);
                      }}
                    />
                  </View>

                  {/* Address Details */}
                  <View style={styles.addressBody}>
                    <Text style={styles.recipient}>
                      {address.recipientName}
                    </Text>
                    <Text style={styles.addressLine}>
                      {address.street}
                      {address.building ? `, ${address.building}` : ""}
                      {address.apartment ? `, Apt ${address.apartment}` : ""}
                    </Text>
                    <Text style={styles.addressLine}>
                      {address.city}
                      {address.state ? `, ${address.state}` : ""}, {address.country}
                    </Text>
                    <Text style={styles.phoneText}>{address.phone}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <EditAddressDialog
        open={editOpen}
        address={editingAddress}
        onOpenChange={setEditOpen}
        onSuccess={onRefresh}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  helperText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  addressList: {
    gap: 8,
  },

  addressCard: {
    borderWidth: 1.5,
    borderColor: "#e4e4e7",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#ffffff",
    gap: 8,
  },

  selectedCard: {
    borderColor: "#18181b",
    backgroundColor: "#fafafa",
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  labelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#d4d4d8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  radioOuterSelected: {
    borderColor: "#18181b",
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#18181b",
  },

  addressLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  defaultBadge: {
    backgroundColor: "#f4f4f5",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  defaultBadgeText: {
    color: "#52525b",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  addressBody: {
    paddingLeft: 26,
    gap: 2,
  },

  recipient: {
    fontSize: 13,
    fontWeight: "600",
    color: "#27272a",
    letterSpacing: -0.1,
  },

  addressLine: {
    fontSize: 12,
    color: "#71717a",
    lineHeight: 17,
  },

  phoneText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  /* Empty State */
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  emptyDescription: {
    marginTop: 4,
    fontSize: 12,
    color: "#71717a",
    textAlign: "center",
    lineHeight: 17,
    maxWidth: 260,
  },

  emptyActionWrapper: {
    marginTop: 14,
  },

  pressedState: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },
});