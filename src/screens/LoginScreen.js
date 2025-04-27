import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'test@test.com' && password === '123456') {
      navigation.replace('Home');
    } else {
      Alert.alert('Hatalı Giriş', 'Email veya şifre yanlış!');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/muneeb-syed-4_M8uIfPEZw-unsplash.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Giriş Yap</Text>

        <TextInput
  placeholder="Email"
  placeholderTextColor="#999"
  value={email}
  onChangeText={setEmail}
  style={styles.input}
  keyboardType="email-address"
/>

<TextInput
  placeholder="Şifre"
  placeholderTextColor="#999"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  style={styles.input}
/>


        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Hesabın yok mu? Kaydol</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

// styles kısmı aynı kalacak (az önceki gibi)


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)', 
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
    color: 'black',  // <<< EKLEDİK
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
  registerText: {
    color: '#FF6347',
    fontSize: 16,
    marginTop: 10,
  },
});
