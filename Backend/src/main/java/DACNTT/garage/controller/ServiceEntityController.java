package DACNTT.garage.controller;

import DACNTT.garage.dto.ServiceEntityDTO;
import DACNTT.garage.dto.ServiceBatchCreateRequest;
import DACNTT.garage.handle.ServiceEntityHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/services")
public class ServiceEntityController {

    @Autowired
    private ServiceEntityHandle serviceHandle;

    @GetMapping
    public ResponseEntity<Page<ServiceEntityDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double priceFrom,
            @RequestParam(required = false) Double priceTo,
            @RequestParam(required = false) String maChiNhanh) {

        return serviceHandle.getAllServices(page, size, search, priceFrom, priceTo, maChiNhanh);
    }

    @GetMapping("/{maDV}")
    public ResponseEntity<ServiceEntityDTO> getById(@PathVariable String maDV) {
        return serviceHandle.getServiceById(maDV);
    }

    @PostMapping
    public ResponseEntity<ServiceEntityDTO> create(@RequestBody ServiceEntityDTO dto) {
        return serviceHandle.createService(dto);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<ServiceEntityDTO>> createBatch(@RequestBody ServiceBatchCreateRequest request) {
        return serviceHandle.createServicesBatch(request);
    }

    @PutMapping("/{maDV}")
    public ResponseEntity<ServiceEntityDTO> update(
            @PathVariable String maDV,
            @RequestBody ServiceEntityDTO dto) {
        return serviceHandle.updateService(maDV, dto);
    }

    @DeleteMapping("/{maDV}")
    public ResponseEntity<Void> delete(@PathVariable String maDV) {
        serviceHandle.deleteService(maDV);
        return ResponseEntity.noContent().build();
    }
}
