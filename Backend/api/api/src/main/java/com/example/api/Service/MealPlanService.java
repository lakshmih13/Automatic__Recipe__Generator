package com.example.api.Service;

import com.example.api.DTO.MealPlanDto;
import com.example.api.Entity.MealPlan;
import com.example.api.Entity.User;
import com.example.api.Repository.MealPlanRepository;
import com.example.api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MealPlanService {
    @Autowired
    private MealPlanRepository mealPlanRepository;

    @Autowired
    private UserRepository userRepository;


    public void saveMealPlan(String email, MealPlanDto mealPlanDto) {
        MealPlan mealPlan = new MealPlan();
        mealPlan.setDate(mealPlanDto.getDate());
        mealPlan.setRecipeIds(mealPlanDto.getRecipeIds());

        // Find the user by email
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        mealPlan.setUser(user);
        mealPlanRepository.save(mealPlan);
    }





    public List<MealPlan> getAllMealPlans() {
        return mealPlanRepository.findAll();
    }













    public List<MealPlan> getMealPlansByUser(User user) {
        return mealPlanRepository.findByUser(user); // Fetch meal plans by User
    }


    public boolean deleteMealPlan(Long mealPlanId) {
        if (mealPlanRepository.existsById(mealPlanId)) {
            mealPlanRepository.deleteById(mealPlanId);
            return true; // Deletion successful
        }
        return false; // Meal plan not found
    }



}