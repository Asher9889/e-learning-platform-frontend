import { useMutation } from '@tanstack/react-query';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../../../store/slices/authSlice';
import { getUser } from '../api/dashboard.api';


export const useGetUser = () => {
  // const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: getUser,
    onSuccess: (data) => {
      // API response milne par Redux update karein
      console.log(data,"adsasdasd get user")
      // 2. Store user in React Query cache
      // queryClient.setQueryData(['user'], data?.data?.user);
      // dispatch(loginSuccess([]));
      // localStorage.setItem('token', data.token);
    }
    
  });
};