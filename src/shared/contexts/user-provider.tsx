import { useState } from "react";

import type { User } from "../api/user";
import { UserContext } from "./user-context";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
