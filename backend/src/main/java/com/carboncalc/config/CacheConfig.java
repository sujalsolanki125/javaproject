package com.carboncalc.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

/**
 * Additional cache configuration for Carbon Interface API responses
 * Provides long-term caching for static data
 */
@Configuration
public class CacheConfig {

    /**
     * Long-term cache manager for static data (vehicle makes/models)
     * Used for data that rarely changes
     */
    @Bean("longTermCacheManager")
    public CacheManager longTermCacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(Arrays.asList("vehicleMakes", "vehicleModels", "staticData"));
        return cacheManager;
    }
}