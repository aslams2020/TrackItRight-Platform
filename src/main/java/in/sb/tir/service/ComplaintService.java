package in.sb.tir.service;

import in.sb.tir.model.*;
import in.sb.tir.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    // Citizen files complaint
    public Complaint createComplaint(Complaint complaint) {
    	// citizen already set in controller
        complaint.setStatus(ComplaintStatus.PENDING);  
        complaint.setCreatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    // Fetch complaints
    public List<Complaint> getComplaintsByCitizen(Long citizenId) {
        return complaintRepository.findByCitizenId(citizenId);
    }

    public List<Complaint> getComplaintsByDepartment(Long departmentId) {
        return complaintRepository.findByDepartmentId(departmentId);
    }

    public List<Complaint> getComplaintsByAuthority(Long authorityId) {
        return complaintRepository.findByAuthorityId(authorityId);
    }

    public List<Complaint> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status);
    }

    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    // Authority updates status
    public Complaint updateComplaintStatus(Long complaintId, ComplaintStatus status, User authority) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);
        complaint.setAuthority(authority); // assign authority handling it
        return complaintRepository.save(complaint);
    }

    // Admin can reassign to another authority
    public Complaint reassignComplaint(Long complaintId, User newAuthority) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setAuthority(newAuthority);
        return complaintRepository.save(complaint);
    }
    

}
