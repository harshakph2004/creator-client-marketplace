import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { registerUser } from "../../services/api";

export default function RegisterScreen() {
  const [role, setRole] = useState<"creator" | "client">("creator");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Missing information", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Invalid password",
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: role === "creator" ? "CREATOR" : "CLIENT",
      });

      Alert.alert("Account created", result.message, [
        {
          text: "Continue",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Registration failed",
        error instanceof Error
          ? error.message
          : "Unable to create your account."
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
      <Text style={styles.title}>Create account</Text>

      <Text style={styles.subtitle}>
        Join the marketplace and get started.
      </Text>

      <Text style={styles.label}>I want to</Text>

      <View style={styles.roleContainer}>
        <Pressable
          style={[
            styles.roleButton,
            role === "creator" && styles.roleSelected,
          ]}
          onPress={() => setRole("creator")}
        >
          <Text
            style={[
              styles.roleText,
              role === "creator" && styles.roleSelectedText,
            ]}
          >
            Find Work
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.roleButton,
            role === "client" && styles.roleSelected,
          ]}
          onPress={() => setRole("client")}
        >
          <Text
            style={[
              styles.roleText,
              role === "client" && styles.roleSelectedText,
            ]}
          >
            Hire Talent
          </Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Full name</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>

      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Create a password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={[
          styles.registerButton,
          loading && styles.registerButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.registerText}>
          {loading ? "Creating..." : "Create Account"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginBold}>Login</Text>
        </Text>
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
    marginBottom: 32,
    fontSize: 15,
    color: "#777",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 18,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },

  roleButton: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  roleSelected: {
    backgroundColor: "#111",
    borderColor: "#111",
  },

  roleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  roleSelectedText: {
    color: "#fff",
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  registerButton: {
    height: 56,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },

  registerButtonDisabled: {
    opacity: 0.6,
  },

  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  loginText: {
    textAlign: "center",
    marginTop: 24,
    color: "#777",
    fontSize: 14,
  },

  loginBold: {
    color: "#111",
    fontWeight: "700",
  },
});