import Input from "./Input";
import SliderInput from "./SliderInput";

/**
 * @brief : 
 * @param {String} inputName 
 * @returns 
 */
export function createDualInputs(formInputName, value, max, min, text){
  return {
    FormInputComponent : DualInput,
    formInputProps : {
        [formInputName] : {
          max, min, value, text,
        }
    }
  }
}

export default function DualInput({
  max,
  min,
  formValueUpdate,
  value,
  name,
  logScaling = false,
  styles = {},
}) {
  return (
    <>
      <Input
        key={`input-${name}`}
        formValueUpdate={formValueUpdate}
        max={max}
        min={min}
        value={value}
        name={name}
        styles={styles}
      />
      <SliderInput
        key={`sliders-${name}`}
        max={max}
        min={min}
        value={value}
        formValueUpdate={formValueUpdate}
        name={name}
        styles={styles}
        logScaling={logScaling}
      />
    </>
  );
}
