import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Camera, FileText, Truck } from "lucide-react-native";

const steps = [
  {
    title: "UPLOAD A PHOTO",
    description: "Upload a picture of the product.",
    icon: Camera,
  },
  {
    title: "DESCRIBE IT",
    description: "Choose color, size and quantity.",
    icon: FileText,
  },
  {
    title: "WE SOURCE IT",
    description: "We'll find it and notify you.",
    icon: Truck,
  },
];

export default function RequestProductSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>CAN'T FIND A PRODUCT?</Text>

      <Text style={styles.title}>Request Any Product</Text>

      <Text style={styles.description}>
        Upload a photo and we'll source it for you.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/request-product" as never)}
      >
        <Camera color="#fff" size={20} />
        <Text style={styles.buttonText}>Request Product</Text>
      </Pressable>

      {steps.map((step, index) => {
        const Icon = step.icon;

        return (
          <View key={index} style={styles.step}>
            <View style={styles.iconBox}>
              <Icon color="#005c2e" size={28} />
            </View>

            <Text style={styles.stepTitle}>{step.title}</Text>

            <Text style={styles.stepDescription}>
              {step.description}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  badge: {
    color: "#005c2e",
    fontWeight: "700",
    textAlign: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },

  description: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#005c2e",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    marginBottom: 30,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  step: {
    alignItems: "center",
    marginBottom: 28,
  },

  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  stepTitle: {
    fontWeight: "800",
    fontSize: 16,
  },

  stepDescription: {
    color: "#666",
    textAlign: "center",
    marginTop: 6,
  },
});