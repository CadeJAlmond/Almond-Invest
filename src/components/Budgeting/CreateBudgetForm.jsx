/** BudgetsForm.Jsx
 * @brief : This component is responsible for allowing users to define
 *    parameters of data used within the budgets chart.
 *
 * -Referenced : BudgetingPlanner.js
 */

/* --=== Imports ===-- */
import Button from "../subcomponents/Button";

// --== Form ==-
import Form from "../../roar/Form";
import Input from "../../roar/Input";
import DualInput from "../../roar/DualInput";

/* --=== Default Form Values ===-- */
// These values represent the parameters / general data for the inputs
// shown within the form.
export const newBudgetFormInitializer = {
  name: { text: "Budget name", type: "text", InputComponent: Input },
  percentIncomeInvesting: {
    max: 100,
    min: 1,
    value: 20,
    text: "Percent of income to invest",
    InputComponent: DualInput,
  },
};

export const annualIncomeFormInitializer = {
  annualIncome: {
    max: 1_000_000,
    min: 1_000,
    value: 50_000,
    text: "Annual Income",
    hidden: true,
    InputComponent: DualInput,
  },
};

/**
 * @param { Object } newBudgetForm : The current state of the form,
 * @param { Function } addBudgetToBudgets : A function which implements 
 *    the logic to add a new budget to the users budgets list. 
 * @returns A form which controls data related to a new budget the user
 *    desires to add
 */
export default function CreateBudgetForm({ newBudgetForm, addBudgetToBudgets}) {
  // This form is intended to send data to the BudgetsChart which renders
  // sliders and inputs.
  return (
    <>
      {/* Generate the inputs for the form */}
      <Form
        formInputsData={newBudgetForm}
        formValueUpdate={(updatedFormData) =>
          addBudgetToBudgets(updatedFormData)
        }
        customFormStyles={{}}
      >
        <Button onClick={(e) => addBudgetToBudgets(e, true)}>
          Add To Budgets
        </Button>
      </Form>
    </>
  );
}
