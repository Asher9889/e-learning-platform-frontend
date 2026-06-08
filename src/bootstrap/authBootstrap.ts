import { store } from "@/store/store";
import { authService } from "@/bootstrap/bootstrap.api";
import { unauthenticated, authenticated } from "@/store/slices/auth.slice";

export const authBootstrap = async () => {
    try {
      const user = await authService.getMe();
      store.dispatch(authenticated(user));
    } catch {
      store.dispatch(unauthenticated());
    }
  };