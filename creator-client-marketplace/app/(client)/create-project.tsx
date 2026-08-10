import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";

import { createProject } from "../../services/api";
import { getToken } from "../../services/auth";

export default function CreateProjectScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter a project title and description."
      );
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        Alert.alert("Login required", "Please login again.");
        router.replace("/(auth)/login");
        return;
      }

      await createProject(
        {
          title: title.trim(),
          description: description.trim(),
          budget: budget ? Number(budget) : undefined,
          deadline: deadline || undefined,
        },
        token
      );

      Alert.alert(
        "Project created",
        "Your project is now available to creators.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(client)"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Could not create project",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create Project</Text>

      <Text style={styles.subtitle}>
        Tell creators what you need help with.
      </Text>

      <Text style={styles.label}>Project title</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Build a React Native app"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Describe the project, requirements and expectations..."
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Budget (₹)</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 25000"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />

      <Text style={styles.label}>Deadline</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 2026-09-30"
        value={deadline}
        onChangeText={setDeadline}
      />

      <Pressable
        style={[
          styles.button,
          loading && styles.disabled,
        ]}
        onPress={handleCreateProject}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Project"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 28,
    paddingTop: 70,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    color: "#777",
    fontSize: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 18,
    marginBottom: 8,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111",
  },

  description: {
    height: 150,
    paddingTop: 16,
  },

  button: {
    height: 56,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    alignItems: "center",
    marginTop: 20,
  },

  cancelText: {
    color: "#666",
    fontSize: 15,
  },
});
