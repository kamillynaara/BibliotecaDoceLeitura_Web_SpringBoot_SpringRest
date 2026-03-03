package br.com.doceleitura.web.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDate;

import br.com.doceleitura.web.repo.*;
import br.com.doceleitura.web.domain.*;
import br.com.doceleitura.web.dto.EmprestimoRequest;

@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimoController {
    private final EmprestimoRepository repo;
    private final LivroRepository livros;
    private final ClienteRepository clientes;

    public EmprestimoController(EmprestimoRepository repo, LivroRepository livros, ClienteRepository clientes){
        this.repo = repo;
        this.livros = livros;
        this.clientes = clientes;
    }

    @GetMapping
    public List<Emprestimo> all(){
        return repo.findAll();
    }

    @PostMapping
    public Emprestimo create(@RequestBody EmprestimoRequest req){
        Cliente c = clientes.findById(req.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + req.getClienteId()));

        Livro l = livros.findById(req.getLivroId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado: " + req.getLivroId()));

        Emprestimo e = new Emprestimo();
        e.setCliente(c);
        e.setLivro(l);

        if(req.getDataPrevistaDevolucao() != null && !req.getDataPrevistaDevolucao().isBlank()){
            e.setDataPrevistaDevolucao(LocalDate.parse(req.getDataPrevistaDevolucao()));
        }

        // Atualiza status do livro
        l.setStatusDisponibilidade("Emprestado");
        livros.save(l);

        return repo.save(e);
    }
}
