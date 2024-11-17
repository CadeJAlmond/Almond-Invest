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
    "bg-[#111518]",
    "border-b-[5px]",
    "border-[#cb372d]/70",
  ].join(" ");

  const centerAndFlex = ["flex", "content-end", "justify-between", "flex-row"].join(" ");

  // Styles for the group of navigation links
  const navStyling = [
    centerAndFlex,
    "flex-wrap",
    "h-[58px]",
    "w-[100%]",
    "px-[32px]",
    "mb-[14px]",
  ].join(" ");

  const websiteNameStyling = ["text-3xl", "text-[#ffffffde]", "max-md:translate-y-[30px]" ].join(" ");

  // Styles for links
  const navigationLinksStyling = [
    centerAndFlex,
    "w-[260px]",
    "mt-[8px]",  
    "h-[26px"
  ].join(" ");

  // Styles for links TEXT
  const navLinkTextStyling = ["text-lg", "text-[#ffffffde]"].join(" ");

  // Navigation links to show header
  const links = [
  ];

  function NavLinksMenu() {
    return links.map((link) => {
      return (
        <Link className={navLinkTextStyling}  to={link.ahref}> 
          {link.name} 
        </Link>
      );
    })
  };

  return (
    <header className={headerStyling}>
      <nav className={navStyling}>
        <Link to="/">
          <p className={websiteNameStyling}>Almond-Budgets</p>
        </Link>
        <div className={navigationLinksStyling  + " mt-[8px] h-[26px]"}>
          <NavLinksMenu/>
        </div>
      </nav>
    </header>
  );
}
