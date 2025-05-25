import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, Modal,
  StyleSheet, Alert, ScrollView, Image
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const estimateInterest = (event) => {
  const score =
    (['müzik', 'festival', 'konser'].some(k => event.title.toLowerCase().includes(k)) ? 2 : 0) +
    (['İstanbul', 'Ankara'].includes(event.city) ? 2 : 0) +
    (event.description?.length || 0) / 100;
  if (score >= 5) return 'Yüksek';
  if (score >= 3) return 'Orta';
  return 'Düşük';
};

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', date: '',
    time: '', location: '', image: '', category: '', city: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const snapshot = await firestore().collection('events').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(data);
  };

  const handleDelete = (id) => {
    Alert.alert('Sil', 'Etkinlik silinsin mi?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          await firestore().collection('events').doc(id).delete();
          fetchEvents();
        }
      }
    ]);
  };

  const openModal = (item = null) => {
    setEditingEvent(item);
    setForm(item ? { ...item } : {
      title: '', description: '', date: '',
      time: '', location: '', image: '', category: '', city: ''
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Hata', 'Başlık boş olamaz!');
      return;
    }

    try {
      if (editingEvent) {
        await firestore().collection('events').doc(editingEvent.id).update(form);
      } else {
        await firestore().collection('events').add(form);

        await firestore().collection('notifications').add({
          title: 'Yeni Etkinlik Yayında!',
          message: `${form.title} etkinliği eklendi.`,
          timestamp: firestore.FieldValue.serverTimestamp(),
          target: 'all',
          readBy: [],
        });
      }
      setModalVisible(false);
      fetchEvents();
    } catch (e) {
      Alert.alert('Hata', e.message);
    }
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={item.image ? { uri: item.image } : require('../assets/no-image.png')}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date} - {item.time}</Text>
        <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
        <Text style={styles.category}>#{item.category}</Text>
        <Text style={styles.ai}>📊 İlgi Tahmini: {estimateInterest(item)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openModal(item)}>
            <Text style={styles.btnText}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
            <Text style={styles.btnText}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
        <Text style={styles.addText}>+ Yeni Etkinlik</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 60 }}
      />

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>{editingEvent ? 'Etkinliği Güncelle' : 'Yeni Etkinlik Ekle'}</Text>
          {['title', 'description', 'date', 'time', 'location', 'image', 'category', 'city'].map((field) => (
            <TextInput
              key={field}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChangeText={(text) => setForm({ ...form, [field]: text })}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          ))}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.btnText}>{editingEvent ? 'Kaydet' : 'Ekle'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancel}>Vazgeç</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default EventManager;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f2f5' },
  addBtn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 10, marginBottom: 14 },
  addText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', marginBottom: 14, elevation: 3 },
  image: { width: 100, height: 100 },
  content: { flex: 1, padding: 10 },
  title: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  date: { fontSize: 14, color: '#555', marginTop: 2 },
  description: { fontSize: 13, color: '#444', marginTop: 4 },
  category: { fontSize: 12, color: '#888', marginTop: 4, fontStyle: 'italic' },
  ai: { fontSize: 13, color: '#4CAF50', marginTop: 4 },
  actions: { flexDirection: 'row', marginTop: 10 },
  editBtn: { backgroundColor: '#2196F3', padding: 8, borderRadius: 6, marginRight: 8 },
  deleteBtn: { backgroundColor: '#F44336', padding: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modal: { padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#000',
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancel: { color: '#FF5252', textAlign: 'center', marginTop: 14, fontWeight: 'bold' },
});
