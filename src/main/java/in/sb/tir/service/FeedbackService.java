package in.sb.tir.service;

import in.sb.tir.model.ComplaintFeedback;
import in.sb.tir.repository.ComplaintFeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private ComplaintFeedbackRepository feedbackRepository;

    public ComplaintFeedback giveFeedback(ComplaintFeedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<ComplaintFeedback> getFeedbackByCitizen(Long citizenId) {
        return feedbackRepository.findByCitizenId(citizenId);
    }

    public List<ComplaintFeedback> getFeedbackByComplaint(Long complaintId) {
        return feedbackRepository.findByComplaintId(complaintId);
    }
}
