package DACNTT.garage.controller;

import DACNTT.garage.dto.VehicleDTO;
import DACNTT.garage.handle.VehicleHandle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/vehicles")
public class VehicleController {

    @Autowired
    private VehicleHandle vehicleHandle;

    // ===============================
    // LIST + SEARCH + FILTER
    // ===============================
    @GetMapping
    public ResponseEntity<Page<VehicleDTO>> getVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "ALL") String filter
    ) {
        return vehicleHandle.getVehicles(page, size, search, filter);
    }

    // ===============================
    // GET BY BIEN SO
    // ===============================
    @GetMapping("/{bienSo}")
    public ResponseEntity<VehicleDTO> getVehicle(@PathVariable String bienSo) {
        return vehicleHandle.getVehicleById(bienSo);
    }

    // ===============================
    // CREATE
    // ===============================
    @PostMapping
    public ResponseEntity<VehicleDTO> createVehicle(@RequestBody VehicleDTO dto) {
        return vehicleHandle.createVehicle(dto);
    }

    // ===============================
    // UPDATE
    // ===============================
    @PutMapping("/{bienSo}")
    public ResponseEntity<VehicleDTO> updateVehicle(
            @PathVariable String bienSo,
            @RequestBody VehicleDTO dto) {
        return vehicleHandle.updateVehicle(bienSo, dto);
    }

    // ===============================
    // PATCH
    // ===============================
    @PatchMapping("/{bienSo}")
    public ResponseEntity<VehicleDTO> patchVehicle(
            @PathVariable String bienSo,
            @RequestBody Map<String, Object> updates) {
        return vehicleHandle.patchVehicle(bienSo, updates);
    }

    // ===============================
    // DELETE
    // ===============================
    @DeleteMapping("/{bienSo}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable String bienSo) {
        return vehicleHandle.deleteVehicle(bienSo);
    }
}
