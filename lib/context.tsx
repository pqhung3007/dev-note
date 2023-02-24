import { createContext } from "react";

interface UserData {
  user: User;
  username: string;
}

interface User {
  avatarUrl?: string;
  username?: string;
  displayName?: string;
}

export const UserContext = createContext<UserData>({
  user: null,
  username: null,
});
