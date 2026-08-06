/**
 * Formulários dinâmicos das etapas.
 * Usa delegação de eventos para evitar onclick/oninput dentro do HTML.
 */
(function initializeForms(global) {
    "use strict";

    const App = (global.CVApp = global.CVApp || {});
    const { byId, escapeHtml, formatPhone, formatCpf, formatShortDate } = App.utils;


    const SKILL_SUGGESTION_CATEGORIES = Object.freeze({
        "Comportamentais": [
            "Comunicação", "Trabalho em equipe", "Proatividade", "Responsabilidade",
            "Adaptabilidade", "Empatia", "Inteligência emocional", "Criatividade",
            "Resolução de problemas", "Facilidade de aprendizado", "Paciência",
            "Ética profissional", "Comprometimento", "Pontualidade", "Atenção aos detalhes",
        ],
        "Organização e gestão": [
            "Organização", "Gestão do tempo", "Planejamento", "Liderança",
            "Tomada de decisão", "Cumprimento de prazos", "Gestão de prioridades",
            "Coordenação de equipes", "Delegação de tarefas", "Gestão de conflitos",
            "Visão estratégica", "Melhoria contínua", "Gestão de projetos",
        ],
        "Atendimento e vendas": [
            "Atendimento ao cliente", "Vendas", "Negociação", "Pós-venda",
            "Prospecção de clientes", "Comunicação com o público", "Resolução de reclamações",
            "Fidelização de clientes", "Técnicas de vendas", "Operação de caixa",
            "Telemarketing", "Recepção", "CRM", "Atendimento presencial",
        ],
        "Administrativo": [
            "Pacote Office", "Excel", "Word", "PowerPoint", "Digitação",
            "Organização de arquivos", "Rotinas administrativas", "Emissão de documentos",
            "Controle de agenda", "Elaboração de relatórios", "Atendimento telefônico",
            "Gestão documental", "Sistemas ERP", "Redação empresarial",
        ],
        "Logística": [
            "Controle de estoque", "Inventário", "Separação de pedidos",
            "Conferência de mercadorias", "Recebimento de materiais", "Expedição",
            "Armazenagem", "Operação de empilhadeira", "Picking e packing",
            "Roteirização", "Gestão de transportes", "Controle de validade",
            "Sistemas WMS", "Movimentação de cargas", "Logística reversa",
        ],
        "Tecnologia": [
            "Informática", "Suporte técnico", "HTML e CSS", "JavaScript", "Python",
            "Git e GitHub", "Banco de dados", "Desenvolvimento web",
            "Manutenção de computadores", "Redes de computadores", "Segurança da informação",
            "Análise de dados", "Excel avançado", "Power BI", "Sistemas ERP",
        ],
        "Saúde e cuidados": [
            "Atendimento humanizado", "Primeiros socorros", "Administração de medicamentos",
            "Aferição de sinais vitais", "Cuidados com idosos", "Biossegurança",
            "Organização de prontuários", "Trabalho sob pressão", "Higiene e segurança",
            "Rotinas hospitalares", "Discrição e confidencialidade", "Acolhimento ao paciente",
        ],
        "Alimentação e serviços": [
            "Atendimento em salão", "Preparo de alimentos", "Boas práticas de manipulação",
            "Organização de cozinha", "Controle de validade", "Limpeza e conservação",
            "Agilidade no atendimento", "Trabalho sob pressão", "Operação de caixa",
            "Reposição de produtos", "Controle de pedidos", "Montagem de pratos",
        ],
        "Construção e manutenção": [
            "Leitura de projetos", "Manutenção preventiva", "Manutenção corretiva",
            "Instalações elétricas", "Hidráulica", "Soldagem", "Uso de ferramentas",
            "Segurança do trabalho", "Inspeção de equipamentos", "Diagnóstico de falhas",
            "Pintura", "Alvenaria", "Manutenção predial",
        ],
        "Educação": [
            "Didática", "Planejamento de aulas", "Gestão de sala de aula",
            "Avaliação de aprendizagem", "Alfabetização", "Educação inclusiva",
            "Mediação de conflitos", "Elaboração de materiais", "Comunicação com famílias",
            "Tutoria e acompanhamento", "Desenvolvimento de atividades", "Ensino remoto",
        ],
        "Marketing e comunicação": [
            "Redes sociais", "Criação de conteúdo", "Copywriting", "Edição de vídeo",
            "Design gráfico", "Planejamento de campanhas", "Tráfego pago", "SEO",
            "Atendimento em redes sociais", "Análise de métricas", "Canva", "CapCut",
            "Fotografia", "E-mail marketing", "Planejamento editorial",
        ],
        "Finanças": [
            "Contas a pagar e receber", "Conciliação bancária", "Fluxo de caixa",
            "Emissão de notas fiscais", "Cobrança", "Faturamento", "Matemática financeira",
            "Controle financeiro", "Sistemas contábeis", "Fechamento de caixa",
            "Excel financeiro", "Análise de custos", "Prestação de contas",
        ],
        "Recursos Humanos": [
            "Recrutamento e seleção", "Triagem de currículos", "Admissão e demissão",
            "Controle de ponto", "Folha de pagamento", "Treinamento e desenvolvimento",
            "Integração de colaboradores", "Comunicação interna", "Clima organizacional",
            "Gestão de benefícios", "Rotinas de departamento pessoal", "Entrevistas",
        ],
        "Indústria e produção": [
            "Operação de máquinas", "Linha de produção", "Controle de qualidade",
            "Inspeção de produtos", "Boas práticas de fabricação", "Metodologia 5S",
            "Produção enxuta", "Leitura de instrumentos de medição", "Montagem de peças",
            "Manutenção autônoma", "Segurança industrial", "Cumprimento de metas",
        ],
        "Limpeza e apoio": [
            "Limpeza profissional", "Conservação de ambientes", "Organização de materiais",
            "Uso correto de produtos de limpeza", "Higienização", "Coleta de resíduos",
            "Reposição de materiais", "Lavanderia", "Limpeza hospitalar",
            "Zelo pelo patrimônio", "Agilidade", "Trabalho em equipe",
        ],
    });



    const BRAZILIAN_STATES = Object.freeze([
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
        "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
        "SP", "SE", "TO",
    ]);

    const EDUCATION_TYPES = Object.freeze([
        "Ensino Fundamental",
        "Ensino Médio",
        "Ensino Médio Técnico",
        "Curso Técnico",
        "Tecnólogo",
        "Graduação / Ensino Superior",
        "Pós-graduação",
        "MBA",
        "Mestrado",
        "Doutorado",
        "Outro",
    ]);

    const LANGUAGE_LEVELS = Object.freeze([
        { value: "Básico", label: "Básico", description: "Compreende e utiliza palavras e frases simples." },
        { value: "Intermediário", label: "Intermediário", description: "Mantém conversas do dia a dia e entende textos comuns." },
        { value: "Avançado", label: "Avançado", description: "Comunica-se com segurança em situações profissionais." },
        { value: "Fluente", label: "Fluente", description: "Fala e compreende com naturalidade e pouca limitação." },
        { value: "Nativo / Bilíngue", label: "Nativo / Bilíngue", description: "Possui domínio completo, equivalente a um falante nativo." },
    ]);
    const ROLE_CATEGORY_RULES = Object.freeze([
        { category: "Logística", words: ["logistica", "estoque", "almoxarif", "expedicao", "conferente", "armaz", "empilhadeira", "transport"] },
        { category: "Atendimento e vendas", words: ["atendimento", "venda", "vendedor", "recepc", "telemarketing", "comercial", "caixa", "loja"] },
        { category: "Administrativo", words: ["administr", "secretar", "escritorio", "assistente", "auxiliar administrativo"] },
        { category: "Tecnologia", words: ["tecnologia", "desenvolv", "programador", "suporte", "informatica", "dados", "software", "ti "] },
        { category: "Saúde e cuidados", words: ["saude", "enferm", "cuidador", "farmac", "hospital", "clinica", "tecnico de enfermagem"] },
        { category: "Alimentação e serviços", words: ["cozinha", "cozinheiro", "garcom", "restaurante", "aliment", "confeite", "padeiro"] },
        { category: "Construção e manutenção", words: ["manutenc", "eletric", "mecan", "pedreiro", "construc", "soldador", "pintor", "hidraulic"] },
        { category: "Educação", words: ["professor", "educac", "pedagog", "instrutor", "ensino", "monitor"] },
        { category: "Marketing e comunicação", words: ["marketing", "social media", "comunicac", "conteudo", "designer", "publicidade"] },
        { category: "Finanças", words: ["finance", "contab", "fatur", "cobranca", "tesour", "banco"] },
        { category: "Recursos Humanos", words: ["recursos humanos", "rh ", "departamento pessoal", "recrut", "folha de pagamento"] },
        { category: "Indústria e produção", words: ["produc", "operador de maquina", "industr", "qualidade", "fabrica", "montador"] },
        { category: "Limpeza e apoio", words: ["limpeza", "servicos gerais", "conservacao", "auxiliar de limpeza", "copeiro"] },
    ]);

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

    function selectField(label, key, value, options, placeholder = "Selecione") {
        return `
            <div class="input-sub-group">
                <label for="field-${key}">${label}</label>
                <select id="field-${key}" data-field="${key}">
                    <option value="">${escapeHtml(placeholder)}</option>
                    ${options.map((option) => `
                        <option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>
                            ${escapeHtml(option)}
                        </option>
                    `).join("")}
                </select>
            </div>
        `;
    }

    function customSelectField(label, key, value, options, placeholder = "Selecione", settings = {}) {
        const normalizedOptions = options.map((option) => (
            typeof option === "string" ? { value: option, label: option, description: "" } : option
        ));
        const selected = normalizedOptions.find((option) => option.value === value);
        const compactClass = settings.compact ? " is-compact" : "";
        const menuId = `custom-select-menu-${key}`;

        return `
            <div class="input-sub-group custom-select-group${compactClass}">
                <label id="custom-select-label-${key}" for="custom-select-trigger-${key}">${label}</label>
                <div class="custom-select" data-custom-select>
                    <input id="field-${key}" type="hidden" data-field="${key}" value="${escapeHtml(value || "")}" />
                    <button
                        id="custom-select-trigger-${key}"
                        class="custom-select-trigger"
                        data-action="toggle-custom-select"
                        type="button"
                        aria-expanded="false"
                        aria-haspopup="listbox"
                        aria-controls="${menuId}"
                        aria-labelledby="custom-select-label-${key} custom-select-value-${key}"
                    >
                        <span class="custom-select-trigger-copy" id="custom-select-value-${key}">
                            <strong>${escapeHtml(selected?.label || placeholder)}</strong>
                        </span>
                        <span class="custom-select-chevron" aria-hidden="true"></span>
                    </button>
                    <div class="custom-select-menu" id="${menuId}" role="listbox" aria-labelledby="custom-select-label-${key}" hidden>
                        ${normalizedOptions.map((option) => `
                            <button
                                class="custom-select-option ${option.value === value ? "is-selected" : ""}"
                                data-action="select-custom-option"
                                data-field-key="${key}"
                                data-value="${escapeHtml(option.value)}"
                                data-label="${escapeHtml(option.label)}"
                                type="button"
                                role="option"
                                aria-selected="${option.value === value}"
                            >
                                <span class="custom-select-option-copy">
                                    <strong>${escapeHtml(option.label)}</strong>
                                    ${option.description ? `<small>${escapeHtml(option.description)}</small>` : ""}
                                </span>
                                <span class="custom-select-option-check" aria-hidden="true">✓</span>
                            </button>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;
    }

    function closeCustomSelects(except = null) {
        document.querySelectorAll("[data-custom-select].is-open").forEach((select) => {
            if (select === except) return;
            select.classList.remove("is-open");
            select.querySelector(".custom-select-trigger")?.setAttribute("aria-expanded", "false");
            const menu = select.querySelector(".custom-select-menu");
            if (menu) menu.hidden = true;
        });
    }

    function toggleCustomSelect(trigger) {
        const select = trigger.closest("[data-custom-select]");
        const menu = select?.querySelector(".custom-select-menu");
        if (!select || !menu) return;

        const willOpen = !select.classList.contains("is-open");
        closeCustomSelects(select);
        select.classList.toggle("is-open", willOpen);
        trigger.setAttribute("aria-expanded", String(willOpen));
        menu.hidden = !willOpen;

        if (willOpen) {
            const selectedOption = menu.querySelector(".custom-select-option.is-selected");
            window.setTimeout(() => (selectedOption || menu.querySelector(".custom-select-option"))?.focus(), 0);
        }
    }

    function selectCustomOption(option) {
        const select = option.closest("[data-custom-select]");
        const fieldKey = option.dataset.fieldKey;
        const hiddenInput = byId(`field-${fieldKey}`);
        const trigger = select?.querySelector(".custom-select-trigger");
        const current = select?.querySelector(".custom-select-trigger-copy strong");
        if (!select || !fieldKey || !hiddenInput || !trigger || !current) return;

        hiddenInput.value = option.dataset.value || "";
        current.textContent = option.dataset.label || option.dataset.value || "Selecione";
        select.querySelectorAll(".custom-select-option").forEach((item) => {
            const selectedOption = item === option;
            item.classList.toggle("is-selected", selectedOption);
            item.setAttribute("aria-selected", String(selectedOption));
        });
        hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
        closeCustomSelects();
        trigger.focus();
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
        container.innerHTML = `
            ${field("Nome Completo", "nome", data.nome)}
            ${field("Cargo / Profissão", "cargo", data.cargo)}
            ${field("E-mail", "email", data.email, { type: "email", inputMode: "email" })}
            ${field("Telefone", "telefone", data.telefone, { inputMode: "tel" })}
            <div class="location-grid">
                ${field("Cidade", "cidade", data.cidade, { placeholder: "Ex.: Juiz de Fora" })}
                ${customSelectField("Estado", "estado", data.estado, BRAZILIAN_STATES, "UF", { compact: true })}
            </div>
            ${field("CPF (Opcional)", "cpf", data.cpf, { inputMode: "numeric" })}
        `;
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

    function itemActions(type, index, total, orderable = false) {
        return `
            <div class="item-actions-group">
                ${orderable ? `
                    <button class="btn-move-item" data-action="move-${type}-up" data-index="${index}" type="button" aria-label="Mover para cima" ${index === 0 ? "disabled" : ""}>↑</button>
                    <button class="btn-move-item" data-action="move-${type}-down" data-index="${index}" type="button" aria-label="Mover para baixo" ${index === total - 1 ? "disabled" : ""}>↓</button>
                ` : ""}
                <button class="btn-edit-item" data-action="edit-${type}" data-index="${index}" type="button">Editar</button>
                <button class="btn-remove-item" data-action="remove-${type}" data-index="${index}" type="button">Remover</button>
            </div>
        `;
    }

    function reorderableRow(type, index, total, content) {
        return `
            <article
                class="added-item-row reorderable-item"
                draggable="true"
                data-reorder-type="${type}"
                data-index="${index}"
            >
                <button class="drag-handle" data-drag-handle type="button" aria-label="Arraste para reordenar" title="Arraste para reordenar">⋮⋮</button>
                <span class="added-item-content">${content}</span>
                ${itemActions(type, index, total, true)}
            </article>
        `;
    }

    function renderExperiences(container) {
        const state = App.state.value;
        const editing = state.editing.experiencia;
        const item = editing >= 0 ? state.data.experiencias[editing] : {};
        const total = state.data.experiencias.length;

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
            ${total ? '<p class="reorder-helper">Arraste as experiências ou use as setas para definir a ordem exibida no currículo.</p>' : ""}
            <div class="added-items-list reorder-list" data-reorder-list="experience">
                ${state.data.experiencias.map((entry, index) => reorderableRow(
                    "experience",
                    index,
                    total,
                    `<strong>${escapeHtml(entry.cargo)}</strong> em ${escapeHtml(entry.empresa)}`,
                )).join("")}
            </div>
        `;
        syncCurrentCheckbox("exp");
    }

    function renderEducation(container) {
        const state = App.state.value;
        const editing = state.editing.formacao;
        const item = editing >= 0 ? state.data.formacoes[editing] : {};
        const total = state.data.formacoes.length;

        container.innerHTML = `
            <div class="editor-card">
                ${customSelectField("Tipo de formação", "form-tipo", item.tipo || "", EDUCATION_TYPES, "Selecione o nível")}
                ${field("Curso / Área (quando aplicável)", "form-curso", item.curso || "", { placeholder: "Ex.: Logística, Administração" })}
                ${field("Instituição", "form-inst", item.inst || "")}
                ${renderDateFields("form", item)}
                <button class="btn-add-item" data-action="save-education" type="button">
                    ${editing >= 0 ? "Atualizar formação" : "Salvar formação"}
                </button>
            </div>
            ${total ? '<p class="reorder-helper">Arraste as formações ou use as setas para ajustar a ordem no currículo.</p>' : ""}
            <div class="added-items-list reorder-list" data-reorder-list="education">
                ${state.data.formacoes.map((entry, index) => {
                    const title = [entry.tipo, entry.curso].filter(Boolean).join(" — ") || "Formação";
                    return reorderableRow(
                        "education",
                        index,
                        total,
                        `<strong>${escapeHtml(title)}</strong> — ${escapeHtml(entry.inst)}`,
                    );
                }).join("")}
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

    function normalizeSuggestionText(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function isSkillAdded(skill) {
        const normalizedSkill = normalizeSuggestionText(skill);
        return App.state.value.data.competencias.some(
            (item) => normalizeSuggestionText(item) === normalizedSkill,
        );
    }

    function getProfileSkillCategory() {
        const data = App.state.value.data;
        const profileText = normalizeSuggestionText(`${data.cargo || ""} ${data.resumo || ""}`);
        const matchedRule = ROLE_CATEGORY_RULES.find((rule) =>
            rule.words.some((word) => profileText.includes(normalizeSuggestionText(word))),
        );
        return matchedRule?.category || "Comportamentais";
    }

    function getQuickSkillSuggestions() {
        const category = getProfileSkillCategory();
        const roleSuggestions = SKILL_SUGGESTION_CATEGORIES[category] || [];
        const generalSuggestions = [
            "Comunicação", "Organização", "Trabalho em equipe",
            "Proatividade", "Responsabilidade", "Gestão do tempo",
        ];
        return [...new Set([...roleSuggestions.slice(0, 4), ...generalSuggestions])].slice(0, 6);
    }

    function skillCountText() {
        const count = App.state.value.data.competencias.length;
        if (count === 0) return "Nenhuma selecionada";
        if (count <= 4) return `${count} selecionada${count === 1 ? "" : "s"}`;
        if (count <= 8) return `${count} selecionadas — boa quantidade`;
        return `${count} selecionadas — priorize as mais relevantes`;
    }

    function renderQuickSkillSuggestions() {
        return `
            <button class="btn-more-suggestions" data-action="open-skill-suggestions" type="button">
                Ver sugestões
            </button>
        `;
    }

    function getAllUniqueSkillSuggestions() {
        return [...new Set(Object.values(SKILL_SUGGESTION_CATEGORIES).flat())]
            .sort((a, b) => a.localeCompare(b, "pt-BR"));
    }

    function getLiveSkillSuggestions(query, limit = 6) {
        const normalizedQuery = normalizeSuggestionText(query);
        if (normalizedQuery.length < 2) return [];

        return getAllUniqueSkillSuggestions()
            .filter((skill) => !isSkillAdded(skill))
            .map((skill) => {
                const normalizedSkill = normalizeSuggestionText(skill);
                const words = normalizedSkill.split(/\s+/);
                let score = 0;

                if (normalizedSkill === normalizedQuery) score = 400;
                else if (normalizedSkill.startsWith(normalizedQuery)) score = 300;
                else if (words.some((word) => word.startsWith(normalizedQuery))) score = 200;
                else if (normalizedSkill.includes(normalizedQuery)) score = 100;

                return { skill, score };
            })
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score || a.skill.localeCompare(b.skill, "pt-BR"))
            .slice(0, limit)
            .map((entry) => entry.skill);
    }

    function updateLiveSkillSuggestions(value) {
        const container = byId("skill-live-suggestions");
        if (!container) return;

        const query = String(value || "").trim();
        const suggestions = getLiveSkillSuggestions(query);

        if (normalizeSuggestionText(query).length < 2) {
            container.hidden = true;
            container.innerHTML = "";
            return;
        }

        container.hidden = false;
        container.innerHTML = suggestions.length
            ? `
                <p class="skill-live-title">Sugestões relacionadas</p>
                <div class="skill-live-list" role="listbox" aria-label="Competências relacionadas ao que está sendo digitado">
                    ${suggestions.map((skill) => `
                        <button
                            class="skill-live-option"
                            data-action="add-live-skill"
                            data-skill="${escapeHtml(skill)}"
                            type="button"
                            role="option"
                        >
                            <span>${escapeHtml(skill)}</span>
                            <small>Adicionar</small>
                        </button>
                    `).join("")}
                </div>
            `
            : `
                <p class="skill-live-empty">Nenhuma sugestão encontrada. Você pode inserir “${escapeHtml(query)}” como uma competência personalizada.</p>
            `;
    }

    function updateSkillSuggestionDialog() {
        const dialog = byId("skill-suggestions-dialog");
        if (!dialog) return;

        const activeCategory = dialog.dataset.category || "Todas";
        const search = normalizeSuggestionText(byId("skill-suggestion-search")?.value || "");
        const source = activeCategory === "Todas"
            ? getAllUniqueSkillSuggestions()
            : (SKILL_SUGGESTION_CATEGORIES[activeCategory] || []);
        const filtered = source.filter((skill) => normalizeSuggestionText(skill).includes(search));
        const results = byId("skill-suggestion-results");
        const count = byId("skill-dialog-count");

        dialog.querySelectorAll("[data-skill-category]").forEach((button) => {
            const isActive = button.dataset.skillCategory === activeCategory;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        if (count) count.textContent = skillCountText();
        if (!results) return;

        results.innerHTML = filtered.length
            ? filtered.map((skill) => {
                const selected = isSkillAdded(skill);
                return `
                    <button
                        class="skill-catalog-item ${selected ? "is-selected" : ""}"
                        data-dialog-skill="${escapeHtml(skill)}"
                        type="button"
                        ${selected ? "disabled" : ""}
                    >
                        <span>${escapeHtml(skill)}</span>
                        <small>${selected ? "Adicionada" : "Adicionar"}</small>
                    </button>
                `;
            }).join("")
            : '<p class="skill-no-results">Nenhuma sugestão encontrada. Você ainda pode escrever uma competência personalizada no campo principal.</p>';
    }

    function ensureSkillSuggestionDialog() {
        let dialog = byId("skill-suggestions-dialog");
        if (dialog) return dialog;

        dialog = document.createElement("dialog");
        dialog.id = "skill-suggestions-dialog";
        dialog.className = "skill-suggestions-dialog";
        dialog.dataset.category = "Todas";
        dialog.innerHTML = `
            <div class="skill-dialog-shell">
                <header class="skill-dialog-header">
                    <div>
                        <h2>Encontre suas competências</h2>
                        <p>Pesquise ou navegue pelas categorias. Clique para adicionar ao currículo.</p>
                    </div>
                    <button class="skill-dialog-close" data-dialog-action="close" type="button" aria-label="Fechar sugestões">Fechar</button>
                </header>

                <label class="skill-search-label" for="skill-suggestion-search">Buscar competência</label>
                <input
                    id="skill-suggestion-search"
                    class="skill-suggestion-search"
                    type="search"
                    placeholder="Ex.: Excel, atendimento, estoque..."
                    autocomplete="off"
                />

                <div class="skill-dialog-summary">
                    <span id="skill-dialog-count">${escapeHtml(skillCountText())}</span>
                    <span>Recomendação: 5 a 8 competências</span>
                </div>

                <div class="skill-category-tabs" aria-label="Categorias de competências">
                    ${["Todas", ...Object.keys(SKILL_SUGGESTION_CATEGORIES)].map((category) => `
                        <button
                            class="skill-category-button ${category === "Todas" ? "is-active" : ""}"
                            data-skill-category="${escapeHtml(category)}"
                            type="button"
                            aria-pressed="${category === "Todas"}"
                        >${escapeHtml(category)}</button>
                    `).join("")}
                </div>

                <div class="skill-suggestion-results" id="skill-suggestion-results"></div>
            </div>
        `;
        document.body.append(dialog);

        const closeDialog = () => {
            if (typeof dialog.close === "function") dialog.close();
            else dialog.removeAttribute("open");
        };

        dialog.addEventListener("click", (event) => {
            if (event.target === dialog || event.target.closest('[data-dialog-action="close"]')) {
                closeDialog();
                return;
            }

            const categoryButton = event.target.closest("[data-skill-category]");
            if (categoryButton) {
                dialog.dataset.category = categoryButton.dataset.skillCategory;
                updateSkillSuggestionDialog();
                return;
            }

            const skillButton = event.target.closest("[data-dialog-skill]");
            if (skillButton) addSkillValue(skillButton.dataset.dialogSkill);
        });
        byId("skill-suggestion-search")?.addEventListener("input", updateSkillSuggestionDialog);
        dialog.addEventListener("cancel", (event) => {
            event.preventDefault();
            closeDialog();
        });
        return dialog;
    }

    function openSkillSuggestionDialog() {
        const dialog = ensureSkillSuggestionDialog();
        dialog.dataset.category = getProfileSkillCategory();
        const searchInput = byId("skill-suggestion-search");
        if (searchInput) searchInput.value = "";
        updateSkillSuggestionDialog();
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
        window.setTimeout(() => searchInput?.focus(), 50);
    }

    function addSkillValue(value) {
        const skill = String(value || "").trim();
        if (!skill) return false;
        if (isSkillAdded(skill)) {
            updateSkillSuggestionDialog();
            return false;
        }

        App.state.value.data.competencias.push(skill);
        App.state.save();
        App.preview.render();
        renderSkills(byId("interactive-content"));
        updateSkillSuggestionDialog();
        return true;
    }

    function renderSkills(container) {
        const data = App.state.value.data;
        container.innerHTML = `
            <section class="skills-editor-block">
                <p class="section-input-helper skills-main-helper">Adicione competências como liderança, Excel ou atendimento.</p>
                ${field("", "new-skill", "", {
                    placeholder: "Ex.: Liderança, Excel",
                })}
                <div id="skill-live-suggestions" class="skill-live-suggestions" aria-live="polite" hidden></div>
                <button class="btn-add-item" data-action="add-skill" type="button">Inserir habilidade</button>
                ${renderQuickSkillSuggestions()}
                <div class="added-items-list">${renderTagRows(data.competencias, "skill")}</div>
            </section>

            <section class="additional-group">
                <p class="section-input-title">IDIOMAS</p>
                <p class="section-input-helper">Digite o idioma e escolha o nível que melhor representa seu domínio.</p>
                <div class="language-entry-grid">
                    ${field("Idioma", "new-language", "", {
                        placeholder: "Ex.: Inglês",
                    })}
                    ${customSelectField(
                        "Nível de proficiência",
                        "new-language-level",
                        "",
                        LANGUAGE_LEVELS,
                        "Selecione o nível",
                    )}
                </div>
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
        const previous = App.state.value.editing.experiencia >= 0
            ? App.state.value.data.experiencias[App.state.value.editing.experiencia]
            : null;
        const item = {
            id: previous?.id || App.utils.createId("exp"),
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
        const tipo = inputValue("form-tipo");
        const curso = inputValue("form-curso");
        const inst = inputValue("form-inst");
        if (!tipo || !inst) return App.feedback.showError("Selecione o tipo de formação e informe a instituição.");

        const current = document.querySelector('[data-current-checkbox="form"]')?.checked || false;
        const previous = App.state.value.editing.formacao >= 0
            ? App.state.value.data.formacoes[App.state.value.editing.formacao]
            : null;
        const item = {
            id: previous?.id || App.utils.createId("form"),
            tipo,
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
        if (stateKey === "competencias") return addSkillValue(value);

        const list = App.state.value.data[stateKey];
        const normalizedValue = normalizeSuggestionText(value);
        const alreadyExists = list.some((item) => normalizeSuggestionText(item) === normalizedValue);
        if (!alreadyExists) list.push(value);
        App.state.save();
        App.preview.render();
        renderFunction(byId("interactive-content"));
    }

    function getLanguageName(entry) {
        return String(entry || "").split(/\s*[—–-]\s*/)[0].trim();
    }

    function addLanguage() {
        const language = inputValue("new-language");
        const level = inputValue("new-language-level");
        if (!language) return App.feedback.showError("Informe o idioma.");
        if (!level) return App.feedback.showError("Selecione o nível de proficiência.");

        const formattedLanguage = `${language} — ${level}`;
        const languages = App.state.value.data.idiomas;
        const normalizedLanguage = normalizeSuggestionText(language);
        const existingIndex = languages.findIndex(
            (item) => normalizeSuggestionText(getLanguageName(item)) === normalizedLanguage,
        );

        if (existingIndex >= 0) languages[existingIndex] = formattedLanguage;
        else languages.push(formattedLanguage);

        App.state.save();
        App.preview.render();
        renderSkills(byId("interactive-content"));
    }

    function reorderCollection(type, fromIndex, toIndex) {
        const map = {
            experience: ["experiencias", "experiencia", renderExperiences],
            education: ["formacoes", "formacao", renderEducation],
        };
        const [stateKey, editingKey, renderFunction] = map[type] || [];
        const list = App.state.value.data[stateKey];
        if (!list || fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= list.length) return;

        const [moved] = list.splice(fromIndex, 1);
        list.splice(toIndex, 0, moved);
        App.state.value.editing[editingKey] = -1;
        App.state.save();
        App.preview.render();
        renderFunction(byId("interactive-content"));
    }

    function moveItem(type, index, direction) {
        reorderCollection(type, index, index + direction);
    }

    let draggedItem = null;

    function handleDragStart(event) {
        const row = event.target.closest("[data-reorder-type]");
        if (!row) return;
        draggedItem = {
            type: row.dataset.reorderType,
            index: Number(row.dataset.index),
        };
        row.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", `${draggedItem.type}:${draggedItem.index}`);
    }

    function handleDragOver(event) {
        const row = event.target.closest("[data-reorder-type]");
        if (!row || !draggedItem || row.dataset.reorderType !== draggedItem.type) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        row.classList.add("is-drag-target");
    }

    function handleDragLeave(event) {
        event.target.closest("[data-reorder-type]")?.classList.remove("is-drag-target");
    }

    function handleDrop(event) {
        const row = event.target.closest("[data-reorder-type]");
        if (!row || !draggedItem || row.dataset.reorderType !== draggedItem.type) return;
        event.preventDefault();
        const targetIndex = Number(row.dataset.index);
        const { type, index } = draggedItem;
        draggedItem = null;
        reorderCollection(type, index, targetIndex);
    }

    function handleDragEnd() {
        document.querySelectorAll(".reorderable-item").forEach((row) => {
            row.classList.remove("is-dragging", "is-drag-target");
        });
        draggedItem = null;
    }

    let pointerDrag = null;

    function clearPointerDrag() {
        document.querySelectorAll(".reorderable-item").forEach((row) => {
            row.classList.remove("is-dragging", "is-drag-target");
        });
        pointerDrag = null;
    }

    function handlePointerDown(event) {
        const handle = event.target.closest("[data-drag-handle]");
        const row = handle?.closest("[data-reorder-type]");
        if (!handle || !row || event.pointerType === "mouse") return;

        pointerDrag = {
            type: row.dataset.reorderType,
            fromIndex: Number(row.dataset.index),
            toIndex: Number(row.dataset.index),
            startY: event.clientY,
            active: false,
            handle,
        };
        handle.setPointerCapture?.(event.pointerId);
    }

    function handlePointerMove(event) {
        if (!pointerDrag) return;
        if (!pointerDrag.active && Math.abs(event.clientY - pointerDrag.startY) < 8) return;

        pointerDrag.active = true;
        event.preventDefault();
        const source = document.querySelector(
            `[data-reorder-type="${pointerDrag.type}"][data-index="${pointerDrag.fromIndex}"]`,
        );
        source?.classList.add("is-dragging");

        document.querySelectorAll(".reorderable-item.is-drag-target")
            .forEach((row) => row.classList.remove("is-drag-target"));

        const target = document.elementFromPoint(event.clientX, event.clientY)
            ?.closest(`[data-reorder-type="${pointerDrag.type}"]`);
        if (!target) return;
        pointerDrag.toIndex = Number(target.dataset.index);
        target.classList.add("is-drag-target");
    }

    function handlePointerEnd(event) {
        if (!pointerDrag) return;
        const { type, fromIndex, toIndex, active, handle } = pointerDrag;
        handle.releasePointerCapture?.(event.pointerId);
        clearPointerDrag();
        if (active && fromIndex !== toIndex) reorderCollection(type, fromIndex, toIndex);
    }

    function removeItem(type, index) {
        const map = {
            experience: ["experiencias", renderExperiences],
            education: ["formacoes", renderEducation],
            certificate: ["certificacoes", renderCertificates],
            skill: ["competencias", renderSkills],
            language: ["idiomas", renderSkills],
            interest: ["interesses", renderSkills],
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

        if (key === "new-skill") {
            updateLiveSkillSuggestions(input.value);
        }

        if (["nome", "cargo", "email", "telefone", "cidade", "cpf", "resumo"].includes(key)) {
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

        const changedField = event.target.dataset.field;
        if (changedField === "estado") {
            App.state.updateField("estado", event.target.value);
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
            "toggle-custom-select": () => toggleCustomSelect(button),
            "select-custom-option": () => selectCustomOption(button),
            "remove-photo": () => {
                App.state.updateField("foto", "");
                renderPhoto(byId("interactive-content"));
            },
            "save-experience": saveExperience,
            "save-education": saveEducation,
            "save-certificate": saveCertificate,
            "add-skill": () => addTag("new-skill", "competencias", renderSkills),
            "add-live-skill": () => addSkillValue(button.dataset.skill),
            "add-suggested-skill": () => addSkillValue(button.dataset.skill),
            "open-skill-suggestions": openSkillSuggestionDialog,
            "add-language": addLanguage,
            "add-interest": () => addTag("new-interest", "interesses", renderSkills),
        };

        if (actions[action]) return actions[action]();
        const moveMatch = action.match(/^move-(experience|education)-(up|down)$/);
        if (moveMatch) return moveItem(moveMatch[1], index, moveMatch[2] === "up" ? -1 : 1);
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
        container?.addEventListener("dragstart", handleDragStart);
        container?.addEventListener("dragover", handleDragOver);
        container?.addEventListener("dragleave", handleDragLeave);
        container?.addEventListener("drop", handleDrop);
        container?.addEventListener("dragend", handleDragEnd);
        container?.addEventListener("pointerdown", handlePointerDown);
        container?.addEventListener("pointermove", handlePointerMove);
        container?.addEventListener("pointerup", handlePointerEnd);
        container?.addEventListener("pointercancel", handlePointerEnd);

        document.addEventListener("click", (event) => {
            if (!event.target.closest("[data-custom-select]")) closeCustomSelects();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeCustomSelects();
        });
    }

    App.forms = { renderStepForm, bindEvents };
})(window);
