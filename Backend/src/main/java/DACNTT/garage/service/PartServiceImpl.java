package DACNTT.garage.service;

import DACNTT.garage.model.Part;
import DACNTT.garage.repository.PartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class PartServiceImpl implements PartService {

    @Autowired private PartRepository partRepository;

    @Override
    public Page<Part> getAllParts(Pageable pageable) {
        return partRepository.findAll(pageable);
    }

    @Override
    public Part getPartById(String maPT) {
        return partRepository.findById(maPT)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ tùng: " + maPT));
    }

    @Transactional
    public Part createPart(Part part) {
        if (part.getMaPT() == null || part.getMaPT().trim().isEmpty()) {
            part.setMaPT(generateNextMaPT());
        } else {
            part.setMaPT(part.getMaPT().trim().toUpperCase());
            if (partRepository.existsByMaPT(part.getMaPT())) {
                throw new RuntimeException("Mã phụ tùng " + part.getMaPT() + " đã tồn tại!");
            }
        }
        return partRepository.save(part);
    }

    @Override
    public Part updatePart(String maPT, Part updateData) {
        Part existing = getPartById(maPT);
        if (!maPT.equals(updateData.getMaPT())) {
            throw new RuntimeException("Không được sửa mã phụ tùng!");
        }
        existing.setTenPT(updateData.getTenPT());
        existing.setDonGia(updateData.getDonGia());
        existing.setSoLuongTon(updateData.getSoLuongTon());
        if (updateData.getHinhAnh() != null) {
            existing.setHinhAnh(updateData.getHinhAnh());
        }
        return partRepository.save(existing);
    }

    @Override
    public void deletePart(String maPT) {
        if (!partRepository.existsById(maPT)) {
            throw new RuntimeException("Không tìm thấy phụ tùng để xóa!");
        }
        partRepository.deleteById(maPT);
    }

    public String generateNextMaPT() {
        return partRepository.findTopByOrderByMaPTDesc()
                .map(p -> {
                    String code = p.getMaPT();
                    if (!code.matches("^PT[0-9]+$")) return "PT01";
                    int num = Integer.parseInt(code.substring(2)) + 1;
                    return String.format("PT%02d", num);
                })
                .orElse("PT01");
    }

    @Override
    public Page<Part> searchParts(String search,
                                  Double priceFrom, Double priceTo,
                                  Integer stockFrom, Integer stockTo,
                                  Integer stockUnder, Integer stockAbove,
                                  Pageable pageable) {
        List<Specification<Part>> specs = new ArrayList<>();

        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.trim().toLowerCase() + "%";
            specs.add((root, query, cb) ->
                    cb.or(
                            cb.like(cb.lower(root.get("maPT")), pattern),
                            cb.like(cb.lower(root.get("tenPT")), pattern)
                    ));
        }

        if (priceFrom != null) {
            specs.add((root, query, cb) -> cb.ge(root.get("donGia"), priceFrom));
        }
        if (priceTo != null) {
            specs.add((root, query, cb) -> cb.le(root.get("donGia"), priceTo));
        }

        if (stockFrom != null) {
            specs.add((root, query, cb) -> cb.ge(root.get("soLuongTon"), stockFrom));
        }
        if (stockTo != null) {
            specs.add((root, query, cb) -> cb.le(root.get("soLuongTon"), stockTo));
        }

        if (stockUnder != null) {
            specs.add((root, query, cb) -> cb.le(root.get("soLuongTon"), stockUnder));
        }
        if (stockAbove != null) {
            specs.add((root, query, cb) -> cb.gt(root.get("soLuongTon"), stockAbove));
        }

        Specification<Part> finalSpec = specs.stream()
                .reduce(Specification::and)
                .orElse((root, query, cb) -> cb.conjunction());

        return partRepository.findAll(finalSpec, pageable);
    }
}