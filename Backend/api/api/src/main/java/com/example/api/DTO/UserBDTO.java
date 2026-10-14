package com.example.api.DTO;

import lombok.Data;

@Data
public class UserBDTO {
    private Long userId;
    private String email;
    private boolean isBlocked;
}

