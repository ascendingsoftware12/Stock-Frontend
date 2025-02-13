import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import { Button, TextInput } from "flowbite-react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import "../style/datatablestyle.css";
import "flowbite/dist/flowbite.css";
import axios from "axios";
import Select from "react-select";

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #457b9d;
`;

const FilterComponent = ({ onFilter, onClear, filterText }) => (
  <>
    <TextField
      placeholder="Filter By Title"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton onClick={onClear}>X</ClearButton>
  </>
);

function StockSummary() {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [Stocksummary, setStocksummary] = useState({});
  const [Ffstorecode, setFfstorecode] = useState({});
  const [fstorecode, setfstorecode] = useState("");
  const [loading, setLoading] = useState(false);
  const state = localStorage.getItem("selectedState");
  useEffect(() => {
    fetchStocksummary();
  }, []);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };


  const data = Array.isArray(Stocksummary)
    ? Stocksummary.map((SS) => ({
        FSCode: SS.FROM_STORE_CODE,
        ESQuantity: formatNumber(SS.excess_stock_qty),
        ESValue: formatNumber (SS.excess_stock_price),
        DSQuantity:formatNumber(SS.dead_stock_qty),
        DSValue: formatNumber(SS.dead_stock_price),
        TSQuantity:formatNumber(SS.total_qty),
        TSValue:formatNumber(SS.total_price),
      }))
    : [];

  const fetchStocksummary = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/stocksummary/headoffice/?state=${state}&fromstorecode=${fstorecode}`
      );
      const StocksummaryData = response.data;
      setStocksummary(StocksummaryData);

      const uniquefromStoreCodes = Array.from(
        new Set(StocksummaryData.map((item) => item.FROM_STORE_CODE))
      );
      setFfstorecode(uniquefromStoreCodes);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const SearchfetchStocksummary = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/stocksummary/headoffice/?state=${state}&fromstorecode=${fstorecode}`
      );
      const StocksummaryData = response.data;
      setStocksummary(StocksummaryData);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    SearchfetchStocksummary();
  };

  const columns = [
    {
      name: "From Store Code	",
      selector: (row) => row.FSCode,
      sortable: true,
      wrap: true,
    },
    {
      name: "Excess Stock Quantity",
      selector: (row) => row.ESQuantity,
      sortable: true,
      wrap: true,
    },
    {
      name: "Excess Stock Value",
      selector: (row) => row.ESValue,
      sortable: true,
      wrap: true,
    },
    {
      name: "Dead Stock Quantity",
      selector: (row) => row.DSQuantity,
      sortable: true,
      wrap: true,
    },
    {
      name: "Dead Stock Value",
      selector: (row) => row.DSValue,
      sortable: true,
      wrap: true,
    },
    {
      name: "Total Stock Quantity",
      selector: (row) => row.TSQuantity,
      sortable: true,
      wrap: true,
    },
    {
      name: "Total Stock Value",
      selector: (row) => row.TSValue,
      sortable: true,
      wrap: true,
    },
  ];

  const filteredItems = data.filter(
    (item) =>
      (item.FSCode &&
        item.FSCode.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.ESQuantity &&
        item.ESQuantity.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.brand &&
        item.brand.toLowerCase().includes(filterText.toLowerCase()))
  );

  // const subHeaderComponentMemo = useMemo(() => {
  //   const handleClear = () => {
  //     if (filterText) {
  //       setResetPaginationToggle(!resetPaginationToggle);
  //       setFilterText("");
  //     }
  //   };

  //   return (
  //     <FilterComponent
  //       onFilter={(e) => setFilterText(e.target.value)}
  //       onClear={handleClear}
  //       filterText={filterText}
  //     />
  //   );
  // }, [filterText, resetPaginationToggle]);

  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto mt-14">
        <div className="p-4 rounded-lg shadow bg-white">
          <div className="flex gap-4">
            <div className="w-1/6">
              <div className="mb-2 block">
                <label htmlFor="fromStoreCode" className="form-label">
                  From Store Code
                </label>
              </div>
              <Select
                id="fromStoreCode"
                name="fromStoreCode"
                value={
                  fstorecode ? { value: fstorecode, label: fstorecode } : ""
                }
                onChange={(selectedOption) => {
                  setfstorecode(selectedOption ? selectedOption.value : "");
                }}
                options={
                  Array.isArray(Ffstorecode)
                    ? Ffstorecode.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="Select an option"
                isClearable={true}
              />
            </div>

            <div className="w-1/6">
              <div className=" mt-6 block">
                <Button
                  style={{ backgroundColor: "#A4DDED" }}
                  onClick={handleSearch}
                  className="text-dark"
                  type="button"
                >
                  {"Search"}
                </Button>
              </div>
            </div>
          </div>
          <br />
          {loading && (
            <div
              role="status"
              class="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="flex items-center justify-between  pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="flex items-center justify-between  pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="flex items-center justify-between  pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="flex items-center justify-between  pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="flex items-center justify-between  pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="flex items-center justify-between  pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
              <span class="sr-only">Loading...</span>
            </div>
          )}
          {!loading && (
            <DataTable
              title="Stock Summary List"
              columns={columns}
              // data={filteredItems}
              data={data}
              pagination
              // paginationResetDefaultPage={resetPaginationToggle}
              subHeader
              // subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              striped
              highlightOnHover
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default StockSummary;
