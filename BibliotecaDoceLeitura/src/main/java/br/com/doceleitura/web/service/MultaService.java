package br.com.doceleitura.web.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class MultaService {
    public double calcularMulta(LocalDate prevista, LocalDate devolucao, double taxa){
        long dias = Math.max(0, ChronoUnit.DAYS.between(prevista, devolucao));
        return dias * taxa;
    }
}
