import { createContext, useContext, useState } from 'react';

const RoomBookingContext = createContext(null);

export const RoomBookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  const addBooking = async (room, start, time, email) => {
    // Call the API to add a booking
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ room, start, time, email }),
    });

    if (!response.ok) {
      throw new Error('Failed to add booking');
    }

    const data = await response.json();
    setBookings((prev) => [...prev, data.booking]);
  };

  return (
    <RoomBookingContext.Provider value={{ bookings, addBooking }}>
      {children}
    </RoomBookingContext.Provider>
  );
};

export const useRoomBooking = () => {
  return useContext(RoomBookingContext);
}; 