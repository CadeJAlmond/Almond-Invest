/** BudgetingPlanner.Jsx
 * @returns { Component } : This component is responsible for creating
 *   a chart which showcase budgets that the user wants to allocate 
 *   money into and provides an intractable form which the user can 
 *   utilize to customize the details of their budgets.
 *
 * -Referenced : App.js
 */

/* --=== Imports ===-- */
import { useEffect, useState } from "react";

// Sub-components
import AnimatedLoading from "../subcomponents/AnimatedLoading";
import ChartsSideBar from "../subcomponents/ChartsSideBar";
import Button from "../subcomponents/Button";
import DualInput from "../../roar/DualInput";
import BudgetCard from "./BudgetCard";

// --== Form ==-
import BudgetsList, { annualIncomeFormInitializer } from "./AnnualIncomeForm";
import CreateBudgetForm, { newBudgetFormInitializer } from "./CreateBudgetForm";

// Budgeting Charts
import BudgetsChart from "./BudgetsChart";

/* --=== Default Budgets Values ===-- */
const defaultBudgets = {
  0: {
    text: "Investing",
    value: 20, max: 100, min: 1,
    InputComponent: DualInput,
  },
  1: {
    text: "Necessities",
    value: 40, max: 100, min: 1,
    InputComponent: DualInput,
  },
  2: {
    text: "Personal",
    value: 25, max: 100, min: 1,
    InputComponent: DualInput,
  },
  3: {
    text: "Taxes",
    value: 15, max: 100, min: 1,
    InputComponent: DualInput,
  },
};

export default function BudgetingDashboard() {
  // -==== BUDGET PLANNER GLOBAL VARIABLES ====-

  // The users budgets
  const [budgets, setBudgets] = useState(defaultBudgets);
  const [addingBudget, setAddingBudget] = useState(false);

  // State for annual income form
  const [annualIncomeForm, setAnnualIncomeForm] = useState(
    annualIncomeFormInitializer
  );

  // State for adding new budgets
  const [createNewBudgetForm, setNewBudgetForm] = useState(
    newBudgetFormInitializer
  );

  // State for loading indicator when budget changes
  const [loadingBudgetChanges, setChangedBudgets] = useState(false);

  const income = +annualIncomeForm.annualIncome.value;

  // Preparing chart data
  const budgetsArray = Object.keys(budgets)
    .map((budgetId) => {
      const { text, value } = budgets[budgetId];
      return { value, label: text, budgetId };
    })
    .sort((b1, b2) => b1.value - b2.value);

  const totalIncomeInUse = budgetsArray.reduce((incomeInUse, budget) => {
    return incomeInUse + budget.value;
  }, 0);

  // Function to navigate to a different screen and set form values accordingly
  const navigateToScreen = (screen, screenFormData) => {
    setSideBarScreen(screen);
    setFormValues(screenFormData);
  };

  // -==== UPDATING USER BUDGETS STATE ====-

  useEffect(() => {
    if (loadingBudgetChanges) {
      const timeoutId = setTimeout(() => {
        setBudgets(loadingBudgetChanges);
        setChangedBudgets(false);
      }, 1250);

      return () => clearTimeout(timeoutId);
    }
  }, [loadingBudgetChanges]);

  // Handle new added budgets and update the budgets data for the form
  const addBudgetToBudgets = (e, formSubmitted = false) => {
    if (formSubmitted) {
      e.preventDefault();
      const text = createNewBudgetForm.name.value;
      const value = +createNewBudgetForm.percentIncomeInvesting.value;

      const newBudget = { text, value };
      const budgetId = Object.keys(budgets).sort().pop() + 1;

      setChangedBudgets({
        ...budgets,
        [budgetId]: newBudget,
      });
      setAddingBudget(false);
      setNewBudgetForm(defaultFormInitializer);
    } else {
      setNewBudgetForm(e.state);
    }
  };

  // Handle changes from the budget cards on the form
  const handleBudgetEdits = (e) => {
    const { name, value } = e.target;
    const { newName } = e.target;

    const updatedBudget = {
      text: newName ? newName : name,
      value: +value,
    };

    const budgetId = Object.keys(budgets).find((budgetId) => {
      return budgets[budgetId].text == name;
    });

    setBudgets((prevState) => ({
      ...prevState,
      [budgetId]: updatedBudget,
    }));
  };

  // Handle deleted budgets and update the budgets data for the form
  const handleBudgetDelete = (budgetLabel) => {
    const filteredBudgets = {};

    Object.keys(budgets).forEach((budgetId) => {
      const { text } = budgets[budgetId];
      if (text !== budgetLabel) {
        filteredBudgets[text] = budgets[budgetId];
      }
    });

    setBudgets(filteredBudgets);
  };

  // -- Stylings ---  
  const bucketsUlStyling = [
    "mt-[16px]",
    "ml-[25px]",
    "flex",
    "flex-col",
    "gap-[16px]",
    "overflow-y-auto",
    "h-[40vh]",
  ].join(" ");

  const dashboardStyling = [
    "bg-[#1B1E23]",
    "w-[100%]",
    "h-[calc(100%-77px)] max-xl:h-[1300px]",
    "pt-[5vh]",
    "pl-[5vw]",
    "flex max-xl:flex-col max-xl:gap-8",
    "overflow-hidden",
  ].join(" ");

  return (
    <main className={dashboardStyling}>
      {/* Render the appropriate Sidebar for the Budget dashboard */}
      <ChartsSideBar setSideBarScreen={navigateToScreen}>
        <div className="w-[100%] flex justify-center mt-[18px]">
          <Button
            styles={{ w: "w-[50%]" }}
            onClick={() => setAddingBudget(!addingBudget)}
          >
            {addingBudget ? "Cancel" : "Add Budget"}
          </Button>
        </div>
        {/* Display a list of the users budgets, or a form to add new budgets */}
        {addingBudget ? (
          <>
            <p className="text-[#FFF]/80 text-[18px] mx-auto mt-[22px] mb-[-12px]">
              Annual income in use : {totalIncomeInUse + +(createNewBudgetForm.percentIncomeInvesting?.value)}%
            </p>

            <CreateBudgetForm
              newBudgetForm={createNewBudgetForm}
              addBudgetToBudgets={addBudgetToBudgets}
              remainingIncomeFromBudgets={0}
            />
          </>
        ) : (
          <>
            <p className="text-[#FFF]/80 text-[18px] mx-auto mt-[22px] mb-[-12px]">
              Annual income in use : {totalIncomeInUse}%
            </p>

            <BudgetsList
              budgets={budgetsArray}
              setBudgets={setBudgets}
              annualIncomeForm={annualIncomeForm}
              updateAnnualIncomeForm={setAnnualIncomeForm}
            >
              <ul className={bucketsUlStyling}>
                {/* Translate each budget into a card */}
                {[...budgetsArray].reverse().map((budget) => {
                  const { label, value, budgetId } = budget;

                  return (
                    <BudgetCard
                      budgetName={label}
                      budgetPercent={value}
                      key={`BUDGET-${budgetId}`}
                      onEdit={handleBudgetEdits}
                      onDelete={handleBudgetDelete}
                    />
                  );
                })}
              </ul>
            </BudgetsList>
          </>
        )}
      </ChartsSideBar>

      {/* Render a BudgetsChart which displays the users budgets and their monetary values */}
      <BudgetsChart budgets={budgetsArray} income={+income}>
        {loadingBudgetChanges && (
          <AnimatedLoading
            styles={
              "w-[calc(70vw-160px)] h-[55%] flex flex-col justify-center items-center"
            }
          />
        )}
      </BudgetsChart>
    </main>
  );
}
