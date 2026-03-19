import Input from "./Input";
import SliderInput from "./SliderInput";

/**
 * @brief : 
 * @param {String} inputName 
 * @returns 
 */
export function createDualInputs(formInputName, value, max, min, text) {
  return {
    FormInputComponent: DualInput,
    formInputProps: {
      [formInputName]: {
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
  text
}) {
  return (
    <div className="flex flex-col gap-2 w-[100%]">
      <p className="text-nowrap text-sm font-medium text-[#ffffffcc] flex mb-[6px] tracking-wide flex items-center justify-between">
        {text}
        <Input
          key={`input-${name}`}
          formValueUpdate={formValueUpdate}
          max={max}
          min={min}
          value={value}
          name={name}
          styles={{ ...styles, w: "w-min max-w-[111px]", h: "min-h-[30px] max-h-[30px]", text: "text-[15px] text-[#F1655B]" }}
        />
      </p>
      <SliderInput
        key={`sliders-${name}`}
        max={max}
        min={min}
        value={value}
        formValueUpdate={formValueUpdate}
        name={name}
        styles={{ ...styles, w: "w-full", h: "min-h-[16px] max-h-[16px]", b: "border-0", bg: "bg-transparent", text: "text-sm", border: "rounded-none", pl: "pl-0" }}
        logScaling={logScaling}
      />
    </div>
  );
}
