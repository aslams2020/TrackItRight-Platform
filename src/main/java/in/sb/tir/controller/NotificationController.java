package in.sb.tir.controller;

import in.sb.tir.model.Notification;
import in.sb.tir.model.User;
import in.sb.tir.service.NotificationService;
import in.sb.tir.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    // DTO for sending notification data to frontend
    public static class NotificationDto {
        public Long id;
        public String message;
        public boolean seen;
        public String complaintTitle;
        public Long complaintId;
        public String createdAt;

        public static NotificationDto fromEntity(Notification n) {
            NotificationDto dto = new NotificationDto();
            dto.id = n.getId();
            dto.message = n.getMessage();
            dto.seen = n.isSeen();
            dto.complaintTitle = n.getComplaint().getTitle();
            dto.complaintId = n.getComplaint().getId();
            dto.createdAt = n.getCreatedAt().toString();
            return dto;
        }
    }

    @GetMapping
    public List<NotificationDto> getNotifications(Authentication auth) {
        User user = userService.findByEmail(auth.getName()).orElseThrow();
        List<Notification> notifications = notificationService.getUserNotifications(user);
        return notifications.stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/unreadCount")
    public Map<String, Long> getUnreadCount(Authentication auth) {
        User user = userService.findByEmail(auth.getName()).orElseThrow();
        long count = notificationService.getUnreadCount(user);
        return Map.of("unreadCount", count);
    }

    @PostMapping("/markAllRead")
    public void markAllAsRead(Authentication auth) {
        User user = userService.findByEmail(auth.getName()).orElseThrow();
        notificationService.markAllAsRead(user);
    }
}
