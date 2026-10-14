package com.example.api.Service;


import com.example.api.DTO.RecipeResponseDTO;
import com.example.api.Entity.Recipe;
import com.example.api.Entity.RecipeIngredient;
import com.example.api.Repository.IngredientRepository;
import com.example.api.Repository.RecipeIngredientRepository;
import com.example.api.Repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private RecipeIngredientRepository recipeIngredientRepository;




public List<RecipeResponseDTO> findRecipesByIngredients(List<String> ingredientIds) {
    // Fetch all approved recipes
    List<Recipe> allApprovedRecipes = recipeRepository.findByIsApprovedTrue();
    List<RecipeResponseDTO> suggestedRecipes = new ArrayList<>();

    // Convert ingredientIds from String to Long if necessary
    Set<Long> ingredientIdSet = ingredientIds.stream()
            .map(Long::valueOf) // Assuming the input is a List<String>
            .collect(Collectors.toSet());

    for (Recipe recipe : allApprovedRecipes) {
        List<RecipeIngredient> recipeIngredients = recipe.getIngredients();
        long totalIngredients = recipeIngredients.size();
        if (totalIngredients == 0) continue; // Skip recipes with no ingredients

        long matchCount = recipeIngredients.stream()
                .filter(ri -> ingredientIdSet.contains(ri.getIngredient().getIngredientId()))
                .count();

        double matchPercentage = (double) matchCount / totalIngredients;
        if (matchPercentage > 0.3) { // More than 30% match
            suggestedRecipes.add(convertToDto(recipe)); // Convert to RecipeResponseDTO
        }
    }

    return suggestedRecipes;
}

    public RecipeResponseDTO convertToDto(Recipe recipe) {
        RecipeResponseDTO dto = new RecipeResponseDTO();
        dto.setRecipeId(recipe.getRecipeId());
        dto.setTitle(recipe.getTitle());
        dto.setImageData(recipe.getImageData());
        dto.setDescription(recipe.getDescription());
        dto.setNutritionaldescription(recipe.getNutritionaldescription());
        // Set other fields as necessary
        return dto;
    }



}
