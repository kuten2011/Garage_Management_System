package DACNTT.garage.service;

import DACNTT.garage.model.Part;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PartService {
    Page<Part> getAllParts(Pageable pageable);
    Part getPartById(String maPT);
    Part createPart(Part part);
    Part updatePart(String maPT, Part part);
    void deletePart(String maPT);

    Page<Part> searchParts(
            String search,
            Double priceFrom, Double priceTo,
            Integer stockFrom, Integer stockTo,
            Integer stockUnder, Integer stockAbove,
            Pageable pageable
    );

    String generateNextMaPT();
}