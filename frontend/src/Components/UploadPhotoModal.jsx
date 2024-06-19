import React, { useState } from "react";
import axios from "../context/axiosConfig";

const MAX_FILE_SIZE_MB = 3; // Ukuran maksimal file dalam MB

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"]; // Format file yang diizinkan

const UploadPhotoModal = ({ onClose, onUpdate }) => {
  // State untuk menyimpan file dan pratinjau
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fungsi untuk menangani perubahan file
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
    } else {
      alert("Please select a valid image file (jpg, jpeg, or png)");
    }
  };

  // Fungsi untuk menghapus foto profil
  const handleDeletePhoto = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.delete("/users/delete-photo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response && response.data && response.data.message) {
        onUpdate(null); // Update parent component with null photo URL
        onClose(); // Close the modal
        window.location.reload();
      } else {
        console.error("Invalid response format:", response);
        alert("Failed to delete user photo. Invalid response format.");
      }
    } catch (error) {
      console.error("Failed to delete user photo", error);
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert("Failed to delete user photo. Server error.");
      } else {
        console.error("General error:", error.message);
        alert("Failed to delete user photo. General error.");
      }
    }
  };

  // Fungsi untuk menangani pengiriman file
  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!file) {
      alert("Please select a file first");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB`);
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
        onUpdate(response.data.photoUrl); // Update parent component with new photo URL
        onClose(); // Close the modal
        window.location.reload();
      } else {
        console.error("Invalid response format:", response);
        alert("Failed to update user photo. Invalid response format.");
      }
    } catch (error) {
      console.error("Failed to update user photo", error);
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert("Failed to update user photo. Server error.");
      } else if (error.request) {
        console.error("Request error:", error.request);
        alert("Failed to update user photo. Request error.");
      } else {
        console.error("General error:", error.message);
        alert("Failed to update user photo. General error.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3 max-h-screen overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">Upload Foto Profil</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Foto Profil</label>
            <input
              type="file"
              name="foto"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
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
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 py-2 px-4 text-gray-500 rounded absolute top-0 right-0 mt-4 mr-4"
            >
              <i className="fas fa-times"></i> {/* Icon silang */}
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDeletePhoto}
              className="mr-4 py-2 px-4 border border-[#ED9455] bg-white text-[#ED9455] hover:bg-[#ED9455] hover:text-white transition duration-300 rounded"
            >
              <i className="fas fa-trash-can"></i> {/* Icon silang */}
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
