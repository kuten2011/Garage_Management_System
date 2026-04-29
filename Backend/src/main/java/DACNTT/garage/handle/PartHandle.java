package DACNTT.garage.handle;

import DACNTT.garage.dto.PartDTO;
import DACNTT.garage.mapper.PartMapper;
import DACNTT.garage.model.Part;
import DACNTT.garage.service.CloudinaryService;
import DACNTT.garage.service.PartService;
import DACNTT.garage.service.PartServiceImpl;
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

@Component
@Slf4j
public class PartHandle {

    @Autowired private PartService partService;
    @Autowired private PartMapper partMapper;
    @Autowired private CloudinaryService cloudinaryService;

    public ResponseEntity<Page<PartDTO>> searchParts(
            int page, int size,
            String search,
            Double priceFrom, Double priceTo,
            Integer stockFrom, Integer stockTo,
            Integer stockUnder, Integer stockAbove,
            String sortBy, String sortDir) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "asc"),
                sortBy != null && !sortBy.isBlank() ? sortBy : "maPT");

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Part> result = partService.searchParts(
                search, priceFrom, priceTo,
                stockFrom, stockTo, stockUnder, stockAbove,
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
}