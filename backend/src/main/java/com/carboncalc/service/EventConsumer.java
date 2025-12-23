package com.carboncalc.service;

import com.carboncalc.config.KafkaConfig;
import com.carboncalc.event.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

/**
 * Event consumer service for Kafka event bus
 * Listens to domain events and triggers appropriate actions
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EventConsumer {

    // @KafkaListener will be used to consume events
    // For now, implementing logging consumers

    @KafkaListener(topics = KafkaConfig.CARBON_LOG_CREATED_TOPIC, groupId = "carbon-calc-group")
    public void consumeCarbonLogCreated(
            @Payload CarbonLogCreatedEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {

        log.info("Received CarbonLogCreated event: userId={}, emission={}, category={} (partition={})",
                event.getUserId(), event.getCarbonEmission(), event.getCategory(), partition);

        // TODO: Trigger analytics update
        // TODO: Check if goals achieved
        // TODO: Check if badges unlocked
    }

    @KafkaListener(topics = KafkaConfig.GOAL_ACHIEVED_TOPIC, groupId = "carbon-calc-group")
    public void consumeGoalAchieved(
            @Payload GoalAchievedEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {

        log.info("Received GoalAchieved event: userId={}, goal={} (partition={})",
                event.getUserId(), event.getGoalTitle(), partition);

        // TODO: Send notification to user
        // TODO: Update user achievements
        // TODO: Award carbon points
    }

    @KafkaListener(topics = KafkaConfig.BADGE_UNLOCKED_TOPIC, groupId = "carbon-calc-group")
    public void consumeBadgeUnlocked(
            @Payload BadgeUnlockedEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {

        log.info("Received BadgeUnlocked event: userId={}, badge={} (partition={})",
                event.getUserId(), event.getBadgeName(), partition);

        // TODO: Send notification to user
        // TODO: Update leaderboard
        // TODO: Award carbon points
    }

    @KafkaListener(topics = KafkaConfig.USER_NOTIFICATION_TOPIC, groupId = "carbon-calc-group")
    public void consumeUserNotification(
            @Payload UserNotificationEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {

        log.info("Received UserNotification event: userId={}, type={}, priority={} (partition={})",
                event.getUserId(), event.getNotificationType(), event.getPriority(), partition);

        // TODO: Store notification in database
        // TODO: Send email if weeklyReports enabled
        // TODO: Send push notification if enabled
    }
}
