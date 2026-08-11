import {
  ActivityIndicator,
  Alert,
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

      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to load applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading your applications...</Text>
      </View>
    );
  }

  const pendingCount = applications.filter(
    (application) => application.status === "PENDING",
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "ACCEPTED",
  ).length;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>My Applications</Text>

        <Pressable onPress={loadApplications} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>
        Track your applications and campaign decisions.
      </Text>

      {applications.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{applications.length}</Text>

            <Text style={styles.summaryLabel}>Total</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{pendingCount}</Text>

            <Text style={styles.summaryLabel}>Pending</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryNumber}>{acceptedCount}</Text>

            <Text style={styles.summaryLabel}>Accepted</Text>
          </View>
        </View>
      )}

      {applications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No applications yet</Text>

          <Text style={styles.emptyText}>
            Find a campaign and send your first proposal.
          </Text>

          <Pressable
            style={styles.browseButton}
            onPress={() => router.replace("/(creator)")}
          >
            <Text style={styles.browseText}>Browse Campaigns</Text>
          </Pressable>
        </View>
      ) : (
        applications.map((application) => {
          const isAccepted = application.status === "ACCEPTED";

          const isRejected = application.status === "REJECTED";

          const isPending = application.status === "PENDING";

          return (
            <View
              key={application.id}
              style={[
                styles.card,
                isAccepted && styles.acceptedCard,
                isRejected && styles.rejectedCard,
              ]}
            >
              {/* Campaign header */}
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.projectTitle}>
                    {application.project.title}
                  </Text>

                  <Text style={styles.appliedDate}>
                    Applied{" "}
                    {new Date(application.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    isAccepted && styles.acceptedBadge,
                    isRejected && styles.rejectedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isAccepted && styles.acceptedText,
                      isRejected && styles.rejectedText,
                    ]}
                  >
                    {application.status}
                  </Text>
                </View>
              </View>

              {/* Accepted message */}
              {isAccepted && (
                <View style={styles.successBox}>
                  <Text style={styles.successTitle}>🎉 You were selected!</Text>

                  <Text style={styles.successText}>
                    The brand accepted your application. This campaign is now in
                    progress.
                  </Text>
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

              {/* Campaign details */}
              <View style={styles.detailsRow}>
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Campaign budget</Text>

                  <Text style={styles.detailValue}>
                    {application.project.budget
                      ? `₹${application.project.budget.toLocaleString()}`
                      : "Negotiable"}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Your price</Text>

                  <Text style={styles.detailValue}>
                    {application.proposedPrice
                      ? `₹${application.proposedPrice.toLocaleString()}`
                      : "Not specified"}
                  </Text>
                </View>
              </View>

              {application.project.deadline && (
                <View style={styles.deadlineRow}>
                  <Text style={styles.detailLabel}>Campaign deadline</Text>

                  <Text style={styles.deadline}>
                    {new Date(application.project.deadline).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </Text>
                </View>
              )}

              {/* Proposal */}
              <Text style={styles.sectionLabel}>YOUR PROPOSAL</Text>

              <View style={styles.proposalBox}>
                <Text style={styles.proposal}>{application.proposal}</Text>
              </View>

              {/* Current campaign state */}
              <View style={styles.projectState}>
                <Text style={styles.detailLabel}>Campaign status</Text>

                <Text style={styles.projectStatus}>
                  {application.project.status.replace("_", " ")}
                </Text>
              </View>

              {/* Action */}
              {isPending && (
                <Pressable
                  style={styles.viewButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(creator)/project-details",
                      params: {
                        id: String(application.project.id),
                      },
                    })
                  }
                >
                  <Text style={styles.viewButtonText}>View Campaign →</Text>
                </Pressable>
              )}
            </View>
          );
        })
      )}
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

  center: {
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

  back: {
    color: "#555",
    fontSize: 15,
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
  },

  refreshButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  refreshText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
  },

  subtitle: {
    marginTop: 7,
    color: "#777",
    marginBottom: 25,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },

  summaryBox: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    padding: 14,
  },

  summaryNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  summaryLabel: {
    marginTop: 3,
    fontSize: 12,
    color: "#777",
  },

  empty: {
    alignItems: "center",
    paddingTop: 70,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111",
  },

  emptyText: {
    marginTop: 8,
    color: "#777",
    textAlign: "center",
  },

  browseButton: {
    marginTop: 24,
    backgroundColor: "#111",
    paddingHorizontal: 24,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
  },

  browseText: {
    color: "#fff",
    fontWeight: "700",
  },

  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    backgroundColor: "#fff",
  },

  acceptedCard: {
    borderColor: "#cfe5d1",
  },

  rejectedCard: {
    borderColor: "#e5e5e5",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  titleContainer: {
    flex: 1,
  },

  projectTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111",
  },

  appliedDate: {
    marginTop: 5,
    fontSize: 12,
    color: "#888",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
  },

  acceptedBadge: {
    backgroundColor: "#eaf6eb",
  },

  rejectedBadge: {
    backgroundColor: "#f3f3f3",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#777",
  },

  acceptedText: {
    color: "green",
  },

  rejectedText: {
    color: "#777",
  },

  successBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 13,
    backgroundColor: "#f1f8f1",
  },

  successTitle: {
    fontWeight: "800",
    color: "green",
  },

  successText: {
    marginTop: 5,
    lineHeight: 20,
    color: "#456",
  },

  rejectedBox: {
    marginTop: 18,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
  },

  rejectedMessage: {
    color: "#777",
    fontSize: 13,
  },

  detailsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  detailBox: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 13,
  },

  detailLabel: {
    fontSize: 11,
    color: "#888",
  },

  detailValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  deadlineRow: {
    marginTop: 14,
  },

  deadline: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  sectionLabel: {
    marginTop: 20,
    fontSize: 11,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 0.5,
  },

  proposalBox: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fafafa",
  },

  proposal: {
    lineHeight: 21,
    color: "#444",
  },

  projectState: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  projectStatus: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    textTransform: "capitalize",
  },

  viewButton: {
    height: 48,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  viewButtonText: {
    fontWeight: "700",
    color: "#333",
  },
});
