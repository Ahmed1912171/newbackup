import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PatientLabReports() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // 🔹 Fake lab reports data
  const labReports = [
    {
      id: 1,
      date: "2025-09-15",
      test: "Complete Blood Count (CBC)",
      result: "Normal",
    },
    {
      id: 2,
      date: "2025-09-18",
      test: "Blood Sugar (Fasting)",
      result: "110 mg/dL",
    },
    {
      id: 3,
      date: "2025-09-22",
      test: "Liver Function Test",
      result: "Slightly Elevated AST",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Lab Reports for Patient #{id}</Text>

        {labReports.length > 0 ? (
          labReports.map((lab) => (
            <View key={lab.id} style={styles.card}>
              <Text style={styles.labDate}>
                {new Date(lab.date).toLocaleDateString()}
              </Text>
              <Text style={styles.labTest}>{lab.test}</Text>
              <Text style={styles.labResult}>{lab.result}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No lab reports available.</Text>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  labDate: { fontWeight: "600", marginBottom: 6, color: "#555" },
  labTest: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  labResult: { fontSize: 14, color: "#333" },
  noData: { textAlign: "center", color: "#666", marginTop: 20 },
  backButton: {
    backgroundColor: "#00A652",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  backButtonText: { color: "#fff", fontWeight: "600" },
});
