package in.sb.tir.service;

import in.sb.tir.model.Department;
import in.sb.tir.repository.ComplaintRepository;
import in.sb.tir.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.sb.tir.model.Complaint;
import in.sb.tir.model.ComplaintStatus;
import in.sb.tir.model.Department;
import in.sb.tir.repository.ComplaintRepository;
import in.sb.tir.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final ComplaintRepository complaintRepository;

    public DepartmentService(DepartmentRepository departmentRepository,
                             ComplaintRepository complaintRepository) {
        this.departmentRepository = departmentRepository;
        this.complaintRepository = complaintRepository;
    }

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    public Optional<Department> getDepartmentByName(String name) {
        return departmentRepository.findByName(name);
    }

    @Transactional
    public Department updateDepartment(Long id, Department dept) {
        Department existing = departmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Department not found"));

        // Update both fields
        if (dept.getName() != null) {
            existing.setName(dept.getName());
        }
        // Important: set description from payload so it persists
        if (dept.getDescription() != null) {
            existing.setDescription(dept.getDescription());
        }

        return departmentRepository.save(existing);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
    
    // ===== Analytics / Reports =====

    // 1. Complaints per department
    public Map<String, Long> getComplaintCountsPerDepartment() {
        List<Department> departments = departmentRepository.findAll();
        Map<String, Long> result = new HashMap<>();

        for (Department dept : departments) {
            Long count = complaintRepository.findByDepartmentId(dept.getId()).stream().count();
            result.put(dept.getName(), count);
        }

        return result;
    }

    // 2. Complaints by status (all departments combined)
    public Map<ComplaintStatus, Long> getComplaintCountsByStatus() {
        List<Complaint> complaints = complaintRepository.findAll();
        Map<ComplaintStatus, Long> result = complaints.stream()
                .collect(Collectors.groupingBy(Complaint::getStatus, Collectors.counting()));
        return result;
    }

    // 3. Average rating (citizen satisfaction) per department
    public Map<String, Double> getAverageRating() {
        List<Department> departments = departmentRepository.findAll();
        Map<String, Double> result = new HashMap<>();

        for (Department dept : departments) {
            List<Complaint> complaints = complaintRepository.findByDepartmentId(dept.getId());
            double avg = complaints.stream()
                    .filter(c -> c.getFeedback() != null)
                    .mapToInt(c -> c.getFeedback().getRating()) // assuming ComplaintFeedback has `rating` field
                    .average()
                    .orElse(0.0);
            result.put(dept.getName(), avg);
        }

        return result;
    }
    
}
