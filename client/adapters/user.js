import apiService from "../services/apiService";
import { useQuery, useQueryClient, useMutation } from "react-query";
import Router from 'next/router'


export  function useFetchUser(userId) {
  return useQuery(["userData", userId], () =>
    apiService.get(`user/${userId}`).then(({ data }) => data)
  );
}

export  function useMutateLoginUser() {
  return useMutation(
    (user) => {
      const data = new FormData();
      data.append("email", user.email);
      data.append("password", user.password);
      return apiService.post(`user/login`, data);
    },
    {
      // When mutate is called:
      onSuccess: (responseData) => {
        localStorage.setItem('jwt', responseData)
      },
      onError: (e) => console.log(e.message),
    }
  );
}


export  function useMutateRegisterUser() {
  return useMutation(
    (user) => {
      const data = new FormData();
      data.append("email", user.email);
      data.append("password", user.password);
      return apiService.post(`user/register`, data);
    },
    {
      // When mutate is called:
      onSuccess: (responseData) => {
          responseData = window.location.replace("/login");
        // Redirect to login page
      },
      onError: (e) => console.log(e.message),
    }
  );
}

export  function useMutateUpdateUser(userId) {
  const queryClint = useQueryClient();
  return useMutation(
    (user) => {
      const data = new FormData();
      data.append("email", user.email);
      data.append("password", user.password);
      return apiService.post(`user/${userId}`, data);
    },
    {
      // When mutate is called:
      onSuccess: (responseData) => {
        return queryClint.setQueryData(
          ["userData", userId],
          (data) => {
            return [
              {
                email: responseData.data.body.email,
                password: responseData.data.body.password,
              },
              ...data,
            ];
          }
        );
      },
      onError: (e) => console.log(e.message),
    }
  );
}