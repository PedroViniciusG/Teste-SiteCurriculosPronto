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
            cidade: "",
            estado: "",
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

    function normalizeLocation(data) {
        const normalized = data;
        if ((!normalized.cidade || !normalized.estado) && normalized.local) {
            const match = String(normalized.local).trim().match(/^(.+?)\s*[-/]\s*([A-Za-z]{2})$/);
            if (match) {
                if (!normalized.cidade) normalized.cidade = match[1].trim();
                if (!normalized.estado) normalized.estado = match[2].toUpperCase();
            } else if (!normalized.cidade) {
                normalized.cidade = String(normalized.local).trim();
            }
        }

        normalized.estado = String(normalized.estado || "").toUpperCase().slice(0, 2);
        normalized.local = [normalized.cidade, normalized.estado].filter(Boolean).join(" - ");
    }

    function normalizeExperience(item) {
        return {
            id: item?.id || App.utils.createId("exp"),
            empresa: String(item?.empresa || ""),
            cargo: String(item?.cargo || ""),
            inicio: String(item?.inicio || ""),
            fim: String(item?.fim || ""),
            atual: Boolean(item?.atual),
            desc: String(item?.desc || ""),
        };
    }

    function normalizeEducation(item) {
        return {
            id: item?.id || App.utils.createId("form"),
            tipo: String(item?.tipo || ""),
            curso: String(item?.curso || ""),
            inst: String(item?.inst || ""),
            inicio: String(item?.inicio || ""),
            fim: String(item?.fim || ""),
            atual: Boolean(item?.atual),
        };
    }

    /** Converte rascunhos antigos para a estrutura atual. */
    function normalizeData(rawData) {
        const normalized = { ...createEmptyData(), ...(rawData || {}) };

        if (!Array.isArray(normalized.experiencias)) normalized.experiencias = [];
        if (!Array.isArray(normalized.formacoes)) normalized.formacoes = [];
        if (!Array.isArray(normalized.certificacoes)) normalized.certificacoes = [];
        if (!Array.isArray(normalized.competencias)) normalized.competencias = [];

        normalized.experiencias = normalized.experiencias.map(normalizeExperience);
        normalized.formacoes = normalized.formacoes.map(normalizeEducation);

        ["idiomas", "interesses"].forEach((key) => {
            if (typeof normalized[key] === "string") {
                normalized[key] = normalized[key].trim() ? [normalized[key].trim()] : [];
            }
            if (!Array.isArray(normalized[key])) normalized[key] = [];
        });

        normalizeLocation(normalized);
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
        normalizeLocation(state.data);
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
        if (key === "cidade" || key === "estado") normalizeLocation(state.data);
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
