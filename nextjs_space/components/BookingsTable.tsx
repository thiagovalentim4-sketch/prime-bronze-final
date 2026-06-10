'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  service: {
    name: string;
    price: number;
  };
}

export function BookingsTable() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings', selectedDate],
    queryFn: async () => {
      const res = await fetch(`/api/bookings?date=${selectedDate}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    },
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update booking');
      toast.success('Agendamento atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar agendamento');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando agendamentos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#D4AF37]">Agendamentos</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 bg-black border border-[#D4AF37] rounded-lg"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#D4AF37]">
            <tr>
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Telefone</th>
              <th className="text-left p-2">Serviço</th>
              <th className="text-left p-2">Horário</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Preço</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-[#333] hover:bg-[#1a1a1a]">
                <td className="p-2">{booking.clientName}</td>
                <td className="p-2">{booking.clientPhone}</td>
                <td className="p-2">{booking.service.name}</td>
                <td className="p-2">{booking.startTime} - {booking.endTime}</td>
                <td className="p-2">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className="px-2 py-1 bg-black border border-[#D4AF37] rounded text-xs"
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="CONFIRMED">Confirmado</option>
                    <option value="COMPLETED">Realizado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </td>
                <td className="p-2 font-bold">R$ {booking.service.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          Nenhum agendamento para esta data
        </div>
      )}
    </div>
  );
}