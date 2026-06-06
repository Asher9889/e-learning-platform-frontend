import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/slices/authSlice';
import { PATHS } from '@/routes';

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(PATHS.LOGIN, { replace: true });
  };

  return handleLogout;
};