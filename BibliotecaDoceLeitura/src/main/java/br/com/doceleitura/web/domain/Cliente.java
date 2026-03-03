package br.com.doceleitura.web.domain;

import jakarta.persistence.*;

@Entity
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private String email;
    private String telefone;
    private String statusAcesso = "Habilitado";

    public Integer getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public String getStatusAcesso() { return statusAcesso; }
    public void setId(Integer id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setEmail(String email) { this.email = email; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setStatusAcesso(String statusAcesso) { this.statusAcesso = statusAcesso; }
}
