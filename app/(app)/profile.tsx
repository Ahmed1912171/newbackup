import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { createContext, useContext, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SimpleAvatar from "../../components/SimpleAvatar";
import { useSession } from "../../ctx"; // ✅ Import session

// Context for Dark Mode
export const DarkModeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Example doctor data
const doctor = {
  name: "Dr. Ahmed",
  id: "DOC12345",
  email: "ahmed@example.com",
};

export default function Profile() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toggleDarkMode } = useContext(DarkModeContext) || {};
  const { signOut } = useSession(); // ✅ get signOut from context

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (toggleDarkMode) toggleDarkMode();
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? "#121212" : "#f9fafb" },
      ]}
    >
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <SimpleAvatar
            fallback={doctor.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            size={90}
          />
          <Text style={[styles.name, { color: isDarkMode ? "#fff" : "#111" }]}>
            {doctor.name}
          </Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Feather name="hash" size={20} color="#6b7280" />
            <Text
              style={[
                styles.infoText,
                { color: isDarkMode ? "#fff" : "#111" },
              ]}
            >
              {doctor.id}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={20} color="#6b7280" />
            <Text
              style={[
                styles.infoText,
                { color: isDarkMode ? "#fff" : "#111" },
              ]}
            >
              {doctor.email}
            </Text>
          </View>
        </View>

        {/* Edit Profile */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#3b82f6" }]}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Dark Mode Toggle */}
        <View style={styles.darkModeRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={isDarkMode ? "moon" : "sunny"}
              size={20}
              color={isDarkMode ? "#facc15" : "#f97316"}
              style={{ marginRight: 8 }}
            />
            <Text
              style={[styles.infoLabel, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleToggleDarkMode}
            trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
            thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
          />
        </View>

        {/* ✅ Sign Out */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ef4444" }]}
          onPress={signOut} // useSession signOut
        >
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  profileHeader: { alignItems: "center", marginVertical: 24 },
  name: { fontSize: 26, fontWeight: "700", marginTop: 12 },

  infoContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoText: { fontSize: 16, marginLeft: 12 },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16, marginLeft: 8 },

  darkModeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});
