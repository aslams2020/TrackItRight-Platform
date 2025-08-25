package in.sb.tir.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers("/api/auth/**").permitAll()

                // Admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Authority (specific GET rule first)
                .requestMatchers(HttpMethod.GET, "/api/complaints/department/**").hasRole("AUTHORITY")
                .requestMatchers("/api/authority/**").hasRole("AUTHORITY")

                // User
                .requestMatchers(HttpMethod.POST, "/api/complaints").hasRole("USER")
                .requestMatchers("/api/user/**").hasRole("USER")

                // All authenticated users can fetch complaints
                .requestMatchers("/api/complaints/**").hasAnyRole("USER", "AUTHORITY", "ADMIN")

                // Everything else requires auth
                .anyRequest().authenticated()
            );

        // Custom log filter for debugging which URL is coming in
        http.addFilterBefore((request, response, chain) -> {
            System.out.println("➡️ Incoming: " + ((HttpServletRequest) request).getMethod() + " " + request.getRequestId());
            chain.doFilter(request, response);
        }, UsernamePasswordAuthenticationFilter.class);

        // JWT filter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
