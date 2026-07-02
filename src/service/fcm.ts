import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/config/firebase";
import { sileo } from "sileo";
import { fcmService } from "./fcm.service";
// import { useAppSelector } from "@/store/hooks";

const VAPID_KEY = "BJzf1qFmp9yHPBvfiv-dcuRZraKPPIfbhlBcMjyogBPImAJkig28mP3PZ0ZAagbtQ1WtKpztYVZnT3GdZuRBLhg";
export const generateFcmToken = async (): Promise<string | null> => {
    try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.warn("Notification permission not granted");
            return null;
        }

        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
        });

        if (!token) {
            console.warn("No FCM token generated");
            return null;
        }

        console.log("FCM Token:", token);
        if (token) {
            await fcmService.addFcmToken(token);
        }
        // Send to backend
        // await axios.post("http://localhost:5000/api/save-fcm-token", {
        //   token,
        // });

        return token;
    } catch (error) {
        console.error("Error generating FCM token:", error);
        return null;
    }
};

// Foreground messages handler
export const listenForMessages = (callback: (payload: any) => void) => {
    onMessage(messaging, (payload) => {
        console.log("Foreground message:", payload);
        const notification = payload.notification;
         callback(payload);

        if (notification) {
            // `${payload.notification.title} - ${payload.notification.body}`
            console.log("send callback ",payload)
            sileo.info({
                title: notification.title,
                description: notification.body,

            }
            );
        }
    });
};