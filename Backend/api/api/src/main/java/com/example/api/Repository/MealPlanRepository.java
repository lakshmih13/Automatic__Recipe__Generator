package com.example.api.Repository;

import com.example.api.Entity.MealPlan;
import com.example.api.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {

    List<MealPlan> findByUser(User user);
}
