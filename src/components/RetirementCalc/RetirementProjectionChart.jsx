/** RetirementPredictionChart.Jsx
 * @brief : This component is responsible for creating a graph which
 *    represents a projection of how much money someone would be able
 *    to retire with from the compounding affect.
 *
 * -Referenced : MainDashboard.js
 */

// Suggestion : Maybe instead of having children being a loading screen we simply
// use a new prop named isLoading which is the JSX for the loading screen

/* --=== Imports ===-- */
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { orangeBg } from "../AppStyling_Colors";
import * as d3 from "d3";

/**
 * @param { JSX } children : Loading screen for this component
 * @param { Number } stockGainsPerYear : How much stocks are expected to
 *    increase by every year within the simulation.
 * @param { Number } annualIncome : How much many the user makes annually
 *    within the simulation.
 * @param { Number } percentageOfIncomeToInvest :
 * @param { Number } age : The current age of the user in the simulation
 */
export default function RetirementPredictionChart({
  children,
  stockGainsPerYear,
  annualIncome,
  percentageOfIncomeToInvest,
  age,
  rothIra,
}) {
  // -==== RETIREMENT PROJECTION GLOBAL VARIABLES ====-
  // State for retirement projection simulation math
  const [retirementEarnings, setRetirementFunds] = useState([]);
  const [totalTaxesPaid, setTaxesPaid] = useState([]);
  
  const [graphDimensions, setGraphDimensions] = useState({ height: 0, width: 0 });
  const sizeRef = useRef();

  // Destructure dimensions
  const { height, width } = graphDimensions;

  const ANIMATION_DURATION = 450;

  const lineChartCutOff = 300;

  const MARGIN = { left: 75, bottom: 85, top: 130, right: -20 };
  const PHONE_MARGIN = { left: 45, bottom: 45, top: 90, right: 0 };
  const INNER_MARGIN = { left: 45, bottom: 30 };

  const getMarginOffScreenSize = () => {
    const svgWidth = sizeRef.current?.clientWidth || 0;
    const svgHeight = sizeRef.current?.clientHeight || 0;

    const phoneDisplay = svgWidth > 800;
    const CURRENT_MARGIN = phoneDisplay ? MARGIN : PHONE_MARGIN;

    return { CURRENT_MARGIN, phoneDisplay, svgWidth, svgHeight };
  };

  const getGraphDimensions = () => {
    const { CURRENT_MARGIN, phoneDisplay, svgWidth, svgHeight } = getMarginOffScreenSize();

    const currentLineChartCutOff = phoneDisplay ? lineChartCutOff : 30;
    const height = svgHeight - CURRENT_MARGIN.top - CURRENT_MARGIN.bottom;
    const width = svgWidth - CURRENT_MARGIN.left - CURRENT_MARGIN.right - currentLineChartCutOff;

    return { height, width };
  };

  const updateGraphDimensions = () => {
    setGraphDimensions(getGraphDimensions());
  };

  // Using useLayoutEffect to ensure DOM updates are calculated before the paint
  useLayoutEffect(() => {
    updateGraphDimensions();

    window.addEventListener("resize", updateGraphDimensions);
    return () => window.removeEventListener("resize", updateGraphDimensions);
  }, []);

  // If for some reason data for the simulation wasn't included
  if (
    !stockGainsPerYear ||
    !annualIncome ||
    !percentageOfIncomeToInvest ||
    !age
  ) {
    return (
      <section ref={sizeRef}>
        <div id="Linechart-div">
          <h1>
            Please fill in the information <button>Here</button>
          </h1>
        </div>
      </section>
    );
  }

  // -==== RETIREMENT SIMULATION CALCULATIONS ====-

  const incomeToInvestAnnually = annualIncome * (percentageOfIncomeToInvest / 100);

  /**
   * @brief : Calculates the income gained from a year of compounded growth
   * @param  {number} income : The income for a given year
   * @returns {number} The income gained from a year of compounded growth
   */
  const calculateCompoundEarnings = (income) => {
    // n is the number of times that interest is compounded per year.
    const n = 1;

    // Convert the annual rate from percentage to decimal
    const rate = stockGainsPerYear / 100;

    // Calculate the compound interest
    const increaseInIncomePercent = Math.pow(1 + rate / n, n);
    const compoundedEarnings = income * increaseInIncomePercent;

    return compoundedEarnings;
  };

  /**
   * @brief : Calculates which tax-bracket the User exists in a point of time
   * @param { Object } currentTaxBrackets : An object which maps tax percentages to the
   *    income required to be within a tax bracket.
   * @param { Number } amountToInvest : The money was earned from a previous year of
   *    investing.
   * @param { Number } income : The current yearly income within in the simulation.
   *
   * @returns {Array} The tax bracket that is applicable to the income and a smaller
   *    taxBrackets array which filtered out tax brackets that won't apply to any future
   *    income.
   */
  const getTaxBracket = (currentTaxBrackets, amountToInvest, income) => {
    const taxBracketPercentages = Object.keys(currentTaxBrackets).sort();
    const updatedTaxBrackets = {};
    let taxBracket = 0;

    // Reverse for-loop through the tax-brackets starting from the highest brackets
    for (let i = taxBracketPercentages.length - 1; i >= 0; i--) {
      const currentTaxBracketPercent = taxBracketPercentages[i];
      const taxBracketIncomeThreshold =
        currentTaxBrackets[currentTaxBracketPercent];

      updatedTaxBrackets[currentTaxBracketPercent] = taxBracketIncomeThreshold;

      // The first tax bracket thresh hold which is greater than our total income
      // is the tax bracket that should be applied.
      if (amountToInvest + income > taxBracketIncomeThreshold) {
        taxBracket = currentTaxBracketPercent;
        break;
      }
    }
    return [updatedTaxBrackets, taxBracket];
  };

  /**
   * @brief : Computes the total earnings a user has gained from investing until their 
   *    age of retirement has been reached.
   * @param { Number } initialIncome : Initial existing money already investing into a
   *    retirement account.
   * @param { Number } yearsToRetirement : The amount of years until the User retires
   * @param { Number } annualInvestment  : The amount of money invested into a retirement
   *    account every year.
   *
   * @return {Array} : Statistics such as [the amount of money earned, taxesPaid, and is rothIra]
   *    from investing in the stock market until the User reaches their retirement age.
   */
  const calculateEarning = (initialIncome) => {
    const earnings = [calculateCompoundEarnings(initialIncome)];
    let totalTaxedIncome = [0];

    /**
     * Tax brackets derived from :
     * https://www.nerdwallet.com/article/taxes/federal-income-tax-brackets
     */
    let taxBrackets = {
      0.0: 0,
      0.1: 11_600,
      0.12: 23_200,
      0.22: 47_151,
      0.24: 100_571,
      0.32: 191_951,
      0.35: 243_725,
      0.37: 609_351,
    };

    const yearsToRetirement = 65 - age;
    for (let i = 1; i <= yearsToRetirement; i++) {
      // Get tax data
      const [updatedTaxBrackets, taxBracket] = rothIra ? 
          getTaxBracket(taxBrackets, 0, annualIncome) : [taxBrackets, 0];

      // Apply and record relevant tax info to computed data
      taxBrackets = updatedTaxBrackets;
      const taxedIncome = incomeToInvestAnnually * (1 - taxBracket);

      totalTaxedIncome.push( totalTaxedIncome.at(-1) + incomeToInvestAnnually - taxedIncome);

      // Calculate compound interest
      let earned = calculateCompoundEarnings(earnings[i - 1] + taxedIncome);

      // Apply taxes to a non-IRA account
      if (!rothIra && i == yearsToRetirement) {
        const [updatedTaxBrackets, taxBracket] = getTaxBracket(
          taxBrackets, 0, earnings.at(-1)
        );

        totalTaxedIncome[i] = earned * taxBracket;
        earned = earned * (1 - taxBracket);
      }
      // Record the growth for the current year
      earnings.push(earned);
    }

    return [earnings, totalTaxedIncome, rothIra];
  };

  // -==== RENDERING COMPONENTS OF THE RETIREMENT CHART ====-

  const simulationData = [
    stockGainsPerYear,
    annualIncome,
    incomeToInvestAnnually,
    age,
    rothIra,
  ];

  // Recompute the retirement earnings if any data is changed relevant to the
  // simulation
  useEffect(() => {
    const [earnings, taxedIncome] = calculateEarning(0);

    // Update data
    setRetirementFunds(earnings);
    setTaxesPaid(taxedIncome);
  }, [setRetirementFunds, ...simulationData]);

  /**
   * @brief : Used to shorten the text displayed on the graph
   * @param { Number } num : The amount of money earned during a given year
   * @returns { String } an abbreviated representation of the number
   */
  const abbreviateNumbers = (num) => {
    const lengthOfNumber = `${num}`.length;

    if (lengthOfNumber > 12) return `${num / 1_000_000_000_000} TRIL`;

    if (lengthOfNumber > 10) return `${num / 1_000_000_000}BIL`;

    if (lengthOfNumber > 7) return `${num / 1_000_000} MIL`;

    return `${num / 1_000} K`;
  };

  /**
   * @brief : Scales numbers to fit appropriately onto the D3 graph
   * @param { Number } graphHeight : The height of the chart
   * @returns xAxis, yAxis, xScale, yScale to use to map numbers onto the
   *   chart on the users screen.
   */
  const setupChartAxis = (graphHeight) => {
    const yMax = rothIra ? retirementEarnings.at(-1) : retirementEarnings.at(-2);

    const yScale = d3.scaleLinear()
      .domain([1, yMax])
      .range([graphHeight, 0])
      .nice();

    const yAxis = d3.axisLeft(yScale);
    yAxis.tickFormat((d, i) => `$${abbreviateNumbers(d)}`);

    const xScale = d3.scaleLinear()
      .domain([0, retirementEarnings.length - 1])
      .range([INNER_MARGIN.left, width]);

    const xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat((d, i) => convertNumberToDate(d));

    return [yAxis, xAxis, yScale, xScale];
  };

  /**
   * @brief : Displays the users income onto the D3 line-chart represented by an
   *    area with a gradient color.
   * @param { * } svg : The chart to draw the "area" onto
   * @param { Number } graphHeight : The height of the chart
   * @param { * } xScale : A mapping of the internal years to a Y pixel on the
   *    chart
   * @param { * } yScale : A mapping of the internal earnings to a X pixel on the
   *    chart
   * @returns A chart with a area with a gradient denoting the amount of income
   *    generate from investing for retirement using information from the
   *    retirementEarnings.
   */
  const drawGradientAreaOnGraph = (svg, graphHeight, xScale, yScale) => {
    let defs = svg.append("defs");

    let gradient = defs.append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", orangeBg)
      .attr("stop-opacity", 0.25);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", orangeBg)
      .attr("stop-opacity", 0.05);

    // Define the area generator
    const createArea = d3.area()
      .x((d, i) => xScale(i))
      .y0(graphHeight)
      .y1((d) => yScale(d));

    const initialArea = d3.area()
      .x((d, i) => xScale(i))
      .y0(graphHeight)
      .y1(graphHeight);

    // Attach the data to the gradient area
    let areaGroup = svg.selectAll(".areaPath").data([retirementEarnings]);

    // Create and append the area path
    areaGroup = areaGroup.enter()
      .append("path")
      .attr("class", "areaPath")
      .attr("d", initialArea)
      .style("fill", "url(#area-gradient)")
      .merge(areaGroup)
      .transition()
      .duration(ANIMATION_DURATION) // Animation duration
      .attr("d", createArea);

    return svg;
  };

  /**
   * @brief : Displays the users income onto the D3 line-chart represented by
   *    a line.
   * @param { * } svg : The chart to draw the "lines" onto
   * @param { * } xScale : A mapping of the internal years to a Y pixel on the
   *    chart
   * @param { * } yScale : A mapping of the internal earnings to a X pixel on the
   *    chart
   * @returns A chart with a line denoting the amount of income generate from
   *    investing for retirement using information from the retirementEarnings.
   */
  const drawLinesOnGraph = (svg, xScale, yScale) => {
    let lineGroup = svg.selectAll(".linePath").data([retirementEarnings]);

    const createLine = d3.line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d));

    lineGroup = lineGroup.enter()
      .append("path")
      .attr("class", "linePath")
      .merge(lineGroup)
      .attr("d", createLine);

    const pathLength = lineGroup.node().getTotalLength();

    // Draw the line representing the predicted retirement income data
    lineGroup.attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-width", 3)
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("stroke-width", 0)
      .attr("stroke-dashoffset", 0)
      .attr("fill", "none")
      .attr("stroke-width", 2.75)
      .attr("stroke", "#c1514a")
      .style("opacity", 0.85);

    lineGroup.exit().remove();

    // Create ascetic "vertical" dotted lines on y-scales
    svg.selectAll("line.vertical-grid")
      .data(yScale.ticks())
      .enter()
      .append("line")
      .attr("class", "vertical-grid")
      .attr("x1", INNER_MARGIN.left)
      .attr("y1", (d) => yScale(d))
      .attr("x2", width)
      .attr("y2", (d) => yScale(d))
      .style("stroke", "gray")
      .style("stroke-width", 0.5)
      .style("stroke-dasharray", "3 3");

    return svg;
  };

  /**
   * @brief : Apply an easier to read format to numbers by adding commas
   * @param { Number } number : The number to transform
   * @returns : A number that has "," every three spaces. Ex : 1000 is converted
   *    to 1,000, and 1234567 is converted to 1,234,567.
   */
  function addComasToNumber(number) {
    // Convert the number to a string and reverse it
    const reversedNumberStr = number.toString().split("").reverse().join("");

    // Add underscores every three characters
    const withUnderscores = reversedNumberStr.replace(/(\d{3})(?=\d)/g, "$1,");

    // Reverse the string back to its original order and return
    return withUnderscores.split("").reverse().join("");
  }

  const currentYear = new Date().getFullYear();

  /**
   * @param { Number } number : The number to transform
   * @returns : Adds a number to the current year. For example, given the number
   */
  const convertNumberToDate = (number) => currentYear + number;

  /**
   * @brief : Extracts specific statistics about details of the impact of
   *    their money growing within the stock market.
   * @param { Number } moneyHovered : The current amount of money within this
   *    given year.
   * @param { Number } index : Represent the amount of "years" within the
   *    simulation the user has been investing in.
   * @returns : A array of maps containing statical prompts and their value. The
   *    prompts are stored within a key named "label" and the actual statistical
   *    value of that prompt is stored in a key name "value"
   */
  const computeStatsOfCompoundedMoney = (moneyHovered, index) => {
    const invested = Math.round(incomeToInvestAnnually) * index;

    const earnedMoney = {
      label: `Earnings `,
      value: `: $${addComasToNumber(moneyHovered)}`,
    };
    const finalEarnings = {
      label: `Final Earnings : `,
      value: `$${addComasToNumber(moneyHovered)}`,
    };
    const selectedYear = {
      label: `Current Year : `,
      value: `${convertNumberToDate(index)}`,
    };
    const retirementDate = {
      label: `Retirement Year : `,
      value: `${convertNumberToDate(65 - age)}`,
    };
    const moneyInvested = {
      label: `Money Invested : `,
      value: `$${addComasToNumber(invested)}`,
    };
    const growthOfInvestedDollar = {
      label: `Growth of one invested dollar : `,
      value: `
        $${addComasToNumber(Math.round(moneyHovered / invested))}
      `,
    };
    const taxes = {
      label: `Taxes Paid : `,
      value: `
        $${addComasToNumber(Math.round(totalTaxesPaid.at(index)))}
      `,
    };

    if (index !== 65 - age)
      return [
        earnedMoney,
        selectedYear,
        moneyInvested,
        growthOfInvestedDollar,
        taxes,
      ];

    return [
      finalEarnings,
      retirementDate,
      moneyInvested,
      growthOfInvestedDollar,
      taxes,
    ];
  };

  /**
   * @param { * } event : Information about the mouse's / cursors current
   *    position
   * @param { * } svg : The chart to draw the "lines" onto
   * @param { * } xScale : A mapping of the internal years to a Y pixel on the
   *    chart
   * @param { * } yScale : A mapping of the internal earnings to a X pixel on the
   *    chart
   * @param { * } height : Height of the chart
   */
  const graphOnHover = (event, svg, xScale, yScale, height) => {
    const clientX = d3.pointer(event)[0] - MARGIN.left;

    if (clientX > INNER_MARGIN.left && clientX < width) {
      // Set the line position
      svg.select("#overlay")
        .select("line")
        .style("opacity", 0.45)
        .attr("stroke", "gray")
        .style("stroke-width", 2.25)
        .attr("x1", clientX)
        .attr("x2", clientX)
        .attr("y1", height - INNER_MARGIN.bottom)
        .attr("y2", 0);

      // Compute the values of the mouses position
      const age = Math.round(xScale.invert(clientX));
      const moneyHovered = Math.round(retirementEarnings[age]);
      const flipOverlay = clientX > width / 2;

      const overLayData = computeStatsOfCompoundedMoney(moneyHovered, age);

      // Draw text with statistics about the current position
      svg.select("#overlay")
        .selectAll("text.hover-text")
        .data(overLayData)
        .join(
          (enter) => enter.append("text").attr("class", "hover-text"),
          (update) => update,
          (exit) => exit.remove()
        )
        .text((d) => d.label + d.value)
        .attr("x", flipOverlay ? clientX - 255 : clientX + 10)
        .attr("y", (d, i) => 16.5 + i * 18)
        .style("fill", "rgba(244, 244, 245, 1)")
        .style("font-size", "15px")
        .style("padding", "2px");

      // Move the overlay rectangle
      const rectWidth  = 275;
      const rectHeight = 110;
      const cornerRadius = 5;

      svg.select("#overlay")
        .select("rect")
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("x", flipOverlay ? clientX - rectWidth : clientX)
        .attr("y", -5)
        .attr("fill", "gray")
        .attr("rx", cornerRadius) // Set the x-radius for rounded corners
        .attr("ry", cornerRadius) // Set the y-radius for rounded corners
        .style("opacity", 0.2);
    }
  };
  // -==== CREATING THE FULL CHART ====-

  useEffect(() => {
    const { CURRENT_MARGIN, phoneDisplay, svgWidth, svgHeight } = getMarginOffScreenSize();
    const widthPadding  = MARGIN.left + MARGIN.right + INNER_MARGIN.left;
    const heightPadding = MARGIN.top + MARGIN.bottom;

    d3.select("#Linechart-div")
      .select("svg")
      .attr("font-family", "League Spartan")
      .attr("width", (width ? width : 0) + widthPadding )
      .attr("height", (height ? height : 0) + heightPadding)
      .select("g")
      .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

    if (retirementEarnings.length) {
      let svg = d3.select("#Linechart-div").select("svg").select("g");
      svg.append("g").attr("id", "overlay").append("line");
      svg.select("#overlay").append("rect");

      const graphHeight = height - INNER_MARGIN.bottom;

      const [yAxis, xAxis, yScale, xScale] = setupChartAxis(graphHeight);

      // Append the axis elements first
      svg.append("g")
        .classed("yAxis", true)
        .attr(`transform", translate(${INNER_MARGIN.left}, 0)`);

      svg.append("g")
        .classed("xAxis", true)
        .attr("transform", `translate(0, ${graphHeight})`);

      // Call the axis"s
      svg.select(".yAxis")
        .call(yAxis)
        .attr("font-size", "16")
        .style("color", "rgba(244, 244, 245, 0.8)");
      
      svg.select(".xAxis")
        .call(xAxis)
        .attr("font-size", "16")
        .style("color", "rgba(244, 244, 245, 0.8)");

      // Add labels to the axis's
      svg.select("#xAxisLabel")
        .text("Year")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .style("font-size", "22px")
        .style("fill", "rgba(244, 244, 245, 0.9)");

      svg.select("#yAxisLabel")
        .text("Money made")
        .attr("x", -MARGIN.left / 4)
        .attr("y", -MARGIN.top / 5)
        .style("font-size", "22px")
        .style("fill", "rgba(244, 244, 245, 0.9)");

      d3.select("#Linechart-div").selectAll(".linePath").remove();
      d3.select("#Linechart-div").selectAll("line.vertical-grid").remove();

      // Draw all of the data of the graph
      svg = drawGradientAreaOnGraph(svg, graphHeight, xScale, yScale);
      svg = drawLinesOnGraph(svg, xScale, yScale);

      // Attach on On-Click listener
      d3.select("#Linechart-div")
        .select("svg")
        .on("mousemove", (e) => graphOnHover(e, svg, xScale, yScale, height));
    }
  }, [retirementEarnings, graphDimensions]);

  function RetirementStatisticCard({statsInfo}) {
    const {label, value, spanStyling, statsCardStyling} = statsInfo
    return (
      <div className={statsCardStyling} key={label + value}>
        <p className="text-[17.5px] text-[#ebebed]/90 tracking-wide w-[97%]">
          <strong>{label}</strong>
        </p>
        <span className={spanStyling}>
          <p className="ml-[6px]">{value}</p>
        </span>
      </div>
    )
  }

  /**
   * @brief : Provides a side bar containing a list of statistics
   *    relating to the retirement simulation
   */
  function StatsSidebar() {
    // Get the over-all statistics of the final retirement estimate
    const retirementStats = computeStatsOfCompoundedMoney(
      Math.round(retirementEarnings.at(-1)), 65 - age
    );

    // Create the stylings for the stats-side bar
    const statsStyling = [
      "mt-[4%]",
      "h-[100%]",
      "flex",
      "flex-col",
      "gap-[3%]",
      "justify-start",
    ].join(" ");

    const statsCardStyling = [
      "flex",
      "flex-col",
      "gap-[4px]",
      "justify-center",
      "h-[14%]",
      "w-[90%]",
      "border-l-[5px]",
      "border-l-[#c1514a]/75",
      //"bg-[#c2c5c2]/80",
      "bg-[#0a0b0d]/50",
      "pl-[15px]",
      "rounded-[7.5px]",
    ].join(" ");

    const spanStyling = [
      "text-[20px]",
      "text-[#cb372d]",
      "bg-[#c1514a]/10",
    ].join(" ");

    return (
      <div id="Overview-div" className={statsStyling}>
        {/* Display each statistic onto the sidebar */}
        {retirementStats.map((statsInfo) => {
          // Inject the styling into the statsInfo
          statsInfo["statsCardStyling"] = statsCardStyling
          statsInfo["spanStyling"] = spanStyling

          return (
            <RetirementStatisticCard statsInfo={statsInfo}/>
          );
        })}
      </div>
    );
  }

  const dashboardSectionStyling = [
    "bg-[#101215]/75",
    "w-[calc(90vw-360px)] max-xl:w-[87.5vw]",
    "max-h-[80vh] min-h-[80vh] max-xl:max-h-[500px] max-2xl:min-h-[500px]",
    "flex max-xl:flex-col",
  ].join(" ");

  return (
    <>
      <section ref={sizeRef} className={dashboardSectionStyling}>
        {children}
        <div id="Linechart-div" className={children ? "blur-[0.675px]" : ""}>
          {/* Create heading text for the projection chart */}
          <strong>
            <h3 className={ "absolute text-3xl mt-[2.25%] ml-[1.5%] text-[#f4f4f5]"}>
              Retirement Calculator :
            </h3>
          </strong>
          {/* A svg for D3 to use to display the retirement projection chart */}
          <svg>
            {/* Elements for d3 to use in order to construct the y-axis and x-axis */}
            <g>
              <text id="xAxisLabel"></text>
              <text id="yAxisLabel"></text>
            </g>
          </svg>
        </div>
        <StatsSidebar />
      </section>
    </>
  );
}
