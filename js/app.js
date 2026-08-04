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
            App.mobilePreview.updateSelectedModel();

            // Na etapa de modelos, tocar em um estilo também abre sua prévia
            // em celulares. No desktop, a prévia lateral continua normal.
            if (window.matchMedia("(max-width: 860px)").matches) {
                App.mobilePreview.open();
            }
        });

        byId("btn-go-payment")?.addEventListener("click", App.payment.open);
        byId("btn-back-models")?.addEventListener("click", App.payment.backToModels);
        byId("btn-show-pix")?.addEventListener("click", App.payment.showPix);
        byId("btn-back-payment")?.addEventListener("click", App.payment.showIntro);
        byId("btn-copy-pix")?.addEventListener("click", App.payment.copyPix);
        byId("btn-simulate-payment")?.addEventListener("click", App.payment.simulateApproval);
        byId("btn-print")?.addEventListener("click", App.print.open);

        // Em telas pequenas, a prévia abre em uma camada separada.
        // O módulo abaixo calcula a escala pela largura real do aparelho,
        // centraliza a folha e também controla o estado selecionado dos modelos.
        const previewContainer = byId("preview-container");
        const previewSheet = byId("cv-preview");
        const openPreviewButton = byId("btn-open-mobile-preview");
        const closePreviewButton = byId("btn-close-mobile-preview");

        function updateMobilePreviewScale() {
            if (!previewSheet || window.innerWidth > 860) {
                previewSheet?.style.removeProperty("zoom");
                return;
            }

            const horizontalSpace = 28;
            const sheetWidth = 595;
            const scale = Math.min(0.92, (window.innerWidth - horizontalSpace) / sheetWidth);
            previewSheet.style.zoom = String(Math.max(0.48, scale));
        }

        function updateSelectedModel() {
            const selected = App.state.value.data.modelo;
            document.querySelectorAll("#model-buttons [data-model]").forEach((button) => {
                const isSelected = button.dataset.model === selected;
                button.classList.toggle("is-selected", isSelected);
                button.setAttribute("aria-pressed", String(isSelected));
            });
        }

        let previewRestoreTarget = null;

        function openMobilePreview({ restoreTarget = null } = {}) {
            if (!previewContainer) return;
            previewRestoreTarget = restoreTarget || document.activeElement;
            updateMobilePreviewScale();
            previewContainer.classList.add("mobile-preview-visible");
            document.body.classList.add("mobile-preview-open");
            openPreviewButton?.setAttribute("aria-expanded", "true");
            closePreviewButton?.focus();
        }

        function closeMobilePreview({ restoreFocus = true } = {}) {
            if (!previewContainer) return;
            previewContainer.classList.remove("mobile-preview-visible");
            document.body.classList.remove("mobile-preview-open");
            previewSheet?.style.removeProperty("zoom");
            openPreviewButton?.setAttribute("aria-expanded", "false");

            if (restoreFocus) {
                const target = previewRestoreTarget instanceof HTMLElement
                    ? previewRestoreTarget
                    : openPreviewButton;
                target?.focus();
            }
            previewRestoreTarget = null;
        }

        App.mobilePreview = {
            open: openMobilePreview,
            close: closeMobilePreview,
            resize: updateMobilePreviewScale,
            updateSelectedModel,
        };

        openPreviewButton?.addEventListener("click", openMobilePreview);
        closePreviewButton?.addEventListener("click", () => closeMobilePreview());
        previewContainer?.addEventListener("click", (event) => {
            // Fecha ao tocar na área escura vazia, mas não ao tocar na folha ou no botão.
            if (event.target === previewContainer) closeMobilePreview();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && previewContainer?.classList.contains("mobile-preview-visible")) {
                closeMobilePreview();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 860) {
                closeMobilePreview({ restoreFocus: false });
                previewSheet?.style.removeProperty("zoom");
                return;
            }

            if (previewContainer?.classList.contains("mobile-preview-visible")) {
                updateMobilePreviewScale();
            }
        });

        updateSelectedModel();
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
