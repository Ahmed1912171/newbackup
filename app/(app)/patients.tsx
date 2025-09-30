import axios from "axios";
import { Eye, FileText, Search } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import Modal from "react-native-modal";
import RenderHtml from "react-native-render-html";

export default function PatientsScreen() {
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [modalType, setModalType] = useState<
    "notes" | "lab" | "radiology" | null
  >(null);

  const [notes, setNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);

  const { width } = useWindowDimensions();

  // 🖥️ API URL
  const LOCAL_IP = "192.168.100.102"; // change to your PC's LAN IP
  const API_URL =
    Platform.OS === "android"
      ? "http://10.0.2.2:3000/patients_picu"
      : `http://${LOCAL_IP}:3000/patients_picu`;

  // ✅ Wrapped in useCallback so it’s stable
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);

      // ✅ Remove duplicate MR numbers
      const uniquePatients = res.data.reduce((acc: any[], curr: any) => {
        if (!acc.find((p) => p.PMR_NO === curr.PMR_NO)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      setPatients(uniquePatients);
    } catch (err) {
      console.error("❌ Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Fetch notes by PATIENT_ID
  const fetchNotes = async (patientId: number) => {
    try {
      setNotesLoading(true);
      const url =
        Platform.OS === "android"
          ? `http://10.0.2.2:3000/patients/${patientId}/notes`
          : `http://${LOCAL_IP}:3000/patients/${patientId}/notes`;

      const res = await axios.get(url);
      setNotes(res.data);
    } catch (err) {
      console.error("❌ Error fetching notes:", err);
      setNotes([]);
    } finally {
      setNotesLoading(false);
    }
  };

  // ✅ Now has fetchPatients in dependency array
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Filter patients by name, MR, or PATIENT_ID
  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = patients
      .map((p) => ({
        ...p,
        name: `${p.PATIENT_FNAME} ${p.PATIENT_LNAME}`.trim(),
        mrNumber: p.PMR_NO,
        patientId: p.PATIENT_ID,
        status: p.EMERGENCY_STATUS === 1 ? "Critical" : "Stable",
        diagnosis: p.diagnosis || "",
        ward: p.WARD_ID,
        doctor: p.DOCTOR_ID,
      }))
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.mrNumber?.toString().toLowerCase().includes(lower) ||
          p.patientId?.toString().includes(lower)
      );
    setFilteredPatients(filtered);
  }, [patients, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients().finally(() => setRefreshing(false));
  };

  // Open modal and fetch notes if needed
  const openModal = (patient: any, type: "notes" | "lab" | "radiology") => {
    setSelectedPatient(patient);
    setModalType(type);

    if (type === "notes") {
      fetchNotes(patient.PATIENT_ID);
    }
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setModalType(null);
    setNotes([]); // reset notes
  };

  const renderPatient = ({ item }: { item: any }) => (
    <View style={styles.card}>
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
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientMR}>MR: {item.mrNumber}</Text>
            <Text style={styles.patientMR}>ID: {item.patientId}</Text>
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.statusBadge,
              item.status === "Critical" ? styles.critical : styles.stable,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Diagnosis:</Text>
        <Text style={styles.infoValue}>{item.diagnosis || "N/A"}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openModal(item, "notes")}
        >
          <Eye size={16} color="#fff" />
          <Text style={styles.buttonText}>Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => openModal(item, "lab")}
        >
          <FileText size={16} color="#fff" />
          <Text style={styles.buttonText}>Lab Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => openModal(item, "radiology")}
        >
          <FileText size={16} color="#fff" />
          <Text style={styles.buttonText}>Radiology</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Modal content
  const renderModalContent = () => {
    if (!selectedPatient || !modalType) return null;

    return (
      <>
        <Image
          source={
            selectedPatient.GENDER === "Female"
              ? require("../images/female.png")
              : require("../images/avatar.png")
          }
          style={styles.modalAvatar}
        />
        <Text style={styles.modalTitle}>{selectedPatient.name}</Text>
        <Text>Age: {selectedPatient.AGE || "N/A"}</Text>
        <Text>
          Phone:{" "}
          {selectedPatient.PHONE_NO || selectedPatient.MOBILE_NO || "N/A"}
        </Text>
        <Text>Diagnosis: {selectedPatient.diagnosis || "N/A"}</Text>
        <Text>Ward: {selectedPatient.ward}</Text>
        <Text>Doctor: {selectedPatient.doctor}</Text>
        <Text>Status: {selectedPatient.status}</Text>

        {/* Notes Modal */}
        {modalType === "notes" && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>
              Patient Notes:
            </Text>

            {notesLoading ? (
              <ActivityIndicator size="small" color="#00A652" />
            ) : notes.length > 0 ? (
              notes.map((note: any) => (
                <View
                  key={note.Loc_ID}
                  style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: 6,
                    padding: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontWeight: "500" }}>
                    Date:{" "}
                    {note.loc_ex_date
                      ? new Date(note.loc_ex_date).toLocaleDateString()
                      : "N/A"}
                  </Text>
                  <Text style={{ marginTop: 4 }}>
                    {note.LocalExamination || "No details provided"}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No notes available.</Text>
            )}
          </View>
        )}

        {/* Lab Modal */}
        {modalType === "lab" && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>
              Lab Reports:
            </Text>
            <Text>Lab results will be shown here.</Text>
          </View>
        )}

        {/* Radiology Modal */}
        {modalType === "radiology" && selectedPatient.radiology && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "700", marginBottom: 6 }}>
              Radiology Report ({selectedPatient.radiology.report_categ} -{" "}
              {selectedPatient.radiology.report_sub})
            </Text>

            <RenderHtml
              contentWidth={width}
              source={{ html: selectedPatient.radiology.report_data }}
            />

            <Text
              style={{
                fontWeight: "700",
                marginTop: 12,
                marginBottom: 6,
              }}
            >
              Conclusion
            </Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: selectedPatient.radiology.concl }}
            />
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patients (PICU)</Text>
        <View style={styles.searchContainer}>
          <Search size={16} color="#454242ff" />
          <TextInput
            placeholder="Search by name, MR, ID"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.PATIENT_ID.toString()}
        renderItem={renderPatient}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#00A652"]}
          />
        }
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#00A652" /> : null
        }
      />

      {/* Smooth Modal */}
      <Modal
        isVisible={!!modalType}
        onBackdropPress={closeModal}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={300}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
      >
        <View style={styles.modalContent}>
          <ScrollView>{renderModalContent()}</ScrollView>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    marginBottom: 8,
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

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  infoLabel: { fontWeight: "600" },
  infoValue: { color: "#444" },

  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#00A652",
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  buttonText: { color: "#fff", marginLeft: 4 },

  modal: { justifyContent: "center", margin: 16 },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  modalAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  closeButton: {
    backgroundColor: "#00A652",
    borderRadius: 6,
    padding: 10,
    marginTop: 12,
  },
});
