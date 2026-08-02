/**
 * Controle da tela inicial, progresso e navegação entre etapas.
 */
(function initializeSteps(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});
    const { byId, setVisible } = App.utils;
    const { steps } = App.config;

    function showWelcome() {
        setVisible(byId("app-header"), false);
        setVisible(byId("app-footer"), false);
        setVisible(byId("field-label"), false);
        setVisible(byId("box-escolha-modelo"), false);
        setVisible(byId("box-pagamento"), false);

        const continueButton = App.state.hasDraft()
            ? '<button class="btn-secondary-lg" id="btn-continue-draft" type="button">Continuar rascunho</button>'
            : "";

        byId("interactive-content").innerHTML = `
            <div class="welcome-screen">
                <span class="brand-logo welcome-brand">Currículos <span>1R$</span></span>
                <h1>Crie seu currículo profissional em PDF</h1>
                <h2>Versão de teste para amigos</h2>
                <p>Escolha entre seis modelos, preencha seus dados e teste todo o fluxo sem cobrança real.</p>
                <div class="test-mode-badge">Teste público • nenhum valor será cobrado</div>
                <div class="welcome-action-box">
                    <button class="btn-primary-lg" id="btn-start-new" type="button">Criar novo currículo</button>
                    ${continueButton}
                </div>
                <nav class="welcome-links" aria-label="Conteúdo útil">
                    <a href="pages/modelos-de-curriculo.html">Ver modelos</a>
                    <a href="pages/como-fazer-um-curriculo.html">Como fazer um currículo</a>
                    <a href="pages/curriculo-primeiro-emprego.html">Primeiro emprego</a>
                </nav>
            </div>
        `;

        byId("btn-start-new")?.addEventListener("click", () => {
            // Mantém o modelo escolhido na vitrine ao iniciar um currículo novo.
            const selectedModel = App.state.value.data.modelo;
            App.state.startNew(selectedModel);
            render();
            App.preview.render();
        });
        byId("btn-continue-draft")?.addEventListener("click", () => {
            App.state.continueDraft();
            render();
            App.preview.render();
        });
    }

    function updateProgress() {
        const currentStep = App.state.value.currentStep;
        byId("step-indicator").textContent = `Etapa ${currentStep + 1} de ${steps.length}`;
        byId("progress").style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    }

    function showModelSelection() {
        byId("interactive-content").replaceChildren();
        setVisible(byId("field-label"), false);
        setVisible(byId("box-escolha-modelo"), true);
        setVisible(byId("box-pagamento"), false);
        setVisible(byId("app-footer"), true);
        setVisible(byId("btn-advance"), false);
    }

    function render() {
        App.feedback.hideError();
        App.feedback.closeResetConfirmation();

        const currentStep = App.state.value.currentStep;
        if (currentStep < 0) return showWelcome();

        setVisible(byId("app-header"), true);
        setVisible(byId("app-footer"), true);
        setVisible(byId("box-pagamento"), false);
        updateProgress();

        if (currentStep === steps.length - 1) return showModelSelection();

        setVisible(byId("box-escolha-modelo"), false);
        setVisible(byId("btn-advance"), true);
        setVisible(byId("field-label"), true);

        const step = steps[currentStep];
        byId("field-label").textContent = step.label;
        App.forms.renderStepForm(step.key, byId("interactive-content"));
    }

    function next() {
        const state = App.state.value;
        if (state.currentStep === 0 && (!state.data.nome.trim() || !state.data.email.trim())) {
            App.feedback.showError("O preenchimento do Nome e do E-mail é obrigatório.");
            return;
        }
        if (state.currentStep < steps.length - 1) {
            state.currentStep += 1;
            App.state.save();
            render();
        }
    }

    function back() {
        const state = App.state.value;
        if (state.currentStep > 0) {
            state.currentStep -= 1;
            App.state.save();
            render();
        } else {
            state.currentStep = -1;
            render();
        }
    }

    App.steps = { render, next, back };
})(window);
