import React, { useState } from "react";
import axios from "../context/axiosConfig";

const MAX_FILE_SIZE_MB = 3; // Ukuran maksimal file dalam MB

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"]; // Format file yang diizinkan

const UploadPhotoModal = ({ onClose, onUpdate }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert("Harap pilih file gambar yang valid (jpg, jpeg, atau png)");
    }
  };

  const handleDeletePhoto = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.delete("/users/delete-photo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response && response.data && response.data.message) {
        onUpdate(null); // Perbarui komponen induk dengan URL foto null
        onClose(); // Tutup modal
      } else {
        console.error("Format respons tidak valid:", response);
        alert("Gagal menghapus foto pengguna. Format respons tidak valid.");
      }
    } catch (error) {
      console.error("Gagal menghapus foto pengguna", error);
      if (error.response) {
        console.error("Error server:", error.response.data);
        alert("Gagal menghapus foto pengguna. Kesalahan server.");
      } else {
        console.error("Kesalahan umum:", error.message);
        alert("Gagal menghapus foto pengguna. Kesalahan umum.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!file) {
      alert("Harap pilih file terlebih dahulu");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Ukuran file melebihi batas ${MAX_FILE_SIZE_MB} MB`);
      return;
    }

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const response = await axios.put("/users/update-photo", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.data && response.data.photoUrl) {
        onUpdate(response.data.photoUrl); // Perbarui komponen induk dengan URL foto baru
        onClose(); // Tutup modal
      } else {
        console.error("Format respons tidak valid:", response);
        alert("Gagal memperbarui foto pengguna. Format respons tidak valid.");
      }
    } catch (error) {
      console.error("Gagal memperbarui foto pengguna", error);
      if (error.response) {
        console.error("Error server:", error.response.data);
        alert("Gagal memperbarui foto pengguna. Kesalahan server.");
      } else if (error.request) {
        console.error("Error permintaan:", error.request);
        alert("Gagal memperbarui foto pengguna. Kesalahan permintaan.");
      } else {
        console.error("Kesalahan umum:", error.message);
        alert("Gagal memperbarui foto pengguna. Kesalahan umum.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3 max-h-screen overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">Upload Foto Profil</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="foto" className="block text-gray-700">
              Foto Profil
            </label>
            <input
              type="file"
              id="foto"
              name="foto"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {preview && (
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="Pratinjau"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 py-2 px-4 text-gray-500 rounded absolute top-0 right-0 mt-4 mr-4"
            >
              <i className="fas fa-times"></i> {/* Ikoni silang */}
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDeletePhoto}
              className="mr-4 py-2 px-4 border border-[#ED9455] bg-white text-[#ED9455] hover:bg-[#ED9455] hover:text-white transition duration-300 rounded"
            >
              <i className="fas fa-trash-can"></i> {/* Ikoni silang */}
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

export default UploadPhotoModal;
