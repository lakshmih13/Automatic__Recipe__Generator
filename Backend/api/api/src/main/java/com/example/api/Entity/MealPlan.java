package com.example.api.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class MealPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long meal_plan_id;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ElementCollection
    @CollectionTable(name = "meal_plan_recipes", joinColumns = @JoinColumn(name = "meal_plan_id"))
    @Column(name = "recipe_id")
    private List<Long> recipeIds;
}
