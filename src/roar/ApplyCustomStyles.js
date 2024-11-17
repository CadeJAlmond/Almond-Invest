/**
 * @brief : Generates tailwind css styling for html elements. The parameter
 *    objects describe the defaultStyling for an element, but will be 
 *    over-written by anything from the customStyles.
 * 
 * @param {object} defaultStylings : An object which describes the default
 *    tailwind css styling of a general html element.
 * 
 * @param {object} customStyles : An object which describes unique tailwind 
 *    css styling to a specific instance of an html element.
 * 
 * @example : 
 *    Given a defaultStylings of : { color : "color-[red]", h : "h-[32px]" }
 *    Given a customStyles of    : { color : "color-[blue]" }
 *  return the string "color-[blue] h-[32px] "
 * 
 * @returns A string which defines tailwind css styling which will 
 *    include all styles -not- overwritten within the defaultStylings
 *    object but will include all styles from the customStyles object. 
 */
export function applyCustomStyles( defaultStylings, customStyles ) {
    let styles = [];
    const generatedStyles = new Set([]);
  
    const keysOfStyles = [
      ...Object.keys(customStyles),
      ...Object.keys(defaultStylings),
    ];
  
    // Loop through all Tailwind Css properties defined in both the default 
    // and custom stylings and populate the btnStyles.
    for (const key of keysOfStyles) {
      const abbreviatedKey = key.substring(
        0, key.indexOf("-") === -1 ? key.length : key.indexOf("-")
      );
  
      // The generatedStyles will process the custom styles first, meaning
      // if a key is seen a second time than it is also defined in the default 
      // stylings, and since the custom stylings have priority this should be 
      // "ignored"
      if (!generatedStyles.has(abbreviatedKey)) {
        const elementStyle = customStyles[abbreviatedKey] ?
          customStyles[abbreviatedKey] : defaultStylings[abbreviatedKey];

        styles.push(elementStyle);
        generatedStyles.add(abbreviatedKey);
      }
    }

    return styles.join(" ")
}
