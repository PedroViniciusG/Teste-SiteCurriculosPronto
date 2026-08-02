/**
 * Configurações fixas da aplicação.
 * Este arquivo deve conter apenas valores que raramente mudam.
 */
(function initializeConfig(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});

    App.config = Object.freeze({
        storageKeys: {
            data: "cv_data",
            step: "curriculos1_cache_step",
        },

        steps: [
            { key: "dados_pessoais", label: "Dados Pessoais e de Contato" },
            { key: "foto", label: "Foto de Perfil (Opcional)" },
            { key: "resumo", label: "Perfil Profissional" },
            { key: "experiencias", label: "Experiência Profissional" },
            { key: "formacoes", label: "Formação Acadêmica" },
            { key: "certificacoes", label: "Certificações e Cursos" },
            { key: "competencias", label: "Competências e Habilidades" },
            { key: "adicionais", label: "Informações Adicionais" },
            { key: "modelo", label: "Escolha o Design do seu Currículo" },
        ],

        models: [
            "padrao",
            "modelo-moderno",
            "modelo-minimalista",
            "modelo-executivo",
            "modelo-criativo",
            "modelo-elegante",
        ],

        payment: {
            amount: 1,
            currency: "BRL",
            description: "Currículo profissional em PDF",
            pollIntervalMs: 4000,
        },

        placeholders: {
            nome: "Seu Nome Completo",
            cargo: "Seu Cargo ou Profissão",
            resumo: "Breve resumo de suas qualificações e objetivos de carreira.",
            experiencia: "Nenhuma experiência registrada.",
            formacao: "Nenhuma formação registrada.",
        },
    });
})(window);
