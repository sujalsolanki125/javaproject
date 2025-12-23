package com.carboncalc.service;

import com.carboncalc.config.KafkaConfig;
import com.carboncalc.event.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * Event publisher service for Kafka event bus
 * Publishes domain events asynchronously
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Publish carbon log created event
     */
    public void publishCarbonLogCreated(CarbonLogCreatedEvent event) {
        publishEvent(KafkaConfig.CARBON_LOG_CREATED_TOPIC, event.getUserId().toString(), event);
    }

    /**
     * Publish goal achieved event
     */
    public void publishGoalAchieved(GoalAchievedEvent event) {
        publishEvent(KafkaConfig.GOAL_ACHIEVED_TOPIC, event.getUserId().toString(), event);
    }

    /**
     * Publish badge unlocked event
     */
    public void publishBadgeUnlocked(BadgeUnlockedEvent event) {
        publishEvent(KafkaConfig.BADGE_UNLOCKED_TOPIC, event.getUserId().toString(), event);
    }

    /**
     * Publish user notification event
     */
    public void publishUserNotification(UserNotificationEvent event) {
        publishEvent(KafkaConfig.USER_NOTIFICATION_TOPIC, event.getUserId().toString(), event);
    }

    /**
     * Generic event publisher with error handling
     */
    private void publishEvent(String topic, String key, Object event) {
        try {
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, key, event);

            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Published event to {}: partition={}, offset={}",
                            topic,
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish event to {}: {}", topic, ex.getMessage());
                }
            });
        } catch (Exception e) {
            log.error("Error publishing event to topic {}: {}", topic, e.getMessage(), e);
        }
    }
}
