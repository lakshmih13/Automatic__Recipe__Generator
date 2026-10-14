package com.example.api.Repository;

import com.example.api.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {



    Optional<User> findByEmail(String email);

    User findByUsertype(String usertype);

    Optional<User> findByEmailAndUsertype(String email, String usertype);

    List<User> findAllByUsertypeAndEmailNot(String usertype, String email);




}