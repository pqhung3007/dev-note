import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function AuthenticationCheck({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: any;
}) {
  const { username } = useContext(UserContext);
  return username
    ? children
    : fallback || <Link href="/enter">Please sign in first</Link>;
}
