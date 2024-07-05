package com.pnimac.newsfeed.redisSub;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pnimac.newsfeed.payload.RedisNotificationPayload;
import com.pnimac.newsfeed.service.EmitterService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RedisMessageSubscriber implements MessageListener {

	ObjectMapper objectMapper = new ObjectMapper();
	
	private EmitterService emitterService;
 
	@Autowired
	public RedisMessageSubscriber(EmitterService emitterService) {
		this.emitterService = emitterService;
	}

    @Override
	public void onMessage(final Message message, final byte[] pattern) {
        try {
            var notificationPayload = objectMapper.readValue(message.toString(), RedisNotificationPayload.class);

            emitterService.pushNotification(
                    notificationPayload.getUsername(),
                    notificationPayload.getFrom(),
                    notificationPayload.getMessage());

        } catch (JsonProcessingException e) {
            log.error("unable to deserialize message ", e);
        }
    }
}