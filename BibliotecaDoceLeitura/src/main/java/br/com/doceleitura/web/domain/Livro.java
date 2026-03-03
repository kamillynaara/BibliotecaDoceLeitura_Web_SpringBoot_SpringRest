package br.com.doceleitura.web.domain;

import jakarta.persistence.*;

@Entity
public class Livro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String titulo;
    private String autor;
    private String genero;
    private String anoPublicacao;
    private String descricao;
    private String statusDisponibilidade = "Disponível";

    public Integer getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getAutor() { return autor; }
    public String getGenero() { return genero; }
    public String getAnoPublicacao() { return anoPublicacao; }
    public String getDescricao() { return descricao; }
    public String getStatusDisponibilidade() { return statusDisponibilidade; }
    public void setId(Integer id) { this.id = id; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setAutor(String autor) { this.autor = autor; }
    public void setGenero(String genero) { this.genero = genero; }
    public void setAnoPublicacao(String anoPublicacao) { this.anoPublicacao = anoPublicacao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setStatusDisponibilidade(String statusDisponibilidade) { this.statusDisponibilidade = statusDisponibilidade; }
}
