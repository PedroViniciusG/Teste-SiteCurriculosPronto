/**
 * Estado central da aplicação.
 * Os demais arquivos alteram os dados somente por meio desta API.
 */
(function initializeState(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});
    const { storageKeys, models } = App.config;

    function createEmptyData() {
        return {
            nome: "",
            cargo: "",
            cpf: "",
            telefone: "",
            email: "",
            local: "",
            foto: "",
            resumo: "",
            experiencias: [],
            formacoes: [],
            certificacoes: [],
            competencias: [],
            idiomas: [],
            interesses: [],
            modelo: "padrao",
        };
    }

    /** Converte rascunhos antigos para a estrutura atual. */
    function normalizeData(rawData) {
        const normalized = { ...createEmptyData(), ...(rawData || {}) };

        ["experiencias", "formacoes", "certificacoes", "competencias"].forEach((key) => {
            if (!Array.isArray(normalized[key])) normalized[key] = [];
        });

        ["idiomas", "interesses"].forEach((key) => {
            if (typeof normalized[key] === "string") {
                normalized[key] = normalized[key].trim() ? [normalized[key].trim()] : [];
            }
            if (!Array.isArray(normalized[key])) normalized[key] = [];
        });

        if (!models.includes(normalized.modelo)) normalized.modelo = "padrao";
        return normalized;
    }

    const state = {
        currentStep: -1,
        data: createEmptyData(),
        editing: {
            experiencia: -1,
            formacao: -1,
            certificacao: -1,
        },
    };

    function loadDraft() {
        state.data = normalizeData(App.storage.readJson(storageKeys.data, null));
        return state.data;
    }

    function save() {
        App.storage.writeJson(storageKeys.data, state.data);
        App.storage.writeJson(storageKeys.step, state.currentStep);
    }

    function clear() {
        state.data = createEmptyData();
        state.currentStep = -1;
        state.editing = { experiencia: -1, formacao: -1, certificacao: -1 };
        App.storage.remove(storageKeys.data);
        App.storage.remove(storageKeys.step);
    }

    function hasDraft() {
        return App.storage.has(storageKeys.data);
    }

    function updateField(key, value) {
        if (!(key in state.data)) return;
        state.data[key] = value;
        save();
        App.preview?.render();
    }

    function startNew(selectedModel = null) {
        clear();
        if (models.includes(selectedModel)) state.data.modelo = selectedModel;
        state.currentStep = 0;
        save();
    }

    function continueDraft() {
        loadDraft();
        state.currentStep = 0;
        save();
    }

    App.state = {
        value: state,
        createEmptyData,
        normalizeData,
        loadDraft,
        save,
        clear,
        hasDraft,
        updateField,
        startNew,
        continueDraft,
    };
})(window);
