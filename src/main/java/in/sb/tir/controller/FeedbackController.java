// src/main/java/in/sb/tir/controller/FeedbackController.java
package in.sb.tir.controller;

import in.sb.tir.model.Complaint;
import in.sb.tir.model.ComplaintFeedback;
import in.sb.tir.repository.ComplaintFeedbackRepository;
import in.sb.tir.repository.ComplaintRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final ComplaintRepository complaintRepository;
    private final ComplaintFeedbackRepository feedbackRepository;

    public FeedbackController(ComplaintRepository complaintRepository,
                              ComplaintFeedbackRepository feedbackRepository) {
        this.complaintRepository = complaintRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public static class FeedbackRequest {
        public int rating;        // 1..5
        public String comment;    // optional
    }

    @PostMapping("/complaints/{id}")
    public ResponseEntity<?> submitFeedback(@PathVariable Long id,
                                            @RequestBody FeedbackRequest req,
                                            @RequestHeader("X-User-Id") Long callerUserId // or from JWT SecurityContext
    ) {
        if (req.rating < 1 || req.rating > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }

        Complaint c = complaintRepository.findById(id)
                .orElse(null);
        if (c == null) return ResponseEntity.notFound().build();

        // Only complaint owner can rate
        if (!c.getCitizen().getId().equals(callerUserId)) {
            return ResponseEntity.status(403).body("Only complaint owner can submit feedback");
        }
        // Only if resolved, and not rated yet
        if (c.getStatus() != in.sb.tir.model.ComplaintStatus.RESOLVED) {
            return ResponseEntity.badRequest().body("Feedback allowed only after resolution");
        }
        if (c.getFeedback() != null) {
            return ResponseEntity.badRequest().body("Feedback already submitted");
        }

        ComplaintFeedback fb = new ComplaintFeedback();
        fb.setComplaint(c);
        fb.setCitizen(c.getCitizen());
        fb.setRating(req.rating);
        fb.setComment(req.comment);
        // optionally: createdAt
        ComplaintFeedback saved = feedbackRepository.save(fb);

        // link back (if needed)
        c.setFeedback(saved);
        complaintRepository.save(c);

        return ResponseEntity.ok(saved);
    }
}
