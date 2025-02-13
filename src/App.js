import React, { useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Login from "./pages/Login";
import axios from "axios";


// Lazy load components
const ApproveTransfer = React.lazy(() => import("./pages/ApproveTransfer"));
const TransferReport = React.lazy(() => import("./pages/TransferReport"));
const Procurement = React.lazy(() => import("./pages/Procurement"));
const StockSummary = React.lazy(() => import("./pages/StockSummary"));
const TransferSummary = React.lazy(() => import("./pages/TransferSummary"));
const StockAnalysisOverall = React.lazy(() =>
  import("./pages/StockAnalysisOverall")
);
const StockAnalysisShoplevel = React.lazy(() =>
  import("./pages/StockAnalysisShoplevel")
);
const TargetMonitoring = React.lazy(() => import("./pages/TargetMonitoring"));
const TransferRecieveSummary = React.lazy(() =>
  import("./pages/TransferRecieveSummery")
);
const TransferSummaryStore = React.lazy(() =>
  import("./pages/TransferSummaryStore")
);
const StockSummaryStore = React.lazy(() => import("./pages/StockSummaryStore"));
const TargetMonitoringStore = React.lazy(() =>
  import("./pages/TargetMonitoringStore")
);
const ProcurementApproveReport = React.lazy(() =>
  import("./pages/ProcurementApproveReport")
);
const SalesAllinone = React.lazy(() => import("./pages/SalesAllinone"));
const PeriodComparsion = React.lazy(() => import("./pages/PeriodComparsion"));
const SalesAnalysis = React.lazy(() => import("./pages/SalesAnalysis"));
const AllinoneStock = React.lazy(() => import("./pages/AllinoneStock"));
const TargetAchieve = React.lazy(() => import("./pages/TargetAchieve"));
const BrandAchievement = React.lazy(() => import("./pages/BrandAchievement"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("user"));

  const token = sessionStorage.getItem("token");
  // axios.defaults.headers.common["Authorization"] = "Bearer " + token;

  return (
    <>
      {isLoggedIn ? (
        <HashRouter>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/ApproveTransfer" element={<><Sidebar /> <ApproveTransfer /></>} />
              <Route path="/TransferReport" element={<><Sidebar /> <TransferReport /></>} />
              <Route path="/Procurement" element={<><Sidebar /> <Procurement /></>} />
              <Route path="/StockSummary" element={<><Sidebar /> <StockSummary /></>} />
              <Route path="/TransferSummary" element={<><Sidebar /> <TransferSummary /></>} />
              <Route path="/StockAnalysisOverall" element={<><Sidebar /> <StockAnalysisOverall /></>} />
              <Route path="/StockAnalysisShoplevel" element={<><Sidebar /> <StockAnalysisShoplevel /></>} />
              <Route path="/TargetMonitoring" element={<><Sidebar /> <TargetMonitoring /></>} />
              <Route path="/TransferRecieveSummary" element={<><Sidebar /> <TransferRecieveSummary /></>} />
              <Route path="/TransferSummaryStore" element={<><Sidebar /> <TransferSummaryStore /></>} />
              <Route path="/StockSummaryStore" element={<><Sidebar /> <StockSummaryStore /></>} />
              <Route path="/TargetMonitoringStore" element={<><Sidebar /> <TargetMonitoringStore /></>} />
              <Route path="/ProcurementApproveReport" element={<><Sidebar /> <ProcurementApproveReport /></>} />
              <Route path="/SalesAllinone" element={<><Sidebar /> <SalesAllinone /></>} />
              <Route path="/PeriodComparsion" element={<><Sidebar /> <PeriodComparsion /></>} />
              <Route path="/SalesAnalysis" element={<><Sidebar /> <SalesAnalysis /></>} />
              <Route path="/AllinoneStock" element={<><Sidebar /> <AllinoneStock /></>} />
              <Route path="/TargetAchieve" element={<><Sidebar /> <TargetAchieve /></>} />
              <Route path="/BrandAchievement" element={<><Sidebar /> <BrandAchievement /></>} />
            </Routes>
          </React.Suspense>
        </HashRouter>
      ) : (
        (sessionStorage.removeItem("flag"),
        sessionStorage.removeItem("token"),
        sessionStorage.removeItem("user"),
        (
          <HashRouter>
            <Routes>
              <Route path="/" element={<Login />} />
            </Routes>
          </HashRouter>
        ))
      )}
    </>
  );
}

// axios.defaults.baseURL = "http://localhost:7965";
// // axios.defaults.baseURL = "http://43.242.122.217:7965"; //pykore
axios.defaults.baseURL = "http://103.183.240.178:7965"; //pytcm

// // axios.defaults.baseURL = "https://dceconnect.in/stock-optimization-api";
// axios.defaults.baseURL = "http://122.165.18.7:5000";
// axios.defaults.baseURL = "http://localhost:5000";

export default App;
