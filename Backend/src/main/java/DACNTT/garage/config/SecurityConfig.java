package DACNTT.garage.config;

import DACNTT.garage.security.JwtAuthenticationFilter;
import DACNTT.garage.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService, JwtAuthenticationFilter jwtAuthFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Thêm: cho phép mọi origin (localhost + ngrok + production)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://web-gara.vercel.app/"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // Thêm: kích hoạt CORS với config ở trên
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public routes
                        .requestMatchers("/", "/index.html", "/static/**", "/assets/**",
                                "/css/**", "/js/**", "/img/**", "/favicon.ico").permitAll()
                        .requestMatchers("/web_garage/auth/**", "/chatbot/**", "/customer/**").permitAll()

                        // Cho phép GET public (phải đặt TRƯỚC rule /admin/**)
                        .requestMatchers(HttpMethod.GET, "/admin/parts/**", "/admin/services/**").permitAll()

                        // Role cụ thể (đặt TRƯỚC rule chung /admin/**)
                        .requestMatchers("/admin/employees/**", "/admin/customers/**",
                                "/admin/branches/**", "/admin/reports/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/admin/bookings/**", "/admin/repairs/**",
                                "/admin/feedbacks/**").hasAnyRole("ADMIN", "EMPLOYEE")

                        // Rule chung nhất đặt CUỐI
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}