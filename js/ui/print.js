/**
 * Exportação do currículo pelo diálogo de impressão do navegador.
 *
 * Diferente da versão anterior, este módulo NÃO abre uma nova guia.
 * A impressão acontece na própria página e o CSS de impressão esconde
 * toda a interface, deixando visível somente a folha do currículo.
 */
(function initializePrint(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});

    /**
     * Abre diretamente o diálogo nativo de impressão.
     * Nele o usuário pode escolher "Salvar como PDF".
     */
    function openPrintDialog() {
        if (!App.payment?.canDownload()) {
            App.feedback.showError("O PDF será liberado somente após a confirmação do pagamento.");
            return;
        }

        const preview = App.utils.byId("cv-preview");

        if (!preview) {
            App.feedback.showError("Não foi possível localizar o currículo para gerar o PDF.");
            return;
        }

        // Garante que a prévia contenha os dados mais recentes antes da impressão.
        App.preview.render();

        // O título é usado pelo navegador como sugestão para o nome do PDF.
        const originalTitle = document.title;
        const candidateName = App.state.value.data.nome?.trim() || "Currículo";
        document.title = `${candidateName} - Currículo`;

        // Espera a atualização visual terminar antes de abrir o diálogo.
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => window.print());
        });

        // Restaura o título da aplicação depois que o diálogo for fechado.
        const restoreTitle = () => {
            document.title = originalTitle;
            global.removeEventListener("afterprint", restoreTitle);
        };
        global.addEventListener("afterprint", restoreTitle);
    }

    App.print = { open: openPrintDialog };
})(window);
