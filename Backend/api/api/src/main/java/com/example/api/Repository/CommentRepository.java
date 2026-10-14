package com.example.api.Repository;

import com.example.api.Entity.Comment;
import com.example.api.Entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByRecipe_RecipeId(Long recipeId);
//    List<Comment> findByRecipe(Recipe recipe);
}
