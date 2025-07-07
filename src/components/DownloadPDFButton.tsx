import React from 'react';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';
import { Message } from '../types';

interface UserType {
  id: string;
  name: string;
  avatar: string;
}

interface DownloadPDFButtonProps {
  messages: Message[];
  users: UserType[];
  emotionStats: Record<string, number>;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ messages, users, emotionStats }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFont('courier', 'bold');
    doc.setFontSize(14);
    doc.text('------------------------------------------------', 10, y); y += 8;
    doc.text('           ROIYAN CHAT REPORT', 10, y); y += 8;
    doc.text('------------------------------------------------', 10, y); y += 10;

    // Tanggal
    const today = new Date();
    const tanggal = today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.setFont('courier', 'normal');
    doc.setFontSize(12);
    doc.text(`Tanggal: ${tanggal}`, 10, y); y += 8;
    // Peserta
    const peserta = users.map(u => u.name).join(', ');
    doc.text(`Peserta: ${peserta}`, 10, y); y += 10;

    // Riwayat Chat
    doc.setFont('courier', 'bold');
    doc.text('------------------------------------------------', 10, y); y += 8;
    doc.text('Riwayat Chat:', 10, y); y += 8;
    doc.text('------------------------------------------------', 10, y); y += 8;
    doc.setFont('courier', 'normal');
    messages.forEach(msg => {
      const user = users.find(u => u.id === msg.user);
      const time = new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const emotion = msg.emotion?.emotion || '-';
      const emoji = msg.emotion?.emoji || '🙂';
      const text = `[${time}] ${user?.name || msg.user} (${emoji} ${emotion}): ${msg.content}`;
      doc.text(text, 10, y);
      y += 8;
      if (y > 270) { doc.addPage(); y = 10; }
    });
    y += 5;

    // Statistik Emosi
    doc.setFont('courier', 'bold');
    doc.text('------------------------------------------------', 10, y); y += 8;
    doc.text('Statistik Emosi:', 10, y); y += 8;
    doc.text('------------------------------------------------', 10, y); y += 8;
    doc.setFont('courier', 'normal');
    Object.entries(emotionStats).forEach(([emotion, count]) => {
      doc.text(`${emotion.charAt(0).toUpperCase() + emotion.slice(1)}: ${count} pesan`, 10, y);
      y += 8;
      if (y > 270) { doc.addPage(); y = 10; }
    });
    y += 8;
    // Pie chart legend (optional)
    doc.setFont('courier', 'bold');
    doc.text('------------------------------------------------', 10, y); y += 8;
    doc.text('Keterangan:', 10, y); y += 8;
    doc.setFont('courier', 'normal');
    Object.entries(emotionStats).forEach(([emotion, count]) => {
      const emoji = messages.find(m => m.emotion?.emotion === emotion)?.emotion?.emoji || '🙂';
      doc.text(`${emoji} = ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`, 10, y);
      y += 8;
      if (y > 270) { doc.addPage(); y = 10; }
    });

    doc.save('riwayat_chat.pdf');
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="flex items-center gap-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 shadow transition"
      title="Download PDF Riwayat Chat"
    >
      <Download className="w-5 h-5" /> Download PDF
    </button>
  );
};

export default DownloadPDFButton;
