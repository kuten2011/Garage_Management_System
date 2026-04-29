package DACNTT.garage.controller;

import DACNTT.garage.dto.EmployeeDTO;
import DACNTT.garage.handle.EmployeeHandle;
import DACNTT.garage.mapper.EmployeeMapper;
import DACNTT.garage.model.Employee;
import DACNTT.garage.repository.EmployeeRepository;
import DACNTT.garage.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/employees")
public class EmployeeController {

    @Autowired
    private EmployeeHandle employeeHandle;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeMapper employeeMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping({"", "/"})
    public ResponseEntity<?> getEmployees() {
        return employeeHandle.getAllEmployees();
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeDTO employeeDTO) {
        try {
            Employee employee = employeeService.createEmployee(employeeDTO);
            return ResponseEntity.ok(employeeMapper.toEmployeeDTO(employee));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/vai-tro")
    public ResponseEntity<List<String>> getVaiTroList() {
        return ResponseEntity.ok(employeeService.getAllVaiTro());
    }

    @GetMapping("/{maNV}")
    public ResponseEntity<EmployeeDTO> getEmployeeByMaNV(@PathVariable String maNV) {
        System.out.println("test");
        return employeeRepository.findById(maNV)
                .map(employeeMapper::toEmployeeDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{maNV}")
    public ResponseEntity<EmployeeDTO> updateEmployee(
            @PathVariable String maNV,
            @RequestBody EmployeeDTO dto) {
        // Tương tự: đảm bảo mã trong DTO khớp với path
        if (dto.getMaNV() != null && !dto.getMaNV().equals(maNV)) {
            return ResponseEntity.badRequest().body(null);
        }
        dto.setMaNV(maNV);
        try {
            Employee updated = employeeService.updateEmployee(maNV, dto);
            return ResponseEntity.ok(employeeMapper.toEmployeeDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PatchMapping("/{maNV}")
    public ResponseEntity<EmployeeDTO> updateEmployeee(
            @PathVariable String maNV,
            @RequestBody EmployeeDTO dto) {
        // Tương tự: đảm bảo mã trong DTO khớp với path
        if (dto.getMaNV() != null && !dto.getMaNV().equals(maNV)) {
            return ResponseEntity.badRequest().body(null);
        }
        dto.setMaNV(maNV);
        try {
            Employee updated = employeeService.updateEmployee(maNV, dto);
            return ResponseEntity.ok(employeeMapper.toEmployeeDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{maNV}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String maNV) {
        employeeService.deleteEmployee(maNV);
        return ResponseEntity.ok("Xóa thành công");
    }

    //Only in UI
    @GetMapping("/api/{maNV}")
    public ResponseEntity<EmployeeDTO> getEmployeeByMaNVV(@PathVariable String maNV) {
        System.out.println("test");
        return employeeRepository.findByEmail(maNV)
                .map(employeeMapper::toEmployeeDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/api/{maNV}")
    public ResponseEntity<EmployeeDTO> updateEmployeeInUi(
            @PathVariable String maNV,
            @RequestBody EmployeeDTO dto) {
        String maNVV = employeeRepository.findByEmail(maNV).get().getMaNV();
        if (dto.getMaNV() != null && !dto.getMaNV().equals(maNVV)) {
            return ResponseEntity.badRequest().body(null);
        }
        dto.setMaNV(maNVV);
        try {
            Employee updated = employeeService.updateEmployee(maNVV, dto);
            return ResponseEntity.ok(employeeMapper.toEmployeeDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}