'use client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PdfExporter({ targetId }: { targetId: string }) {
  const handleExport = async () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
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
      className="px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-100 text-sm"
    >
      导出PDF
    </button>
  );
}
