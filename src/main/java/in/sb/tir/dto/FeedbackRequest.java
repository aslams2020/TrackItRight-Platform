package in.sb.tir.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;


public class FeedbackRequest {
	@jakarta.validation.constraints.NotNull
    private Long complaintId;
    @Min(1)
    @Max(5)
    private int rating;
    private String comment;

    
    public Long getComplaintId() {
        return complaintId;
    }
    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }

    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}

    
}
