package DACNTT.garage.repository;

import DACNTT.garage.model.PartOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartOrderItemRepository extends JpaRepository<PartOrderItem, Long> {
    List<PartOrderItem> findByDonDat_MaDon(String maDon);
}
