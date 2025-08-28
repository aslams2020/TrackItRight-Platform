package in.sb.tir.controller;

import in.sb.tir.dto.ComplaintAdminDTO;
import in.sb.tir.dto.RemarkRequest;
import in.sb.tir.dto.UpdateStatusRequest;
import in.sb.tir.model.Complaint;
import in.sb.tir.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/authority")
public class AuthorityController {

    @Autowired
    private ComplaintService complaintService;

    // List all complaints for the authority's department
    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintAdminDTO>> listDeptComplaints(Authentication auth) {
        String email = auth.getName();
        List<Complaint> complaints = complaintService.getComplaintsForAuthorityDepartment(email);
        List<ComplaintAdminDTO> dtos = complaints.stream()
            .map(ComplaintAdminDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    // Self-assign a complaint to the logged-in authority
    @PutMapping("/complaints/{id}/assign-self")
    public ResponseEntity<Complaint> assignSelf(@PathVariable Long id, Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(complaintService.assignToSelf(id, email));
    }

    // Update complaint status (PENDING / IN_PROGRESS / RESOLVED / REJECTED)
    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id,
                                                  @RequestBody UpdateStatusRequest req,
                                                  Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(
                complaintService.updateStatusByAuthority(id, email, req.getStatus())
        );
    }

    // Add or update resolution remarks
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
