import { useState } from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { FaTicketAlt, FaStar, FaCameraRetro, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function Navbar({ user, setUser }) {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowSidebar(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 flex justify-between items-center px-8 z-50">
        <Link to="/" className="text-2xl font-bold text-blue-600">EventFlow</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => setShowSidebar(true)}
              className="text-gray-800 font-medium hover:text-blue-600 transition"
            >
              Profil
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
          <div className="w-80 bg-white shadow-2xl h-full p-6 flex flex-col animate-slide-in relative">
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
            >
              ×
            </button>

            <div className="flex flex-col items-center text-center mt-12">
              <FaUserCircle className="text-6xl text-blue-600 mb-2" />
              <h2 className="text-lg font-semibold">{user.displayName || "Kullanıcı"}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            <div className="mt-10 space-y-3">
              <Link
                to="/biletlerim"
                onClick={() => setShowSidebar(false)}
                className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-lg"
              >
                <FaTicketAlt className="text-yellow-500" /> Biletlerim
              </Link>
              <Link
                to="/favoriler"
                onClick={() => setShowSidebar(false)}
                className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-lg"
              >
                <FaStar className="text-yellow-400" /> Favori Etkinlikler
              </Link>
              <Link
                to="/fotoarsiv"
                onClick={() => setShowSidebar(false)}
                className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-lg"
              >
                <FaCameraRetro className="text-purple-500" /> Fotoğraf Arşivi
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="mt-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center"
            >
              <FaSignOutAlt /> Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
