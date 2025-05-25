import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PhotoUploadScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState('');
  const userId = auth().currentUser?.uid;

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('İptal edildi');
      } else if (response.errorCode) {
        Alert.alert('Hata', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        setImageUri(uri);
      }
    });
  };

  const handleUpload = async () => {
    if (!imageUri || !caption.trim()) {
      Alert.alert('Uyarı', 'Fotoğraf ve açıklama boş olamaz.');
      return;
    }

    const photoData = {
      userId,
      caption: caption.trim(),
      imageUrl: imageUri,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
      await firestore().collection('photoPosts').add(photoData);
      Alert.alert('Başarılı', 'Fotoğrafınız başarıyla yüklendi!');
      setImageUri(null);
      setCaption('');
    } catch (error) {
      console.error('Yükleme hatası:', error);
      Alert.alert('Hata', 'Fotoğraf yüklenemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📸 Fotoğraf Paylaş</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={handleSelectImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <>
            <Icon name="image-outline" size={50} color="#999" />
            <Text style={styles.imageText}>Fotoğraf seçmek için tıkla</Text>
          </>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Etkinlik hakkında açıklama..."
        placeholderTextColor="#aaa"
        value={caption}
        onChangeText={setCaption}
        style={styles.input}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Icon name="cloud-upload-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Yükle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PhotoUploadScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 200,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  imageText: {
    marginTop: 10,
    color: '#999',
    fontSize: 15,
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#000',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
