package in.sb.tir.service;

import in.sb.tir.model.*;
import in.sb.tir.repository.ComplaintFeedbackRepository;
import in.sb.tir.repository.ComplaintRepository;
import in.sb.tir.repository.UserRepository;
import jakarta.transaction.Transactional;

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
	    complaint.setUpdatedAt(LocalDateTime.now());
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

	// Core policy: must be assigned to currentAuthority and not RESOLVED to mutate status.
	private void assertCanMutateStatus(Complaint c, User currentAuthority) {
	    if (c.getAuthority() == null) {
	        throw new RuntimeException("Assign complaint to yourself before updating.");
	    }
	    if (!c.getAuthority().getId().equals(currentAuthority.getId())) {
	        throw new RuntimeException("Only assigned authority can update this complaint.");
	    }
	    if (c.getStatus() == ComplaintStatus.RESOLVED) {
	        throw new RuntimeException("Resolved complaints cannot be updated.");
	    }
	}

	// For remarks, we allow adding remarks whenever assigned to the same authority, unless RESOLVED.
	private void assertCanAddRemark(Complaint c, User currentAuthority) {
	    if (c.getAuthority() == null) {
	        throw new RuntimeException("Assign complaint to yourself before adding remarks.");
	    }
	    if (!c.getAuthority().getId().equals(currentAuthority.getId())) {
	        throw new RuntimeException("Only the assigned authority can add remarks.");
	    }
	    if (c.getStatus() == ComplaintStatus.RESOLVED) {
	        throw new RuntimeException("Resolved complaints cannot be remarked.");
	    }
	}

	// Admin can reassign to another authority
	@Transactional
	public Complaint reassignComplaint(Long complaintId, User newAuthority) {
	    Complaint complaint = complaintRepository.findById(complaintId)
	        .orElseThrow(() -> new RuntimeException("Complaint not found"));
	    complaint.setAuthority(newAuthority);
	    complaint.setUpdatedAt(LocalDateTime.now());
	    if (complaint.getStatus() == ComplaintStatus.PENDING) {
	        complaint.setStatus(ComplaintStatus.IN_PROGRESS);
	    }
	    return complaintRepository.save(complaint);
	}

	// Authority: list all complaints for own department (read-only visibility)
	public List<Complaint> getComplaintsForAuthorityDepartment(String authorityEmail) {
	    User authority = userRepository.findByEmail(authorityEmail)
	        .orElseThrow(() -> new RuntimeException("Authority not found"));
	    if (authority.getRole() == null || !"AUTHORITY".equalsIgnoreCase(authority.getRole().toString())
	            || authority.getDepartment() == null) {
	        throw new RuntimeException("Invalid authority or department not set");
	    }
	    Department dept = authority.getDepartment();
	    return complaintRepository.findByDepartmentId(dept.getId());
	}

	// Authority: assign to self (required before updates)
	@Transactional
	public Complaint assignToSelf(Long complaintId, String authorityEmail) {
	    User authority = userRepository.findByEmail(authorityEmail)
	        .orElseThrow(() -> new RuntimeException("Authority not found"));
	    if (authority.getRole() == null || !"AUTHORITY".equalsIgnoreCase(authority.getRole().toString())
	            || authority.getDepartment() == null) {
	        throw new RuntimeException("Invalid authority or department not set");
	    }
	    Complaint c = complaintRepository.findById(complaintId)
	        .orElseThrow(() -> new RuntimeException("Complaint not found"));
	    if (!c.getDepartment().getId().equals(authority.getDepartment().getId())) {
	        throw new RuntimeException("Cannot assign complaint from another department");
	    }
	    if (c.getAuthority() != null && !c.getAuthority().getId().equals(authority.getId())) {
	        throw new RuntimeException("Complaint already assigned to " + c.getAuthority().getName());
	    }
	    c.setAuthority(authority);
	    if (c.getStatus() == ComplaintStatus.PENDING) {
	        c.setStatus(ComplaintStatus.IN_PROGRESS);
	    }
	    c.setUpdatedAt(LocalDateTime.now());
	    return complaintRepository.save(c);
	}

	// Authority: update status (requires assigned to me; blocks if RESOLVED)
	@Transactional
	public Complaint updateStatusByAuthority(Long complaintId, String authorityEmail, ComplaintStatus status) {
	    User authority = userRepository.findByEmail(authorityEmail)
	        .orElseThrow(() -> new RuntimeException("Authority not found"));
	    if (authority.getRole() == null || !"AUTHORITY".equalsIgnoreCase(authority.getRole().toString())
	            || authority.getDepartment() == null) {
	        throw new RuntimeException("Invalid authority or department not set");
	    }
	    Complaint c = complaintRepository.findById(complaintId)
	        .orElseThrow(() -> new RuntimeException("Complaint not found"));
	    if (!c.getDepartment().getId().equals(authority.getDepartment().getId())) {
	        throw new RuntimeException("Cannot update complaint from another department");
	    }
	    assertCanMutateStatus(c, authority);
	    c.setStatus(status);
	    c.setUpdatedAt(LocalDateTime.now());
	    return complaintRepository.save(c);
	}

	// Authority: add remark (requires assigned to me; blocks if RESOLVED)
	@Transactional
	public Complaint updateRemarksByAuthority(Long complaintId, String authorityEmail, String remark) {
	    User authority = userRepository.findByEmail(authorityEmail)
	        .orElseThrow(() -> new RuntimeException("Authority not found"));
	    if (authority.getRole() == null || !"AUTHORITY".equalsIgnoreCase(authority.getRole().toString())
	            || authority.getDepartment() == null) {
	        throw new RuntimeException("Invalid authority or department not set");
	    }
	    Complaint c = complaintRepository.findById(complaintId)
	        .orElseThrow(() -> new RuntimeException("Complaint not found"));
	    if (!c.getDepartment().getId().equals(authority.getDepartment().getId())) {
	        throw new RuntimeException("Cannot update complaint from another department");
	    }
	    // Allow remarks as long as assigned to me and not RESOLVED
	    assertCanAddRemark(c, authority);

	    String existing = c.getRemarks();
	    c.setRemarks((existing == null || existing.isBlank()) ? remark : existing + " | " + remark);
	    c.setUpdatedAt(LocalDateTime.now());
	    return complaintRepository.save(c);
	}

	// Legacy method (if still used anywhere): keep but enforce policy; prefer updateStatusByAuthority instead
	@Transactional
	public Complaint updateComplaintStatus(Long complaintId, ComplaintStatus status, User authority) {
	    Complaint c = complaintRepository.findById(complaintId)
	        .orElseThrow(() -> new RuntimeException("Complaint not found"));
	    assertCanMutateStatus(c, authority);
	    c.setStatus(status);
	    c.setUpdatedAt(LocalDateTime.now());
	    return complaintRepository.save(c);
	}
}