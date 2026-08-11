import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";

import { createProject } from "../../services/api";
import { getToken } from "../../services/auth";

import {
  Colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";

const colors = Colors.light;

type DropdownType =
  | "platform"
  | "contentType"
  | "niche"
  | null;

const platformOptions = [
  "Instagram",
  "YouTube",
  "TikTok",
  "Facebook",
  "X",
  "LinkedIn",
  "Other",
];

const contentTypeOptions = [
  "Reel",
  "Short",
  "Story",
  "Post",
  "Video",
  "Live",
  "Other",
];

const nicheOptions = [
  "Gaming",
  "Technology",
  "Fashion",
  "Fitness",
  "Travel",
  "Food",
  "Finance",
  "Beauty",
  "Education",
  "Other",
];

export default function CreateProjectScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [contentType, setContentType] = useState("");
  const [niche, setNiche] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [budget, setBudget] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] =
    useState<DropdownType>(null);

  const getDropdownTitle = () => {
    if (dropdown === "platform") {
      return "Select Platform";
    }

    if (dropdown === "contentType") {
      return "Select Content Type";
    }

    if (dropdown === "niche") {
      return "Select Niche";
    }

    return "";
  };

  const getDropdownOptions = () => {
    if (dropdown === "platform") {
      return platformOptions;
    }

    if (dropdown === "contentType") {
      return contentTypeOptions;
    }

    if (dropdown === "niche") {
      return nicheOptions;
    }

    return [];
  };

  const handleDropdownSelect = (value: string) => {
    if (dropdown === "platform") {
      setPlatform(value);
    }

    if (dropdown === "contentType") {
      setContentType(value);
    }

    if (dropdown === "niche") {
      setNiche(value);
    }

    setDropdown(null);
  };

  const handleCreateCampaign = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter a campaign title and description.",
      );
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        Alert.alert(
          "Login required",
          "Please login again.",
        );

        router.replace("/(auth)/login");
        return;
      }

      await createProject(
        {
          title: title.trim(),
          description: description.trim(),
          platform: platform.trim() || undefined,
          contentType:
            contentType.trim() || undefined,
          niche: niche.trim() || undefined,
          deliverables:
            deliverables.trim() || undefined,
          budget: budget
            ? Number(budget)
            : undefined,
          minFollowers: minFollowers
            ? Number(minFollowers)
            : undefined,
          deadline: deadline || undefined,
        },
        token,
      );

      Alert.alert(
        "Campaign created",
        "Your campaign is now available to creators.",
        [
          {
            text: "Continue",
            onPress: () =>
              router.replace("/(client)"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Could not create campaign",
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}

        <Pressable
          style={styles.back}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>←</Text>

          <Text style={styles.backText}>
            Dashboard
          </Text>
        </Pressable>

        {/* Header */}

        <View style={styles.header}>
          <View style={styles.createIcon}>
            <Text style={styles.plus}>+</Text>
          </View>

          <Text style={styles.title}>
            Create Campaign
          </Text>

          <Text style={styles.subtitle}>
            Give creators everything they need to
            understand your campaign and submit a
            strong proposal.
          </Text>
        </View>

        {/* Campaign Details */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Campaign Details
          </Text>

          <Text style={styles.sectionSubtitle}>
            Start with the basic information about your
            campaign.
          </Text>
        </View>

        <Text style={styles.label}>
          CAMPAIGN TITLE
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. Summer Instagram Promotion"
          placeholderTextColor={colors.mutedText}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>
          DESCRIPTION
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.largeTextArea,
          ]}
          placeholder="Describe your brand, campaign goals and requirements..."
          placeholderTextColor={colors.mutedText}
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        {/* Social Media */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Social Media
          </Text>

          <Text style={styles.sectionSubtitle}>
            Select where and what type of content
            creators will produce.
          </Text>
        </View>

        {/* Platform Dropdown */}

        <Text style={styles.label}>
          PLATFORM
        </Text>

        <Pressable
          style={styles.dropdown}
          onPress={() => setDropdown("platform")}
        >
          <Text
            style={[
              styles.dropdownText,
              !platform &&
                styles.placeholderText,
            ]}
          >
            {platform || "Select a platform"}
          </Text>

          <Text style={styles.dropdownArrow}>
            ▼
          </Text>
        </Pressable>

        {/* Content Type Dropdown */}

        <Text style={styles.label}>
          CONTENT TYPE
        </Text>

        <Pressable
          style={styles.dropdown}
          onPress={() =>
            setDropdown("contentType")
          }
        >
          <Text
            style={[
              styles.dropdownText,
              !contentType &&
                styles.placeholderText,
            ]}
          >
            {contentType ||
              "Select content type"}
          </Text>

          <Text style={styles.dropdownArrow}>
            ▼
          </Text>
        </Pressable>

        {/* Niche Dropdown */}

        <Text style={styles.label}>
          CONTENT NICHE
        </Text>

        <Pressable
          style={styles.dropdown}
          onPress={() => setDropdown("niche")}
        >
          <Text
            style={[
              styles.dropdownText,
              !niche &&
                styles.placeholderText,
            ]}
          >
            {niche || "Select a niche"}
          </Text>

          <Text style={styles.dropdownArrow}>
            ▼
          </Text>
        </Pressable>

        {/* Deliverables */}

        <Text style={styles.label}>
          DELIVERABLES
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.largeTextArea,
          ]}
          placeholder={
            "e.g.\n1 Instagram Reel\n2 Stories\nProduct mention"
          }
          placeholderTextColor={colors.mutedText}
          multiline
          textAlignVertical="top"
          value={deliverables}
          onChangeText={setDeliverables}
        />

        {/* Creator Requirements */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Creator Requirements
          </Text>

          <Text style={styles.sectionSubtitle}>
            Set the minimum audience size you're
            looking for.
          </Text>
        </View>

        <Text style={styles.label}>
          MINIMUM FOLLOWERS
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 20000"
          placeholderTextColor={colors.mutedText}
          keyboardType="numeric"
          value={minFollowers}
          onChangeText={setMinFollowers}
        />

        {/* Budget */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Budget & Deadline
          </Text>

          <Text style={styles.sectionSubtitle}>
            Give creators a clear idea of your campaign
            expectations.
          </Text>
        </View>

        <Text style={styles.label}>
          CAMPAIGN BUDGET (₹)
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 25000"
          placeholderTextColor={colors.mutedText}
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />

        <Text style={styles.hint}>
          Leave the budget empty if you prefer to discuss
          pricing with creators.
        </Text>

        <Text style={styles.label}>
          DEADLINE
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 2026-09-30"
          placeholderTextColor={colors.mutedText}
          value={deadline}
          onChangeText={setDeadline}
        />

        <Text style={styles.hint}>
          Use the format YYYY-MM-DD.
        </Text>

        {/* Create Button */}

        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            loading &&
              styles.disabledButton,
            pressed &&
              !loading &&
              styles.buttonPressed,
          ]}
          onPress={handleCreateCampaign}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color={colors.card}
            />
          ) : (
            <>
              <Text style={styles.createButtonText}>
                Create Campaign
              </Text>

              <Text style={styles.createArrow}>
                →
              </Text>
            </>
          )}
        </Pressable>

        {/* Cancel */}

        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </Pressable>

        {/* Bottom note */}

        <View style={styles.bottomNote}>
          <Text style={styles.noteIcon}>✓</Text>

          <Text style={styles.noteText}>
            Once created, your campaign will be
            visible to creators who match your
            requirements.
          </Text>
        </View>
      </ScrollView>

      {/* Dropdown Modal */}

      <Modal
        visible={dropdown !== null}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setDropdown(null)
        }
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() =>
            setDropdown(null)
          }
        >
          <Pressable
            style={styles.modalCard}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>
              {getDropdownTitle()}
            </Text>

            <View style={styles.optionList}>
              {getDropdownOptions().map(
                (option) => (
                  <Pressable
                    key={option}
                    style={({ pressed }) => [
                      styles.option,
                      pressed &&
                        styles.optionPressed,
                    ]}
                    onPress={() =>
                      handleDropdownSelect(
                        option,
                      )
                    }
                  >
                    <Text
                      style={
                        styles.optionText
                      }
                    >
                      {option}
                    </Text>

                    {(
                      (dropdown ===
                        "platform" &&
                        platform === option) ||
                      (dropdown ===
                        "contentType" &&
                        contentType === option) ||
                      (dropdown === "niche" &&
                        niche === option)
                    ) && (
                      <Text
                        style={
                          styles.check
                        }
                      >
                        ✓
                      </Text>
                    )}
                  </Pressable>
                ),
              )}
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={() =>
                setDropdown(null)
              }
            >
              <Text
                style={styles.closeText}
              >
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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
    paddingTop: 28,
    paddingBottom: 40,
  },

  back: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: spacing.sm,
  },

  backArrow: {
    color: colors.text,
    fontSize: 24,
    marginRight: spacing.sm,
  },

  backText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "600",
  },

  header: {
    marginTop: spacing.xl,
  },

  createIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  plus: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "400",
  },

  title: {
    color: colors.text,
    ...typography.screenTitle,
  },

  subtitle: {
    marginTop: spacing.sm,
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
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
    letterSpacing: 0.7,
  },

  input: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 14,
  },

  largeTextArea: {
    height: 130,
    paddingTop: spacing.md,
  },

  dropdown: {
    height: 52,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },

  placeholderText: {
    color: colors.mutedText,
  },

  dropdownArrow: {
    marginLeft: spacing.sm,
    color: colors.secondaryText,
    fontSize: 11,
  },

  hint: {
    marginTop: spacing.sm,
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
  },

  createButton: {
    height: 54,
    marginTop: spacing.xxl,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  createButtonText: {
    color: colors.card,
    ...typography.button,
  },

  createArrow: {
    marginLeft: spacing.sm,
    color: colors.card,
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
    marginTop: spacing.md,
    borderRadius: radius.button,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "700",
  },

  bottomNote: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#EEECFF",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  noteIcon: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
    marginRight: spacing.sm,
  },

  noteText: {
    flex: 1,
    color: "#57506F",
    fontSize: 12,
    lineHeight: 18,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: 28,
    maxHeight: "75%",
  },

  modalHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },

  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: spacing.md,
  },

  optionList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  option: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionPressed: {
    opacity: 0.6,
  },

  optionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
  },

  check: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },

  closeButton: {
    height: 48,
    marginTop: spacing.md,
    borderRadius: radius.button,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "700",
  },
});