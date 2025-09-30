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

export default function PatientNotesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // 🔹 Fake notes data (replace later with API call)
  const notes = [
    {
      id: 1,
      date: "2025-09-15",
      content: "Patient is stable but requires oxygen monitoring.",
    },
    {
      id: 2,
      date: "2025-09-20",
      content: "Chest X-ray ordered. Possible pneumonia under observation.",
    },
    {
      id: 3,
      date: "2025-09-25",
      content: "Patient responding well to antibiotics, continue IV fluids.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Notes for Patient #{id}</Text>

        {notes.length > 0 ? (
          notes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              <Text style={styles.noteDate}>
                {new Date(note.date).toLocaleDateString()}
              </Text>
              <Text style={styles.noteContent}>{note.content}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noNotes}>No notes available.</Text>
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
  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  noteDate: { fontWeight: "600", marginBottom: 6, color: "#555" },
  noteContent: { fontSize: 14, color: "#333" },
  noNotes: { textAlign: "center", color: "#666", marginTop: 20 },
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
