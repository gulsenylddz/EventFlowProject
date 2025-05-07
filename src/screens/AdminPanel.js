import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, Alert, ScrollView } from 'react-native';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    category: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, 'events'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(data);
  };

  const handleDelete = (eventId) => {
    Alert.alert('Etkinliği Sil', 'Bu etkinliği silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'events', eventId));
          fetchEvents();
        },
      },
    ]);
  };

  const openModalForNew = () => {
    setEditingEvent(null);
    setForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      image: '',
      category: '',
    });
    setModalVisible(true);
  };

  const openModalForEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      category: event.category,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Hata', 'Başlık boş olamaz!');
      return;
    }

    if (editingEvent) {
      // Güncelleme
      await updateDoc(doc(db, 'events', editingEvent.id), form);
      Alert.alert('Başarılı', 'Etkinlik güncellendi!');
    } else {
      // Yeni ekleme
      await addDoc(collection(db, 'events'), form);
      Alert.alert('Başarılı', 'Etkinlik eklendi!');
    }

    setModalVisible(false);
    fetchEvents();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Panel</Text>

      <TouchableOpacity style={styles.addButton} onPress={openModalForNew}>
        <Text style={styles.addButtonText}>+  Etkinlik Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => openModalForEdit(item)}>
                <Text style={styles.buttonText}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingEvent ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur'}</Text>

          <TextInput style={styles.input} placeholder="Başlık Ekleyin..." placeholderTextColor= 'rgb(165, 158, 180)' value={form.title} onChangeText={(text) => setForm({ ...form, title: text })} />
          <TextInput style={styles.input} placeholder="Açıklama" placeholderTextColor= 'rgb(165, 158, 180)'value={form.description} onChangeText={(text) => setForm({ ...form, description: text })} />
          <TextInput style={styles.input} placeholder="Tarih (YYYY-MM-DD)" placeholderTextColor= 'rgb(165, 158, 180)'value={form.date} onChangeText={(text) => setForm({ ...form, date: text })} />
          <TextInput style={styles.input} placeholder="Saat (HH:MM)" placeholderTextColor= 'rgb(165, 158, 180)'value={form.time} onChangeText={(text) => setForm({ ...form, time: text })} />
          <TextInput style={styles.input} placeholder="Lokasyon" placeholderTextColor= 'rgb(165, 158, 180)'value={form.location} onChangeText={(text) => setForm({ ...form, location: text })} />
          <TextInput style={styles.input} placeholder="Görsel URL" placeholderTextColor= 'rgb(165, 158, 180)'value={form.image} onChangeText={(text) => setForm({ ...form, image: text })} />
          <TextInput style={styles.input} placeholder="Kategori" placeholderTextColor= 'rgb(165, 158, 180)'value={form.category} onChangeText={(text) => setForm({ ...form, category: text })} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{editingEvent ? 'Kaydet' : 'Ekle'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>Vazgeç</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default AdminPanel;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center'},
  addButton: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 10, marginBottom: 16},
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  eventItem: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 12},
  eventTitle: { fontSize: 18, fontWeight: 'bold' ,color : '#000'},
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8},
  editButton: { backgroundColor: '#3B82F6', padding: 8, borderRadius: 8, marginRight: 8 },
  deleteButton: { backgroundColor: '#F44336', padding: 8, borderRadius: 8},
  buttonText: { color: '#fff', fontWeight: 'bold'},
  modalContent: { padding: 20},
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center',color : '#000'},
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, padding: 12, marginBottom: 10,color : '#000'},
  saveButton: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16},
});
