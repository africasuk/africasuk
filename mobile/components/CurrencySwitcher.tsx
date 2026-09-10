import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { DollarSign, Check, ChevronRight, X } from "lucide-react-native";

import { useCurrency } from "@/providers/CurrencyProvider";

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
        style={({ pressed }) => [
          styles.rowTrigger,
          pressed && styles.rowTriggerPressed,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.left}>
          <View style={styles.iconSquare}>
            <DollarSign size={16} color="#18181b" strokeWidth={1.8} />
          </View>
          <Text style={styles.rowText}>Currency</Text>
        </View>

        <View style={styles.right}>
          <Image
            source={{ uri: activeCurrency.flagUrl }}
            style={styles.flagIcon}
            contentFit="cover"
            transition={150}
          />
          <Text style={styles.activeCode}>{activeCurrency.label}</Text>
          <ChevronRight size={16} color="#a1a1aa" strokeWidth={1.8} />
        </View>
      </Pressable>

      {/* Currency Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.titleGroup}>
                <Text style={styles.modalTitle}>Select Currency</Text>
                <Text style={styles.modalSubtitle}>
                  Choose your preferred shopping currency
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
                onPress={() => setModalVisible(false)}
                hitSlop={8}
              >
                <X size={15} color="#71717a" strokeWidth={2} />
              </Pressable>
            </View>

            {/* Currency Options */}
            <View style={styles.optionsList}>
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                const item = CURRENCIES[code];
                const isSelected = activeCode === code;

                return (
                  <Pressable
                    key={code}
                    style={({ pressed }) => [
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                      pressed && styles.optionRowPressed,
                    ]}
                    onPress={() => handleSelect(code)}
                  >
                    <View style={styles.optionLeft}>
                      <View style={styles.flagWrapper}>
                        <Image
                          source={{ uri: item.flagUrl }}
                          style={styles.optionFlag}
                          contentFit="cover"
                          transition={150}
                        />
                      </View>
                      <View style={styles.labelContainer}>
                        <View style={styles.codeRow}>
                          <Text style={styles.optionLabel}>{item.label}</Text>
                          <Text style={styles.symbolTag}>({item.symbol})</Text>
                        </View>
                        <Text style={styles.optionSublabel}>{item.fullName}</Text>
                      </View>
                    </View>

                    {isSelected ? (
                      <View style={styles.checkCircle}>
                        <Check size={12} color="#ffffff" strokeWidth={2.5} />
                      </View>
                    ) : (
                      <View style={styles.radioEmpty} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  rowTriggerPressed: {
    backgroundColor: "#fafafa",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  rowText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  flagIcon: {
    width: 22,
    height: 15,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  activeCode: {
    fontSize: 12,
    fontWeight: "600",
    color: "#71717a",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalContent: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 16,
    gap: 14,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  titleGroup: {
    gap: 2,
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  modalSubtitle: {
    fontSize: 12,
    color: "#71717a",
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonPressed: {
    backgroundColor: "#e4e4e7",
  },

  optionsList: {
    gap: 8,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
  },

  optionRowSelected: {
    backgroundColor: "#f4f4f5",
    borderColor: "#18181b",
  },

  optionRowPressed: {
    opacity: 0.88,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  flagWrapper: {
    width: 30,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    overflow: "hidden",
    backgroundColor: "#f4f4f5",
  },

  optionFlag: {
    width: "100%",
    height: "100%",
  },

  labelContainer: {
    gap: 2,
  },

  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  optionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  symbolTag: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  optionSublabel: {
    fontSize: 11,
    color: "#71717a",
  },

  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
  },

  radioEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#d4d4d8",
  },
});