package com.example.api.Controller;

import com.example.api.Entity.Ingredient;
import com.example.api.Repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class IngredientController {

    @Autowired
    private IngredientRepository ingredientRepository;

    @GetMapping("/getingredients") // Unique path for getting all ingredients
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

//    @GetMapping("/ingredients/{id}") // Unique path for getting ingredient by ID
//    public ResponseEntity<Ingredient> getIngredientById(@PathVariable Long id) {
//        return ingredientRepository.findById(id)
//                .map(ingredient -> ResponseEntity.ok().body(ingredient))
//                .orElse(ResponseEntity.notFound().build());
//    }

    @PostMapping("/ingredients") // Unique path for creating an ingredient
    public ResponseEntity<Ingredient> createIngredient(@RequestBody Ingredient ingredient) {
        Ingredient savedIngredient = ingredientRepository.save(ingredient);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedIngredient);
    }

    @PutMapping("/ingredients/{id}") // Unique path for updating an ingredient
    public ResponseEntity<Ingredient> updateIngredient(@PathVariable Long id, @RequestBody Ingredient ingredientDetails) {
        return ingredientRepository.findById(id)
                .map(ingredient -> {
                    ingredient.setIngredientName(ingredientDetails.getIngredientName());
                    Ingredient updatedIngredient = ingredientRepository.save(ingredient);
                    return ResponseEntity.ok().body(updatedIngredient);
                })
                .orElse(ResponseEntity.notFound().build());
    }

//    @DeleteMapping("/ingredients/{id}")
//    public ResponseEntity<Object> deleteIngredient(@PathVariable Long id) {
//        try {
//            return ingredientRepository.findById(id)
//                    .map(ingredient -> {
//                        ingredientRepository.delete(ingredient);
//                        return ResponseEntity.noContent().build(); // Return 204 No Content
//                    })
//                    .orElse(ResponseEntity.notFound().build()); // Return 404 Not Found
//        } catch (Exception e) {
//            e.printStackTrace(); // Log the exception
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error deleting ingredient: " + e.getMessage()); // Return 500 Internal Server Error
//        }
//    }

}
