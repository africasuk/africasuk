import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MapPin } from "lucide-react-native";
import { useForm, Controller, Resolver } from "react-hook-form";
import * as Location from "expo-location";
import { createClient } from "@/lib/auth/client";

import type { Address } from "@africasuk/types";
import {
  addressSchema,
  type AddressFormValues,
} from "@/lib/validation/address";

// Custom typed resolver to avoid Metro bundler @hookform/resolvers subpath export failures
const createAddressResolver: Resolver<AddressFormValues> = async (values) => {
  const result = await addressSchema.safeParseAsync(values);

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    };
  }

  const errors: Record<string, { type: string; message: string }> = {};

  for (const issue of result.error.issues) {
    const fieldName = issue.path[0] as keyof AddressFormValues;
    if (fieldName && !errors[fieldName]) {
      errors[fieldName] = {
        type: issue.code,
        message: issue.message,
      };
    }
  }

  return {
    values: {},
    errors: errors as any,
  };
};

interface Props {
  mode?: "create" | "edit";
  address?: Address;
  onSuccess(): void | Promise<void>;
  onCancel(): void;
}

export default function ManualAddressForm({
  mode = "create",
  address,
  onSuccess,
  onCancel,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: createAddressResolver,
    defaultValues: {
      label: address?.label ?? "Home",
      country: address?.country ?? "South Sudan",
      state: address?.state ?? "Central Equatoria",
      city: address?.city ?? "Juba",
      area: address?.area ?? "",
      street: address?.street ?? "",
      building: address?.building ?? "",
      apartment: address?.apartment ?? "",
      landmark: address?.landmark ?? "",
      postalCode: address?.postalCode ?? "",
      isDefault: address?.isDefault ?? true,
    },
  });

  async function handleCurrentLocation() {
    try {
      setLocating(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission was denied.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/geocode/reverse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const geo = await response.json();

      setValue("country", geo.country ?? "South Sudan");
      setValue("state", geo.state ?? "Central Equatoria");
      setValue("city", geo.city ?? "Juba");
      setValue("area", geo.area ?? "");
      setValue("street", geo.street ?? "");
      setValue("postalCode", geo.postalCode ?? "");

      Alert.alert("Success", "Location detected successfully.");
    } catch {
      Alert.alert("Error", "Unable to detect address from current location.");
    } finally {
      setLocating(false);
    }
  }

async function onSubmit(values: AddressFormValues) {
  try {
    setSubmitting(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Please login again.");
    }

    if (mode === "create") {
      const { error } = await (supabase as any)
        .from("addresses")
        .insert({
          user_id: user.id,
          label: values.label,
          recipient_name: user.user_metadata?.full_name ?? "",
          phone: user.user_metadata?.phone ?? "",
          country: values.country,
          state: values.state,
          city: values.city,
          area: values.area,
          street: values.street,
          building: values.building,
          apartment: values.apartment,
          landmark: values.landmark,
          postal_code: values.postalCode,
          is_default: values.isDefault,
        });

      if (error) throw error;
    } else {
      const { error } = await (supabase as any)
        .from("addresses")
        .update({
          label: values.label,
          country: values.country,
          state: values.state,
          city: values.city,
          area: values.area,
          street: values.street,
          building: values.building,
          apartment: values.apartment,
          landmark: values.landmark,
          postal_code: values.postalCode,
          is_default: values.isDefault,
          updated_at: new Date().toISOString(),
        })
        .eq("id", address!.id);

      if (error) throw error;
    }

    Alert.alert(
      "Success",
      mode === "edit"
        ? "Address updated successfully."
        : "Address saved successfully."
    );

    await Promise.resolve(onSuccess());

  } catch (error) {
    console.error(error);

    Alert.alert(
      "Error",
      error instanceof Error
        ? error.message
        : "Unable to save address."
    );
  } finally {
    setSubmitting(false);
  }
}

  const fields: {
    name: keyof AddressFormValues;
    placeholder: string;
  }[] = [
    { name: "label", placeholder: "Address Label (Home, Office)" },
    { name: "country", placeholder: "Country" },
    { name: "state", placeholder: "State" },
    { name: "city", placeholder: "City" },
    { name: "area", placeholder: "Area / District" },
    { name: "street", placeholder: "Street Address" },
    { name: "building", placeholder: "Building (Optional)" },
    { name: "apartment", placeholder: "Apartment / Floor (Optional)" },
    { name: "landmark", placeholder: "Nearest Landmark (Optional)" },
    { name: "postalCode", placeholder: "Postal Code (Optional)" },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable
        disabled={locating || submitting}
        onPress={handleCurrentLocation}
        style={styles.locationButton}
      >
        {locating ? (
          <ActivityIndicator color="#004d26" size="small" />
        ) : (
          <MapPin size={18} color="#004d26" />
        )}
        <Text style={styles.locationButtonText}>
          {locating ? "Detecting location..." : "Use Current Location"}
        </Text>
      </Pressable>

      {fields.map(({ name, placeholder }) => (
        <View key={name} style={styles.inputContainer}>
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors[name] && styles.inputError,
                  submitting && styles.inputDisabled,
                ]}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                editable={!submitting}
                onBlur={onBlur}
                onChangeText={onChange}
                value={typeof value === "string" ? value : ""}
              />
            )}
          />
          {errors[name]?.message && (
            <Text style={styles.errorText}>
              {errors[name]?.message as string}
            </Text>
          )}
        </View>
      ))}

      <View style={styles.actions}>
        <Pressable
          disabled={submitting}
          onPress={onCancel}
          style={[styles.button, styles.cancelButton]}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>

        <Pressable
          disabled={submitting}
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, styles.submitButton]}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>
              {mode === "edit" ? "Update Address" : "Save Address"}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    gap: 12,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#004d26",
  },
  inputContainer: {
    gap: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    opacity: 0.7,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    paddingLeft: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  submitButton: {
    backgroundColor: "#004d26",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});