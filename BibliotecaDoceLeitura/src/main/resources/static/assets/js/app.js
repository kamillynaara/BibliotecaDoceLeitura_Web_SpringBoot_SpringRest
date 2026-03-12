const API_BASE = "";

let livrosCache = [];
let clientesCache = [];
let livroSelecionadoId = null;
let clienteSelecionadoId = null;

function byId(id){ return document.getElementById(id); }

async function getJSON(path){
  const res = await fetch(API_BASE + path, { headers: { "Accept": "application/json" } });
  if(!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function sendJSON(path, method, body){
  const res = await fetch(API_BASE + path, {
    method,
    headers: { "Content-Type":"application/json", "Accept":"application/json" },
    body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function postJSON(path, body){
  return sendJSON(path, "POST", body);
}

async function putJSON(path, body){
  return sendJSON(path, "PUT", body);
}

function fmtDate(d){
  return d ? String(d) : "";
}

function fmtMoney(v){
  if(v === null || v === undefined || v === "") return "R$ 0,00";
  return `R$ ${Number(v).toFixed(2).replace(".", ",")}`;
}

function setError(message, fallback){
  alert(`${fallback}: ${message}`);
}

function setSuccess(message){
  alert(message);
}

function renderTableBody(tbody, rows, emptyMessage){
  if(!tbody) return;
  tbody.innerHTML = "";

  if(!rows.length){
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = tbody.dataset.columns || 1;
    td.className = "empty-state";
    td.textContent = emptyMessage;
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  rows.forEach(cells => {
    const tr = document.createElement("tr");
    cells.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function normalizeText(value){
  return String(value ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function matchesFilter(itemText, filterText){
  return normalizeText(itemText).includes(normalizeText(filterText));
}

async function loadLivrosTable(){
  const tbody = byId("tbodyLivros");
  if(!tbody) return;

  const livros = await getJSON("/api/livros");
  livrosCache = livros;
  renderTableBody(
    tbody,
    livros.map(l => [l.id, l.titulo, l.autor, l.genero, l.anoPublicacao, l.statusDisponibilidade, l.descricao]),
    "Nenhum livro cadastrado."
  );
}

async function loadClientesTable(){
  const tbody = byId("tbodyClientes");
  if(!tbody) return;

  const clientes = await getJSON("/api/clientes");
  clientesCache = clientes;
  renderTableBody(
    tbody,
    clientes.map(c => [c.id, c.nome, c.email, c.telefone, c.statusAcesso]),
    "Nenhum cliente cadastrado."
  );
}

async function loadEmprestimosTable(){
  const tbody = byId("tbodyEmprestimos");
  if(!tbody) return;

  const emprestimos = await getJSON("/api/emprestimos");
  renderTableBody(
    tbody,
    emprestimos.map(e => [
      e.id,
      e.cliente ? e.cliente.nome : "—",
      e.livro ? e.livro.titulo : "—",
      fmtDate(e.dataEmprestimo),
      fmtDate(e.dataPrevistaDevolucao),
      e.statusVigor
    ]),
    "Nenhum empréstimo registrado."
  );
}

async function loadDevolucoesTable(){
  const tbody = byId("tbodyDevolucoes");
  if(!tbody) return;

  const devolucoes = await getJSON("/api/devolucoes");
  renderTableBody(
    tbody,
    devolucoes.map(d => [
      d.id,
      d.emprestimo ? d.emprestimo.id : "—",
      d.emprestimo && d.emprestimo.cliente ? d.emprestimo.cliente.nome : "—",
      d.emprestimo && d.emprestimo.livro ? d.emprestimo.livro.titulo : "—",
      fmtDate(d.dataDevolucao),
      d.qtdeDiasAtraso ?? 0,
      fmtMoney(d.valorMulta)
    ]),
    "Nenhuma devolução registrada."
  );
}

function renderEditableLivrosTable(livros){
  const tbody = byId("tbodyEditarLivros");
  if(!tbody) return;
  tbody.innerHTML = "";

  if(!livros.length){
    renderTableBody(tbody, [], "Nenhum livro encontrado.");
    return;
  }

  livros.forEach(livro => {
    const tr = document.createElement("tr");
    tr.className = "clickable-row";
    if(String(livro.id) === String(livroSelecionadoId)) tr.classList.add("selected-row");
    tr.innerHTML = `
      <td>${livro.id ?? ""}</td>
      <td>${livro.titulo ?? ""}</td>
      <td>${livro.autor ?? ""}</td>
      <td>${livro.genero ?? ""}</td>
      <td>${livro.anoPublicacao ?? ""}</td>
      <td>${livro.statusDisponibilidade ?? ""}</td>
    `;
    tr.addEventListener("click", () => selecionarLivro(livro.id));
    tbody.appendChild(tr);
  });
}

function renderEditableClientesTable(clientes){
  const tbody = byId("tbodyEditarClientes");
  if(!tbody) return;
  tbody.innerHTML = "";

  if(!clientes.length){
    renderTableBody(tbody, [], "Nenhum cliente encontrado.");
    return;
  }

  clientes.forEach(cliente => {
    const tr = document.createElement("tr");
    tr.className = "clickable-row";
    if(String(cliente.id) === String(clienteSelecionadoId)) tr.classList.add("selected-row");
    tr.innerHTML = `
      <td>${cliente.id ?? ""}</td>
      <td>${cliente.nome ?? ""}</td>
      <td>${cliente.email ?? ""}</td>
      <td>${cliente.telefone ?? ""}</td>
      <td>${cliente.statusAcesso ?? ""}</td>
    `;
    tr.addEventListener("click", () => selecionarCliente(cliente.id));
    tbody.appendChild(tr);
  });
}

function filtrarLivrosEdicao(){
  const busca = byId("buscaLivro");
  if(!busca) return;
  const termo = busca.value;
  const filtrados = livrosCache.filter(l => matchesFilter(l.id, termo) || matchesFilter(l.titulo, termo));
  renderEditableLivrosTable(filtrados);
}

function filtrarClientesEdicao(){
  const busca = byId("buscaCliente");
  if(!busca) return;
  const termo = busca.value;
  const filtrados = clientesCache.filter(c => matchesFilter(c.id, termo) || matchesFilter(c.nome, termo));
  renderEditableClientesTable(filtrados);
}

function selecionarLivro(id){
  const livro = livrosCache.find(l => String(l.id) === String(id));
  if(!livro) return;
  livroSelecionadoId = livro.id;
  byId("editLivroId").value = livro.id ?? "";
  byId("editTitulo").value = livro.titulo ?? "";
  byId("editAutor").value = livro.autor ?? "";
  byId("editGenero").value = livro.genero ?? "";
  byId("editAno").value = livro.anoPublicacao ?? "";
  byId("editStatusLivro").value = livro.statusDisponibilidade ?? "";
  byId("editDescricao").value = livro.descricao ?? "";
  filtrarLivrosEdicao();
}

function selecionarCliente(id){
  const cliente = clientesCache.find(c => String(c.id) === String(id));
  if(!cliente) return;
  clienteSelecionadoId = cliente.id;
  byId("editClienteId").value = cliente.id ?? "";
  byId("editNome").value = cliente.nome ?? "";
  byId("editEmail").value = cliente.email ?? "";
  byId("editTelefone").value = cliente.telefone ?? "";
  byId("editStatusCliente").value = cliente.statusAcesso ?? "";
  filtrarClientesEdicao();
}

async function initLivros(){
  const form = byId("formLivro");
  if(!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      titulo: byId("titulo").value,
      autor: byId("autor").value,
      genero: byId("genero").value,
      anoPublicacao: byId("ano").value,
      descricao: byId("descricao").value
    };

    try{
      await postJSON("/api/livros", payload);
      form.reset();
      setSuccess("Livro cadastrado com sucesso.");
      await loadLivrosTable();
    }catch(err){
      setError(err.message, "Erro ao cadastrar livro");
    }
  });
}

async function initClientes(){
  const form = byId("formCliente");
  if(!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      nome: byId("nome").value,
      email: byId("email").value,
      telefone: byId("telefone").value
    };

    try{
      await postJSON("/api/clientes", payload);
      form.reset();
      setSuccess("Cliente cadastrado com sucesso.");
      await loadClientesTable();
    }catch(err){
      setError(err.message, "Erro ao cadastrar cliente");
    }
  });
}

async function initEmprestimos(){
  const form = byId("formEmprestimo");
  if(!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      clienteId: Number(byId("idCliente").value),
      livroId: Number(byId("idLivro").value),
      dataPrevistaDevolucao: byId("prevista").value
    };

    try{
      await postJSON("/api/emprestimos", payload);
      form.reset();
      setSuccess("Empréstimo registrado com sucesso.");
    }catch(err){
      setError(err.message, "Erro ao registrar empréstimo");
    }
  });
}

async function initDevolucoes(){
  const form = byId("formDevolucao");
  if(!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      emprestimoId: Number(byId("idEmprestimo").value),
      dataDevolucao: byId("data").value
    };

    try{
      await postJSON("/api/devolucoes", payload);
      form.reset();
      setSuccess("Devolução registrada com sucesso.");
      await loadDevolucoesTable();
      await loadEmprestimosTable();
      await loadLivrosTable();
    }catch(err){
      setError(err.message, "Erro ao registrar devolução");
    }
  });
}

async function initEditarLivros(){
  const form = byId("formEditarLivro");
  const busca = byId("buscaLivro");
  if(!form) return;

  try{
    livrosCache = await getJSON("/api/livros");
    renderEditableLivrosTable(livrosCache);
  }catch(err){
    setError(err.message, "Erro ao carregar livros para edição");
  }

  if(busca){
    busca.addEventListener("input", filtrarLivrosEdicao);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if(!livroSelecionadoId){
      alert("Selecione um livro na tabela para editar.");
      return;
    }

    const payload = {
      titulo: byId("editTitulo").value,
      autor: byId("editAutor").value,
      genero: byId("editGenero").value,
      anoPublicacao: byId("editAno").value,
      descricao: byId("editDescricao").value,
      statusDisponibilidade: byId("editStatusLivro").value
    };

    try{
      await putJSON(`/api/livros/${livroSelecionadoId}`, payload);
      setSuccess("Livro atualizado com sucesso.");
      livrosCache = await getJSON("/api/livros");
      filtrarLivrosEdicao();
      selecionarLivro(livroSelecionadoId);
    }catch(err){
      setError(err.message, "Erro ao editar livro");
    }
  });
}

async function initEditarClientes(){
  const form = byId("formEditarCliente");
  const busca = byId("buscaCliente");
  if(!form) return;

  try{
    clientesCache = await getJSON("/api/clientes");
    renderEditableClientesTable(clientesCache);
  }catch(err){
    setError(err.message, "Erro ao carregar clientes para edição");
  }

  if(busca){
    busca.addEventListener("input", filtrarClientesEdicao);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if(!clienteSelecionadoId){
      alert("Selecione um cliente na tabela para editar.");
      return;
    }

    const payload = {
      nome: byId("editNome").value,
      email: byId("editEmail").value,
      telefone: byId("editTelefone").value,
      statusAcesso: byId("editStatusCliente").value
    };

    try{
      await putJSON(`/api/clientes/${clienteSelecionadoId}`, payload);
      setSuccess("Cliente atualizado com sucesso.");
      clientesCache = await getJSON("/api/clientes");
      filtrarClientesEdicao();
      selecionarCliente(clienteSelecionadoId);
    }catch(err){
      setError(err.message, "Erro ao editar cliente");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await initLivros();
  await initClientes();
  await initEmprestimos();
  await initDevolucoes();
  await initEditarLivros();
  await initEditarClientes();

  try{ await loadLivrosTable(); }catch(err){ console.error(err); }
  try{ await loadClientesTable(); }catch(err){ console.error(err); }
  try{ await loadEmprestimosTable(); }catch(err){ console.error(err); }
  try{ await loadDevolucoesTable(); }catch(err){ console.error(err); }
});
