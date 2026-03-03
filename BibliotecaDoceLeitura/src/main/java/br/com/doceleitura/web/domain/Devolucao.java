package br.com.doceleitura.web.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "devolucao")
public class Devolucao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "emprestimo_id", nullable = false)
    private Emprestimo emprestimo;

    @Column(name = "dt_devolucao", nullable = false)
    private LocalDate dataDevolucao;

    // No script, a coluna é opcional (pode ser NULL)
    @Column(name = "qt_dias_atraso")
    private Integer qtdeDiasAtraso;

    @Column(name = "vl_multa", precision = 6, scale = 2)
    private BigDecimal valorMulta;

    public Integer getId() { return id; }
    public Emprestimo getEmprestimo() { return emprestimo; }
    public LocalDate getDataDevolucao() { return dataDevolucao; }
    public Integer getQtdeDiasAtraso() { return qtdeDiasAtraso; }
    public BigDecimal getValorMulta() { return valorMulta; }
    public void setId(Integer id) { this.id = id; }
    public void setEmprestimo(Emprestimo emprestimo) { this.emprestimo = emprestimo; }
    public void setDataDevolucao(LocalDate dataDevolucao) { this.dataDevolucao = dataDevolucao; }
    public void setQtdeDiasAtraso(Integer qtdeDiasAtraso) { this.qtdeDiasAtraso = qtdeDiasAtraso; }
    public void setValorMulta(BigDecimal valorMulta) { this.valorMulta = valorMulta; }
}
