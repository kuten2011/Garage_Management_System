package DACNTT.garage.service;

import DACNTT.garage.dto.BranchDTO;
import DACNTT.garage.dto.EmployeeDTO;
import DACNTT.garage.model.Employee;

import java.util.List;

public interface EmployeeService {
    List<Employee> getAllEmployees();
    Employee createEmployee(EmployeeDTO employeeDTO);
    Employee updateEmployee(String maNV, EmployeeDTO employeeDTO);
    void deleteEmployee(String maNV);
    List<String> getAllVaiTro();
    List<BranchDTO> getAllBranches();
}