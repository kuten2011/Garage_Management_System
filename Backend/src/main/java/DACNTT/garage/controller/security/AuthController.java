package DACNTT.garage.controller.security;

import DACNTT.garage.dto.security.JwtResponse;
import DACNTT.garage.dto.security.LoginRequest;
import DACNTT.garage.dto.security.RefreshTokenRequest;
import DACNTT.garage.dto.security.RegisterRequest;
import DACNTT.garage.handle.CustomerHandle;
import DACNTT.garage.security.JwtUtils;
import DACNTT.garage.security.UserDetailsImpl;
import DACNTT.garage.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private CustomerHandle customerHandle;

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtils jwtUtils,
                          UserDetailsServiceImpl userDetailsService,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtils.generateJwtToken(
                    (UserDetailsImpl) authentication.getPrincipal()
            );

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String refreshToken = jwtUtils.generateRefreshToken(userDetails);

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    refreshToken,
                    userDetails.getUsername(),
                    userDetails.getAuthorities()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401)
                    .body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {
        return customerHandle.registerCustomer(request);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (refreshToken == null || refreshToken.isBlank() || !jwtUtils.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).body("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        String username = jwtUtils.getUserNameFromJwtToken(refreshToken);
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(username);

        String newAccessToken = jwtUtils.generateJwtToken(userDetails);
        String newRefreshToken = jwtUtils.generateRefreshToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(
                newAccessToken,
                newRefreshToken,
                userDetails.getUsername(),
                userDetails.getAuthorities()
        ));
    }

}
