import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TNotification } from "@/pages/Notification/schema/notification.schema";

interface NotificationState {
    notifications: TNotification[];
    unreadCount: number;
    // loading: boolean;
    // page: number;
    // hasMore: boolean;
}
const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {

        setNotifications(state, action: PayloadAction<TNotification[]>) {
            state.notifications = action.payload;
        },

        addNotification(state, action: PayloadAction<TNotification>) {

            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
console.log(state.unreadCount,"state.unreadCount callback")
            
        },


        setUnreadCount(state, action: PayloadAction<number>) {
            state.unreadCount = action.payload;
        },

        markAsReadLocal(state, action: PayloadAction<string>) {
            const notif = state.notifications.find(
                (n) => n.id === action.payload
            );

            if (notif && !notif.isRead) {
                notif.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },

        markAllAsReadLocal(state) {
            state.notifications.forEach((n) => {
                n.isRead = true;
            });
            state.unreadCount = 0;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    setUnreadCount,
    markAsReadLocal,
    markAllAsReadLocal,
} = notificationSlice.actions;

export default notificationSlice.reducer;