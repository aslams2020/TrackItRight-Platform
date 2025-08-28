package in.sb.tir.service;

import in.sb.tir.model.Notification;
import in.sb.tir.model.User;
import in.sb.tir.model.Complaint;
import in.sb.tir.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public void createNotification(User user, Complaint complaint, String message, String type) {
        Notification n = new Notification();
        n.setUser(user);
        n.setComplaint(complaint);
        n.setMessage(message);
        n.setType(type);
        repo.save(n);
    }

    public List<Notification> getUserNotifications(User user) {
        return repo.findByUserOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return repo.countByUserAndSeenFalse(user);
    }

    public void markAllAsRead(User user) {
        List<Notification> list = repo.findByUserOrderByCreatedAtDesc(user);
        list.forEach(n -> n.setSeen(true));
        repo.saveAll(list);
    }
}
