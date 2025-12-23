package com.carboncalc.controller;

import com.carboncalc.config.JwtUtil;
import com.carboncalc.dto.AuthResponse;
import com.carboncalc.dto.LoginRequest;
import com.carboncalc.dto.RegisterRequest;
import com.carboncalc.entity.User;
import com.carboncalc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = userService.createUser(user);

        UserDetails userDetails = userService.loadUserByUsername(savedUser.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token, savedUser.getUsername(), savedUser.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        User user = userService.getUserByUsername(request.getUsername()).orElseThrow();

        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getEmail()));
    }
}
