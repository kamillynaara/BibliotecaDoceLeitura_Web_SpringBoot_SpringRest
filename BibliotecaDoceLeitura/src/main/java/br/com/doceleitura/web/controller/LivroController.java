package br.com.doceleitura.web.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import br.com.doceleitura.web.repo.*;
import br.com.doceleitura.web.domain.*;

@RestController
@RequestMapping("/api/livros")
public class LivroController {
    private final LivroRepository repo;
    public LivroController(LivroRepository repo){ this.repo = repo; }
    @GetMapping public List<Livro> all(){ return repo.findAll(); }
    @PostMapping public Livro create(@RequestBody Livro l){ return repo.save(l); }

    @PutMapping("/{id}")
    public Livro update(@PathVariable Integer id, @RequestBody Livro dados){
        return repo.findById(id).map(existente -> {
            existente.setTitulo(dados.getTitulo());
            existente.setAutor(dados.getAutor());
            existente.setGenero(dados.getGenero());
            existente.setAnoPublicacao(dados.getAnoPublicacao());
            existente.setDescricao(dados.getDescricao());
            existente.setStatusDisponibilidade(dados.getStatusDisponibilidade());
            return repo.save(existente);
        }).orElseThrow(() -> new RuntimeException("Registro não encontrado: " + id));
    }
}
