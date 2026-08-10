import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { saveAuth } from "../../services/auth";

import { loginUser } from "../../services/api";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      await saveAuth(result.token, result.user);

      console.log("LOGIN RESPONSE:", result);

      Alert.alert(
        "Welcome back",
        result.message,
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace("/");
            },
          },
        ]
      );
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      Alert.alert(
        "Login failed",
        error instanceof Error
          ? error.message
          : "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>

      <Text style={styles.subtitle}>
        Login to continue to your account.
      </Text>

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
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={[
          styles.loginButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.registerText}>
          Don't have an account?{" "}
          <Text style={styles.bold}>Create one</Text>
        </Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    paddingTop: 80,
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
    color: "#777",
    fontSize: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 18,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  loginButton: {
    height: 56,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  registerText: {
    textAlign: "center",
    marginTop: 24,
    color: "#777",
    fontSize: 14,
  },

  bold: {
    color: "#111",
    fontWeight: "700",
  },

  backText: {
    textAlign: "center",
    marginTop: 32,
    color: "#555",
    fontSize: 15,
  },
});