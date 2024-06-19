import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import heroImage from "../assets/images/hero-home.jpg";
import image1 from "../assets/images/vectorhome1.png";
import image2 from "../assets/images/vectorhome2.png";
import image3 from "../assets/images/vectorhome3.png";
import image4 from "../assets/images/vectorhome4.png";
import vaksinKucing from "../assets/images/vaksinimg.jpg";
import adoptionBgImage from "../assets/images/banner2.png";
import AOS from "aos";
import "aos/dist/aos.css";

const data = [
  {
    id: 1,
    Imgurl: image1,
    text: "Lokasi Dokter Hewan",
    description:
      "Kemudahan untuk menemukan dokter hewan terdekat dengan cepat.",
  },
  {
    id: 2,
    Imgurl: image2,
    text: "Konsultasi Dokter",
    description:
      "Berkonsultasi dengan dokter hewan secara online untuk memperoleh saran penanganan.",
  },
  {
    id: 3,
    Imgurl: image3,
    text: "Adopsi Hewan",
    description:
      "Menjelajahi daftar-daftar hewan yang anda inginkan untuk dipelihara.",
  },
  {
    id: 4,
    Imgurl: image4,
    text: "Temukan Pengadopsi",
    description:
      "Anda dapat mengunggah profil hewan anda untuk menemukan pengadopsi yang cocok.",
  },
];

const Card = ({ Imgurl, text, description }) => {
  return (
    <div className="bg-[#F1F1F1] shadow-md rounded-lg p-6" data-aos="fade-up">
      <div className="flex items-center justify-start mb-4">
        <img src={Imgurl} alt={text} className="h-12 w-12" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{text}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const DoctorCard = ({ image, doctorName, specialty, experience }) => (
  <div
    className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center font-poppins"
    data-aos="fade-up"
  >
    {image ? (
      <img className="w-full h-60 object-cover" src={image} alt="Dokter" />
    ) : (
      <div className="w-full h-60 flex justify-center items-center">
        <i className="fas fa-user-doctor text-9xl text-[#ED9455]"></i>
      </div>
    )}
    <div className="p-4 flex flex-col items-start w-full">
      <h2 className="text-xl font-semibold text-slate-900 line-clamp-1">
        {doctorName}
      </h2>
      <p className="text-gray-500 text-sm mt-2 line-clamp-1">
        <span className="font-medium">Spesialis:</span> {specialty}
      </p>
      <p className="text-gray-500 text-sm mt-1">
        <span className="font-medium">Pengalaman:</span> {experience}
      </p>
    </div>
    <button className="mt-4 w-full py-1 bg-[#ED9455] hover:bg-[#f89b59] text-white transition duration-300">
      <a href="/Login-PetPalsCare">Login Untuk Info Lengkap</a>
    </button>
  </div>
);

const PetCard = ({ JenisHewan, Nama, Kelamin, Usia, imageUrl }) => {
  return (
    <div
      className="max-w-xs mx-1 bg-white rounded-xl shadow-lg overflow-hidden"
      data-aos="fade-up"
    >
      <img className="w-full h-52 object-cover" src={imageUrl} alt={Nama} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 line-clamp-1">
          <h1>{JenisHewan}</h1>
        </div>
        <p className="text-[#667479] text-sm line-clamp-1">Nama: {Nama}</p>
        <div className="flex gap-2 items-center">
          <p className="text-[#667479] text-sm line-clamp-1">
            Kelamin: {Kelamin}
          </p>
          <span className="text-[#667479] text-sm">&bull;</span>
          <p className="text-[#667479] text-sm line-clamp-1">
            Usia: {Usia} Bulan
          </p>
        </div>
      </div>
      <button className="mt-4 w-full py-1 bg-[#ED9455] hover:bg-[#f89b59] text-white transition duration-300">
        <a href="/Login-PetPalsCare">Login Untuk Info Lengkap</a>
      </button>
    </div>
  );
};

const HomepageBefore = () => {
  const [doctors, setDoctors] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctors/");
        const shuffledDoctors = response.data.sort(() => Math.random() - 0.5);
        setDoctors(shuffledDoctors.slice(0, 4)); // Display only 4 doctors
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hewan/");
        const shuffledPets = response.data.sort(() => Math.random() - 0.5);
        setPets(shuffledPets.slice(0, 4)); // Display only 4 pets
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    };

    fetchDoctors();
    fetchPets();
  }, []);

  return (
    <div className="font-poppins">
      <Navbar />
      <div
        id="hero"
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        data-aos="fade-in"
      >
        <div
          className="absolute left-[130px] top-[180px]"
          data-aos="fade-right"
        >
          <div className="text-neutral-800 text-5xl font-bold font-sans capitalize leading-[68px]">
            Hewan Sehat, Hati Bahagia
            <p>Temukan Perawatan Terbaik</p>
          </div>
          <div className="w-[480px] text-stone-500 text-base font-normal font-sans mt-4">
            Bersama-sama, kita berkomitmen untuk mengubah dan memperbaiki
            kesejahteraan hewan serta menciptakan kehidupan yang penuh
            kebahagiaan bagi mereka!
          </div>
          <button className="w-[163px] h-[48px] bg-[#ED9455] hover:bg-[#f89b59] transition duration-300 rounded-full flex justify-center items-center mt-10">
            <span className="text-white">Jelajahi Sekarang</span>
          </button>
        </div>
      </div>
      <div className="container mx-auto p-8 pt-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item) => (
            <Card
              key={item.id}
              Imgurl={item.Imgurl}
              text={item.text}
              description={item.description}
            />
          ))}
        </div>
      </div>
      <div className="container mx-auto p-8 flex flex-col lg:flex-row items-center gap-8 pt-28">
        <div
          className="w-full lg:w-1/2 h-[23rem] overflow-hidden rounded-lg"
          data-aos="fade-right"
        >
          <img
            src={vaksinKucing}
            alt="vaksin"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2" data-aos="fade-left">
          <h2 className="text-4xl font-bold mb-10">Vaksinasi dan Imunisasi</h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>
              Pastikan hewan peliharaan Anda mendapatkan vaksinasi dan imunisasi
              yang diperlukan untuk menjaga kesehatan dan kekebalan tubuh
              mereka.
            </p>
            <p>
              Setiap vaksinasi adalah investasi dalam kesehatan dan
              kesejahteraan hewan peliharaan Anda, memberikan mereka
              perlindungan yang kuat dan memastikan bahwa mereka dapat hidup
              dengan nyaman dan bahagia dalam lingkungan yang aman dan sehat.
            </p>
            <p>
              Konsultasikan dengan dokter hewan Anda untuk mengetahui jenis
              vaksinasi yang tepat dan jadwal yang sesuai untuk hewan peliharaan
              Anda.
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-8 pt-28" id="rekomendasi-dokter">
        <div className="flex justify-between items-center mb-10">
          <div data-aos="fade-right">
            <div className="text-black text-base font-normal mb-1">
              Ingin berkonsultasi dengan dokter hewan terpercaya?
            </div>
            <div className="text-[#ED9455] text-2xl font-extrabold capitalize mb-2">
              Rekomendasi Dokter Hewan
            </div>
          </div>
          <button
            className="bg-[#ED9455] py-2 px-4 hover:bg-[#f89b59] transition duration-300 rounded-md flex justify-center items-center"
            data-aos="fade-left"
          >
            <span className="text-white">Tampilkan Lainnya</span>
            <i className="fas fa-chevron-right ml-2 text-white"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id_dokter}
              image={doctor.url_foto}
              doctorName={doctor.nama}
              specialty={doctor.spesialis}
              experience={doctor.pengalaman}
            />
          ))}
        </div>
      </div>
      <div
        className="relative w-full h-screen bg-cover bg-center mt-10"
        style={{ backgroundImage: `url(${adoptionBgImage})` }}
        data-aos="fade-in"
      >
        <div
          className="absolute left-[130px] top-[120px] w-full lg:w-1/2"
          data-aos="fade-right"
        >
          <h2 className="text-4xl font-bold mb-10 leading-tight font">
            Manfaat Mempelihara Hewan Membawa Kebahagiaan dalam Kehidupan Anda
          </h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>
              Hewan peliharaan tidak hanya menjadi bagian dari keluarga, tetapi
              juga menjadi teman sejati yang menghadirkan keceriaan dan kenangan
              tak terlupakan.
            </p>
            <p>
              Setiap hewan yang diadopsi mendapatkan kesempatan kedua untuk
              menciptakan kenangan indah, bersama keluarga yang penuh kasih
              sayang. Adopsi adalah tindakan nyata yang membantu mengurangi
              jumlah hewan terlantar di komunitas kita. Bergabunglah dengan kami
              hari ini dalam misi menyelamatkan dan memberikan cinta kepada
              mereka yang membutuhkan, melalui adopsi hewan peliharaan!
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-8 pt-32" id="adopsi">
        <div className="flex justify-between items-center mb-10">
          <div data-aos="fade-right">
            <div className="text-black text-base font-normal mb-1">
              Ingin mengadopsi hewan peliharaan yang lucu?
            </div>
            <div className="text-[#ED9455] text-2xl font-extrabold capitalize mb-2">
              Hewan yang Siap diadopsi
            </div>
          </div>
          <button
            className="bg-[#ED9455] py-2 px-4 hover:bg-[#f89b59] transition duration-300 rounded-md flex justify-center items-center"
            data-aos="fade-left"
          >
            <span className="text-white">Tampilkan Lainnya</span>
            <i className="fas fa-chevron-right ml-2 text-white"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <PetCard
              key={pet.id_hewan}
              Nama={pet.nama}
              JenisHewan={pet.jenis_hewan}
              Kelamin={pet.gender}
              Usia={pet.usia}
              imageUrl={pet.url_fotoutama}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomepageBefore;
