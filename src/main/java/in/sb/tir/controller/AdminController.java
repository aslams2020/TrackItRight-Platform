package in.sb.tir.controller;

import in.sb.tir.model.User;
import in.sb.tir.service.UserService;
import in.sb.tir.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private DepartmentService departmentService;

    // ===== User Management =====

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUserFromAdmin(user));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // ===== Reports / Analytics =====

    @GetMapping("/reports/complaints-per-department")
    public ResponseEntity<Object> complaintsPerDepartment() {
        return ResponseEntity.ok(departmentService.getComplaintCountsPerDepartment());
    }

    @GetMapping("/reports/complaints-by-status")
    public ResponseEntity<Object> complaintsByStatus() {
        return ResponseEntity.ok(departmentService.getComplaintCountsByStatus());
    }

    @GetMapping("/reports/average-rating")
    public ResponseEntity<Object> averageRating() {
        return ResponseEntity.ok(departmentService.getAverageRating());
    }
}
