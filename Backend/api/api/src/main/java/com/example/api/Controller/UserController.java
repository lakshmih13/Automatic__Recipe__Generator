package com.example.api.Controller;

import com.example.api.DTO.PasswordUpdateRequest;
import com.example.api.DTO.UserUpdateDto;
import com.example.api.Entity.User;
import com.example.api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/registerUser")
    public ResponseEntity<?> registerUser(@RequestBody User obj) {

        userRepository.save(obj);

        return new ResponseEntity<>("Register Successfully", HttpStatus.OK);
    }

    @GetMapping("/getusers") // Endpoint to get all users with usertype "User" excluding admin
    public List<User> getAllUsers() {
        return userRepository.findAllByUsertypeAndEmailNot("User", "admin@gmail.com");
    }

    @GetMapping("/users/{id}") // Endpoint to get a user by ID
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok().body(user))
                .orElse(ResponseEntity.notFound().build());
    }



    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody UserUpdateDto userUpdateDto) {
        Optional<User> optionalUser = userRepository.findByEmail(userUpdateDto.getOldEmail());

        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            if (userUpdateDto.getOldPassword() != existingUser.getPassword()) {
                existingUser.setEmail(userUpdateDto.getNewEmail());
                existingUser.setPassword(userUpdateDto.getNewPassword());
                userRepository.save(existingUser);
                return ResponseEntity.ok("Profile updated successfully!");
            }
        }

        return ResponseEntity.status(400).body("Failed to update profile. Invalid old email or password.");
    }
    @DeleteMapping("/users/{id}") // Endpoint to delete a user
    public ResponseEntity<Object> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }


}
