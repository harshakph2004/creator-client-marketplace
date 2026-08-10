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
      skills: string | null;
      portfolio: string | null;
      hourlyRate: number | null;
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
        error instanceof Error
          ? error.message
          : "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleDecision = (
    applicationId: number,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    const action = status === "ACCEPTED" ? "accept" : "reject";

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
          onPress: async () => {
            try {
              const token = await getToken();

              if (!token) {
                router.replace("/(auth)/login");
                return;
              }

              setUpdatingId(applicationId);

              await updateApplicationStatus(
                applicationId,
                status,
                token
              );

              await loadApplications();

              Alert.alert(
                "Success",
                status === "ACCEPTED"
                  ? "Creator accepted. Project is now in progress."
                  : "Application rejected."
              );
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error
                  ? error.message
                  : "Failed to update application."
              );
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Applications</Text>

      <Text style={styles.subtitle}>
        Review creators who applied to your projects.
      </Text>

      {applications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            No applications yet
          </Text>

          <Text style={styles.emptyText}>
            Applications from creators will appear here.
          </Text>
        </View>
      ) : (
        applications.map((application) => {
          const isUpdating =
            updatingId === application.id;

          return (
            <View
              key={application.id}
              style={styles.card}
            >
              <View style={styles.topRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projectTitle}>
                    {application.project.title}
                  </Text>

                  <Text style={styles.creator}>
                    {application.creator.name}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.status,
                    application.status === "ACCEPTED" &&
                      styles.accepted,
                    application.status === "REJECTED" &&
                      styles.rejected,
                  ]}
                >
                  {application.status}
                </Text>
              </View>

              {application.creator.creatorProfile
                ?.skills && (
                <Text style={styles.skills}>
                  {application.creator.creatorProfile.skills}
                </Text>
              )}

              <Text style={styles.label}>
                Proposal
              </Text>

              <Text style={styles.proposal}>
                {application.proposal}
              </Text>

              <Text style={styles.price}>
                Proposed price:{" "}
                {application.proposedPrice
                  ? `₹${application.proposedPrice.toLocaleString()}`
                  : "Not specified"}
              </Text>

              {application.status === "PENDING" && (
                <View style={styles.actions}>
                  <Pressable
                    style={[
                      styles.actionButton,
                      styles.rejectButton,
                    ]}
                    disabled={isUpdating}
                    onPress={() =>
                      handleDecision(
                        application.id,
                        "REJECTED"
                      )
                    }
                  >
                    <Text style={styles.rejectText}>
                      Reject
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.actionButton,
                      styles.acceptButton,
                    ]}
                    disabled={isUpdating}
                    onPress={() =>
                      handleDecision(
                        application.id,
                        "ACCEPTED"
                      )
                    }
                  >
                    <Text style={styles.acceptText}>
                      {isUpdating
                        ? "Updating..."
                        : "Accept"}
                    </Text>
                  </Pressable>
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
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  back: {
    color: "#555",
    fontSize: 16,
    marginBottom: 25,
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  projectTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  creator: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: "600",
  },

  skills: {
    marginTop: 6,
    color: "#777",
  },

  label: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: "700",
    color: "#777",
    textTransform: "uppercase",
  },

  proposal: {
    marginTop: 7,
    lineHeight: 21,
    color: "#444",
  },

  price: {
    marginTop: 16,
    fontWeight: "700",
    color: "#111",
  },

  status: {
    fontSize: 12,
    fontWeight: "800",
    color: "#777",
  },

  accepted: {
    color: "green",
  },

  rejected: {
    color: "red",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  actionButton: {
    flex: 1,
    height: 48,
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
});