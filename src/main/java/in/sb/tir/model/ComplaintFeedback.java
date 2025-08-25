package in.sb.tir.model;

import jakarta.persistence.*;

@Entity
@Table(name = "complaint_feedback")
public class ComplaintFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @ManyToOne
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    private int rating; // 1-5
    private String comment;

    public ComplaintFeedback() {}

    public ComplaintFeedback(Long id, Complaint complaint, User citizen, int rating, String comment) {
        this.id = id;
        this.complaint = complaint;
        this.citizen = citizen;
        this.rating = rating;
        this.comment = comment;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
