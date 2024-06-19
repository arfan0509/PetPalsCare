import React from "react";

const posts = [
  {
    id: 1,
    content:
      "Welcome to PetPals Care!<br />Hello <strong>Destya Vinka!</strong> <strong>drs. Muhammad Ali</strong> will be here with you shortly.<br />Please describe your medical condition",
    bgColor: "bg-white", // Warna putih untuk chat 1
    height: "h-auto", // Tinggi kolom chat 1 menyesuaikan isi
    maxWidth: "max-w-full", // Lebar maksimum kolom chat 1
  },
  {
    id: 2,
    content:
      "Selamat siang, Saya drh. Muhammad Ali. Ada yang bisa saya bantu? Jangan lupa untuk memberikan feedback untuk saya di akhir sesi ya.",
    bgColor: "bg-white", // Warna putih untuk chat 2
    height: "h-auto", // Tinggi kolom chat 2 menyesuaikan isi
    maxWidth: "max-w-full", // Lebar maksimum kolom chat 2
  },
  {
    id: 3,
    content:
      "Selamat siang dok, Saya ingin berkonsultasi mengenai kucing peliharaan saya",
    bgColor: "bg-[#FCEED5]", // Warna khusus untuk chat 3
    height: "h-auto", // Tinggi kolom chat 3 menyesuaikan isi
    maxWidth: "max-w-full", // Lebar maksimum kolom chat 3
    marginLeft: "ml-16", // Geser ke samping lebih jauh
  },
];

const Chat = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Bagian informasi dokter */}
      <div className="flex items-center justify-between bg-white p-4 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <img
              src="src/assets/images/DokterCowo.png"
              alt="Doctor Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium">Drh. Muhammad Ali</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        <button className="text-orange-500 font-semibold">
          <a href="/Detail-dokter-pria">Selesai</a>
        </button>
      </div>

      <div className="mx-auto max-w-2xl mt-10 p-4 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-4 ${post.bgColor} ${post.height} ${post.maxWidth} ${
              post.id === 3 ? post.marginLeft : ""
            } rounded-lg shadow-sm`}
          >
            <p
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></p>
          </div>
        ))}
        <div className="mt-6 flex items-center space-x-4">
          <textarea
            className="flex-1 p-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows="1"
            placeholder="Tulis Pesan..."
            style={{ resize: "none" }}
          />
          <button className="text-white bg-orange-500 p-2 rounded-full shadow-sm">
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
