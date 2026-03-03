/**
 * Front-end simples (HTML + JS) integrado ao backend Spring Boot (REST API).
 * Endpoints:
 *  - /api/livros
 *  - /api/clientes
 *  - /api/emprestimos   (usa clienteId, livroId, dataPrevistaDevolucao)
 *  - /api/devolucoes    (usa emprestimoId, dataDevolucao)
 */

const API_BASE = "";

// Helpers
function byId(id){ return document.getElementById(id); }

async function getJSON(path){
  const res = await fetch(API_BASE + path, { headers: { "Accept": "application/json" } });
  if(!res.ok) throw new Error(await res.text());
  return await res.json();
}
async function postJSON(path, body){
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type":"application/json", "Accept":"application/json" },
    body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error(await res.text());
  return await res.json();
}

function fmtDate(d){
  if(!d) return "";
  // backend manda YYYY-MM-DD
  return String(d);
}
function fmtMoney(v){
  if(v === null || v === undefined) return "";
  return Number(v).toFixed(2);
}

// ===== LIVROS =====
async function initLivros(){
  const form = byId("formLivro");
  const lista = byId("listaLivros");
  if(!form || !lista) return;

  async function render(){
    const livros = await getJSON("/api/livros");
    lista.innerHTML = "";
    livros.forEach(l=>{
      const li = document.createElement("li");
      li.textContent = `#${l.id} — ${l.titulo} (${l.autor}) | ${l.genero} | ${l.anoPublicacao} | ${l.statusDisponibilidade}`;
      lista.appendChild(li);
    });
  }

  form.addEventListener("submit", async (e)=>{
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
      await render();
    }catch(err){
      alert("Erro ao cadastrar livro: " + err.message);
    }
  });

  try{ await render(); }catch(err){ console.error(err); }
}

// ===== CLIENTES =====
async function initClientes(){
  const form = byId("formCliente");
  const lista = byId("listaClientes");
  if(!form || !lista) return;

  async function render(){
    const clientes = await getJSON("/api/clientes");
    lista.innerHTML = "";
    clientes.forEach(c=>{
      const li = document.createElement("li");
      li.textContent = `#${c.id} — ${c.nome} | ${c.email} | ${c.telefone} | ${c.statusAcesso}`;
      lista.appendChild(li);
    });
  }

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const payload = {
      nome: byId("nome").value,
      email: byId("email").value,
      telefone: byId("telefone").value
    };
    try{
      await postJSON("/api/clientes", payload);
      form.reset();
      await render();
    }catch(err){
      alert("Erro ao cadastrar cliente: " + err.message);
    }
  });

  try{ await render(); }catch(err){ console.error(err); }
}

// ===== EMPRÉSTIMOS =====
async function initEmprestimos(){
  const form = byId("formEmprestimo");
  const lista = byId("listaEmprestimos");
  if(!form || !lista) return;

  async function render(){
    const emprestimos = await getJSON("/api/emprestimos");
    lista.innerHTML = "";
    emprestimos.forEach(e=>{
      const li = document.createElement("li");
      const cliente = e.cliente ? e.cliente.nome : "—";
      const livro = e.livro ? e.livro.titulo : "—";
      li.textContent = `#${e.id} — Cliente: ${cliente} | Livro: ${livro} | Empréstimo: ${fmtDate(e.dataEmprestimo)} | Prevista: ${fmtDate(e.dataPrevistaDevolucao)} | ${e.statusVigor}`;
      lista.appendChild(li);
    });
  }

  form.addEventListener("submit", async (ev)=>{
    ev.preventDefault();
    const payload = {
      clienteId: Number(byId("idCliente").value),
      livroId: Number(byId("idLivro").value),
      dataPrevistaDevolucao: byId("prevista").value // input type=date manda YYYY-MM-DD
    };
    try{
      await postJSON("/api/emprestimos", payload);
      form.reset();
      await render();
    }catch(err){
      alert("Erro ao registrar empréstimo: " + err.message);
    }
  });

  try{ await render(); }catch(err){ console.error(err); }
}

// ===== DEVOLUÇÕES =====
async function initDevolucoes(){
  const form = byId("formDevolucao");
  const lista = byId("listaDevolucoes");
  if(!form || !lista) return;

  async function render(){
    const devolucoes = await getJSON("/api/devolucoes");
    lista.innerHTML = "";
    devolucoes.forEach(d=>{
      const empId = d.emprestimo ? d.emprestimo.id : "—";
      const livro = (d.emprestimo && d.emprestimo.livro) ? d.emprestimo.livro.titulo : "—";
      const li = document.createElement("li");
      li.textContent = `#${d.id} — Empréstimo: ${empId} | Livro: ${livro} | Devolução: ${fmtDate(d.dataDevolucao)} | Atraso: ${d.qtdeDiasAtraso} dia(s) | Multa: R$ ${fmtMoney(d.valorMulta)}`;
      lista.appendChild(li);
    });
  }

  form.addEventListener("submit", async (ev)=>{
    ev.preventDefault();
    const payload = {
      emprestimoId: Number(byId("idEmprestimo").value),
      dataDevolucao: byId("data").value
    };
    try{
      await postJSON("/api/devolucoes", payload);
      form.reset();
      await render();
    }catch(err){
      alert("Erro ao registrar devolução: " + err.message);
    }
  });

  try{ await render(); }catch(err){ console.error(err); }
}

document.addEventListener("DOMContentLoaded", async ()=>{
  await initLivros();
  await initClientes();
  await initEmprestimos();
  await initDevolucoes();
});
