package in.sb.tir.dto;

import in.sb.tir.model.Notification;

public class NotificationDto {
    public Long id;
    public String message;
    public boolean seen;
    public String complaintTitle;
    public Long complaintId;
    public String createdAt;
    public String type;  // Add type here

    public static NotificationDto fromEntity(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.id = n.getId();
        dto.message = n.getMessage();
        dto.seen = n.isSeen();
        dto.complaintTitle = n.getComplaint().getTitle();
        dto.complaintId = n.getComplaint().getId();
        dto.createdAt = n.getCreatedAt().toString();
        dto.type = n.getType();
        return dto;
    }
}
