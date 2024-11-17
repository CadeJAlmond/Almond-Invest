/** DropdownMenu.Jsx
 * @brief : This component is responsible for displaying an interactive
 *    container when clicked will open a menu os options for the user
 *    to select from.
 *
 * -Referenced : App.js
 */

/* --=== Imports ===-- */
import { Component, useState } from "react";

import { applyCustomStyles } from "../components/subcomponents/ApplyCustomStyles";

/**
 * @brief : 
 * @param {String} inputName 
 * @returns 
 */
export function createFormDropdownMenu(formInputName, value, items, text){
  return {
    FormInputComponent : DropdownMenu,
    formInputProps : {
        [formInputName] : {
          value, items, text,
        }
    }
  }
}

/**
 * @param {React.JSX} children : The JSX for the menu which is to be
 *    shown when a user clicks on the dropdown container.  
 * @param {object} styles : The desires styles we want incorporated 
 *    into this dropdown menu.
 * @param {string} selectedItem : The item currently selected from
 *    provided menu. 
 * @param {string} placeholderText : Text to be shown if no selectedItem
 *    is provided.
 * @returns {Component} An interactive dropdown-menu.
 */
export default function DropdownMenu({children, styles = {}, selectedItem, placeholderText = "" }) {
  const [openMenu, setOpenedMenu] = useState(false);

  // Setup styles for the dropdown menu
  const defaultStylings = {
    h: "min-h-[37.5px] max-h-[37.5px]",
    p: "px-[15px]",
    color: "text-[#ffffff]",
    bg: "bg-[transparent]",
    b: "border-[2.5px] border-[#F1655C]/65",
    text: "text-[17px] text-[#f4f4f5]/80",
    border: "rounded-[5px]",
    text: "text-[20px] text-[#ffffff]",
    flex: "flex",
    place: "place-content-between",
    wrap: "flex-wrap",
    relative: "relative",
    w: "min-w-[90%] max-w-[90%]",
    item: "items-center",
    cursor: "cursor-pointer"
  };

  // Apply custom styles on top of the default styles
  const dropdownMenuStyling = applyCustomStyles(defaultStylings, styles);

  const openedMenuCss = [
    "flex",
    "flex-col",
    "gap-[2.5px]",
    "bg-[#0a0b0d]/95",
    "w-[100%]",
    "border-[2.5px]",
    "border-[#F1655C]/45",
    "rounded-[5px]",
  ].join(" ");

  return (
    <>
      <div
        className={dropdownMenuStyling}
        onClick={() => setOpenedMenu(!openMenu)}
      >
        <div className="">{selectedItem}</div>
        <div>
          {openMenu ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              class="bi bi-caret-up"
              viewBox="0 0 16 16"
            >
              <path d="M3.204 11h9.592L8 5.519zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              class="bi bi-caret-down"
              viewBox="0 0 16 16"
            >
              <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659" />
            </svg>
          )}
        </div>
        <ul className={openMenu ? openedMenuCss : " w-[100%] "}>
          {openMenu && children}
        </ul>
      </div>
    </>
  );
}
