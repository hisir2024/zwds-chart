'use client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PdfExporter({ targetId }: { targetId: string }) {
  const handleExport = async () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false, backgroundColor: '#1a1a2e' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, w, h);
    pdf.save(`紫微命盘_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-3 border border-[#c9a84c] text-[#c9a84c] rounded-lg hover:bg-[#c9a84c] hover:text-[#1a1a2e] text-sm transition-colors"
    >
      导出PDF
    </button>
  );
}
