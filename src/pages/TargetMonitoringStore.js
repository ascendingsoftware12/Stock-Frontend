import React, { useState, useMemo, useEffect } from "react";
import 'flowbite/dist/flowbite.css';
import '../style/table.css';
import axios from "axios";

import { Button, Label, TextInput, Select, Table } from 'flowbite-react';

function TargetMonitoringStore() {

  const [TransferMonitering, setTransferMonitering] = useState({});
  const [TransferMYMonitering, setTransferMYMonitering] = useState({});

  const user = sessionStorage.getItem("user");
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  useEffect(() => {
    fetchTransferMonitering();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    setMonth(currentMonth);
    setYear(currentYear);
    fetchMYTransferMonitering(currentMonth, currentYear);

  }, []);

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const fetchTransferMonitering = async () => {
    try {
      const response = await axios.get(`/targetmonitoring/store/${user}`);
      const TransferMoniteringData = response.data;
      setTransferMonitering(TransferMoniteringData);
    } catch (error) {
      console.error("Error fetching TransferMonitering Data:", error);
    }
  };

  const fetchMYTransferMonitering = async (month, year) => {
    try {
      const response = await axios.get(`/targetmonitoring/store/monthyear/${user}`, {
        params: {
          month: month,
          year: year,
        },
      });
      const TransferMoniteringData = response.data;
      setTransferMYMonitering(TransferMoniteringData);
    } catch (error) {
      console.error("Error fetching TransferMonitering Data:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchTransferMonitering(month, year);
  };







  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto mt-14">
        <div className="p-4 rounded-lg shadow bg-white">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Target Monitoring Report</h3>
            <form method="post" onSubmit={handleSubmit}>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <div className="mb-2 block">
                    <Label htmlFor="month" value="Month" />
                  </div>
                  <select
                    name="month"
                    id="month"
                    value={month}
                    onChange={handleMonthChange}
                    required
                    className="form-select w-full"
                  >
                    <option value="">Select a month</option>
                    {[...Array(12).keys()].map((m) => (
                      <option key={m + 1} value={m + 1}>
                        {m + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block">
                    <Label htmlFor="year" value="Year" />
                  </div>
                  <select
                    name="year"
                    id="year"
                    value={year}
                    onChange={handleYearChange}
                    required
                    className="form-select w-full"
                  >
                    <option value="">Select a year</option>
                    {[2023, 2024].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3 flex items-end">
                  <Button
                    style={{ backgroundColor: '#A4DDED' }}
                    className="text-dark"
                    type="submit"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <br />

          <div className="overflow-x-auto">
            <table className="w-full sm:w-auto leading-normal">
              <thead  >
                <tr>
                  <th
                    colspan="12"
                    className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-center text-gray-100 uppercase"
                  >
                   Section wise - Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Section
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Target
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Total Quantity
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Total Sales
                  </td> <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Cur Target Ach%
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Avg qty sold per day
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Avg qty to Avg Target
                  </td> <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Projected Target Ach%
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    CM  Vs 3M Growth
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    CM Vs LM Growth
                  </td> <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Ach Ratio
                  </td>
                </tr>
                {Object.keys(TransferMonitering).map((key) => (
                  <tr key={key}>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{key}</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{formatNumber(TransferMonitering[key].target)}</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{formatNumber(TransferMonitering[key].tot_qty)}</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{formatNumber(TransferMonitering[key].tot_sales)}</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{TransferMonitering[key].target_ach_percent}</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{formatNumber(TransferMonitering[key].avg_qty_sold_per_day)}</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{formatNumber(TransferMonitering[key].avg_qty_ach_target)}</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">0</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{formatNumber(TransferMonitering[key].cm_3month_growth)}</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{formatNumber(TransferMonitering[key].cm_vs_lm_growth)}</td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{formatNumber(TransferMonitering[key].ach_ratio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          {/* <div className="overflow-x-auto">
            <table className="w-full  leading-normal">
              <thead  >
                <tr>
                  <th
                    colspan="12"
                    className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-center text-gray-100 uppercase"
                  >
                    Section wise - Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Section
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Target
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Quantity
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Ach Category
                  </td> <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Target Ach%
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Avg qty sold per day
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Avg qty to Avg Target
                  </td> <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                    Project Target Ach%
                  </td>

                </tr>
                {Object.keys(TransferMYMonitering).map((key) => {
                  const item = TransferMYMonitering[key];
                  // Check if any value in the item object is non-empty
                  const hasValues = Object.values(item).some(value => value != null && value !== '');
                  if (!hasValues) return null; // Skip rendering if no values are present

                  return (
                    <tr key={key}>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">{key}</td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                        {item.Target ? parseFloat(item.Target).toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                        {item.Quantity ? parseFloat(item.Quantity).toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                        {item.AchCategory ? parseFloat(item.AchCategory).toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                        {item.Target_ach_percent ? parseFloat(item.Target_ach_percent).toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                        {item.Avg_qty_sold_per_day ? parseFloat(item.Avg_qty_sold_per_day).toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                        {item.Avg_qty_ach_target ? parseFloat(item.Avg_qty_ach_target).toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                        {item.Avg_qty_ach_target ? parseFloat(item.Avg_qty_ach_target).toFixed(2) : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
                {Object.keys(TransferMYMonitering).every(key => !Object.values(TransferMYMonitering[key]).some(value => value != null && value !== '')) && (
                  <tr>
                    <td colSpan="8" className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">No Data Available</td>
                  </tr>
                )}

              </tbody>
            </table>
          </div> */}
        </div>
      </div>
    </div >
  );
}

export default TargetMonitoringStore;
