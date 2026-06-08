import { authBootstrap } from "./authBootstrap";

export const initializeApp = async () => {
    await authBootstrap();
};