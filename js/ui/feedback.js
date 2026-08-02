/**
 * Mensagens, confirmações e feedback visual.
 */
(function initializeFeedback(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});
    const { byId, setVisible } = App.utils;

    function showError(message) {
        const box = byId("error-message-box");
        const text = byId("error-message-text");
        if (text) text.textContent = message;
        setVisible(box, true);
    }

    function hideError() {
        setVisible(byId("error-message-box"), false);
    }

    function openResetConfirmation() {
        hideError();
        setVisible(byId("reset-confirm-box"), true);
        byId("reset-confirm-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function closeResetConfirmation() {
        setVisible(byId("reset-confirm-box"), false);
    }

    App.feedback = {
        showError,
        hideError,
        openResetConfirmation,
        closeResetConfirmation,
    };
})(window);
