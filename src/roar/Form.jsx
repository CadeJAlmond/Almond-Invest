/** Form.jsx
 * @returns {Component} : A customizable Form element automatically
 *    constructed from basic JavaScript Objects, which communicates
 *    values within our forms. 
 */

/* --=== Imports ===-- */
import { applyCustomStyles } from "./ApplyCustomStyles";

import _ from 'lodash';

/**
 * @param {Object} formInputsData : A data representation of how to construct
 *    a and represent an intractable html form.
 * @param {Function} formValueUpdate : A call-back function which reports the 
 *    updates that occur within a form.
 * @param {Object} customFormStyles : A data representation of the styles which 
 *    are applicable to incorporated into this form.
 * @param {React.JSX} children : A placeholder for a series of buttons, or more 
 *    forms.
 * @returns A form element
 */
export default function Form({ title, formInputsData, formValueUpdate, customFormStyles = {}, children }) {
  // We need a shallow copy, since JS is pass by reference we should only interact with a copy of the 
  // form inputs schema when constructing the form.
  const formInputs = _.cloneDeep(formInputsData ? formInputsData : {})

  // Setup the Styling for the Form
  const defaultFormStylings = {
    h: "min-h-[85%] max-h-[85%]",
    w: "min-w-[100%] max-w-[100%]",
    gap: "gap-x-[15px]",
    flex: "flex flex-col items-start",
    rounded: "rounded-md",
    overflow: "overflow-auto"
  };

  // Merge the custom styles with the default styles
  const gridStyling = applyCustomStyles(defaultFormStylings, customFormStyles);

  /**
   * @param {InputHTMLAttributes} event : The html input event which contains the updated value
   *    belonging to the input which was just updated.
   * @returns The new state of the form
   */
  const computeNewFormState = (event) => {
    const { value, name } = event.target;
    const updatedState = { ...formInputs };

    // Update recorded value in our state
    updatedState[name].value = value;

    return formValueUpdate({ state: updatedState, event: { value, name } });
  };

  return (
    <form className={gridStyling} onSubmit={() => onSubmit}>
      <h3 className="text-2xl font-bold text-[#ffffffde] mb-4 mr-[30px] border-b-[2px] border-[#2d323b]/70">{title}</h3>
      {/* Generate each input of the Form */}
      {Object.keys(formInputs).map((formInputName, rowIndex) => {
        const { InputComponent, ...inputProps } = formInputs[formInputName];
        // Include the name into the properties to pass into the input fields of the form
        inputProps.name = formInputName;

        return (
          /** Render each Input of the form **/
          <div className=" flex gap-4 justify-start max-md:flex-col w-[100%] mb-3">
            <div className="w-[calc(100%-35px)]">
              <InputComponent
                {...inputProps} // Inject component properties by spreading them
                formValueUpdate={(newInputData) => computeNewFormState(newInputData)}
                key={formInputName} // Define keys
              />
            </div>
          </div>
        );
      })}
      {
        // Inject optional form elements
        children
      }
    </form>
  );
}
