import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth); // Firebase Auth çıkış
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 flex justify-between items-center px-8 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600">EventFlow</Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-gray-700 font-semibold">
              Merhaba, {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition"
          >
            Giriş Yap
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
