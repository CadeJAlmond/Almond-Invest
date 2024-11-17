/** RetirementPlanner.jsx
 * @returns { Component } : This component is responsible for creating a 
 *      fully interactive retirement chart, alongside a form which controls 
 *      the data that is used in the retirement chart. This retirement chart 
 *      showcases a projection for what a user would have EARNED given their 
 *      income, age, investment allocation and expected stock growth. All 
 *      data within the RetirementProjectionChart is derived from this 
 *      components Form.
 *
 * -Referenced : App.js
 */

/* --=== Imports ===-- */
import { useEffect, useState } from "react";

// Subcomponents
import AnimatedLoading from "../subcomponents/AnimatedLoading";

// General Sidebar styling
import ChartsSideBar from "../subcomponents/ChartsSideBar";

// Retirement Chart
import RetirementPredictionChart from "./RetirementProjectionChart";

// --== Form ==-
import Form from "../../roar/Form";
import DualInput from "../../roar/DualInput";

/* --=== Default Form Values ===-- */
// These values represent the parameters / general data for the inputs
// shown within the form.
const defaultRetirementFormValues = {
  investing: {
    text: "(%) Percent of income to invest",
    value: 20, max: 100, min: 1,
    InputComponent: DualInput,
  },
  annualIncome: {
    text: "($) Annual Income",
    value: 65_000, max: 10_000_000, min: 5_000,
    InputComponent: DualInput,
  },
  age: {
    text: "Your current age",
    value: 22, max: 95, min: 1,
    InputComponent: DualInput,
  },
  retirementAge: {
    text: "Age of retirement",
    value: 65, max: 95, min: 20,
    InputComponent: DualInput,
  },
  expectedStockGrowth: {
    text: "(%) Expected stock returns",
    value: 13, max: 80, min: 1,
    InputComponent: DualInput,
  },
};

export default function RetirementDashboard() {
  // State for form values with default values
  const [formValues, setFormValues] = useState(defaultRetirementFormValues);
  const [graphValues, setGraphValues] = useState(defaultRetirementFormValues);

  // State for loading indicator when input changes
  const [loadingInputChanges, setChangedInputs] = useState(false);

  // Dashboard styling class list
  const dashboardStyling = [
    "bg-[#1B1E23]",
    "w-[100%]",
    "h-[calc(100%-77px)] max-xl:h-[1600px]",
    "pt-[5vh]",
    "pl-[5vw]",
    "flex",
    "flex max-xl:flex-col max-xl:gap-8"
  ].join(" ");

  // Create a 2-second lag when to update the graph when form values are updated
  useEffect(() => {
    if (loadingInputChanges) {
      const timeoutId = setTimeout(() => {
        setGraphValues(formValues);
        setChangedInputs(false);
      }, 1250);

      return () => clearTimeout(timeoutId);
    }
  }, [loadingInputChanges, formValues]);

  // Function to update form values and set loading indicator
  const updateFormValues = (newFormValues) => {
    const { state } = newFormValues;
    setFormValues(state);
    setChangedInputs(true);
  };

  // Function to navigate to a different screen and set form values accordingly
  const navigateToScreen = (screen, screenFormData) => {
    setSideBarScreen(screen);
    setFormValues(screenFormData);
  };

  // -- Stylings ---
  const retirementFormStyling = {
    bg: "bg-[transparent]",
    p: "pl-[25px] py-[27.5px]",
    gap: "gap-x-[20px] gap-y-[5px]",
    flex: "max-xl:grid max-xl:grid-cols-2 ",
  };

  return (
    <main className={dashboardStyling}>
      {/* Render the appropriate Sidebar for a given dashboard */}
      <ChartsSideBar setSideBarScreen={navigateToScreen}>
        {/* Generate the form for the retirement projection */}
        <Form
          formInputsData={formValues}
          formValueUpdate={(updatedFormData) => {
            updateFormValues(updatedFormData);
          }}
          customFormStyles={retirementFormStyling}
        />
      </ChartsSideBar>

      {/* Render a RetirementPredictionChart which displays the retirement projection */}
      <RetirementPredictionChart
        stockGainsPerYear={+graphValues.expectedStockGrowth.value}
        annualIncome={+graphValues.annualIncome.value}
        percentageOfIncomeToInvest={+graphValues.investing.value}
        age={+graphValues.age.value}
        isRoth={true}
      >
        {loadingInputChanges && (
          <AnimatedLoading
            styles={
              "w-[calc(70vw-160px)] h-[55%] flex flex-col justify-center items-center"
            }
          />
        )}
      </RetirementPredictionChart>
    </main>
  );
}
