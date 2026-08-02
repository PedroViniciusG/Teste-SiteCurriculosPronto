/**
 * Ponto de entrada da aplicação.
 * Conecta botões fixos aos módulos e inicia a primeira renderização.
 */
(function bootstrap(global) {
    "use strict";

    const App = global.CVApp;
    const { byId } = App.utils;

    function bindStaticEvents() {
        byId("btn-advance")?.addEventListener("click", App.steps.next);
        byId("btn-back")?.addEventListener("click", App.steps.back);

        byId("btn-open-reset")?.addEventListener("click", App.feedback.openResetConfirmation);
        byId("btn-cancel-reset")?.addEventListener("click", App.feedback.closeResetConfirmation);
        byId("btn-confirm-reset")?.addEventListener("click", () => {
            App.state.clear();
            App.preview.render();
            App.steps.render();
        });

        byId("model-buttons")?.addEventListener("click", (event) => {
            const button = event.target.closest("[data-model]");
            if (!button) return;
            App.preview.applyModel(button.dataset.model);
        });

        byId("btn-go-payment")?.addEventListener("click", App.payment.open);
        byId("btn-back-models")?.addEventListener("click", App.payment.backToModels);
        byId("btn-show-pix")?.addEventListener("click", App.payment.showPix);
        byId("btn-back-payment")?.addEventListener("click", App.payment.showIntro);
        byId("btn-copy-pix")?.addEventListener("click", App.payment.copyPix);
        byId("btn-simulate-payment")?.addEventListener("click", App.payment.simulateApproval);
        byId("btn-print")?.addEventListener("click", App.print.open);

        // No celular, a prévia é aberta em uma camada para não ficar
        // empilhada abaixo do formulário.
        const previewContainer = byId("preview-container");
        const openPreviewButton = byId("btn-open-mobile-preview");
        const closePreviewButton = byId("btn-close-mobile-preview");

        function setMobilePreview(open) {
            previewContainer?.classList.toggle("mobile-preview-visible", open);
            document.body.classList.toggle("mobile-preview-open", open);
            openPreviewButton?.setAttribute("aria-expanded", String(open));
        }

        openPreviewButton?.addEventListener("click", () => setMobilePreview(true));
        closePreviewButton?.addEventListener("click", () => setMobilePreview(false));

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") setMobilePreview(false);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 860) setMobilePreview(false);
        });
    }

    function init() {
        App.state.loadDraft();

        // A vitrine envia o modelo escolhido pela URL: ?modelo=modelo-moderno.
        const requestedModel = new URLSearchParams(window.location.search).get("modelo");
        if (App.config.models.includes(requestedModel)) {
            App.state.value.data.modelo = requestedModel;
        }

        // Requisito do projeto: sempre começar na tela inicial.
        App.state.value.currentStep = -1;
        App.forms.bindEvents();
        bindStaticEvents();
        App.preview.render();
        App.steps.render();
    }

    document.addEventListener("DOMContentLoaded", init);
})(window);

// Inicializa elementos institucionais que não pertencem às etapas.
document.getElementById("current-year")?.replaceChildren(String(new Date().getFullYear()));
document.getElementById("btn-start-new-static")?.addEventListener("click", () => {
    const selectedModel = window.CVApp.state.value.data.modelo;
    window.CVApp.state.startNew(selectedModel);
    window.CVApp.steps.render();
    window.CVApp.preview.render();
});
