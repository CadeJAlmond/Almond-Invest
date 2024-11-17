/** BudgetsForm.Jsx
 * @brief : This component is responsible for allowing users to define
 *    parameters of data used within the budgets chart.
 *
 * -Referenced : BudgetingPlanner.js
 */

/* --=== Imports ===-- */
import { textWhiteLight } from "../AppStyling_Colors";

// --== Form ==-
import Form from "../../roar/Form";
import DualInput from "../../roar/DualInput";

/* --=== Default Form Values ===-- */
// These values represent the parameters / general data for the inputs
// shown within the form.
export const annualIncomeFormInitializer = {
  annualIncome: {
    max: 1_000_000,
    min: 1_000,
    value: 50_000,
    text: "($) Annual Income",
    hidden: true,
    InputComponent: DualInput,
  },
};

/**
 * @param { String } updateAnnualIncomeForm : A function which implements
 *   the logic of updating the annual income.
 * @param { Number } annualIncomeForm : The current state of the annual 
 *   income form.
 * @param { Function } children : Optional form elements.
 * @returns A form which controls that value the user determines for their
 *   annual income.
 */
export default function AnnualIncomeForm({annualIncomeForm, updateAnnualIncomeForm, children}) {

  // -- Stylings ---
  const addingBucketStyling = [
    textWhiteLight,
    "flex",
    "flex-col",
    "mt-[20px]",
    "ml-[20px]",
    "gap-[25px]",
  ].join(" ");

  // This form is intended to send data to the BudgetsChart which renders
  // sliders and inputs.
  return (
    <>
      {/* Annual Income Inputs for the budgets */}
      <>
        <div className={addingBucketStyling}>
          <Form
            formInputsData={annualIncomeForm}
            formValueUpdate={(newFormData) =>
              updateAnnualIncomeForm(newFormData.state)
            }
            customFormStyles={{overflow: "overflow-none"}}
          />
        </div>
        {children}
      </>
    </>
  );
}
