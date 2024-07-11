package com.pnimac.eventsfeed.payload;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Notification {

	private String from;
	private String message;
}
