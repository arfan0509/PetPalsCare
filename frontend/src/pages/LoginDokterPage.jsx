import { useState, useEffect } from "react";
import Logo from "../assets/images/logo.png";
import "aos/dist/aos.css";
import AOS from "aos";
import axiosInstance from "../context/axiosConfig";

const LoginDokterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan kata sandi harus diisi.");
      return;
    }

    try {
      const response = await axiosInstance.post("/doctors/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        window.location.href = "/Profil-dokter";
      } else {
        setError("Login gagal, silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Terjadi kesalahan saat melakukan login.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-1/2 h-screen flex justify-center items-center">
        <div className="w-full p-20 text-center">
          <div className="text-lg w-auto h-auto font-semibold">
            <h1>Masuk Sebagai Dokter Hewan</h1>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="text-red-500">{error}</div>}
            <div className="py-4">
              <input
                type="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="relative py-4">
              <input
                type={showPassword ? "text" : "password"}
                className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#eee] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Kata Sandi"
                value={password}
                onChange={handlePasswordChange}
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
            <div className="p-4">
              <button
                type="submit"
                className="w-auto h-auto bg-[#DE9455] hover:bg-[#D68B4B] text-white font-bold py-2 px-16 rounded-full font-semibold"
              >
                Masuk Sekarang
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-1/2 h-screen bg-[#F7DBA7] flex justify-center items-center custom-border-radius">
        <div className="">
          <div className="h-auto w-full max-w-72">
            <a href="/">
              <img src={Logo} alt="Logo" />
            </a>
          </div>
          <div className="p-4 flex justify-center items-center">
            <a href="/Verifikasi">
              <button className="w-auto h-auto bg-[#DE9455] hover:bg-[#D68B4B] text-white font-bold py-2 px-16 rounded-full font-semibold">
                Daftar Dokter
              </button>
            </a>
          </div>
          <div className="flex justify-center items-center">
            <a href="/Login-PetPalsCare" className="text-[#777]">
              Masuk Sebagai Pemilik
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDokterPage;
