package br.com.doceleitura.web.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import br.com.doceleitura.web.repo.*;
import br.com.doceleitura.web.domain.*;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    private final ClienteRepository repo;
    public ClienteController(ClienteRepository repo){ this.repo = repo; }
    @GetMapping public List<Cliente> all(){ return repo.findAll(); }
    @PostMapping public Cliente create(@RequestBody Cliente c){ return repo.save(c); }
}
