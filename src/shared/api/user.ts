import { apiClient } from "./client";

export type User = {
  googleId: string;
  name: string;
  email: string;
  onboarding: boolean;
  sensivity: string[];
  activity_time: { type: string; time: string }[];
  favorite_place: { name: string; dong: string }[];
  felt_temperature_0: number;
  felt_temperature_10: number;
  felt_temperature_20: number;
  felt_temperature_30: number;
  water_intake: number;
  body_type: number;
  age: number;
  activity_level: number;
};

export function getUser(): Promise<User> {
  return apiClient<User>("/user/get");
}
