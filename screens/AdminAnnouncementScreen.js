import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AnnouncementSender = () => {
  const [form, setForm] = useState({ title: '', message: '' });

  const handleSend = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      Alert.alert('Uyarı', 'Başlık ve mesaj boş olamaz.');
      return;
    }

    try {
      await firestore().collection('notifications').add({
        title: form.title,
        message: form.message,
        timestamp: firestore.FieldValue.serverTimestamp(),
        target: 'all',
        readBy: [],
      });
      Alert.alert('Başarılı', 'Duyuru gönderildi.');
      setForm({ title: '', message: '' });
    } catch (e) {
      Alert.alert('Hata', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}> Duyuru Gönder</Text>
      <TextInput
        placeholder="Başlık"
        style={styles.input}
        value={form.title}
        onChangeText={(text) => setForm(prev => ({ ...prev, title: text }))}
      />
      <TextInput
        placeholder="Mesaj"
        style={[styles.input, { minHeight: 100 }]}
        multiline
        value={form.message}
        onChangeText={(text) => setForm(prev => ({ ...prev, message: text }))}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={handleSend}>
        <Text style={styles.btnText}>Gönder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AnnouncementSender;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
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
  btnText: { color: '#fff', fontWeight: 'bold' },
});
