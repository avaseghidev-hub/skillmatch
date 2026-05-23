package com.azadeh.skillmatch.auth.service;

import com.azadeh.skillmatch.auth.dto.AuthResponse;
import com.azadeh.skillmatch.auth.dto.LoginRequest;
import com.azadeh.skillmatch.auth.dto.RegisterRequest;
import com.azadeh.skillmatch.auth.security.JwtService;
import com.azadeh.skillmatch.common.exception.DuplicateResourceException;
import com.azadeh.skillmatch.common.exception.InvalidCredentialsException;
import com.azadeh.skillmatch.user.entity.User;
import com.azadeh.skillmatch.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {

        user = new User();

        user.setId(1L);
        user.setName("Azadeh");
        user.setEmail("test@test.com");
        user.setPassword("encoded-password");
        user.setCreatedAt(LocalDateTime.now());
    }

    // Should register a new user and return JWT token.
    @Test
    void register_ShouldCreateUserSuccessfully() {

        RegisterRequest request = new RegisterRequest();

        request.setName("Azadeh");
        request.setEmail("test@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("password123"))
                .thenReturn("encoded-password");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        when(jwtService.generateToken("test@test.com"))
                .thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);

        assertEquals(1L, response.getUserId());

        assertEquals("Azadeh", response.getName());

        assertEquals("test@test.com", response.getEmail());

        assertEquals("jwt-token", response.getToken());

        assertEquals(
                "Registration successful",
                response.getMessage()
        );
    }

    // Should throw exception when email is already registered.
    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {

        RegisterRequest request = new RegisterRequest();

        request.setName("Azadeh");
        request.setEmail("test@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        assertThrows(
                DuplicateResourceException.class,
                () -> authService.register(request)
        );

        verify(userRepository, never()).save(any());
    }

    // Should login successfully with valid credentials.
    @Test
    void login_ShouldReturnAuthResponse_WhenCredentialsAreValid() {

        LoginRequest request = new LoginRequest();

        request.setEmail("test@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "password123",
                "encoded-password"
        )).thenReturn(true);

        when(jwtService.generateToken("test@test.com"))
                .thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);

        assertEquals(1L, response.getUserId());

        assertEquals("jwt-token", response.getToken());

        assertEquals(
                "Login successful",
                response.getMessage()
        );
    }

    // Should throw exception when email does not exist.
    @Test
    void login_ShouldThrowException_WhenEmailDoesNotExist() {

        LoginRequest request = new LoginRequest();

        request.setEmail("missing@test.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("missing@test.com"))
                .thenReturn(Optional.empty());

        assertThrows(
                InvalidCredentialsException.class,
                () -> authService.login(request)
        );
    }

    // Should throw exception when password is incorrect.
    @Test
    void login_ShouldThrowException_WhenPasswordIsInvalid() {

        LoginRequest request = new LoginRequest();

        request.setEmail("test@test.com");
        request.setPassword("wrong-password");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "wrong-password",
                "encoded-password"
        )).thenReturn(false);

        assertThrows(
                InvalidCredentialsException.class,
                () -> authService.login(request)
        );
    }
}