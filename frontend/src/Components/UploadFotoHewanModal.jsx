import React, { useState } from "react";
import axios from "../context/axiosConfig";

const UploadFotoHewanModal = ({ hewanId, onClose }) => {
  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let validFiles = [];
    let previews = [];
    let totalFiles = photos.length + files.length;

    for (const file of files) {
      const fileType = file.type;
      const fileSize = file.size / 1024 / 1024;

      if (!["image/jpeg", "image/jpg", "image/png"].includes(fileType)) {
        setErrorMessage("File harus dalam format JPG, JPEG, atau PNG.");
        return;
      }

      if (fileSize > 5) {
        setErrorMessage("Ukuran file maksimal adalah 5MB.");
        return;
      }

      previews.push(URL.createObjectURL(file));
      validFiles.push(file);
    }

    if (totalFiles > 5) {
      setErrorMessage("Anda hanya dapat mengunggah maksimal 5 gambar.");
      return;
    }

    setErrorMessage("");
    setPhotos([...photos, ...validFiles]);
    setPreview([...preview, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `/hewan/uploadFotoHewan/${hewanId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Response:", response.data);
      onClose(); // Menutup modal setelah berhasil upload foto
      window.location.reload(); // Refresh halaman untuk memuat perubahan foto
    } catch (error) {
      console.error("Error uploading photos:", error);
      setErrorMessage("Masukkan foto terlebih dahulu.");
    }
  };

  return (
    <div className="font-poppins fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg h-4/5 overflow-y-auto w-2/3">
        <h2 className="text-2xl font-bold mb-4">Upload Foto Hewan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="photos" className="block font-semibold mb-1">
              Pilih Foto (maks. 5 foto)
            </label>
            <input
              type="file"
              id="photos"
              name="photos"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
          {preview.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {preview.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-60 h-60 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#DE9455] text-white rounded-lg hover:bg-[#f89b59] transition duration-300 mt-4"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadFotoHewanModal;
