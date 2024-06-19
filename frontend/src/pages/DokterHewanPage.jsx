import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar-after";
import Footer from "../Components/Footer-after";
import axios from "../context/axiosConfig";
import DokterHewan from "../assets/images/DokterHewan.png";
import AOS from "aos";
import "aos/dist/aos.css";

const Card = ({ image, doctorName, specialty, experience, onDetailClick }) => (
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
      <button
        className="mt-4 w-full py-1 bg-[#ED9455] hover:bg-[#f89b59] text-white rounded-lg transition duration-300"
        onClick={onDetailClick}
      >
        Lihat Detail
      </button>
    </div>
  </div>
);

const DokterHewanPage = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 1000 });

    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleDetailClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  return (
    <>
      <Navbar />
      <div className="w-full h-auto pt-8 px-20 container relative font-poppins">
        <img
          src={DokterHewan}
          alt="Dokter Hewan"
          className="w-auto h-auto relative"
          data-aos="fade-in"
        />
        <div className="absolute top-1/2 left-3/4 transform -translate-x-1/4 -translate-y-1/2 text-white px-12 py-4 text-left w-full max-w-full">
          <h1 className="text-4xl font-bold mb-2">Temukan Dokter Hewan</h1>
          <h2 className="text-xl font-semibold">Solusi Terbaik</h2>
          <h2 className="text-xl font-semibold mb-2">untuk Kesehatan Hewan</h2>
          <h4 className="text-sm mb-2 max-w-md">
            Layanan Kesehatan Berkualitas yang Memberikan Perhatian Terbaik
            untuk Hewan Peliharaan Anda.
          </h4>
        </div>
      </div>
      <div className="w-full h-auto pt-8 px-20 container">
        <div className="flex flex-wrap -mx-4">
          {doctors.map((doctor, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
              <Card
                image={doctor.url_foto}
                doctorName={doctor.nama}
                specialty={doctor.spesialis}
                experience={doctor.pengalaman}
                onDetailClick={() => handleDetailClick(doctor.id_dokter)}
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DokterHewanPage;
