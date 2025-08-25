package in.sb.tir.service;

import in.sb.tir.service.*;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import in.sb.tir.dto.RegisterRequest;
import in.sb.tir.model.Department;
import in.sb.tir.model.Role;
import in.sb.tir.model.User;
import in.sb.tir.repository.DepartmentRepository;
import in.sb.tir.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            user.setDepartment(dept);
        }

        return userRepository.save(user);
    }
	 // Login validation (for JWT authentication later)
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
}
