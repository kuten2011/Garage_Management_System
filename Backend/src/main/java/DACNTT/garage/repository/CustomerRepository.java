package DACNTT.garage.repository;

import DACNTT.garage.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, String> {

    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsBySdt(String sdt);

    @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.xeList")
    List<Customer> findAllWithVehicles();
}