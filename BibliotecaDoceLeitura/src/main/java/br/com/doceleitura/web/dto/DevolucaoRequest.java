package br.com.doceleitura.web.dto;

public class DevolucaoRequest {
    private Integer emprestimoId;
    private String dataDevolucao; // YYYY-MM-DD

    public Integer getEmprestimoId() { return emprestimoId; }
    public String getDataDevolucao() { return dataDevolucao; }

    public void setEmprestimoId(Integer emprestimoId) { this.emprestimoId = emprestimoId; }
    public void setDataDevolucao(String dataDevolucao) { this.dataDevolucao = dataDevolucao; }
}
