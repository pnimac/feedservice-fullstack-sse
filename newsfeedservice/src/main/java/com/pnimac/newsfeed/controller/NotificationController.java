package com.pnimac.newsfeed.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.pnimac.newsfeed.model.NotificationRequest;
import com.pnimac.newsfeed.payload.RedisNotificationPayload;
import com.pnimac.newsfeed.redisPub.RedisMessagePublisher;
import com.pnimac.newsfeed.service.EmitterService;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@CrossOrigin("*")
public class NotificationController {

	@Autowired
	private EmitterService emitService;

	@Autowired
	private RedisMessagePublisher redisMessagePublisher;

	@GetMapping("/subscription")
	public SseEmitter subscribe() {
		SseEmitter emitter = new SseEmitter(24 * 60 * 60 * 1000l);
		emitService.addEmitter(emitter);
		log.info("Subscribed successfully.");
		return emitter;

	}

	@PostMapping("/notification/{username}")
	public ResponseEntity<?> send(@PathVariable String username, @RequestBody NotificationRequest request) {
		redisMessagePublisher.publish(new RedisNotificationPayload(username, request.getFrom(), request.getMessage()));
		return ResponseEntity.ok().body(username);
	}
}
