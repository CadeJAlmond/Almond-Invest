/** ChartsSideBar.Jsx
 * @brief : This component is responsible for allowing to enter and view
 *    data and access forms in order to interact with different charts.
 *
 * -Referenced : MainDashboard.js
 */

/* --=== Imports ===-- */
import Button from "./Button";
import { buttonBorderRadius } from "../AppStyling_SubComponents";
import { Link } from "react-router-dom";

/**
 * @param { JSX } children : The form which exists within the sidebar.
 */
export default function ChartsSideBar({ children  }) {
  // Styles for the general layout of the sidebar's navigation
  const sideBarNav = [
    "flex",
    "flex-col",
    "justify-center",
    "content-center",
  ].join(" ");

  // Return a navigation menu for the
  function SideBarHeader() {
    const sideBarHeaderStyling = [
      buttonBorderRadius,
      "h-[70px]",
      "w-[calc(80% + 20px)]",
      "bg-[#0a0b0d]/85",
      "mx-[-10px]",
      "flex",
      "justify-center",
      "flex-wrap",
      "items-center",
      "gap-4",
      "text-[#f4f4f5]",
    ].join(" ");

    const sideBarHeaderBtnStylingConfig = {
      color: "bg-[#F1655C]/45",
    };

    return (
      <nav className={sideBarNav}>
        {/* Render buttons for chart / page navigation */}
        <header className={sideBarHeaderStyling}>
          <Link to="/" className="">
            <Button>Retirement</Button>
          </Link>
          <Link to="/budgets">
            <Button>Budgets</Button>
          </Link>
        </header>
      </nav>
    );
  }

  const sideBarStyling = [
    buttonBorderRadius,
    "max-h-[80vh] min-h-[80vh] max-xl:h-[470px]",
    "w-[364px] max-xl:w-[87.5vw]",
    "bg-[#0a0b0d]/65",
    "px-[10px]",
    "flex",
    "flex-col",
    "content-center",
  ].join(" ");

  return (
    <aside className={sideBarStyling}>
      <SideBarHeader />
      {children}
    </aside>
  );
}
