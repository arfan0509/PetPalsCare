import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar-after";
import Footer from "../Components/Footer-after";
import axios from "../context/axiosConfig";
import AdopsiBanner from "../assets/images/adopsi.png";
import AOS from "aos";
import "aos/dist/aos.css";

const Card = ({ JenisHewan, Nama, Kelamin, Usia, imageUrl, onDetailClick }) => {
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
        <button
          className="mt-4 w-full py-1 bg-[#ED9455] hover:bg-[#f89b59] text-white rounded-lg transition duration-300"
          onClick={onDetailClick}
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

const AdopsiPage = () => {
  const [Hewan, setHewan] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 1000 });

    const fetchHewan = async () => {
      try {
        const response = await axios.get("/hewan");
        setHewan(response.data);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      }
    };

    fetchHewan();
  }, []);

  // Fungsi untuk melakukan pencarian berdasarkan jenis hewan
  const searchPets = async (jenis_hewan) => {
    try {
      const response = await axios.get(
        `/hewan/search?jenis_hewan=${jenis_hewan}`
      );
      setHewan(response.data);
    } catch (error) {
      console.error("Failed to search pets:", error);
    }
  };

  const handleDetailClick = (hewanId) => {
    navigate(`/detailhewan/${hewanId}`);
  };

  return (
    <>
      <Navbar onSearch={searchPets} />
      <div className="container px-20 py-8 font-poppins">
        <img
          src={AdopsiBanner}
          alt="adopsi"
          className="w-auto h-auto relative mb-8"
          data-aos="fade-in"
        />
        <div className="absolute top-72 left-3/4 transform -translate-x-1/4 -translate-y-1/2 text-white px-12 py-4 text-left w-full max-w-full">
          <h1 className="text-4xl font-bold mb-2">Temukan Sahabat Baru</h1>
          <h2 className="text-xl font-semibold">Adopsi Hewan</h2>
          <h2 className="text-xl font-semibold mb-2">Berikan Kasih Sayang</h2>
          <h4 className="text-sm mb-2 max-w-md">
            Satu tindakan, satu ikatan, satu keluarga. Jadilah bagian dari
            perubahan dengan mengadopsi hari ini.
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Hewan.map((item) => (
            <Card
              key={item.id}
              Nama={item.nama}
              JenisHewan={item.jenis_hewan}
              Kelamin={item.gender}
              Usia={item.usia}
              imageUrl={item.url_fotoutama}
              onDetailClick={() => handleDetailClick(item.id_hewan)}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdopsiPage;
