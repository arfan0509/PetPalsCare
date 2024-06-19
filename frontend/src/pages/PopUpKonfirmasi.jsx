import React, { useState } from 'react'
import logo from '../assets/images/logo.png'

const data = [
  { id: 1, Nama: "Drh. Muhammad Ali", BiayaSesi30Menit: 25000, BiayaLayanan: 2000 }
]

const total = (BiayaLayanan, BiayaSesi30Menit) => {
  return BiayaLayanan + BiayaSesi30Menit
}

const PopUpKonfirmasi = () => {

  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Fungsi untuk menangani perubahan pilihan metode pembayaran
  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
    setSelectedBank(''); // Reset pilihan bank saat metode pembayaran berubah
  };

  // Fungsi untuk menangani perubahan pilihan bank
  const handleBankChange = (event) => {
    setSelectedBank(event.target.value);
  };

  return (
    <>
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto'>
        {data.map((item) => (
          <div className='bg-white p-6 rounded-lg shadow-lg w-1/2' key={item.id}>
            <div className='flex justify-start border border-black p-8'>
              <div className='h-20 w-20 rounded-full bg-white border'>
                <img src={logo} alt="" />
              </div>
              <div className='py-4 px-8'>
                <h1>{item.Nama}</h1>
                <p>Dokter Hewan</p>
              </div>
            </div>

            <div className='py-4'>
              <div className='border border-black p-8'>
                <div className='flex justify-between w-full p-4'>
                  <h4>Biaya Sesi 30 Menit</h4>
                  <p className='font-bold'>Rp {item.BiayaSesi30Menit}</p>
                </div>
                <div className='flex justify-between w-full p-4'>
                  <h4>Biaya Layanan</h4>
                  <p className='font-bold'>Rp {item.BiayaLayanan}</p>
                </div>
                <div className='flex justify-between w-full p-4'>
                  <h4>Total Pembayaran</h4>
                  <p className='font-bold'>Rp {total(item.BiayaLayanan, item.BiayaSesi30Menit)}</p>
                </div>
              </div>
            </div>

            <div className='flex justify-between'>
              <div className='w-2/3 h-20 flex items-center justify-start'>
                <form action="" className='w-full h-auto'>
                  <input type="text" className='border border-black rounded-md w-full h-8 p-2 bg-[#D9D9D9] hover:bg-[#bebebe]' placeholder='Masukan voucer' />
                </form>
              </div>

              <div className='flex h-auto w-auto justify-center items-center'>
                <button className='border border-black rounded-md w-full h-8 px-12 bg-[#D9D9D9] hover:bg-[#bebebe]'>Terapkan</button>
              </div>
            </div>

            {/* Drop Down */}
            <div className="container mx-auto p-4">
              <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Metode Pembayaran
              </label>
              <select
                id="payment-method"
                value={selectedMethod}
                onChange={handleMethodChange}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200 mb-4"
              >
                <option value="" disabled hidden>
                  Pilih Metode Pembayaran
                </option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer Bank">Transfer Bank</option>
              </select>

              {selectedMethod === 'Transfer Bank' && (
                <>
                  <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Bank
                  </label>
                  <select
                    id="bank"
                    value={selectedBank}
                    onChange={handleBankChange}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                  >
                    <option value="" disabled hidden>
                      Pilih Bank
                    </option>
                    <option value="BCA">BCA</option>
                    <option value="BRI">BRI</option>
                    <option value="BNI">BNI</option>
                  </select>
                </>
              )}

              {selectedMethod && (
                <p className="mt-4 text-lg">
                  Anda memilih: {selectedMethod} {selectedBank && `- ${selectedBank}`}
                </p>
              )}
            </div>
            <div className='flex justify-center border border-black bg-[#f7a660] hover:bg-[#DE9455]'>
              <button>
                <a href="/Konsultasi-dokter">Konfirmasi</a></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PopUpKonfirmasi;
