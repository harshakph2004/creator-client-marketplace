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
  const [platform, setPlatform] = useState("");
  const [contentType, setContentType] = useState("");
  const [niche, setNiche] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [budget, setBudget] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCampaign = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter a campaign title and description."
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
          platform: platform.trim() || undefined,
          contentType: contentType.trim() || undefined,
          niche: niche.trim() || undefined,
          deliverables: deliverables.trim() || undefined,
          budget: budget ? Number(budget) : undefined,
          minFollowers: minFollowers
            ? Number(minFollowers)
            : undefined,
          deadline: deadline || undefined,
        },
        token
      );

      Alert.alert(
        "Campaign created",
        "Your campaign is now available to creators.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(client)"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Could not create campaign",
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
      <Text style={styles.title}>Create Campaign</Text>

      <Text style={styles.subtitle}>
        Tell creators about your promotion campaign and what you
        need from them.
      </Text>

      <Text style={styles.sectionTitle}>Campaign Details</Text>

      <Text style={styles.label}>Campaign title</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Summer Instagram Promotion"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Describe your brand, campaign goals and requirements..."
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.sectionTitle}>Social Media</Text>

      <Text style={styles.label}>Platform</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Instagram, YouTube, TikTok"
        value={platform}
        onChangeText={setPlatform}
      />

      <Text style={styles.label}>Content type</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Reel, Story, Short, Video"
        value={contentType}
        onChangeText={setContentType}
      />

      <Text style={styles.label}>Niche</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Gaming, Fitness, Fashion, Tech"
        value={niche}
        onChangeText={setNiche}
      />

      <Text style={styles.label}>Deliverables</Text>

      <TextInput
        style={[styles.input, styles.description]}
        placeholder={
          "e.g.\n1 Instagram Reel\n2 Stories\nProduct mention"
        }
        multiline
        textAlignVertical="top"
        value={deliverables}
        onChangeText={setDeliverables}
      />

      <Text style={styles.sectionTitle}>Creator Requirements</Text>

      <Text style={styles.label}>Minimum followers</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 20000"
        keyboardType="numeric"
        value={minFollowers}
        onChangeText={setMinFollowers}
      />

      <Text style={styles.sectionTitle}>Budget & Deadline</Text>

      <Text style={styles.label}>Campaign budget (₹)</Text>

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
        onPress={handleCreateCampaign}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Campaign"}
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
    paddingBottom: 50,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: "#777",
    fontSize: 15,
    lineHeight: 21,
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 4,
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
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
    height: 140,
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