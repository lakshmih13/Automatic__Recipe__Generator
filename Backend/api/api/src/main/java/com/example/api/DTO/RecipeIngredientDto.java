package com.example.api.DTO;

import lombok.Data;

import java.util.List;

@Data
public class RecipeIngredientDto {
    private Long recipeId;
    private List<Long> ingredientIds;
}
