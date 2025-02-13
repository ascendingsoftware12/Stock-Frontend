import React, { useState, useMemo, useEffect } from "react";
import "flowbite/dist/flowbite.css";
import "../style/table.css";
import Dendrogram from "./Dendrogram";
import { Button, Label, TextInput, Table } from "flowbite-react";
import Select from "react-select";
import axios from "axios";

function TargetMonitoring() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [date, setDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    setMonth(month);
    setYear(year);
    return `${year}-${month}`;
  });

  const [section, setSection] = useState({ value: "Mobile", label: "MOBILE" });
  const [selectsection, setSelectSection] = useState("Mobile");
  const [selectLast3m, setSelectLast3m] = useState('');
  const [fsection, setfsection] = useState();
  const [CMvs3month, setCMvs3month] = useState();
  const [CMVsLM, setCMVsLM] = useState();
  const [storesales, setstoresales] = useState();
  const [storetargetachieved, setstoretargetachieved] = useState();
  const [dendrogram, setdendrogram] = useState();

  const options =
    fsection &&
    fsection.map((section) => ({
      value: section,
      label: section,
    }));

  const last3moptions = [
    { value: "0", label: "0M ACH" },
    { value: "1", label: "1M ACH" },
    { value: "2", label: "2M ACH" },
    { value: "3", label: "3M ACH" },
  ];

  const getLast3mLabel = (value) => {
    const selectedOption = last3moptions.find(
      (option) => option.value === value
    );
    return selectedOption
      ? { value: selectedOption.value, label: selectedOption.label }
      : null;
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setDate(value);
    const [year, month] = value.split("-");
    setYear(year);
    setMonth(month);
  };

  useEffect(() => {
    fetchCMvs3month();
    fetchCMVsLM();
    fetchstoresales();
    fetchstoretargetachieved();
    fetchdendrogram();
    fetchsection();
  }, []);

  const fetchsection = async () => {
    try {
      // Fetch data from the endpoint without trailing slash
      const response = await axios.get("/section");
      const SectionData = response.data;
      setfsection(SectionData); // Ensure this function is correctly defined
    } catch (error) {
      console.error("Error fetching Section Data:", error);
    }
  };

  const fetchCMvs3month = async () => {
    try {
      const response = await axios.get(
        `targetmonitoring/headoffice/cm_vs_3mnth?month=${month}&year=${year}&section=${selectsection}&last_3mnth_ach=${selectLast3m}`
      );
      const CMvs3monthData = response.data;
      setCMvs3month(CMvs3monthData);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };

  const fetchCMVsLM = async () => {
    try {
      const response = await axios.get(
        `targetmonitoring/headoffice/cm_vs_lm?month=${month}&year=${year}&section=${selectsection}&last_3mnth_ach=${selectLast3m}`
      );
      const CMVsLMData = response.data;
      setCMVsLM(CMVsLMData);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };

  const fetchstoresales = async () => {
    try {
      const response = await axios.get(
        `targetmonitoring/headoffice/storesales?month=${month}&year=${year}&section=${selectsection}&last_3mnth_ach=${selectLast3m}`
      );
      const storesalesData = response.data;
      setstoresales(storesalesData);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };

  const fetchstoretargetachieved = async () => {
    try {
      const response = await axios.get(
        `targetmonitoring/headoffice/storetargetachieved?month=${month}&year=${year}&section=${selectsection}&last_3mnth_ach=${selectLast3m}`
      );
      const storetargetachievedData = response.data;
      setstoretargetachieved(storetargetachievedData);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };

  const fetchdendrogram = async () => {
    try {
      const response = await axios.get(
        `targetmonitoring/headoffice/dendrogram?month=${month}&year=${year}&section=${selectsection}&last_3mnth_ach=${selectLast3m}`
      );
      const dendrogramData = response.data;
      // console.log(dendrogramData);
      setdendrogram(dendrogramData);
      console.log(dendrogram);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };

  const handleSearch = () => {

    // Clear previous data
    setCMvs3month(null);
    setCMVsLM(null);
    setstoresales(null);
    setstoretargetachieved(null);
    setdendrogram(null);

    // Fetch new data
    fetchCMvs3month();
    fetchCMVsLM();
    fetchstoresales();
    fetchstoretargetachieved();
    fetchdendrogram();
  };

  const data = {
    name: "Total Stores - 64",
    children: [
      {
        name: "Not Achieved - 63",
        children: [
          {
            name: "0-50% - 63",
            children: [
              { name: "0M ACH - 24" },
              { name: "1M ACH - 21" },
              { name: "2M ACH - 17" },
              { name: "3M ACH - 1" },
            ],
          },
        ],
      },
      {
        name: "Achieved - 1",
        children: [
          { name: ">=100-120% - 0" },
          {
            name: ">120% - 1",
            children: [{ name: "1M ACH - 1" }],
          },
        ],
      },
    ],
  };

  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto mt-14">
        <div className="p-4 rounded-lg shadow bg-white">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Target Monitoring Report
            </h3>
            <form method="post">
              <div className="flex gap-4">
                <div className="w-1/4">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Month " />
                  </div>
                  <TextInput
                    name="schemename"
                    type="month"
                    value={date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-1/4">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Section " />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    value={section}
                    onChange={(selectedOption) => {
                      {
                        setSection(selectedOption || "");
                        setSelectSection(
                          selectedOption ? selectedOption.value : ""
                        );
                      }
                    }}
                    options={options}
                    placeholder="Select an option"
                    isClearable={true}
                  />
                </div>
                <div className="w-1/4">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Last 3M Achievement" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    value={getLast3mLabel(selectLast3m)}
                    onChange={(selectedOption) => {
                      setSelectLast3m(
                        selectedOption ? selectedOption.value : ""
                      );
                    }}
                    options={last3moptions}
                    placeholder="Select an option"
                    isClearable={true}
                  />
                </div>
                <div className="w-1/4">
                  <div className="flex  gap-4 mt-6">
                    <Button
                      style={{ backgroundColor: "#A4DDED" }}
                      className="text-dark"
                      onClick={handleSearch}
                      type="button"
                    >
                      {"Search"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <br />
          <div style={{ textAlign: "left", margin: 0 }}>
            {dendrogram && Object.keys(dendrogram).length > 0 && (
              <Dendrogram data={dendrogram} />
            )}
          </div>
          <br />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {" "}
                CM Vs 3 Month Avg Growth Category
              </h3>

              <table className="w-full  leading-normal">
                <thead>
                  <tr>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-gray-900  text-sm">
                      No Target
                    </th>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-sm text-gray-900 ">
                      {"<-50%"}
                    </th>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-gray-900  text-sm">
                      {"-50% to 0%"}
                    </th>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-gray-900  text-sm">
                      {"1% to 50%"}
                    </th>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-gray-900 text-sm">
                      {">50%"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#fcbf49" }}
                    >
                      {CMvs3month && CMvs3month.bucket1}
                    </td>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#e5989b" }}
                    >
                      {CMvs3month && CMvs3month.bucket2}
                    </td>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#ef476f" }}
                    >
                      {CMvs3month && CMvs3month.bucket3}
                    </td>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#34a0a4" }}
                    >
                      {CMvs3month && CMvs3month.bucket4}
                    </td>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#6a994e" }}
                    >
                      {CMvs3month && CMvs3month.bucket5}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full   leading-normal">
                <thead>
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider text-center"
                    >
                      Store Sales Value
                    </td>
                  </tr>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                      Store Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                      Total Sales
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                      CM vs 3 Month Avg
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                      CM vs LM
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {storesales &&
                    storesales.map((store, index) => (
                      <tr key={index}>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {store.store_code}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {store.total_sales &&
                            parseInt(store.total_sales, 10).toLocaleString()}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {store["cm _vs_3mnth_growth"] &&
                            store["cm _vs_3mnth_growth"].toFixed(2)}
                          %
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {store.cm_vs_lm && store.cm_vs_lm.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white ">
                CM Vs LM Growth Category
              </h3>

              <table className="w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-gray-900  text-sm">
                      No Target
                    </th>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-sm text-gray-900 ">
                      {"<-50%"}
                    </th>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-gray-900  text-sm">
                      {"-50% to 0%"}
                    </th>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-gray-900  text-sm">
                      {"1% to 50%"}
                    </th>
                    <th className="px-2 py-2 border-0 border-gray-200 bg-white text-gray-900 text-sm">
                      {">50%"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#fcbf49" }}
                    >
                      {CMVsLM && CMVsLM.bucket1}
                    </td>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#e5989b" }}
                    >
                      {CMVsLM && CMVsLM.bucket2}
                    </td>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#ef476f" }}
                    >
                      {CMVsLM && CMVsLM.bucket3}
                    </td>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#34a0a4" }}
                    >
                      {CMVsLM && CMVsLM.bucket4}
                    </td>
                    <td
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      style={{ backgroundColor: "#6a994e" }}
                    >
                      {CMVsLM && CMVsLM.bucket5}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full leading-normal">
                <thead>
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider text-center"
                    >
                      Store Target Achieved Status
                    </td>
                  </tr>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                      Store Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                      Target LM Ach%
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                      Target MB Ach%
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                      Target 2MB Ach%
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader  text-left text-xs font-semibold text-gray-100 uppercase tracking-wider">
                      Ach Ratio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {storetargetachieved &&
                    storetargetachieved.map((store, index) => (
                      <tr key={index}>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {store.store_code}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {store.target_lm_ach_percent.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {store.target_mb_ach_percent.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {store.target_2mb_ach_percent.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {store.ach_ratio.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TargetMonitoring;
