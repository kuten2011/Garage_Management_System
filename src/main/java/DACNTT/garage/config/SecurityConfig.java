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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/static/**", "/assets/**",
                                "/css/**", "/js/**", "/img/**", "/favicon.ico").permitAll()

                        // login backend
                        .requestMatchers("/web_garage/auth/**", "/chatbot/**", "/customer/**").permitAll()

                        // cho phép GET parts + services nếu bạn muốn xem public
                        .requestMatchers(HttpMethod.GET, "/admin/parts/**", "/admin/services/**").permitAll()

                        // các route admin còn lại → phải ADMIN
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        .requestMatchers("/admin/bookings", "/admin/repairs", "/admin/parts", "/admin/services", "/admin/vehicles", "/admin/feedbacks").hasRole("EMPLOYEE")

                        .requestMatchers("/admin/employees", "/admin/customers", "/admin/vehicles", "/admin/branches", "/admin/feedbacks", "/admin/reports").hasRole("MANAGER")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}