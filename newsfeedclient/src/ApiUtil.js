
const request = (options) => {
  const headers = new Headers();

  if (options.setContentType !== false) {
    headers.append("Content-Type", "application/json");
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options)
    .then((response) => {
        if (!response.ok) {
            return response.text().then((errorMessage) => {
                return Promise.reject(errorMessage); // Reject with the error message
            });
        }
        console.log("Request Response Received as Ok.");
        return response.text(); // Resolve with the response text
    });

};

export function sendNotification(username, notificationRequest) {
  return request({
    url: "http://localhost:8080/notification/" + username,
    method: "POST",
    body: JSON.stringify(notificationRequest),
  });
}

