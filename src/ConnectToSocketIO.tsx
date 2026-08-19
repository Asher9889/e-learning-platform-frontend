import { useEffect } from "react";
import { queryClient, socketIO } from "./config";


const ConnectToSocketIO = () => {

    // handle update liveclass
    useEffect(() => {
        const handleUpdate = () => {
            console.log("🔄 Live class updated, invalidating queries...");
            queryClient.invalidateQueries({
                queryKey: ["live-classes"],
            });
        };

        socketIO.on("live-class:updated", handleUpdate);

        return () => {
            socketIO.off("live-class:updated", handleUpdate);
        };
    }, [queryClient]);

    useEffect(() => {
        socketIO.connect();

        return () => {
            socketIO.disconnect()
        }
    })
    return null
}

export default ConnectToSocketIO;