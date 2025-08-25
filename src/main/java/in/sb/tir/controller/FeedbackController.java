package in.sb.tir.controller;

import in.sb.tir.dto.FeedbackRequest;
import in.sb.tir.model.Complaint;
import in.sb.tir.model.ComplaintFeedback;
import in.sb.tir.model.User;
import in.sb.tir.repository.ComplaintFeedbackRepository;
import in.sb.tir.repository.ComplaintRepository;
import in.sb.tir.repository.UserRepository;
import in.sb.tir.service.FeedbackService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

	@Autowired
    private ComplaintRepository complaintRepository;

	@Autowired
    private FeedbackService feedbackService;
	
    @Autowired
    private ComplaintFeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ComplaintFeedback giveFeedback(@Valid @RequestBody FeedbackRequest req,
                                          Authentication authentication) {
        // 1. Get logged-in citizen
        String email = authentication.getName();
        User citizen = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find complaint
        Complaint complaint = complaintRepository.findById(req.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        // 3. Build feedback
        ComplaintFeedback feedback = new ComplaintFeedback();
        feedback.setComplaint(complaint);
        feedback.setCitizen(citizen); 
        feedback.setRating(req.getRating());
        feedback.setComment(req.getComment());

        // 4. Save
        return feedbackRepository.save(feedback);
    }
    @GetMapping("/citizen/{citizenId}")
    public List<ComplaintFeedback> getFeedbackByCitizen(@PathVariable Long citizenId) {
        return feedbackService.getFeedbackByCitizen(citizenId);
    }

    @GetMapping("/complaint/{complaintId}")
    public List<ComplaintFeedback> getFeedbackByComplaint(@PathVariable Long complaintId) {
        return feedbackService.getFeedbackByComplaint(complaintId);
    }
}
