package DACNTT.garage.controller;

import DACNTT.garage.dto.PartDTO;
import DACNTT.garage.handle.PartHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/parts")
public class PartController {

    @Autowired private PartHandle partHandle;

    @GetMapping
    public ResponseEntity<Page<PartDTO>> searchParts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double priceFrom,
            @RequestParam(required = false) Double priceTo,
            @RequestParam(required = false) Integer stockFrom,
            @RequestParam(required = false) Integer stockTo,
            @RequestParam(required = false) Integer stockUnder,
            @RequestParam(required = false) Integer stockAbove,
            @RequestParam(defaultValue = "maPT") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        return partHandle.searchParts(page, size, search,
                priceFrom, priceTo, stockFrom, stockTo, stockUnder, stockAbove,
                sortBy, sortDir);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<PartDTO>> getAllParts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return partHandle.getAllParts(page, size);
    }

    @GetMapping("/{maPT}")
    public ResponseEntity<PartDTO> getPart(@PathVariable String maPT) {
        return partHandle.getPartById(maPT);
    }

//    @PostMapping
//    public ResponseEntity<PartDTO> createPart(@RequestBody PartDTO dto) {
//        return partHandle.createPart(dto);
//    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PartDTO> createPart(
            @ModelAttribute PartDTO partDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        return partHandle.createPart(partDTO, image);
    }

//    @PutMapping("/{maPT}")
//    public ResponseEntity<PartDTO> updatePart(@PathVariable String maPT, @RequestBody PartDTO dto) {
//        return partHandle.updatePart(maPT, dto);
//    }
    @PutMapping(value = "/{maPT}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PartDTO> updatePartWithImage(
            @ModelAttribute PartDTO partDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        return partHandle.updatePart(partDTO.getMaPT(), partDTO , image);
    }

    @PutMapping(value = "/{maPT}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PartDTO> updatePartJson(
            @PathVariable String maPT,
            @RequestBody PartDTO dto) {

        return partHandle.updatePart(maPT, dto, null);
    }

    @DeleteMapping("/{maPT}")
    public ResponseEntity<Void> deletePart(@PathVariable String maPT) {
        return partHandle.deletePart(maPT);
    }
}