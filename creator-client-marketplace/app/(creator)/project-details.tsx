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
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  getProjectById,
  createApplication,
} from "../../services/api";
import { getToken } from "../../services/auth";

import {
  Colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";

type Project = {
  id: number;
  title: string;
  description: string;
  budget: number | null;
  deadline: string | null;
  client: {
    id: number;
    name: string;
    clientProfile?: {
      companyName: string | null;
    } | null;
  };
};

const colors = Colors.light;

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [proposal, setProposal] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const token = await getToken();

        if (!token || !id) {
          router.replace("/(auth)/login");
          return;
        }

        const result = await getProjectById(
          Number(id),
          token,
        );

        setProject(result.project);
      } catch (error) {
        Alert.alert(
          "Error",
          error instanceof Error
            ? error.message
            : "Failed to load campaign.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleApply = async () => {
    if (!proposal.trim()) {
      Alert.alert(
        "Proposal required",
        "Please write a proposal before applying.",
      );
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      setSubmitting(true);

      await createApplication(
        {
          projectId: Number(id),
          proposal: proposal.trim(),
          proposedPrice: proposedPrice
            ? Number(proposedPrice)
            : undefined,
        },
        token,
      );

      Alert.alert(
        "Application submitted",
        "Your proposal has been sent to the client.",
        [
          {
            text: "Done",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Application failed",
        error instanceof Error
          ? error.message
          : "Unable to submit application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading campaign...
        </Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundTitle}>
          Campaign not found
        </Text>

        <Text style={styles.notFoundText}>
          This campaign may no longer be available.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const companyName =
    project.client.clientProfile?.companyName ||
    project.client.name;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}

        <Pressable
          style={styles.back}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>
            Back to campaigns
          </Text>
        </Pressable>

        {/* Campaign header */}

        <View style={styles.hero}>
          <View style={styles.brandAvatar}>
            <Text style={styles.brandAvatarText}>
              {companyName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.eyebrow}>
            CAMPAIGN OPPORTUNITY
          </Text>

          <Text style={styles.title}>
            {project.title}
          </Text>

          <Text style={styles.client}>
            {companyName}
          </Text>
        </View>

        {/* Key information */}

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>
              BUDGET
            </Text>

            <Text style={styles.infoValue}>
              {project.budget
                ? `₹${project.budget.toLocaleString()}`
                : "Negotiable"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>
              DEADLINE
            </Text>

            <Text style={styles.infoValue}>
              {project.deadline
                ? new Date(
                    project.deadline,
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Flexible"}
            </Text>
          </View>
        </View>

        {/* About */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About the campaign
          </Text>

          <Text style={styles.description}>
            {project.description}
          </Text>
        </View>

        {/* Application */}

        <View style={styles.applicationCard}>
          <Text style={styles.applicationTitle}>
            Apply to this campaign
          </Text>

          <Text style={styles.applicationSubtitle}>
            Tell the brand why you're the right creator
            for this opportunity.
          </Text>

          <Text style={styles.label}>
            YOUR PROPOSAL
          </Text>

          <TextInput
            style={styles.textArea}
            placeholder="Explain why you're a good fit for this campaign..."
            placeholderTextColor={colors.mutedText}
            multiline
            textAlignVertical="top"
            value={proposal}
            onChangeText={setProposal}
          />

          <Text style={styles.label}>
            YOUR PRICE
          </Text>

          <TextInput
            style={styles.input}
            placeholder={
              project.budget
                ? `Campaign budget: ₹${project.budget.toLocaleString()}`
                : "Enter your proposed price"
            }
            placeholderTextColor={colors.mutedText}
            keyboardType="numeric"
            value={proposedPrice}
            onChangeText={setProposedPrice}
          />

          <Text style={styles.priceHint}>
            Leave this empty if you want to discuss pricing
            with the client.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.applyButton,
              submitting && styles.disabledButton,
              pressed &&
                !submitting &&
                styles.buttonPressed,
            ]}
            onPress={handleApply}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <>
                <Text style={styles.applyText}>
                  Apply Now
                </Text>

                <Text style={styles.applyArrow}>
                  →
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Bottom note */}

        <View style={styles.note}>
          <Text style={styles.noteIcon}>✓</Text>

          <Text style={styles.noteText}>
            Your proposal will be reviewed by the brand.
            Make it clear, specific and relevant to this
            campaign.
          </Text>
        </View>
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
    paddingTop: 28,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: spacing.md,
    color: colors.secondaryText,
    fontSize: 14,
  },

  notFoundTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },

  notFoundText: {
    marginTop: spacing.sm,
    color: colors.secondaryText,
    fontSize: 14,
    textAlign: "center",
  },

  backButton: {
    marginTop: spacing.xl,
    height: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    color: colors.card,
    fontWeight: "700",
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

  hero: {
    marginTop: spacing.xl,
  },

  brandAvatar: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  brandAvatarText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  title: {
    marginTop: spacing.sm,
    color: colors.text,
    ...typography.screenTitle,
  },

  client: {
    marginTop: spacing.sm,
    color: colors.secondaryText,
    fontSize: 14,
  },

  infoRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },

  infoCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoLabel: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  infoValue: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },

  section: {
    marginTop: spacing.xxl,
  },

  sectionTitle: {
    color: colors.text,
    ...typography.sectionTitle,
  },

  description: {
    marginTop: spacing.sm,
    color: "#4B4B4B",
    fontSize: 15,
    lineHeight: 23,
  },

  applicationCard: {
    marginTop: spacing.xxl,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  applicationTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },

  applicationSubtitle: {
    marginTop: spacing.sm,
    color: colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
  },

  label: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  textArea: {
    minHeight: 145,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },

  input: {
    height: 52,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 14,
  },

  priceHint: {
    marginTop: spacing.sm,
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 18,
  },

  applyButton: {
    height: 52,
    marginTop: spacing.xl,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  applyText: {
    color: colors.card,
    ...typography.button,
  },

  applyArrow: {
    marginLeft: spacing.sm,
    color: colors.card,
    fontSize: 19,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.85,
  },

  note: {
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
});