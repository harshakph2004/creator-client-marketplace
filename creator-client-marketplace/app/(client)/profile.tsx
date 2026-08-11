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

const industries = [
  "Technology",
  "Fashion",
  "Food & Beverage",
  "Fitness",
  "Gaming",
  "Finance",
  "Travel",
  "Beauty",
  "Education",
  "Healthcare",
  "Entertainment",
  "Other",
];

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
  const [showIndustries, setShowIndustries] =
    useState(false);

  const loadProfile = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/profile/brand`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load profile",
        );
      }

      setProfile(data.profile);
    } catch (error) {
      console.error(
        "BRAND PROFILE LOAD ERROR:",
        error,
      );

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Unable to load brand profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateField = (
    field: keyof Profile,
    value: string,
  ) => {
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

      const response = await fetch(
        `${API_URL}/api/profile/brand`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            companyName:
              profile.companyName || null,
            bio: profile.bio || null,
            industry:
              profile.industry || null,
            website:
              profile.website || null,
            socialLinks:
              profile.socialLinks || null,
            location:
              profile.location || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save profile",
        );
      }

      setProfile(data.profile);

      Alert.alert(
        "Profile updated",
        "Your brand profile has been saved successfully.",
      );
    } catch (error) {
      console.error(
        "BRAND PROFILE SAVE ERROR:",
        error,
      );

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Unable to save profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#5B4BFF"
        />

        <Text style={styles.loadingText}>
          Loading brand profile...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}

        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>←</Text>

          <Text style={styles.backText}>
            Dashboard
          </Text>
        </Pressable>

        {/* Header */}

        <View style={styles.header}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>
              ◈
            </Text>
          </View>

          <Text style={styles.title}>
            Brand Profile
          </Text>

          <Text style={styles.subtitle}>
            Help creators understand your brand,
            company and the kind of campaigns you
            run.
          </Text>
        </View>

        {/* Brand Information */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About Your Brand
          </Text>

          <Text style={styles.sectionSubtitle}>
            Give creators a clear picture of who you
            are.
          </Text>
        </View>

        <Text style={styles.label}>
          COMPANY / BRAND NAME
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Nike"
          placeholderTextColor="#999"
          value={profile.companyName ?? ""}
          onChangeText={(value) =>
            updateField(
              "companyName",
              value,
            )
          }
        />

        {/* Industry Dropdown */}

        <Text style={styles.label}>
          INDUSTRY
        </Text>

        <Pressable
          style={styles.dropdown}
          onPress={() =>
            setShowIndustries(
              !showIndustries,
            )
          }
        >
          <Text
            style={[
              styles.dropdownText,
              !profile.industry &&
                styles.placeholder,
            ]}
          >
            {profile.industry ||
              "Select your industry"}
          </Text>

          <Text style={styles.dropdownArrow}>
            {showIndustries ? "▲" : "▼"}
          </Text>
        </Pressable>

        {showIndustries && (
          <View style={styles.options}>
            {industries.map((industry) => (
              <Pressable
                key={industry}
                style={({ pressed }) => [
                  styles.option,
                  pressed &&
                    styles.optionPressed,
                ]}
                onPress={() => {
                  updateField(
                    "industry",
                    industry,
                  );
                  setShowIndustries(false);
                }}
              >
                <Text
                  style={styles.optionText}
                >
                  {industry}
                </Text>

                {profile.industry ===
                  industry && (
                  <Text
                    style={styles.check}
                  >
                    ✓
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.label}>
          BRAND BIO
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.textArea,
          ]}
          placeholder="Tell creators about your brand, products and goals..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          value={profile.bio ?? ""}
          onChangeText={(value) =>
            updateField("bio", value)
          }
        />

        {/* Online Presence */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Online Presence
          </Text>

          <Text style={styles.sectionSubtitle}>
            Add links so creators can learn more
            about your brand.
          </Text>
        </View>

        <Text style={styles.label}>
          WEBSITE
        </Text>

        <TextInput
          style={styles.input}
          placeholder="https://yourbrand.com"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="url"
          value={profile.website ?? ""}
          onChangeText={(value) =>
            updateField(
              "website",
              value,
            )
          }
        />

        <Text style={styles.label}>
          SOCIAL MEDIA LINKS
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.textArea,
          ]}
          placeholder="Instagram / YouTube / LinkedIn links"
          placeholderTextColor="#999"
          multiline
          autoCapitalize="none"
          value={profile.socialLinks ?? ""}
          onChangeText={(value) =>
            updateField(
              "socialLinks",
              value,
            )
          }
        />

        <Text style={styles.label}>
          LOCATION
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Bangalore, India"
          placeholderTextColor="#999"
          value={profile.location ?? ""}
          onChangeText={(value) =>
            updateField(
              "location",
              value,
            )
          }
        />

        {/* Save */}

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            saving &&
              styles.disabledButton,
            pressed &&
              !saving &&
              styles.buttonPressed,
          ]}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.saveText}>
                Save Brand Profile
              </Text>

              <Text style={styles.saveArrow}>
                →
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </Pressable>

        {/* Info */}

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>
            ✓
          </Text>

          <Text style={styles.infoText}>
            A complete brand profile helps creators
            understand your business and submit more
            relevant proposals.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 50,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F8",
  },

  loadingText: {
    marginTop: 12,
    color: "#737373",
    fontSize: 14,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
  },

  backArrow: {
    fontSize: 24,
    color: "#111",
    marginRight: 8,
  },

  backText: {
    fontSize: 14,
    color: "#737373",
    fontWeight: "600",
  },

  header: {
    marginTop: 24,
  },

  brandIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  brandIconText: {
    color: "#5B4BFF",
    fontSize: 28,
    fontWeight: "700",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 8,
    color: "#737373",
    fontSize: 14,
    lineHeight: 21,
  },

  section: {
    marginTop: 32,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  sectionSubtitle: {
    marginTop: 4,
    color: "#737373",
    fontSize: 13,
    lineHeight: 19,
  },

  label: {
    marginTop: 18,
    marginBottom: 8,
    color: "#999",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#111",
    backgroundColor: "#fff",
  },

  textArea: {
    height: 125,
    paddingTop: 14,
    textAlignVertical: "top",
  },

  dropdown: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownText: {
    flex: 1,
    color: "#111",
    fontSize: 14,
  },

  placeholder: {
    color: "#999",
  },

  dropdownArrow: {
    color: "#737373",
    fontSize: 10,
    marginLeft: 8,
  },

  options: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  option: {
    minHeight: 48,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionPressed: {
    opacity: 0.6,
  },

  optionText: {
    color: "#111",
    fontSize: 14,
  },

  check: {
    color: "#5B4BFF",
    fontSize: 17,
    fontWeight: "800",
  },

  saveButton: {
    height: 54,
    marginTop: 32,
    borderRadius: 12,
    backgroundColor: "#5B4BFF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  saveArrow: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 19,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.82,
  },

  cancelButton: {
    height: 50,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#737373",
    fontSize: 14,
    fontWeight: "700",
  },

  infoBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#EEECFF",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoIcon: {
    color: "#5B4BFF",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
  },

  infoText: {
    flex: 1,
    color: "#57506F",
    fontSize: 12,
    lineHeight: 18,
  },
});