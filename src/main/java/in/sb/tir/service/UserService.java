package in.sb.tir.service;

import in.sb.tir.dto.RegisterRequest;
import in.sb.tir.model.Department;
import in.sb.tir.model.Role;
import in.sb.tir.model.User;
import in.sb.tir.repository.DepartmentRepository;
import in.sb.tir.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;  // Interface!
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; 

    // Register a new user
    public User registerUser(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));  // Hash password
        user.setRole(request.getRole());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            user.setDepartment(dept);
        }

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public List<User> getUsersByDepartment(Long departmentId) {
        return userRepository.findByDepartmentId(departmentId);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existing.setRole(user.getRole());
        existing.setDepartment(user.getDepartment());
        return userRepository.save(existing);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
 // inside UserService.java
    public User registerUserFromAdmin(User user) {
        // Encode password if provided
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } 
        else {
            // set default password if admin did not provide one
            user.setPassword(passwordEncoder.encode("default123"));
        }

        // Ensure department exists if assigned
        if (user.getDepartment() != null) {
            Long deptId = user.getDepartment().getId();
            Department dept = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            user.setDepartment(dept);
        }

        return userRepository.save(user);
    }

}
