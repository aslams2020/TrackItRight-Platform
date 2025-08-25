package in.sb.tir.controller;

import in.sb.tir.model.Role;
import in.sb.tir.model.User;
import in.sb.tir.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable Role role) {
        return userService.getUsersByRole(role);
    }

    @GetMapping("/department/{id}")
    public List<User> getUsersByDepartment(@PathVariable Long id) {
        return userService.getUsersByDepartment(id);
    }
}
