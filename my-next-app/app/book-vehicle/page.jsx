'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../lib/api';
import MessageBox from '../../components/MessageBox';

export default function SearchBook() {
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const formik = useFormik({
    initialValues: {
      capacityRequired: '',
      fromPincode: '',
      toPincode: '',
      startDate: '',
      startTime: '',
    },
    validationSchema: Yup.object({
      capacityRequired: Yup.number().required('Required'),
      fromPincode: Yup.string().required('Required'),
      toPincode: Yup.string().required('Required'),
      startDate: Yup.string().required('Required'),
      startTime: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      const fullStartTime = new Date(`${values.startDate}T${values.startTime}`).toISOString();

      try {
        const res = await API.get('/vehicles/available', {
          params: {
            ...values,
            startTime: fullStartTime,
          },
        });
        setVehicles(res.data);
        setMessage('');
      } catch (err) {
        setMessage('Error fetching vehicles');
        setType('error');
      }
    },
  });

  const handleBook = async (vehicleId) => {
    const { fromPincode, toPincode, startDate, startTime } = formik.values;
    const fullStartTime = new Date(`${startDate}T${startTime}`).toISOString();

    try {
      const res = await API.post('/bookings', {
        vehicleId,
        fromPincode,
        toPincode,
        startTime: fullStartTime,
        customerId: 'demo-user-123',
      });
      setMessage(res.data.message);
      setType('success');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed');
      setType('error');
    }
  };

  const getEstimatedHours = () => {
    const { toPincode, fromPincode } = formik.values;
    return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
  };

  const getMinDate = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  };

  const getMinTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-6 py-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">🚚 Search & Book Vehicle</h1>

      <MessageBox message={message} type={type} />

      {/* Formik Form */}
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 mb-6">
        <input
          type="number"
          name="capacityRequired"
          placeholder="Capacity Required (KG)"
          className="border p-3 rounded-md"
          onChange={formik.handleChange}
          value={formik.values.capacityRequired}
        />
        {formik.touched.capacityRequired && formik.errors.capacityRequired && (
          <div className="text-red-500 text-sm">{formik.errors.capacityRequired}</div>
        )}

        <input
          type="text"
          name="fromPincode"
          placeholder="From Pincode"
          className="border p-3 rounded-md"
          onChange={formik.handleChange}
          value={formik.values.fromPincode}
        />
        {formik.touched.fromPincode && formik.errors.fromPincode && (
          <div className="text-red-500 text-sm">{formik.errors.fromPincode}</div>
        )}

        <input
          type="text"
          name="toPincode"
          placeholder="To Pincode"
          className="border p-3 rounded-md"
          onChange={formik.handleChange}
          value={formik.values.toPincode}
        />
        {formik.touched.toPincode && formik.errors.toPincode && (
          <div className="text-red-500 text-sm">{formik.errors.toPincode}</div>
        )}

        <div className="flex gap-4">
          <div className="w-1/2">
            <input
              type="date"
              name="startDate"
              className="border p-3 rounded-md w-full"
              min={getMinDate()}
              onChange={formik.handleChange}
              value={formik.values.startDate}
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-red-500 text-sm">{formik.errors.startDate}</div>
            )}
          </div>

          <div className="w-1/2">
            <input
              type="time"
              name="startTime"
              className="border p-3 rounded-md w-full"
              min={formik.values.startDate === getMinDate() ? getMinTime() : undefined}
              onChange={formik.handleChange}
              value={formik.values.startTime}
            />
            {formik.touched.startTime && formik.errors.startTime && (
              <div className="text-red-500 text-sm">{formik.errors.startTime}</div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition duration-200"
          >
            🔍 Search Availability
          </button>
        </div>
      </form>

      {/* Vehicle List */}
      <ul className="space-y-5">
        {vehicles.map((vehicle) => (
          <li key={vehicle._id} className="border p-5 rounded-lg shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-gray-800">{vehicle.name}</p>
                <p className="text-sm text-gray-600">
                  Capacity: {vehicle.capacityKg} KG | Tyres: {vehicle.tyres}
                </p>
                <p className="text-sm mt-1 text-gray-500">
                  Estimated Ride Time: <span className="font-semibold">{getEstimatedHours()} hour(s)</span>
                </p>
              </div>
              <button
                onClick={() => handleBook(vehicle._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
              >
                ✅ Book Now
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
