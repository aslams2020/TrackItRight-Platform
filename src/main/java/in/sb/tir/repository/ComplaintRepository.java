package in.sb.tir.repository;

import in.sb.tir.model.Complaint;
import in.sb.tir.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenId(Long citizenId);
    List<Complaint> findByDepartmentId(Long departmentId);
    List<Complaint> findByDepartmentIdAndStatus(Long departmentId, ComplaintStatus status);
    List<Complaint> findByCitizenIdAndStatus(Long citizenId, ComplaintStatus status);
    List<Complaint> findByAuthorityId(Long authorityId);
    List<Complaint> findByStatus(ComplaintStatus status);
}
