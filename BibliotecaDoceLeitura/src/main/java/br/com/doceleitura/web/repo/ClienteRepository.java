package br.com.doceleitura.web.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.doceleitura.web.domain.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {}
