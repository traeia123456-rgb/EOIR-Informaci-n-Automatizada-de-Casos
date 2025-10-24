import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generatePDF(data: string) {
  try {
    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();

    // Añadir una página inicial
    const page = pdfDoc.addPage([595, 842]); // Tamaño A4 en puntos

    // Dibujar el contenido en la página
    page.drawText(data, {
      x: 50,
      y: 780,
      size: 12,
    });

    // Obtener el número total de páginas correctamente
    const numberOfPages = pdfDoc.getPageCount();
    console.log("Número total de páginas:", numberOfPages);

    // Obtener información de la página actual
    const pageInfo = {
      width: page.getWidth(),
      height: page.getHeight(),
      index: pdfDoc.getPageCount() - 1,
    };

    console.log("Información de la página actual:", pageInfo);

    // Guardar el PDF en memoria
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw error;
  }
}

// Función para generar reporte de resumen de casos
export async function generateCasesSummaryReport(cases: any[], stats: any, dateRange?: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let y = 780;
  const lineHeight = 20;
  
  // Título
  page.drawText("Resumen de Casos de Inmigración", {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });
  y -= lineHeight * 2;
  
  // Estadísticas
  page.drawText(`Total de Casos: ${stats.totalCases}`, { x: 50, y, size: 12, font });
  y -= lineHeight;
  page.drawText(`Casos Activos: ${stats.activeCases}`, { x: 50, y, size: 12, font });
  y -= lineHeight;
  page.drawText(`Casos Pendientes: ${stats.pendingCases}`, { x: 50, y, size: 12, font });
  y -= lineHeight * 2;
  
  // Lista de casos
  page.drawText("Casos Recientes:", { x: 50, y, size: 14, font, color: rgb(0, 0, 0) });
  y -= lineHeight;
  
  cases.slice(0, 10).forEach((case_, index) => {
    if (y < 100) {
      // Nueva página si no hay espacio
      const newPage = pdfDoc.addPage([595, 842]);
      y = 780;
    }
    
    page.drawText(`${index + 1}. ${case_.full_name} - ${case_.alien_registration_number}`, {
      x: 70,
      y,
      size: 10,
      font,
    });
    y -= lineHeight;
  });
  
  return await pdfDoc.save();
}

// Función para generar reporte detallado de casos
export async function generateDetailedCasesReport(cases: any[], dateRange?: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let y = 780;
  const lineHeight = 16;
  
  // Título
  page.drawText("Reporte Detallado de Casos", {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });
  y -= lineHeight * 2;
  
  cases.forEach((case_, index) => {
    if (y < 150) {
      const newPage = pdfDoc.addPage([595, 842]);
      y = 780;
    }
    
    page.drawText(`Caso ${index + 1}:`, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
    y -= lineHeight;
    page.drawText(`Nombre: ${case_.full_name}`, { x: 70, y, size: 10, font });
    y -= lineHeight;
    page.drawText(`Número de Registro: ${case_.alien_registration_number}`, { x: 70, y, size: 10, font });
    y -= lineHeight;
    page.drawText(`Estado: ${case_.case_status}`, { x: 70, y, size: 10, font });
    y -= lineHeight * 2;
  });
  
  return await pdfDoc.save();
}

// Función para generar reporte de calendario de audiencias
export async function generateHearingsScheduleReport(cases: any[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let y = 780;
  const lineHeight = 20;
  
  // Título
  page.drawText("Calendario de Audiencias", {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });
  y -= lineHeight * 2;
  
  const casesWithHearings = cases.filter(c => c.next_hearing_date);
  
  casesWithHearings.forEach((case_, index) => {
    if (y < 100) {
      const newPage = pdfDoc.addPage([595, 842]);
      y = 780;
    }
    
    page.drawText(`${case_.next_hearing_date}: ${case_.full_name}`, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= lineHeight;
  });
  
  return await pdfDoc.save();
}

// Función para generar reporte de estadísticas
export async function generateStatisticsReport(stats: any, cases: any[]) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let y = 780;
  const lineHeight = 20;
  
  // Título
  page.drawText("Reporte de Estadísticas", {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });
  y -= lineHeight * 2;
  
  // Estadísticas
  page.drawText(`Total de Casos: ${stats.totalCases}`, { x: 50, y, size: 14, font });
  y -= lineHeight;
  page.drawText(`Casos Activos: ${stats.activeCases}`, { x: 50, y, size: 14, font });
  y -= lineHeight;
  page.drawText(`Casos Pendientes: ${stats.pendingCases}`, { x: 50, y, size: 14, font });
  y -= lineHeight;
  page.drawText(`Casos Completados: ${stats.completedCases}`, { x: 50, y, size: 14, font });
  y -= lineHeight;
  page.drawText(`Casos Rechazados: ${stats.rejectedCases}`, { x: 50, y, size: 14, font });
  y -= lineHeight;
  page.drawText(`Audiencias Programadas: ${stats.scheduledHearings}`, { x: 50, y, size: 14, font });
  y -= lineHeight;
  page.drawText(`Total de Administradores: ${stats.totalAdmins}`, { x: 50, y, size: 14, font });
  
  return await pdfDoc.save();
}

// Función para descargar PDF
export function downloadPDF(pdfBytes: Uint8Array, filename: string) {
  const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
