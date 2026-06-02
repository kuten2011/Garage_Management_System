package DACNTT.garage.handle;

import DACNTT.garage.dto.PartDTO;
import DACNTT.garage.dto.PartBatchCreateRequest;
import DACNTT.garage.dto.PartBranchAllocationDTO;
import DACNTT.garage.mapper.PartMapper;
import DACNTT.garage.model.Part;
import DACNTT.garage.repository.BranchRepository;
import DACNTT.garage.service.CloudinaryService;
import DACNTT.garage.service.PartService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class PartHandle {

    @Autowired private PartService partService;
    @Autowired private PartMapper partMapper;
    @Autowired private CloudinaryService cloudinaryService;
    @Autowired private BranchRepository branchRepository;
    @Autowired private ObjectMapper objectMapper;

    public ResponseEntity<Page<PartDTO>> searchParts(
            int page, int size,
            String search,
            Double priceFrom, Double priceTo,
            Integer stockFrom, Integer stockTo,
            Integer stockUnder, Integer stockAbove,
            String maChiNhanh,
            String sortBy, String sortDir) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "asc"),
                sortBy != null && !sortBy.isBlank() ? sortBy : "maPT");

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Part> result = partService.searchParts(
                search, priceFrom, priceTo,
                stockFrom, stockTo, stockUnder, stockAbove, maChiNhanh,
                pageable);

        Page<PartDTO> dtoPage = result.map(partMapper::toPartDTO);
        return ResponseEntity.ok(dtoPage);
    }

    public ResponseEntity<Page<PartDTO>> getAllParts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("maPT").ascending());
        Page<Part> parts = partService.getAllParts(pageable);
        Page<PartDTO> dtoPage = parts.map(partMapper::toPartDTO);
        return ResponseEntity.ok(dtoPage);
    }

    public ResponseEntity<PartDTO> getPartById(String maPT) {
        Part part = partService.getPartById(maPT);
        return ResponseEntity.ok(partMapper.toPartDTO(part));
    }

//    public ResponseEntity<PartDTO> createPart(PartDTO dto) {
//        Part part = partMapper.toEntity(dto);
//        Part saved = partService.createPart(part);
//        return ResponseEntity.status(HttpStatus.CREATED).body(partMapper.toPartDTO(saved));
//    }
    public ResponseEntity<PartDTO> createPart(PartDTO dto, MultipartFile imageFile) {
        try {
            dto.setMaChiNhanh(resolveRequiredBranch(dto.getMaChiNhanh()));
            String maPT = partService.generateNextMaPT();
            dto.setMaPT(maPT);
            Part part = partMapper.toEntity(dto);

            // Upload ảnh lên Cloudinary nếu có
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(imageFile, dto.getMaPT());
                part.setHinhAnh(imageUrl);
            }

            Part saved = partService.createPart(part);
            return ResponseEntity.status(HttpStatus.CREATED).body(partMapper.toPartDTO(saved));

        } catch (IllegalArgumentException e) {
            log.warn("Invalid part data: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Error uploading image for part {}: {}", dto.getMaPT(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            log.error("Error creating part {}: {}", dto.getMaPT(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    public ResponseEntity<PartDTO> updatePart(String maPT, PartDTO dto) {
//        if (!maPT.equals(dto.getMaPT())) {
//            return ResponseEntity.badRequest().build();
//        }
//        Part part = partMapper.toEntity(dto);
//        Part updated = partService.updatePart(maPT, part);
//        return ResponseEntity.ok(partMapper.toPartDTO(updated));
//    }
    public ResponseEntity<PartDTO> updatePart(String maPT, PartDTO dto, MultipartFile imageFile) {
        try {
            if (!maPT.equals(dto.getMaPT())) {
                log.warn("Path variable maPT {} does not match DTO maPT {}", maPT, dto.getMaPT());
                return ResponseEntity.badRequest().build();
            }
            dto.setMaChiNhanh(resolveRequiredBranch(dto.getMaChiNhanh()));

            Part part = partMapper.toEntity(dto);

            // Upload ảnh mới nếu có
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = cloudinaryService.updateImage(imageFile, maPT);
                part.setHinhAnh(imageUrl);
            } else {
                Part existingPart = partService.getPartById(maPT);
                part.setHinhAnh(existingPart.getHinhAnh());
            }

            Part updated = partService.updatePart(maPT, part);
            return ResponseEntity.ok(partMapper.toPartDTO(updated));

        } catch (IllegalArgumentException e) {
            log.warn("Invalid part data: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Error updating image for part {}: {}", maPT, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            log.error("Error updating part {}: {}", maPT, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    public ResponseEntity<Void> deletePart(String maPT) {
//        partService.deletePart(maPT);
//        return ResponseEntity.noContent().build();
//    }
    public ResponseEntity<Void> deletePart(String maPT) {
        try {
            cloudinaryService.deleteImage(maPT);
            partService.deletePart(maPT);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            log.error("Error deleting part {}: {}", maPT, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<List<PartDTO>> createPartsBatch(
            String payloadJson,
            MultipartFile imageFile) {
        try {
            PartBatchCreateRequest request = objectMapper.readValue(payloadJson, PartBatchCreateRequest.class);
            if (request == null || request.getTenPT() == null || request.getTenPT().isBlank()) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getDonGia() == null) {
                return ResponseEntity.badRequest().build();
            }
            if (request.getAllocations() == null || request.getAllocations().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<PartDTO> created = new ArrayList<>();
            for (PartBranchAllocationDTO allocation : request.getAllocations()) {
                if (allocation == null) {
                    continue;
                }
                String maChiNhanh = resolveRequiredBranch(allocation.getMaChiNhanh());
                Integer soLuongTon = allocation.getSoLuongTon() != null ? allocation.getSoLuongTon() : 0;

                PartDTO dto = PartDTO.builder()
                        .tenPT(request.getTenPT().trim())
                        .donGia(request.getDonGia())
                        .soLuongTon(soLuongTon)
                        .moTa(request.getMoTa())
                        .maChiNhanh(maChiNhanh)
                        .build();
                dto.setMaPT(partService.generateNextMaPT());

                Part part = partMapper.toEntity(dto);
                if (imageFile != null && !imageFile.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(imageFile, dto.getMaPT());
                    part.setHinhAnh(imageUrl);
                }
                Part saved = partService.createPart(part);
                created.add(partMapper.toPartDTO(saved));
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid batch part data: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Error uploading batch image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            log.error("Error creating batch parts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String resolveRequiredBranch(String maChiNhanh) {
        if (maChiNhanh == null || maChiNhanh.isBlank()) {
            throw new IllegalArgumentException("Phụ tùng phải thuộc một chi nhánh");
        }
        String normalized = maChiNhanh.trim().toUpperCase();
        if (!branchRepository.existsById(normalized)) {
            throw new IllegalArgumentException("Không tìm thấy chi nhánh: " + normalized);
        }
        return normalized;
    }
}
