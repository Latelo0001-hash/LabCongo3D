import { Link } from "react-router-dom";
import type { PropsWithChildren } from "react";
export default function Button({
  to,
  children,
  secondary = false,
}: PropsWithChildren<{ to: string; secondary?: boolean }>) {
  return (
    <Link className={`button ${secondary ? "button-secondary" : ""}`} to={to}>
      {children}
    </Link>
  );
}
