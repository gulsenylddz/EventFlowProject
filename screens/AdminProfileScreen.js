import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

const AdminProfileScreen = ({ navigation }) => {
  const user = auth().currentUser;

  const handleLogout = async () => {
    await auth().signOut();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Admin Profil</Text>
      <Text style={styles.label}>Ad:</Text>
      <Text style={styles.value}>{user?.displayName || 'Anonim'}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user?.email}</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, color: '#888', marginTop: 10 },
  value: { fontSize: 16, color: '#000', marginBottom: 5 },
  logoutBtn: {
    backgroundColor: '#F44336',
    marginTop: 40,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
});
