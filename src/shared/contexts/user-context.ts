import { createContext } from "react";

import type { User } from "../api/user";

export type UserContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextValue | null>(null);
