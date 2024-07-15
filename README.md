# Description

This project integrates Server-Sent Events (SSE) with Redis Pub/Sub to enable real-time push notifications to the browser. The primary objective is to publish events to a Redis Pub/Sub channel. Spring is configured to subscribe to this channel, converting any received events into HTTP Server-Sent Events (SSE), which are then delivered to the React client in the browser.

# Architecture

![Architecture](images/architecture.png)

# Features

We are implementing a scalable real-time push notification feed in our application.

* Landing Page: Users are presented with a login screen. Upon successful login, the user establishes a long-lived HTTP SSE (Server-Sent Events) connection and subscribes to notifications. The username serves as the topic ID for the user's notifications.

* Event Publishing Screen: This screen provides a tool for publishing events from the browser to a Redis Pub/Sub channel. The "TO" field specifies the recipient's username (topic ID) to which the message (event) will be published.

* Real-Time Interaction: Multiple users can log in concurrently, send messages (events) to each other, and receive real-time push notifications in their respective UIs.

* Notification Display: Notifications are displayed in real-time through a popup at the bottom-left of the user screen. Additionally, the notification count displayed on the bell icon in the menu bar and the dropdown menu accessed by clicking the bell icon are updated instantaneously.

# Components and work-flow

![Sequence](images/sequence.png)

## 1. Server-Sent Events (SSE):

SSE maintain a long-lived connection between the client and server. When the client requests the SSE endpoint, the server responds with a content type of text/event-stream. This special content type tells the client to expect a stream of events rather than a single response. The client automatically reconnects if the connection is closed, ensuring reliability.

## 2. SseEmitter object

SseEmitter in Spring abstracts much of the low-level details, making it easier for developers to use SSE in their applications. Life Cylce of this object includes:

* Initialization: When a request is made to an endpoint that returns an SseEmitter, Spring initializes the SseEmitter object. This object represents the open connection to the client.

* Open Connection: The SseEmitter is initialized with a default or user-defined timeout value. This timeout determines how long the connection will remain open if no events are sent. Spring sets up the necessary HTTP headers to establish an SSE connection. This includes setting the Content-Type header to text/event-stream.

* Client Subscription: When a client subscribes to the SSE endpoint, it includes a unique identifier (clientId) in the request. The server maps this clientId to the corresponding SseEmitter.

* Event Dispatching: To send an event to a specific client, the server uses the clientId to look up the corresponding SseEmitter and sends the event through it.

* Event Transmission: The server can send events to the client by calling the send method on the SseEmitter instance. The data is formatted according to the SSE protocol (e.g., with data: and event: prefixes). Each event sent through the SseEmitter is automatically transmitted to the connected client.

* Connection Close: The connection can be closed by the server explicitly or if it times out or encounters an error. The client can also close the connection.

## 4. EmitterService:

This service manages a list of SseEmitter instances. It provides methods to add new emitters and push notifications to clients. When a notification is pushed, it sends the notification to all registered emitters.

## 5. Redis PubSub:

Redis Pub/Sub (Publish/Subscribe) is a messaging pattern provided by Redis that allows messages to be sent and received between different clients in a decoupled manner.

## 6. RedisMessagePublisher:

The RedisMessagePublisher handles publishing messages to a Redis Pub/Sub channel. 

## 7. RedisMessageSubscriber:

This class listens to messages from Redis. When a message is received, it deserializes the message to a RedisNotificationPayload object. It then calls the EmitterService to push the notification to the clients via SSE.

# Screenshots

![screenshot](images/screenshot.png)


# Technology Stack

* Java  
* Spring Boot 
* Server Side Events 
* Redis pub/sub
* React 


# Prerequisite

* Ensure you have Maven installed. You can verify this by running `mvn -v` in your terminal.

* Ensure you have JDK installed. You can verify this by running `java -version` in your terminal.

* Ensure you have Node.js and npm (Node Package Manager) installed. You can verify this by running `node -v` and `npm -v` in your terminal.
  

# Testing

1. Navigate to the backend service project directory and run command:

`mvn clean install && mvn spring-boot:run`


2. Navigate to the React client project directory and run command:

`npm install && npm start`

