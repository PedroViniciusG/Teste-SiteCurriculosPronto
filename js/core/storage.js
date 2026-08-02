/**
 * Camada de persistência local.
 * Centraliza todo acesso ao localStorage para evitar chaves espalhadas.
 */
(function initializeStorage(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});

    function readJson(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            console.warn(`Não foi possível ler ${key} do localStorage.`, error);
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Não foi possível salvar ${key} no localStorage.`, error);
            return false;
        }
    }

    function remove(key) {
        localStorage.removeItem(key);
    }

    function has(key) {
        return localStorage.getItem(key) !== null;
    }

    App.storage = { readJson, writeJson, remove, has };
})(window);
