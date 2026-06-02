package DACNTT.garage.controller;

import DACNTT.garage.dto.BranchDTO;
import DACNTT.garage.dto.PartDTO;
import DACNTT.garage.dto.ServiceEntityDTO;
import DACNTT.garage.handle.BranchHandle;
import DACNTT.garage.handle.PartHandle;
import DACNTT.garage.handle.ServiceEntityHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class PublicCatalogController {

    @Autowired
    private PartHandle partHandle;

    @Autowired
    private ServiceEntityHandle serviceHandle;

    @Autowired
    private BranchHandle branchHandle;

    @GetMapping("/parts")
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
            @RequestParam(required = false) String maChiNhanh,
            @RequestParam(defaultValue = "maPT") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return partHandle.searchParts(page, size, search, priceFrom, priceTo, stockFrom, stockTo, stockUnder, stockAbove, maChiNhanh, sortBy, sortDir);
    }

    @GetMapping("/parts/{maPT}")
    public ResponseEntity<PartDTO> getPart(@PathVariable String maPT) {
        return partHandle.getPartById(maPT);
    }

    @GetMapping("/services")
    public ResponseEntity<Page<ServiceEntityDTO>> getServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double priceFrom,
            @RequestParam(required = false) Double priceTo,
            @RequestParam(required = false) String maChiNhanh) {
        return serviceHandle.getAllServices(page, size, search, priceFrom, priceTo, maChiNhanh);
    }

    @GetMapping("/services/{maDV}")
    public ResponseEntity<ServiceEntityDTO> getService(@PathVariable String maDV) {
        return serviceHandle.getServiceById(maDV);
    }

    @GetMapping("/branches")
    public ResponseEntity<Page<BranchDTO>> getBranches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) String diaChi,
            @RequestParam(required = false) String sdt,
            @RequestParam(required = false) String email) {
        return branchHandle.getAllBranches(page, size, ten, diaChi, sdt, email);
    }
}
