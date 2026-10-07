import { NavLink } from "react-router-dom";
import { navigation } from "../../data/navigation";
export default function Navigation() {
  return (
    <nav aria-label="Navigation principale" className="desktop-nav">
      {navigation.map((item) => (
        <NavLink key={item.to} to={item.to}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
