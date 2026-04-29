package DACNTT.garage.repository;

import DACNTT.garage.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface BookingRepository
        extends JpaRepository<Booking, String>, JpaSpecificationExecutor<Booking> {

    Optional<Booking> findTopByOrderByMaLichDesc();
}