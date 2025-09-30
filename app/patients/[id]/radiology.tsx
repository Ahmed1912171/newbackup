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

export default function PatientRadiologyReports() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // 🔹 Fake radiology reports data
  const radiologyReports = [
    {
      id: 1,
      date: "2025-09-16",
      type: "Chest X-Ray",
      findings: "Mild infiltration in left lower lobe",
      conclusion: "Suggest monitoring, antibiotics advised",
    },
    {
      id: 2,
      date: "2025-09-20",
      type: "Abdominal Ultrasound",
      findings: "Liver size normal, gallbladder clear",
      conclusion: "No abnormalities detected",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Radiology Reports for Patient #{id}</Text>

        {radiologyReports.length > 0 ? (
          radiologyReports.map((report) => (
            <View key={report.id} style={styles.card}>
              <Text style={styles.reportDate}>
                {new Date(report.date).toLocaleDateString()}
              </Text>
              <Text style={styles.reportType}>{report.type}</Text>
              <Text style={styles.reportFindings}>{report.findings}</Text>
              <Text style={styles.reportConclusion}>
                <Text style={{ fontWeight: "600" }}>Conclusion: </Text>
                {report.conclusion}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No radiology reports available.</Text>
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
  reportDate: { fontWeight: "600", marginBottom: 4, color: "#555" },
  reportType: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  reportFindings: { fontSize: 14, marginBottom: 4 },
  reportConclusion: { fontSize: 14, color: "#333" },
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
