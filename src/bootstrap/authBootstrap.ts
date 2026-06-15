import { store } from "@/store/store";
import { authService } from "@/bootstrap/bootstrap.api";
import { unauthenticated, setUser, authenticated, authChecking } from "@/store/slices/auth.slice";

export const authBootstrap = async () => {
    try {
      store.dispatch(unauthenticated());
      store.dispatch(setUser(null));
      store.dispatch(authChecking());

      const user = await authService.getMe();

      console.log(user,"useruseruseruser")
      store.dispatch(authenticated());
      store.dispatch(setUser(user));

    } catch {
      store.dispatch(unauthenticated());
    }
};