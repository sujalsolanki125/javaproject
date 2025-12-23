package com.carboncalc.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Service for direct Redis cache operations
 * Complements @Cacheable annotations with manual cache control
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Store value in cache with custom TTL
     */
    public void set(String key, Object value, Duration ttl) {
        try {
            redisTemplate.opsForValue().set(key, value, ttl);
            log.debug("Cached: {} (TTL: {})", key, ttl);
        } catch (Exception e) {
            log.error("Failed to cache key: {}", key, e);
        }
    }

    /**
     * Retrieve value from cache
     */
    public Object get(String key) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            log.debug("Cache {} for key: {}", value != null ? "hit" : "miss", key);
            return value;
        } catch (Exception e) {
            log.error("Failed to get cached key: {}", key, e);
            return null;
        }
    }

    /**
     * Delete specific cache key
     */
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
            log.debug("Deleted cache key: {}", key);
        } catch (Exception e) {
            log.error("Failed to delete cache key: {}", key, e);
        }
    }

    /**
     * Delete all keys matching pattern
     */
    public void deletePattern(String pattern) {
        try {
            Set<String> keys = redisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("Deleted {} cache keys matching pattern: {}", keys.size(), pattern);
            }
        } catch (Exception e) {
            log.error("Failed to delete cache pattern: {}", pattern, e);
        }
    }

    /**
     * Check if key exists in cache
     */
    public boolean exists(String key) {
        try {
            Boolean exists = redisTemplate.hasKey(key);
            return Boolean.TRUE.equals(exists);
        } catch (Exception e) {
            log.error("Failed to check cache key existence: {}", key, e);
            return false;
        }
    }

    /**
     * Set expiration time for existing key
     */
    public void expire(String key, Duration ttl) {
        try {
            redisTemplate.expire(key, ttl);
            log.debug("Updated TTL for key: {} to {}", key, ttl);
        } catch (Exception e) {
            log.error("Failed to set expiration for key: {}", key, e);
        }
    }

    /**
     * Get remaining TTL for key
     */
    public Long getTTL(String key) {
        try {
            return redisTemplate.getExpire(key, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.error("Failed to get TTL for key: {}", key, e);
            return -1L;
        }
    }

    /**
     * Increment counter (for rate limiting)
     */
    public Long increment(String key) {
        try {
            return redisTemplate.opsForValue().increment(key);
        } catch (Exception e) {
            log.error("Failed to increment key: {}", key, e);
            return 0L;
        }
    }

    /**
     * Decrement counter
     */
    public Long decrement(String key) {
        try {
            return redisTemplate.opsForValue().decrement(key);
        } catch (Exception e) {
            log.error("Failed to decrement key: {}", key, e);
            return 0L;
        }
    }

    /**
     * Clear all caches (use with caution!)
     */
    public void clearAll() {
        try {
            Set<String> keys = redisTemplate.keys("*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.warn("Cleared all cache keys ({} keys)", keys.size());
            }
        } catch (Exception e) {
            log.error("Failed to clear all caches", e);
        }
    }
}
