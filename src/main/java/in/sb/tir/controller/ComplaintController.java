package in.sb.tir.controller;

import in.sb.tir.dto.ComplaintRequest;
import in.sb.tir.model.*;
import in.sb.tir.repository.DepartmentRepository;
import in.sb.tir.repository.UserRepository;
import in.sb.tir.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    // Citizen submits complaint
    
    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody ComplaintRequest request,
                                                     Authentication authentication) {
        // 1. Logged-in user
        String email = authentication.getName();
        User citizen = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Fetch department
        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // 3. Build complaint
        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCitizen(citizen);
        complaint.setDepartment(dept);

        // 4. Save
        Complaint savedComplaint = complaintService.createComplaint(complaint);

        return ResponseEntity.ok(savedComplaint);
    }


    // Citizen views their complaints
    @GetMapping("/citizen/{id}")
    public List<Complaint> getComplaintsByCitizen(@PathVariable Long id) {
        return complaintService.getComplaintsByCitizen(id);
    }


    @PutMapping("/{complaintId}/status")
    public Complaint updateStatus(@PathVariable Long complaintId,
                                  @RequestParam ComplaintStatus status,
                                  Authentication authentication) {
        String email = authentication.getName();

        User authority = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authority not found"));

        return complaintService.updateComplaintStatus(complaintId, status, authority);
    }


    // Admin reassigns complaint
    @PutMapping("/{complaintId}/reassign")
    public Complaint reassignComplaint(@PathVariable Long complaintId,
                                       @RequestBody User newAuthority) {
        return complaintService.reassignComplaint(complaintId, newAuthority);
    }
    
    @GetMapping("/department/{id}")
    public List<Complaint> getComplaintsByDepartment(@PathVariable Long id) {
        return complaintService.getComplaintsByDepartment(id);
    }
}
