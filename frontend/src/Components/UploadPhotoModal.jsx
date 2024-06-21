import React, { useState } from "react";
import axios from "axios";

const MAX_FILE_SIZE_MB = 3; // Ukuran maksimal file dalam MB
const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"]; // Format file yang diizinkan

const UploadPhotoModal = ({ onClose, onUpdate }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Periksa apakah file yang diupload memiliki format yang diizinkan
    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);

      setErrorMessage("");
    } else {
      setFile(null);
      setPreview(null);
      setErrorMessage(
        "Harap pilih file gambar dengan format JPG, JPEG, atau PNG."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Harap pilih file gambar terlebih dahulu.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Ukuran file melebihi batas ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.put("/users/update-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        onUpdate(response.data.photoUrl); // Update URL foto baru di komponen utama
        onClose(); // Tutup modal setelah berhasil
      } else {
        console.error("Invalid response format:", response);
        alert("Gagal mengunggah foto. Format respons tidak valid.");
      }
    } catch (error) {
      console.error("Gagal mengunggah foto:", error);
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert("Gagal mengunggah foto. Kesalahan server.");
      } else {
        console.error("Kesalahan umum:", error.message);
        alert("Gagal mengunggah foto. Kesalahan umum.");
      }
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.delete("/users/delete-photo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        onUpdate(null); // Hapus URL foto dari komponen utama
        onClose(); // Tutup modal setelah berhasil menghapus
      } else {
        console.error("Invalid response format:", response);
        alert("Gagal menghapus foto. Format respons tidak valid.");
      }
    } catch (error) {
      console.error("Gagal menghapus foto:", error);
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert("Gagal menghapus foto. Kesalahan server.");
      } else {
        console.error("Kesalahan umum:", error.message);
        alert("Gagal menghapus foto. Kesalahan umum.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3 max-h-screen overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">Upload Foto Profil</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file" className="block text-gray-700">
              Foto Profil
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
          {preview && (
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 py-2 px-4 text-gray-500 rounded absolute top-0 right-0 mt-4 mr-4"
            >
              <i className="fas fa-times"></i> {/* Icon silang */}
            </button>
          </div>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleDeletePhoto}
              className="mr-4 py-2 px-4 border border-[#DE9455] bg-white text-[#DE9455] hover:bg-[#DE9455] hover:text-white transition duration-300 rounded"
            >
              <i className="fas fa-trash-alt"></i> {/* Icon tempat sampah */}
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
