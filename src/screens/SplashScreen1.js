import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000); // 2 saniye sonra Welcome ekranına geç
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/muneeb-syed-4_M8uIfPEZw-unsplash.jpg')} // senin seçtiğin yeni splash görseli
      style={styles.background}
      resizeMode="cover"
    >
      <Text style={styles.title}>EventFlow</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-start', // Üste hizaladık
    alignItems: 'center',
    paddingTop: 60, // Yukarıdan boşluk bıraktık
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SplashScreen;
