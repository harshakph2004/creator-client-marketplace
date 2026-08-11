import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { getCreatorApplications } from "../../services/api";
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
  createdAt: string;

  project: {
    id: number;
    title: string;
    description: string;
    budget: number | null;
    deadline: string | null;
    status: string;
  };
};

const colors = Colors.light;

export default function CreatorApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const result = await getCreatorApplications(token);

      setApplications(result.applications || []);
    } catch (error) {
      console.error("CREATOR APPLICATIONS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const pendingCount = applications.filter(
    (application) => application.status === "PENDING",
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "ACCEPTED",
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "REJECTED",
  ).length;

  const getStatusStyle = (status: Application["status"]) => {
    switch (status) {
      case "ACCEPTED":
        return {
          badge: styles.acceptedBadge,
          text: styles.acceptedText,
        };

      case "REJECTED":
        return {
          badge: styles.rejectedBadge,
          text: styles.rejectedText,
        };

      default:
        return {
          badge: styles.pendingBadge,
          text: styles.pendingText,
        };
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
          Loading your applications...
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
              My Applications
            </Text>

            <Text style={styles.subtitle}>
              Track your proposals and campaign decisions.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={loadApplications}
          >
            <Text style={styles.refreshIcon}>↻</Text>
          </Pressable>
        </View>

        {/* Summary */}

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {applications.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Total
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {pendingCount}
            </Text>

            <Text style={styles.summaryLabel}>
              Pending
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {acceptedCount}
            </Text>

            <Text style={styles.summaryLabel}>
              Accepted
            </Text>
          </View>
        </View>

        {/* Applications section */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Your Applications
          </Text>

          <Text style={styles.sectionSubtitle}>
            Keep track of every campaign you applied to.
          </Text>
        </View>

        {/* Empty state */}

        {applications.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>
                ▣
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              No applications yet
            </Text>

            <Text style={styles.emptyText}>
              Find a campaign and send your first proposal.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.browseButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.replace("/(creator)")}
            >
              <Text style={styles.browseText}>
                Browse Campaigns
              </Text>

              <Text style={styles.browseArrow}>
                →
              </Text>
            </Pressable>
          </View>
        ) : (
          applications.map((application) => {
            const isAccepted =
              application.status === "ACCEPTED";

            const isRejected =
              application.status === "REJECTED";

            const isPending =
              application.status === "PENDING";

            const statusStyle = getStatusStyle(
              application.status,
            );

            return (
              <View
                key={application.id}
                style={[
                  styles.card,
                  isAccepted && styles.acceptedCard,
                ]}
              >
                {/* Campaign header */}

                <View style={styles.cardHeader}>
                  <View style={styles.titleContainer}>
                    <Text
                      style={styles.projectTitle}
                      numberOfLines={2}
                    >
                      {application.project.title}
                    </Text>

                    <Text style={styles.appliedDate}>
                      Applied{" "}
                      {new Date(
                        application.createdAt,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      statusStyle.badge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        statusStyle.text,
                      ]}
                    >
                      {application.status}
                    </Text>
                  </View>
                </View>

                {/* Accepted message */}

                {isAccepted && (
                  <View style={styles.successBox}>
                    <View style={styles.successIcon}>
                      <Text style={styles.successIconText}>
                        ✓
                      </Text>
                    </View>

                    <View style={styles.successContent}>
                      <Text style={styles.successTitle}>
                        You were selected!
                      </Text>

                      <Text style={styles.successText}>
                        The brand accepted your application.
                        This campaign is now in progress.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Rejected message */}

                {isRejected && (
                  <View style={styles.rejectedBox}>
                    <Text style={styles.rejectedMessage}>
                      This application was not selected.
                    </Text>
                  </View>
                )}

                {/* Campaign financial details */}

                <View style={styles.detailsRow}>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>
                      CAMPAIGN BUDGET
                    </Text>

                    <Text style={styles.detailValue}>
                      {application.project.budget
                        ? `₹${application.project.budget.toLocaleString()}`
                        : "Negotiable"}
                    </Text>
                  </View>

                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>
                      YOUR PRICE
                    </Text>

                    <Text style={styles.detailValue}>
                      {application.proposedPrice
                        ? `₹${application.proposedPrice.toLocaleString()}`
                        : "Not specified"}
                    </Text>
                  </View>
                </View>

                {/* Deadline */}

                {application.project.deadline && (
                  <View style={styles.deadlineRow}>
                    <Text style={styles.detailLabel}>
                      CAMPAIGN DEADLINE
                    </Text>

                    <Text style={styles.deadline}>
                      {new Date(
                        application.project.deadline,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                )}

                {/* Proposal */}

                <Text style={styles.sectionLabel}>
                  YOUR PROPOSAL
                </Text>

                <View style={styles.proposalBox}>
                  <Text style={styles.proposal}>
                    {application.proposal}
                  </Text>
                </View>

                {/* Campaign status */}

                <View style={styles.projectState}>
                  <View>
                    <Text style={styles.detailLabel}>
                      CAMPAIGN STATUS
                    </Text>

                    <Text style={styles.projectStatus}>
                      {application.project.status.replace(
                        "_",
                        " ",
                      )}
                    </Text>
                  </View>

                  {isPending && (
                    <View style={styles.pendingDot} />
                  )}
                </View>

                {/* Action */}

                {isPending && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.viewButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname:
                          "/(creator)/project-details",
                        params: {
                          id: String(
                            application.project.id,
                          ),
                        },
                      })
                    }
                  >
                    <Text style={styles.viewButtonText}>
                      View Campaign
                    </Text>

                    <Text style={styles.viewArrow}>
                      →
                    </Text>
                  </Pressable>
                )}

                {isAccepted && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.viewButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() =>
                      router.push(
                        "/(creator)/active-campaign",
                      )
                    }
                  >
                    <Text style={styles.viewButtonText}>
                      View Active Campaign
                    </Text>

                    <Text style={styles.viewArrow}>
                      →
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })
        )}

        {/* Rejected count */}

        {applications.length > 0 &&
          rejectedCount > 0 && (
            <Text style={styles.rejectedSummary}>
              {rejectedCount} rejected application
              {rejectedCount !== 1 ? "s" : ""}
            </Text>
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

  summaryRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },

  summaryCard: {
    flex: 1,
    minHeight: 82,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },

  summaryLabel: {
    marginTop: 4,
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "600",
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

  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },

  acceptedCard: {
    borderColor: "#CFE7D5",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },

  titleContainer: {
    flex: 1,
  },

  projectTitle: {
    color: colors.text,
    ...typography.cardTitle,
  },

  appliedDate: {
    marginTop: 5,
    color: colors.mutedText,
    fontSize: 12,
  },

  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },

  pendingBadge: {
    backgroundColor: "#EEECFF",
  },

  acceptedBadge: {
    backgroundColor: "#EAF7EE",
  },

  rejectedBadge: {
    backgroundColor: "#F1F1F2",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  pendingText: {
    color: colors.primary,
  },

  acceptedText: {
    color: colors.success,
  },

  rejectedText: {
    color: colors.secondaryText,
  },

  successBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#F0F9F2",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  successIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: "#DDF1E2",
    justifyContent: "center",
    alignItems: "center",
  },

  successIconText: {
    color: colors.success,
    fontSize: 17,
    fontWeight: "800",
  },

  successContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  successTitle: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "800",
  },

  successText: {
    marginTop: 4,
    color: "#456",
    fontSize: 13,
    lineHeight: 19,
  },

  rejectedBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#F5F5F5",
  },

  rejectedMessage: {
    color: colors.secondaryText,
    fontSize: 13,
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

  detailLabel: {
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  detailValue: {
    marginTop: 5,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  deadlineRow: {
    marginTop: spacing.md,
  },

  deadline: {
    marginTop: 4,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  sectionLabel: {
    marginTop: spacing.xl,
    color: colors.mutedText,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  proposalBox: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.input,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  proposal: {
    color: "#4B4B4B",
    fontSize: 14,
    lineHeight: 21,
  },

  projectState: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  projectStatus: {
    marginTop: 4,
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  pendingDot: {
    width: 9,
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },

  viewButton: {
    height: 48,
    marginTop: spacing.lg,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  viewButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: "700",
  },

  viewArrow: {
    marginLeft: spacing.sm,
    color: colors.card,
    fontSize: 18,
  },

  buttonPressed: {
    opacity: 0.85,
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
    fontSize: 22,
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
    lineHeight: 20,
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

  rejectedSummary: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    color: colors.mutedText,
    fontSize: 12,
    textAlign: "center",
  },
});