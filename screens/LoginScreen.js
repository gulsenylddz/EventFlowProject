import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert, ImageBackground
} from 'react-native';
import { firebaseAuth } from '../firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
  if (isAdmin) {
    if (email === 'admin@event.com' && password === '123456') {
      navigation.replace('AdminPanel');
    } else {
      Alert.alert('Yetkisiz Giriş', 'Sadece admin@event.com için geçerlidir.');
    }
  } else {
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Giriş Hatası', error.message);
    }
  }
};

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        {isAdmin ? (
          <>
            <Image source={require('../assets/admin-icon.png')} style={styles.adminImage} />
            <Text style={styles.title}>Admin Girişi</Text>
          </>
        ) : (
          <Text style={styles.title}>Kullanıcı Girişi</Text>
        )}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Şifre"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsAdmin(!isAdmin)}>
          <Text style={styles.linkText}>
            {isAdmin ? 'Kullanıcı girişi yapmak istiyorum' : 'Admin girişi yapmak istiyorum'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    margin: 30,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginVertical: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    color: '#FF6347',
    fontSize: 16,
  },
  adminImage: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
