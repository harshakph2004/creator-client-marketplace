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

import { getToken, clearAuth } from "../../services/auth";

import {
  Colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";

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

const colors = Colors.light;

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

      const response = await fetch(
        `${API_URL}/api/profile/creator`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load profile",
        );
      }

      setProfile(data.profile);
    } catch (error) {
      console.error("PROFILE LOAD ERROR:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Unable to load profile.",
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
        `${API_URL}/api/profile/creator`,
        {
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
              profile.followers === null
                ? null
                : Number(profile.followers),

            averageViews:
              profile.averageViews === null
                ? null
                : Number(profile.averageViews),

            engagementRate:
              profile.engagementRate === null
                ? null
                : Number(profile.engagementRate),

            socialLinks:
              profile.socialLinks || null,

            portfolio:
              profile.portfolio || null,

            location:
              profile.location || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save profile",
        );
      }

      setProfile(data.profile);

      Alert.alert(
        "Profile updated",
        "Your creator profile has been saved.",
      );
    } catch (error) {
      console.error("PROFILE SAVE ERROR:", error);

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

  const handleLogout = async () => {
    await clearAuth();
    router.replace("/(auth)/login");
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              C
            </Text>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.title}>
              Creator Profile
            </Text>

            <Text style={styles.subtitle}>
              Build your profile so brands can understand
              your content and audience.
            </Text>
          </View>
        </View>

        {/* Profile completion */}

        <View style={styles.profileCard}>
          <View style={styles.profileCardTop}>
            <View>
              <Text style={styles.profileCardTitle}>
                Your creator profile
              </Text>

              <Text style={styles.profileCardSubtitle}>
                Keep your information up to date.
              </Text>
            </View>

            <View style={styles.completeBadge}>
              <Text style={styles.completeText}>
                PROFILE
              </Text>
            </View>
          </View>
        </View>

        {/* About */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About You
          </Text>

          <Text style={styles.sectionSubtitle}>
            Introduce yourself to potential brand partners.
          </Text>
        </View>

        <Text style={styles.label}>BIO</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell brands about yourself and your content..."
          placeholderTextColor={colors.mutedText}
          multiline
          textAlignVertical="top"
          value={profile.bio ?? ""}
          onChangeText={(value) =>
            updateField("bio", value)
          }
        />

        <Text style={styles.label}>LOCATION</Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Bangalore, India"
          placeholderTextColor={colors.mutedText}
          value={profile.location ?? ""}
          onChangeText={(value) =>
            updateField("location", value)
          }
        />

        {/* Social media */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Social Media
          </Text>

          <Text style={styles.sectionSubtitle}>
            Tell brands where they can find your content.
          </Text>
        </View>

        <Text style={styles.label}>PLATFORMS</Text>

        <TextInput
          style={styles.input}
          placeholder="Instagram, YouTube, TikTok"
          placeholderTextColor={colors.mutedText}
          value={profile.platforms ?? ""}
          onChangeText={(value) =>
            updateField("platforms", value)
          }
        />

        <Text style={styles.label}>CONTENT NICHES</Text>

        <TextInput
          style={styles.input}
          placeholder="Gaming, Tech, Travel"
          placeholderTextColor={colors.mutedText}
          value={profile.niches ?? ""}
          onChangeText={(value) =>
            updateField("niches", value)
          }
        />

        <Text style={styles.label}>
          SOCIAL MEDIA LINKS
        </Text>

        <TextInput
          style={[styles.input, styles.textAreaSmall]}
          placeholder="Instagram / YouTube / TikTok links"
          placeholderTextColor={colors.mutedText}
          multiline
          textAlignVertical="top"
          value={profile.socialLinks ?? ""}
          onChangeText={(value) =>
            updateField("socialLinks", value)
          }
        />

        {/* Audience */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Audience
          </Text>

          <Text style={styles.sectionSubtitle}>
            Help brands understand your reach and
            engagement.
          </Text>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.label}>
              FOLLOWERS
            </Text>

            <TextInput
              style={styles.input}
              placeholder="125000"
              placeholderTextColor={colors.mutedText}
              keyboardType="numeric"
              value={
                profile.followers === null ||
                profile.followers === undefined
                  ? ""
                  : String(profile.followers)
              }
              onChangeText={(value) =>
                updateField("followers", value)
              }
            />
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>
              AVERAGE VIEWS
            </Text>

            <TextInput
              style={styles.input}
              placeholder="48000"
              placeholderTextColor={colors.mutedText}
              keyboardType="numeric"
              value={
                profile.averageViews === null ||
                profile.averageViews === undefined
                  ? ""
                  : String(profile.averageViews)
              }
              onChangeText={(value) =>
                updateField("averageViews", value)
              }
            />
          </View>
        </View>

        <Text style={styles.label}>
          ENGAGEMENT RATE (%)
        </Text>

        <TextInput
          style={styles.input}
          placeholder="4.8"
          placeholderTextColor={colors.mutedText}
          keyboardType="decimal-pad"
          value={
            profile.engagementRate === null ||
            profile.engagementRate === undefined
              ? ""
              : String(profile.engagementRate)
          }
          onChangeText={(value) =>
            updateField("engagementRate", value)
          }
        />

        {/* Portfolio */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Portfolio
          </Text>

          <Text style={styles.sectionSubtitle}>
            Give brands a place to see your previous work.
          </Text>
        </View>

        <Text style={styles.label}>
          PORTFOLIO LINK
        </Text>

        <TextInput
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor={colors.mutedText}
          autoCapitalize="none"
          keyboardType="url"
          value={profile.portfolio ?? ""}
          onChangeText={(value) =>
            updateField("portfolio", value)
          }
        />

        {/* Save */}

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            saving && styles.disabledButton,
            pressed &&
              !saving &&
              styles.buttonPressed,
          ]}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color={colors.card}
            />
          ) : (
            <>
              <Text style={styles.saveText}>
                Save Profile
              </Text>

              <Text style={styles.saveArrow}>
                →
              </Text>
            </>
          )}
        </Pressable>

        {/* Logout */}

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 56,
    paddingBottom: 40,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: spacing.md,
    color: colors.secondaryText,
    fontSize: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerContent: {
    flex: 1,
    marginLeft: spacing.lg,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
  },

  title: {
    color: colors.text,
    ...typography.screenTitle,
  },

  subtitle: {
    marginTop: spacing.sm,
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },

  profileCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  profileCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profileCardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },

  profileCardSubtitle: {
    marginTop: 4,
    color: colors.secondaryText,
    fontSize: 12,
  },

  completeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
  },

  completeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  section: {
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },

  sectionTitle: {
    color: colors.text,
    ...typography.sectionTitle,
  },

  sectionSubtitle: {
    marginTop: 4,
    color: colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
  },

  label: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 14,
  },

  textArea: {
    height: 115,
    paddingTop: spacing.md,
  },

  textAreaSmall: {
    height: 100,
    paddingTop: spacing.md,
  },

  twoColumn: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  column: {
    flex: 1,
  },

  saveButton: {
    height: 52,
    marginTop: spacing.xxl,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  saveText: {
    color: colors.card,
    ...typography.button,
  },

  saveArrow: {
    marginLeft: spacing.sm,
    color: colors.card,
    fontSize: 19,
  },

  logoutButton: {
    height: 50,
    marginTop: spacing.md,
    borderRadius: radius.button,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.8,
  },
});