package com.carboncalc.config;

import com.carboncalc.service.CacheService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting filter using token bucket algorithm
 * Limits API requests per user/IP to prevent abuse
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final CacheService cacheService;

    // In-memory fallback if Redis is unavailable
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    // Rate limits by user role
    private static final int ADMIN_REQUESTS_PER_MINUTE = 200;
    private static final int USER_REQUESTS_PER_MINUTE = 100;
    private static final int ANONYMOUS_REQUESTS_PER_MINUTE = 20;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Skip rate limiting for health checks and actuator endpoints
        String path = request.getRequestURI();
        if (path.startsWith("/actuator") || path.equals("/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = getRateLimitKey(request);
        Bucket bucket = resolveBucket(key);

        if (bucket.tryConsume(1)) {
            // Request allowed
            filterChain.doFilter(request, response);
        } else {
            // Rate limit exceeded
            log.warn("Rate limit exceeded for key: {}", key);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Rate limit exceeded. Please try again later.\"}");
        }
    }

    /**
     * Generate rate limit key based on user or IP
     */
    private String getRateLimitKey(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return "rate_limit:user:" + auth.getName();
        }

        // Use IP address for unauthenticated requests
        String ip = getClientIP(request);
        return "rate_limit:ip:" + ip;
    }

    /**
     * Get client IP address (handles proxies)
     */
    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }

        return request.getRemoteAddr();
    }

    /**
     * Resolve or create bucket for given key
     */
    private Bucket resolveBucket(String key) {
        // Try to get from cache first (in-memory fallback)
        return cache.computeIfAbsent(key, k -> createNewBucket(k));
    }

    /**
     * Create new bucket with appropriate limits
     */
    private Bucket createNewBucket(String key) {
        int requestsPerMinute;

        if (key.contains(":user:")) {
            // Authenticated user - check role
            // For simplicity, using USER limit. Can enhance with role-based logic
            requestsPerMinute = USER_REQUESTS_PER_MINUTE;
        } else {
            // Anonymous/IP-based
            requestsPerMinute = ANONYMOUS_REQUESTS_PER_MINUTE;
        }

        Bandwidth limit = Bandwidth.classic(
                requestsPerMinute,
                Refill.intervally(requestsPerMinute, Duration.ofMinutes(1)));

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
