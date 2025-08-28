package in.sb.tir.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.sb.tir.model.Department;
import in.sb.tir.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
public class PublicDepartmentController {
    private final DepartmentService departmentService;
    public PublicDepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public List<Department> list() {
        return departmentService.getAllDepartments();
    }
    
}