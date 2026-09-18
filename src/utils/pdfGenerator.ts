import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult } from '../types';
import { formatCurrencyAmount } from '../data/currencies';

// Helper to convert an image URL to base64 for jsPDF
async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Could not load logo for PDF:', err);
    return null;
  }
}

export async function generateResultPDF(
  result: CalculationResult,
  userLogoUrl?: string,
  action: 'download' | 'share' = 'download'
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Attempt to load user-uploaded logo or default logo
  let logoBase64: string | null = null;
  if (userLogoUrl && userLogoUrl.startsWith('data:')) {
    logoBase64 = userLogoUrl;
  } else {
    logoBase64 = await getBase64ImageFromUrl(userLogoUrl || '/logo.png');
  }

  // Helper to draw subtle watermark on pages (subtle and readable)
  const addWatermark = () => {
    if (logoBase64) {
      try {
        const wmSize = 85;
        const x = (pageWidth - wmSize) / 2;
        const y = (pageHeight - wmSize) / 2;
        if (typeof (doc as any).GState === 'function') {
          const gState = new (doc as any).GState({ opacity: 0.05 });
          (doc as any).setGState(gState);
          doc.addImage(logoBase64, 'PNG', x, y, wmSize, wmSize);
          const resetGState = new (doc as any).GState({ opacity: 1 });
          (doc as any).setGState(resetGState);
        } else {
          doc.addImage(logoBase64, 'PNG', x, y, wmSize, wmSize);
        }
      } catch (e) {
        console.warn('Failed drawing watermark:', e);
      }
    }
  };

  // Draw initial watermark for Page 1
  addWatermark();

  // Top header banner
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(margin, margin, pageWidth - margin * 2, 28, 'F');

  // Header Logo
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', margin + 4, margin + 4, 20, 20);
    } catch (e) {
      console.warn('Could not render logo in header:', e);
    }
  }

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NAZMUS SAKIB | INVESTMENT CALCULATOR', margin + 28, margin + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // Slate-300
  doc.text('Mathematical Compound Profit & Investment Projection Report', margin + 28, margin + 17);
  doc.text(`Generated: ${result.calculationDate}`, margin + 28, margin + 22);

  // Summary Metrics Section (2x3 grid)
  let curY = margin + 34;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, curY, pageWidth - margin * 2, 46, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('PROJECTION SUMMARY', margin + 6, curY + 7);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 6, curY + 10, pageWidth - margin - 6, curY + 10);

  const colW = (pageWidth - margin * 2 - 12) / 3;

  // Row 1
  // Col 1: Currency
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CURRENCY', margin + 6, curY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.currency.code} (${result.currency.symbol})`, margin + 6, curY + 21);

  // Col 2: Initial Investment
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('INITIAL INVESTMENT', margin + 6 + colW, curY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrencyAmount(result.initialInvestment, result.currency), margin + 6 + colW, curY + 21);

  // Col 3: Daily Target Rate
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('DAILY TARGET PROFIT', margin + 6 + colW * 2, curY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.dailyRate.toFixed(2)}% per day`, margin + 6 + colW * 2, curY + 21);

  // Row 2
  // Col 1: Duration
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('DURATION', margin + 6, curY + 31);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${result.days} Days`, margin + 6, curY + 36);

  // Col 2: Total Profit
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PROJECTED TOTAL PROFIT', margin + 6 + colW, curY + 31);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105); // Emerald-600
  doc.text(`+${formatCurrencyAmount(result.totalProfit, result.currency)}`, margin + 6 + colW, curY + 36);

  // Col 3: Final Balance
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('PROJECTED FINAL BALANCE', margin + 6 + colW * 2, curY + 31);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138); // Blue-900
  doc.text(formatCurrencyAmount(result.finalBalance, result.currency), margin + 6 + colW * 2, curY + 36);

  curY += 52;

  // Daily Breakdown Table
  const tableData = result.dailyRecords.map((r) => [
    `Day ${r.day}`,
    formatCurrencyAmount(r.startingBalance, result.currency),
    formatCurrencyAmount(r.dailyProfit, result.currency),
    formatCurrencyAmount(r.endingBalance, result.currency),
  ]);

  autoTable(doc, {
    startY: curY,
    head: [['Day', 'Starting Balance', 'Daily Profit', 'Ending Balance']],
    body: tableData,
    margin: { left: margin, right: margin, bottom: 26 },
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 26 },
      1: { halign: 'right' },
      2: { halign: 'right', textColor: [5, 150, 105] },
      3: { halign: 'right', fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      // Add watermark on subsequent pages
      if (data.pageNumber > 1) {
        addWatermark();
      }

      // Footer disclaimer & page numbering on each page
      const footerY = pageHeight - 14;
      doc.setFontSize(6.8);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text(
        'Disclaimer: These results are mathematical projections based on the entered assumptions and are not guaranteed returns or financial advice.',
        margin,
        footerY
      );
      doc.text(
        'দাবিত্যাগ: এই ফলাফল ব্যবহারকারীর দেওয়া তথ্যের ভিত্তিতে গাণিতিক হিসাব মাত্র। এটি নিশ্চিত মুনাফার নিশ্চয়তা বা আর্থিক পরামর্শ নয়।',
        margin,
        footerY + 3.8
      );

      const pageStr = `Page ${data.pageNumber}`;
      doc.text(pageStr, pageWidth - margin - doc.getTextWidth(pageStr), footerY + 2);
    },
  });

  const filename = `Nazmus_Sakib_Investment_Projection_${result.currency.code}_${result.days}Days.pdf`;

  if (action === 'share' && navigator.share && navigator.canShare) {
    try {
      const pdfBlob = doc.output('blob');
      const file = new File([pdfBlob], filename, { type: 'application/pdf' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Nazmus Sakib | Investment Calculator Projection',
          text: `Mathematical Investment Projection: Total Profit ${formatCurrencyAmount(result.totalProfit, result.currency)}, Final Balance ${formatCurrencyAmount(result.finalBalance, result.currency)} over ${result.days} days.`,
          files: [file],
        });
        return;
      }
    } catch (e) {
      console.log('Share canceled or not supported, falling back to download:', e);
    }
  }

  // Save the PDF locally
  doc.save(filename);
}

export function triggerPrintResultSheet(): void {
  window.print();
}
