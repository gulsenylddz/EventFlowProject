import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function LoginPage({ setUser, type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (type === "admin") {
      // Basit sahte admin kontrolü
      if (email === "admin@event.com" && password === "123456") {
        setUser({ name: "Admin", email, isAdmin: true });
        navigate("/admin");
      } else {
        alert("Geçersiz admin bilgisi.");
      }
    } else {
      // Gerçek kullanıcı girişi (Firebase Auth)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        setUser({ name: firebaseUser.email.split("@")[0], email: firebaseUser.email, isAdmin: false });
        navigate("/");
      } catch (error) {
        alert("Giriş başarısız: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h2 className="text-4xl font-bold text-center mb-6 text-blue-700">
          {type === "admin" ? "🔐 Admin Girişi" : "👤 Kullanıcı Girişi"}
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">E-posta</label>
            <input
              type="email"
              placeholder={type === "admin" ? "admin@event.com" : "ornek@eposta.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Şifre</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Giriş Yap
          </button>
        </form>

        {/* Admin açıklaması */}
        {type === "admin" && (
          <p className="text-xs text-gray-500 mt-4 text-center">
            Demo admin: <strong>admin@event.com</strong> / <strong>123456</strong>
          </p>
        )}

        {/* Alt linkler */}
        {type !== "admin" && (
          <>
            <p className="text-sm text-center mt-4 text-gray-500">
              Hesabınız yok mu?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Kayıt Ol
              </a>
            </p>
            <p className="text-sm text-center mt-2 text-gray-500">
              <a href="/forgot-password" className="text-red-500 hover:underline">
                Şifremi unuttum
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
