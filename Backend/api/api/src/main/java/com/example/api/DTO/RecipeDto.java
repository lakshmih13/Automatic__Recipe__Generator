package com.example.api.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class RecipeDto {

    private String title;
    private MultipartFile image;
    private Long categoryId;
    private Long subcategoryId;
    private String description;
    private String nutritionalDescription;
    private List<IngredientDto> ingredients; // List of ingredients
}
