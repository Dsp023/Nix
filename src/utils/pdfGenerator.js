import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export explanation element to a PDF file preserving math, formatting, and theme styles.
 *
 * @param {HTMLElement} element - The DOM element containing the rendered explanation.
 * @param {string} topic - Title or topic of the explanation.
 */
export const exportExplanationToPDF = async (element, topic = 'Explanation') => {
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#09090b',
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        const cleanTopic = (topic || 'Explanation')
            .trim()
            .replace(/[^a-zA-Z0-9_\-\s]/g, '')
            .slice(0, 40)
            .replace(/\s+/g, '_');

        pdf.save(`Nix-${cleanTopic || 'Explanation'}.pdf`);
    } catch (err) {
        console.error('Failed to generate PDF:', err);
        throw err;
    }
};
