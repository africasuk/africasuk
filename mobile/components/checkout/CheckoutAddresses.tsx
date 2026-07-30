import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MapPin, Check } from "lucide-react-native";

import type { Address } from "@africasuk/types";

import AddAddressDialog from "./AddAddressDialog";
import EditAddressDialog from "./EditAddressDialog";
import AddressActions from "./AddressActions";
import { useCheckout } from "./CheckoutContext";

interface Props {
  initialAddresses: Address[];
}

export default function CheckoutAddresses({ initialAddresses }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { selectedAddress, setSelectedAddress } = useCheckout();

  useEffect(() => {
    if (!selectedAddress && initialAddresses.length > 0) {
      setSelectedAddress(
        initialAddresses.find((address) => address.isDefault) ??
          initialAddresses[0],
      );
    }
  }, [initialAddresses, selectedAddress, setSelectedAddress]);

  const isEmpty = initialAddresses.length === 0;

  return (
    <>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepText}>02</Text>
            </View>

            <View>
              <Text style={styles.title}>Delivery Address</Text>
              <Text style={styles.subtitle}>
                Choose where your order will be delivered.
              </Text>
            </View>
          </View>

          <AddAddressDialog />
        </View>

        {/* Empty State vs Address List */}
        {isEmpty ? (
          <View style={styles.emptyState}>
            <MapPin size={36} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptyDescription}>
              Add your first delivery address to continue checkout.
            </Text>
            <View style={{ marginTop: 20 }}>
              <AddAddressDialog />
            </View>
          </View>
        ) : (
          initialAddresses.map((address) => {
            const isSelected = selectedAddress?.id === address.id;

            return (
              <View
                key={address.id}
                style={[
                  styles.addressCard,
                  isSelected && styles.selectedCard,
                ]}
              >
                <Pressable onPress={() => setSelectedAddress(address)}>
                  <View style={styles.addressHeader}>
                    <View style={styles.addressInfo}>
                      <Text style={styles.addressLabel}>{address.label}</Text>

                      {address.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>

                    <AddressActions
                      id={address.id}
                      isDefault={address.isDefault}
                      onEdit={() => {
                        setEditingAddress(address);
                        setEditOpen(true);
                      }}
                    />
                  </View>

                  <View style={styles.addressBody}>
                    <Text style={styles.recipient}>
                      {address.recipientName}
                    </Text>
                    <Text style={styles.addressText}>{address.street}</Text>
                    <Text style={styles.addressText}>
                      {address.city}, {address.country}
                    </Text>
                    <Text style={styles.phone}>{address.phone}</Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Check size={12} color="#fff" strokeWidth={3} />
                    </View>
                  )}
                </Pressable>
              </View>
            );
          })
        )}
      </View>

      <EditAddressDialog
        open={editOpen}
        address={editingAddress}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  stepText: {
    color: "#004d26",
    fontWeight: "800",
    fontSize: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b7280",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
  },
  emptyDescription: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  addressCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  selectedCard: {
    borderColor: "#004d26",
    backgroundColor: "rgba(0,77,38,0.05)",
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  addressInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  addressBody: {
    gap: 4,
  },
  recipient: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  addressText: {
    fontSize: 13,
    color: "#4b5563",
  },
  phone: {
    marginTop: 6,
    fontSize: 12,
    color: "#9ca3af",
  },
  checkIcon: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#004d26",
    justifyContent: "center",
    alignItems: "center",
  },
});