package in.sb.tir.controller;

import in.sb.tir.dto.RegisterRequest;
import in.sb.tir.dto.RemarkRequest;
import in.sb.tir.dto.UpdateStatusRequest;
import in.sb.tir.model.Complaint;
import in.sb.tir.model.User;
import in.sb.tir.service.ComplaintService;
import in.sb.tir.service.UserService;
import in.sb.tir.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private ComplaintService complaintService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(request);
        return ResponseEntity.ok(user);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.get("email"), request.get("password"))
            );
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userService.findByEmail(request.get("email"))
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "id", user.getId().toString(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        ));
    }

    
    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> listDeptComplaints(Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(complaintService.getComplaintsForAuthorityDepartment(email));
    }
    
    @PutMapping("/complaints/{id}/assign-self")
    public ResponseEntity<Complaint> assignSelf(@PathVariable Long id, Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(complaintService.assignToSelf(id, email));
    }
    
    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id,
                                                  @RequestBody UpdateStatusRequest req,
                                                  Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(
                complaintService.updateStatusByAuthority(id, email, req.getStatus())
        );
    }
    
    
    @PutMapping("/complaints/{id}/remark")
    public ResponseEntity<Complaint> updateRemark(@PathVariable Long id,
                                                  @RequestBody RemarkRequest req,
                                                  Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(
                complaintService.updateRemarksByAuthority(id, email, req.getRemark())
        );
    }
}
