import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar-after";
import axios from "../context/axiosConfig";
import { jwtDecode } from "jwt-decode";
import EditProfileModal from "../Components/EditProfileModal";
import UploadPhotoModal from "../Components/UploadPhotoModal";

const logoutUser = async () => {
  try {
    await axios.delete("/users/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  } catch (error) {
    console.error("Failed to logout:", error);
    // Tindakan penanganan kesalahan jika diperlukan
  }
};

const ProfilUserPage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // State untuk mengontrol visibilitas modal upload gambar

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("User not authenticated");
        // Navigasi ke halaman login jika tidak ada accessToken
        window.location.href = "/Login-PetPalsCare"; // Ubah rute sesuai dengan rute login Anda
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const response = await axios.get("/users/users-data", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data[0]); // Karena responsenya berupa array
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data user");
        // Navigasi ke halaman login jika gagal memuat data pengguna
        window.location.href = "/Login-PetPalsCare"; // Ubah rute sesuai dengan rute login Anda
      }
    };

    fetchUserData();
  }, []);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUserData(updatedUser);
  };

  const handleUpdatePhoto = (photoUrl) => {
    setUserData({ ...userData, url_foto: photoUrl });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

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
              <a href="/PostingHewan">Posting Hewan Saya</a>
            </li>
            <div className="py-4"></div>
            <li className="p-2 hover:bg-red-500 hover:text-white border-collapse rounded-lg transition duration-200">
              <button onClick={logoutUser}>Keluar</button>
            </li>
          </ul>
        </div>

        <div className="w-full h-auto p-12">
          <div className="bg-white p-10 rounded-xl w-full h-auto shadow-2xl">
            <h1 className="py-4 font-bold text-1xl">Profil Saya</h1>
            <div className="flex justify-start items-center gap-4 pt-6">
              <div
                className="w-[100px] h-[100px] bg-white border border-[#ED9455] rounded-full flex justify-center items-center"
                onClick={handleOpenUploadModal}
                style={{ cursor: "pointer" }}
              >
                {userData.url_foto ? (
                  <img
                    src={userData.url_foto}
                    alt="User Photo"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <i className="fas fa-user text-4xl text-[#ED9455]"></i>
                )}
              </div>
              <div>
                <h1 className="text-xl font-medium">{userData.nama}</h1>
                <p>Pengasuh Setia</p>
              </div>
            </div>
            <div className="flex justify-start gap-8 items-center w-full h-auto gap-28 py-4">
              <div>
                <p className="font-medium">Usia</p>
                <p>{userData.usia} Tahun</p>
              </div>
              <div>
                <p className="font-medium">Jenis Kelamin</p>
                <p>{userData.gender}</p>
              </div>
            </div>
            <div className="py-4">
              <p className="font-medium">Nomor Handphone</p>
              <p>{userData.no_hp}</p>
            </div>
            <div className="py-4">
              <p className="font-medium">Email</p>
              <p>{userData.email}</p>
            </div>
            <div className="py-4">
              <p className="font-medium">Alamat Lengkap</p>
              <p>{userData.alamat}</p>
            </div>
            <button
              onClick={handleOpenEditModal}
              className="mt-4 py-2 px-4 bg-[#DE9455] text-white hover:bg-[#f89b59] transition duration-300 rounded"
            >
              Edit Profil
            </button>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          userData={userData}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateUser}
        />
      )}

      {isUploadModalOpen && (
        <UploadPhotoModal
          userId={userData.id_user}
          onClose={handleCloseUploadModal}
          onUpdate={handleUpdatePhoto}
        />
      )}
    </>
  );
};

export default ProfilUserPage;
