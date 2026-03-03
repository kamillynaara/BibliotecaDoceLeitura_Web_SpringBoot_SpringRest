package br.com.doceleitura.web.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.doceleitura.web.domain.Emprestimo;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Integer> {}
