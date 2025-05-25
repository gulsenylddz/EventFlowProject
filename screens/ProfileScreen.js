import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const ProfileOption = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={20} color="#4CAF50" />
      </View>
      <Text style={styles.optionText}>{label}</Text>
      <Icon name="chevron-forward-outline" size={20} color="#bbb" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <Icon name="person-circle-outline" size={64} color="#4CAF50" />
        <Text style={styles.name}>{user?.displayName || 'Kullanıcı Adı'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <ProfileOption
        icon="ticket-outline"
        label="Biletlerim"
        onPress={() => navigation.navigate('TicketsScreen')}
      />
      <ProfileOption
        icon="heart-outline"
        label="Favorilerim"
        onPress={() => navigation.navigate('FavoritesScreen')}
      />
      <ProfileOption
        icon="images-outline"
        label="Etkinlik Arşivim"
        onPress={() => navigation.navigate('PhotoGalleryScreen')}
      />
      <ProfileOption
        icon="camera-outline"
        label="Fotoğraf Paylaş"
        onPress={() => navigation.navigate('PhotoUploadScreen')}
      />
      <ProfileOption
        icon="settings-outline"
        label="Ayarlar"
        onPress={() => navigation.navigate('SettingsScreen')}
      />

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Icon name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  profileCard: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 6,
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  iconBox: {
    backgroundColor: '#e0f2e9',
    borderRadius: 8,
    padding: 6,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logout: {
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
