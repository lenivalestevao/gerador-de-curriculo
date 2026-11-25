/* Gerador de Currículo — JavaScript puro, sem dependências.
 * Tudo roda no navegador: os dados ficam no localStorage e nunca são enviados a servidor algum. */
(() => {
  'use strict';

  const KEY = 'gerador-curriculo:v1';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const TEMPLATES = [
    ['classico'], ['moderno'], ['minimalista'], ['executivo'], ['criativo'], ['compacto']
  ];

  // ---------- idiomas (interface + títulos do currículo) ----------
  const I18N = {
    pt: {
      title: 'Gerador de Currículo — 6 modelos, PDF grátis',
      desc: 'Gerador de currículo gratuito: preencha, escolha entre 6 modelos e baixe em PDF. Tudo no seu navegador, seus dados não saem do seu computador.',
      brandTitle: 'Gerador de Currículo',
      brandSub: '6 modelos · PDF com texto selecionável (bom para ATS) · seus dados ficam só no seu navegador',
      langAria: 'Idioma / Language / Idioma',
      btnLinkedin: 'Importar do LinkedIn', linkedinTitle: 'Envie o ZIP da cópia dos seus dados do LinkedIn',
      btnExemplo: 'Carregar exemplo', btnLimpar: 'Limpar', btnExportar: 'Salvar dados (.json)', btnAbrir: 'Abrir dados', btnPdf: 'Baixar PDF',
      panelAria: 'Edição do currículo', previewAria: 'Prévia do currículo',
      modelo: 'Modelo', modeloAria: 'Modelo do currículo', cor: 'Cor', tamanho: 'Tamanho da letra',
      dadosH: 'Dados pessoais', nome: 'Nome completo', cargo: 'Cargo desejado', cargoPh: 'Ex.: Desenvolvedor Full Stack',
      email: 'E-mail', telefone: 'Telefone', cidade: 'Cidade / Estado', linkedin: 'LinkedIn', linkedinPh: 'linkedin.com/in/seu-usuario',
      site: 'Site / GitHub / Portfólio', sitePh: 'github.com/seu-usuario',
      resumoH: 'Resumo profissional', resumoLbl: 'Em 2 ou 3 linhas, quem você é e o que busca',
      expH: 'Experiência profissional', addExp: '+ Adicionar experiência',
      formH: 'Formação acadêmica', addForm: '+ Adicionar formação',
      habIdiH: 'Habilidades e idiomas', habLbl: 'Habilidades (separe por vírgula ou linha)', habPh: 'JavaScript, PHP, SQL, Git',
      idiLbl: 'Idiomas (separe por vírgula ou linha)', idiPh: 'Português (nativo), Inglês (intermediário)',
      cursosH: 'Cursos e certificados', addCurso: '+ Adicionar curso',
      dica: 'Dica: para o PDF, na janela de impressão escolha <strong>“Salvar como PDF”</strong>, papel <strong>A4</strong> e desligue “Cabeçalhos e rodapés”.',
      tpl_classico: 'Clássico', tpl_moderno: 'Moderno', tpl_minimalista: 'Minimalista', tpl_executivo: 'Executivo', tpl_criativo: 'Criativo', tpl_compacto: 'Compacto',
      fCargo: 'Cargo', fEmpresa: 'Empresa', fPeriodo: 'Período', phExp: 'Jan/2022 – atual', fDesc: 'Atividades e resultados (uma por linha)',
      fCurso: 'Curso / grau', fInst: 'Instituição', phForm: '2018 – 2022', fCursoNome: 'Curso ou certificado', fAno: 'Ano',
      up: 'Mover para cima', down: 'Mover para baixo', del: 'Remover', undo: 'Desfazer',
      pages1: 'O currículo ocupa 1 página A4.', pagesN: 'O currículo ocupa {n} páginas A4. Para caber em 1, reduza o tamanho da letra ou o texto.',
      msgExemplo: 'Exemplo carregado.', msgLimpo: 'Currículo limpo.', msgAberto: 'Dados abertos.',
      errJson: 'Não consegui ler esse arquivo. Use um .json salvo por este gerador.',
      msgLi: 'Dados do LinkedIn importados. Confira os textos e ajuste o que quiser.',
      errLi: 'Não encontrei dados do LinkedIn nesses arquivos. Envie o ZIP da cópia dos seus dados (ou os arquivos Profile.csv, Positions.csv, Education.csv, Skills.csv).',
      pdfTitle: 'Curriculo', semNome: 'sem nome', atual: 'atual'
    },
    en: {
      title: 'Resume Builder — 6 templates, free PDF',
      desc: 'Free resume builder: fill in your details, pick one of 6 templates and download a PDF. Everything runs in your browser; your data never leaves your computer.',
      brandTitle: 'Resume Builder',
      brandSub: '6 templates · PDF with selectable text (ATS friendly) · your data stays in your browser',
      langAria: 'Idioma / Language / Idioma',
      btnLinkedin: 'Import from LinkedIn', linkedinTitle: 'Upload the ZIP of your LinkedIn data export',
      btnExemplo: 'Load example', btnLimpar: 'Clear', btnExportar: 'Save data (.json)', btnAbrir: 'Open data', btnPdf: 'Download PDF',
      panelAria: 'Resume editor', previewAria: 'Resume preview',
      modelo: 'Template', modeloAria: 'Resume template', cor: 'Color', tamanho: 'Font size',
      dadosH: 'Personal details', nome: 'Full name', cargo: 'Target job title', cargoPh: 'e.g. Full Stack Developer',
      email: 'Email', telefone: 'Phone', cidade: 'City / State', linkedin: 'LinkedIn', linkedinPh: 'linkedin.com/in/your-name',
      site: 'Website / GitHub / Portfolio', sitePh: 'github.com/your-name',
      resumoH: 'Professional summary', resumoLbl: 'In 2 or 3 lines, who you are and what you are looking for',
      expH: 'Work experience', addExp: '+ Add experience',
      formH: 'Education', addForm: '+ Add education',
      habIdiH: 'Skills and languages', habLbl: 'Skills (separate with commas or new lines)', habPh: 'JavaScript, PHP, SQL, Git',
      idiLbl: 'Languages (separate with commas or new lines)', idiPh: 'Portuguese (native), English (intermediate)',
      cursosH: 'Courses and certifications', addCurso: '+ Add course',
      dica: 'Tip: for the PDF, in the print window choose <strong>“Save as PDF”</strong>, paper size <strong>A4</strong> (or Letter) and turn off “Headers and footers”.',
      tpl_classico: 'Classic', tpl_moderno: 'Modern', tpl_minimalista: 'Minimalist', tpl_executivo: 'Executive', tpl_criativo: 'Creative', tpl_compacto: 'Compact',
      fCargo: 'Job title', fEmpresa: 'Company', fPeriodo: 'Period', phExp: 'Jan 2022 – Present', fDesc: 'Duties and achievements (one per line)',
      fCurso: 'Degree / program', fInst: 'School', phForm: '2018 – 2022', fCursoNome: 'Course or certification', fAno: 'Year',
      up: 'Move up', down: 'Move down', del: 'Remove', undo: 'Undo',
      pages1: 'The resume fits on 1 A4 page.', pagesN: 'The resume takes {n} A4 pages. To fit on 1, reduce the font size or the text.',
      msgExemplo: 'Example loaded.', msgLimpo: 'Resume cleared.', msgAberto: 'Data opened.',
      errJson: 'I could not read that file. Use a .json saved by this builder.',
      msgLi: 'LinkedIn data imported. Review the text and adjust what you like.',
      errLi: 'I did not find LinkedIn data in those files. Upload the ZIP of your data export (or the files Profile.csv, Positions.csv, Education.csv, Skills.csv).',
      pdfTitle: 'Resume', semNome: 'no name', atual: 'Present'
    },
    es: {
      title: 'Generador de Currículum — 6 plantillas, PDF gratis',
      desc: 'Generador de currículum gratuito: completa tus datos, elige entre 6 plantillas y descarga el PDF. Todo en tu navegador, tus datos no salen de tu computadora.',
      brandTitle: 'Generador de Currículum',
      brandSub: '6 plantillas · PDF con texto seleccionable (apto para ATS) · tus datos quedan solo en tu navegador',
      langAria: 'Idioma / Language / Idioma',
      btnLinkedin: 'Importar de LinkedIn', linkedinTitle: 'Sube el ZIP con la copia de tus datos de LinkedIn',
      btnExemplo: 'Cargar ejemplo', btnLimpar: 'Limpiar', btnExportar: 'Guardar datos (.json)', btnAbrir: 'Abrir datos', btnPdf: 'Descargar PDF',
      panelAria: 'Edición del currículum', previewAria: 'Vista previa del currículum',
      modelo: 'Plantilla', modeloAria: 'Plantilla del currículum', cor: 'Color', tamanho: 'Tamaño de letra',
      dadosH: 'Datos personales', nome: 'Nombre completo', cargo: 'Puesto deseado', cargoPh: 'Ej.: Desarrollador Full Stack',
      email: 'Correo electrónico', telefone: 'Teléfono', cidade: 'Ciudad / Estado', linkedin: 'LinkedIn', linkedinPh: 'linkedin.com/in/tu-usuario',
      site: 'Sitio web / GitHub / Portafolio', sitePh: 'github.com/tu-usuario',
      resumoH: 'Resumen profesional', resumoLbl: 'En 2 o 3 líneas, quién eres y qué buscas',
      expH: 'Experiencia laboral', addExp: '+ Agregar experiencia',
      formH: 'Formación académica', addForm: '+ Agregar formación',
      habIdiH: 'Habilidades e idiomas', habLbl: 'Habilidades (separa con comas o líneas)', habPh: 'JavaScript, PHP, SQL, Git',
      idiLbl: 'Idiomas (separa con comas o líneas)', idiPh: 'Español (nativo), Inglés (intermedio)',
      cursosH: 'Cursos y certificados', addCurso: '+ Agregar curso',
      dica: 'Consejo: para el PDF, en la ventana de impresión elige <strong>“Guardar como PDF”</strong>, papel <strong>A4</strong> (o Carta) y desactiva “Encabezados y pies de página”.',
      tpl_classico: 'Clásico', tpl_moderno: 'Moderno', tpl_minimalista: 'Minimalista', tpl_executivo: 'Ejecutivo', tpl_criativo: 'Creativo', tpl_compacto: 'Compacto',
      fCargo: 'Puesto', fEmpresa: 'Empresa', fPeriodo: 'Período', phExp: 'Ene 2022 – actual', fDesc: 'Actividades y logros (una por línea)',
      fCurso: 'Carrera / título', fInst: 'Institución', phForm: '2018 – 2022', fCursoNome: 'Curso o certificado', fAno: 'Año',
      up: 'Subir', down: 'Bajar', del: 'Eliminar', undo: 'Deshacer',
      pages1: 'El currículum ocupa 1 página A4.', pagesN: 'El currículum ocupa {n} páginas A4. Para que quepa en 1, reduce el tamaño de letra o el texto.',
      msgExemplo: 'Ejemplo cargado.', msgLimpo: 'Currículum limpio.', msgAberto: 'Datos abiertos.',
      errJson: 'No pude leer ese archivo. Usa un .json guardado por este generador.',
      msgLi: 'Datos de LinkedIn importados. Revisa los textos y ajusta lo que quieras.',
      errLi: 'No encontré datos de LinkedIn en esos archivos. Sube el ZIP de la copia de tus datos (o los archivos Profile.csv, Positions.csv, Education.csv, Skills.csv).',
      pdfTitle: 'Curriculum', semNome: 'sin nombre', atual: 'actual'
    }
  };

  const LABELS = {
    pt: { contato: 'Contato', habilidades: 'Habilidades', idiomas: 'Idiomas', resumo: 'Resumo profissional', experiencia: 'Experiência profissional', formacao: 'Formação acadêmica', cursos: 'Cursos e certificados', nome: 'Seu Nome' },
    en: { contato: 'Contact', habilidades: 'Skills', idiomas: 'Languages', resumo: 'Professional summary', experiencia: 'Professional experience', formacao: 'Education', cursos: 'Courses and certifications', nome: 'Your Name' },
    es: { contato: 'Contacto', habilidades: 'Habilidades', idiomas: 'Idiomas', resumo: 'Resumen profesional', experiencia: 'Experiencia profesional', formacao: 'Formación académica', cursos: 'Cursos y certificados', nome: 'Tu Nombre' }
  };

  const LISTS = {
    experiencias: {
      vazio: { cargo: '', empresa: '', periodo: '', descricao: '' },
      campos: [
        ['cargo', 'fCargo', 'input'], ['empresa', 'fEmpresa', 'input'],
        ['periodo', 'fPeriodo', 'input', 'phExp'],
        ['descricao', 'fDesc', 'textarea']
      ]
    },
    formacoes: {
      vazio: { curso: '', instituicao: '', periodo: '' },
      campos: [
        ['curso', 'fCurso', 'input'], ['instituicao', 'fInst', 'input'],
        ['periodo', 'fPeriodo', 'input', 'phForm']
      ]
    },
    cursos: {
      vazio: { nome: '', instituicao: '', ano: '' },
      campos: [
        ['nome', 'fCursoNome', 'input'], ['instituicao', 'fInst', 'input'],
        ['ano', 'fAno', 'input', 'phForm']
      ]
    }
  };

  const VAZIO = {
    nome: '', cargo: '', email: '', telefone: '', cidade: '', linkedin: '', site: '', resumo: '',
    experiencias: [], formacoes: [], habilidades: '', idiomas: '', cursos: []
  };

  const EXEMPLOS = {
    pt: {
      nome: 'Camila Ribeiro', cargo: 'Desenvolvedora Full Stack', email: 'camila.ribeiro@email.com', telefone: '(81) 90000-0000',
      cidade: 'Recife, PE', linkedin: 'linkedin.com/in/camila-ribeiro', site: 'github.com/camila-ribeiro',
      resumo: 'Desenvolvedora com 6 anos de experiência em aplicações web e APIs, do banco de dados à interface. Foco em código limpo, testes e entregas que melhoram a rotina de quem usa o sistema.',
      experiencias: [
        { cargo: 'Desenvolvedora Full Stack Sênior', empresa: 'Tecnologia Exemplo Ltda.', periodo: 'Mar/2022 – atual',
          descricao: 'Liderei a migração de um sistema legado em PHP para uma API em .NET, reduzindo o tempo de resposta em 40%\nCriei o painel de relatórios em React usado por 300 clientes\nMentoria de 3 desenvolvedores júnior e revisão de código do time' },
        { cargo: 'Desenvolvedora Pleno', empresa: 'Soluções Digitais S.A.', periodo: 'Jan/2020 – Fev/2022',
          descricao: 'Desenvolvi módulos de cobrança e emissão de notas fiscais\nAutomatizei testes e publicações, cortando o tempo de entrega de 2 dias para 2 horas' },
        { cargo: 'Desenvolvedora Júnior', empresa: 'Agência Web Criativa', periodo: 'Jun/2018 – Dez/2019',
          descricao: 'Sites e lojas virtuais em PHP, MySQL e JavaScript\nAtendimento direto aos clientes para levantar requisitos' }
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
    },
    en: {
      nome: 'Camila Ribeiro', cargo: 'Full Stack Developer', email: 'camila.ribeiro@email.com', telefone: '(81) 90000-0000',
      cidade: 'Recife, PE', linkedin: 'linkedin.com/in/camila-ribeiro', site: 'github.com/camila-ribeiro',
      resumo: 'Developer with 6 years of experience in web applications and APIs, from the database to the interface. Focused on clean code, testing and deliveries that make life easier for the people who use the system.',
      experiencias: [
        { cargo: 'Senior Full Stack Developer', empresa: 'Example Technology Ltd.', periodo: 'Mar 2022 – Present',
          descricao: 'Led the migration of a legacy PHP system to a .NET API, cutting response time by 40%\nBuilt the React reporting dashboard used by 300 customers\nMentored 3 junior developers and reviewed the team’s code' },
        { cargo: 'Mid-level Developer', empresa: 'Digital Solutions Inc.', periodo: 'Jan 2020 – Feb 2022',
          descricao: 'Developed billing and invoice issuing modules\nAutomated tests and releases, cutting delivery time from 2 days to 2 hours' },
        { cargo: 'Junior Developer', empresa: 'Creative Web Agency', periodo: 'Jun 2018 – Dec 2019',
          descricao: 'Websites and online stores in PHP, MySQL and JavaScript\nWorked directly with clients to gather requirements' }
      ],
      formacoes: [
        { curso: 'Bachelor’s Degree in Information Systems', instituicao: 'Federal University of Pernambuco', periodo: '2014 – 2018' },
        { curso: 'Postgraduate Certificate in Software Architecture', instituicao: 'Institute of Technology', periodo: '2021 – 2022' }
      ],
      habilidades: 'JavaScript, TypeScript, React, Node.js, C# / .NET, PHP, SQL Server, PostgreSQL, Git, Docker, Automated testing',
      idiomas: 'Portuguese (native), English (advanced), Spanish (basic)',
      cursos: [
        { nome: 'AWS Certified Cloud Practitioner', instituicao: 'Amazon Web Services', ano: '2023' },
        { nome: 'Scrum Foundation', instituicao: 'Scrum Alliance', ano: '2021' }
      ]
    },
    es: {
      nome: 'Camila Ribeiro', cargo: 'Desarrolladora Full Stack', email: 'camila.ribeiro@email.com', telefone: '(81) 90000-0000',
      cidade: 'Recife, PE', linkedin: 'linkedin.com/in/camila-ribeiro', site: 'github.com/camila-ribeiro',
      resumo: 'Desarrolladora con 6 años de experiencia en aplicaciones web y APIs, de la base de datos a la interfaz. Enfocada en código limpio, pruebas y entregas que mejoran el día a día de quienes usan el sistema.',
      experiencias: [
        { cargo: 'Desarrolladora Full Stack Senior', empresa: 'Tecnología Ejemplo S.A.', periodo: 'Mar 2022 – actual',
          descricao: 'Lideré la migración de un sistema heredado en PHP a una API en .NET, reduciendo el tiempo de respuesta en un 40%\nCreé el panel de reportes en React usado por 300 clientes\nMentoría de 3 desarrolladores junior y revisión de código del equipo' },
        { cargo: 'Desarrolladora Semi Senior', empresa: 'Soluciones Digitales S.A.', periodo: 'Ene 2020 – Feb 2022',
          descricao: 'Desarrollé módulos de facturación y emisión de comprobantes\nAutomaticé pruebas y publicaciones, reduciendo el tiempo de entrega de 2 días a 2 horas' },
        { cargo: 'Desarrolladora Junior', empresa: 'Agencia Web Creativa', periodo: 'Jun 2018 – Dic 2019',
          descricao: 'Sitios web y tiendas en línea en PHP, MySQL y JavaScript\nAtención directa a los clientes para levantar requisitos' }
      ],
      formacoes: [
        { curso: 'Licenciatura en Sistemas de Información', instituicao: 'Universidad Federal de Pernambuco', periodo: '2014 – 2018' },
        { curso: 'Posgrado en Arquitectura de Software', instituicao: 'Instituto de Tecnología', periodo: '2021 – 2022' }
      ],
      habilidades: 'JavaScript, TypeScript, React, Node.js, C# / .NET, PHP, SQL Server, PostgreSQL, Git, Docker, Pruebas automatizadas',
      idiomas: 'Portugués (nativo), Inglés (avanzado), Español (básico)',
      cursos: [
        { nome: 'AWS Certified Cloud Practitioner', instituicao: 'Amazon Web Services', ano: '2023' },
        { nome: 'Scrum Foundation', instituicao: 'Scrum Alliance', ano: '2021' }
      ]
    }
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
  const navLang = String(navigator.language || 'pt').slice(0, 2).toLowerCase();
  const cfg = Object.assign({ tpl: 'classico', lang: I18N[navLang] ? navLang : 'pt', accent: '#1f4e79', fs: 10.5 }, saved && saved.cfg);
  if (!TEMPLATES.some((t) => t[0] === cfg.tpl)) cfg.tpl = 'classico';
  if (!I18N[cfg.lang]) cfg.lang = 'pt';
  const state = { data: saved && saved.data ? normalize(saved.data) : clone(EXEMPLOS[cfg.lang]) };
  const t = (k, n) => {
    const s = (I18N[cfg.lang] && I18N[cfg.lang][k]) || I18N.pt[k] || k;
    return n === undefined ? s : s.replace('{n}', n);
  };

  // aplica o idioma aos textos fixos da página
  function applyStatic() {
    document.documentElement.lang = cfg.lang === 'pt' ? 'pt-BR' : cfg.lang;
    document.title = t('title');
    const md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('desc'));
    $$('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
    $$('[data-html]').forEach((el) => { el.innerHTML = t(el.dataset.html); });
    $$('[data-ph]').forEach((el) => { el.placeholder = t(el.dataset.ph); });
    $$('[data-title]').forEach((el) => { el.title = t(el.dataset.title); });
    $$('[data-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.aria)); });
  }
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
    const L = LABELS[cfg.lang];
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
      sec('contato', L.contato, contatos.length ? `<ul class="lista">${contatos.map((c) => `<li>${c}</li>`).join('')}</ul>` : '') +
      sec('habilidades', L.habilidades, hab.length ? `<ul class="chips">${hab.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '') +
      sec('idiomas', L.idiomas, idi.length ? `<ul class="chips">${idi.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');

    const main =
      `<header data-s="header"><h1>${esc(d.nome || L.nome)}</h1>${d.cargo ? `<p class="cargo">${esc(d.cargo)}</p>` : ''}</header>` +
      sec('resumo', L.resumo, d.resumo.trim() ? `<p>${esc(d.resumo.trim())}</p>` : '') +
      sec('experiencia', L.experiencia, exp) +
      sec('formacao', L.formacao, form) +
      sec('cursos', L.cursos, cur);

    cv.innerHTML = `<div class="cv-side">${side}</div><div class="cv-main">${main}</div>`;
    fit();
  }

  // ---------- prévia em escala ----------
  function fit() {
    const cv = $('#cv'), box = $('#scaleBox'), pv = $('#preview');
    cv.style.transform = 'none';
    cv.style.minHeight = '';
    const pageH = 297 * 96 / 25.4;
    const pages = Math.max(1, Math.ceil(cv.offsetHeight / pageH - 0.001));
    // sempre páginas A4 inteiras (a faixa colorida dos modelos com barra lateral vai até o fim)
    cv.style.minHeight = `${pages * 297 - 1}mm`;
    const cvW = cv.offsetWidth, cvH = cv.offsetHeight;
    const s = Math.min(1, pv.clientWidth / cvW);
    cv.style.transform = `scale(${s})`;
    box.style.width = cvW * s + 'px';
    box.style.height = cvH * s + 'px';
    $('#pagesInfo').textContent = pages === 1
      ? t('pages1')
      : t('pagesN', pages);
  }

  // ---------- formulário ----------
  function renderPills() {
    $('#pills').innerHTML = TEMPLATES.map(([id]) =>
      `<button type="button" class="pill" role="radio" aria-checked="${id === cfg.tpl}" data-tpl="${id}">${t('tpl_' + id)}</button>`).join('');
  }

  function fieldHTML(lista, i, [f, rotulo, tipo, ph], valor) {
    const attrs = `data-f="${f}"${ph ? ` placeholder="${esc(t(ph))}"` : ''}`;
    const campo = tipo === 'textarea'
      ? `<textarea ${attrs} rows="4">${esc(valor)}</textarea>`
      : `<input ${attrs} value="${esc(valor)}">`;
    return `<label>${t(rotulo)} ${campo}</label>`;
  }

  function renderLists() {
    for (const [nome, def] of Object.entries(LISTS)) {
      const itens = state.data[nome];
      $('#list-' + nome).innerHTML = itens.map((it, i) => `
        <div class="item-card" data-list="${nome}" data-i="${i}">
          ${def.campos.map((c) => fieldHTML(nome, i, c, it[c[0]])).join('')}
          <div class="item-tools">
            <button type="button" class="btn small" data-act="up" ${i === 0 ? 'disabled' : ''} aria-label="${esc(t('up'))}">↑</button>
            <button type="button" class="btn small" data-act="down" ${i === itens.length - 1 ? 'disabled' : ''} aria-label="${esc(t('down'))}">↓</button>
            <button type="button" class="btn small danger" data-act="del">${t('del')}</button>
          </div>
        </div>`).join('');
    }
  }

  function fillStatic() {
    $$('[data-k]').forEach((el) => { el.value = state.data[el.dataset.k] || ''; });
    $('#accent').value = cfg.accent;
    $('#lang').value = cfg.lang;
    $('#fs').value = cfg.fs;
    $('#fsOut').textContent = String(cfg.fs).replace('.', cfg.lang === 'en' ? '.' : ',');
  }

  function renderAll() {
    applyStatic(); fillStatic(); renderPills(); renderLists(); renderCV();
  }

  // ---------- avisos e desfazer ----------
  function aviso(texto, { desfazer = false, tipo = '' } = {}) {
    const m = $('#msg');
    m.innerHTML = `<div class="notice ${tipo}">${esc(texto)} ${desfazer ? '<button type="button" class="btn small" id="btnDesfazer">' + esc(t('undo')) + '</button>' : ''}</div>`;
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

  $('#lang').addEventListener('change', (e) => { cfg.lang = e.target.value; save(); $('#msg').innerHTML = ''; renderAll(); });
  $('#accent').addEventListener('input', (e) => { cfg.accent = e.target.value; save(); renderCV(); });
  $('#fs').addEventListener('input', (e) => {
    cfg.fs = parseFloat(e.target.value);
    $('#fsOut').textContent = String(cfg.fs).replace('.', cfg.lang === 'en' ? '.' : ',');
    save(); renderCV();
  });

  $('#btnExemplo').onclick = () => trocarDados(EXEMPLOS[cfg.lang], t('msgExemplo'));
  $('#btnLimpar').onclick = () => trocarDados(VAZIO, t('msgLimpo'));

  // PDF: a impressão do navegador gera PDF com texto de verdade (selecionável e legível por ATS)
  $('#btnPdf').onclick = () => {
    document.title = t('pdfTitle') + ' - ' + (state.data.nome || t('semNome'));
    window.print();
  };
  window.addEventListener('afterprint', () => { document.title = t('title'); });

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
      if (j.cfg && TEMPLATES.some((t) => t[0] === j.cfg.tpl)) Object.assign(cfg, { tpl: j.cfg.tpl, lang: LABELS[j.cfg.lang] ? j.cfg.lang : cfg.lang, accent: j.cfg.accent || cfg.accent, fs: j.cfg.fs || cfg.fs });
      trocarDados(j.data || j, t('msgAberto'));
    } catch { aviso(t('errJson'), { tipo: 'warn' }); }
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
    return `${ini || ''} – ${fim || t('atual')}`.trim();
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
      trocarDados(dados, t('msgLi'));
    } catch {
      aviso(t('errLi'), { tipo: 'warn' });
    }
  };

  renderAll();
})();
