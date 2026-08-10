import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getToken, getUser } from "../services/auth";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<
    "/" | "/(creator)" | "/(client)"
  >("/");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        const user = await getUser();

        if (token && user?.role === "CREATOR") {
          setRoute("/(creator)");
        } else if (token && user?.role === "CLIENT") {
          setRoute("/(client)");
        } else {
          setRoute("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setRoute("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (route === "/") {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={route} />;
}
