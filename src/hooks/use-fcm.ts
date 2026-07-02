import { useEffect, useRef } from "react";
import { generateFcmToken, listenForMessages } from "@/service/fcm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addNotification } from "@/store/slices/notification.slice";

export const useFcm = () => {
    const user = useAppSelector((state) => state.auth.user);
    // const unReadCount = useAppSelector((state) => state.notification?.unreadCount);
    const dispatch = useAppDispatch();
    const initialized = useRef(false);

    useEffect(() => {
        if (!user || initialized.current) return;

        initialized.current = true;

        const init = async () => {
            await generateFcmToken();

            listenForMessages((payload) => {

              console.log("receive payload callback ",payload)
                              const data = payload?.notification;
                               dispatch(addNotification(data));
console.log(payload,"recieve callback ",data)
                if (!data) return;
// dispatch(setUnreadCount(unReadCount + 1))
               

            });
            console.log("init chal rha hai callback nhi")
        };
            console.log(" outer init chal rha hai callback nhi")

        init();
    }, [user]);
};