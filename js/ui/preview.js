/**
 * Renderização da prévia A4.
 * Este arquivo não cria formulários; apenas transforma o estado em currículo.
 */
(function initializePreview(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});
    const { byId, setVisible } = App.utils;
    const { placeholders, models } = App.config;

    function setText(id, value, fallback = "") {
        const element = byId(id);
        if (element) element.textContent = value || fallback;
    }

    function renderList(element, items, formatter = (item) => item) {
        if (!element) return;
        element.replaceChildren();
        items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = formatter(item);
            element.appendChild(li);
        });
    }

    function renderContact(data) {
        const contact = byId("cv-contato-lista");
        if (!contact) return;

        const rows = [
            data.telefone && `Tel.: ${data.telefone}`,
            data.email && `E-mail: ${data.email}`,
            data.local && data.local,
            data.cpf && `CPF: ${data.cpf}`,
        ].filter(Boolean);

        renderList(contact, rows.length ? rows : ["Telefone", "E-mail", "Localização"]);
    }

    function renderPhoto(data) {
        const bucket = byId("preview-photo-bucket");
        const image = byId("preview-photo");
        const preview = byId("cv-preview");
        const hasPhoto = Boolean(data.foto);

        setVisible(bucket, hasPhoto);
        preview?.classList.toggle("tem-foto", hasPhoto);
        if (image) image.src = hasPhoto ? data.foto : "";
    }

    function createEmptyMessage(text) {
        const paragraph = document.createElement("p");
        paragraph.className = "cv-empty-message";
        paragraph.textContent = text;
        return paragraph;
    }

    function renderExperience(data) {
        const container = byId("cv-experiencias-container");
        if (!container) return;
        container.replaceChildren();

        if (!data.experiencias.length) {
            container.appendChild(createEmptyMessage(placeholders.experiencia));
            return;
        }

        data.experiencias.forEach((item) => {
            const article = document.createElement("article");
            article.className = "cv-item-render";

            const heading = document.createElement("div");
            heading.className = "cv-item-meta";
            heading.innerHTML = `<strong>${App.utils.escapeHtml(item.cargo)}</strong><span>${App.utils.escapeHtml(item.inicio)}${item.inicio || item.fim ? " - " : ""}${App.utils.escapeHtml(item.fim)}</span>`;

            const institution = document.createElement("div");
            institution.className = "cv-item-institution";
            institution.textContent = item.empresa;

            article.append(heading, institution);
            if (item.desc) {
                const description = document.createElement("p");
                description.className = "cv-item-description";
                description.textContent = item.desc;
                article.appendChild(description);
            }
            container.appendChild(article);
        });
    }

    function renderEducation(data) {
        const container = byId("cv-formacoes-container");
        if (!container) return;
        container.replaceChildren();

        if (!data.formacoes.length) {
            container.appendChild(createEmptyMessage(placeholders.formacao));
            return;
        }

        data.formacoes.forEach((item) => {
            const article = document.createElement("article");
            article.className = "cv-item-render";
            article.innerHTML = `
                <div class="cv-item-meta">
                    <strong>${App.utils.escapeHtml(item.curso)}</strong>
                    <span>${App.utils.escapeHtml(item.inicio)}${item.inicio || item.fim ? " - " : ""}${App.utils.escapeHtml(item.fim)}</span>
                </div>
                <div class="cv-item-institution">${App.utils.escapeHtml(item.inst)}</div>
            `;
            container.appendChild(article);
        });
    }

    function renderCertificates(data) {
        const box = byId("cv-certificacoes-box");
        const container = byId("cv-certificacoes-container");
        if (!box || !container) return;

        setVisible(box, data.certificacoes.length > 0);
        container.replaceChildren();
        data.certificacoes.forEach((item) => {
            const article = document.createElement("article");
            article.className = "cv-item-render";
            article.innerHTML = `
                <div class="cv-item-meta">
                    <strong>${App.utils.escapeHtml(item.nome)}</strong>
                    <span>${App.utils.escapeHtml(item.data)}</span>
                </div>
                ${item.inst ? `<div class="cv-item-institution">${App.utils.escapeHtml(item.inst)}</div>` : ""}
            `;
            container.appendChild(article);
        });
    }

    function applyModel(modelName, persist = true) {
        const preview = byId("cv-preview");
        if (!preview) return;

        models.filter((model) => model !== "padrao").forEach((model) => preview.classList.remove(model));
        if (modelName !== "padrao" && models.includes(modelName)) preview.classList.add(modelName);

        App.state.value.data.modelo = models.includes(modelName) ? modelName : "padrao";
        if (persist) App.state.save();
    }

    function render() {
        const data = App.state.value.data;

        setText("cv-nome", data.nome, placeholders.nome);
        setText("cv-cargo", data.cargo, placeholders.cargo);
        setText("cv-resumo", data.resumo, placeholders.resumo);

        renderPhoto(data);
        renderContact(data);
        renderList(byId("cv-competencias-lista"), data.competencias);

        setVisible(byId("cv-idiomas-box"), data.idiomas.length > 0);
        renderList(byId("cv-idiomas"), data.idiomas);

        setVisible(byId("cv-interesses-box"), data.interesses.length > 0);
        renderList(byId("cv-interesses"), data.interesses);

        renderExperience(data);
        renderEducation(data);
        renderCertificates(data);
        applyModel(data.modelo, false);
    }

    App.preview = { render, applyModel };
})(window);
