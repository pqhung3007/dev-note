import { createContext } from "react";

interface UserData {
  user: any;
  username: string;
}

export const UserContext = createContext<UserData>({
  user: null,
  username: null,
});
