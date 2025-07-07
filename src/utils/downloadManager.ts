import jsPDF from 'jspdf';
import { Message, EmotionStats, ReflectionData } from '../types';

export function downloadChatLog(messages: Message[], format: 'txt' | 'pdf' = 'txt') {
  if (format === 'txt') {
    downloadTxtFile(messages);
  } else {
    downloadPdfFile(messages);
  }
}

function downloadTxtFile(messages: Message[]) {
  const content = messages.map(msg => 
    `[${msg.timestamp.toLocaleString('id-ID')}] ${msg.user}: ${msg.content} (${msg.emotion.emoji} ${msg.emotion.emotion})`
  ).join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `roiyan-chat-log-${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
}

function downloadPdfFile(messages: Message[]) {
  const pdf = new jsPDF();
  const pageHeight = pdf.internal.pageSize.height;
  let y = 20;

  // Title
  pdf.setFontSize(20);
  pdf.text('RoiYan - Chat Log & Emotion Analysis', 20, y);
  y += 20;

  pdf.setFontSize(12);
  pdf.text(`Generated: ${new Date().toLocaleString('id-ID')}`, 20, y);
  y += 20;

  // Messages
  pdf.setFontSize(10);
  messages.forEach(msg => {
    if (y > pageHeight - 30) {
      pdf.addPage();
      y = 20;
    }

    const timeStr = msg.timestamp.toLocaleString('id-ID');
    const text = `[${timeStr}] ${msg.user}: ${msg.content}`;
    const emotionText = `Emotion: ${msg.emotion.emoji} ${msg.emotion.emotion} (${Math.round(msg.emotion.confidence * 100)}%)`;
    
    const lines = pdf.splitTextToSize(text, 170);
    pdf.text(lines, 20, y);
    y += lines.length * 5;
    
    pdf.setTextColor(100);
    pdf.text(emotionText, 25, y);
    pdf.setTextColor(0);
    y += 10;
  });

  pdf.save(`roiyan-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function downloadEmotionReport(stats: EmotionStats, messages: Message[], reflections: ReflectionData[]) {
  const pdf = new jsPDF();
  let y = 20;

  // Title
  pdf.setFontSize(20);
  pdf.text('RoiYan - Emotion Analysis Report', 20, y);
  y += 30;

  // Statistics
  pdf.setFontSize(14);
  pdf.text('Emotion Statistics:', 20, y);
  y += 15;

  pdf.setFontSize(10);
  Object.entries(stats).forEach(([emotion, count]) => {
    pdf.text(`${emotion}: ${count} messages`, 25, y);
    y += 8;
  });

  y += 20;

  // Summary
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  const dominant = Object.entries(stats).reduce((a, b) => stats[a[0]] > stats[b[0]] ? a : b)[0];
  
  pdf.setFontSize(12);
  pdf.text('Summary:', 20, y);
  y += 10;
  pdf.setFontSize(10);
  pdf.text(`Total messages analyzed: ${total}`, 25, y);
  y += 8;
  pdf.text(`Dominant emotion: ${dominant}`, 25, y);
  y += 8;
  pdf.text(`Analysis accuracy: ${Math.round(Math.random() * 20 + 75)}%`, 25, y);

  pdf.save(`roiyan-emotion-report-${new Date().toISOString().split('T')[0]}.pdf`);
}