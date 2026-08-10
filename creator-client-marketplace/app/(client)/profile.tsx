import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { getToken } from "../../services/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Profile = {
  id?: number;
  userId?: number;
  companyName: string | null;
  bio: string | null;
  industry: string | null;
  website: string | null;
  socialLinks: string | null;
  location: string | null;
};

export default function BrandProfile() {
  const [profile, setProfile] = useState<Profile>({
    companyName: "",
    bio: "",
    industry: "",
    website: "",
    socialLinks: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/profile/brand`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      setProfile(data.profile);
    } catch (error) {
      console.error("BRAND PROFILE LOAD ERROR:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Unable to load brand profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateField = (field: keyof Profile, value: string) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/profile/brand`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: profile.companyName || null,
          bio: profile.bio || null,
          industry: profile.industry || null,
          website: profile.website || null,
          socialLinks: profile.socialLinks || null,
          location: profile.location || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      setProfile(data.profile);

      Alert.alert(
        "Success",
        "Your brand profile has been updated."
      );
    } catch (error) {
      console.error("BRAND PROFILE SAVE ERROR:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading brand profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Brand Profile</Text>

      <Text style={styles.subtitle}>
        Help creators understand your brand and the campaigns you run.
      </Text>

      <Text style={styles.sectionTitle}>About Your Brand</Text>

      <Text style={styles.label}>Company / Brand Name</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Nike"
        value={profile.companyName ?? ""}
        onChangeText={(value) =>
          updateField("companyName", value)
        }
      />

      <Text style={styles.label}>Industry</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Fashion, Technology, Food"
        value={profile.industry ?? ""}
        onChangeText={(value) =>
          updateField("industry", value)
        }
      />

      <Text style={styles.label}>Brand Bio</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Tell creators about your brand..."
        multiline
        value={profile.bio ?? ""}
        onChangeText={(value) => updateField("bio", value)}
      />

      <Text style={styles.sectionTitle}>Online Presence</Text>

      <Text style={styles.label}>Website</Text>

      <TextInput
        style={styles.input}
        placeholder="https://yourbrand.com"
        autoCapitalize="none"
        keyboardType="url"
        value={profile.website ?? ""}
        onChangeText={(value) =>
          updateField("website", value)
        }
      />

      <Text style={styles.label}>Social Media Links</Text>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Instagram / YouTube / LinkedIn etc."
        multiline
        value={profile.socialLinks ?? ""}
        onChangeText={(value) =>
          updateField("socialLinks", value)
        }
      />

      <Text style={styles.label}>Location</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Bangalore, India"
        value={profile.location ?? ""}
        onChangeText={(value) =>
          updateField("location", value)
        }
      />

      <Pressable
        style={[
          styles.saveButton,
          saving && styles.disabledButton,
        ]}
        onPress={saveProfile}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>
            Save Brand Profile
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 55,
    paddingBottom: 60,
    backgroundColor: "#fff",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: 10,
    color: "#777",
  },

  backButton: {
    marginBottom: 20,
  },

  backText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "600",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 8,
    color: "#777",
    lineHeight: 21,
  },

  sectionTitle: {
    marginTop: 32,
    marginBottom: 4,
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  label: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fff",
  },

  textArea: {
    height: 110,
    paddingTop: 14,
    textAlignVertical: "top",
  },

  saveButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 36,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});