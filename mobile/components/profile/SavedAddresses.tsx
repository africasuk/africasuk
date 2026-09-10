import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Home, MapPin, Plus } from "lucide-react-native";

import type { Address } from "@africasuk/types";

import AddAddressModal from "@/components/checkout/AddAddressModal";
import AddressActions from "@/components/checkout/AddressActions";
import EditAddressModal from "@/components/checkout/EditAddressModal";

interface Props {
  addresses: Address[];
  onRefresh?: () => void;
}

export default function SavedAddresses({ addresses, onRefresh }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleSuccess = () => {
    onRefresh?.();
  };

  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          <Text style={styles.helperText}>Manage saved delivery locations</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={() => setAddOpen(true)}
        >
          <Plus size={13} color="#ffffff" strokeWidth={2.2} />
          <Text style={styles.addButtonText}>Add New</Text>
        </Pressable>
      </View>

      {/* Address List / Empty State */}
      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MapPin size={22} color="#71717a" strokeWidth={1.8} />
          </View>
          <Text style={styles.emptyTitle}>No saved addresses</Text>
          <Text style={styles.emptySubtitle}>
            Save your home, office, or pickup locations for faster checkout.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.emptyAddButton,
              pressed && styles.emptyAddButtonPressed,
            ]}
            onPress={() => setAddOpen(true)}
          >
            <Plus size={13} color="#18181b" strokeWidth={2.2} />
            <Text style={styles.emptyAddButtonText}>Add Delivery Address</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              {/* Header Row */}
              <View style={styles.addressCardHeader}>
                <View style={styles.labelContainer}>
                  <View style={styles.labelTitleRow}>
                    <View style={styles.iconTile}>
                      <Home size={14} color="#18181b" strokeWidth={1.8} />
                    </View>
                    <Text style={styles.labelTitle} numberOfLines={1}>
                      {address.label}
                    </Text>
                  </View>

                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
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
                  onRefresh={handleSuccess}
                />
              </View>

              {/* Address Details */}
              <View style={styles.detailsContainer}>
                <Text style={styles.recipientName}>{address.recipientName}</Text>
                <Text style={styles.phoneText}>{address.phone}</Text>

                <Text style={styles.streetText}>
                  {address.street}
                  {address.building ? `, ${address.building}` : ""}
                  {address.apartment ? `, Apt ${address.apartment}` : ""}
                </Text>

                {Boolean(address.landmark) && (
                  <Text style={styles.landmarkText}>{address.landmark}</Text>
                )}

                <Text style={styles.cityStateText}>
                  {address.city}
                  {address.state ? `, ${address.state}` : ""}
                  {address.postalCode ? ` ${address.postalCode}` : ""}
                </Text>

                <Text style={styles.countryText}>{address.country}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Add Address Modal */}
      <AddAddressModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Edit Address Modal */}
      <EditAddressModal
        visible={editOpen}
        address={editingAddress}
        onClose={() => setEditOpen(false)}
        onSuccess={handleSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 16,
    gap: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
    gap: 2,
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
    fontWeight: "400",
    color: "#71717a",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#18181b",
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 8,
  },

  addButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  addButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.1,
  },

  emptyContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#fafafa",
  },

  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  emptySubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    marginTop: 4,
    textAlign: "center",
    lineHeight: 17,
    maxWidth: 260,
  },

  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    marginTop: 14,
  },

  emptyAddButtonPressed: {
    backgroundColor: "#f4f4f5",
  },

  emptyAddButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  listContainer: {
    gap: 10,
  },

  addressCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    padding: 14,
    backgroundColor: "#ffffff",
    gap: 8,
  },

  addressCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  labelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  labelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  iconTile: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  labelTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  defaultBadge: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },

  defaultBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#52525b",
    letterSpacing: 0.4,
  },

  detailsContainer: {
    gap: 2,
  },

  recipientName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#27272a",
    letterSpacing: -0.1,
  },

  phoneText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#71717a",
  },

  streetText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    lineHeight: 16,
    marginTop: 2,
  },

  landmarkText: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#a1a1aa",
  },

  cityStateText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#3f3f46",
  },

  countryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#a1a1aa",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 2,
  },
});