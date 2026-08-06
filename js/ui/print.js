/**
 * Saída do currículo em dois formatos:
 * 1. diálogo nativo de impressão;
 * 2. download direto de um arquivo PDF.
 */
(function initializePrint(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});

    function ensureReleased() {
        if (App.payment?.canDownload()) return true;
        App.feedback.showError("O currículo será liberado somente após a confirmação do pagamento.");
        return false;
    }

    function fileName() {
        const name = App.state.value.data.nome?.trim() || "Curriculo";
        const safe = name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return `Curriculo-${safe || "Profissional"}.pdf`;
    }

    /** Abre a área de impressão, onde o usuário também pode salvar em PDF. */
    function openPrintDialog() {
        if (!ensureReleased()) return;

        const preview = App.utils.byId("cv-preview");
        if (!preview) {
            App.feedback.showError("Não foi possível localizar o currículo para impressão.");
            return;
        }

        App.preview.render();
        const originalTitle = document.title;
        document.title = fileName().replace(/\.pdf$/i, "");

        global.requestAnimationFrame(() => {
            global.requestAnimationFrame(() => global.print());
        });

        const restoreTitle = () => {
            document.title = originalTitle;
            global.removeEventListener("afterprint", restoreTitle);
        };
        global.addEventListener("afterprint", restoreTitle);
    }

    function removeDuplicateIds(root) {
        root.removeAttribute("id");
        root.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    }

    async function waitForImages(root) {
        const images = [...root.querySelectorAll("img")];
        await Promise.all(images.map(async (image) => {
            if (image.complete && image.naturalWidth > 0) return;
            try {
                await image.decode();
            } catch {
                await new Promise((resolve) => {
                    image.addEventListener("load", resolve, { once: true });
                    image.addEventListener("error", resolve, { once: true });
                    global.setTimeout(resolve, 1500);
                });
            }
        }));
    }

    function createExportClone(source) {
        const stage = document.createElement("div");
        stage.className = "pdf-export-stage";
        Object.assign(stage.style, {
            position: "fixed",
            left: "-10000px",
            top: "0",
            width: "595px",
            height: "842px",
            overflow: "hidden",
            background: "#ffffff",
            zIndex: "-9999",
            pointerEvents: "none",
        });

        const clone = source.cloneNode(true);
        removeDuplicateIds(clone);
        Object.assign(clone.style, {
            width: "595px",
            minWidth: "595px",
            maxWidth: "595px",
            height: "842px",
            minHeight: "842px",
            maxHeight: "842px",
            margin: "0",
            boxShadow: "none",
            transform: "none",
            transformOrigin: "top left",
            zoom: "1",
        });
        stage.appendChild(clone);
        document.body.appendChild(stage);
        return { stage, clone };
    }

    /**
     * Gera o PDF diretamente no navegador. A folha é clonada para uma área
     * isolada e renderizada no tamanho exato da prévia, evitando o PDF branco.
     */
    async function downloadPdf() {
        if (!ensureReleased()) return;

        const html2canvas = global.html2canvas;
        const JsPdf = global.jspdf?.jsPDF;
        if (typeof html2canvas !== "function" || typeof JsPdf !== "function") {
            App.feedback.showError("O gerador de PDF não carregou. Use o botão Imprimir como alternativa.");
            return;
        }

        const source = App.utils.byId("cv-preview");
        const button = App.utils.byId("btn-download-pdf");
        if (!source || !button) return;

        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = "Gerando PDF...";
        App.payment?.setStatus("Gerando o arquivo PDF diretamente no navegador...");

        App.preview.render();
        let stage;
        try {
            if (document.fonts?.ready) await document.fonts.ready;
            const exportNodes = createExportClone(source);
            stage = exportNodes.stage;
            await waitForImages(exportNodes.clone);

            const canvas = await html2canvas(exportNodes.clone, {
                backgroundColor: "#ffffff",
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: 595,
                height: 842,
                windowWidth: 595,
                windowHeight: 842,
                scrollX: 0,
                scrollY: 0,
            });

            if (!canvas.width || !canvas.height) throw new Error("Canvas vazio");

            const pdf = new JsPdf({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
                compress: true,
            });
            pdf.addImage(canvas.toDataURL("image/jpeg", 0.96), "JPEG", 0, 0, 210, 297, undefined, "FAST");
            pdf.save(fileName());
            App.payment?.setStatus("PDF gerado e enviado para download.", "approved");
        } catch (error) {
            console.error("Falha ao gerar PDF:", error);
            App.feedback.showError("Não foi possível baixar o PDF diretamente. Use o botão Imprimir.");
            App.payment?.setStatus("Falha no download direto. A opção Imprimir continua disponível.", "error");
        } finally {
            stage?.remove();
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    App.print = {
        open: openPrintDialog,
        download: downloadPdf,
    };
})(window);
