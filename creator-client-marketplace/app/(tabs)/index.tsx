import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CREATOR × CLIENT</Text>

      <Text style={styles.title}>Marketplace</Text>

      <Text style={styles.subtitle}>
        Connect talented creators with clients who need great work.
      </Text>

      <View style={styles.buttons}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.primaryText}>Find Work</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.secondaryText}>Hire Talent</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginBold}>Login</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "#ffffff",
  },

  logo: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#666666",
    marginBottom: 40,
  },

  buttons: {
    gap: 14,
    marginBottom: 28,
  },

  primaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
  },

  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dddddd",
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "700",
  },

  loginText: {
    textAlign: "center",
    color: "#777777",
    fontSize: 14,
  },

  loginBold: {
    color: "#111111",
    fontWeight: "700",
  },
});
