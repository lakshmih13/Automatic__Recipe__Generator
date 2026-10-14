package com.example.api.Repository;

import com.example.api.DTO.RecipeDto;
import com.example.api.Entity.Recipe;
import com.example.api.Entity.User;
import jdk.jfr.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {




    List<Recipe> findByUser(User user);


    List<Recipe> findByIsApprovedTrue();

    List<Recipe> findByIsApprovedFalse();


}