package com.example.api.Controller;

import com.example.api.DTO.PasswordUpdateRequest;
import com.example.api.DTO.UserDTO;
import com.example.api.Entity.User;
import com.example.api.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class AdminController {


    @Autowired
    private UserRepository userRepository;


    @PutMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(@RequestBody PasswordUpdateRequest request) {
        if (request.getNewPassword() == null || request.getOldPassword() == null || request.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body("Old password, new password, and confirm password are required.");
        }
        User admin = userRepository.findByUsertype(("Admin"));
        if (admin == null) {
            return ResponseEntity.status(404).body("Admin user not found.");
        }

        if (!admin.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.badRequest().body("Invalid current password.");
        }

        admin.setPassword(request.getNewPassword());
        userRepository.save(admin);

        return ResponseEntity.ok("Password updated successfully.");
    }


    @PostMapping("/user/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {

        if (userDTO.getUsertype().equals("User")) {
            var data = userRepository.findByEmailAndUsertype(userDTO.getEmail(), "User")
                    .orElseThrow(() -> new RuntimeException("Email not associated with User type"));

            if (data.getPassword().equals(userDTO.getPassword())) {
                return new ResponseEntity<>("User", HttpStatus.OK);
            } else {
                // Changed status code to UNAUTHORIZED for password mismatch
                return new ResponseEntity<>("Invalid User Password", HttpStatus.UNAUTHORIZED);
            }


    } else if (userDTO.getEmail().equals("admin@gmail.com")) {
            var data = userRepository.findByEmail(userDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));



            if (data.getPassword().equals(userDTO.getPassword())) {
                return new ResponseEntity<>("Admin", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid user Password", HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>("Invalid usertype", HttpStatus.UNAUTHORIZED);
        }
    }


}
