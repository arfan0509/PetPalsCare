import React, { useState, useEffect } from "react";
import axiosInstance from "../context/axiosConfig"; // Import axiosInstance yang telah didefinisikan sebelumnya
import { jwtDecode } from "jwt-decode";
import Logo from "../assets/images/logo.png";

function NavbarAfter({ onSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fungsi untuk mengambil data pengguna dari server
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        // Handle jika pengguna tidak terautentikasi
        console.error("User not authenticated");
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const response = await axiosInstance.get("/users/users-data");
        setUserData(response.data[0]); // Karena responsenya berupa array
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  // Fungsi untuk menangani submit pencarian
  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    onSearch(searchTerm); // Panggil prop onSearch yang diterima dari parent dengan parameter searchTerm
  };

  return (
    <nav className="bg-[#F7DBA7] shadow-lg font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="/Beranda" className="flex items-center py-2 px-2">
              <img src={Logo} alt="Logo" className="h-16 w-15" />
            </a>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-10 font-sans">
            <a
              href="/Beranda"
              className="py-4 px-2 text-black font-medium hover:text-[#ED9455] transition duration-300"
            >
              Beranda
            </a>
            <a
              href="/Dokter-hewan"
              className="py-4 px-2 text-black font-medium hover:text-[#ED9455] transition duration-300"
            >
              Cari Dokter
            </a>
            <a
              href="/Adopsi-hewan"
              className="py-4 px-2 text-black font-medium hover:text-[#ED9455] transition duration-300"
            >
              Adopsi
            </a>
            <a
              href="/TentangKami"
              className="py-4 px-2 text-black font-medium hover:text-[#ED9455] transition duration-300"
            >
              Tentang Kami
            </a>
          </div>

          {/* Search and User Button */}
          <div className="hidden md:flex items-center space-x-3 font-sans">
            <form onSubmit={handleSubmitSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-5 py-1 pl-10 border rounded-full focus:border-[#DE9455]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <i className="fas fa-search text-gray-500"></i>
                </span>
              </div>
            </form>
            <div className="relative">
              <a href="/Profil">
                <button className="ml-[120px] flex items-center justify-center w-12 h-12 bg-white border border-[#ED9455] text-[#ED9455] rounded-full hover:bg-[#f89b59] hover:text-white transition duration-300">
                  {userData && userData.url_foto ? (
                    <img
                      src={userData.url_foto}
                      alt="User Photo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <i className="fas fa-user text-lg"></i>
                  )}
                </button>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="outline-none" onClick={() => setIsOpen(!isOpen)}>
              <svg
                className="w-6 h-6 text-gray-500 hover:text-blue-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} pb-4`}>
        <a href="/" className="block py-2 px-4 text-sm hover:bg-gray-200">
          Beranda
        </a>
        <a
          href="/Daftar-dokter-hewan"
          className="block py-2 px-4 text-sm hover:bg-gray-200"
        >
          Cari Dokter
        </a>
        <a
          href="/Adopsi-hewan"
          className="block py-2 px-4 text-sm hover:bg-gray-200"
        >
          Adopsi
        </a>
        <a
          href="/Tentang-PetPalsCare"
          className="block py-2 px-4 text-sm hover:bg-gray-200"
        >
          Tentang Kami
        </a>
        <div className="px-4 py-2">
          <form onSubmit={handleSubmitSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-2 py-1 pl-10 border rounded-md focus:border-[#DE9455]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <i className="fas fa-search text-gray-500"></i>
              </span>
            </div>
          </form>
        </div>
        <div className="flex justify-center py-2 px-4 mx-4 my-2">
          <a href="/Profil">
            <button className="flex items-center justify-center w-12 h-12 bg-white border border-[#ED9455] text-[#ED9455] rounded-full hover:bg-[#f89b59] hover:text-white transition duration-300">
              <i className="fas fa-user text-lg"></i>
            </button>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAfter;
