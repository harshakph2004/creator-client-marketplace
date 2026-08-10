import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { clearAuth } from "../../services/auth";

export default function ClientHome() {
  const handleLogout = async () => {
    await clearAuth();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Client Dashboard</Text>

      <Text style={styles.subtitle}>
        Find creators and hire great talent.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/(client)/create-project")}
      >
        <Text style={styles.buttonText}>+ Create Project</Text>
      </Pressable>
      <Pressable
  style={styles.button}
  onPress={() => router.push("/(client)/applications")}
>
  <Text style={styles.buttonText}>View Applications</Text>
</Pressable>
<Pressable
  style={styles.button}
  onPress={() => router.push("/(client)/profile")}
>
  <Text style={styles.buttonText}>My Brand Profile</Text>
</Pressable>

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },

  subtitle: {
    marginTop: 8,
    color: "#777",
    textAlign: "center",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#111",
    paddingHorizontal: 28,
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutButton: {
    marginTop: 20,
  },

  logoutText: {
    color: "#777",
    fontSize: 15,
  },
});