import { useEffect } from "react";
import { socketIO } from "./config";


const ConnectToSocketIO = () => {

    useEffect(() => {
        socketIO.connect();

        () => {
            socketIO.disconnect()
        }
    })
    return null
}

export default ConnectToSocketIO;