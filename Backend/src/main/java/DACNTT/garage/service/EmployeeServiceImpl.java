package DACNTT.garage.service;

import DACNTT.garage.dto.BranchDTO;
import DACNTT.garage.dto.EmployeeDTO;
import DACNTT.garage.mapper.EmployeeMapper;
import DACNTT.garage.model.Branch;
import DACNTT.garage.model.Employee;
import DACNTT.garage.repository.EmployeeRepository;
import DACNTT.garage.util.Enum.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeMapper employeeMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee createEmployee(EmployeeDTO dto) {
        // 1. Tự động sinh mã nhân viên
        String newMaNV = generateNextMaNV();
        dto.setMaNV(newMaNV);

        // 2. Chuyển DTO sang Entity (mapper sẽ bỏ qua role và chiNhanh)
        Employee employee = employeeMapper.toEmployee(dto);

        // 3. Map vaiTro tiếng Việt → Role enum (thủ công vì DTO không có role)
        employee.setRole(mapVaiTroToRole(dto.getVaiTro()));

        // 4. Set chi nhánh (nếu có mã chi nhánh)
        if (dto.getMaChiNhanh() != null && !dto.getMaChiNhanh().isBlank()) {
            Branch branch = new Branch();
            branch.setMaChiNhanh(dto.getMaChiNhanh().trim().toUpperCase());
            employee.setChiNhanh(branch);
        }

        // 5. Lưu vào DB
        return employeeRepository.save(employee);
    }

    /**
     * Sinh mã nhân viên tiếp theo: NV001, NV002, ...
     */
    private String generateNextMaNV() {
        List<Employee> allEmployees = employeeRepository.findAll();

        int maxNumber = allEmployees.stream()
                .map(Employee::getMaNV)
                .filter(code -> code != null && code.startsWith("NV"))
                .map(code -> code.substring(2))
                .filter(str -> str.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);

        return String.format("NV%03d", maxNumber + 1);
    }

    /**
     * Map từ vai trò hiển thị (tiếng Việt) sang Role enum của hệ thống
     */
    private Role mapVaiTroToRole(String vaiTro) {
        if (vaiTro == null || vaiTro.isBlank()) {
            return Role.ROLE_EMPLOYEE;
        }

        return switch (vaiTro.trim()) {
            case "Quản trị viên" -> Role.ROLE_ADMIN;
            case "Quản lý" -> Role.ROLE_MANAGER;
            case "Kỹ thuật viên", "Lễ tân" -> Role.ROLE_EMPLOYEE;
            default -> Role.ROLE_EMPLOYEE;
        };
    }

    /**
     * Trả về danh sách vai trò để frontend hiển thị dropdown
     */
    @Override
    public List<String> getAllVaiTro() {
        return List.of("Lễ tân", "Kỹ thuật viên", "Quản lý", "Quản trị viên");
    }

    @Override
    public List<BranchDTO> getAllBranches() {
        return null;
    }

    @Override
    public Employee updateEmployee(String maNV, EmployeeDTO dto) {
        Employee existing = employeeRepository.findById(maNV)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        if (dto.getHoTen() != null)
            existing.setHoTen(dto.getHoTen());

        if (dto.getVaiTro() != null)
            existing.setVaiTro(dto.getVaiTro());

        if (dto.getSdt() != null)
            existing.setSdt(dto.getSdt());

        if (dto.getEmail() != null)
            existing.setEmail(dto.getEmail());

        // ĐỔI MẬT KHẨU – PHẢI ENCODE
        if (dto.getMatKhau() != null && !dto.getMatKhau().isBlank()) {
            existing.setMatKhau(passwordEncoder.encode(dto.getMatKhau()));
        }

        // Map vai trò hiển thị → role hệ thống
        if (dto.getVaiTro() != null) {
            existing.setRole(mapVaiTroToRole(dto.getVaiTro()));
        }

        if (dto.getMaChiNhanh() != null && !dto.getMaChiNhanh().isBlank()) {
            Branch branch = new Branch();
            branch.setMaChiNhanh(dto.getMaChiNhanh().trim().toUpperCase());
            existing.setChiNhanh(branch);
        }

        return employeeRepository.save(existing);
    }


    @Override
    public void deleteEmployee(String maNV) {
        employeeRepository.delete(employeeRepository.getById(maNV));
    }
}