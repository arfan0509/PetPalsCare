import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar-after";
import axios from "../context/axiosConfig";
import { jwtDecode } from "jwt-decode";

const logoutUser = async () => {
  try {
    await axios.delete("/users/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  } catch (error) {
    console.error("Failed to logout:", error);
  }
};

const GantiPasswordUser = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("User not authenticated");
        window.location.href = "/Login-PetPalsCare";
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const response = await axios.get("/users/users-data", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data[0]);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data user");
        window.location.href = "/Login-PetPalsCare";
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Password baru dan konfirmasi password tidak cocok");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        "/users/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Password berhasil diubah");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      window.location.href = "/Login-PetPalsCare";
    } catch (error) {
      console.error("Failed to change password", error);
      setPasswordError("Password lama anda salah! Silakan coba lagi.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bg-white-light-2 w-full h-auto flex justify-start font-poppins">
        <div className="w-1/3 h-screen p-8">
          <ul>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="/Profil">Profil Saya</a>
            </li>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="/GantiPassword-user">Ubah Kata Sandi</a>
            </li>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="#">Pesan</a>
            </li>
            <li className="p-2 hover:bg-[#DE9455] hover:text-white border-collapse rounded-lg transition duration-200">
              <a href="/PostingHewan">Posting Hewan Saya</a>
            </li>
            <div className="py-4"></div>
            <li className="p-2 hover:bg-red-500 hover:text-white border-collapse rounded-lg transition duration-200">
              <button onClick={logoutUser}>Keluar</button>
            </li>
          </ul>
        </div>

        <div className="w-full h-auto p-12">
          <div className="bg-white p-10 rounded-xl w-full h-auto shadow-2xl">
            <h1 className="py-4 font-bold text-1xl">Ubah Kata Sandi</h1>
            <form onSubmit={handleChangePassword}>
              <div className="py-4 relative">
                <label className="block text-gray-700">Password Lama</label>
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <span
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-12 cursor-pointer"
                >
                  {showOldPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </span>
              </div>
              <div className="py-4 relative">
                <label className="block text-gray-700">Password Baru</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-12 cursor-pointer"
                >
                  {showNewPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </span>
              </div>
              <div className="py-4 relative">
                <label className="block text-gray-700">
                  Konfirmasi Password Baru
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-12 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </span>
              </div>
              {passwordError && <p className="text-red-500">{passwordError}</p>}
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-[#DE9455] text-white hover:bg-[#f89b59] transition duration-300 rounded"
              >
                Ubah Kata Sandi
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GantiPasswordUser;
