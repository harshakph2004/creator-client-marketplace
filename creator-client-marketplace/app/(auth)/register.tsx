import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  const [role, setRole] =
    useState<"creator" | "client">("creator");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters.",
      );
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role:
          role === "creator"
            ? "CREATOR"
            : "CLIENT",
      });

      alert(
        result.message ||
          "Your account has been created.",
      );

      router.replace("/(auth)/login");
    } catch (error) {
      console.error(
        "REGISTRATION ERROR:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}

        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>
              C
            </Text>
          </View>

          <Text style={styles.brandName}>
            CreatorMatch
          </Text>
        </View>

        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Create account
          </Text>

          <Text style={styles.subtitle}>
            Join the marketplace and connect
            with brands or creators.
          </Text>
        </View>

        {/* Role */}

        <Text style={styles.label}>
          I WANT TO
        </Text>

        <View style={styles.roleContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.roleButton,
              role === "creator" &&
                styles.roleSelected,
              pressed &&
                styles.buttonPressed,
            ]}
            onPress={() =>
              setRole("creator")
            }
          >
            <View style={styles.roleIcon}>
              <Text
                style={[
                  styles.roleIconText,
                  role === "creator" &&
                    styles.roleIconSelected,
                ]}
              >
                ✦
              </Text>
            </View>

            <View style={styles.roleContent}>
              <Text
                style={[
                  styles.roleTitle,
                  role === "creator" &&
                    styles.roleSelectedText,
                ]}
              >
                Find Work
              </Text>

              <Text
                style={[
                  styles.roleSubtitle,
                  role === "creator" &&
                    styles.roleSelectedSubtext,
                ]}
              >
                I'm a creator
              </Text>
            </View>

            {role === "creator" && (
              <Text style={styles.check}>
                ✓
              </Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.roleButton,
              role === "client" &&
                styles.roleSelected,
              pressed &&
                styles.buttonPressed,
            ]}
            onPress={() =>
              setRole("client")
            }
          >
            <View style={styles.roleIcon}>
              <Text
                style={[
                  styles.roleIconText,
                  role === "client" &&
                    styles.roleIconSelected,
                ]}
              >
                ◈
              </Text>
            </View>

            <View style={styles.roleContent}>
              <Text
                style={[
                  styles.roleTitle,
                  role === "client" &&
                    styles.roleSelectedText,
                ]}
              >
                Hire Talent
              </Text>

              <Text
                style={[
                  styles.roleSubtitle,
                  role === "client" &&
                    styles.roleSelectedSubtext,
                ]}
              >
                I'm a brand
              </Text>
            </View>

            {role === "client" && (
              <Text style={styles.check}>
                ✓
              </Text>
            )}
          </Pressable>
        </View>

        {/* Form */}

        <View style={styles.form}>
          <Text style={styles.label}>
            FULL NAME
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoComplete="name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>
            EMAIL
          </Text>

          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>
            PASSWORD
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.passwordHint}>
            Minimum 6 characters
          </Text>

          {/* Register */}

          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              loading &&
                styles.disabledButton,
              pressed &&
                !loading &&
                styles.buttonPressed,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text
                  style={
                    styles.registerButtonText
                  }
                >
                  Create Account
                </Text>

                <Text
                  style={styles.registerArrow}
                >
                  →
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Login */}

        <View style={styles.loginSection}>
          <Text style={styles.loginHint}>
            Already have an account?
          </Text>

          <Pressable
            onPress={() =>
              router.push(
                "/(auth)/login",
              )
            }
          >
            <Text style={styles.loginButton}>
              Sign in instead
            </Text>
          </Pressable>
        </View>

        {/* Footer */}

        <Text style={styles.footerText}>
          Create your account to start
          collaborating with the CreatorMatch
          marketplace.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 45,
    paddingBottom: 40,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#5B4BFF",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "800",
  },

  brandName: {
    marginLeft: 10,
    color: "#111",
    fontSize: 18,
    fontWeight: "800",
  },

  header: {
    marginTop: 38,
  },

  title: {
    color: "#111",
    fontSize: 32,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 9,
    color: "#737373",
    fontSize: 14,
    lineHeight: 21,
  },

  label: {
    marginTop: 26,
    marginBottom: 9,
    color: "#999",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  roleContainer: {
    gap: 10,
  },

  roleButton: {
    minHeight: 66,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 13,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  roleSelected: {
    backgroundColor: "#EEECFF",
    borderColor: "#5B4BFF",
  },

  roleIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
  },

  roleIconText: {
    color: "#737373",
    fontSize: 17,
    fontWeight: "800",
  },

  roleIconSelected: {
    color: "#5B4BFF",
  },

  roleContent: {
    flex: 1,
    marginLeft: 12,
  },

  roleTitle: {
    color: "#111",
    fontSize: 14,
    fontWeight: "800",
  },

  roleSelectedText: {
    color: "#4B3DE0",
  },

  roleSubtitle: {
    marginTop: 3,
    color: "#999",
    fontSize: 11,
  },

  roleSelectedSubtext: {
    color: "#7169A5",
  },

  check: {
    color: "#5B4BFF",
    fontSize: 18,
    fontWeight: "800",
  },

  form: {
    marginTop: 2,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    color: "#111",
    fontSize: 15,
  },

  passwordHint: {
    marginTop: 7,
    color: "#999",
    fontSize: 11,
  },

  registerButton: {
    height: 54,
    marginTop: 28,
    borderRadius: 12,
    backgroundColor: "#5B4BFF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  registerButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  registerArrow: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 19,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.82,
  },

  loginSection: {
    marginTop: 26,
    alignItems: "center",
  },

  loginHint: {
    color: "#737373",
    fontSize: 13,
  },

  loginButton: {
    marginTop: 6,
    color: "#5B4BFF",
    fontSize: 14,
    fontWeight: "700",
  },

  footerText: {
    marginTop: 30,
    color: "#AAA",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
});