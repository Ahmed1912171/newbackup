import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const router = useRouter();

  // 🧪 Fake Data
  useEffect(() => {
    const dummyPatients = [
      { PATIENT_ID: 1, PATIENT_FNAME: "Ahmed", PATIENT_LNAME: "Khan", PMR_NO: "MR1001", GENDER: "Male", EMERGENCY_STATUS: 0, AGE: 25, diagnosis: "Asthma" },
      { PATIENT_ID: 2, PATIENT_FNAME: "Sara", PATIENT_LNAME: "Malik", PMR_NO: "MR1002", GENDER: "Female", EMERGENCY_STATUS: 1, AGE: 30, diagnosis: "Pneumonia" },
      { PATIENT_ID: 3, PATIENT_FNAME: "Ali", PATIENT_LNAME: "Raza", PMR_NO: "MR1003", GENDER: "Male", EMERGENCY_STATUS: 0, AGE: 40, diagnosis: "Diabetes" },
      // ... add more
    ];
    setPatients(dummyPatients);
    setFilteredPatients(dummyPatients);
  }, []);

  // 🔎 Search
  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = patients.filter(
      (p) =>
        `${p.PATIENT_FNAME} ${p.PATIENT_LNAME}`.toLowerCase().includes(lower) ||
        p.PMR_NO.toLowerCase().includes(lower) ||
        p.PATIENT_ID.toString().includes(lower)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const renderPatient = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/patients/[id]",
          params: { id: item.PATIENT_ID, ...item },
        })
      }
    >
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
  source={
    item.GENDER === "Female"
      ? require("../images/female.png")
      : require("../images/avatar.png")
  }
  style={styles.avatarImage}
/>
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.patientName}>
              {item.PATIENT_FNAME} {item.PATIENT_LNAME}
            </Text>
            <Text style={styles.patientMR}>MR: {item.PMR_NO}</Text>
            <Text style={styles.patientMR}>ID: {item.PATIENT_ID}</Text>
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.statusBadge,
              item.EMERGENCY_STATUS === 1 ? styles.critical : styles.stable,
            ]}
          >
            {item.EMERGENCY_STATUS === 1 ? "Critical" : "Stable"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Patients</Text>
        <View style={styles.searchContainer}>
          <Search size={16} color="#454242ff" />
          <TextInput
            placeholder="Search by name, MR, ID"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            keyboardType="default"
          />
        </View>
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.PATIENT_ID.toString()}
        renderItem={renderPatient}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchInput: { flex: 1, paddingVertical: 6, paddingHorizontal: 8 },

  card: {
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 10,
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarImage: { width: 40, height: 40, borderRadius: 20 },
  patientName: { fontWeight: "600" },
  patientMR: { color: "#666", fontSize: 12 },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    textAlign: "center",
  },
  stable: { backgroundColor: "#bbf7d0", color: "#00A652" },
  critical: { backgroundColor: "#fecaca", color: "#991b1b" },
});
