import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import { Button, Label, TextInput, Table } from "flowbite-react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import "../style/datatablestyle.css";
import "flowbite/dist/flowbite.css";
import Select from "react-select";

function StockSummaryStore() {
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [Stocksummary, setStocksummary] = useState({});
  const user = sessionStorage.getItem("user");
  const [FBrand, setFBrand] = useState();
  const [brand, setBrand] = useState("");
  const [FModelNumber, setFModelNumber] = useState();
  const [modelNumber, setModelNumber] = useState("");
  const [FItemName, setFItemName] = useState();
  const [itemName, setItemName] = useState("");
  const [EOLmodel, setEOLmodel] = useState("");
  useEffect(() => {
    fetchStocksummary();
  }, []);

  const options = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];

  const getOption = (value) => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption
      ? { value: selectedOption.value, label: selectedOption.label }
      : "";
  };

  const fetchStocksummary = async () => {
    try {
      const response = await axios.get(
        `/stocksummary/store/${user}?brand=${brand}&modelnumber=${modelNumber}&eolflag=${EOLmodel}&itemname=${itemName}`
      );
      const StocksummaryData = response.data;
      setStocksummary(StocksummaryData);
      // console.log(StocksummaryData);

      
      const uniquebrand = Array.from(
        new Set(StocksummaryData.map((item) => item.BRAND))
      );
      setFBrand(uniquebrand);

      const uniquemodelnum = Array.from(
        new Set(StocksummaryData.map((item) => item.MODELNO))
      );
      setFModelNumber(uniquemodelnum);

      const uniqueItem = Array.from(
        new Set(StocksummaryData.map((item) => item.ITEM_NAME))
      );
      setFItemName(uniqueItem);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `/stocksummary/store/${user}?brand=${brand}&modelnumber=${modelNumber}&eolflag=${EOLmodel}&itemname=${itemName}`
      );
      const StocksummaryData = response.data;
      setStocksummary(StocksummaryData);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };
  const handleFieldChange = (selectedOption, type) => {
    let selectedValue = selectedOption ? selectedOption.value : "";
  
    // Update the corresponding state based on the type
    switch (type) {
      case "brand":
        setBrand(selectedValue);
        break;
      case "modelNumber":
        setModelNumber(selectedValue);
        break;
      case "itemName":
        setItemName(selectedValue);
        break;
      default:
        break;
    }
  
    // Get current selected values
    const currentBrand = type === "brand" ? selectedValue : brand;
    const currentModelNumber = type === "modelNumber" ? selectedValue : modelNumber;
    const currentItemName = type === "itemName" ? selectedValue : itemName;
  
    // Filter the options based on current selected values
    const filteredOptions = Stocksummary.filter((item) => {
      return (
        (!currentBrand || item.BRAND === currentBrand) &&
        (!currentModelNumber || item.MODELNO === currentModelNumber) &&
        (!currentItemName || item.ITEM_NAME === currentItemName)
      );
    });
  
    // Filtered options arrays
    const filteredBrands = Array.from(new Set(filteredOptions.map((item) => item.BRAND)));
    const filteredModelNumbers = Array.from(new Set(filteredOptions.map((item) => item.MODELNO)));
    const filteredItemNames = Array.from(new Set(filteredOptions.map((item) => item.ITEM_NAME)));
  
    // Update state with filtered options
    setFBrand(filteredBrands);
    setFModelNumber(filteredModelNumbers);
    setFItemName(filteredItemNames);
  };
  

  const data = Array.isArray(Stocksummary)
    ? Stocksummary.map((SS) => ({
        brand: SS.BRAND,
        itemName: SS.ITEM_NAME,
        Modnum: SS.MODELNO,
        ESQuantity: formatNumber(SS.excess_stock_qty),
        ESValue: formatNumber(SS.excess_stock_price),
        DSQuantity: formatNumber(SS.dead_stock_qty),
        DSValue: formatNumber(SS.dead_stock_price),
        TSQuantity: formatNumber(SS.total_qty),
        TSValue: formatNumber(SS.total_price),
        EOLmodel: SS.EOL_FLAG,
      }))
    : [];

  const columns = [
    {
      name: "Brand",
      selector: (row) => row.brand,
      sortable: true,
      wrap: true,
    },
    {
      name: "Model Number",
      selector: (row) => row.Modnum,
      sortable: true,
      wrap: true,
    },
    {
      name: "Item",
      selector: (row) => row.itemName,
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
      wrap: true,
      sortable: true,
    },
    {
      name: "Dead Stock Value",
      wrap: true,
      selector: (row) => row.DSValue,
      sortable: true,
    },
    {
      name: "EOL Model",
      selector: (row) => row.EOLmodel,
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto mt-14">
        <div className="p-4 rounded-lg shadow bg-white">
          <br />
          <form method="post">
  <div className="flex gap-4">
    <div className="w-1/2">
      <div className="mb-2 block">
        <Label htmlFor="brand" value="Brand" />
      </div>
      <Select
        id="brand"
        name="brand"
        value={brand ? { value: brand, label: brand } : ""}
        onChange={(selectedOption) => handleFieldChange(selectedOption, "brand")}
        options={Array.isArray(FBrand) ? FBrand.map((code) => ({ value: code, label: code })) : []}
        placeholder="Brand"
        isClearable={true}
      />
    </div>

    <div className="w-1/2">
      <div className="mb-2 block">
        <Label htmlFor="modelNumber" value="Model Number" />
      </div>
      <Select
        id="modelNumber"
        name="modelNumber"
        value={modelNumber ? { value: modelNumber, label: modelNumber } : ""}
        onChange={(selectedOption) => handleFieldChange(selectedOption, "modelNumber")}
        options={Array.isArray(FModelNumber) ? FModelNumber.map((code) => ({ value: code, label: code })) : []}
        placeholder="Model Number"
        isClearable={true}
      />
    </div>

    <div className="w-1/2">
      <div className="mb-2 block">
        <Label htmlFor="itemName" value="Item Name" />
      </div>
      <Select
        id="itemName"
        name="itemName"
        value={itemName ? { value: itemName, label: itemName } : ""}
        onChange={(selectedOption) => handleFieldChange(selectedOption, "itemName")}
        options={Array.isArray(FItemName) ? FItemName.map((code) => ({ value: code, label: code })) : []}
        placeholder="Item Name"
        isClearable={true}
      />
    </div>

    <div className="w-1/2">
      <div className="mb-2 block">
        <Label htmlFor="EOLmodel" value="EOL Model" />
      </div>
      <Select
        id="EOLmodel"
        name="EOLmodel"
        value={EOLmodel ? { value: EOLmodel, label: EOLmodel } : ""}
        onChange={(selectedOption) => setEOLmodel(selectedOption ? selectedOption.value : "")}
        options={options} // Assuming 'options' contains EOL models
        placeholder="EOL Model"
        isClearable={true}
      />
    </div>

    <div className="w-1/2">
      <br />
      <Button
        style={{ backgroundColor: "#A4DDED" }}
        className="text-dark"
        onClick={handleSearch}
        type="button"
      >
        Search
      </Button>
    </div>
  </div>
  <br />
</form>


          <DataTable
            title="Stock Summary List"
            columns={columns}
            data={data}
            pagination
            subHeader
            persistTableHead
            striped
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
}

export default StockSummaryStore;
