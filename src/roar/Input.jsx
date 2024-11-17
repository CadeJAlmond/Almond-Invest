/** Input.jsx
 * @returns {Component} : A customizable Input element that allows 
 *    logarithmic scaling within it's values. Has nice pre-defined 
 *    styles included.
 * 
 * References - BudgetsForm.Jsx, RetirementForm.Jsx
 */

/* --=== Imports ===-- */
import { applyCustomStyles } from "./ApplyCustomStyles";

/**
 * @brief : 
 * @param {String} inputName 
 * @returns : A populated instance of a basic input
 */
export function createBasicInput(inputName, type = "number", value, max, min, text, styles = {} ){
  return {
    FormInputComponent : Input,
    formInputProps : {
      [inputName]: { max, min, value, styles, type, text},
    }
  }
}

/**
 * @param {React.JSX} children : The placeholder text for an input.
 * @param {Function} updatedInput : A callback function to respond to 
 *    input changes.
 * @param {String} type : The "type" of allowable values within an 
 *    input element.
 * @param {Object} styles : The desires styles we want incorporated 
 *    into an input element.
 * @param {Number | String} value : The value within an Input element.
 * @param {Number} min : The maximum possible element of the Input element.
 * @param {Number} max : The minimum possible element of the Input element.
 * @param {String} name : The name property of an Input element.
 * @returns {Component} An input element.
 */
export default function Input({
  children,
  formValueUpdate,
  type = "number",
  styles = {},
  value,
  min,
  max,
  name
}) {
  // Setup styles for the SliderInput
  const defaultStylings = {
    h: "min-h-[32.5px] max-h-[32.5px]",
    w: "w-[85%]",
    pl: "pl-[10px]",
    bg: "bg-[transparent]",
    b : "border-[1.5px] border-[#f4f4f5]/80",
    border: "rounded-[5px]",
    text: "text-[17px] text-[#f4f4f5]/80",
  };
  // Apply custom styles on top of the default styles
  const inputStyling = applyCustomStyles(defaultStylings, styles);

  // Apply min and max if defined
  if (min && max)
    return (
      <input
        className={inputStyling}
        onChange={formValueUpdate}
        type={type}
        value={value}
        placeholder={children}
        max={max}
        min={min}
        name={name}
      />
    );

  return (
    <input
      className={inputStyling}
      onChange={formValueUpdate}
      value={value}
      type={type}
      placeholder={children}
      name={name}
    />
  );
}
