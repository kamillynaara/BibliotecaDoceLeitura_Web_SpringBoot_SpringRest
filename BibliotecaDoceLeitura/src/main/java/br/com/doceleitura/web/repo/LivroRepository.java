package br.com.doceleitura.web.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.doceleitura.web.domain.Livro;

public interface LivroRepository extends JpaRepository<Livro, Integer> {}
