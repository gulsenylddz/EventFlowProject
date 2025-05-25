import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

const SettingsScreen = () => {
  const user = auth().currentUser;
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSaveProfile = async () => {
    try {
      if (user) {
        if (user.email !== email) {
          await user.updateEmail(email);
        }
        if (user.displayName !== name) {
          await user.updateProfile({ displayName: name });
        }
        Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Şifre Sıfırlama', 'E-postanıza sıfırlama bağlantısı gönderildi.');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>

      {/* 👤 Profil Bilgileri */}
      <Text style={styles.sectionTitle}>👤 Profil Bilgileri</Text>
      <TextInput
        style={styles.input}
        placeholder="İsim"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Icon name="save-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Bilgileri Kaydet</Text>
      </TouchableOpacity>

      {/* 🔒 Şifre Sıfırlama */}
      <Text style={styles.sectionTitle}>🔒 Şifre</Text>
      <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handlePasswordReset}>
        <Icon name="lock-closed-outline" size={20} color="#4CAF50" />
        <Text style={[styles.buttonText, { color: '#4CAF50' }]}>Şifreyi Sıfırla</Text>
      </TouchableOpacity>

      {/* 📦 Versiyon */}
      <Text style={styles.version}>Sürüm: 1.0.0</Text>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#222', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginVertical: 12 },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: '#000',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  outlineButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  version: { textAlign: 'center', color: '#999', marginTop: 40 },
});
