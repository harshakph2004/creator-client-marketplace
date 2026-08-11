import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  getClientActiveProjects,
  completeProject,
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

  applications: {
    id: number;
    proposedPrice: number | null;
    proposal: string;

    creator: {
      id: number;
      name: string;
      email: string;

      creatorProfile?: {
        bio: string | null;
        platforms: string | null;
        niches: string | null;
        followers: number | null;
        averageViews: number | null;
        engagementRate: number | null;
        portfolio: string | null;
        location: string | null;
      } | null;
    };
  }[];
};

const colors = Colors.light;

export default function ClientActiveCampaigns() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] =
    useState<number | null>(null);

  const loadProjects = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const result =
        await getClientActiveProjects(token);

      setProjects(result.projects || []);
    } catch (error) {
      console.error(
        "CLIENT ACTIVE CAMPAIGNS ERROR:",
        error,
      );

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

  const handleComplete = async (
    projectId: number,
  ) => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      setCompletingId(projectId);

      console.log(
        "COMPLETING CAMPAIGN:",
        projectId,
      );

      await completeProject(projectId, token);

      console.log(
        "CAMPAIGN COMPLETED:",
        projectId,
      );

      await loadProjects();

      Alert.alert(
        "Campaign completed",
        "The campaign has been marked as completed.",
      );
    } catch (error) {
      console.error(
        "COMPLETE CAMPAIGN ERROR:",
        error,
      );

      Alert.alert(
        "Could not complete campaign",
        error instanceof Error
          ? error.message
          : "Failed to complete campaign.",
      );
    } finally {
      setCompletingId(null);
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
          <Text style={styles.title}>
            Active Campaigns
          </Text>

          <Text style={styles.subtitle}>
            Manage campaigns that are currently in
            progress and review creator submissions.
          </Text>
        </View>

        {/* Count */}

        {projects.length > 0 && (
          <Text style={styles.countText}>
            {projects.length}{" "}
            {projects.length === 1
              ? "active campaign"
              : "active campaigns"}
          </Text>
        )}

        {/* Empty */}

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
              Campaigns become active after you accept
              a creator.
            </Text>

            <Pressable
              style={styles.dashboardButton}
              onPress={() =>
                router.replace("/(client)")
              }
            >
              <Text style={styles.dashboardButtonText}>
                Back to Dashboard
              </Text>
            </Pressable>
          </View>
        ) : (
          projects.map((project) => {
            const application =
              project.applications[0];

            const creator =
              application?.creator;

            const profile =
              creator?.creatorProfile;

            const isCompleting =
              completingId === project.id;

            const creatorInitial =
              creator?.name
                ?.charAt(0)
                .toUpperCase() || "C";

            return (
              <View
                key={project.id}
                style={styles.card}
              >
                {/* Campaign header */}

                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderContent}>
                    <Text style={styles.cardLabel}>
                      ACTIVE CAMPAIGN
                    </Text>

                    <Text
                      style={styles.projectTitle}
                    >
                      {project.title}
                    </Text>
                  </View>

                  <View style={styles.statusBadge}>
                    <View
                      style={styles.statusDot}
                    />

                    <Text
                      style={styles.statusText}
                    >
                      IN PROGRESS
                    </Text>
                  </View>
                </View>

                {/* Creator */}

                {creator && (
                  <View style={styles.creatorCard}>
                    <Text style={styles.sectionLabel}>
                      ACCEPTED CREATOR
                    </Text>

                    <View style={styles.creatorRow}>
                      <View style={styles.avatar}>
                        <Text
                          style={styles.avatarText}
                        >
                          {creatorInitial}
                        </Text>
                      </View>

                      <View style={styles.creatorInfo}>
                        <Text
                          style={styles.creatorName}
                        >
                          {creator.name}
                        </Text>

                        <Text
                          style={styles.creatorEmail}
                        >
                          {creator.email}
                        </Text>

                        {(profile?.platforms ||
                          profile?.niches) && (
                          <Text
                            style={styles.creatorMeta}
                          >
                            {profile?.platforms || ""}
                            {profile?.platforms &&
                            profile?.niches
                              ? " • "
                              : ""}
                            {profile?.niches || ""}
                          </Text>
                        )}
                      </View>
                    </View>

                    {profile?.bio && (
                      <Text style={styles.bio}>
                        {profile.bio}
                      </Text>
                    )}

                    {/* Creator stats */}

                    <View style={styles.statsRow}>
                      {profile?.followers !==
                        null &&
                        profile?.followers !==
                          undefined && (
                          <View
                            style={styles.statBox}
                          >
                            <Text
                              style={
                                styles.statValue
                              }
                            >
                              {profile.followers.toLocaleString()}
                            </Text>

                            <Text
                              style={
                                styles.statLabel
                              }
                            >
                              Followers
                            </Text>
                          </View>
                        )}

                      {profile?.averageViews !==
                        null &&
                        profile?.averageViews !==
                          undefined && (
                          <View
                            style={styles.statBox}
                          >
                            <Text
                              style={
                                styles.statValue
                              }
                            >
                              {profile.averageViews.toLocaleString()}
                            </Text>

                            <Text
                              style={
                                styles.statLabel
                              }
                            >
                              Avg Views
                            </Text>
                          </View>
                        )}

                      {profile?.engagementRate !==
                        null &&
                        profile?.engagementRate !==
                          undefined && (
                          <View
                            style={styles.statBox}
                          >
                            <Text
                              style={
                                styles.statValue
                              }
                            >
                              {
                                profile.engagementRate
                              }
                              %
                            </Text>

                            <Text
                              style={
                                styles.statLabel
                              }
                            >
                              Engagement
                            </Text>
                          </View>
                        )}
                    </View>
                  </View>
                )}

                {/* Campaign details */}

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>
                    CAMPAIGN DETAILS
                  </Text>

                  <Text style={styles.description}>
                    {project.description}
                  </Text>

                  {/* Tags */}

                  <View style={styles.tags}>
                    {project.platform && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>
                          {project.platform}
                        </Text>
                      </View>
                    )}

                    {project.contentType && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>
                          {project.contentType}
                        </Text>
                      </View>
                    )}

                    {project.niche && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>
                          {project.niche}
                        </Text>
                      </View>
                    )}
                  </View>

                  {project.deliverables && (
                    <View style={styles.detailBlock}>
                      <Text
                        style={styles.detailLabel}
                      >
                        REQUIRED DELIVERABLES
                      </Text>

                      <Text
                        style={styles.detailValue}
                      >
                        {project.deliverables}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Price / deadline */}

                <View style={styles.infoRow}>
                  <View style={styles.infoBox}>
                    <Text
                      style={styles.detailLabel}
                    >
                      AGREED PRICE
                    </Text>

                    <Text style={styles.price}>
                      {application?.proposedPrice
                        ? `₹${application.proposedPrice.toLocaleString()}`
                        : "Not specified"}
                    </Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text
                      style={styles.detailLabel}
                    >
                      DEADLINE
                    </Text>

                    <Text
                      style={styles.detailValue}
                    >
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
                        : "Flexible"}
                    </Text>
                  </View>
                </View>

                {/* Deliverable */}

                <View
                  style={styles.deliverableCard}
                >
                  <View
                    style={styles.deliverableHeader}
                  >
                    <View>
                      <Text
                        style={styles.sectionLabel}
                      >
                        CREATOR SUBMISSION
                      </Text>

                      <Text
                        style={
                          styles.deliverableTitle
                        }
                      >
                        {project.deliverableUrl
                          ? "Deliverable submitted"
                          : "Waiting for submission"}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.submissionBadge,
                        project.deliverableUrl
                          ? styles.submittedBadge
                          : styles.waitingBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.submissionBadgeText,
                          project.deliverableUrl
                            ? styles.submittedBadgeText
                            : styles.waitingBadgeText,
                        ]}
                      >
                        {project.deliverableUrl
                          ? "READY"
                          : "PENDING"}
                      </Text>
                    </View>
                  </View>

                  {project.deliverableUrl ? (
                    <>
                      <Pressable
                        style={({ pressed }) => [
                          styles.viewButton,
                          pressed &&
                            styles.buttonPressed,
                        ]}
                        onPress={() =>
                          Linking.openURL(
                            project.deliverableUrl!,
                          )
                        }
                      >
                        <Text
                          style={
                            styles.viewButtonText
                          }
                        >
                          Open Deliverable →
                        </Text>
                      </Pressable>

                      {project.creatorNotes && (
                        <View
                          style={styles.notesBox}
                        >
                          <Text
                            style={
                              styles.notesLabel
                            }
                          >
                            CREATOR NOTES
                          </Text>

                          <Text
                            style={styles.notes}
                          >
                            {project.creatorNotes}
                          </Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <Text
                      style={styles.waitingText}
                    >
                      The creator hasn't submitted
                      the deliverable yet. You'll be
                      able to complete the campaign
                      once it's available.
                    </Text>
                  )}
                </View>

                {/* Complete */}

                <Pressable
                  style={({ pressed }) => [
                    styles.completeButton,
                    (!project.deliverableUrl ||
                      isCompleting) &&
                      styles.disabledButton,
                    pressed &&
                      project.deliverableUrl &&
                      !isCompleting &&
                      styles.buttonPressed,
                  ]}
                  disabled={
                    !project.deliverableUrl ||
                    isCompleting
                  }
                  onPress={() => {
                    console.log(
                      "COMPLETE BUTTON CLICKED",
                      project.id,
                    );

                    handleComplete(
                      project.id,
                    );
                  }}
                >
                  {isCompleting ? (
                    <ActivityIndicator
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={styles.completeText}
                    >
                      Mark Campaign Complete
                    </Text>
                  )}
                </Pressable>

                {!project.deliverableUrl && (
                  <Text
                    style={styles.disabledHint}
                  >
                    Waiting for the creator's
                    deliverable before completion.
                  </Text>
                )}
              </View>
            );
          })
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
    paddingTop: 28,
    paddingBottom: 50,
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

  countText: {
    marginTop: spacing.xl,
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700",
  },

  empty: {
    marginTop: spacing.xxl,
    padding: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIconText: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "800",
  },

  emptyTitle: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: spacing.sm,
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  dashboardButton: {
    height: 48,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  dashboardButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: "700",
  },

  card: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  cardHeaderContent: {
    flex: 1,
    paddingRight: spacing.md,
  },

  cardLabel: {
    color: colors.mutedText,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  projectTitle: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 24,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "#EAF7EE",
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 5,
  },

  statusText: {
    color: colors.success,
    fontSize: 8,
    fontWeight: "800",
  },

  creatorCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.background,
  },

  sectionLabel: {
    color: colors.mutedText,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  creatorRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "800",
  },

  creatorInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  creatorName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },

  creatorEmail: {
    marginTop: 3,
    color: colors.secondaryText,
    fontSize: 12,
  },

  creatorMeta: {
    marginTop: 4,
    color: colors.primary,
    fontSize: 11,
    fontWeight: "600",
  },

  bio: {
    marginTop: spacing.md,
    color: "#4B4B4B",
    fontSize: 13,
    lineHeight: 20,
  },

  statsRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },

  statBox: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.input,
    backgroundColor: colors.card,
  },

  statValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },

  statLabel: {
    marginTop: 3,
    color: colors.mutedText,
    fontSize: 9,
  },

  section: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  description: {
    marginTop: spacing.sm,
    color: "#4B4B4B",
    fontSize: 14,
    lineHeight: 22,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "#EEECFF",
  },

  tagText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },

  detailBlock: {
    marginTop: spacing.lg,
  },

  detailLabel: {
    color: colors.mutedText,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  detailValue: {
    marginTop: 4,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  infoRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
  },

  infoBox: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.background,
  },

  price: {
    marginTop: 5,
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },

  deliverableCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: "#F5F3FF",
  },

  deliverableHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  deliverableTitle: {
    marginTop: 5,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  submissionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },

  submittedBadge: {
    backgroundColor: "#EAF7EE",
  },

  waitingBadge: {
    backgroundColor: "#F3F3F3",
  },

  submissionBadgeText: {
    fontSize: 8,
    fontWeight: "800",
  },

  submittedBadgeText: {
    color: colors.success,
  },

  waitingBadgeText: {
    color: colors.secondaryText,
  },

  waitingText: {
    marginTop: spacing.md,
    color: colors.secondaryText,
    fontSize: 13,
    lineHeight: 20,
  },

  viewButton: {
    height: 48,
    marginTop: spacing.lg,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  viewButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: "700",
  },

  notesBox: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "#DDD9FF",
  },

  notesLabel: {
    color: colors.mutedText,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  notes: {
    marginTop: spacing.sm,
    color: "#4B4B4B",
    fontSize: 13,
    lineHeight: 20,
  },

  completeButton: {
    height: 54,
    marginTop: spacing.lg,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  completeText: {
    color: colors.card,
    fontSize: 15,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.45,
  },

  disabledHint: {
    marginTop: spacing.sm,
    color: colors.mutedText,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },

  buttonPressed: {
    opacity: 0.82,
  },
});