/** Headers.js
 * @return : This class defines the header layout for the app.
 *
 * -Referenced : AppLayout
 */

/* --=== Imports ===-- */
import { Link } from "react-router-dom";

export default function Header() {
  // Styles for the header
  const headerStyling = [
    "bg-[#0F1115]",
    "border-b-[2px]",
    "border-[#2d323b]/70",
  ].join(" ");

  const centerAndFlex = ["flex", "content-end", "justify-between", "flex-row"].join(" ");

  // Styles for the group of navigation links
  const navStyling = [
    centerAndFlex,
    "flex-wrap",
    "h-[48px]",
    "w-[100%]",
    "px-[32px]",
    "mb-[10px]",
  ].join(" ");

  const websiteNameStyling = ["text-2xl", "text-[#ffffffde]", "letter-spacing-[2px]", "max-md:translate-y-[30px]"].join(" ");

  return (
    <header className={headerStyling}>
      <nav className={navStyling}>
        <Link to="/">
          <p className={websiteNameStyling}>ALMOND<span className="text-[#c1514a]">-BUDGETS</span></p>
        </Link>
      </nav>
    </header>
  );
}
