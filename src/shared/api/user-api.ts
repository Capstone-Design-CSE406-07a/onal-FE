import { http } from './http';
import type { UserEnrollRequest, UserResponse } from './types';

export const userApi = {
  enroll: (body: UserEnrollRequest) =>
    http.post<UserResponse>('/user/enroll', body),

  get: () =>
    http.get<UserResponse>('/user/get'),
};
