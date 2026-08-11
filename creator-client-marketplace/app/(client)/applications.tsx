import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  getClientApplications,
  updateApplicationStatus,
} from "../../services/api";
import { getToken } from "../../services/auth";

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

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadApplications = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const result = await getClientApplications(token);

      setApplications(result.applications || []);
    } catch (error) {
      console.error("APPLICATIONS ERROR:", error);

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

      console.log("UPDATING APPLICATION:", applicationId, status);

      await updateApplicationStatus(applicationId, status, token);

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
      console.error("UPDATE APPLICATION ERROR:", error);

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
    const action = status === "ACCEPTED" ? "accept" : "reject";

    // Web confirmation
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to ${action} this application?`,
      );

      if (!confirmed) {
        return;
      }

      await processDecision(applicationId, status);
      return;
    }

    // Android / iOS confirmation
    Alert.alert(
      `${status === "ACCEPTED" ? "Accept" : "Reject"} application?`,
      `Are you sure you want to ${action} this application?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: status === "ACCEPTED" ? "Accept" : "Reject",
          style: status === "REJECTED" ? "destructive" : "default",
          onPress: () => processDecision(applicationId, status),
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Loading applications...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Applications</Text>

      <Text style={styles.subtitle}>
        Review creators who applied to your campaigns.
      </Text>

      {applications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No applications yet</Text>

          <Text style={styles.emptyText}>
            Applications from creators will appear here.
          </Text>
        </View>
      ) : (
        applications.map((application) => {
          const profile = application.creator.creatorProfile;

          const isUpdating = updatingId === application.id;

          return (
            <View key={application.id} style={styles.card}>
              {/* Campaign + Status */}
              <View style={styles.topRow}>
                <View style={styles.titleContainer}>
                  <Text style={styles.projectTitle}>
                    {application.project.title}
                  </Text>

                  <Text style={styles.creatorName}>
                    {application.creator.name}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.status,
                    application.status === "ACCEPTED" && styles.accepted,
                    application.status === "REJECTED" && styles.rejected,
                  ]}
                >
                  {application.status}
                </Text>
              </View>

              {/* Creator information */}
              <View style={styles.creatorInfo}>
                <Text style={styles.sectionLabel}>CREATOR PROFILE</Text>

                {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}

                <View style={styles.statsRow}>
                  {profile?.followers !== null &&
                    profile?.followers !== undefined && (
                      <View style={styles.stat}>
                        <Text style={styles.statValue}>
                          {profile.followers.toLocaleString()}
                        </Text>

                        <Text style={styles.statLabel}>Followers</Text>
                      </View>
                    )}

                  {profile?.averageViews !== null &&
                    profile?.averageViews !== undefined && (
                      <View style={styles.stat}>
                        <Text style={styles.statValue}>
                          {profile.averageViews.toLocaleString()}
                        </Text>

                        <Text style={styles.statLabel}>Avg Views</Text>
                      </View>
                    )}

                  {profile?.engagementRate !== null &&
                    profile?.engagementRate !== undefined && (
                      <View style={styles.stat}>
                        <Text style={styles.statValue}>
                          {profile.engagementRate}%
                        </Text>

                        <Text style={styles.statLabel}>Engagement</Text>
                      </View>
                    )}
                </View>

                {profile?.platforms && (
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Platforms</Text>

                    <Text style={styles.detailValue}>{profile.platforms}</Text>
                  </View>
                )}

                {profile?.niches && (
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Niches</Text>

                    <Text style={styles.detailValue}>{profile.niches}</Text>
                  </View>
                )}

                {profile?.location && (
                  <View style={styles.detail}>
                    <Text style={styles.detailLabel}>Location</Text>

                    <Text style={styles.detailValue}>{profile.location}</Text>
                  </View>
                )}
              </View>

              {/* Proposal */}
              <Text style={styles.sectionLabel}>PROPOSAL</Text>

              <Text style={styles.proposal}>{application.proposal}</Text>

              {/* Price */}
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Creator's proposed price</Text>

                <Text style={styles.price}>
                  {application.proposedPrice
                    ? `₹${application.proposedPrice.toLocaleString()}`
                    : "Not specified"}
                </Text>
              </View>

              {/* Actions */}
              {application.status === "PENDING" && (
                <View style={styles.actions}>
                  <Pressable
                    style={[styles.actionButton, styles.rejectButton]}
                    disabled={isUpdating}
                    onPress={() => handleDecision(application.id, "REJECTED")}
                  >
                    <Text style={styles.rejectText}>Reject</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.acceptButton]}
                    disabled={isUpdating}
                    onPress={() => {
                      console.log("ACCEPT BUTTON CLICKED", application.id);
                      handleDecision(application.id, "ACCEPTED");
                    }}
                  >
                    <Text style={styles.acceptText}>
                      {isUpdating ? "Updating..." : "Accept Creator"}
                    </Text>
                  </Pressable>
                </View>
              )}

              {application.status === "ACCEPTED" && (
                <View style={styles.acceptedBox}>
                  <Text style={styles.acceptedBoxText}>
                    ✓ Creator accepted for this campaign
                  </Text>
                </View>
              )}

              {application.status === "REJECTED" && (
                <View style={styles.rejectedBox}>
                  <Text style={styles.rejectedBoxText}>
                    Application rejected
                  </Text>
                </View>
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

  back: {
    color: "#555",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 7,
    color: "#777",
    marginBottom: 30,
  },

  empty: {
    alignItems: "center",
    paddingTop: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  emptyText: {
    marginTop: 8,
    color: "#777",
    textAlign: "center",
  },

  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    backgroundColor: "#fff",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  titleContainer: {
    flex: 1,
  },

  projectTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  creatorName: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  status: {
    fontSize: 11,
    fontWeight: "800",
    color: "#777",
  },

  accepted: {
    color: "green",
  },

  rejected: {
    color: "red",
  },

  creatorInfo: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 0.5,
  },

  bio: {
    marginTop: 8,
    lineHeight: 21,
    color: "#444",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  stat: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
  },

  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },

  statLabel: {
    marginTop: 3,
    fontSize: 11,
    color: "#777",
  },

  detail: {
    marginTop: 12,
  },

  detailLabel: {
    fontSize: 11,
    color: "#888",
  },

  detailValue: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  proposal: {
    marginTop: 8,
    lineHeight: 22,
    color: "#444",
  },

  priceBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },

  priceLabel: {
    fontSize: 12,
    color: "#777",
  },

  price: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  rejectButton: {
    borderWidth: 1,
    borderColor: "#ddd",
  },

  acceptButton: {
    backgroundColor: "#111",
  },

  rejectText: {
    fontWeight: "700",
    color: "#555",
  },

  acceptText: {
    fontWeight: "700",
    color: "#fff",
  },

  acceptedBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f1f8f1",
  },

  acceptedBoxText: {
    color: "green",
    fontWeight: "700",
  },

  rejectedBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fafafa",
  },

  rejectedBoxText: {
    color: "#777",
    fontWeight: "600",
  },
});
