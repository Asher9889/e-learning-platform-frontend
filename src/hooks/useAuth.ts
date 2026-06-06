import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { loginUser } from '../services/authService';

export const useLogin = () => {
      const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // API response milne par Redux update karein
      console.log(data,"adsasdasd")
      // 2. Store user in React Query cache
      queryClient.setQueryData(['user'], data?.data?.user);
      dispatch(loginSuccess(data?.data?.user));
      localStorage.setItem('token', data.token);
    }
  });
};