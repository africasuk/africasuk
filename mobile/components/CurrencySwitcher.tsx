import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Check,
  ChevronDown,
  X,
} from "lucide-react-native";
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

  const activeCode = (
    currency in CURRENCIES ? currency : "SSP"
  ) as CurrencyCode;

  const activeCurrency = CURRENCIES[activeCode];

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setModalVisible(false);
  };

  return (
    <>
      {/* Currency Trigger Button */}
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
      >
        <Image
          source={{ uri: activeCurrency.flagUrl }}
          style={styles.flag}
        />

        <Text style={styles.activeCode}>{activeCurrency.label}</Text>

        <ChevronDown
          size={14}
          color="#737373"
          strokeWidth={2}
        />
      </Pressable>

      {/* Currency Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.titleGroup}>
                <Text style={styles.modalTitle}>Choose Currency</Text>
                <Text style={styles.modalSubtitle}>
                  Select how prices are displayed across the store.
                </Text>
              </View>

              <Pressable
                onPress={() => setModalVisible(false)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <X size={16} color="#737373" strokeWidth={2} />
              </Pressable>
            </View>

            {/* Options */}
            <View style={styles.options}>
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                const item = CURRENCIES[code];
                const selected = activeCode === code;

                return (
                  <Pressable
                    key={code}
                    onPress={() => handleSelect(code)}
                    style={({ pressed }) => [
                      styles.option,
                      selected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <View style={styles.optionLeft}>
                      <View style={styles.flagWrapper}>
                        <Image
                          source={{ uri: item.flagUrl }}
                          style={styles.optionFlag}
                        />
                      </View>

                      <View style={styles.optionText}>
                        <View style={styles.codeRow}>
                          <Text
                            style={[
                              styles.optionCode,
                              selected && styles.optionCodeSelected,
                            ]}
                          >
                            {item.label}
                          </Text>

                          <Text style={styles.symbol}>
                            ({item.symbol})
                          </Text>
                        </View>

                        <Text style={styles.optionName}>
                          {item.fullName}
                        </Text>
                      </View>
                    </View>

                    {selected ? (
                      <View style={styles.checkCircle}>
                        <Check
                          size={12}
                          color="#FFFFFF"
                          strokeWidth={2.5}
                        />
                      </View>
                    ) : (
                      <View style={styles.radio} />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <Text style={styles.footerText}>Africa Suk</Text>
              <Text style={styles.footerDot}>•</Text>
              <Text style={styles.footerTextMuted}>
                Shop with Confidence
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  /* Trigger */
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E5",
    backgroundColor: "#F5F5F5",
    gap: 6,
  },

  triggerPressed: {
    backgroundColor: "#E5E5E5",
  },

  flag: {
    width: 18,
    height: 12,
    borderRadius: 2,
    backgroundColor: "#E5E5E5",
  },

  activeCode: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0A0A0A",
    letterSpacing: 0.2,
  },

  /* Modal Overlay */
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modal: {
    width: "100%",
    maxWidth: 360,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },

  titleGroup: {
    flex: 1,
    paddingRight: 12,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A0A0A",
    letterSpacing: -0.3,
  },

  modalSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
    color: "#737373",
  },

  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },

  closeButtonPressed: {
    backgroundColor: "#E5E5E5",
  },

  /* Options */
  options: {
    padding: 14,
    gap: 8,
  },

  option: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },

  optionSelected: {
    backgroundColor: "#FAFAFA",
    borderColor: "#0A0A0A",
  },

  optionPressed: {
    backgroundColor: "#F5F5F5",
  },

  optionLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  flagWrapper: {
    width: 32,
    height: 22,
    overflow: "hidden",
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E5",
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },

  optionFlag: {
    width: "100%",
    height: "100%",
  },

  optionText: {
    flex: 1,
    minWidth: 0,
  },

  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  optionCode: {
    fontSize: 13,
    fontWeight: "700",
    color: "#525252",
  },

  optionCodeSelected: {
    color: "#0A0A0A",
  },

  symbol: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A3A3A3",
  },

  optionName: {
    marginTop: 2,
    fontSize: 11,
    color: "#737373",
  },

  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0A",
    marginLeft: 10,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#D4D4D4",
    marginLeft: 10,
  },

  /* Footer */
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingBottom: 14,
    gap: 5,
  },

  footerText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#525252",
  },

  footerDot: {
    fontSize: 10,
    color: "#A3A3A3",
  },

  footerTextMuted: {
    fontSize: 11,
    color: "#A3A3A3",
  },
});