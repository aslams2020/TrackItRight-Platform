package in.sb.tir.repository;

import in.sb.tir.model.ComplaintFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintFeedbackRepository extends JpaRepository<ComplaintFeedback, Long> {
    List<ComplaintFeedback> findByCitizenId(Long citizenId);
    List<ComplaintFeedback> findByComplaintId(Long complaintId);
}
