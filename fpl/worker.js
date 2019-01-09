console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  // console.log('This push event has data: ', e.data.text());

  console.log("Push Recieved.2.2.");
  self.registration.showNotification(data.title, {
    body: "Data yenilendi!",
    icon: ""
  })
});
