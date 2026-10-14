package com.example.api.Service;

import com.example.api.DTO.RecipeDto;
import com.example.api.Entity.Recipe;
import com.example.api.Entity.RecipeIngredient;
import com.example.api.Entity.Ingredient;
import com.example.api.Repository.RecipeRepository;
import com.example.api.Repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    public Recipe saveRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public List<RecipeDto> findRecipesByIngredients(List<String> inputIngredients) {
        System.out.println("Input Ingredients: " + inputIngredients);

        // Normalize input ingredients
        Set<Long> inputIngredientIdsSet = inputIngredients.stream()
                .map(String::trim)
                .map(Long::parseLong) // Ensure they are parsed as Longs
                .collect(Collectors.toSet());

        System.out.println("Normalized Input Ingredient IDs: " + inputIngredientIdsSet);

        List<Recipe> allRecipes = recipeRepository.findAll();
        List<RecipeDto> suggestedRecipes = new ArrayList<>();

        for (Recipe recipe : allRecipes) {
            List<Long> recipeIngredientIds = getIngredientIdsForRecipe(recipe);
            long matchingCount = recipeIngredientIds.stream()
                    .filter(inputIngredientIdsSet::contains)
                    .count();

            System.out.println("Recipe: " + recipe.getTitle() + ", Ingredient IDs: " + recipeIngredientIds + ", Matching Count: " + matchingCount);

            double matchPercentage = recipeIngredientIds.isEmpty() ? 0 : (double) matchingCount / recipeIngredientIds.size();
            if (matchPercentage >= 0.8) {
                suggestedRecipes.add(convertToDto(recipe));
            }
        }

        System.out.println("Suggested Recipes Count: " + suggestedRecipes.size());
        return suggestedRecipes;
    }


    private List<Long> getIngredientIdsForRecipe(Recipe recipe) {
        List<Long> ingredientIds = recipe.getIngredients().stream()
                .map(RecipeIngredient::getIngredient)
                .filter(ingredient -> ingredient != null)
                .map(Ingredient::getIngredientId)
                .collect(Collectors.toList());

        System.out.println("Ingredient IDs for Recipe: " + recipe.getTitle() + " - " + ingredientIds);
        return ingredientIds;
    }


    private RecipeDto convertToDto(Recipe recipe) {
        RecipeDto dto = new RecipeDto();
        dto.setId(recipe.getRecipeId());
        dto.setTitle(recipe.getTitle());
        if (recipe.getImageData() != null) {
            MultipartFile imageFile = new MockMultipartFile("image",
                    "filename.jpg",
                    "image/jpeg",
                    recipe.getImageData());
            dto.setImage(imageFile);
        }
        // Add other fields as needed
        return dto;
    }
}
