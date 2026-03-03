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
}
