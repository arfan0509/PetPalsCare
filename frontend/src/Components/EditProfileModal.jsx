import React, { useState, useEffect } from "react";
import axiosInstance from "../context/axiosConfig";
import AOS from "aos"; // Import AOS library
import "aos/dist/aos.css"; // Import CSS for AOS

const EditProfileModal = ({ userData, onClose, onUpdate }) => {
  useEffect(() => {
    AOS.init(); // Initialize AOS
  }, []);

  const [formData, setFormData] = useState({
    nama: userData.nama,
    no_hp: userData.no_hp,
    email: userData.email,
    gender: userData.gender,
    usia: userData.usia,
    alamat: userData.alamat,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    // Format nomor handphone ke format internasional (tanpa karakter '+')
    const formattedPhoneNumber = `62${formData.no_hp.replace(/^0/, "")}`;

    try {
      await axiosInstance.put(
        "/users/update-data",
        {
          ...formData,
          no_hp: formattedPhoneNumber, // Menggunakan nomor handphone yang sudah diformat
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      onUpdate(formData); // Update data in parent component
      onClose(); // Close the modal
      window.location.reload();
    } catch (error) {
      console.error("Failed to update user data", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div
        className="bg-white p-6 rounded-lg h-4/5 overflow-y-auto w-2/3"
        data-aos="fade-up"
      >
        <h2 className="text-xl font-bold mb-4">Edit Profil</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nomor Handphone</label>
            <input
              type="number"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Jenis Kelamin</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Usia</label>
            <input
              type="number"
              name="usia"
              value={formData.usia}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Alamat Lengkap</label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 py-2 px-4 bg-white border border-[#ED9455] text-[#ED9455] rounded hover:bg-[#ED9455] hover:text-white transition duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-[#DE9455] text-white hover:bg-[#f89b59] transition duration-300 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
