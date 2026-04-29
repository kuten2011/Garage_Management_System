package DACNTT.garage.handle;

import DACNTT.garage.dto.EmployeeDTO;
import DACNTT.garage.mapper.EmployeeMapper;
import DACNTT.garage.model.Employee;
import DACNTT.garage.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class EmployeeHandle {
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private EmployeeMapper employeeMapper;

    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        List<EmployeeDTO> employeeDTOs = new ArrayList<>();
        for (Employee employee : employees) {
            employeeDTOs.add(employeeMapper.toEmployeeDTO(employee));
        }
        return ResponseEntity.ok(employeeDTOs);
    }
}
