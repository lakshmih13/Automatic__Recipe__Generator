package com.example.api.Repository;

import com.example.api.Entity.Recipe;
import com.example.api.Entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {
    // Custom queries can be defined here if needed
    List<RecipeIngredient> findByRecipe(Recipe recipe);


}