import type { TNotification } from "@/pages/Notification/schema/notification.schema";
import type { NavigateFunction } from "react-router-dom";


export function notificationNavigate(

    navigate: NavigateFunction,

    notification: TNotification

) {

    switch (notification.type) {

        case "COURSE_CREATED":

            navigate(`/courses/${notification.entityId}`);

            break;

        case "MATERIAL_PUBLISHED":

            navigate(`/materials/${notification.entityId}`);

            break;

        case "QUIZ_PUBLISHED":

            navigate(`/quiz/${notification.entityId}`);

            break;

        case "ASSIGNMENT_CREATED":

            navigate(`/assignments/${notification.entityId}`);

            break;

        default:

            navigate("/notifications");

    }

}