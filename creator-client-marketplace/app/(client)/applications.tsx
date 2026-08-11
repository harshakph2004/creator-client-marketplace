import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  getClientApplications,
  updateApplicationStatus,
} from "../../services/api";
import { getToken } from "../../services/auth";

import {
  Colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";

type Application = {
  id: number;
  proposal: string;
  proposedPrice: number | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";

  project: {
    id: number;
    title: string;
    budget: number | null;
    status: string;
  };

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
      socialLinks: string | null;
      portfolio: string | null;
      location: string | null;
    } | null;
  };
};

const colors = Colors.light;

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<
    Application[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const loadApplications = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const result =
        await getClientApplications(token);

      setApplications(result.applications || []);
    } catch (error) {
      console.error(
        "APPLICATIONS ERROR:",
        error,
      );

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to load applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const processDecision = async (
    applicationId: number,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      setUpdatingId(applicationId);

      console.log(
        "UPDATING APPLICATION:",
        applicationId,
        status,
      );

      await updateApplicationStatus(
        applicationId,
        status,
        token,
      );

      await loadApplications();

      if (Platform.OS === "web") {
        window.alert(
          status === "ACCEPTED"
            ? "Creator accepted. Campaign is now in progress."
            : "Application rejected.",
        );
      } else {
        Alert.alert(
          "Success",
          status === "ACCEPTED"
            ? "Creator accepted. Campaign is now in progress."
            : "Application rejected.",
        );
      }
    } catch (error) {
      console.error(
        "UPDATE APPLICATION ERROR:",
        error,
      );

      if (Platform.OS === "web") {
        window.alert(
          error instanceof Error
            ? error.message
            : "Failed to update application.",
        );
      } else {
        Alert.alert(
          "Error",
          error instanceof Error
            ? error.message
            : "Failed to update application.",
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDecision = async (
    applicationId: number,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    const action =
      status === "ACCEPTED"
        ? "accept"
        : "reject";

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to ${action} this application?`,
      );

      if (!confirmed) {
        return;
      }

      await processDecision(
        applicationId,
        status,
      );

      return;
    }

    Alert.alert(
      `${
        status === "ACCEPTED"
          ? "Accept"
          : "Reject"
      } application?`,
      `Are you sure you want to ${action} this application?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text:
            status === "ACCEPTED"
              ? "Accept"
              : "Reject",
          style:
            status === "REJECTED"
              ? "destructive"
              : "default",
          onPress: () =>
            processDecision(
              applicationId,
              status,
            ),
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading applications...
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
            Applications
          </Text>

          <Text style={styles.subtitle}>
            Review creators who applied to your
            campaigns and choose the right fit.
          </Text>
        </View>

        {/* Application count */}

        {applications.length > 0 && (
          <View style={styles.countRow}>
            <Text style={styles.countText}>
              {applications.length}{" "}
              {applications.length === 1
                ? "application"
                : "applications"}
            </Text>
          </View>
        )}

        {/* Empty */}

        {applications.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>
                ◌
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              No applications yet
            </Text>

            <Text style={styles.emptyText}>
              Applications from creators will
              appear here once they apply to your
              campaigns.
            </Text>

            <Pressable
              style={styles.emptyButton}
              onPress={() =>
                router.push(
                  "/(client)/create-project",
                )
              }
            >
              <Text
                style={styles.emptyButtonText}
              >
                Create Campaign
              </Text>
            </Pressable>
          </View>
        ) : (
          applications.map((application) => {
            const profile =
              application.creator
                .creatorProfile;

            const isUpdating =
              updatingId ===
              application.id;

            const creatorName =
              application.creator.name;

            const avatarLetter =
              creatorName
                .charAt(0)
                .toUpperCase();

            return (
              <View
                key={application.id}
                style={styles.card}
              >
                {/* Campaign header */}

                <View style={styles.cardHeader}>
                  <View
                    style={
                      styles.titleContainer
                    }
                  >
                    <Text
                      style={styles.campaignLabel}
                    >
                      CAMPAIGN
                    </Text>

                    <Text
                      style={
                        styles.projectTitle
                      }
                    >
                      {
                        application.project
                          .title
                      }
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      application.status ===
                        "ACCEPTED" &&
                        styles.acceptedBadge,
                      application.status ===
                        "REJECTED" &&
                        styles.rejectedBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        application.status ===
                          "ACCEPTED" &&
                          styles.acceptedStatusText,
                        application.status ===
                          "REJECTED" &&
                          styles.rejectedStatusText,
                      ]}
                    >
                      {
                        application.status
                      }
                    </Text>
                  </View>
                </View>

                {/* Creator */}

                <View style={styles.creatorHeader}>
                  <View style={styles.avatar}>
                    <Text
                      style={
                        styles.avatarText
                      }
                    >
                      {avatarLetter}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.creatorHeaderText
                    }
                  >
                    <Text
                      style={
                        styles.creatorName
                      }
                    >
                      {creatorName}
                    </Text>

                    {profile?.platforms && (
                      <Text
                        style={
                          styles.creatorMeta
                        }
                      >
                        {profile.platforms}
                        {profile.niches
                          ? ` • ${profile.niches}`
                          : ""}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Creator profile */}

                <View
                  style={styles.profileSection}
                >
                  <Text
                    style={styles.sectionLabel}
                  >
                    CREATOR PROFILE
                  </Text>

                  {profile?.bio && (
                    <Text
                      style={styles.bio}
                    >
                      {profile.bio}
                    </Text>
                  )}

                  {/* Stats */}

                  <View style={styles.statsRow}>
                    {profile?.followers !==
                      null &&
                      profile?.followers !==
                        undefined && (
                        <View
                          style={styles.stat}
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
                          style={styles.stat}
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
                          style={styles.stat}
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

                  {/* Extra information */}

                  {profile?.location && (
                    <View
                      style={styles.detail}
                    >
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        LOCATION
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {profile.location}
                      </Text>
                    </View>
                  )}

                  {profile?.portfolio && (
                    <View
                      style={styles.detail}
                    >
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        PORTFOLIO
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                        numberOfLines={1}
                      >
                        {profile.portfolio}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Proposal */}

                <View
                  style={styles.proposalSection}
                >
                  <Text
                    style={styles.sectionLabel}
                  >
                    PROPOSAL
                  </Text>

                  <Text
                    style={styles.proposal}
                  >
                    {application.proposal}
                  </Text>
                </View>

                {/* Price */}

                <View style={styles.priceBox}>
                  <View>
                    <Text
                      style={
                        styles.priceLabel
                      }
                    >
                      CREATOR'S PROPOSED PRICE
                    </Text>

                    <Text
                      style={styles.price}
                    >
                      {application.proposedPrice
                        ? `₹${application.proposedPrice.toLocaleString()}`
                        : "Not specified"}
                    </Text>
                  </View>

                  {application.project
                    .budget && (
                    <View
                      style={
                        styles.budgetSide
                      }
                    >
                      <Text
                        style={
                          styles.budgetLabel
                        }
                      >
                        YOUR BUDGET
                      </Text>

                      <Text
                        style={
                          styles.budgetValue
                        }
                      >
                        ₹
                        {application.project.budget.toLocaleString()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Pending actions */}

                {application.status ===
                  "PENDING" && (
                  <View
                    style={styles.actions}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionButton,
                        styles.rejectButton,
                        pressed &&
                          styles.buttonPressed,
                      ]}
                      disabled={
                        isUpdating
                      }
                      onPress={() =>
                        handleDecision(
                          application.id,
                          "REJECTED",
                        )
                      }
                    >
                      <Text
                        style={
                          styles.rejectText
                        }
                      >
                        Reject
                      </Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.actionButton,
                        styles.acceptButton,
                        pressed &&
                          styles.buttonPressed,
                        isUpdating &&
                          styles.disabledButton,
                      ]}
                      disabled={
                        isUpdating
                      }
                      onPress={() =>
                        handleDecision(
                          application.id,
                          "ACCEPTED",
                        )
                      }
                    >
                      {isUpdating ? (
                        <ActivityIndicator
                          color="#FFFFFF"
                        />
                      ) : (
                        <Text
                          style={
                            styles.acceptText
                          }
                        >
                          Accept Creator
                        </Text>
                      )}
                    </Pressable>
                  </View>
                )}

                {/* Accepted */}

                {application.status ===
                  "ACCEPTED" && (
                  <View
                    style={styles.acceptedBox}
                  >
                    <Text
                      style={
                        styles.acceptedIcon
                      }
                    >
                      ✓
                    </Text>

                    <Text
                      style={
                        styles.acceptedBoxText
                      }
                    >
                      Creator accepted for
                      this campaign
                    </Text>
                  </View>
                )}

                {/* Rejected */}

                {application.status ===
                  "REJECTED" && (
                  <View
                    style={styles.rejectedBox}
                  >
                    <Text
                      style={
                        styles.rejectedIcon
                      }
                    >
                      ×
                    </Text>

                    <Text
                      style={
                        styles.rejectedBoxText
                      }
                    >
                      Application rejected
                    </Text>
                  </View>
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

  countRow: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  countText: {
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
    fontSize: 30,
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

  emptyButton: {
    height: 48,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyButtonText: {
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

  titleContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },

  campaignLabel: {
    color: colors.mutedText,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  projectTitle: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 23,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "#F5F5F5",
  },

  acceptedBadge: {
    backgroundColor: "#EAF7EE",
  },

  rejectedBadge: {
    backgroundColor: "#F7F7F7",
  },

  statusText: {
    color: colors.secondaryText,
    fontSize: 9,
    fontWeight: "800",
  },

  acceptedStatusText: {
    color: colors.success,
  },

  rejectedStatusText: {
    color: colors.error,
  },

  creatorHeader: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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

  creatorHeaderText: {
    flex: 1,
    marginLeft: spacing.md,
  },

  creatorName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },

  creatorMeta: {
    marginTop: 4,
    color: colors.secondaryText,
    fontSize: 12,
  },

  profileSection: {
    marginTop: spacing.lg,
  },

  sectionLabel: {
    color: colors.mutedText,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  bio: {
    marginTop: spacing.sm,
    color: "#4B4B4B",
    fontSize: 14,
    lineHeight: 21,
  },

  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  stat: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: colors.background,
  },

  statValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  statLabel: {
    marginTop: 3,
    color: colors.mutedText,
    fontSize: 10,
  },

  detail: {
    marginTop: spacing.md,
  },

  detailLabel: {
    color: colors.mutedText,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  detailValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },

  proposalSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  proposal: {
    marginTop: spacing.sm,
    color: "#4B4B4B",
    fontSize: 14,
    lineHeight: 22,
  },

  priceBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#EEECFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceLabel: {
    color: "#6B6490",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  price: {
    marginTop: 4,
    color: colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },

  budgetSide: {
    alignItems: "flex-end",
  },

  budgetLabel: {
    color: "#6B6490",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  budgetValue: {
    marginTop: 4,
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  actions: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
  },

  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: radius.button,
    justifyContent: "center",
    alignItems: "center",
  },

  rejectButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  acceptButton: {
    backgroundColor: colors.primary,
  },

  rejectText: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "700",
  },

  acceptText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: "700",
  },

  acceptedBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#EAF7EE",
    flexDirection: "row",
    alignItems: "center",
  },

  acceptedIcon: {
    color: colors.success,
    fontSize: 18,
    fontWeight: "800",
    marginRight: spacing.sm,
  },

  acceptedBoxText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "700",
  },

  rejectedBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
  },

  rejectedIcon: {
    color: colors.error,
    fontSize: 18,
    fontWeight: "800",
    marginRight: spacing.sm,
  },

  rejectedBoxText: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "600",
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.82,
  },
});