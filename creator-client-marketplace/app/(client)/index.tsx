import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { clearAuth } from "../../services/auth";

const PRIMARY = "#5B4BFF";

export default function ClientHome() {
  const handleLogout = async () => {
    await clearAuth();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              Client Dashboard
            </Text>

            <Text style={styles.subtitle}>
              Manage your campaigns and find great creators.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.avatar,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/(client)/profile")}
          >
            <Text style={styles.avatarText}>C</Text>
          </Pressable>
        </View>

        {/* Main CTA */}

        <Pressable
          style={({ pressed }) => [
            styles.createCard,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            router.push("/(client)/create-project")
          }
        >
          <View style={styles.createIcon}>
            <Text style={styles.plus}>+</Text>
          </View>

          <View style={styles.createContent}>
            <Text style={styles.createTitle}>
              Create a Campaign
            </Text>

            <Text style={styles.createSubtitle}>
              Post an opportunity and find the right
              creator for your brand.
            </Text>
          </View>

          <Text style={styles.arrow}>→</Text>
        </Pressable>

        {/* Quick actions */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Manage Campaigns
          </Text>

          <Text style={styles.sectionSubtitle}>
            Keep track of your creator partnerships.
          </Text>
        </View>

        <View style={styles.grid}>
          {/* Applications */}

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              router.push("/(client)/applications")
            }
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>▤</Text>
            </View>

            <Text style={styles.actionTitle}>
              Applications
            </Text>

            <Text style={styles.actionSubtitle}>
              Review creator proposals
            </Text>

            <Text style={styles.cardArrow}>→</Text>
          </Pressable>

          {/* Active campaigns */}

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              router.push(
                "/(client)/active-campaign",
              )
            }
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>▣</Text>
            </View>

            <Text style={styles.actionTitle}>
              Active Campaigns
            </Text>

            <Text style={styles.actionSubtitle}>
              Track ongoing campaigns
            </Text>

            <Text style={styles.cardArrow}>→</Text>
          </Pressable>

          {/* Brand profile */}

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              router.push("/(client)/profile")
            }
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>●</Text>
            </View>

            <Text style={styles.actionTitle}>
              Brand Profile
            </Text>

            <Text style={styles.actionSubtitle}>
              Manage your company details
            </Text>

            <Text style={styles.cardArrow}>→</Text>
          </Pressable>
        </View>

        {/* Info section */}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Grow your campaigns
            </Text>

            <Text style={styles.infoText}>
              Create clear campaigns with detailed
              requirements to attract better creator
              applications.
            </Text>
          </View>
        </View>

        {/* Logout */}

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </View>
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
    paddingTop: 56,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#737373",
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: PRIMARY,
  },

  createCard: {
    marginTop: 28,
    padding: 20,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
  },

  createIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  plus: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "400",
  },

  createContent: {
    flex: 1,
    marginLeft: 14,
  },

  createTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  createSubtitle: {
    marginTop: 4,
    color: "#EAE8FF",
    fontSize: 12,
    lineHeight: 18,
  },

  arrow: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 24,
  },

  sectionHeader: {
    marginTop: 32,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },

  sectionSubtitle: {
    marginTop: 4,
    color: "#737373",
    fontSize: 13,
  },

  grid: {
    gap: 12,
  },

  actionCard: {
    minHeight: 125,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEECFF",
    justifyContent: "center",
    alignItems: "center",
  },

  iconText: {
    color: PRIMARY,
    fontSize: 18,
    fontWeight: "800",
  },

  actionTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "800",
    color: "#111111",
  },

  actionSubtitle: {
    marginTop: 4,
    paddingRight: 30,
    fontSize: 12,
    lineHeight: 17,
    color: "#737373",
  },

  cardArrow: {
    position: "absolute",
    right: 18,
    bottom: 18,
    color: PRIMARY,
    fontSize: 18,
    fontWeight: "700",
  },

  infoCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#EEECFF",
    flexDirection: "row",
  },

  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#DDD9FF",
    justifyContent: "center",
    alignItems: "center",
  },

  infoIconText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "800",
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    color: "#302A65",
    fontSize: 14,
    fontWeight: "800",
  },

  infoText: {
    marginTop: 4,
    color: "#57506F",
    fontSize: 12,
    lineHeight: 18,
  },

  logoutButton: {
    height: 50,
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.82,
  },
});