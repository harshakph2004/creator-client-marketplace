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

  useEffect(() => {
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
          error instanceof Error
            ? error.message
            : "Failed to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>My Applications</Text>

      <Text style={styles.subtitle}>
        Track the projects you've applied to.
      </Text>

      {applications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            No applications yet
          </Text>

          <Text style={styles.emptyText}>
            Apply to projects and they'll appear here.
          </Text>

          <Pressable
            style={styles.browseButton}
            onPress={() => router.replace("/(creator)")}
          >
            <Text style={styles.browseText}>
              Browse Projects
            </Text>
          </Pressable>
        </View>
      ) : (
        applications.map((application) => (
          <View
            key={application.id}
            style={styles.card}
          >
            <View style={styles.topRow}>
              <Text style={styles.projectTitle}>
                {application.project.title}
              </Text>

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

            <Text style={styles.projectStatus}>
              Project: {application.project.status}
            </Text>

            <Text style={styles.label}>Your proposal</Text>

            <Text style={styles.proposal}>
              {application.proposal}
            </Text>

            <View style={styles.bottomRow}>
              <Text style={styles.price}>
                {application.proposedPrice
                  ? `₹${application.proposedPrice.toLocaleString()}`
                  : "Price not specified"}
              </Text>

              {application.project.deadline && (
                <Text style={styles.deadline}>
                  Due{" "}
                  {new Date(
                    application.project.deadline
                  ).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  projectTitle: {
    flex: 1,
    fontSize: 18,
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

  projectStatus: {
    marginTop: 7,
    fontSize: 13,
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

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  price: {
    fontWeight: "700",
    color: "#111",
  },

  deadline: {
    color: "#777",
  },
});
