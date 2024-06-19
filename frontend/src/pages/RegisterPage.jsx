import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../assets/images/logo.png";
import "aos/dist/aos.css";
import AOS from "aos";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    no_hp: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    usia: "",
    alamat: "",
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

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      return;
    }

    // Validate all fields are filled
    for (const key in formData) {
      if (formData[key] === "") {
        setError("Semua bidang harus diisi.");
        return;
      }
    }

    try {
      // Format nomor handphone ke format internasional (tanpa karakter '+')
      const formattedPhoneNumber = `62${formData.no_hp.replace(/^0/, "")}`;

      // Kirim data registrasi ke backend
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          ...formData,
          no_hp: formattedPhoneNumber, // Menggunakan nomor handphone yang sudah diformat
        }
      );

      if (response.status === 201) {
        // Registrasi berhasil, arahkan pengguna ke halaman login
        console.log("Registrasi berhasil");
        window.location.href = "/Login-PetPalsCare";
      } else {
        // Registrasi gagal, tangani kesalahan
        setError("Gagal mendaftar, silakan coba lagi.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        if (error.response.data.message === "Email already exists") {
          alert(
            "Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda."
          );
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError("Terjadi kesalahan saat melakukan registrasi.");
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        {/* kiri */}
        <div className="w-1/2 h-screen bg-[#F7DBA7] flex justify-center items-center custom-border-radius2">
          <div className="">
            <div className="h-auto w-full max-w-72" data-aos="zoom-in">
              <a href="/">
                <img src={Logo} alt="Logo" />
              </a>
            </div>
            <div
              className="p-4 flex justify-center items-center"
              data-aos="fade-up"
            >
              <a href="/Login-PetPalsCare">
                <button className=" w-auto h-auto bg-[#DE9455] hover:bg-[#D68B4B] text-white font-bold py-2 px-16 rounded-full font-semibold ">
                  Masuk{" "}
                </button>
              </a>
            </div>
          </div>
        </div>
        {/* end kiri */}

        {/* kanan */}
        <div
          className="w-1/2 h-screen flex justify-center items-center"
          data-aos="fade-right"
        >
          <div className=" w-full p-20 text-center">
            <div className="text-lg w-auto h-auto font-semibold ">
              <h1 className="">Daftar Akun</h1>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <div className="text-red-500">{error}</div>}
              <div className="py-2" data-aos="fade-up">
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nama"
                />
              </div>
              <div className="py-2" data-aos="fade-up">
                <input
                  type="number"
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="No Handphone"
                />
              </div>
              <div className="py-2" data-aos="fade-up">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Email"
                />
              </div>
              <div className="relative py-2" data-aos="fade-up">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              <div className="relative py-2" data-aos="fade-up">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              <div className="py-2" data-aos="fade-up">
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
              <div className="py-2" data-aos="fade-up">
                <input
                  type="number"
                  name="usia"
                  value={formData.usia}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Usia"
                />
              </div>
              <div className="py-2" data-aos="fade-up">
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Alamat"
                />
              </div>
              <div className="p-4" data-aos="fade-up">
                <button
                  type="submit"
                  className=" w-auto h-auto bg-[#DE9455] hover:bg-[#D68B4B] text-white font-bold py-2 px-16 rounded-full font-semibold size-1 "
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

export default RegisterPage;
