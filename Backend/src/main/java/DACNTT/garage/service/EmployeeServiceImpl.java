package DACNTT.garage.service;

import DACNTT.garage.dto.BranchDTO;
import DACNTT.garage.dto.EmployeeDTO;
import DACNTT.garage.mapper.EmployeeMapper;
import DACNTT.garage.model.Branch;
import DACNTT.garage.model.Employee;
import DACNTT.garage.repository.BranchRepository;
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

    @Autowired
    private BranchRepository branchRepository;

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee createEmployee(EmployeeDTO dto) {
        String newMaNV = generateNextMaNV();
        dto.setMaNV(newMaNV);
        if (dto.getEmail() != null) {
            dto.setEmail(dto.getEmail().trim().toLowerCase());
        }

        Employee employee = employeeMapper.toEmployee(dto);
        employee.setRole(mapVaiTroToRole(dto.getVaiTro()));
        employee.setChiNhanh(resolveRequiredBranch(dto.getMaChiNhanh()));

        return employeeRepository.save(employee);
    }

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

    @Override
    public List<String> getAllVaiTro() {
        return List.of("Lễ tân", "Kỹ thuật viên", "Quản lý", "Quản trị viên");
    }

    @Override
    public List<BranchDTO> getAllBranches() {
        return branchRepository.findAll().stream()
                .map(branch -> BranchDTO.builder()
                        .maChiNhanh(branch.getMaChiNhanh())
                        .tenChiNhanh(branch.getTenChiNhanh())
                        .diaChi(branch.getDiaChi())
                        .sdt(branch.getSdt())
                        .email(branch.getEmail())
                        .build())
                .toList();
    }

    @Override
    public Employee updateEmployee(String maNV, EmployeeDTO dto) {
        Employee existing = employeeRepository.findById(maNV)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        if (dto.getHoTen() != null) {
            existing.setHoTen(dto.getHoTen());
        }
        if (dto.getVaiTro() != null) {
            existing.setVaiTro(dto.getVaiTro());
            existing.setRole(mapVaiTroToRole(dto.getVaiTro()));
        }
        if (dto.getSdt() != null) {
            existing.setSdt(dto.getSdt());
        }
        if (dto.getEmail() != null) {
            existing.setEmail(dto.getEmail().trim().toLowerCase());
        }
        if (dto.getMatKhau() != null && !dto.getMatKhau().isBlank()) {
            existing.setMatKhau(passwordEncoder.encode(dto.getMatKhau()));
        }
        if (dto.getMaChiNhanh() != null && !dto.getMaChiNhanh().isBlank()) {
            existing.setChiNhanh(resolveRequiredBranch(dto.getMaChiNhanh()));
        } else if (existing.getChiNhanh() == null) {
            throw new RuntimeException("Nhân viên phải thuộc một chi nhánh");
        }

        return employeeRepository.save(existing);
    }

    private Branch resolveRequiredBranch(String maChiNhanh) {
        if (maChiNhanh == null || maChiNhanh.isBlank()) {
            throw new RuntimeException("Nhân viên phải thuộc một chi nhánh");
        }
        String normalized = maChiNhanh.trim().toUpperCase();
        return branchRepository.findById(normalized)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi nhánh: " + normalized));
    }

    @Override
    public void deleteEmployee(String maNV) {
        employeeRepository.delete(employeeRepository.getById(maNV));
    }
}
