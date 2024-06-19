import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../Components/Footer-after";
import Navbar from "../Components/Navbar-after";
import axios from "../context/axiosConfig";

const DetailDokter = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctorDetail = async () => {
      try {
        const response = await axios.get(`/users/doctor/${id}`);
        setDoctor(response.data);
      } catch (error) {
        console.error("Failed to fetch doctor details:", error);
      }
    };

    fetchDoctorDetail();
  }, [id]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  // Membuat URL untuk pencarian di Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    doctor.alamat
  )}`;

  // Fungsi untuk mengirim pesan WhatsApp
  const openWhatsApp = () => {
    const phoneNumber = doctor.no_hp;
    const message =
      "Halo Dokter, saya ingin berkonsultasi mengenai hewan peliharaan saya.";

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      <Navbar />
      <div className="bg-white py-12 sm:py-16 font-poppins">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-1">
            <article className="flex flex-col items-start justify-between bg-white shadow-lg rounded-lg p-6 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-x-6 mt-3 w-full">
                {doctor.url_foto ? (
                  <img
                    src={doctor.url_foto}
                    alt=""
                    className="h-40 w-40 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 flex justify-center items-center">
                    <i className="fas fa-user-doctor text-9xl text-[#ED9455]"></i>
                  </div>
                )}
                <div className="flex flex-col mt-3 sm:mt-0 w-full">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Drh. {doctor.nama}
                  </h3>

                  <p className="mt-5 leading-6 text-gray-600">
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#564741" }}>
                        <strong>Usia:</strong>
                      </span>{" "}
                      {doctor.usia} Tahun
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#564741" }}>
                        <strong>Spesialisasi:</strong>
                      </span>{" "}
                      {doctor.spesialis}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#564741" }}>
                        <strong>Nomor Handphone:</strong>
                      </span>{" "}
                      {doctor.no_hp}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#564741" }}>
                        <strong>Email:</strong>
                      </span>{" "}
                      {doctor.email}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#564741" }}>
                        <strong>Lulusan:</strong>
                      </span>{" "}
                      {doctor.lulusan}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#564741" }}>
                        <strong>Alamat Praktik/Klinik:</strong>
                      </span>{" "}
                      {doctor.alamat}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#564741" }}>
                        <strong>Pengalaman:</strong>
                      </span>{" "}
                      {doctor.pengalaman}
                    </div>
                  </p>

                  <div className="mt-5 flex space-x-4">
                    <button
                      className="px-4 py-2 bg-[#ED9455] text-white rounded-lg hover:bg-[#d8854c]"
                      onClick={openWhatsApp}
                    >
                      Konsultasi via WhatsApp
                    </button>
                    <button
                      className="px-4 py-2 bg-[#ED9455] text-white rounded-lg hover:bg-[#d8854c]"
                      onClick={() => window.open(googleMapsUrl, "_blank")}
                    >
                      Lokasi Praktik
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailDokter;
