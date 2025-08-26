package in.sb.tir.service;

import in.sb.tir.model.*;
import in.sb.tir.repository.ComplaintFeedbackRepository;
import in.sb.tir.repository.ComplaintRepository;
import in.sb.tir.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import in.sb.tir.model.ComplaintStatus;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ComplaintFeedbackRepository feedbackRepository;

    // Citizen files complaint
    public Complaint createComplaint(Complaint complaint) {
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
        complaint.setAuthority(authority);
        return complaintRepository.save(complaint);
    }

    // Admin can reassign to another authority
    public Complaint reassignComplaint(Long complaintId, User newAuthority) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setAuthority(newAuthority);
        return complaintRepository.save(complaint);
    }

    // === NEW Authority workflow methods ===

    public List<Complaint> getComplaintsForAuthorityDepartment(String authorityEmail) {
        User authority = userRepository.findByEmail(authorityEmail)
                .orElseThrow(() -> new RuntimeException("Authority not found"));
        if (authority.getRole() != Role.AUTHORITY || authority.getDepartment() == null) {
            throw new RuntimeException("Invalid authority or department not set");
        }
        return complaintRepository.findByDepartmentId(authority.getDepartment().getId());
    }

    public Complaint assignToSelf(Long complaintId, String authorityEmail) {
        User authority = userRepository.findByEmail(authorityEmail)
                .orElseThrow(() -> new RuntimeException("Authority not found"));

        if (authority.getRole() != Role.AUTHORITY || authority.getDepartment() == null) {
            throw new RuntimeException("Invalid authority or department not set");
        }

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getDepartment().getId().equals(authority.getDepartment().getId())) {
            throw new RuntimeException("Cannot assign complaint from another department");
        }

        complaint.setAuthority(authority);
        if (complaint.getStatus() == ComplaintStatus.PENDING) {
            complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        }

        return complaintRepository.save(complaint);
    }

    public Complaint updateStatusByAuthority(Long complaintId, String authorityEmail, ComplaintStatus status) {
        User authority = userRepository.findByEmail(authorityEmail)
                .orElseThrow(() -> new RuntimeException("Authority not found"));

        if (authority.getRole() != Role.AUTHORITY || authority.getDepartment() == null) {
            throw new RuntimeException("Invalid authority or department not set");
        }

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getDepartment().getId().equals(authority.getDepartment().getId())) {
            throw new RuntimeException("Cannot update complaint from another department");
        }

        if (complaint.getAuthority() == null) {
            complaint.setAuthority(authority);
        }

        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }

    public Complaint updateRemarksByAuthority(Long complaintId, String authorityEmail, String remark) {
        User authority = userRepository.findByEmail(authorityEmail)
                .orElseThrow(() -> new RuntimeException("Authority not found"));

        if (authority.getRole() != Role.AUTHORITY || authority.getDepartment() == null) {
            throw new RuntimeException("Invalid authority or department not set");
        }

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getDepartment().getId().equals(authority.getDepartment().getId())) {
            throw new RuntimeException("Cannot update complaint from another department");
        }

        complaint.setRemarks(remark);
        return complaintRepository.save(complaint);
    }
    
//    
// // Complaints per department
//    public Map<String, Long> countComplaintsPerDepartment() {
//        List<Complaint> all = complaintRepository.findAll();
//        return all.stream()
//                .filter(c -> c.getDepartment() != null)
//                .collect(Collectors.groupingBy(c -> c.getDepartment().getName(), Collectors.counting()));
//    }
//
//    // Complaints by status
//    public Map<ComplaintStatus, Long> countComplaintsByStatus() {
//        List<Complaint> all = complaintRepository.findAll();
//        return all.stream()
//                .collect(Collectors.groupingBy(Complaint::getStatus, Collectors.counting()));
//    }
//
//    // Average rating (citizen satisfaction)
//    public double averageCitizenRating() {
//        List<ComplaintFeedback> feedbacks = feedbackRepository.findAll();
//        return feedbacks.isEmpty() ? 0 : feedbacks.stream().mapToInt(ComplaintFeedback::getRating).average().orElse(0);
//    }

    
    
}
