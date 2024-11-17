/** BudgetCard.jsx
 * @returns { Component } : A card which displays identifiable 
 *    information about a "budget" which includes a name and 
 *    percentageOfIncome. The values of the budget can be edited, 
 *    and the budget can be deleted.
 *
 * -Referenced : BudgetSideBar.js
 */

/* --=== Imports ===-- */
// State
import { useState } from "react";

// Sub-components
import Input from "../../roar/Input";
import SliderInput from "../../roar/SliderInput";

// Styling
import { textWhiteLight } from "../AppStyling_Colors";

/**
 * @param { String } budgetName : A descriptive name of the budget
 * @param { Number } budgetPercent : The percent of annual income being allocated
 *    into the budget.
 * @param { Function } onEdit   : A function to support editing details of the
 *    budgets. 
 * @param { Function } onDelete : A function to support removing the budget 
 * @returns A card describing the details of a users budgets, where they can edit
 *    the aforementioned budget details.
 */
export default function BudgetCard({budgetName, budgetPercent, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  // -- Stylings ---
  const bucketCardStyling = [
    textWhiteLight,
    "border-l-[3px]",
    `border-[#F1655C]`,
    "rounded-[4px]",
    "w-[90%]",
    "min-h-[55px] max-h-[55px]",
    "bg-[#3f3f4671]",
    "flex",
  ].join(" ");

  const center = ["flex", "justify-center", "align-center", "text-lg"].join(
    " "
  );

  // Create styling to show the Percentage of income label
  const percentIconStyling = [
    center,
    "h-[72.5%]",
    isEditing ? "w-[140px]" : "w-[95px]",
    `bg-[#0a0b0d]/35`,
    "mt-[7.5px]",
    "mx-[7.5px]",
    "p-[3.5px]",
    "pt-[2%]",
    "rounded-[5px]",
    "text-[18px]",
  ].join(" ");

  /**
   * @returns An editing "icon" when click will trigger a "editing" menu to
   *    be shown to the user on the card.
   */
  function PromptEditingSection() {
    return (
      <button onClick={() => setIsEditing(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 mr-[10px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
    );
  }

  /**
   * @returns An editing menu which allows the user to edit values within a
   *    budget, and completely remove an existing budget on the budget card.
   */
  function EditingMenu() {
    return (
      <>
        <button
          onClick={() => onDelete(budgetName)}
          className="flex flex-col justify-center rounded-[50%] items-center self-center h-[30px] w-[40px]"
        >
          <div className="bg-[#F1655C]/65 h-[30px] w-[30px] absolute z-[0] rounded-[50%]"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 z-[0]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="flex flex-col justify-center rounded-[50%] items-center self-center h-[30px] w-[40px]"
        >
          <div className="bg-[#84cc16]/55 h-[30px] w-[30px] absolute z-[0] rounded-[50%]"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-9 z-[0]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </>
    );
  }

  return (
    <>
      <div className={bucketCardStyling}>
        {/* Display the percentage of budget or a form to edit the percentage */}
        <div className={percentIconStyling}>
          {isEditing ? (
            <Input
              formValueUpdate={(e) => onEdit(e)}
              value={budgetPercent}
              name={budgetName}
            />
          ) : (
            <p className={"text-[#F1655C]/80"}>{budgetPercent + "%"}</p>
          )}
        </div>

        {/* Display the name of budget or a form to edit the name*/}
        <div className={`flex items-center text-[18px] h-[100%] w-[100%]`}>
          {isEditing ? (
            <Input
              formValueUpdate={(e) => {
                const { value } = e.target;
                onEdit({
                  target: {
                    name: budgetName,
                    newName: value,
                    value: budgetPercent,
                  },
                });
              }}
              value={budgetName}
              styles={{ w: "w-[100%]" }}
              type="text"
            />
          ) : (
            <p className="ml-[10px]">{budgetName}</p>
          )}
        </div>

        {/* Editing options */}
        <div className={"w-[90px] ml-[10px] flex gap-[0px]"}>
          {!isEditing && <PromptEditingSection />}
          {isEditing && <EditingMenu />}
        </div>
      </div>

      {/* Slider for editing percentage of income */}
      {isEditing && (
        <SliderInput
          formValueUpdate={(e) => onEdit(e)}
          value={budgetPercent}
          max={100}
          min={1}
          name={budgetName}
        />
      )}
    </>
  );
}
