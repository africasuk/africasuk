import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import { DollarSign, Check, ChevronRight } from "lucide-react-native";

import { useCurrency } from "@/providers/CurrencyProvider";

const BRAND = "#004d26";

const CURRENCIES = {
  USD: {
    label: "USD",
    fullName: "US Dollar",
    symbol: "$",
    flagUrl: "https://flagcdn.com/w40/us.png",
  },
  SSP: {
    label: "SSP",
    fullName: "South Sudanese Pound",
    symbol: "SSP",
    flagUrl: "https://flagcdn.com/w40/ss.png",
  },
} as const;

type CurrencyCode = keyof typeof CURRENCIES;

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [modalVisible, setModalVisible] = useState(false);

  const activeCode = (currency in CURRENCIES ? currency : "USD") as CurrencyCode;
  const activeCurrency = CURRENCIES[activeCode];

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setModalVisible(false);
  };

  return (
    <>
      {/* Menu Row Trigger */}
      <Pressable
        style={styles.rowTrigger}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.left}>
          <DollarSign size={20} color={BRAND} />
          <Text style={styles.rowText}>Currency</Text>
        </View>

        <View style={styles.right}>
          <Image
            source={{ uri: activeCurrency.flagUrl }}
            style={styles.flagIcon}
            resizeMode="cover"
          />
          <Text style={styles.activeCode}>{activeCurrency.label}</Text>
          <ChevronRight size={18} color="#9ca3af" />
        </View>
      </Pressable>

      {/* Currency Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>

            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
              const item = CURRENCIES[code];
              const isSelected = activeCode === code;

              return (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.optionRow,
                    isSelected && styles.optionRowSelected,
                  ]}
                  onPress={() => handleSelect(code)}
                >
                  <View style={styles.optionLeft}>
                    <Image
                      source={{ uri: item.flagUrl }}
                      style={styles.optionFlag}
                      resizeMode="cover"
                    />
                    <View style={styles.labelContainer}>
                      <Text style={styles.optionLabel}>{item.label}</Text>
                      <Text style={styles.optionSublabel}>{item.fullName}</Text>
                    </View>
                  </View>

                  {isSelected && <Check size={18} color={BRAND} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  rowTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flagIcon: {
    width: 20,
    height: 14,
    borderRadius: 2,
  },
  activeCode: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  optionRowSelected: {
    backgroundColor: "#f0fdf4",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionFlag: {
    width: 26,
    height: 18,
    borderRadius: 2,
  },
  labelContainer: {
    flexDirection: "column",
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  optionSublabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6b7280",
  },
});