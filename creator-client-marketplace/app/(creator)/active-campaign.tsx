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

export default function ActiveCampaignScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(
    null
  );

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
          : "Failed to load active campaigns."
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
        "Please enter the URL of your completed work."
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
        token
      );

      Alert.alert(
        "Deliverable submitted",
        "Your work has been sent to the client for review."
      );

      await loadProjects();
    } catch (error) {
      console.error("DELIVERABLE ERROR:", error);

      Alert.alert(
        "Submission failed",
        error instanceof Error
          ? error.message
          : "Unable to submit deliverable."
      );
    } finally {
      setSubmittingId(null);
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
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Active Campaigns</Text>

      <Text style={styles.subtitle}>
        Complete your accepted campaigns and submit your work.
      </Text>

      {projects.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            No active campaigns
          </Text>

          <Text style={styles.emptyText}>
            When a brand accepts your application, your campaign
            will appear here.
          </Text>

          <Pressable
            style={styles.browseButton}
            onPress={() => router.replace("/(creator)")}
          >
            <Text style={styles.browseText}>
              Find Campaigns
            </Text>
          </Pressable>
        </View>
      ) : (
        projects.map((project) => {
          const acceptedApplication =
            project.applications[0];

          const hasSubmitted =
            Boolean(project.deliverableUrl);

          const isSubmitting =
            submittingId === project.id;

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

                  <Text style={styles.client}>
                    {project.client.brandProfile
                      ?.companyName ||
                      project.client.name}
                  </Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    IN PROGRESS
                  </Text>
                </View>
              </View>

              {/* Campaign details */}
              <Text style={styles.sectionLabel}>
                CAMPAIGN
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

              {project.niche && (
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>
                    Niche
                  </Text>

                  <Text style={styles.detailValue}>
                    {project.niche}
                  </Text>
                </View>
              )}

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

              {/* Price */}
              {acceptedApplication && (
                <View style={styles.priceBox}>
                  <Text style={styles.detailLabel}>
                    Agreed price
                  </Text>

                  <Text style={styles.price}>
                    {acceptedApplication.proposedPrice
                      ? `₹${acceptedApplication.proposedPrice.toLocaleString()}`
                      : "Not specified"}
                  </Text>
                </View>
              )}

              {/* Deadline */}
              {project.deadline && (
                <View style={styles.deadlineBox}>
                  <Text style={styles.detailLabel}>
                    Deadline
                  </Text>

                  <Text style={styles.deadline}>
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

              {/* Existing submission */}
              {hasSubmitted ? (
                <View style={styles.submittedBox}>
                  <Text style={styles.submittedTitle}>
                    ✓ Deliverable submitted
                  </Text>

                  <Text style={styles.submittedUrl}>
                    {project.deliverableUrl}
                  </Text>

                  {project.creatorNotes && (
                    <Text style={styles.submittedNotes}>
                      {project.creatorNotes}
                    </Text>
                  )}

                  <Text style={styles.waitingText}>
                    Waiting for the client to review your work.
                  </Text>
                </View>
              ) : (
                <>
                  {/* Submit deliverable */}
                  <Text style={styles.sectionTitle}>
                    Submit your work
                  </Text>

                  <Text style={styles.inputLabel}>
                    Deliverable URL
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="https://drive.google.com/..."
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={urls[project.id] || ""}
                    onChangeText={(value) =>
                      setUrls((previous) => ({
                        ...previous,
                        [project.id]: value,
                      }))
                    }
                  />

                  <Text style={styles.inputLabel}>
                    Notes
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                    ]}
                    placeholder="Tell the client anything they should know..."
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
                    style={[
                      styles.submitButton,
                      isSubmitting &&
                        styles.disabledButton,
                    ]}
                    disabled={isSubmitting}
                    onPress={() =>{
                        console.log("SUBMIT BUTTON CLICKED", project.id);
                      handleSubmit(project.id)
                    }
                    }
                  >
                    <Text style={styles.submitText}>
                      {isSubmitting
                        ? "Submitting..."
                        : "Submit Deliverable"}
                    </Text>
                  </Pressable>
                </>
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
    backgroundColor: "#fff",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  headerContent: {
    flex: 1,
  },

  projectTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111",
  },

  client: {
    marginTop: 5,
    color: "#777",
    fontSize: 14,
  },

  statusBadge: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#555",
  },

  sectionLabel: {
    marginTop: 20,
    fontSize: 11,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 0.5,
  },

  description: {
    marginTop: 8,
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
    marginTop: 14,
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

  requirementsBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fafafa",
  },

  requirements: {
    marginTop: 8,
    lineHeight: 21,
    color: "#444",
  },

  priceBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },

  price: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  deadlineBox: {
    marginTop: 14,
  },

  deadline: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 19,
    fontWeight: "700",
    color: "#111",
  },

  inputLabel: {
    marginTop: 14,
    marginBottom: 7,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#111",
  },

  textArea: {
    height: 120,
    paddingTop: 14,
  },

  submitButton: {
    height: 54,
    marginTop: 22,
    borderRadius: 13,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  submittedBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f1f8f1",
  },

  submittedTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "green",
  },

  submittedUrl: {
    marginTop: 8,
    color: "#333",
    lineHeight: 20,
  },

  submittedNotes: {
    marginTop: 10,
    color: "#555",
    lineHeight: 20,
  },

  waitingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 13,
  },
});