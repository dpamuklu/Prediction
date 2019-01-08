console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  // console.log(e.data.text())
  console.log(e.data[title]);
  console.log("Push Recieved.2.2.");
  self.registration.showNotification(data.title, {
    body: "Notified by Traversy Media!!!",
    icon: ""
  })
});
