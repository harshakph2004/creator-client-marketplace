import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export async function saveAuth(
  token: string,
  user: {
    id: string;
    name: string;
    email: string;
    role: "CREATOR" | "CLIENT";
  }
) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getUser() {
  const user = await SecureStore.getItemAsync(USER_KEY);

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

export async function clearAuth() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}