package com.example.api.Controller;

import com.example.api.DTO.*;
import com.example.api.Entity.*;
import com.example.api.Repository.*;
import com.example.api.Service.RecipeService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*") // Allow cross-origin requests
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private RecipeIngredientRepository recipeIngredientRepository;

    @Autowired
    private RecipeService recipeService;

    // Fetch a single recipe by recipeId
    @GetMapping("/getRecipeById/{recipeId}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long recipeId) {
        return recipeRepository.findById(recipeId)
                .map(recipe -> new ResponseEntity<>(recipe, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Fetch all recipes by user email
    @GetMapping("/getRecipesByEmail/{email}")
    public ResponseEntity<List<Recipe>> getRecipesByEmail(@PathVariable String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            List<Recipe> recipes = recipeRepository.findByUser(userOptional.get());
            return new ResponseEntity<>(recipes, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // User not found
        }
    }


    // Fetch all recipes IsApprovedTrue
    @GetMapping("/getAllRecipes")
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        List<Recipe> recipes = recipeRepository.findByIsApprovedTrue(); // Use the new method
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }


    @GetMapping("/getAllRecipesFalse")
    public ResponseEntity<List<Recipe>> getAllRecipesFalse() {
        List<Recipe> recipes = recipeRepository.findByIsApprovedFalse(); // Use the new method
        return new ResponseEntity<>(recipes, HttpStatus.OK);
    }








    @GetMapping("/api/recipes/{recipeId}/ingredients")
    public ResponseEntity<List<Ingredient>> getIngredientsByRecipeId(@PathVariable Long recipeId) {
        // Fetch the recipe by its ID
        Optional<Recipe> recipeOptional = recipeRepository.findById(recipeId);

        if (recipeOptional.isPresent()) {
            Recipe recipe = recipeOptional.get();

            // Fetch ingredients associated with the recipe
            List<RecipeIngredient> recipeIngredients = recipeIngredientRepository.findByRecipe(recipe);

            // Extracting the ingredient list from RecipeIngredient
            List<Ingredient> ingredients = recipeIngredients.stream()
                    .map(RecipeIngredient::getIngredient)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ingredients);
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if recipe not found
        }
    }







    // Create a new recipe
    @PostMapping("/createRecipe/{email}")
    public ResponseEntity<String> createRecipe(
            @PathVariable String email,
            @RequestParam("title") String title,
            @RequestParam("image") MultipartFile image,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "subcategoryId", required = false) Long subcategoryId,
            @RequestParam("description") String description,
            @RequestParam("nutritionalDescription") String nutritionalDescription,
            @RequestParam("ingredients") String ingredientsJson) {

        try {
            // Check if the image file is empty
            if (image.isEmpty()) {
                return ResponseEntity.badRequest().body("Image file is empty.");
            }

            byte[] imageBytes = image.getBytes();

            // Find user by email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Fetch and set the category
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            // Parse the JSON string into a List of IngredientDto
            ObjectMapper objectMapper = new ObjectMapper();
            List<IngredientDto> ingredients = objectMapper.readValue(ingredientsJson, new TypeReference<List<IngredientDto>>() {});

            // Create the Recipe object
            Recipe recipe = new Recipe();
            recipe.setTitle(title);
            recipe.setImageData(imageBytes);
            recipe.setUser(user);
            recipe.setCategory(category);
            recipe.setSubcategory(subcategoryId != null ? subcategoryRepository.findById(subcategoryId).orElse(null) : null);
            recipe.setDescription(description);
            recipe.setNutritionaldescription(nutritionalDescription);
            recipe.setDateSubmitted(LocalDate.now());
            recipe.setIsApproved(false);

            // Save the recipe
            recipeRepository.save(recipe);

            // Save ingredients
            for (IngredientDto ingredientDto : ingredients) {
                Optional<Ingredient> ingredient = ingredientRepository.findById(ingredientDto.getIngredientId());
                if (ingredient.isPresent()) {
                    RecipeIngredient recipeIngredient = new RecipeIngredient();
                    recipeIngredient.setRecipe(recipe);
                    recipeIngredient.setIngredient(ingredient.get());
                    recipeIngredientRepository.save(recipeIngredient);
                } else {
                    return new ResponseEntity<>("Ingredient with ID " + ingredientDto.getIngredientId() + " not found", HttpStatus.NOT_FOUND);
                }
            }

            return new ResponseEntity<>("Recipe created successfully!", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error parsing ingredients: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/generateRecipes")
    public ResponseEntity<List<RecipeResponseDTO>> generateRecipes(@RequestBody List<String> ingredients) {
        // Log the input ingredients to the console
        System.out.println("Input ingredients: " + ingredients);

        List<RecipeResponseDTO> recipes = recipeService.findRecipesByIngredients(ingredients);
        return ResponseEntity.ok(recipes);
    }

    // Update recipe approval status
    @PutMapping("/approveRecipe/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipeDetails) {
        return recipeRepository.findById(id)
                .map(recipe -> {
                    recipe.setIsApproved(recipeDetails.getIsApproved());
                    return ResponseEntity.ok().body(recipeRepository.save(recipe));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update recipe details by user
    @PutMapping("/recipesUser/{id}")
    public ResponseEntity<Recipe> updateRecipeUser(@PathVariable Long id, @RequestBody Recipe recipeDetails) {
        return recipeRepository.findById(id)
                .map(recipe -> {
                    recipe.setTitle(recipeDetails.getTitle());
                    recipe.setDescription(recipeDetails.getDescription());
                    recipe.setNutritionaldescription(recipeDetails.getNutritionaldescription());
                    return ResponseEntity.ok().body(recipeRepository.save(recipe));
                })
                .orElse(ResponseEntity.notFound().build());
    }


//    @DeleteMapping("/rejectRecipe/{id}")
//     public ResponseEntity<Object> deleteRecipe(@PathVariable Long id) {
//        try {
//            System.out.println("Attempting to delete recipe with id: " + id);
//
//        return recipeRepository.findById(id)
//                .map(recipe -> {
//                    recipeRepository.delete(recipe);
//                    System.out.println("Recipe with id: " + id + " deleted successfully.");
//                    return ResponseEntity.noContent().build();
//                })
//                .orElseGet(() -> {
//                    System.out.println("Recipe with id: " + id + " not found.");
//                    return ResponseEntity.notFound().build();
//                });
//    } catch (Exception e) {
//        System.err.println("Error occurred while deleting recipe with id: " + id);
//        e.printStackTrace();
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting recipe: " + e.getMessage());
//    }
//}


}
