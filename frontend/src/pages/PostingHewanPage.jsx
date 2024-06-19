import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar-after";
import axiosInstance from "../context/axiosConfig";
import PostingHewanModal from "../Components/PostingHewanModal";

const logoutUser = async () => {
  try {
    await axiosInstance.delete("/users/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  } catch (error) {
    console.error("Failed to logout:", error);
  }
};

const Card = ({
  id_hewan,
  JenisHewan,
  Nama,
  Kelamin,
  Usia,
  imageUrl,
  onDelete,
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
          <p className="text-[#667479] text-sm">Kelamin: {Kelamin}</p>
          <span className="text-[#667479] text-sm">&bull;</span>
          <p className="text-[#667479] text-sm">Usia: {Usia} Bulan</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => onDelete(id_hewan)}
            className="w-full py-1 bg-[#ED9455] hover:bg-[#f89b59] text-white rounded-lg transition duration-300"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

const PostingHewanPage = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/hewan/userHewan");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeletePosting = async (id_hewan) => {
    console.log("Deleting post with id:", id_hewan); // Debug log
    try {
      await axiosInstance.delete(`/hewan/${id_hewan}`);
      setData(data.filter((item) => item.id_hewan !== id_hewan));
    } catch (error) {
      console.error("Error deleting posting:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white-light-2 w-full h-auto flex justify-start font-poppins">
        <div className="w-1/3 h-screen p-8">
          <ul>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="/Profil">Profil Saya</a>
            </li>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="/GantiPassword-user">Ubah Kata Sandi</a>
            </li>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="#">Pesan</a>
            </li>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="/PostingHewan">Posting Hewan Saya</a>
            </li>
            <div className="py-4"></div>
            <li className="p-2 hover:bg-red-500 hover:text-white border-collapse rounded-lg transition duration-200">
              <button onClick={logoutUser}>Keluar</button>
            </li>
          </ul>
        </div>
        <div className="w-full h-auto p-12">
          <div className="bg-white p-0 rounded-xl w-full h-full shadow-2xl">
            <h1 className="p-4 text-2xl font-bold">Postingan Hewan Saya</h1>
            <div className="px-4 py-2">
              <button
                onClick={handleOpenModal}
                className="text-white py-2 px-4 rounded-md bg-[#DE9455] hover:bg-[#D68B4B]"
              >
                + Posting Hewan
              </button>
            </div>

            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
                {data.map((item) => (
                  <Card
                    key={item.id_hewan}
                    id_hewan={item.id_hewan} // Ensure the correct ID is passed
                    Nama={item.nama}
                    JenisHewan={item.jenis_hewan}
                    Kelamin={item.gender} // Adjust property name to match your API response
                    Usia={item.usia}
                    imageUrl={item.url_fotoutama}
                    onDelete={handleDeletePosting} // Pass the delete function
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <PostingHewanModal onClose={handleCloseModal} />}
    </>
  );
};

export default PostingHewanPage;
