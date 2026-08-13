import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Home, MapPin, Plus } from "lucide-react-native";

import type { Address } from "@africasuk/database";

import AddAddressModal from "@/components/checkout/AddAddressModal";
import AddressActions from "@/components/checkout/AddressActions";
import EditAddressModal from "@/components/checkout/EditAddressModal";

const BRAND = "#005c2e";
const BRAND_DARK = "#002b15";

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
          <Text style={styles.title}>Saved Addresses</Text>
          <Text style={styles.subtitle}>Manage your delivery addresses.</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={() => setAddOpen(true)}
        >
          <Plus size={14} color="#ffffff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Address Content */}
      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MapPin size={22} color="#9ca3af" />
          </View>
          <Text style={styles.emptyTitle}>No saved addresses</Text>
          <Text style={styles.emptySubtitle}>
            Add an address to make checkout faster.
          </Text>

          <TouchableOpacity
            style={styles.emptyAddButton}
            activeOpacity={0.85}
            onPress={() => setAddOpen(true)}
          >
            <Plus size={14} color={BRAND_DARK} />
            <Text style={styles.emptyAddButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              {/* Header Row: Icon, Label, Default Badge & Actions */}
              <View style={styles.addressCardHeader}>
                <View style={styles.labelContainer}>
                  <View style={styles.labelTitleRow}>
                    <Home size={15} color={BRAND} />
                    <Text style={styles.labelTitle} numberOfLines={1}>
                      {address.label}
                    </Text>
                  </View>

                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>✓ Default</Text>
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

                {address.landmark && (
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

      {/* Add Address Modal Sheet */}
      <AddAddressModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Edit Address Modal Sheet */}
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
    borderRadius: 0, // Sharp corners design language
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "500", // Non-bold clean header weight
    color: BRAND_DARK,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: BRAND,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0, // Sharp corners
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "500", // Clean regular weight
    color: "#ffffff",
  },
  emptyContainer: {
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 0, // Sharp square container
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: BRAND_DARK,
  },
  emptySubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
    marginTop: 2,
    textAlign: "center",
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 0, // Sharp corners
    marginTop: 14,
  },
  emptyAddButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: BRAND_DARK,
  },
  listContainer: {
    gap: 12,
  },
  addressCard: {
    borderRadius: 0, // Sharp corners
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    backgroundColor: "#ffffff",
    gap: 8,
  },
  addressCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  labelContainer: {
    flex: 1,
    gap: 4,
  },
  labelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelTitle: {
    fontSize: 13,
    fontWeight: "500", // Clean weight
    color: BRAND_DARK,
    flexShrink: 1,
  },
  defaultBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 0, // Sharp corners
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: "500",
    color: BRAND,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailsContainer: {
    gap: 2,
  },
  recipientName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1f2937",
  },
  phoneText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6b7280",
  },
  streetText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#4b5563",
    marginTop: 2,
  },
  landmarkText: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#9ca3af",
  },
  cityStateText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#374151",
  },
  countryText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 2,
  },
});