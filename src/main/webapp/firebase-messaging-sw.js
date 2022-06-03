// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/7.15.4/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/7.15.4/firebase-analytics.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.4/firebase-messaging.js');
importScripts('app/init-firebase.js');

/*
* TODO: IMPORTANT
* When you try to send a push message are you doing it while your app is on focus or not? Because from the documentation,
* it says that setBackgroundMessageHandler is only called when the Web app is closed or not in browser focus.
Based on the example code from the quickstart (https://github.com/firebase/quickstart-js/tree/master/messaging).
If your app is in focus: the push message is received via messaging.onMessage() on the index.html
If your app does not have focus : the push message is received via setBackgroundMessageHandler() on teh service worker file.
* */

const messaging = firebase.messaging && firebase.messaging.isSupported() ? firebase.messaging() : null;
// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
if(messaging){
    messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
            body: 'Background Message body.',
            icon: '/itwonders-web-logo.png'
        };
        return self.registration.showNotification(notificationTitle,
            notificationOptions);
    });
}
// [END background_handler]