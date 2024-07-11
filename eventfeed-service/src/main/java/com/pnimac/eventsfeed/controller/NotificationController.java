package com.pnimac.eventsfeed.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.pnimac.eventsfeed.model.NotificationRequest;
import com.pnimac.eventsfeed.payload.RedisNotificationPayload;
import com.pnimac.eventsfeed.redisPub.RedisMessagePublisher;
import com.pnimac.eventsfeed.service.EmitterService;

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
	    // Create a new SseEmitter with a timeout of 24 hours (in milliseconds)
		SseEmitter emitter = new SseEmitter(24 * 60 * 60 * 1000l);
	  
		// Add the created emitter to a service that manages emitters
		emitService.addEmitter(emitter);
		log.info("Subscribed successfully.");
	    
		// Return the emitter to the client
		return emitter;
	}

	@PostMapping("/notification/{username}")
	public ResponseEntity<?> send(@PathVariable String username, @RequestBody NotificationRequest request) {
		redisMessagePublisher.publish(new RedisNotificationPayload(username, request.getFrom(), request.getMessage()));
		return ResponseEntity.ok().body(username);
	}
}
