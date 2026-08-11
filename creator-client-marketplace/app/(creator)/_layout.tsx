import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function CreatorLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#5B4BFF",
        tabBarInactiveTintColor: "#737373",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        // White background without changing the tab bar's
        // native height/touch area.
        tabBarBackground: () => (
          <View
            pointerEvents="none"
            style={styles.tabBarBackground}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="applications"
        options={{
          title: "Applications",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "document-text"
                  : "document-text-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="active-campaign"
        options={{
          title: "Active",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "briefcase"
                  : "briefcase-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "person"
                  : "person-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="project-details"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
});