package DACNTT.garage.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    @Value("${jwt.refreshExpirationMs}")
    private int jwtRefreshExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    private String generateToken(UserDetailsImpl userPrincipal, int expirationMs, String tokenType) {
        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .claim("tokenType", tokenType)
                .claim("roles", userPrincipal.getAuthorities())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), Jwts.SIG.HS512)
                .compact();
    }

    public String generateJwtToken(UserDetailsImpl userPrincipal) {
        return generateToken(userPrincipal, jwtExpirationMs, "access");
    }

    public String generateRefreshToken(UserDetailsImpl userPrincipal) {
        return generateToken(userPrincipal, jwtRefreshExpirationMs, "refresh");
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String getTokenTypeFromJwtToken(String token) {
        try {
            Object tokenType = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("tokenType");

            return tokenType == null ? null : tokenType.toString();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateAccessToken(String token) {
        try {
            return "access".equals(getTokenTypeFromJwtToken(token));
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);

            return "refresh".equals(getTokenTypeFromJwtToken(token));
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
