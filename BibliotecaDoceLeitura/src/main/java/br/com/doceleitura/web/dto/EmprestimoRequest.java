package br.com.doceleitura.web.dto;

public class EmprestimoRequest {
    private Integer clienteId;
    private Integer livroId;
    private String dataPrevistaDevolucao; // YYYY-MM-DD

    public Integer getClienteId() { return clienteId; }
    public Integer getLivroId() { return livroId; }
    public String getDataPrevistaDevolucao() { return dataPrevistaDevolucao; }

    public void setClienteId(Integer clienteId) { this.clienteId = clienteId; }
    public void setLivroId(Integer livroId) { this.livroId = livroId; }
    public void setDataPrevistaDevolucao(String dataPrevistaDevolucao) { this.dataPrevistaDevolucao = dataPrevistaDevolucao; }
}
