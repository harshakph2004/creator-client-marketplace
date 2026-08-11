import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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