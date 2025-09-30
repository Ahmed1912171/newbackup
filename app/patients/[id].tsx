// app/patients/[id].tsx
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";

// ✅ Correct image imports (images are inside app/images/)
const avatarImg = require("../images/avatar.png");
const femaleImg = require("../images/female.png");

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  // 🔹 Mock patient data
  const patient = {
    PATIENT_ID: id,
    PATIENT_FNAME: "John",
    PATIENT_LNAME: "Doe",
    PMR_NO: "MR123456",
    AGE: 45,
    GENDER: "Male",
    diagnosis: "Pneumonia",
    ward: "PICU-2",
    doctor: "Dr. Smith",
    status: "Critical",
  };

  // 🔹 Mock data for Notes, Lab, Radiology
  const mockNotes = [
    { id: 1, date: "2025-09-30", text: "Patient is stable but requires oxygen support." },
    { id: 2, date: "2025-09-29", text: "Initial assessment completed. Fever observed." },
  ];

  const mockLab = [
    { id: 1, test: "CBC", result: "Normal", date: "2025-09-28" },
    { id: 2, test: "Blood Sugar", result: "140 mg/dL", date: "2025-09-28" },
  ];

  const mockRadiology = [
    { id: 1, report_categ: "Chest X-Ray", report_sub: "PA View", report_data: "<p>No infiltrates observed</p>", concl: "<p>Normal lungs</p>" },
  ];

  const [activeTab, setActiveTab] = useState<"notes" | "lab" | "radiology">("notes");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar + Name */}
        <View style={styles.header}>
          <Image
            source={patient.GENDER === "Female" ? femaleImg : avatarImg}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {patient.PATIENT_FNAME} {patient.PATIENT_LNAME}
          </Text>
          <Text style={styles.mr}>MR No: {patient.PMR_NO}</Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>Patient ID:</Text>
          <Text style={styles.value}>{patient.PATIENT_ID}</Text>

          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{patient.AGE}</Text>

          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{patient.GENDER}</Text>

          <Text style={styles.label}>Diagnosis:</Text>
          <Text style={styles.value}>{patient.diagnosis}</Text>

          <Text style={styles.label}>Ward:</Text>
          <Text style={styles.value}>{patient.ward}</Text>

          <Text style={styles.label}>Doctor:</Text>
          <Text style={styles.value}>{patient.doctor}</Text>

          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.status,
              patient.status === "Critical" ? styles.critical : styles.stable,
            ]}
          >
            {patient.status}
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {["notes", "lab", "radiology"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && { color: "#fff", fontWeight: "700" },
                ]}
              >
                {tab === "notes"
                  ? "Notes"
                  : tab === "lab"
                  ? "Lab Reports"
                  : "Radiology"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "notes" &&
            (mockNotes.length > 0 ? (
              mockNotes.map((note) => (
                <View key={note.id} style={styles.card}>
                  <Text style={{ fontWeight: "600" }}>Date: {note.date}</Text>
                  <Text>{note.text}</Text>
                </View>
              ))
            ) : (
              <Text>No notes available.</Text>
            ))}

          {activeTab === "lab" &&
            (mockLab.length > 0 ? (
              mockLab.map((lab) => (
                <View key={lab.id} style={styles.card}>
                  <Text style={{ fontWeight: "600" }}>Test: {lab.test}</Text>
                  <Text>Result: {lab.result}</Text>
                  <Text>Date: {lab.date}</Text>
                </View>
              ))
            ) : (
              <Text>No lab reports available.</Text>
            ))}

          {activeTab === "radiology" &&
            (mockRadiology.length > 0 ? (
              mockRadiology.map((rad) => (
                <View key={rad.id} style={styles.card}>
                  <Text style={{ fontWeight: "600" }}>
                    Category: {rad.report_categ} - {rad.report_sub}
                  </Text>
                  <RenderHtml contentWidth={width} source={{ html: rad.report_data }} />
                  <Text style={{ fontWeight: "700", marginTop: 8 }}>Conclusion</Text>
                  <RenderHtml contentWidth={width} source={{ html: rad.concl }} />
                </View>
              ))
            ) : (
              <Text>No radiology reports available.</Text>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "700" },
  mr: { fontSize: 14, color: "#666" },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  label: { fontWeight: "600", marginTop: 8, fontSize: 14 },
  value: { fontSize: 14, color: "#333" },
  status: { fontWeight: "700", paddingVertical: 4, marginTop: 4 },
  critical: { color: "#b91c1c" },
  stable: { color: "#15803d" },

  tabRow: { flexDirection: "row", marginBottom: 16 },
  tabButton: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#00A652",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#00A652" },
  tabText: { color: "#00A652", fontWeight: "600" },

  tabContent: { marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
});
