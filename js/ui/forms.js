/**
 * Formulários dinâmicos das etapas.
 * Usa delegação de eventos para evitar onclick/oninput dentro do HTML.
 */
(function initializeForms(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});
    const { byId, escapeHtml, formatPhone, formatCpf, formatShortDate } = App.utils;

    function field(label, key, value, options = {}) {
        const { type = "text", placeholder = "", inputMode = "text", labelClass = "" } = options;
        return `
            <div class="input-sub-group">
                <label class="${labelClass}" for="field-${key}">${label}</label>
                <input
                    id="field-${key}"
                    type="${type}"
                    inputmode="${inputMode}"
                    data-field="${key}"
                    value="${escapeHtml(value)}"
                    placeholder="${escapeHtml(placeholder)}"
                />
            </div>
        `;
    }

    function textarea(label, key, value, placeholder = "") {
        return `
            <div class="input-sub-group">
                <label for="field-${key}">${label}</label>
                <textarea id="field-${key}" data-field="${key}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>
            </div>
        `;
    }

    function renderPersonalData(container) {
        const data = App.state.value.data;
        container.innerHTML = [
            field("Nome Completo", "nome", data.nome),
            field("Cargo / Profissão", "cargo", data.cargo),
            field("E-mail", "email", data.email, { type: "email", inputMode: "email" }),
            field("Telefone", "telefone", data.telefone, { inputMode: "tel" }),
            field("Cidade / Estado", "local", data.local),
            field("CPF (Opcional)", "cpf", data.cpf, { inputMode: "numeric" }),
        ].join("");
    }

    function renderPhoto(container) {
        const photo = App.state.value.data.foto;
        const hasPhoto = Boolean(photo);
        container.innerHTML = `
            <label class="file-input-wrapper ${hasPhoto ? "has-photo" : ""}">
                ${hasPhoto ? `
                    <img class="uploaded-photo-thumbnail" src="${photo}" alt="Miniatura da foto enviada" />
                    <span class="photo-upload-status">Foto adicionada. Toque para trocar.</span>
                ` : `
                    <span class="photo-upload-placeholder" aria-hidden="true">+</span>
                    <span>Clique para carregar uma imagem</span>
                `}
                <input id="photo-input" type="file" accept="image/*" />
            </label>
            ${hasPhoto ? '<button class="btn-secondary-action" data-action="remove-photo" type="button">Remover foto atual</button>' : ""}
        `;
    }

    function renderSummary(container) {
        container.innerHTML = textarea(
            "Escreva um breve resumo profissional",
            "resumo",
            App.state.value.data.resumo,
            "Apresente sua experiência, principais competências e objetivo profissional.",
        );
    }

    function renderDateFields(prefix, item = {}) {
        return `
            <div class="date-grid">
                ${field("Início", `${prefix}-inicio`, item.inicio || "", { placeholder: "MM/AAAA", inputMode: "numeric" })}
                ${field("Término", `${prefix}-fim`, item.atual ? "" : item.fim || "", { placeholder: "MM/AAAA", inputMode: "numeric" })}
            </div>
            <label class="checkbox-inline-group">
                <input type="checkbox" data-current-checkbox="${prefix}" ${item.atual ? "checked" : ""} />
                <span class="checkmark"></span>
                <span>${prefix === "exp" ? "Atualmente trabalho aqui" : "Em andamento"}</span>
            </label>
        `;
    }

    function itemActions(type, index) {
        return `
            <div class="item-actions-group">
                <button class="btn-edit-item" data-action="edit-${type}" data-index="${index}" type="button">Editar</button>
                <button class="btn-remove-item" data-action="remove-${type}" data-index="${index}" type="button">Remover</button>
            </div>
        `;
    }

    function renderExperiences(container) {
        const state = App.state.value;
        const editing = state.editing.experiencia;
        const item = editing >= 0 ? state.data.experiencias[editing] : {};

        container.innerHTML = `
            <div class="editor-card">
                ${field("Empresa", "exp-empresa", item.empresa || "")}
                ${field("Cargo", "exp-cargo", item.cargo || "")}
                ${renderDateFields("exp", item)}
                ${textarea("Descrição das atividades", "exp-desc", item.desc || "")}
                <button class="btn-add-item" data-action="save-experience" type="button">
                    ${editing >= 0 ? "Atualizar experiência" : "Salvar experiência"}
                </button>
            </div>
            <div class="added-items-list">
                ${state.data.experiencias.map((entry, index) => `
                    <article class="added-item-row">
                        <span><strong>${escapeHtml(entry.cargo)}</strong> em ${escapeHtml(entry.empresa)}</span>
                        ${itemActions("experience", index)}
                    </article>
                `).join("")}
            </div>
        `;
        syncCurrentCheckbox("exp");
    }

    function renderEducation(container) {
        const state = App.state.value;
        const editing = state.editing.formacao;
        const item = editing >= 0 ? state.data.formacoes[editing] : {};

        container.innerHTML = `
            <div class="editor-card">
                ${field("Curso / Graduação", "form-curso", item.curso || "")}
                ${field("Instituição", "form-inst", item.inst || "")}
                ${renderDateFields("form", item)}
                <button class="btn-add-item" data-action="save-education" type="button">
                    ${editing >= 0 ? "Atualizar formação" : "Salvar formação"}
                </button>
            </div>
            <div class="added-items-list">
                ${state.data.formacoes.map((entry, index) => `
                    <article class="added-item-row">
                        <span><strong>${escapeHtml(entry.curso)}</strong> — ${escapeHtml(entry.inst)}</span>
                        ${itemActions("education", index)}
                    </article>
                `).join("")}
            </div>
        `;
        syncCurrentCheckbox("form");
    }

    function renderCertificates(container) {
        const state = App.state.value;
        const editing = state.editing.certificacao;
        const item = editing >= 0 ? state.data.certificacoes[editing] : {};

        container.innerHTML = `
            <div class="editor-card">
                ${field("Certificação / Curso", "cert-nome", item.nome || "")}
                ${field("Instituição Emissora", "cert-inst", item.inst || "")}
                ${field("Data de Emissão", "cert-data", item.data || "", { placeholder: "MM/AAAA", inputMode: "numeric" })}
                <button class="btn-add-item" data-action="save-certificate" type="button">
                    ${editing >= 0 ? "Atualizar certificação" : "Salvar certificação"}
                </button>
            </div>
            <div class="added-items-list">
                ${state.data.certificacoes.map((entry, index) => `
                    <article class="added-item-row">
                        <span><strong>${escapeHtml(entry.nome)}</strong></span>
                        ${itemActions("certificate", index)}
                    </article>
                `).join("")}
            </div>
        `;
    }

    function renderTagRows(items, type) {
        return items.map((item, index) => `
            <article class="added-item-row">
                <span>${escapeHtml(item)}</span>
                <button class="btn-remove-item" data-action="remove-${type}" data-index="${index}" type="button">Remover</button>
            </article>
        `).join("");
    }

    function renderSkills(container) {
        container.innerHTML = `
            ${field("Adicionar competência (Ex.: Liderança, Excel)", "new-skill", "")}
            <button class="btn-add-item" data-action="add-skill" type="button">Inserir habilidade</button>
            <div class="added-items-list">${renderTagRows(App.state.value.data.competencias, "skill")}</div>
        `;
    }

    function renderAdditional(container) {
        const data = App.state.value.data;
        container.innerHTML = `
            <section class="additional-group">
                ${field("Adicionar idioma (Ex.: Inglês - Fluente)", "new-language", "")}
                <button class="btn-add-item" data-action="add-language" type="button">Inserir idioma</button>
                <div class="added-items-list">${renderTagRows(data.idiomas, "language")}</div>
            </section>

            <section class="additional-group">
                ${field("Outras informações de interesse", "new-interest", "")}
                <button class="btn-add-item" data-action="add-interest" type="button">Inserir informação</button>
                <div class="added-items-list">${renderTagRows(data.interesses, "interest")}</div>
            </section>
        `;
    }

    function renderSkillsAndAdditional(container) {
        const data = App.state.value.data;
        container.innerHTML = `
            <section class="additional-group">
                <p class="section-input-title">COMPETÊNCIAS E HABILIDADES</p>
                <p class="section-input-helper">Adicione competências como liderança, Excel ou atendimento.</p>
                ${field("", "new-skill", "", {
                    placeholder: "Ex.: Liderança, Excel",
                })}
                <button class="btn-add-item" data-action="add-skill" type="button">Inserir habilidade</button>
                <div class="added-items-list">${renderTagRows(data.competencias, "skill")}</div>
            </section>

            <section class="additional-group">
                <p class="section-input-title">IDIOMAS</p>
                <p class="section-input-helper">Informe o idioma e o nível. Ex.: Inglês — Fluente.</p>
                ${field("", "new-language", "", {
                    placeholder: "Ex.: Inglês - Fluente",
                })}
                <button class="btn-add-item" data-action="add-language" type="button">Inserir idioma</button>
                <div class="added-items-list">${renderTagRows(data.idiomas, "language")}</div>
            </section>

            <section class="additional-group">
                <p class="section-input-title">INFORMAÇÕES ADICIONAIS</p>
                <p class="section-input-helper">Inclua disponibilidade, CNH, viagens ou outras informações relevantes.</p>
                ${field("", "new-interest", "", {
                    placeholder: "Outras informações de interesse",
                })}
                <button class="btn-add-item" data-action="add-interest" type="button">Inserir informação</button>
                <div class="added-items-list">${renderTagRows(data.interesses, "interest")}</div>
            </section>
        `;
    }

    function renderStepForm(stepKey, container) {
        const renderers = {
            dados_pessoais: renderPersonalData,
            foto: renderPhoto,
            resumo: renderSummary,
            experiencias: renderExperiences,
            formacoes: renderEducation,
            certificacoes: renderCertificates,
            competencias: renderSkills,
            adicionais: renderAdditional,
            competencias_adicionais: renderSkillsAndAdditional,
        };
        renderers[stepKey]?.(container);
    }

    function syncCurrentCheckbox(prefix) {
        const checkbox = document.querySelector(`[data-current-checkbox="${prefix}"]`);
        const endInput = byId(`field-${prefix}-fim`);
        if (!checkbox || !endInput) return;
        endInput.disabled = checkbox.checked;
    }

    function inputValue(key) {
        return byId(`field-${key}`)?.value.trim() || "";
    }

    function saveExperience() {
        const empresa = inputValue("exp-empresa");
        const cargo = inputValue("exp-cargo");
        if (!empresa || !cargo) return App.feedback.showError("Preencha Empresa e Cargo.");

        const current = document.querySelector('[data-current-checkbox="exp"]')?.checked || false;
        const item = {
            empresa,
            cargo,
            inicio: inputValue("exp-inicio"),
            fim: current ? "Atual" : inputValue("exp-fim"),
            atual: current,
            desc: inputValue("exp-desc"),
        };

        const state = App.state.value;
        if (state.editing.experiencia >= 0) state.data.experiencias[state.editing.experiencia] = item;
        else state.data.experiencias.push(item);
        state.editing.experiencia = -1;
        App.state.save();
        App.preview.render();
        renderExperiences(byId("interactive-content"));
    }

    function saveEducation() {
        const curso = inputValue("form-curso");
        const inst = inputValue("form-inst");
        if (!curso || !inst) return App.feedback.showError("Preencha o Curso e a Instituição.");

        const current = document.querySelector('[data-current-checkbox="form"]')?.checked || false;
        const item = {
            curso,
            inst,
            inicio: inputValue("form-inicio"),
            fim: current ? "Em Andamento" : inputValue("form-fim"),
            atual: current,
        };

        const state = App.state.value;
        if (state.editing.formacao >= 0) state.data.formacoes[state.editing.formacao] = item;
        else state.data.formacoes.push(item);
        state.editing.formacao = -1;
        App.state.save();
        App.preview.render();
        renderEducation(byId("interactive-content"));
    }

    function saveCertificate() {
        const nome = inputValue("cert-nome");
        if (!nome) return App.feedback.showError("Informe o nome do curso ou certificação.");

        const item = { nome, inst: inputValue("cert-inst"), data: inputValue("cert-data") };
        const state = App.state.value;
        if (state.editing.certificacao >= 0) state.data.certificacoes[state.editing.certificacao] = item;
        else state.data.certificacoes.push(item);
        state.editing.certificacao = -1;
        App.state.save();
        App.preview.render();
        renderCertificates(byId("interactive-content"));
    }

    function addTag(fieldKey, stateKey, renderFunction) {
        const input = byId(`field-${fieldKey}`);
        const value = input?.value.trim();
        if (!value) return;
        const list = App.state.value.data[stateKey];
        if (!list.includes(value)) list.push(value);
        App.state.save();
        App.preview.render();
        renderFunction(byId("interactive-content"));
    }

    function removeItem(type, index) {
        const map = {
            experience: ["experiencias", renderExperiences],
            education: ["formacoes", renderEducation],
            certificate: ["certificacoes", renderCertificates],
            skill: ["competencias", renderSkillsAndAdditional],
            language: ["idiomas", renderSkillsAndAdditional],
            interest: ["interesses", renderSkillsAndAdditional],
        };
        const [stateKey, renderFunction] = map[type] || [];
        if (!stateKey) return;
        App.state.value.data[stateKey].splice(index, 1);
        App.state.save();
        App.preview.render();
        renderFunction(byId("interactive-content"));
    }

    function editItem(type, index) {
        const editKey = { experience: "experiencia", education: "formacao", certificate: "certificacao" }[type];
        const renderFunction = { experience: renderExperiences, education: renderEducation, certificate: renderCertificates }[type];
        if (!editKey || !renderFunction) return;
        App.state.value.editing[editKey] = index;
        renderFunction(byId("interactive-content"));
    }

    function handleInput(event) {
        const input = event.target;
        const key = input.dataset.field;
        if (!key) return;

        if (key === "telefone") input.value = formatPhone(input.value);
        if (key === "cpf") input.value = formatCpf(input.value);
        if (["exp-inicio", "exp-fim", "form-inicio", "form-fim", "cert-data"].includes(key)) {
            input.value = formatShortDate(input.value);
        }

        if (["nome", "cargo", "email", "telefone", "local", "cpf", "resumo"].includes(key)) {
            App.state.updateField(key, input.value);
        }
    }

    function handleChange(event) {
        if (event.target.id === "photo-input") {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                App.state.updateField("foto", reader.result);
                renderPhoto(byId("interactive-content"));
            });
            reader.readAsDataURL(file);
            return;
        }

        const prefix = event.target.dataset.currentCheckbox;
        if (prefix) {
            const endInput = byId(`field-${prefix}-fim`);
            if (endInput) {
                endInput.disabled = event.target.checked;
                if (event.target.checked) endInput.value = "";
            }
        }
    }

    function handleClick(event) {
        const button = event.target.closest("[data-action]");
        if (!button) return;
        const { action } = button.dataset;
        const index = Number(button.dataset.index);

        const actions = {
            "remove-photo": () => {
                App.state.updateField("foto", "");
                renderPhoto(byId("interactive-content"));
            },
            "save-experience": saveExperience,
            "save-education": saveEducation,
            "save-certificate": saveCertificate,
            "add-skill": () => addTag("new-skill", "competencias", renderSkillsAndAdditional),
            "add-language": () => addTag("new-language", "idiomas", renderSkillsAndAdditional),
            "add-interest": () => addTag("new-interest", "interesses", renderSkillsAndAdditional),
        };

        if (actions[action]) return actions[action]();
        if (action.startsWith("remove-")) return removeItem(action.replace("remove-", ""), index);
        if (action.startsWith("edit-")) return editItem(action.replace("edit-", ""), index);
    }

    function handleKeydown(event) {
        if (event.key !== "Enter" || event.shiftKey) return;
        const actionByField = {
            "field-new-skill": "add-skill",
            "field-new-language": "add-language",
            "field-new-interest": "add-interest",
        };
        const action = actionByField[event.target.id];
        if (!action) return;
        event.preventDefault();
        byId("interactive-content")
            ?.querySelector(`[data-action="${action}"]`)
            ?.click();
    }

    function bindEvents() {
        const container = byId("interactive-content");
        container?.addEventListener("input", handleInput);
        container?.addEventListener("change", handleChange);
        container?.addEventListener("click", handleClick);
        container?.addEventListener("keydown", handleKeydown);
    }

    App.forms = { renderStepForm, bindEvents };
})(window);
