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

import { saveAuth } from "../../services/auth";
import { loginUser } from "../../services/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert(
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      await saveAuth(
        result.token,
        result.user,
      );

      console.log(
        "LOGIN RESPONSE:",
        result,
      );

      if (result.user.role === "CREATOR") {
        router.replace("/(creator)");
      } else {
        router.replace("/(client)");
      }
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to login.",
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
            Welcome back
          </Text>

          <Text style={styles.subtitle}>
            Sign in to connect with brands,
            creators and your active campaigns.
          </Text>
        </View>

        {/* Form */}

        <View style={styles.form}>
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
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
          />

          {/* Login */}

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              loading &&
                styles.disabledButton,
              pressed &&
                !loading &&
                styles.buttonPressed,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text
                  style={
                    styles.loginButtonText
                  }
                >
                  Sign In
                </Text>

                <Text
                  style={styles.loginArrow}
                >
                  →
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Divider */}

        <View style={styles.dividerRow}>
          <View style={styles.divider} />

          <Text style={styles.dividerText}>
            OR
          </Text>

          <View style={styles.divider} />
        </View>

        {/* Register */}

        <Pressable
          style={({ pressed }) => [
            styles.registerButton,
            pressed &&
              styles.buttonPressed,
          ]}
          onPress={() =>
            router.push(
              "/(auth)/register",
            )
          }
        >
          <Text
            style={styles.registerText}
          >
            Create a new account
          </Text>
        </Pressable>

        <Text style={styles.registerHint}>
          Join as a creator or client
        </Text>

        {/* Footer */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to use
            CreatorMatch responsibly and
            professionally.
          </Text>
        </View>
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
    paddingTop: 55,
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
    marginTop: 55,
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
    maxWidth: 360,
  },

  form: {
    marginTop: 30,
  },

  label: {
    marginTop: 18,
    marginBottom: 8,
    color: "#999",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
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

  loginButton: {
    height: 54,
    marginTop: 30,
    borderRadius: 12,
    backgroundColor: "#5B4BFF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  loginArrow: {
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

  dividerRow: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },

  dividerText: {
    marginHorizontal: 12,
    color: "#999",
    fontSize: 10,
    fontWeight: "700",
  },

  registerButton: {
    height: 52,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    color: "#111",
    fontSize: 14,
    fontWeight: "700",
  },

  registerHint: {
    marginTop: 8,
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },

  footer: {
    marginTop: "auto",
    paddingTop: 35,
  },

  footerText: {
    color: "#AAA",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
});