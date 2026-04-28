package DACNTT.garage.handle;

import DACNTT.garage.dto.RepairPartDTO;
import DACNTT.garage.mapper.RepairPartMapper;
import DACNTT.garage.model.*;
import DACNTT.garage.repository.PartRepository;
import DACNTT.garage.repository.RepairRepository;
import DACNTT.garage.repository.RepairPartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RepairPartHandle {

    @Autowired private RepairPartRepository repairPartRepository;
    @Autowired private RepairRepository repairRepository;
    @Autowired private PartRepository partRepository;
    @Autowired private RepairPartMapper repairPartMapper;

    // Kiểm tra phiếu có thuộc về customer này không
    // Repair → xe (Vehicle) → khachHang (Customer) → email
    @Transactional (readOnly = true)
    public boolean isOwner(String maPhieu, String email) {
        return repairRepository.findById(maPhieu)
                .map(phieu -> phieu.getXe() != null
                        && phieu.getXe().getKhachHang() != null
                        && email.equals(phieu.getXe().getKhachHang().getEmail()))
                .orElse(false);
    }

    // Lấy danh sách phụ tùng theo phiếu
    public ResponseEntity<List<RepairPartDTO>> getPartsByPhieu(String maPhieu) {
        List<RepairPart> parts = repairPartRepository.findAll().stream()
                .filter(rp -> rp.getPhieu().getMaPhieu().equals(maPhieu))
                .collect(Collectors.toList());

        List<RepairPartDTO> dtos = parts.stream()
                .map(repairPartMapper::toRepairPartDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Thêm phụ tùng vào phiếu
    public ResponseEntity<RepairPartDTO> addPart(RepairPartDTO dto) {
        Repair phieu = repairRepository.findById(dto.getMaPhieu())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu: " + dto.getMaPhieu()));

        Part phuTung = partRepository.findById(dto.getMaPT())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ tùng: " + dto.getMaPT()));

        RepairPart entity = new RepairPart();
        entity.setPhieu(phieu);
        entity.setPhuTung(phuTung);
        entity.setSoLuong(dto.getSoLuong());
        entity.setThanhTien(phuTung.getDonGia() * dto.getSoLuong());

        RepairPart saved = repairPartRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repairPartMapper.toRepairPartDTO(saved));
    }

    // Xóa phụ tùng khỏi phiếu
    public void removePart(String maPhieu, String maPT) {
        RepairPartId id = new RepairPartId(maPhieu, maPT);
        if (!repairPartRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy phụ tùng trong phiếu này!");
        }
        repairPartRepository.deleteById(id);
    }
}