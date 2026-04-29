package DACNTT.garage.service;

import DACNTT.garage.model.Repair;
import DACNTT.garage.repository.CustomerRepository;
import DACNTT.garage.repository.RepairRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RepairServiceImpl implements RepairService {

    @Autowired
    private RepairRepository repairRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Page<Repair> getAllRepairs(Pageable pageable) {
        return repairRepository.findAll(pageable);
    }

    @Override
    public Repair findById(String maPhieu) {
        return repairRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu: " + maPhieu));
    }

    @Transactional
    public Repair createRepair(Repair repair) {
        String maPhieu = repair.getMaPhieu();

        if (maPhieu == null || maPhieu.trim().isEmpty()) {
            String newCode = generateNextMaPhieu();
            repair.setMaPhieu(newCode);
        } else {
            maPhieu = maPhieu.trim().toUpperCase();
            if (repairRepository.existsById(maPhieu)) {
                throw new RuntimeException("Mã phiếu " + maPhieu + " đã tồn tại!");
            }
            repair.setMaPhieu(maPhieu);
        }

        return repairRepository.save(repair);
    }

    private String generateNextMaPhieu() {
        return repairRepository.findTopByOrderByMaPhieuDesc()
                .map(r -> {
                    String code = r.getMaPhieu();
                    if (!code.matches("^PSC[0-9]{2,}$")) return "PSC01";
                    int num = Integer.parseInt(code.substring(3)) + 1;
                    return String.format("PSC%02d", num);
                })
                .orElse("PSC01");
    }

    @Override
    public Repair update(String maPhieu, Repair updateData) {
        if (!maPhieu.equals(updateData.getMaPhieu())) {
            throw new RuntimeException("Không được sửa mã phiếu!");
        }

        Repair existing = findById(maPhieu);
        existing.setLichHen(updateData.getLichHen());
        existing.setNhanVien(updateData.getNhanVien());
        existing.setNgayLap(updateData.getNgayLap());
        existing.setGhiChu(updateData.getGhiChu());
        existing.setTrangThai(updateData.getTrangThai());
        return repairRepository.save(existing);
    }

    @Override
    public Repair updateStatus(String maPhieu, String trangThai) {
        Repair repair = findById(maPhieu);
        repair.setTrangThai(trangThai);
        return repairRepository.save(repair);
    }

    @Override
    public void deleteById(String maPhieu) {
        if (!repairRepository.existsById(maPhieu)) {
            throw new RuntimeException("Không tìm thấy phiếu để xóa: " + maPhieu);
        }
        repairRepository.deleteById(maPhieu);
    }

    @Override
    public Repair getRepairById(String maPhieu) {
        return repairRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu sửa chữa: " + maPhieu));
    }

    @Override
    public Repair save(Repair repair) {
        return repairRepository.save(repair);
    }

//    @Override
//    public Page<Repair> findByMaKH(String maKH, Pageable pageable) {
//        return repairRepository.findByLichHen_KhachHang_MaKH(customerRepository.findByEmail(maKH).get().getMaKH(), pageable);
//    }
}