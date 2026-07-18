import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../../../store/slices/authSlice';
import { getUser } from '@/pages/Dashboard/api/dashboard.api';
import { setUser } from '@/store/slices/auth.slice';


export const useGetUser = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: getUser,
    onSuccess: (data) => {
      // API response milne par Redux update karein
      // 2. Store user in React Query cache
      // queryClient.setQueryData(['user'], data?.data?.user);
      dispatch(setUser(data));
      // localStorage.setItem('token', data.token);
    }
    
  });
};