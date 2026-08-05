/**
 * Pagamento SIMULADO para testes no GitHub Pages.
 *
 * Não existe comunicação com Mercado Pago, backend ou cobrança real.
 * A aprovação acontece somente quando o usuário clica no botão de simulação.
 */
(function initializePayment(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});
    const { byId, setVisible } = App.utils;
    let paymentApproved = false;

    function open() {
        App.state.save();
        setVisible(byId("box-escolha-modelo"), false);
        setVisible(byId("box-pagamento"), true);
        setVisible(byId("app-footer"), false);
        setVisible(byId("field-label"), false);
        byId("interactive-content")?.replaceChildren();
        showIntro();
    }

    function backToModels() {
        setVisible(byId("box-pagamento"), false);
        App.steps.render();
    }

    function showIntro() {
        setVisible(byId("pay-pix"), false);
        setVisible(byId("pay-intro"), true);
    }

    function showPix() {
        paymentApproved = false;
        setVisible(byId("pay-intro"), false);
        setVisible(byId("pay-pix"), true);

        const qrImage = byId("pix-qr-image");
        const loading = byId("pix-qr-loading");
        const pixCode = byId("pix-code");
        const copyButton = byId("btn-copy-pix");
        const printButton = byId("btn-print");
        const simulateButton = byId("btn-simulate-payment");

        if (qrImage) {
            qrImage.src = "assets/qr-pagamento-teste.svg";
            setVisible(qrImage, true);
        }
        setVisible(loading, false);
        if (pixCode) pixCode.value = "PIX-TESTE-CURRICULOS-1R-SEM-VALOR-REAL";
        if (copyButton) copyButton.disabled = false;
        if (simulateButton) simulateButton.disabled = false;
        if (printButton) {
            printButton.disabled = true;
            printButton.textContent = "Aguardando simulação";
        }
        setStatus("Pagamento de demonstração criado. Clique em “Simular pagamento aprovado”.");
    }

    function simulateApproval() {
        const simulateButton = byId("btn-simulate-payment");
        if (simulateButton) {
            simulateButton.disabled = true;
            simulateButton.textContent = "Processando teste...";
        }
        setStatus("Processando confirmação simulada...");

        global.setTimeout(() => {
            paymentApproved = true;
            setStatus("Pagamento de teste aprovado! O PDF foi liberado.", "approved");
            const printButton = byId("btn-print");
            if (printButton) {
                printButton.disabled = false;
                printButton.textContent = "Baixar currículo em PDF";
            }
            if (simulateButton) simulateButton.textContent = "Pagamento de teste aprovado";
        }, App.config.payment.simulationDelayMs);
    }

    function setStatus(message, type = "pending") {
        const status = byId("payment-status");
        if (!status) return;
        status.textContent = message;
        status.classList.toggle("is-approved", type === "approved");
        status.classList.toggle("is-error", type === "error");
    }

    function canDownload() {
        return paymentApproved;
    }

    async function copyPix() {
        const input = byId("pix-code");
        const button = byId("btn-copy-pix");
        if (!input || !button || !input.value) return;
        try {
            await navigator.clipboard.writeText(input.value);
        } catch {
            input.select();
            document.execCommand("copy");
        }
        const original = button.textContent;
        button.textContent = "Copiado!";
        global.setTimeout(() => { button.textContent = original; }, 1400);
    }

    App.payment = {
        open,
        backToModels,
        showPix,
        showIntro,
        simulateApproval,
        copyPix,
        canDownload,
    };
})(window);
