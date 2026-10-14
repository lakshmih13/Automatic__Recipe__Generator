package com.example.api.Repository;

import com.example.api.Entity.Category;
import com.example.api.Entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    boolean existsByCategoryAndSubcategoryName(Category category, String subcategoryName);

    List<Subcategory> findByCategory_CategoryId(Long categoryId);

}
