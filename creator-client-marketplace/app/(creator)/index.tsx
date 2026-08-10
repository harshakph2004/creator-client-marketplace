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
  budget: number | null;
  deadline: string | null;
  client: {
    id: number;
    name: string;
    clientProfile?: {
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

      console.log("PROJECTS:", result);

      setProjects(result.projects || []);
    } catch (error) {
      console.error("PROJECT LOAD ERROR:", error);
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
          <Text style={styles.title}>Find Projects</Text>
          <Text style={styles.subtitle}>Find projects and grow your work.</Text>
        </View>

        <Pressable onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.applicationsButton}
        onPress={() => router.push("/(creator)/applications")}
      >
        <Text style={styles.applicationsText}>My Applications</Text>
      </Pressable>
      <Pressable
        style={styles.applicationsButton}
        onPress={() => router.push("/(creator)/profile")}
      >
        <Text style={styles.applicationsText}>My Profile</Text>
      </Pressable>
      <Text style={styles.sectionTitle}>Available Projects</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : projects.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No projects available</Text>

          <Text style={styles.emptyText}>
            New projects posted by clients will appear here.
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
            <Text style={styles.projectTitle}>{project.title}</Text>

            <Text style={styles.client}>Posted by {project.client.name}</Text>

            <Text style={styles.description} numberOfLines={3}>
              {project.description}
            </Text>

            <View style={styles.bottomRow}>
              <Text style={styles.budget}>
                {project.budget
                  ? `₹${project.budget.toLocaleString()}`
                  : "Negotiable"}
              </Text>

              <Text style={styles.view}>View Project →</Text>
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
    paddingBottom: 40,
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "#fff",
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

  description: {
    marginTop: 14,
    lineHeight: 21,
    color: "#444",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  budget: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  view: {
    fontSize: 14,
    fontWeight: "600",
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
  applicationsButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  applicationsText: {
    fontWeight: "700",
    color: "#333",
  },
});
