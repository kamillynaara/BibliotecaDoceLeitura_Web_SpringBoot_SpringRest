package br.com.doceleitura.web.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "emprestimo")
public class Emprestimo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "livro_id", nullable = false)
    private Livro livro;

    @Column(name = "dt_emprestimo", nullable = false)
    private LocalDate dataEmprestimo = LocalDate.now();

    @Column(name = "dt_prevista_devolucao", nullable = false)
    private LocalDate dataPrevistaDevolucao;
    private String statusVigor = "Ativo";

    public Integer getId() { return id; }
    public Cliente getCliente() { return cliente; }
    public Livro getLivro() { return livro; }
    public LocalDate getDataEmprestimo() { return dataEmprestimo; }
    public LocalDate getDataPrevistaDevolucao() { return dataPrevistaDevolucao; }
    public String getStatusVigor() { return statusVigor; }
    public void setId(Integer id) { this.id = id; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public void setLivro(Livro livro) { this.livro = livro; }
    public void setDataEmprestimo(LocalDate dataEmprestimo) { this.dataEmprestimo = dataEmprestimo; }
    public void setDataPrevistaDevolucao(LocalDate dataPrevistaDevolucao) { this.dataPrevistaDevolucao = dataPrevistaDevolucao; }
    public void setStatusVigor(String statusVigor) { this.statusVigor = statusVigor; }
}
