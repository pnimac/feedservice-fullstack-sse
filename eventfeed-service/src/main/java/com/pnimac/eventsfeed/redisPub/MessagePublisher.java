package com.pnimac.eventsfeed.redisPub;

import com.pnimac.eventsfeed.payload.RedisNotificationPayload;

public interface MessagePublisher {

	void publish(final RedisNotificationPayload message);

}
