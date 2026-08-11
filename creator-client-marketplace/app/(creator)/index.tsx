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

import { getProjects } from "../../services/api";
import { clearAuth, getToken } from "../../services/auth";

type Project = {
  id: number;
  title: string;
  description: string;
  platform: string | null;
  contentType: string | null;
  niche: string | null;
  deliverables: string | null;
  budget: number | null;
  minFollowers: number | null;
  deadline: string | null;
  client: {
    id: number;
    name: string;
    brandProfile?: {
      companyName: string | null;
    } | null;
  };
};

export default function CreatorHome() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const token = await getToken();

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const result = await getProjects(token);

      console.log("CAMPAIGNS:", result);

      setProjects(result.projects || []);
    } catch (error) {
      console.error("CAMPAIGN LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleLogout = async () => {
    await clearAuth();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Find Campaigns</Text>

          <Text style={styles.subtitle}>
            Find brands and grow your creator business.
          </Text>
        </View>

        <Pressable onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/(creator)/applications")}
        >
          <Text style={styles.actionText}>My Applications</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/(creator)/profile")}
        >
          <Text style={styles.actionText}>My Profile</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/(creator)/active-campaign")}
        >
          <Text style={styles.actionText}>Active Campaigns</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Available Campaigns</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : projects.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No campaigns available</Text>

          <Text style={styles.emptyText}>
            New brand campaigns will appear here.
          </Text>
        </View>
      ) : (
        projects.map((project) => (
          <Pressable
            key={project.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(creator)/project-details",
                params: {
                  id: String(project.id),
                },
              })
            }
          >
            <View style={styles.cardTop}>
              <View style={styles.titleContainer}>
                <Text style={styles.projectTitle}>{project.title}</Text>

                <Text style={styles.client}>
                  {project.client.brandProfile?.companyName ||
                    project.client.name}
                </Text>
              </View>

              {project.platform && (
                <View style={styles.platformBadge}>
                  <Text style={styles.platformText}>{project.platform}</Text>
                </View>
              )}
            </View>

            {project.niche && <Text style={styles.niche}>{project.niche}</Text>}

            <Text style={styles.description} numberOfLines={3}>
              {project.description}
            </Text>

            {(project.contentType || project.deliverables) && (
              <View style={styles.details}>
                {project.contentType && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Content</Text>
                    <Text style={styles.detailValue}>
                      {project.contentType}
                    </Text>
                  </View>
                )}

                {project.deliverables && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Deliverables</Text>
                    <Text style={styles.detailValue} numberOfLines={2}>
                      {project.deliverables}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.stats}>
              {project.minFollowers !== null && (
                <View>
                  <Text style={styles.statLabel}>Minimum followers</Text>

                  <Text style={styles.statValue}>
                    {project.minFollowers.toLocaleString()}+
                  </Text>
                </View>
              )}

              <View>
                <Text style={styles.statLabel}>Budget</Text>

                <Text style={styles.statValue}>
                  {project.budget
                    ? `₹${project.budget.toLocaleString()}`
                    : "Negotiable"}
                </Text>
              </View>

              {project.deadline && (
                <View>
                  <Text style={styles.statLabel}>Deadline</Text>

                  <Text style={styles.statValue}>
                    {new Date(project.deadline).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.viewRow}>
              <Text style={styles.view}>View Campaign →</Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 50,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 6,
    color: "#777",
  },

  logout: {
    color: "#777",
    fontWeight: "600",
  },

  actions: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 22,
},

  actionButton: {
    minWidth: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    fontWeight: "700",
    color: "#333",
  },

  sectionTitle: {
    marginTop: 36,
    marginBottom: 16,
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  client: {
    marginTop: 5,
    fontSize: 13,
    color: "#777",
  },

  platformBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f2f2f2",
  },

  platformText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },

  niche: {
    alignSelf: "flex-start",
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },

  description: {
    marginTop: 14,
    lineHeight: 21,
    color: "#444",
  },

  details: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  detailRow: {
    marginBottom: 10,
  },

  detailLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },

  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  statLabel: {
    fontSize: 11,
    color: "#888",
  },

  statValue: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  viewRow: {
    marginTop: 16,
    alignItems: "flex-end",
  },

  view: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
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
    textAlign: "center",
    color: "#777",
  },
});
