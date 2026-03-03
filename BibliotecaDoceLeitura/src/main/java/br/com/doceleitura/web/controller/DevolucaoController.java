package br.com.doceleitura.web.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.math.BigDecimal;

import br.com.doceleitura.web.repo.*;
import br.com.doceleitura.web.domain.*;
import br.com.doceleitura.web.service.MultaService;
import br.com.doceleitura.web.dto.DevolucaoRequest;

@RestController
@RequestMapping("/api/devolucoes")
public class DevolucaoController {
    private final DevolucaoRepository repo;
    private final EmprestimoRepository emprestimos;
    private final LivroRepository livros;
    private final MultaService multaService;

    public DevolucaoController(DevolucaoRepository repo, EmprestimoRepository emprestimos, LivroRepository livros, MultaService multaService){
        this.repo = repo;
        this.emprestimos = emprestimos;
        this.livros = livros;
        this.multaService = multaService;
    }

    @GetMapping
    public List<Devolucao> all(){
        return repo.findAll();
    }

    @PostMapping
    public Devolucao create(@RequestBody DevolucaoRequest req){
        Emprestimo e = emprestimos.findById(req.getEmprestimoId())
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado: " + req.getEmprestimoId()));

        LocalDate dataDev = (req.getDataDevolucao() != null && !req.getDataDevolucao().isBlank())
                ? LocalDate.parse(req.getDataDevolucao())
                : LocalDate.now();

        Devolucao d = new Devolucao();
        d.setEmprestimo(e);
        d.setDataDevolucao(dataDev);

        if(e.getDataPrevistaDevolucao() != null){
            long dias = Math.max(0, ChronoUnit.DAYS.between(e.getDataPrevistaDevolucao(), dataDev));
            d.setQtdeDiasAtraso((int) dias);
            d.setValorMulta(BigDecimal.valueOf(multaService.calcularMulta(e.getDataPrevistaDevolucao(), dataDev, 1.0)));
        } else {
            d.setQtdeDiasAtraso(0);
            d.setValorMulta(BigDecimal.ZERO);
        }

        // Atualiza estados
        e.setStatusVigor("Inativo");
        emprestimos.save(e);

        Livro l = e.getLivro();
        if(l != null){
            l.setStatusDisponibilidade("Disponível");
            livros.save(l);
        }

        return repo.save(d);
    }
}
