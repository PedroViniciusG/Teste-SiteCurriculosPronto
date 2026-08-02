/**
 * Funções utilitárias genéricas.
 * Nenhuma função deste arquivo deve depender diretamente da tela atual.
 */
(function initializeUtils(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});

    /** Retorna um elemento pelo ID. */
    function byId(id) {
        return document.getElementById(id);
    }

    /** Alterna a classe usada para esconder elementos. */
    function setVisible(element, visible) {
        if (!element) return;
        element.classList.toggle("is-hidden", !visible);
    }

    /** Escapa texto antes de inseri-lo em templates HTML. */
    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    /** Remove todos os caracteres que não sejam números. */
    function onlyNumbers(value) {
        return String(value ?? "").replace(/\D/g, "");
    }

    /** Formata telefone brasileiro enquanto o usuário digita. */
    function formatPhone(value) {
        const number = onlyNumbers(value).slice(0, 11);
        if (number.length > 6) {
            return `(${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}`;
        }
        if (number.length > 2) return `(${number.slice(0, 2)}) ${number.slice(2)}`;
        if (number.length > 0) return `(${number}`;
        return "";
    }

    /** Formata CPF enquanto o usuário digita. */
    function formatCpf(value) {
        const number = onlyNumbers(value).slice(0, 11);
        if (number.length > 9) {
            return `${number.slice(0, 3)}.${number.slice(3, 6)}.${number.slice(6, 9)}-${number.slice(9)}`;
        }
        if (number.length > 6) {
            return `${number.slice(0, 3)}.${number.slice(3, 6)}.${number.slice(6)}`;
        }
        if (number.length > 3) return `${number.slice(0, 3)}.${number.slice(3)}`;
        return number;
    }

    /** Formata datas curtas no padrão MM/AAAA. */
    function formatShortDate(value) {
        const number = onlyNumbers(value).slice(0, 6);
        return number.length > 2 ? `${number.slice(0, 2)}/${number.slice(2)}` : number;
    }

    /** Cria um ID simples para elementos temporários. */
    function createId(prefix = "item") {
        return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    App.utils = {
        byId,
        setVisible,
        escapeHtml,
        onlyNumbers,
        formatPhone,
        formatCpf,
        formatShortDate,
        createId,
    };
})(window);
