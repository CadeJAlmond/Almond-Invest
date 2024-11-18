/** BudgetsChart.Jsx
 * @brief : This component is responsible for generating an 
 *  interactive bar chart which displays the budgets a series of 
 *   budgets, and their monetary values, created by the users.
 *
 * -Referenced : MainDashboard.js
 */

/* --=== Imports ===-- */
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { orangeBg } from "../AppStyling_Colors";
import * as d3 from "d3";
import DropdownMenu from "../../roar/DropdownMenu";
import SliderInput from "../subcomponents/SliderInput";

const timeframeOfBudgets = {
  Yearly: 1,
  Monthly: 12,
  Weekly: 13 * 4,
  Daily: 13 * 4 * 7 + 1,
};

/**
 * @param { JSX } children : Loading screen for this component
 * @param { [] Object } budgets : An array of objects containing 
 *    information related to user budgets
 * @param { Number } income : The annual income of a user
 */
export default function BudgetsChart({ children, budgets, income }) {
  const timeframes = Object.keys(timeframeOfBudgets);
  // Internal States
  const [selectedTimeframe, setTimeframe] = useState(timeframes[0]);
  const [timeframeMultiple, setTimeframeMultiple] = useState(1);

  const timeframeValueRatio = timeframeOfBudgets[selectedTimeframe];

  const convertYearlyIncomeToTimeframeAmount = (value) => {
    return +(+(value / 100) * income) * ((1 / timeframeValueRatio) * timeframeMultiple)
  }

  // Variables for the d3 rendering
  const sizeRef = useRef();
  const MARGIN = { left: 175, bottom: 180, top: 95, right: 120 };
  const PHONE_MARGIN = {left: 125, bottom: 125, top: 100, right: 70 };

  const YAxisBoxWidth = 120;

  const ANIMATION_DURATION = 450;

  // Preparing chart data
  const chartData = budgets.map( (b) => {
    return {...b, value :  convertYearlyIncomeToTimeframeAmount(b.value) }
  })

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isPhoneSize = 600 > dimensions.width 

  useLayoutEffect(() => {
    const GRAPH_MARGIN = isPhoneSize ? PHONE_MARGIN : MARGIN
    const PHONE_WIDTH_PADDING = ( isPhoneSize ? 1.075 : 1)

    if (sizeRef.current) {
      setDimensions({
        width: +(sizeRef.current.clientWidth * PHONE_WIDTH_PADDING ) - GRAPH_MARGIN.left - GRAPH_MARGIN.right,
        height: sizeRef.current.clientHeight - GRAPH_MARGIN.top - GRAPH_MARGIN.bottom,
      });
    }
  }, [sizeRef.current]);

  // -==== RENDERING COMPONENTS OF THE BUDGETING CHART ====-

  /**
   * @brief Appends a gradient onto the chart for future use when
   *    rendering the bars.
   * @param {*} svg : The chart to draw the gradient "area" onto
   */
  const applyBarGradient = (svg) => {
    // Define the gradient
    const defs = svg.append("defs");

    let gradient = defs
      .append("linearGradient")
      .attr("id", "barGradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", orangeBg)
      .attr("stop-opacity", 1);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", orangeBg)
      .attr("stop-opacity", 0.65);

    let hoverGradient = defs
      .append("linearGradient")
      .attr("id", "barGradientHover")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    hoverGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#c1514a")
      .attr("stop-opacity", 0.4);

    hoverGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#c1514a")
      .attr("stop-opacity", 0.15);
  };

  /**
   * @param {*} svg : The chart to draw the "lines" onto
   * @param {*} xScale : A mapping of the internal years to a X pixel on the
   *    chart
   * @param {*} yScale : A mapping of the internal earnings to a Y pixel on the
   *    chart
   * @returns A chart with a line denoting the
   */
  const drawBarsOnGraph = (svg, xScale, yScale, xMax, xMin) => {
    // Update existing bars
    const barGroups = svg.selectAll(".bar").data(chartData);

    const opacityScale = d3.scaleLinear()
      .range([1, 0.55])
      .domain([xMax, xMin])

    // Handle the update selection
    barGroups.transition()
      .duration(ANIMATION_DURATION)
      .attr("y", (d) => yScale(d.label))
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.value));

    // Setup chart to display bars
    barGroups.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("fill", "url(#barGradient)")
      .attr("width", 0)
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(ANIMATION_DURATION)
          .attr("fill", "url(#barGradientHover)");
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(ANIMATION_DURATION)
          .attr("fill", "url(#barGradient)");
      })
      .attr("stroke-width", 2.5)
      .attr("stroke", "#c1514a")
      .style('opacity', (b) => opacityScale(parseInt(+(b.value * 100) / +(income))))
      .merge(barGroups)
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("y", (d) => yScale(d.label))
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.value))
      .attr("rx", 10)
      .attr("ry", 10)

    // Remove Not-Existing Data
    barGroups.exit().remove();

    d3.select("svg").selectAll("text").attr("font-family", "League Spartan");

    return svg;
  };

  /**
   * @param {*} svg : The chart to draw the "lines" onto
   * @param {*} xScale : A mapping of the internal years to a X pixel on the
   *    chart
   * @returns A chart with a line denoting the amount of income generated from
   *    investing for retirement using information from the retirementEarnings.
   */
  const drawLinesOnGraph = (svg, xScale) => {
    // Your grid lines code
    const { height } = dimensions;

    // Create a unique key function to bind data correctly
    const lineGroup = svg.selectAll(".horizontal-grid")
      .data(xScale.ticks(), (d) => d);

    // Enter new lines
    lineGroup
      .enter()
      .append("line")
      .attr("class", "horizontal-grid")
      .merge(lineGroup) // Merge new elements with the existing ones
      .attr("x1", (d) => xScale(d))
      .attr("y1", 0)
      .attr("x2", (d) => xScale(d))
      .attr("y2", height)
      .style("stroke", "gray")
      .style("stroke-width", 0.5)
      .lower();

    // Remove old lines
    lineGroup.exit().remove();
    return svg;
  };

  /**
   * @param {number} number : The number to transform
   * @returns : A number that has "," every three spaces. Ex : 1000 is converted
   *    to 1_000, and 1234567 is converted to 1_234_567.
   */
  function addComasToNumber(number) {
    // Convert the number to a string and reverse it
    const reversedNumberStr = number.toString().split("").reverse().join("");

    // Add underscores every three characters
    const withUnderscores = reversedNumberStr.replace(/(\d{3})(?=\d)/g, "$1,");

    // Reverse the string back to its original order and return
    return withUnderscores.split("").reverse().join("");
  }

  useEffect(() => {
    if (dimensions?.width > 0 && dimensions?.height > 0) {
      const { width, height } = dimensions;
      const GRAPH_MARGIN = isPhoneSize ? PHONE_MARGIN : MARGIN

      // Setup chart
      let svg = d3.select("#Budgets-div")
        .select("svg")
        .attr("font-family", "League Spartan")
        .attr("width", width + GRAPH_MARGIN.left + GRAPH_MARGIN.right)
        .attr("height", height + GRAPH_MARGIN.top + GRAPH_MARGIN.bottom)
        .select("g")
        .attr("transform", "translate(" + GRAPH_MARGIN.left + "," + GRAPH_MARGIN.top + ")");

      d3.select("#yAxisLabel")
        .text("$ Dollar Amount")
        .attr("transform", `translate(${YAxisBoxWidth},${50})`)
        .style("text-anchor", "middle")
        .style("font-size", "22px")
        .style("fill", "rgba(244, 244, 245, 0.9)");

      applyBarGradient(svg);

      // Setup scales
      const XMax = d3.max(chartData, (d) => d.value)

      const xScale = d3.scaleLinear()
        .domain([0, XMax])
        .range([0, width])
        .nice();

      const xAxis = d3.axisTop(xScale).tickFormat((d) =>`$${addComasToNumber(d)}`);

      const yScale = d3.scaleBand()
        .range([height, 0])
        .domain(chartData.map((d) => d.label))
        .paddingInner(0.15)
        .paddingOuter(0.2);

      const yAxis = d3.axisLeft(yScale);

      console.log(isPhoneSize)

      if (isPhoneSize) {
        yAxis.ticks(3);
        xAxis.ticks(3);
      }

      // Append the axis HTML elements
      svg.append("g")
        .classed("yAxis", true)
        .attr("transform", "translate(0, 0)")
        .style("color", "rgba(244, 244, 245, 0.8)");

      svg.append("g")
        .classed("xAxis", true)
        .attr("transform", "translate(0, 0)")
        .style("color", "rgba(244, 244, 245, 0.8)");

      // Call and embed the axes
      const yAxisLabels = svg.select(".yAxis")
        .call(yAxis)
        .selectAll("text")
        .attr("font-size", "16")
        .style("color", "rgba(235, 235, 237, 0.9);")
        .style("text-anchor", "middle")
        .attr("x", -YAxisBoxWidth / 2)
        .attr("y", -10);

      yAxisLabels.append("tspan")
        .text((d, i) => {
          const { value } = chartData.find((item) => item.label === d);
          return `$ ${addComasToNumber(Math.round(value))}`;
        })
        .attr("x", -YAxisBoxWidth / 2)
        .attr("y", 18.5)
        .style("color", "#cb372d")
        .attr("font-size", "14.5");

      const cornerRadius = 12;

      svg.selectAll(".yAxis").selectAll("g").selectAll("rect").remove();

      svg.selectAll(".yAxis")
        .selectAll("g")
        .append("rect")
        .attr("width", YAxisBoxWidth)
        .attr("x", -YAxisBoxWidth)
        .attr("y", -(yScale.bandwidth() / 2))
        .attr("height", yScale.bandwidth())
        .attr("fill", "rgba(10, 11, 13, 0.5)")
        .attr("opacity", 0.9)
        .attr("rx", cornerRadius) // Set the x-radius for rounded corners
        .attr("ry", cornerRadius) // Set the y-radius for rounded corners
        //.style("border-l-[#c1514a]/75")
        .lower();

      svg.select(".xAxis")
        .call(xAxis)
        .selectAll("text")
        .style("fill", "rgba(244, 244, 245, 0.8)")
        .attr("font-size", "13");

      // Draw the data
      svg = drawLinesOnGraph(svg, xScale);
      svg = drawBarsOnGraph(
        svg, 
        xScale, 
        yScale, 
        d3.max(Object.values(budgets), (d) => d.value),
        d3.min(Object.values(budgets), (d) => d.value)
      );

      svg.selectAll("text").attr("font-family", "League Spartan");
    }
  }, [
    dimensions,
    income,
    JSON.stringify(budgets),
    chartData,
    selectedTimeframe,
  ]);

  // -- Stylings ---
  const dashboardSectionStyling = [
    "bg-[#101215]/75",
    "w-[calc(90vw-360px)] max-xl:w-[87.25vw]",
    "max-h-[80vh] h-[80vh] min-h-[80vh]",
    "max-md:max-h-[70vh] max-md:h-[70vh] max-md:min-h-[70vh]",
  ].join(" ");

  const dropdownMenuStyling = {
    transform: "translate-y-[2.5px]",
    w: "min-w-[150px] max-w-[150px]",
  };

  const sliderStyling = {
    end: "mt-[5px]",
    w: "w-[calc(5% + 75px)] max-md:w-[25vw]",
  };

  const chartHeaderStyling = [
    "h-[80px]",  
    "ml-[48px]",
    "flex",
    "w-[100%]",
    "no-wrap",
    "items-end",
    "max-lg:flex-col",
    "max-lg:items-start",
    "max-lg:ml-[25px]",
    "max-lg:mt-[15px]",
    "max-lg:gap-[15px]"
  ].join(" ")

  return (
    <>
      <section ref={sizeRef} className={dashboardSectionStyling}>
        {/* Header section of the chart, timeframe functionality */}
        <strong className={chartHeaderStyling}>
          <h3 className={"min-w-[300px] mr-[5px] text-3xl text-[#f4f4f5]"}>
            Budgets Calculator :
          </h3>
          <div className="flex w-[200px]">
          <DropdownMenu
            placeholderText="Timeframe"
            selectedItem={selectedTimeframe}
            styles={dropdownMenuStyling}
          >
            {timeframes.map((dropdownItem) => {
              return (
                <li
                  className="content-center hover:bg-[#F1655C]/85 px-[7.5px] py-[5px]"
                  onClick={() => {
                    setTimeframeMultiple(1);
                    setTimeframe(dropdownItem);
                  }}
                >
                  {dropdownItem}
                </li>
              );
            })}
          </DropdownMenu>
          <p className="text-4xl text-[#f4f4f5] flex mx-[15px] gap-[10px]">
            {timeframeMultiple}
            <SliderInput
              updatedInput={(e) => {
                setTimeframeMultiple(+e.target.value);
              }}
              value={timeframeMultiple}
              max={
                selectedTimeframe === "Yearly"
                  ? 15
                  : timeframeOfBudgets[selectedTimeframe]
              }
              min={1}
              name={"slider"}
              selectedItem={selectedTimeframe}
              styles={sliderStyling}
            />
          </p>
          </div>
        </strong>

        {/* Content section for the D3 Chart */}
        {children}
        <div id="Budgets-div" className={children ? "blur-[0.675px]" : ""}>
          <svg>
            <g></g>
            <text id="yAxisLabel"></text>
          </svg>
        </div>
      </section>
    </>
  );
}
