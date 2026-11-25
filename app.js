/* Gerador de Currículo — JavaScript puro, sem dependências.
 * Tudo roda no navegador: os dados ficam no localStorage e nunca são enviados a servidor algum. */
(() => {
  'use strict';

  const KEY = 'gerador-curriculo:v1';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const TEMPLATES = [
    ['classico', 'Clássico'], ['moderno', 'Moderno'], ['minimalista', 'Minimalista'],
    ['executivo', 'Executivo'], ['criativo', 'Criativo'], ['compacto', 'Compacto']
  ];

  const LISTS = {
    experiencias: {
      nome: 'Experiência',
      vazio: { cargo: '', empresa: '', periodo: '', descricao: '' },
      campos: [
        ['cargo', 'Cargo', 'input'], ['empresa', 'Empresa', 'input'],
        ['periodo', 'Período', 'input', 'Jan/2022 – atual'],
        ['descricao', 'Atividades e resultados (uma por linha)', 'textarea']
      ]
    },
    formacoes: {
      nome: 'Formação',
      vazio: { curso: '', instituicao: '', periodo: '' },
      campos: [
        ['curso', 'Curso / grau', 'input'], ['instituicao', 'Instituição', 'input'],
        ['periodo', 'Período', 'input', '2018 – 2022']
      ]
    },
    cursos: {
      nome: 'Curso',
      vazio: { nome: '', instituicao: '', ano: '' },
      campos: [
        ['nome', 'Curso ou certificado', 'input'], ['instituicao', 'Instituição', 'input'],
        ['ano', 'Ano', 'input', '2024']
      ]
    }
  };

  const VAZIO = {
    nome: '', cargo: '', email: '', telefone: '', cidade: '', linkedin: '', site: '', resumo: '',
    experiencias: [], formacoes: [], habilidades: '', idiomas: '', cursos: []
  };

  const EXEMPLO = {
    nome: 'Camila Ribeiro',
    cargo: 'Desenvolvedora Full Stack',
    email: 'camila.ribeiro@email.com',
    telefone: '(81) 90000-0000',
    cidade: 'Recife, PE',
    linkedin: 'linkedin.com/in/camila-ribeiro',
    site: 'github.com/camila-ribeiro',
    resumo: 'Desenvolvedora com 6 anos de experiência em aplicações web e APIs, do banco de dados à interface. Foco em código limpo, testes e entregas que melhoram a rotina de quem usa o sistema.',
    experiencias: [
      {
        cargo: 'Desenvolvedora Full Stack Sênior', empresa: 'Tecnologia Exemplo Ltda.', periodo: 'Mar/2022 – atual',
        descricao: 'Liderei a migração de um sistema legado em PHP para uma API em .NET, reduzindo o tempo de resposta em 40%\nCriei o painel de relatórios em React usado por 300 clientes\nMentoria de 3 desenvolvedores júnior e revisão de código do time'
      },
      {
        cargo: 'Desenvolvedora Pleno', empresa: 'Soluções Digitais S.A.', periodo: 'Jan/2020 – Fev/2022',
        descricao: 'Desenvolvi módulos de cobrança e emissão de notas fiscais\nAutomatizei testes e publicações, cortando o tempo de entrega de 2 dias para 2 horas'
      },
      {
        cargo: 'Desenvolvedora Júnior', empresa: 'Agência Web Criativa', periodo: 'Jun/2018 – Dez/2019',
        descricao: 'Sites e lojas virtuais em PHP, MySQL e JavaScript\nAtendimento direto aos clientes para levantar requisitos'
      }
    ],
    formacoes: [
      { curso: 'Bacharelado em Sistemas de Informação', instituicao: 'Universidade Federal de Pernambuco', periodo: '2014 – 2018' },
      { curso: 'Pós-graduação em Arquitetura de Software', instituicao: 'Instituto de Tecnologia', periodo: '2021 – 2022' }
    ],
    habilidades: 'JavaScript, TypeScript, React, Node.js, C# / .NET, PHP, SQL Server, PostgreSQL, Git, Docker, Testes automatizados',
    idiomas: 'Português (nativo), Inglês (avançado), Espanhol (básico)',
    cursos: [
      { nome: 'AWS Certified Cloud Practitioner', instituicao: 'Amazon Web Services', ano: '2023' },
      { nome: 'Scrum Foundation', instituicao: 'Scrum Alliance', ano: '2021' }
    ]
  };

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const splitList = (s) => String(s || '').split(/[\n,;]+/).map((x) => x.trim()).filter(Boolean);
  const bullets = (s) => String(s || '').split('\n').map((x) => x.replace(/^\s*[-•*–]\s*/, '').trim()).filter(Boolean);
  const href = (u) => (/^(https?:|mailto:|tel:)/i.test(u) ? u : 'https://' + u);
  const shortUrl = (u) => String(u).replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

  function normalize(d) {
    const out = clone(VAZIO);
    if (!d || typeof d !== 'object') return out;
    for (const k of Object.keys(VAZIO)) {
      if (Array.isArray(VAZIO[k])) {
        out[k] = Array.isArray(d[k]) ? d[k].map((it) => Object.assign(clone(LISTS[k].vazio), it)) : [];
      } else {
        out[k] = typeof d[k] === 'string' ? d[k] : '';
      }
    }
    return out;
  }

  // ---------- estado ----------
  function loadSaved() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  }
  const saved = loadSaved();
  const state = { data: saved && saved.data ? normalize(saved.data) : clone(EXEMPLO) };
  const cfg = Object.assign({ tpl: 'classico', accent: '#1f4e79', fs: 10.5 }, saved && saved.cfg);
  if (!TEMPLATES.some((t) => t[0] === cfg.tpl)) cfg.tpl = 'classico';
  let undoData = null;

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ data: state.data, cfg })); } catch { /* sem armazenamento */ }
  }

  // ---------- currículo ----------
  const hasAny = (o) => Object.values(o).some((v) => String(v).trim());
  const sec = (id, titulo, corpo) =>
    corpo ? `<section data-s="${id}" class="${id}"><h3>${titulo}</h3><div class="sec-body">${corpo}</div></section>` : '';
  const ul = (t) => { const b = bullets(t); return b.length ? `<ul>${b.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''; };
  const item = (titulo, org, per, extra = '') =>
    `<div class="item"><div class="row"><h4>${esc(titulo)}</h4>${per ? `<span class="per">${esc(per)}</span>` : ''}</div>${org ? `<div class="org">${esc(org)}</div>` : ''}${extra}</div>`;

  function renderCV() {
    const d = state.data;
    const cv = $('#cv');
    cv.className = 'cv t-' + cfg.tpl;
    cv.style.setProperty('--accent', cfg.accent);
    cv.style.setProperty('--fs', cfg.fs);

    const contatos = [];
    if (d.email) contatos.push(`<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`);
    if (d.telefone) contatos.push(`<span>${esc(d.telefone)}</span>`);
    if (d.cidade) contatos.push(`<span>${esc(d.cidade)}</span>`);
    if (d.linkedin) contatos.push(`<a href="${esc(href(d.linkedin))}">${esc(shortUrl(d.linkedin))}</a>`);
    if (d.site) contatos.push(`<a href="${esc(href(d.site))}">${esc(shortUrl(d.site))}</a>`);

    const exp = d.experiencias.filter(hasAny).map((x) => item(x.cargo, x.empresa, x.periodo, ul(x.descricao))).join('');
    const form = d.formacoes.filter(hasAny).map((x) => item(x.curso, x.instituicao, x.periodo)).join('');
    const cur = d.cursos.filter(hasAny).map((x) => item(x.nome, x.instituicao, x.ano)).join('');
    const hab = splitList(d.habilidades);
    const idi = splitList(d.idiomas);

    const side =
      sec('contato', 'Contato', contatos.length ? `<ul class="lista">${contatos.map((c) => `<li>${c}</li>`).join('')}</ul>` : '') +
      sec('habilidades', 'Habilidades', hab.length ? `<ul class="chips">${hab.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '') +
      sec('idiomas', 'Idiomas', idi.length ? `<ul class="chips">${idi.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');

    const main =
      `<header data-s="header"><h1>${esc(d.nome || 'Seu Nome')}</h1>${d.cargo ? `<p class="cargo">${esc(d.cargo)}</p>` : ''}</header>` +
      sec('resumo', 'Resumo profissional', d.resumo.trim() ? `<p>${esc(d.resumo.trim())}</p>` : '') +
      sec('experiencia', 'Experiência profissional', exp) +
      sec('formacao', 'Formação acadêmica', form) +
      sec('cursos', 'Cursos e certificados', cur);

    cv.innerHTML = `<div class="cv-side">${side}</div><div class="cv-main">${main}</div>`;
    fit();
  }

  // ---------- prévia em escala ----------
  function fit() {
    const cv = $('#cv'), box = $('#scaleBox'), pv = $('#preview');
    cv.style.transform = 'none';
    cv.style.minHeight = '';
    const pageH = 297 * 96 / 25.4;
    const pages = Math.max(1, Math.ceil(cv.offsetHeight / pageH - 0.02));
    // sempre páginas A4 inteiras (a faixa colorida dos modelos com barra lateral vai até o fim)
    cv.style.minHeight = `${pages * 297 - 1}mm`;
    const cvW = cv.offsetWidth, cvH = cv.offsetHeight;
    const s = Math.min(1, pv.clientWidth / cvW);
    cv.style.transform = `scale(${s})`;
    box.style.width = cvW * s + 'px';
    box.style.height = cvH * s + 'px';
    $('#pagesInfo').textContent = pages === 1
      ? 'O currículo ocupa 1 página A4.'
      : `O currículo ocupa ${pages} páginas A4. Para caber em 1, reduza o tamanho da letra ou o texto.`;
  }

  // ---------- formulário ----------
  function renderPills() {
    $('#pills').innerHTML = TEMPLATES.map(([id, nome]) =>
      `<button type="button" class="pill" role="radio" aria-checked="${id === cfg.tpl}" data-tpl="${id}">${nome}</button>`).join('');
  }

  function fieldHTML(lista, i, [f, rotulo, tipo, ph], valor) {
    const attrs = `data-f="${f}"${ph ? ` placeholder="${esc(ph)}"` : ''}`;
    const campo = tipo === 'textarea'
      ? `<textarea ${attrs} rows="4">${esc(valor)}</textarea>`
      : `<input ${attrs} value="${esc(valor)}">`;
    return `<label>${rotulo} ${campo}</label>`;
  }

  function renderLists() {
    for (const [nome, def] of Object.entries(LISTS)) {
      const itens = state.data[nome];
      $('#list-' + nome).innerHTML = itens.map((it, i) => `
        <div class="item-card" data-list="${nome}" data-i="${i}">
          ${def.campos.map((c) => fieldHTML(nome, i, c, it[c[0]])).join('')}
          <div class="item-tools">
            <button type="button" class="btn small" data-act="up" ${i === 0 ? 'disabled' : ''} aria-label="Mover para cima">↑</button>
            <button type="button" class="btn small" data-act="down" ${i === itens.length - 1 ? 'disabled' : ''} aria-label="Mover para baixo">↓</button>
            <button type="button" class="btn small danger" data-act="del">Remover</button>
          </div>
        </div>`).join('');
    }
  }

  function fillStatic() {
    $$('[data-k]').forEach((el) => { el.value = state.data[el.dataset.k] || ''; });
    $('#accent').value = cfg.accent;
    $('#fs').value = cfg.fs;
    $('#fsOut').textContent = String(cfg.fs).replace('.', ',');
  }

  function renderAll() {
    fillStatic(); renderPills(); renderLists(); renderCV();
  }

  // ---------- avisos e desfazer ----------
  function aviso(texto, { desfazer = false, tipo = '' } = {}) {
    const m = $('#msg');
    m.innerHTML = `<div class="notice ${tipo}">${esc(texto)} ${desfazer ? '<button type="button" class="btn small" id="btnDesfazer">Desfazer</button>' : ''}</div>`;
    const b = $('#btnDesfazer');
    if (b) b.onclick = () => { if (undoData) { state.data = undoData; undoData = null; save(); renderAll(); m.innerHTML = ''; } };
  }
  function trocarDados(novos, texto) {
    undoData = clone(state.data);
    state.data = normalize(novos);
    save(); renderAll();
    aviso(texto, { desfazer: true });
  }

  // ---------- eventos ----------
  $('#panel').addEventListener('input', (e) => {
    const t = e.target;
    const card = t.closest('[data-list]');
    if (card && t.dataset.f) {
      state.data[card.dataset.list][+card.dataset.i][t.dataset.f] = t.value;
    } else if (t.dataset.k) {
      state.data[t.dataset.k] = t.value;
    } else return;
    save(); renderCV();
  });

  $('#panel').addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const n = add.dataset.add;
      state.data[n].push(clone(LISTS[n].vazio));
      save(); renderLists(); renderCV();
      const cards = $$(`#list-${n} .item-card`);
      const ultimo = cards[cards.length - 1];
      if (ultimo) { const first = $('input, textarea', ultimo); if (first) first.focus(); }
      return;
    }
    const act = e.target.closest('[data-act]');
    if (act) {
      const card = act.closest('[data-list]');
      const arr = state.data[card.dataset.list];
      const i = +card.dataset.i;
      if (act.dataset.act === 'del') arr.splice(i, 1);
      if (act.dataset.act === 'up' && i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      if (act.dataset.act === 'down' && i < arr.length - 1) [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
      save(); renderLists(); renderCV();
      return;
    }
    const pill = e.target.closest('[data-tpl]');
    if (pill) { cfg.tpl = pill.dataset.tpl; save(); renderPills(); renderCV(); }
  });

  $('#accent').addEventListener('input', (e) => { cfg.accent = e.target.value; save(); renderCV(); });
  $('#fs').addEventListener('input', (e) => {
    cfg.fs = parseFloat(e.target.value);
    $('#fsOut').textContent = String(cfg.fs).replace('.', ',');
    save(); renderCV();
  });

  $('#btnExemplo').onclick = () => trocarDados(EXEMPLO, 'Exemplo carregado.');
  $('#btnLimpar').onclick = () => trocarDados(VAZIO, 'Currículo limpo.');

  // PDF: a impressão do navegador gera PDF com texto de verdade (selecionável e legível por ATS)
  const tituloOriginal = document.title;
  $('#btnPdf').onclick = () => {
    document.title = 'Curriculo - ' + (state.data.nome || 'sem nome');
    window.print();
  };
  window.addEventListener('afterprint', () => { document.title = tituloOriginal; });

  window.addEventListener('resize', fit);
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe($('#preview'));

  // ---------- salvar / abrir JSON ----------
  function baixar(nome, conteudo, tipo) {
    const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
    const a = Object.assign(document.createElement('a'), { href: url, download: nome });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $('#btnExportar').onclick = () => {
    const nome = (state.data.nome || 'curriculo').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    baixar(`curriculo-${nome || 'dados'}.json`, JSON.stringify({ data: state.data, cfg }, null, 2), 'application/json');
  };
  $('#fileImportar').onchange = async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      const j = JSON.parse(await f.text());
      if (j.cfg && TEMPLATES.some((t) => t[0] === j.cfg.tpl)) Object.assign(cfg, { tpl: j.cfg.tpl, accent: j.cfg.accent || cfg.accent, fs: j.cfg.fs || cfg.fs });
      trocarDados(j.data || j, 'Dados abertos.');
    } catch { aviso('Não consegui ler esse arquivo. Use um .json salvo por este gerador.', { tipo: 'warn' }); }
  };

  // ---------- importar do LinkedIn (ZIP ou CSVs da "cópia dos seus dados") ----------
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

  function parseCSV(texto) {
    const rows = [];
    let row = [], cur = '', q = false;
    texto = texto.replace(/^﻿/, '');
    for (let i = 0; i < texto.length; i++) {
      const c = texto[i];
      if (q) {
        if (c === '"') { if (texto[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && texto[i + 1] === '\n') i++;
        row.push(cur); cur = ''; rows.push(row); row = [];
      } else cur += c;
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    const linhas = rows.filter((r) => r.some((x) => x.trim() !== ''));
    if (!linhas.length) return [];
    const [cab, ...corpo] = linhas;
    const chaves = cab.map(norm);
    return corpo.map((r) => Object.fromEntries(chaves.map((k, i) => [k, (r[i] || '').trim()])));
  }

  async function lerZip(buf) {
    const u8 = new Uint8Array(buf), dv = new DataView(buf);
    let e = u8.length - 22;
    while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
    if (e < 0) throw new Error('zip');
    const total = dv.getUint16(e + 10, true);
    let p = dv.getUint32(e + 16, true);
    const arquivos = {};
    for (let i = 0; i < total; i++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const metodo = dv.getUint16(p + 10, true), tam = dv.getUint32(p + 20, true);
      const nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true);
      const lho = dv.getUint32(p + 42, true);
      const nome = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nl));
      p += 46 + nl + el + cl;
      if (!/\.csv$/i.test(nome)) continue;
      const ini = lho + 30 + dv.getUint16(lho + 26, true) + dv.getUint16(lho + 28, true);
      const dados = u8.subarray(ini, ini + tam);
      let bytes;
      if (metodo === 0) bytes = dados;
      else if (metodo === 8) bytes = new Uint8Array(await new Response(new Blob([dados]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
      else continue;
      arquivos[nome.split('/').pop().toLowerCase()] = new TextDecoder().decode(bytes);
    }
    return arquivos;
  }

  const periodo = (ini, fim) => {
    if (!ini && !fim) return '';
    return `${ini || ''} – ${fim || 'atual'}`.trim();
  };

  function mapearLinkedIn(csv) {
    const g = (nome) => parseCSV(csv[nome] || '');
    const out = clone(VAZIO);
    const perfil = g('profile.csv')[0];
    if (perfil) {
      out.nome = [perfil['first name'], perfil['last name']].filter(Boolean).join(' ');
      out.cargo = perfil.headline || '';
      out.resumo = perfil.summary || '';
      out.cidade = perfil['geo location'] || '';
    }
    const emails = g('email addresses.csv');
    const principal = emails.find((x) => /^(yes|sim|true)$/i.test(x.primary || '')) || emails[0];
    if (principal) out.email = principal['email address'] || '';
    out.experiencias = g('positions.csv').map((x) => ({
      cargo: x.title || '', empresa: [x['company name'], x.location].filter(Boolean).join(' — '),
      periodo: periodo(x['started on'], x['finished on']), descricao: x.description || ''
    })).filter(hasAny);
    out.formacoes = g('education.csv').map((x) => ({
      curso: x['degree name'] || x.notes || '', instituicao: x['school name'] || '',
      periodo: periodo(x['start date'], x['end date'])
    })).filter(hasAny);
    out.habilidades = g('skills.csv').map((x) => x.name).filter(Boolean).join(', ');
    out.idiomas = g('languages.csv').map((x) => (x.proficiency ? `${x.name} (${x.proficiency.toLowerCase()})` : x.name)).filter(Boolean).join(', ');
    out.cursos = g('certifications.csv').map((x) => ({
      nome: x.name || '', instituicao: x.authority || '', ano: (x['started on'] || '').split(' ').pop()
    })).filter(hasAny);
    return out;
  }

  $('#fileLinkedin').onchange = async (e) => {
    const arquivos = [...e.target.files];
    e.target.value = '';
    if (!arquivos.length) return;
    try {
      const csv = {};
      for (const f of arquivos) {
        if (/\.zip$/i.test(f.name)) Object.assign(csv, await lerZip(await f.arrayBuffer()));
        else if (/\.csv$/i.test(f.name)) csv[f.name.toLowerCase()] = await f.text();
      }
      const dados = mapearLinkedIn(csv);
      const achou = dados.nome || dados.experiencias.length || dados.formacoes.length || dados.habilidades;
      if (!achou) throw new Error('vazio');
      // mantém o que o LinkedIn não traz (telefone, site, LinkedIn)
      for (const k of ['telefone', 'linkedin', 'site']) dados[k] = state.data[k];
      if (!dados.email) dados.email = state.data.email;
      trocarDados(dados, 'Dados do LinkedIn importados. Confira os textos e ajuste o que quiser.');
    } catch {
      aviso('Não encontrei dados do LinkedIn nesses arquivos. Envie o ZIP da cópia dos seus dados (ou os arquivos Profile.csv, Positions.csv, Education.csv, Skills.csv).', { tipo: 'warn' });
    }
  };

  renderAll();
})();
