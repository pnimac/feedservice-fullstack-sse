package com.pnimac.newsfeed.redisPub;

import com.pnimac.newsfeed.payload.RedisNotificationPayload;

public interface MessagePublisher {

	void publish(final RedisNotificationPayload message);

}
