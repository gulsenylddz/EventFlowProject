import { useState } from "react";

function Chatbot({ onCategorySelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const categories = ["Müzik", "Spor", "Sanat", "Teknoloji"];
  const cities = ["İstanbul", "Ankara", "İzmir"];

  const handleCategory = (category) => {
    setSelectedCategory(category);
    setStep(1);
  };

  const handleCity = (city) => {
    setSelectedCity(city);
    setStep(2);
  };

  const finish = () => {
    alert(
      `Öneriniz hazır: ${selectedCity} şehrinde ${selectedCategory} etkinlikleri!`
    );
    // İstersen yönlendirme yap: window.location.href = "/?category=..."
    setIsOpen(false);
    setStep(0);
    setSelectedCategory("");
    setSelectedCity("");
  };

  return (
    <>
      <button
  onClick={() => setIsOpen(!isOpen)}
  className="fixed top-20 left-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg text-2xl hover:bg-blue-700 transition z-50"
>
  💬
</button>

      {isOpen && (
         <div className="fixed top-36 left-6 bg-white rounded-xl shadow-xl p-4 w-72 animate-fade-in z-50">
          <h3 className="font-bold text-lg mb-2 text-blue-700"> Etkinlik Asistanı</h3>

          {step === 0 && (
            <>
              <p className="text-sm text-gray-600 mb-2">Selam , hangi kategoride etkinlik arıyorsun?</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-blue-500 hover:text-white transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-sm text-gray-600 mb-2">Hangi şehirde?</p>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCity(city)}
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full hover:bg-green-500 hover:text-white transition"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-gray-700 mb-2">
                ✅ Seçimin: <strong>{selectedCategory}</strong> / <strong>{selectedCity}</strong>
              </p>
              <button
                onClick={finish}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
              >
                Önerileri Göster
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Chatbot;
