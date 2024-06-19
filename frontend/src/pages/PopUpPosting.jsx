import React, { useState } from 'react';

const PopUpPosting = () => {
  // Definisikan state untuk menyimpan nilai form
  const [formData, setFormData] = useState({
    nama: '',
    jenis_hewan: '',
    gender: '',
    warna: '',
    umur: '',
    deskripsi : '',
  });

  // Fungsi untuk menangani perubahan input form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman saat submit

    try {
      // Mengirim data form ke API
      const response = await fetch('/users/UploadHewan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Mengubah data form menjadi JSON
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Data berhasil diupload', result); // Tampilkan pesan sukses di konsol
      } else {
        console.error('Terjadi kesalahan saat mengupload data', result); // Tampilkan pesan error di konsol
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengupload data', error); // Tangani error saat submit
    }
  };

  return (
    <>
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='bg-white w-auto rounded-lg shadow-lg'>
          <div className='p-4 text-xl font-bold'>
            <h1>Posting Hewan Saya</h1>
          </div>
          <form onSubmit={handleSubmit} className='w-auto h-auto flex justify-center items-center'>
            <div className='w-full h-auto'>
              <div className='p-4'>
                <label htmlFor="nama">Nama Panggilan</label>
                <br />
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} className='border border-black rounded-md' required />
              </div>

              <div className='px-4'>
                <label htmlFor="gender">Jenis Kelamin</label>
                <br />
                <div className='flex gap-4'>
                  <div>
                    <input type="radio" id="jantan" name="gender" value="jantan" onChange={handleChange} />
                    <label htmlFor="jantan" className="ml-2">Jantan</label>
                  </div>
                  <div>
                    <input type="radio" id="betina" name="gender" value="betina" onChange={handleChange} />
                    <label htmlFor="betina" className="ml-2">Betina</label>
                  </div>
                </div>
              </div>

              <div className='p-4'>
                <label htmlFor="warna">Warna</label>
                <br />
                <input type="text" name="warna" value={formData.warna} onChange={handleChange} className='border border-black rounded-md' required />
              </div>
            </div>

            <div className='w-auto h-auto'>
              <div className='pl-4 pt-4 pb-16'>
                <label htmlFor="jenis_hewan">Jenis Hewan</label>
                <br />
                <input type="text" name="jenis_hewan" value={formData.jenis_hewan} onChange={handleChange} className='border border-black rounded-md' required />
              </div>

              <div className='p-4'>
                <label htmlFor="umur">Umur</label>
                <br />
                <input type="text" name="umur" value={formData.umur} onChange={handleChange} className='border border-black rounded-md' required />
              </div>
            </div>
            
            {/* text area */}
            <div className='max-w-md mx-auto p-4'>
              <div>
                <label htmlFor="informasiTambahan" className="block text-lg font-medium mb-2">
                  Informasi Tambahan
                </label>
                <textarea name="informasiTambahan" id="informasiTambahan" value={formData.deskripsi} onChange={handleChange} className='w-full h-20 p-4 border border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black-0 focus:border-black-0'></textarea>
              </div>
            </div>

            {/* button */}
            <div className='w-full h-full flex justify-center p-4'>
              <div className='border px-16 py-2 rounded-full bg-[#DE9455] hover:bg-[#D68B4B] text-white'>
                <button type="submit">Posting</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PopUpPosting;
