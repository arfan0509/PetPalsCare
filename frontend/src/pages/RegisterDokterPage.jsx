import React, { useState, useEffect } from "react";
import axios from "../context/axiosConfig";
import Logo from "../assets/images/logo.png";
import "aos/dist/aos.css";
import AOS from "aos";

const RegisterDoctorPage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    no_hp: "",
    alamat: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    usia: "",
    lulusan: "",
    spesialis: "",

    pengalaman: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Modifikasi nomor handphone ke format internasional
    const formattedPhoneNumber = `62${formData.no_hp.replace(/^0/, "")}`;

    // Ubah formData untuk nomor handphone yang sudah diformat
    const modifiedFormData = {
      ...formData,
      no_hp: formattedPhoneNumber,
    };

    try {
      const response = await axios.post("/doctors/register", modifiedFormData);

      if (response.status === 201) {
        console.log("Registrasi dokter berhasil");
        window.location.href = "/Login-dokter";
      } else {
        setError("Gagal mendaftar, silakan coba lagi.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError("Terjadi kesalahan saat melakukan registrasi.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        {/* kiri */}
        <div className="w-1/2 h-screen bg-[#F7DBA7] flex justify-center items-center custom-border-radius rotate-180">
          <div>
            <div className="p-4 flex justify-center items-center rotate-180">
              <a href="/Login-dokter">
                <button className="w-auto h-auto bg-[#DE9455] hover:bg-[#D68B4B] text-white font-bold py-2 px-16 rounded-full font-semibold">
                  Masuk
                </button>
              </a>
            </div>
            <div className="h-auto w-full max-w-72 rotate-180">
              <a href="/">
                <img src={Logo} alt="Logo" />
              </a>
            </div>
          </div>
        </div>
        {/* end kiri */}

        {/* kanan */}
        <div className="w-1/2 h-full flex justify-center items-center">
          <div className="w-full p-20 text-center" data-aos="fade-up">
            <div className="text-lg w-auto h-auto font-semibold">
              <h1 className="">Daftar Akun Dokter Hewan</h1>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <div className="text-red-500">{error}</div>}
              <div className="py-2">
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nama"
                />
              </div>
              <div className="py-2">
                <input
                  type="number"
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="No Handphone"
                />
              </div>
              <div className="py-2">
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus
focus
"
                  placeholder="Nama Klinik dan Alamat Lengkap Lokasi Praktek"
                />
              </div>
              <div className="py-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Email"
                />
              </div>
              <div className="py-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus
focus
"
                  placeholder="Kata Sandi"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 py-2"
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
              </div>
              <div className="py-2 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus
focus
"
                  placeholder="Konfirmasi Kata Sandi"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 py-2"
                >
                  {showConfirmPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
              </div>
              <div className="py-2">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Pilih Gender</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="py-2">
                <input
                  type="number"
                  name="usia"
                  value={formData.usia}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Usia"
                />
              </div>
              <div className="py-2">
                <input
                  type="text"
                  name="lulusan"
                  value={formData.lulusan}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Lulusan Dari"
                />
              </div>
              <div className="py-2">
                <input
                  type="text"
                  name="spesialis"
                  value={formData.spesialis}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Spesialis"
                />
              </div>

              <div className="py-2">
                <input
                  type="number"
                  name="pengalaman"
                  value={formData.pengalaman}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Berapa tahun pengalaman sebagai dokter hewan?"
                />
              </div>
              <div className="p-4">
                <button
                  type="submit"
                  className="w-auto h-auto bg-[#DE9455] hover:bg-[#D68B4B] text-white font-bold py-2 px-16 rounded-full font-semibold size-1"
                >
                  Daftar Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* end kanan */}
      </div>
    </>
  );
};

export default RegisterDoctorPage;
