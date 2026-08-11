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

import {
  getCreatorActiveProjects,
  submitDeliverable,
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
  platform: string | null;
  contentType: string | null;
  niche: string | null;
  deliverables: string | null;
  budget: number | null;
  deadline: string | null;
  status: string;
  deliverableUrl: string | null;
  creatorNotes: string | null;

  client: {
    id: number;
    name: string;
    brandProfile?: {
      companyName: string | null;
      website: string | null;
    } | null;
  };

  applications: {
    id: number;
    proposedPrice: number | null;
    proposal: string;
  }[];
};

const colors = Colors.light;

export default function ActiveCampaignScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] =
    useState<number | null>(null);

  const [urls, setUrls] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});

  const loadProjects = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const result = await getCreatorActiveProjects(token);

      setProjects(result.projects || []);
    } catch (error) {
      console.error("ACTIVE CAMPAIGNS ERROR:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to load active campaigns.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (projectId: number) => {
    const deliverableUrl = urls[projectId]?.trim();
    const creatorNotes = notes[projectId]?.trim();

    if (!deliverableUrl) {
      Alert.alert(
        "Deliverable required",
        "Please enter the URL of your completed work.",
      );
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      setSubmittingId(projectId);

      await submitDeliverable(
        projectId,
        {
          deliverableUrl,
          creatorNotes: creatorNotes || undefined,
        },
        token,
      );

      Alert.alert(
        "Deliverable submitted",
        "Your work has been sent to the client for review.",
      );

      await loadProjects();
    } catch (error) {
      console.error("DELIVERABLE ERROR:", error);

      Alert.alert(
        "Submission failed",
        error instanceof Error
          ? error.message
          : "Unable to submit deliverable.",
      );
    } finally {
      setSubmittingId(null);
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
          Loading active campaigns...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              Active Campaigns
            </Text>

            <Text style={styles.subtitle}>
              Complete your accepted campaigns and submit
              your work.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={loadProjects}
          >
            <Text style={styles.refreshIcon}>↻</Text>
          </Pressable>
        </View>

        {/* Campaign count */}

        {projects.length > 0 && (
          <View style={styles.countCard}>
            <View>
              <Text style={styles.countNumber}>
                {projects.length}
              </Text>

              <Text style={styles.countLabel}>
                Active campaign
                {projects.length !== 1 ? "s" : ""}
              </Text>
            </View>

            <View style={styles.activeIndicator}>
              <View style={styles.activeDot} />

              <Text style={styles.activeText}>
                IN PROGRESS
              </Text>
            </View>
          </View>
        )}

        {/* Empty state */}

        {projects.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>
                ✓
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              No active campaigns
            </Text>

            <Text style={styles.emptyText}>
              When a brand accepts your application, your
              campaign will appear here.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.browseButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.replace("/(creator)")}
            >
              <Text style={styles.browseText}>
                Find Campaigns
              </Text>

              <Text style={styles.browseArrow}>
                →
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Your Campaigns
              </Text>

              <Text style={styles.sectionSubtitle}>
                Complete the work and submit it for client
                review.
              </Text>
            </View>

            {projects.map((project) => {
              const acceptedApplication =
                project.applications[0];

              const hasSubmitted =
                Boolean(project.deliverableUrl);

              const isSubmitting =
                submittingId === project.id;

              return (
                <View
                  key={project.id}
                  style={[
                    styles.card,
                    hasSubmitted &&
                      styles.submittedCard,
                  ]}
                >
                  {/* Campaign header */}

                  <View style={styles.cardHeader}>
                    <View style={styles.brandAvatar}>
                      <Text style={styles.brandAvatarText}>
                        {(
                          project.client.brandProfile
                            ?.companyName ||
                          project.client.name ||
                          "B"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.headerContent}>
                      <Text
                        style={styles.projectTitle}
                        numberOfLines={2}
                      >
                        {project.title}
                      </Text>

                      <Text style={styles.client}>
                        {project.client.brandProfile
                          ?.companyName ||
                          project.client.name}
                      </Text>
                    </View>

                    <View style={styles.statusBadge}>
                      <View style={styles.statusDot} />

                      <Text style={styles.statusText}>
                        ACTIVE
                      </Text>
                    </View>
                  </View>

                  {/* Campaign description */}

                  <Text style={styles.sectionLabel}>
                    CAMPAIGN
                  </Text>

                  <Text style={styles.description}>
                    {project.description}
                  </Text>

                  {/* Platform / content */}

                  {(project.platform ||
                    project.contentType) && (
                    <View style={styles.detailsRow}>
                      {project.platform && (
                        <View style={styles.detailBox}>
                          <Text style={styles.detailLabel}>
                            PLATFORM
                          </Text>

                          <Text style={styles.detailValue}>
                            {project.platform}
                          </Text>
                        </View>
                      )}

                      {project.contentType && (
                        <View style={styles.detailBox}>
                          <Text style={styles.detailLabel}>
                            CONTENT
                          </Text>

                          <Text style={styles.detailValue}>
                            {project.contentType}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Niche */}

                  {project.niche && (
                    <View style={styles.detail}>
                      <Text style={styles.detailLabel}>
                        NICHE
                      </Text>

                      <Text style={styles.detailValue}>
                        {project.niche}
                      </Text>
                    </View>
                  )}

                  {/* Deliverables */}

                  {project.deliverables && (
                    <View style={styles.requirementsBox}>
                      <Text style={styles.sectionLabel}>
                        REQUIRED DELIVERABLES
                      </Text>

                      <Text style={styles.requirements}>
                        {project.deliverables}
                      </Text>
                    </View>
                  )}

                  {/* Financial information */}

                  <View style={styles.financeRow}>
                    <View style={styles.financeBox}>
                      <Text style={styles.detailLabel}>
                        AGREED PRICE
                      </Text>

                      <Text style={styles.financeValue}>
                        {acceptedApplication?.proposedPrice
                          ? `₹${acceptedApplication.proposedPrice.toLocaleString()}`
                          : "Not specified"}
                      </Text>
                    </View>

                    <View style={styles.financeBox}>
                      <Text style={styles.detailLabel}>
                        DEADLINE
                      </Text>

                      <Text style={styles.financeValue}>
                        {project.deadline
                          ? new Date(
                              project.deadline,
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "No deadline"}
                      </Text>
                    </View>
                  </View>

                  {/* Submission */}

                  {hasSubmitted ? (
                    <View style={styles.submittedBox}>
                      <View style={styles.submittedHeader}>
                        <View style={styles.submittedIcon}>
                          <Text
                            style={
                              styles.submittedIconText
                            }
                          >
                            ✓
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={
                              styles.submittedTitle
                            }
                          >
                            Deliverable submitted
                          </Text>

                          <Text
                            style={
                              styles.submittedSubtitle
                            }
                          >
                            Waiting for client review
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={styles.submittedUrl}
                        numberOfLines={2}
                      >
                        {project.deliverableUrl}
                      </Text>

                      {project.creatorNotes && (
                        <View style={styles.notesBox}>
                          <Text style={styles.notesLabel}>
                            YOUR NOTES
                          </Text>

                          <Text style={styles.submittedNotes}>
                            {project.creatorNotes}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.submitSection}>
                      <Text style={styles.sectionTitle}>
                        Submit your work
                      </Text>

                      <Text style={styles.submitSubtitle}>
                        Add the link to your completed work
                        for the client to review.
                      </Text>

                      <Text style={styles.inputLabel}>
                        DELIVERABLE URL
                      </Text>

                      <TextInput
                        style={styles.input}
                        placeholder="https://drive.google.com/..."
                        placeholderTextColor={
                          colors.mutedText
                        }
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                        value={urls[project.id] || ""}
                        onChangeText={(value) =>
                          setUrls((previous) => ({
                            ...previous,
                            [project.id]: value,
                          }))
                        }
                      />

                      <Text style={styles.inputLabel}>
                        NOTES
                      </Text>

                      <TextInput
                        style={[
                          styles.input,
                          styles.textArea,
                        ]}
                        placeholder="Tell the client anything they should know..."
                        placeholderTextColor={
                          colors.mutedText
                        }
                        multiline
                        textAlignVertical="top"
                        value={notes[project.id] || ""}
                        onChangeText={(value) =>
                          setNotes((previous) => ({
                            ...previous,
                            [project.id]: value,
                          }))
                        }
                      />

                      <Pressable
                        style={({ pressed }) => [
                          styles.submitButton,
                          isSubmitting &&
                            styles.disabledButton,
                          pressed &&
                            !isSubmitting &&
                            styles.buttonPressed,
                        ]}
                        disabled={isSubmitting}
                        onPress={() =>
                          handleSubmit(project.id)
                        }
                      >
                        {isSubmitting ? (
                          <ActivityIndicator
                            color={colors.card}
                          />
                        ) : (
                          <>
                            <Text
                              style={styles.submitText}
                            >
                              Submit Deliverable
                            </Text>

                            <Text
                              style={styles.submitArrow}
                            >
                              →
                            </Text>
                          </>
                        )}
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}
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
    paddingBottom: 32,
  },

  center: {
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
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  headerContent: {
    flex: 1,
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

  refreshButton: {
    width: 44,
    height: 44,
    marginLeft: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  refreshIcon: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: "600",
  },

  countCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  countNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },

  countLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  activeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
    backgroundColor: colors.primary,
  },

  activeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  sectionHeader: {
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    color: colors.text,
    ...typography.sectionTitle,
  },

  sectionSubtitle: {
    marginTop: 4,
    color: colors.secondaryText,
    fontSize: 13,
    lineHeight: 18,
  },

  empty: {
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: spacing.xl,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIconText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
  },

  emptyTitle: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: spacing.sm,
    maxWidth: 360,
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  browseButton: {
    height: 48,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  browseText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: "700",
  },

  browseArrow: {
    marginLeft: spacing.sm,
    color: colors.card,
    fontSize: 18,
  },

  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  submittedCard: {
    borderColor: "#CFE7D5",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },

  brandAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  brandAvatarText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },

  projectTitle: {
    color: colors.text,
    ...typography.cardTitle,
  },

  client: {
    marginTop: 4,
    color: colors.secondaryText,
    fontSize: 13,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
  },

  statusDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },

  statusText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  sectionLabel: {
    marginTop: spacing.xl,
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  description: {
    marginTop: spacing.sm,
    color: "#4B4B4B",
    fontSize: 14,
    lineHeight: 21,
  },

  detailsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  detailBox: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#F6F6F7",
  },

  detail: {
    marginTop: spacing.md,
  },

  detailLabel: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  detailValue: {
    marginTop: 5,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  requirementsBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  requirements: {
    marginTop: spacing.sm,
    color: "#4B4B4B",
    fontSize: 14,
    lineHeight: 21,
  },

  financeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  financeBox: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#F6F6F7",
  },

  financeValue: {
    marginTop: 5,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  submittedBox: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.input,
    backgroundColor: "#F0F9F2",
  },

  submittedHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  submittedIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: "#DDF1E2",
    justifyContent: "center",
    alignItems: "center",
  },

  submittedIconText: {
    color: colors.success,
    fontSize: 18,
    fontWeight: "800",
  },

  submittedTitle: {
    marginLeft: spacing.sm,
    color: colors.success,
    fontSize: 14,
    fontWeight: "800",
  },

  submittedSubtitle: {
    marginLeft: spacing.sm,
    marginTop: 2,
    color: colors.secondaryText,
    fontSize: 12,
  },

  submittedUrl: {
    marginTop: spacing.md,
    color: "#405060",
    fontSize: 13,
    lineHeight: 20,
  },

  notesBox: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#D9EBDD",
  },

  notesLabel: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  submittedNotes: {
    marginTop: 4,
    color: "#405060",
    fontSize: 13,
    lineHeight: 20,
  },

  submitSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  submitSubtitle: {
    marginTop: 4,
    color: colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
  },

  inputLabel: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
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

  textArea: {
    height: 110,
    paddingTop: spacing.md,
  },

  submitButton: {
    height: 52,
    marginTop: spacing.xl,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitText: {
    color: colors.card,
    fontSize: 15,
    fontWeight: "700",
  },

  submitArrow: {
    marginLeft: spacing.sm,
    color: colors.card,
    fontSize: 19,
  },

  buttonPressed: {
    opacity: 0.85,
  },
});