package com.example.api.DTO;

import lombok.Data;

import java.time.LocalDate;
@Data
public class RecipeResponseDTO {
    private Long recipeId;
    private String title;
    private String description;
    private String nutritionaldescription;
    private byte[] imageData;
    private UserBDTO user;
    private LocalDate dateSubmitted;
    private boolean isApproved;
    private CategoryDTO category; // Include category DTO
    private SubcategoryDTO subcategory;



}