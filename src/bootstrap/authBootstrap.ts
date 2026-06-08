import { store } from "@/store/store";
import { authService } from "@/bootstrap/bootstrap.api";
import { unauthenticated, setUser, authenticated } from "@/store/slices/auth.slice";

export const authBootstrap = async () => {
    try {
      store.dispatch(unauthenticated());
      const user = await authService.getMe();
      store.dispatch(authenticated());
      store.dispatch(setUser(user));
    } catch {
      store.dispatch(unauthenticated());
    }
  };