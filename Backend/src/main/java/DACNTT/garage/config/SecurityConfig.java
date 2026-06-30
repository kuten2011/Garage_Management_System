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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:4173",
                "https://web-gara.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/static/**", "/assets/**",
                                "/css/**", "/js/**", "/img/**", "/favicon.ico", "/health").permitAll()

                        .requestMatchers("/auth/**", "/api/auth/**", "/chatbot/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/public/**", "/api/public/**").permitAll()

                        .requestMatchers("/admin/employees/**", "/api/admin/employees/**",
                                "/admin/customers/**", "/api/admin/customers/**",
                                "/admin/branches/**", "/api/admin/branches/**",
                                "/admin/reports/**", "/api/admin/reports/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers("/admin/bookings/**", "/api/admin/bookings/**",
                                "/admin/repairs/**", "/api/admin/repairs/**",
                                "/admin/feedbacks/**", "/api/admin/feedbacks/**",
                                "/admin/part-orders/**", "/api/admin/part-orders/**")
                        .hasAnyRole("ADMIN", "EMPLOYEE")

                        .requestMatchers("/customer/**", "/api/customer/**").hasRole("CUSTOMER")
                        .requestMatchers("/admin/**", "/api/admin/**").hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
