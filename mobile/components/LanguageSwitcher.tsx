import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Globe, Check, ChevronRight } from "lucide-react-native";

const BRAND = "#004d26";
const STORAGE_KEY = "@africasuk_locale";

const LANGUAGES = {
  en: {
    label: "English",
    code: "EN",
    flagUrl: "https://flagcdn.com/w40/gb.png",
  },
  ar: {
    label: "العربية",
    code: "AR",
    flagUrl: "https://flagcdn.com/w40/sa.png",
  },
} as const;

type Locale = keyof typeof LANGUAGES;

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("en");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "en" || saved === "ar") {
        setCurrentLocale(saved as Locale);
      }
    });
  }, []);

  const changeLanguage = async (locale: Locale) => {
    setCurrentLocale(locale);
    await AsyncStorage.setItem(STORAGE_KEY, locale);
    setModalVisible(false);
  };

  const activeLang = LANGUAGES[currentLocale];

  return (
    <>
      {/* Menu Row Trigger */}
      <Pressable
        style={styles.rowTrigger}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.left}>
          <Globe size={20} color={BRAND} />
          <Text style={styles.rowText}>Language</Text>
        </View>

        <View style={styles.right}>
          <Image
            source={{ uri: activeLang.flagUrl }}
            style={styles.flagIcon}
            resizeMode="cover"
          />
          <Text style={styles.activeCode}>{activeLang.label}</Text>
          <ChevronRight size={18} color="#9ca3af" />
        </View>
      </Pressable>

      {/* Language Selection Modal */}
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
            <Text style={styles.modalTitle}>Select Language</Text>

            {(Object.keys(LANGUAGES) as Locale[]).map((key) => {
              const lang = LANGUAGES[key];
              const isSelected = currentLocale === key;

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionRow,
                    isSelected && styles.optionRowSelected,
                  ]}
                  onPress={() => changeLanguage(key)}
                >
                  <View style={styles.optionLeft}>
                    <Image
                      source={{ uri: lang.flagUrl }}
                      style={styles.optionFlag}
                      resizeMode="cover"
                    />
                    <Text style={styles.optionLabel}>{lang.label}</Text>
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
    paddingVertical: 14,
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
    width: 24,
    height: 16,
    borderRadius: 2,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});