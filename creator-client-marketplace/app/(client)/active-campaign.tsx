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

export default function ClientActiveCampaigns() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(
    null
  );

  const loadProjects = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const result = await getClientActiveProjects(token);

      setProjects(result.projects || []);
    } catch (error) {
      console.error("CLIENT ACTIVE CAMPAIGNS ERROR:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to load active campaigns."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

 const handleComplete = async (projectId: number) => {
  try {
    const token = await getToken();

    if (!token) {
      router.replace("/(auth)/login");
      return;
    }

    setCompletingId(projectId);

    console.log("COMPLETING CAMPAIGN:", projectId);

    await completeProject(projectId, token);

    console.log("CAMPAIGN COMPLETED:", projectId);

    await loadProjects();

    Alert.alert(
      "Campaign completed",
      "The campaign has been marked as completed."
    );
  } catch (error) {
    console.error("COMPLETE CAMPAIGN ERROR:", error);

    Alert.alert(
      "Could not complete campaign",
      error instanceof Error
        ? error.message
        : "Failed to complete campaign."
    );
  } finally {
    setCompletingId(null);
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading active campaigns...
        </Text>
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

      <Text style={styles.title}>Active Campaigns</Text>

      <Text style={styles.subtitle}>
        Manage campaigns that are currently in progress.
      </Text>

      {projects.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            No active campaigns
          </Text>

          <Text style={styles.emptyText}>
            Campaigns become active after you accept a creator.
          </Text>

          <Pressable
            style={styles.browseButton}
            onPress={() => router.replace("/(client)")}
          >
            <Text style={styles.browseText}>
              Back to Dashboard
            </Text>
          </Pressable>
        </View>
      ) : (
        projects.map((project) => {
          const application = project.applications[0];
          const creator = application?.creator;
          const isCompleting = completingId === project.id;

          return (
            <View
              key={project.id}
              style={styles.card}
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.headerContent}>
                  <Text style={styles.projectTitle}>
                    {project.title}
                  </Text>

                  <Text style={styles.projectStatus}>
                    IN PROGRESS
                  </Text>
                </View>
              </View>

              {/* Creator */}
              {creator && (
                <View style={styles.creatorBox}>
                  <Text style={styles.sectionLabel}>
                    ACCEPTED CREATOR
                  </Text>

                  <Text style={styles.creatorName}>
                    {creator.name}
                  </Text>

                  <Text style={styles.creatorEmail}>
                    {creator.email}
                  </Text>

                  {creator.creatorProfile?.bio && (
                    <Text style={styles.bio}>
                      {creator.creatorProfile.bio}
                    </Text>
                  )}

                  {creator.creatorProfile?.platforms && (
                    <Text style={styles.profileDetail}>
                      Platforms:{" "}
                      {creator.creatorProfile.platforms}
                    </Text>
                  )}

                  {creator.creatorProfile?.niches && (
                    <Text style={styles.profileDetail}>
                      Niches:{" "}
                      {creator.creatorProfile.niches}
                    </Text>
                  )}
                </View>
              )}

              {/* Campaign details */}
              <Text style={styles.sectionLabel}>
                CAMPAIGN DETAILS
              </Text>

              <Text style={styles.description}>
                {project.description}
              </Text>

              <View style={styles.detailsRow}>
                {project.platform && (
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>
                      Platform
                    </Text>

                    <Text style={styles.detailValue}>
                      {project.platform}
                    </Text>
                  </View>
                )}

                {project.contentType && (
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>
                      Content
                    </Text>

                    <Text style={styles.detailValue}>
                      {project.contentType}
                    </Text>
                  </View>
                )}
              </View>

              {project.deliverables && (
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>
                    Required deliverables
                  </Text>

                  <Text style={styles.detailValue}>
                    {project.deliverables}
                  </Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <View>
                  <Text style={styles.detailLabel}>
                    Agreed price
                  </Text>

                  <Text style={styles.price}>
                    {application?.proposedPrice
                      ? `₹${application.proposedPrice.toLocaleString()}`
                      : "Not specified"}
                  </Text>
                </View>

                {project.deadline && (
                  <View>
                    <Text style={styles.detailLabel}>
                      Deadline
                    </Text>

                    <Text style={styles.detailValue}>
                      {new Date(
                        project.deadline
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                )}
              </View>

              {/* Deliverable */}
              <View style={styles.deliverableBox}>
                <Text style={styles.sectionLabel}>
                  CREATOR SUBMISSION
                </Text>

                {project.deliverableUrl ? (
                  <>
                    <Text style={styles.submittedText}>
                      Deliverable submitted
                    </Text>

                    <Pressable
                      style={styles.viewButton}
                      onPress={() =>
                        Linking.openURL(
                          project.deliverableUrl!
                        )
                      }
                    >
                      <Text style={styles.viewButtonText}>
                        Open Deliverable →
                      </Text>
                    </Pressable>

                    {project.creatorNotes && (
                      <>
                        <Text style={styles.notesLabel}>
                          Creator notes
                        </Text>

                        <Text style={styles.notes}>
                          {project.creatorNotes}
                        </Text>
                      </>
                    )}
                  </>
                ) : (
                  <Text style={styles.waitingText}>
                    Waiting for the creator to submit the
                    deliverable.
                  </Text>
                )}
              </View>

              {/* Complete */}
              <Pressable
                style={[
                  styles.completeButton,
                  (!project.deliverableUrl ||
                    isCompleting) &&
                    styles.disabledButton,
                ]}
                disabled={
                  !project.deliverableUrl || isCompleting
                }
                onPress={() =>{
                     console.log("COMPLETE BUTTON CLICKED", project.id);
                  handleComplete(project.id)
                }}
              >
                <Text style={styles.completeText}>
                  {isCompleting
                    ? "Completing..."
                    : "Mark Campaign Complete"}
                </Text>
              </Pressable>
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
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 7,
    marginBottom: 28,
    color: "#777",
  },

  empty: {
    alignItems: "center",
    paddingTop: 70,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  emptyText: {
    marginTop: 8,
    maxWidth: 400,
    textAlign: "center",
    lineHeight: 21,
    color: "#777",
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
    padding: 20,
    marginBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  headerContent: {
    flex: 1,
  },

  projectTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111",
  },

  projectStatus: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "800",
    color: "#777",
  },

  sectionLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 0.5,
  },

  creatorBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f7f7f7",
  },

  creatorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  creatorEmail: {
    marginTop: 4,
    color: "#777",
  },

  bio: {
    marginTop: 10,
    lineHeight: 20,
    color: "#444",
  },

  profileDetail: {
    marginTop: 7,
    color: "#555",
    fontSize: 13,
  },

  description: {
    lineHeight: 22,
    color: "#444",
  },

  detailsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  detailBox: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 13,
  },

  detail: {
    marginTop: 15,
  },

  detailLabel: {
    fontSize: 11,
    color: "#888",
  },

  detailValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  price: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  deliverableBox: {
    marginTop: 22,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#fafafa",
  },

  submittedText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  viewButton: {
    marginTop: 12,
    height: 46,
    borderRadius: 11,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },

  viewButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  notesLabel: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: "700",
    color: "#777",
  },

  notes: {
    marginTop: 6,
    lineHeight: 20,
    color: "#444",
  },

  waitingText: {
    color: "#777",
    lineHeight: 20,
  },

  completeButton: {
    height: 54,
    marginTop: 22,
    borderRadius: 13,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.45,
  },

  completeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});