import React, { useState, useEffect } from "react";
import axios from "../context/axiosConfig";
import { jwtDecode } from "jwt-decode";
import EditProfileDokterModal from "../Components/EditProfileDokterModal";
import UploadPhotoDokterModal from "../Components/UploadPhotoDokterModal";

const logoutDoctor = async () => {
  try {
    await axios.delete("/doctors/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  } catch (error) {
    console.error("Failed to logout:", error);
    // Tindakan penanganan kesalahan jika diperlukan
  }
};

const ProfilDokterPage = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Doctor not authenticated");
        window.location.href = "Login-dokter"; // Ganti dengan rute login untuk dokter
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const response = await axios.get("/doctors/dokter-data", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDoctorData(response.data[0]);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctor data");
        window.location.href = "Login-dokter"; // Ganti dengan rute login untuk dokter
      }
    };

    fetchDoctorData();
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

  const handleUpdateDoctor = (updatedDoctor) => {
    setDoctorData(updatedDoctor);
  };

  const handleUpdatePhoto = (photoUrl) => {
    setDoctorData({ ...doctorData, url_foto: photoUrl });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!doctorData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-white-light-2 w-full h-auto flex justify-start font-poppins">
        <div className="w-1/3 h-screen p-8">
          <ul>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="/Profil">Profil Saya</a>
            </li>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="/GantiPassword-dokter">Ubah Kata Sandi</a>
            </li>

            <div className="py-4"></div>
            <li className="p-2 hover:bg-red-500 hover:text-white border-collapse rounded-lg transition duration-200">
              <button onClick={logoutDoctor}>Keluar</button>
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
                {doctorData.url_foto ? (
                  <img
                    src={doctorData.url_foto}
                    alt="Doctor Photo"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <i className="fas fa-user text-4xl text-[#ED9455]"></i>
                )}
              </div>
              <div>
                <h1 className="text-xl font-medium">Drh. {doctorData.nama}</h1>
                <p>Dokter Hewan</p>
              </div>
            </div>
            <div className="flex justify-start gap-8 items-center w-full h-auto gap-28 py-4">
              <div>
                <p className="font-medium">Usia</p>
                <p>{doctorData.usia} Tahun</p>
              </div>
              <div>
                <p className="font-medium">Jenis Kelamin</p>
                <p>{doctorData.gender}</p>
              </div>
            </div>
            <div className="flex justify-start gap-8 items-center w-full h-auto gap-28 py-4">
              <div>
                <p className="font-medium">Spesialisasi</p>
                <p>{doctorData.spesialis}</p>
              </div>
            </div>
            <div className="py-4">
              <p className="font-medium">Nomor Handphone</p>
              <p>{doctorData.no_hp}</p>
            </div>
            <div className="py-4">
              <p className="font-medium">Email</p>
              <p>{doctorData.email}</p>
            </div>
            <div className="py-4">
              <p className="font-medium">Lulusan</p>
              <p>{doctorData.lulusan}</p>
            </div>
            <div className="py-4">
              <p className="font-medium">Alamat Praktik/Klinik</p>
              <p>{doctorData.alamat}</p>
            </div>
            <div className="py-4">
              <p className="font-medium">Pengalaman</p>
              <p>{doctorData.pengalaman} Tahun</p>
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
        <EditProfileDokterModal
          doctorData={doctorData}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateDoctor}
        />
      )}

      {isUploadModalOpen && (
        <UploadPhotoDokterModal
          doctorId={doctorData.id_dokter}
          onClose={handleCloseUploadModal}
          onUpdate={handleUpdatePhoto}
        />
      )}
    </>
  );
};

export default ProfilDokterPage;
