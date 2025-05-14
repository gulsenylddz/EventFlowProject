import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

function ProfilePage({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);


  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        setFavorites(snapshot.docs.map(doc => doc.data()));
      }
    };

    fetchFavorites();
  }, [user]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setProfilePic(url);
    setUploading(false);
  };

  return (
<div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex justify-center items-center pt-24 px-4">
<div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profil"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                Fotoğraf Yok
              </div>
            )}
            <label
              htmlFor="fileUpload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-lg hover:bg-blue-700 transition"
            >
              📷
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          <h1 className="text-2xl font-bold mt-4">{user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>

          {uploading && <p className="text-sm text-gray-400 mt-2">Yükleniyor...</p>}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Favori Etkinlikler</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500 text-sm">Henüz favori etkinlik yok.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {favorites.map((fav, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg p-3 shadow hover:shadow-md transition"
                >
                  <p className="text-gray-800 font-medium">{fav.title}</p>
                  <p className="text-sm text-gray-500">{fav.category}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {favorites.length > 0 && (
  <div className="mt-6">
    <button
      onClick={() => {
        const randomFav = favorites[Math.floor(Math.random() * favorites.length)];
        setSuggestion(`Bugün "${randomFav.title}" etkinliğine göz atabilirsiniz!`);
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
    >
       Bana Etkinlik Öner
    </button>

    {suggestion && (
      <p className="mt-4 text-green-700 font-medium">{suggestion}</p>
    )}
  </div>
)}

      </div>
    </div>
  );
}

export default ProfilePage;
