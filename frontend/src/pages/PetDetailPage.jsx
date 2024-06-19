import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar-after";
import Footer from "../Components/Footer-after";
import axios from "../context/axiosConfig";
import Slider from "react-slick";

const PetCard = ({
  JenisHewan,
  Nama,
  Kelamin,
  Usia,
  imageUrl,
  onDetailClick,
}) => {
  return (
    <div className="max-w-xs mx-1 bg-white rounded-xl shadow-lg overflow-hidden">
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

const PetDetailPage = () => {
  const { id } = useParams();
  const [Hewan, setHewan] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHewanDetail = async () => {
      try {
        const response = await axios.get(`/users/hewan/${id}`);
        setHewan(response.data);
        setSelectedImage(response.data.url_fotoutama);
      } catch (error) {
        console.error("Failed to fetch pet details:", error);
      }
    };

    fetchHewanDetail();
  }, [id]);

  useEffect(() => {
    const fetchPetsReadyForAdoption = async () => {
      try {
        const response = await axios.get("/hewan");
        // Mengacak urutan data hewan sebelum disimpan ke state
        const shuffledPets = response.data.sort(() => Math.random() - 0.5);
        setPets(shuffledPets.slice(0, 4)); // Ambil 4 hewan secara acak
      } catch (error) {
        console.error("Failed to fetch pets ready for adoption:", error);
      }
    };

    fetchPetsReadyForAdoption();
  }, []);

  const handleThumbnailClick = (url) => {
    setSelectedImage(url);
  };

  const handleChatWithOwner = () => {
    const phoneNumber = Hewan.user_no_hp;
    const jenisHewanBold = `*${Hewan.jenis_hewan}*`;
    const message = `Halo, saya tertarik untuk mengadopsi ${jenisHewanBold}.
Jenis kelamin: ${Hewan.gender}.
Usia: ${Hewan.usia} Bulan.
Warna: ${Hewan.warna}.
    
Dimana saya mendapatkan informasi ini di situs *PetPals Care*`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (!Hewan) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const fotoHewanWithMainPhoto = [
    { id_foto: "main", url_foto: Hewan.url_fotoutama },
    ...Hewan.foto_hewan,
  ];

  return (
    <div className="font-poppins">
      <Navbar />
      <div className="min-h-screen flex flex-col p-3 max-w-7xl mt-5 mx-auto pb-24 md:flex-row md:space-x-8">
        <div className="w-full md:w-2/5 flex flex-col items-center mb-8 md:mb-0">
          <div className="w-full mb-4 relative">
            <div className="relative w-full" style={{ paddingBottom: "100%" }}>
              <img
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                src={selectedImage}
                alt={Hewan.nama}
              />
            </div>
          </div>
          <Slider {...settings} className="w-full">
            {fotoHewanWithMainPhoto.map((foto) => (
              <div key={foto.id_foto} className="px-1">
                <img
                  className="w-full h-24 md:h-40 rounded-md border-2 cursor-pointer object-cover"
                  src={foto.url_foto}
                  alt={`Thumbnail ${foto.id_foto}`}
                  onClick={() => handleThumbnailClick(foto.url_foto)}
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="w-full md:w-3/5 flex flex-col">
          <h1 className="text-2xl font-bold font-sans mb-4">
            {Hewan.jenis_hewan}
          </h1>

          <div className="flex flex-col space-y-4">
            <div className="border-b border-gray-200 py-2 flex">
              <span className="text-gray-500 font-sans w-48">Nama: </span>
              <span className="font-sans">{Hewan.nama}</span>
            </div>
            <div className="border-b border-gray-200 py-2 flex">
              <span className="text-gray-500 font-sans w-48">
                Jenis kelamin:{" "}
              </span>
              <span className="font-sans">{Hewan.gender}</span>
            </div>
            <div className="border-b border-gray-200 py-2 flex">
              <span className="text-gray-500 font-sans w-48">Usia: </span>
              <span className="font-sans">{Hewan.usia} Bulan</span>
            </div>
            <div className="border-b border-gray-200 py-2 flex">
              <span className="text-gray-500 font-sans w-48">Warna: </span>
              <span className="font-sans">{Hewan.warna}</span>
            </div>
            <div className="border-b border-gray-200 py-2 flex">
              <span className="text-gray-500 font-sans w-48">Lokasi: </span>
              <span className="font-sans">{Hewan.lokasi}</span>
            </div>
            <div className="border-b border-gray-200 py-2 flex">
              <span className="text-gray-500 font-sans w-48">
                Di posting pada:{" "}
              </span>
              <span className="font-sans">{Hewan.tgl_publish}</span>
            </div>
            <div className="border-b border-gray-200 py-2 flex items-center">
              <span className="text-gray-500 font-sans w-48">
                Nama Pemilik:{" "}
              </span>
              {Hewan.user_url_foto ? (
                <img
                  className="w-10 h-10 rounded-full object-cover mr-2"
                  src={Hewan.user_url_foto}
                  alt={`Foto ${Hewan.user_nama}`}
                />
              ) : (
                <i className="fas fa-user w-12 h-12 flex items-center"></i>
              )}
              <span className="font-sans">{Hewan.user_nama}</span>
            </div>

            <div className="border-b border-gray-200 py-2 flex">
              <span className="text-gray-500 font-sans w-48">
                Nomor HP Pemilik:{" "}
              </span>
              <span className="font-sans">{Hewan.user_no_hp}</span>
            </div>
          </div>
          <button
            className="mt-6 px-6 py-3 bg-[#ED9455] hover:bg-[#f89b59] text-white rounded-lg transition duration-300"
            onClick={handleChatWithOwner} // Menggunakan fungsi handleChatWithOwner untuk mengarahkan ke WhatsApp
          >
            Chat dengan pemilik untuk adopsi
          </button>
        </div>
      </div>
      {/* Bagian Hewan yang Siap diadopsi */}
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="text-black text-base font-normal mb-1">
              Belum menemukan hewan yang cocok?
            </div>
            <div className="text-[#ED9455] text-2xl font-extrabold capitalize mb-2">
              Lihat Hewan Lainnya
            </div>
          </div>
          <button
            className="bg-[#ED9455] py-2 px-4 hover:bg-[#f89b59] transition duration-300 rounded-md flex justify-center items-center"
            onClick={() => navigate("/Adopsi-hewan")}
          >
            <span className="text-white">Tampilkan Lainnya</span>
            <i className="fas fa-chevron-right ml-2 text-white"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pets.map((pet) => (
            <PetCard
              key={pet.id_hewan}
              Nama={pet.nama}
              JenisHewan={pet.jenis_hewan}
              Kelamin={pet.gender}
              Usia={pet.usia}
              imageUrl={pet.url_fotoutama}
              onDetailClick={() => handlePetDetailClick(pet.id_hewan)}
            />
          ))}
        </div>
      </div>{" "}
      <Footer />
    </div>
  );
};

export default PetDetailPage;
