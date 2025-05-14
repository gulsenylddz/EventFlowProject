import { useNavigate } from "react-router-dom";

function ProfileSidebar({ user, onClose, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-6 transition-all">
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        onClick={onClose}
      >
        ✖
      </button>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-1 text-gray-800">Merhaba,</h2>
        <p className="text-gray-500">{user?.name || user?.email}</p>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={() => navigate("/profile")}
          className="w-full text-left text-blue-600 hover:underline"
        >
          👤 Profilim
        </button>
        <button
          onClick={() => navigate("/tickets")}
          className="w-full text-left text-blue-600 hover:underline"
        >
          🎟️ Biletlerim
        </button>
        <button
          onClick={() => navigate("/favorites")}
          className="w-full text-left text-blue-600 hover:underline"
        >
          ⭐ Favori Etkinlikler
        </button>
        <button
          onClick={() => navigate("/archive")}
          className="w-full text-left text-blue-600 hover:underline"
        >
          🖼️ Fotoğraf Arşivi
        </button>
        <hr className="my-4" />
        <button
          onClick={onLogout}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default ProfileSidebar;
