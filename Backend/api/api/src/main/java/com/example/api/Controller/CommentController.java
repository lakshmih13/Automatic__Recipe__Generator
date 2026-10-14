package com.example.api.Controller;

import com.example.api.Entity.Comment;
import com.example.api.Entity.Recipe;
import com.example.api.Entity.User;
import com.example.api.Repository.CommentRepository;
import com.example.api.Repository.RecipeRepository;
import com.example.api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@CrossOrigin("*")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @GetMapping("/comments") // Maps to /comments
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }


    @GetMapping("/comments/{recipeId}")
    public ResponseEntity<List<Comment>> getFeedbackByEventId(@PathVariable Long recipeId) {
        List<Comment> feedbackList = commentRepository.findByRecipe_RecipeId(recipeId);
        return ResponseEntity.ok(feedbackList);
    }

    @PostMapping("/comments/{email}/{recipeId}")
    public ResponseEntity<String> createComment(
            @PathVariable String email,
            @PathVariable String recipeId,
            @RequestBody Comment comment) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Recipe recipe = recipeRepository.findById(Long.valueOf(recipeId))
                    .orElseThrow(() -> new RuntimeException("Recipe not found"));

            comment.setUser(user);
            comment.setRecipe(recipe);
            comment.setCreatedAt(LocalDate.now());

            commentRepository.save(comment);
            return ResponseEntity.ok("Comment submitted successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing the request: " + e.getMessage());
        }
    }


    @PutMapping("/comments/{id}") // Maps to /comments/{id}
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Comment commentDetails) {
        return commentRepository.findById(id)
                .map(comment -> {
                    comment.setContent(commentDetails.getContent());
                    Comment updatedComment = commentRepository.save(comment);
                    return ResponseEntity.ok().body(updatedComment);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/comments/{id}") // Maps to /comments/{id}
    public ResponseEntity<Object> deleteComment(@PathVariable Long id) {
        return commentRepository.findById(id)
                .map(comment -> {
                    commentRepository.delete(comment);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
