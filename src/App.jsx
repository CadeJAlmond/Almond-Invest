/** AppLayout.Js
 * @returns : This creates the general layout for the entire app and the
 *    routes that exist within the application.
 *
 * -Referenced : Main.jsx
 */

/* --=== Imports ===-- */
// Navigation
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

// Dashboard
import RetirementDashboard from "./components/RetirementCalc/RetirementDashboard";
import BudgetingDashboard from "./components/Budgeting/BudgetingDashboard";

function App() {
  
  function AppLayout() {
    return (
      <>
        <Header />
        <Routes>
          <Route path="/" element={<RetirementDashboard />} />
          <Route path="/budgets" element={<BudgetingDashboard />} />
          <Route path="*" element={<RetirementDashboard />} />
        </Routes>
      </>
    );
  }

  const appLayoutStyling = ["w-[100%]", "h-[100%]"].join(" ");

  return (
    <div className={appLayoutStyling}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </div>
  );
}

export default App;
