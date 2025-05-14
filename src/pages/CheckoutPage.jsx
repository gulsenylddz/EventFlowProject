import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

function CheckoutPage({ user }) {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: ""
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const ref = doc(db, "events", eventId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setEventData({ id: snap.id, ...snap.data() });
      } else {
        alert("Etkinlik bulunamadı");
        navigate("/");
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    setCardInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFocus = (e) => {
    setCardInfo((prev) => ({
      ...prev,
      focus: e.target.name
    }));
  };

  const fixText = (text) =>
    text
      .replace(/ş/g, "s").replace(/Ş/g, "S")
      .replace(/ı/g, "i").replace(/İ/g, "I")
      .replace(/ç/g, "c").replace(/Ç/g, "C")
      .replace(/ğ/g, "g").replace(/Ğ/g, "G")
      .replace(/ü/g, "u").replace(/Ü/g, "U")
      .replace(/ö/g, "o").replace(/Ö/g, "O");

  const generatePDF = async (eventData, user) => {
    const pdf = new jsPDF("landscape");

    // Arka plan
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, 0, 297, 210, "F");

    // Sol panel
    pdf.setFillColor(34, 34, 85); // gece mavisi
    pdf.rect(0, 0, 100, 210, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    pdf.text("EVENT", 20, 60);
    pdf.text("FLOW", 20, 95);
    pdf.setFontSize(14);
    pdf.text("BILET", 35, 135);

    // Sağ içerik
    pdf.setTextColor(33, 33, 33);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);

    const x = 120;
    let y = 50;

    pdf.text(fixText(`Etkinlik: ${eventData.title}`), x, y); y += 12;
    pdf.text(fixText(`Yer: ${eventData.location}`), x, y); y += 10;
    pdf.text(fixText(`Tarih: ${eventData.date}`), x, y); y += 10;
    pdf.text(fixText(`Saat: ${eventData.time}`), x, y); y += 10;
    pdf.text(fixText(`Katılımcı: ${user.displayName || user.email}`), x, y); y += 10;
    pdf.text("Koltuk: A12", x, y); y += 10;
    pdf.text(`Fiyat: ${eventData.price} TL`, x, y); y += 10;
    pdf.text(
      `Bilet No: EVT-${eventData.id.substring(0, 6).toUpperCase()}-${eventData.date.replace(/-/g, "")}`,
      x,
      y
    );

    // QR kodu ekle (public/qr.png dosyası)
    const qrImage = new Image();
    qrImage.src = "/qr.png";
    qrImage.onload = () => {
      pdf.addImage(qrImage, "PNG", 230, 60, 45, 45);
      pdf.save(`bilet-${eventData.title}.pdf`);
    };
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user || !user.uid || !eventData) {
      alert("Kullanıcı bilgisi alınamadı.");
      return;
    }

    if (typeof eventData.stock !== "number" || eventData.stock <= 0) {
      alert("Bilet kalmamış veya stok bilgisi eksik.");
      return;
    }

    try {
      await updateDoc(doc(db, "events", eventData.id), {
        stock: increment(-1)
      });

      await addDoc(collection(db, "tickets"), {
        userId: user.uid,
        eventId: eventData.id,
        timestamp: serverTimestamp(),
        price: eventData.price
      });

      await generatePDF(eventData, user);

      alert("Bilet başarıyla indirildi.");
      navigate("/biletlerim");
    } catch (err) {
      console.error("🚨 Bilet alma hatası:", err);
      alert("Bilet alma sırasında hata oluştu.");
    }
  };

  if (!user) {
    return <p className="text-center pt-20 text-gray-600">Lütfen giriş yapın.</p>;
  }

  if (!eventData) {
    return <p className="text-center pt-20">Etkinlik verileri yükleniyor...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden">
        {/* Etkinlik Bilgileri (Sol) */}
        <div className="w-full lg:w-1/2 p-8 bg-blue-50 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">{eventData.title}</h2>
          <p className="text-gray-700 mb-2"><strong>Tarih:</strong> {eventData.date}</p>
          <p className="text-gray-700 mb-2"><strong>Saat:</strong> {eventData.time}</p>
          <p className="text-gray-700 mb-2"><strong>Konum:</strong> {eventData.location}</p>
          <p className="text-gray-700 mb-2"><strong>Fiyat:</strong> {eventData.price} TL</p>
          <p className="text-gray-600 text-sm mt-4">
            Bu etkinliğe ait bilet satın alma işlemi yan taraftan tamamlanabilir.
          </p>
        </div>

        {/* Kart Bilgileri (Sağ) */}
        <div className="w-full lg:w-1/2 p-8 bg-white">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Kart Bilgileri</h2>

          <div className="mb-6">
            <Cards
              number={cardInfo.number}
              name={cardInfo.name}
              expiry={cardInfo.expiry}
              cvc={cardInfo.cvc}
              focused={cardInfo.focus}
            />
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <input
              type="text"
              name="number"
              placeholder="Kart Numarası"
              maxLength={16}
              value={cardInfo.number}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-full p-3 border rounded-lg"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Kart Sahibi"
              value={cardInfo.name}
              onChange={handleChange}
              onFocus={handleFocus}
              className="w-full p-3 border rounded-lg"
              required
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="expiry"
                placeholder="SKT (MM/YY)"
                maxLength={5}
                value={cardInfo.expiry}
                onChange={handleChange}
                onFocus={handleFocus}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="cvc"
                placeholder="CVV"
                maxLength={4}
                value={cardInfo.cvc}
                onChange={handleChange}
                onFocus={handleFocus}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Ödeme Yap ve Bileti Al
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
