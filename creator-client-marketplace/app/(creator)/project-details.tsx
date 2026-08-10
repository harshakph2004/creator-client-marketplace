import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";


import {
  getProjectById,
  createApplication,
} from "../../services/api";
import { getToken } from "../../services/auth";

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

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [proposal, setProposal] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const token = await getToken();

        if (!token || !id) {
          router.replace("/(auth)/login");
          return;
        }

        const result = await getProjectById(Number(id), token);
        setProject(result.project);
      } catch (error) {
        Alert.alert(
          "Error",
          error instanceof Error
            ? error.message
            : "Failed to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading project...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Project not found.</Text>
      </View>
    );
  }

 const handleApply = async () => {
  if (!proposal.trim()) {
    Alert.alert(
      "Proposal required",
      "Please write a proposal."
    );
    return;
  }

  try {
    const token = await getToken();

    if (!token) {
      router.replace("/(auth)/login");
      return;
    }

    await createApplication(
      {
        projectId: Number(id),
        proposal: proposal.trim(),
        proposedPrice: proposedPrice
          ? Number(proposedPrice)
          : undefined,
      },
      token
    );

    Alert.alert(
      "Application submitted",
      "Your proposal has been sent to the client.",
      [
        {
          text: "Done",
          onPress: () => router.back(),
        },
      ]
    );
  } catch (error) {
    Alert.alert(
      "Application failed",
      error instanceof Error
        ? error.message
        : "Unable to submit application."
    );
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>{project.title}</Text>

      <Text style={styles.client}>
        Posted by {project.client.name}
        {project.client.clientProfile?.companyName
          ? ` • ${project.client.clientProfile.companyName}`
          : ""}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Budget</Text>
          <Text style={styles.infoValue}>
            {project.budget
              ? `₹${project.budget.toLocaleString()}`
              : "Negotiable"}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Deadline</Text>
          <Text style={styles.infoValue}>
            {project.deadline
              ? new Date(project.deadline).toLocaleDateString()
              : "Flexible"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>About the project</Text>

      <Text style={styles.description}>
        {project.description}
      </Text>

      <Text style={styles.sectionTitle}>Your proposal</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Explain why you're a good fit for this project..."
        multiline
        textAlignVertical="top"
        value={proposal}
        onChangeText={setProposal}
      />

      <Text style={styles.sectionTitle}>Your price</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 25000"
        keyboardType="numeric"
        value={proposedPrice}
        onChangeText={setProposedPrice}
      />

      <Pressable style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyText}>Apply Now</Text>
      </Pressable>
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
    fontSize: 16,
    color: "#555",
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
  },

  client: {
    marginTop: 8,
    color: "#777",
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    padding: 16,
  },

  infoLabel: {
    color: "#777",
    fontSize: 13,
  },

  infoValue: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },

  sectionTitle: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
  },

  textArea: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  applyButton: {
    height: 56,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },

  applyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
