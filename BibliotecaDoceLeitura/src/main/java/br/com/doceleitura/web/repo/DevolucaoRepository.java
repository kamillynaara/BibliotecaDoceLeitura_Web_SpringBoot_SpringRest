package br.com.doceleitura.web.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.doceleitura.web.domain.Devolucao;

public interface DevolucaoRepository extends JpaRepository<Devolucao, Integer> {}
