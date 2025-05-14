import { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function PhotoUploadPage({ user }) {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !eventTitle || !eventDate || !file) {
      alert("Tüm alanları doldurun ve giriş yapın.");
      return;
    }

    setUploading(true);
    try {
      const fileRef = ref(storage, `event-photos/${user.uid}-${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, "photos"), {
        userId: user.uid,
        eventTitle,
        eventDate,
        description,
        photoURL,
        createdAt: Timestamp.now(),
        userEmail: user.email,
      });

      setEventTitle("");
      setEventDate("");
      setDescription("");
      setFile(null);
      setPreview(null);
      alert("Fotoğraf başarıyla yüklendi!");
    } catch (error) {
      console.error("Fotoğraf yüklenemedi:", error);
    }
    setUploading(false);
  };

  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Etkinlik Fotoğrafı Paylaş</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <input
          type="text"
          placeholder="Etkinlik Adı"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Açıklama (İsteğe Bağlı)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded h-24"
        />
        <input type="file" onChange={handleImageChange} accept="image/*" className="w-full" required />

        {preview && <img src={preview} alt="Önizleme" className="rounded-lg h-64 object-cover w-full mt-4" />}

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition w-full"
        >
          {uploading ? "Yükleniyor..." : "Paylaş"}
        </button>
      </form>
    </div>
  );
}

export default PhotoUploadPage;
