'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';
import MessageBox from '../../components/MessageBox';

export default function AddVehicle() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', capacityKg: '', tyres: '' });
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/vehicles', form);
      setMessage('✅ Vehicle added successfully');
      setType('success');
      setForm({ name: '', capacityKg: '', tyres: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add vehicle');
      setType('error');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">🚚 Add New Vehicle</h1>

      <MessageBox message={message} type={type} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Vehicle Name</label>
          <input
            type="text"
            placeholder="E.g. Tata Ace"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Capacity (KG)</label>
          <input
            type="number"
            placeholder="E.g. 1200"
            value={form.capacityKg}
            onChange={e => setForm({ ...form, capacityKg: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Number of Tyres</label>
          <input
            type="number"
            placeholder="E.g. 4"
            value={form.tyres}
            onChange={e => setForm({ ...form, tyres: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200"
        >
          ➕ Add Vehicle
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/book-vehicle')}
          className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-5 rounded-full shadow-lg transition duration-200"
        >
          🚀 Go to Book Vehicle Page
        </button>
      </div>
    </div>
  );
}