import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import { Navigate } from "react-router-dom";

// Türkçe karakter düzeltici
const fixText = (text) =>
  text
    .replace(/ş/g, "s").replace(/Ş/g, "S")
    .replace(/ı/g, "i").replace(/İ/g, "I")
    .replace(/ç/g, "c").replace(/Ç/g, "C")
    .replace(/ğ/g, "g").replace(/Ğ/g, "G")
    .replace(/ü/g, "u").replace(/Ü/g, "U")
    .replace(/ö/g, "o").replace(/Ö/g, "O");

function TicketsPage({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.uid) return;

      try {
        const q = query(collection(db, "tickets"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        const ticketsWithEvent = await Promise.all(snapshot.docs.map(async (docSnap) => {
          const ticketData = docSnap.data();
          const eventRef = doc(db, "events", ticketData.eventId);
          const eventSnap = await getDoc(eventRef);

          return {
            id: docSnap.id,
            ...ticketData,
            event: eventSnap.exists() ? { id: eventSnap.id, ...eventSnap.data() } : null
          };
        }));

        setTickets(ticketsWithEvent);
      } catch (err) {
        console.error("Bilet verisi alınırken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const handleDownloadPDF = (ticket) => {
    const event = ticket.event;
    const pdf = new jsPDF("landscape");

    // Arka plan
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, 0, 297, 210, "F");

    // Sol panel
    pdf.setFillColor(34, 34, 85);
    pdf.rect(0, 0, 100, 210, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    pdf.text("EVENT", 20, 60);
    pdf.text("FLOW", 20, 95);
    pdf.setFontSize(14);
    pdf.text("BILET", 35, 135);

    // İçerik
    pdf.setTextColor(33, 33, 33);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);

    let x = 120;
    let y = 50;

    pdf.text(fixText(`Etkinlik: ${event.title}`), x, y); y += 12;
    pdf.text(fixText(`Yer: ${event.location}`), x, y); y += 10;
    pdf.text(fixText(`Tarih: ${event.date}`), x, y); y += 10;
    pdf.text(fixText(`Saat: ${event.time}`), x, y); y += 10;
    pdf.text(fixText(`Katılımcı: ${user.displayName || user.email}`), x, y); y += 10;
    pdf.text(`Koltuk: A12`, x, y); y += 10;
    pdf.text(`Fiyat: ${ticket.price} TL`, x, y); y += 10;
    pdf.text(`Bilet No: EVT-${event.id.substring(0, 6).toUpperCase()}-${event.date.replace(/-/g, "")}`, x, y);

    const qrImage = new Image();
    qrImage.src = "/qr.png";
    qrImage.onload = () => {
      pdf.addImage(qrImage, "PNG", 230, 60, 45, 45);
      pdf.save(`bilet-${event.title}.pdf`);
    };
  };

  const handleCancelTicket = async (ticketId) => {
    if (!ticketId) return;
    if (window.confirm("Bu bileti iptal etmek istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "tickets", ticketId));
        setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      } catch (err) {
        console.error("Bilet iptal hatası:", err);
      }
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <p className="text-center pt-24 text-gray-500">Biletler yükleniyor...</p>;
  }

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Biletlerim</h1>

      {tickets.length === 0 ? (
        <p className="text-center text-gray-600">Henüz bilet satın almadınız.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-md p-6 space-y-2">
              <h2 className="text-xl font-bold text-gray-800">{ticket.event?.title}</h2>
              <p className="text-gray-600">📅 {ticket.event?.date} – ⏰ {ticket.event?.time}</p>
              <p className="text-gray-600">📍 {ticket.event?.location}</p>
              <p className="text-gray-600">💳 {ticket.price} TL</p>
              <p className="text-gray-500 text-sm">Satın alma: {ticket.timestamp?.toDate().toLocaleString()}</p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleDownloadPDF(ticket)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  PDF İndir
                </button>
                <button
                  onClick={() => handleCancelTicket(ticket.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Bileti İptal Et
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketsPage;
