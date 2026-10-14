package com.example.api.Controller;

import com.example.api.DTO.SubcategoryDTO;
import com.example.api.Entity.Category;
import com.example.api.Entity.Subcategory;
import com.example.api.Repository.CategoryRepository;
import com.example.api.Repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.util.List;

@RestController
@CrossOrigin("*")
public class SubcategoryController {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/subcategories") // Endpoint to get all subcategories
    public List<Subcategory> getAllSubcategories() {
        return subcategoryRepository.findAll();
    }

    @GetMapping("/subcategories/{categoryId}")
    public ResponseEntity<List<Subcategory>> getSubcategoriesByCategoryId(@PathVariable Long categoryId) {
        List<Subcategory> subcategories = subcategoryRepository.findByCategory_CategoryId(categoryId);

        if (subcategories.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(subcategories, HttpStatus.OK);
    }



    @PostMapping("/subcategories") // Endpoint to create a subcategory
    public ResponseEntity<Subcategory> createSubcategory(@RequestBody SubcategoryDTO subcategoryDto) {
        Category category = categoryRepository.findById(subcategoryDto.getCategoryId()).orElse(null);

        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Check if the subcategory already exists for this category
        if (subcategoryRepository.existsByCategoryAndSubcategoryName(category, subcategoryDto.getSubcategoryName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        Subcategory subcategory = new Subcategory();
        subcategory.setSubcategoryName(subcategoryDto.getSubcategoryName());
        subcategory.setCategory(category);

        Subcategory savedSubcategory = subcategoryRepository.save(subcategory);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSubcategory);
    }


    @PutMapping("/subcategories/{id}") // Endpoint to update a subcategory
    public ResponseEntity<Subcategory> updateSubcategory(@PathVariable Long id, @RequestBody Subcategory subcategoryDetails) {
        return subcategoryRepository.findById(id)
                .map(subcategory -> {
                    subcategory.setSubcategoryName(subcategoryDetails.getSubcategoryName());
                    subcategory.setCategory(subcategoryDetails.getCategory());
                    Subcategory updatedSubcategory = subcategoryRepository.save(subcategory);
                    return ResponseEntity.ok().body(updatedSubcategory);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/subcategories/{id}") // Endpoint to delete a subcategory
    public ResponseEntity<Object> deleteSubcategory(@PathVariable Long id) {
        return subcategoryRepository.findById(id)
                .map(subcategory -> {
                    subcategoryRepository.delete(subcategory);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
