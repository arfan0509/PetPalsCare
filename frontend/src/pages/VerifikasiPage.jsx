import logo from "../assets/images/logo.png";

const VerifikasiPage = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "6289529758541";
    const message = encodeURIComponent(
      "Halo, saya tertarik untuk bergabung sebagai dokter di PetPals Care."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="container mx-auto p-4 font-poppins">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="text-center">
          <img src={logo} alt="logo" className="max-w-28 mx-auto" />
        </div>

        {/* Text */}
        <div className="text-center pt-20">
          <h1 className="text-3xl font-bold">
            Ayo Jadi Bagian dari PetPals Care!
          </h1>
        </div>

        {/* Box */}
        <div className="w-full mt-10 flex justify-center">
          <div className="bg-white shadow-2xl p-8 rounded-lg">
            <h2 className="text-xl text-center">
              Hubungi WhatsApp kami dan kirimkan Curriculum Vitae, STR aktif,
              dan SIP aktif.
            </h2>
          </div>
        </div>

        {/* Button */}
        <div className="w-full mt-8 flex justify-center">
          <button
            className="bg-[#DE9455] hover:bg-[#D68B4B] text-white font-bold py-4 px-8 rounded-full"
            onClick={handleWhatsAppClick}
          >
            Hubungi WhatsApp Kami
          </button>
        </div>

        {/* Return to Home Button */}
        <div className="w-full mt-8 flex justify-center">
          <button className="text-[#ED9455] hover:text-[#f89b59] font-bold py-2 px-4">
            <a href="/Login-dokter">Login Sebagai Dokter</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifikasiPage;
