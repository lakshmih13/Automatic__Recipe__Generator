package com.example.api.Controller;


import com.example.api.DTO.MealPlanDto;
import com.example.api.Entity.User;
import com.example.api.Entity.MealPlan;
import com.example.api.Repository.UserRepository;
import com.example.api.Service.MealPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/meal-plans")
public class MealPlanController {

    @Autowired
    private MealPlanService mealPlanService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{email}")
    public ResponseEntity<String> saveMealPlan(@PathVariable String email, @RequestBody MealPlanDto mealPlanDto) {
        mealPlanService.saveMealPlan(email, mealPlanDto);
        return ResponseEntity.ok("Meal plan saved successfully!");
    }


    @GetMapping("/{email}")
    public ResponseEntity<List<MealPlan>> getAllMealPlans(@PathVariable String email) {
        User user = userRepository.findByEmail(email).orElse(null); // Fetch User directly

        if (user == null) {
            return ResponseEntity.notFound().build(); // Return 404 if user not found
        }

        // Fetch meal plans for the user
        List<MealPlan> mealPlans = mealPlanService.getMealPlansByUser(user); // Pass User object
        return ResponseEntity.ok(mealPlans);
    }



    @DeleteMapping("/{email}/{mealPlanId}")
    public ResponseEntity<String> deleteMealPlan(@PathVariable String email, @PathVariable Long mealPlanId) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build(); // Return 404 if user not found
        }

        boolean deleted = mealPlanService.deleteMealPlan(mealPlanId); // Call service to delete meal plan

        if (deleted) {
            return ResponseEntity.ok("Meal plan deleted successfully!");
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if meal plan not found
        }
    }

}