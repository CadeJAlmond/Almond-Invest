/** ChartsSideBar.Jsx
 * @brief : This component is responsible for allowing to enter and view
 *    data and access forms in order to interact with different charts.
 *
 * -Referenced : MainDashboard.js
 */

import Button from "./Button";
import { buttonBorderRadius } from "../AppStyling_SubComponents";
import { Link } from "react-router-dom";
import { useState } from "react";

/**
 * @param { JSX } children : The form which exists within the sidebar.
 */
export default function ChartsSideBar({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Styles for the general layout of the sidebar's navigation
  const sideBarNav = [
    "flex",
    "flex-col",
    "justify-center",
    "content-center",
  ].join(" ");

  // Return a navigation menu for the
  function SideBarHeader({ collapseHeader }) {
    const { isCollapsed, setIsCollapsed } = collapseHeader;

    const sideBarHeaderStyling = [
      buttonBorderRadius,
      "h-[65px]",
      "w-[calc(100%-20px)]",
      "mx-auto",
      "flex",
      "justify-center",
      "items-center",
      "gap-4",
      "text-[#f4f4f5]",
    ].join(" ");

    return (
      <nav className={sideBarNav}>
        {/* Render buttons for chart / page navigation */}
        <header className={sideBarHeaderStyling}>
          {
            !isCollapsed && (
              <>
                <Link to="/" className="">
                  <Button>Retirement</Button>
                </Link>
                <Link to="/budgets">
                  <Button>Budgets</Button>
                </Link>
              </>
            )
          }
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="z-50 bg-[#F1655C]/65 text-white rounded-[5px] min-w-8 h-8 flex items-center justify-center text-xs shadow-md border-[2px] border-[#16181D] hover:scale-110 transition-transform cursor-pointer"
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </header>
      </nav>
    );
  }

  const sideBarStyling = [
    buttonBorderRadius,
    "max-h-[80vh] min-h-[80vh] max-md:min-h-[600px]",
    isCollapsed ? "w-[60px]" : "w-[425px] max-xl:w-[87.5vw]",
    "bg-[#16181D]",
    "border-[2px] border-[#2d323b]/90",
    "px-[10px]",
    "mt-[15px]",
    "flex",
    "flex-col",
    "content-center",
    "relative",
    "transition-all duration-300",
    "max-md:translate-x-[3.5vw]"
  ].join(" ");

  return (
    <aside className={sideBarStyling}>
      <div className="h-full w-full flex flex-col pt-4 transition-opacity duration-300">
        <SideBarHeader collapseHeader={{ isCollapsed, setIsCollapsed }} />
        {!isCollapsed && children}
      </div>
    </aside>
  );
}
