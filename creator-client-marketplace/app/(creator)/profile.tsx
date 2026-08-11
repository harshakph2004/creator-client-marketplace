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
  bio: string | null;
  platforms: string | null;
  niches: string | null;
  followers: number | null;
  averageViews: number | null;
  engagementRate: number | null;
  socialLinks: string | null;
  portfolio: string | null;
  location: string | null;
};

export default function CreatorProfile() {
  const [profile, setProfile] = useState<Profile>({
    bio: "",
    platforms: "",
    niches: "",
    followers: null,
    averageViews: null,
    engagementRate: null,
    socialLinks: "",
    portfolio: "",
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

      const response = await fetch(`${API_URL}/api/profile/creator`, {
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
      console.error("PROFILE LOAD ERROR:", error);

      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unable to load profile.",
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

      const response = await fetch(`${API_URL}/api/profile/creator`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: profile.bio || null,
          platforms: profile.platforms || null,
          niches: profile.niches || null,

          followers:
            profile.followers === null ? null : Number(profile.followers),

          averageViews:
            profile.averageViews === null ? null : Number(profile.averageViews),

          engagementRate:
            profile.engagementRate === null
              ? null
              : Number(profile.engagementRate),

          socialLinks: profile.socialLinks || null,
          portfolio: profile.portfolio || null,
          location: profile.location || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      setProfile(data.profile);

      Alert.alert("Success", "Your creator profile has been updated.");
    } catch (error) {
      console.error("PROFILE SAVE ERROR:", error);

      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Unable to save profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Creator Profile</Text>

      <Text style={styles.subtitle}>
        Tell brands about your audience, content and social reach.
      </Text>

      <Text style={styles.sectionTitle}>About You</Text>

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Tell brands about yourself and your content..."
        multiline
        value={profile.bio ?? ""}
        onChangeText={(value) => updateField("bio", value)}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Bangalore, India"
        value={profile.location ?? ""}
        onChangeText={(value) => updateField("location", value)}
      />

      <Text style={styles.sectionTitle}>Social Media</Text>

      <Text style={styles.label}>Platforms</Text>
      <TextInput
        style={styles.input}
        placeholder="Instagram, YouTube, TikTok"
        value={profile.platforms ?? ""}
        onChangeText={(value) => updateField("platforms", value)}
      />

      <Text style={styles.label}>Content Niches</Text>
      <TextInput
        style={styles.input}
        placeholder="Gaming, Tech, Travel"
        value={profile.niches ?? ""}
        onChangeText={(value) => updateField("niches", value)}
      />

      <Text style={styles.label}>Social Media Links</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Instagram / YouTube / TikTok links"
        multiline
        value={profile.socialLinks ?? ""}
        onChangeText={(value) => updateField("socialLinks", value)}
      />

      <Text style={styles.sectionTitle}>Audience</Text>

      <Text style={styles.label}>Total Followers</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 125000"
        keyboardType="numeric"
        value={
          profile.followers === null || profile.followers === undefined
            ? ""
            : String(profile.followers)
        }
        onChangeText={(value) => updateField("followers", value)}
      />

      <Text style={styles.label}>Average Views</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 48000"
        keyboardType="numeric"
        value={
          profile.averageViews === null || profile.averageViews === undefined
            ? ""
            : String(profile.averageViews)
        }
        onChangeText={(value) => updateField("averageViews", value)}
      />

      <Text style={styles.label}>Engagement Rate (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 4.8"
        keyboardType="decimal-pad"
        value={
          profile.engagementRate === null ||
          profile.engagementRate === undefined
            ? ""
            : String(profile.engagementRate)
        }
        onChangeText={(value) => updateField("engagementRate", value)}
      />

      <Text style={styles.sectionTitle}>Portfolio</Text>

      <Text style={styles.label}>Portfolio Link</Text>
      <TextInput
        style={styles.input}
        placeholder="https://..."
        autoCapitalize="none"
        keyboardType="url"
        value={profile.portfolio ?? ""}
        onChangeText={(value) => updateField("portfolio", value)}
      />

      <Pressable
        style={[styles.saveButton, saving && styles.disabledButton]}
        onPress={saveProfile}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Profile</Text>
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
