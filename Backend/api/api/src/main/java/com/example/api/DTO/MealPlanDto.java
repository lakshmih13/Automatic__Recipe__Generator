package com.example.api.DTO;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MealPlanDto {
    private LocalDate date;
    private List<Long> recipeIds;
}
