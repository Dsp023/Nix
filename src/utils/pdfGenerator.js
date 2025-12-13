import { jsPDF } from "jspdf";

export const generatePDF = async (contentElement, levelLabel) => {
    // 1. Setup doc
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // ~595pt
    const pageHeight = doc.internal.pageSize.getHeight(); // ~842pt
    const margin = 30;

    // --- Header (Vector Graphics for crispness) ---
    doc.setFillColor(24, 24, 27); // zinc-950
    doc.rect(0, 0, pageWidth, 80, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Nix", margin, 50);

    doc.setFontSize(10);
    doc.setTextColor(161, 161, 170); // zinc-400
    doc.text("Adaptive Explanation Engine", margin + 50, 50);

    doc.setFontSize(10);
    doc.text(new Date().toLocaleDateString(), pageWidth - margin, 40, { align: "right" });
    doc.text(`Level: ${levelLabel}`, pageWidth - margin, 55, { align: "right" });

    // --- HTML Content Rendering ---
    // Render the specific element using doc.html which uses html2canvas internally
    await doc.html(contentElement, {
        callback: function (doc) {
            // --- Footer (added after HTML is rendered so it's on top/bottom correctly) ---
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);

                // Footer bar
                doc.setFillColor(24, 24, 27); // zinc-950
                doc.rect(0, pageHeight - 30, pageWidth, 30, "F");

                doc.setFontSize(8);
                doc.setTextColor(161, 161, 170); // zinc-400
                doc.text("Created with Nix", margin, pageHeight - 12);
                doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 12, { align: "right" });
            }

            doc.save(`Nix_Explanation_${new Date().toISOString().slice(0, 10)}.pdf`);
        },
        x: margin,
        y: 100, // Start below header
        width: pageWidth - (margin * 2), // constrain width
        windowWidth: 800, // Virtual window width to simulate responsiveness
        autoPaging: 'text', // Try to handle paging intelligently
        html2canvas: {
            scale: 0.7, // Scale down to fit A4 width nicely
            backgroundColor: "#18181b", // zinc-900 background for content
            logging: false
        }
    });
};
