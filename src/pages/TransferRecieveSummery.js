import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import { Button, TextInput, Label } from "flowbite-react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import "../style/datatablestyle.css";
import "flowbite/dist/flowbite.css";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

function TransferRecieveSummary() {
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [TransferRecieveSummary, setTransferRecieveSummary] = useState({});
  const [FFromStoreCode, setFFromStoreCode] = useState();
  const [FModelNumber, setFModelNumber] = useState([]);
  const [FItemName, setFItemName] = useState([]);
  const [itemName, setItemName] = useState("");
  const [FBrand, setFBrand] = useState([]);
  const [FromStoreCode, setFromStoreCode] = useState(null);
  
  const [modelNumber, setModelNumber] = useState(null);
  const [brand, setBrand] = useState(null);
  const [ReceivedDetails, setReceivedDetails] = useState([]);
  const user = sessionStorage.getItem("user");

  useEffect(() => {
    fetchReceiveSummary();
  }, []);

  const fetchReceiveSummary = async () => {
    try {
      const response = await axios.get(`/transferreceivesummary/${user}`);
      const TransferRecieveSummaryData = response.data;
      setTransferRecieveSummary(TransferRecieveSummaryData);

      const uniqueFromStoreCodes = Array.from(
        new Set(TransferRecieveSummaryData.map((item) => item.FROM_STORE_CODE))
      );
      setFFromStoreCode(uniqueFromStoreCodes);

      const uniqueModelNumber = Array.from(
        new Set(TransferRecieveSummaryData.map((item) => item.MODELNO))
      );
      setFModelNumber(uniqueModelNumber);

      const uniqueBrand = Array.from(
        new Set(TransferRecieveSummaryData.map((item) => item.BRAND))
      );
      setFBrand(uniqueBrand);

      const uniqueItemName = Array.from(
        new Set(TransferRecieveSummaryData.map((item) => item.ITEM_NAME))
      );
      setFItemName(uniqueItemName);
    } catch (error) {
      console.error("Error fetching ApproveTransfer Data:", error);
    }
  };
  const handleFieldChange = (selectedOption, type) => {
    let selectedValue = selectedOption ? selectedOption.value : "";
  
    switch (type) {
      case "toStoreCode":
        setFromStoreCode(selectedValue);
        console.log(`FromStoreCode set to: ${selectedValue}`);
        break;
      case "brand":
        setBrand(selectedValue);
        console.log(`Brand set to: ${selectedValue}`);
        break;
      case "modelNumber":
        setModelNumber(selectedValue);
        console.log(`Model Number set to: ${selectedValue}`);
        break;
      case "itemName":
        setItemName(selectedValue);
        console.log(`Item Name set to: ${selectedValue}`);
        break;
      default:
        break;
    }
   
    const currentToStoreCode = type === "toStoreCode" ? selectedValue : FromStoreCode;
    const currentBrand = type === "brand" ? selectedValue : brand;
    const currentModelNumber = type === "modelNumber" ? selectedValue : modelNumber;
    const currentItemName = type === "itemName" ? selectedValue : itemName;
  
    const filteredOptions = TransferRecieveSummary.filter((item) => {
      return (
        (!currentToStoreCode || item.FROM_STORE_CODE === currentToStoreCode) &&
        (!currentBrand || item.BRAND === currentBrand) &&
        (!currentModelNumber || item.MODELNO === currentModelNumber) &&
        (!currentItemName || item.ITEM_NAME === currentItemName)
      );
    });
  
   
    const filteredBrands = Array.from(new Set(filteredOptions.map((item) => item.BRAND)));
    const filteredModelNumbers = Array.from(new Set(filteredOptions.map((item) => item.MODELNO)));
    const filteredItemNames = Array.from(new Set(filteredOptions.map((item) => item.ITEM_NAME)));
    const filteredToStoreCodes = Array.from(new Set(filteredOptions.map((item) => item.FROM_STORE_CODE)));
  
    
    setFBrand(filteredBrands);
    setFModelNumber(filteredModelNumbers);
    setFItemName(filteredItemNames);
    setFFromStoreCode(filteredToStoreCodes); 

    
  };
  
  /*
  const handleStoreChange = (selectedOption, type) => {
    const selectedValue = selectedOption ? selectedOption.value : "";

    if (type === "from") {
      setFromStoreCode(selectedValue);
    }

    // Get the current state values for both store codes

    const currentFromStoreCode =
      type === "from" ? selectedValue : FromStoreCode;

    if (currentFromStoreCode) {
      // Case 3: Only "to" is selected
      const filteredbrand = TransferRecieveSummary.filter(
        (item) => item.FromStoreCode === currentFromStoreCode
      ).map((item) => item.brand);

      const uniquebrandNumbers = Array.from(new Set(filteredbrand));
      setFBrand(uniquebrandNumbers);

      const filteredModelNumbers = TransferRecieveSummary.filter(
        (item) => item.FromStoreCode === currentFromStoreCode
      ).map((item) => item.modelNumber);

      const uniqueModelNumbers = Array.from(new Set(filteredModelNumbers));
      setFModelNumber(uniqueModelNumbers);
    } else {
      // Case 4: Neither "from" nor "to" is selected (reset to all)
      const allModelNumbers = Array.from(
        new Set(TransferRecieveSummary.map((item) => item.modelNumber))
      );
      setFModelNumber(allModelNumbers);

      const allbrandNumbers = Array.from(
        new Set(TransferRecieveSummary.map((item) => item.brand))
      );
      setFBrand(allbrandNumbers);
    }
  };
  const handleBrandChange = (selectedOption) => {
    const selectedbrand = selectedOption ? selectedOption.value : "";
    setBrand(selectedbrand);

    const currentFromStoreCode = FromStoreCode;

    if (selectedbrand) {
      let filteredModelNumbers;

      if (currentFromStoreCode) {
        // Both "from" and "to" store codes are selected
        filteredModelNumbers = TransferRecieveSummary.filter(
          (item) =>
            item.brand === selectedbrand &&
            item.FromStoreCode === currentFromStoreCode
        ).map((item) => item.modelNumber);
      } else {
        // Neither store code is selected, just filter by brand
        filteredModelNumbers = TransferRecieveSummary.filter(
          (item) => item.brand === selectedbrand
        ).map((item) => item.modelNumber);
      }

      const uniqueModelNumbers = Array.from(new Set(filteredModelNumbers));
      setFModelNumber(uniqueModelNumbers);
    } else {
      // If no brand is selected, reset to all model numbers
      const allModelNumbers = Array.from(
        new Set(TransferRecieveSummary.map((item) => item.modelNumber))
      );
      setFModelNumber(allModelNumbers);
    }
  };
  */
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // ISO format 'yyyy-MM-dd'
  };

  const sortedTransferRecieveSummary = Array.isArray(TransferRecieveSummary)
    ? TransferRecieveSummary.sort((a, b) =>
        a.t_received_flag === "TRUE" ? -1 : 1
      )
    : [];
  const today = formatDate(new Date());
  const data = sortedTransferRecieveSummary.map((TRS) => ({
    show: (
      <input
        type="checkbox"
        checked={
          TRS.t_received_flag === "TRUE" || selectedRowIds.includes(TRS.ID_NO)
        }
        onChange={() => handleCheckboxChange(TRS.ID_NO)}
        disabled={TRS.t_received_flag === "TRUE"}
        style={{
          cursor: TRS.t_received_flag === "TRUE" && "not-allowed",
          opacity: TRS.t_received_flag === "TRUE" ? 0.6 : 1,
          backgroundColor: TRS.t_received_flag === "TRUE" && "gray",
          color: TRS.t_received_flag === "TRUE" && "gray",
        }}
      />
    ),
    fscode: TRS.FROM_STORE_CODE,
    fsname: TRS.FROM_STORE_NAME,
    modelno: TRS.MODELNO,
    itemName : TRS.ITEM_NAME,
    brand: TRS.BRAND,
    requan: TRS.SUPPLY_QTY,
    apquan: TRS.approved_qty,
    cquan: TRS.t_couriered_qty,
    recquan: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextInput
          type="number"
          // value={TRS.t_received_qty}
          value={
            ReceivedDetails.find((detail) => detail.id === TRS.ID_NO)
              ?.receivedQuantity || TRS.t_received_qty
          }
          onChange={(e) =>
            handleReceivedQuantityChange(
              TRS.ID_NO,
              e.target.value,
              TRS.t_couriered_qty
            )
          }
          disabled={TRS.t_received_flag === "TRUE"}
          min={1}
        />
      </div>
    ),
    recdate: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextInput
          type="date"
          // value={TRS.d_received_date}
          value={
            ReceivedDetails.find((detail) => detail.id === TRS.ID_NO)
              ?.receivedDate || formatDate(TRS.d_received_date)
          }
          disabled={TRS.t_received_flag === "TRUE"}
          max={today}
          onChange={(e) => handleReceivedDateChange(TRS.ID_NO, e.target.value)}
        />
      </div>
    ),
  }));

  const columns = [
    {
      name: "From Store Code",
      selector: (row) => row.fscode,
      sortable: true,
      wrap: true,
    },
    {
      name: "From Store Name",
      selector: (row) => row.fsname,
      sortable: true,
      wrap: true,
    },
   
    {
      name: "Brand",
      wrap: true,
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Model Number",
      selector: (row) => row.modelno,
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
      name: "Recommended Quantity",
      selector: (row) => row.requan,
      wrap: true,
      sortable: true,
    },
    {
      name: "Approved Quantity",
      selector: (row) => row.apquan,
      wrap: true,
      sortable: true,
    },
    {
      name: "Couriered  Quantity",
      selector: (row) => row.cquan,
      wrap: true,
      sortable: true,
    },
    {
      name: "Received  Quantity",
      selector: (row) => row.recquan,
      wrap: true,
      sortable: true,
    },
    {
      name: "Received Status",
      selector: (row) => row.show,
      wrap: true,
    },
    {
      name: "Received  Date",
      selector: (row) => row.recdate,
      wrap: true,
      sortable: true,
      grow: 2,
    },
  ];

  const handleCheckboxChange = (id) => {
    setSelectedRowIds((prevSelectedRowIds) =>
      prevSelectedRowIds.includes(id)
        ? prevSelectedRowIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedRowIds, id]
    );
  };

  const handleSearch = () => {
    const filteredData = TransferRecieveSummary.filter((item) => {
      return (
        (FromStoreCode ? item.FROM_STORE_CODE === FromStoreCode : true) &&
        (modelNumber ? item.MODELNO === modelNumber : true) &&
        (brand ? item.BRAND === brand : true) && (itemName ? item.ITEM_NAME == itemName : true)
      );
    });
    setTransferRecieveSummary(filteredData);
  };

  const handleReceivedQuantityChange = (id, value, courieredqty) => {
    if (courieredqty >= value && value > 0) {
      setReceivedDetails((prevDetails) => {
        const existingDetail = prevDetails.find((detail) => detail.id === id);
        if (existingDetail) {
          return prevDetails.map((detail) =>
            detail.id === id ? { ...detail, receivedQuantity: value } : detail
          );
        } else {
          return [
            ...prevDetails,
            { id, receivedQuantity: value, receivedDate: "" },
          ];
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "Received quantity must be less than or equal to couriered quantity ...",
        type: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleReceivedDateChange = (id, value) => {
    setReceivedDetails((prevDetails) => {
      const existingDetail = prevDetails.find((detail) => detail.id === id);
      if (existingDetail) {
        return prevDetails.map((detail) =>
          detail.id === id ? { ...detail, receivedDate: value } : detail
        );
      } else {
        return [
          ...prevDetails,
          { id, ReceivedQuantity: "", receivedDate: value },
        ];
      }
    });
  };

  const handleSaveReceivedQuantity = () => {
    const ReceivedDetailsdata = ReceivedDetails.filter((detail) =>
      selectedRowIds.includes(detail.id)
    );

    const hasEmptyValues = ReceivedDetailsdata.some(
      (detail) => detail.ReceivedQuantity === "" || detail.receivedDate === ""
    );

    if (hasEmptyValues) {
      Swal.fire({
        icon: "warning",
        text: "Please fill in all required fields before saving.",
        type: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      axios
        .put("/transferreceivesummary/", ReceivedDetailsdata)
        .then((res) => {
          if (res.data.success === 1) {
            Swal.fire({
              icon: "success",
              text: "Received Quantity Saved",
              type: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            fetchReceiveSummary();
          } else {
            Swal.fire({
              icon: "error",
              text: "Server Problem. Please Try Again...",
              type: "error",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto b mt-14">
        <div className="p-4 rounded-lg shadow bg-white">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li>
                <div class="flex items-center">
                  <a
                    href="#"
                    class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    Optimize Stock
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div class="flex items-center">
                  <svg
                    class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                    Transfer Receive Summary
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <br />

          <div className="flex gap-4">
            <div className="w-1/5">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="From Store Code " />
              </div>
              <Select
                id="toStoreCode"
                name="toStoreCode"
                value={
                  FromStoreCode
                    ? { value: FromStoreCode, label: FromStoreCode }
                    : ""
                }
                onChange={(selectedOption) => handleFieldChange(selectedOption, "toStoreCode")}
                /*  onChange={(selectedOption) => {
                  setFromStoreCode(selectedOption ? selectedOption.value : "");
                }} */
                options={
                  Array.isArray(FFromStoreCode)
                    ? FFromStoreCode.map((code) => ({
                        value: code,
                        label: code,
                      }))
                    : []
                }
                placeholder="From Store Code"
                isClearable={true}
              />
            </div>
            <div className="w-1/5">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="Brand" />
              </div>
              <Select
                id="toStoreCode"
                name="toStoreCode"
                value={brand ? { value: brand, label: brand } : ""}
                /* onChange={(selectedOption) => {
                  setBrand(selectedOption ? selectedOption.value : "");
                }} */
                  onChange={(selectedOption) => handleFieldChange(selectedOption, "brand")}

                options={
                  Array.isArray(FBrand)
                    ? FBrand.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="Brand"
                isClearable={true}
              />
            </div>

            <div className="w-1/5">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="Model Number " />
              </div>
              <Select
                id="toStoreCode"
                name="toStoreCode"
                value={
                  modelNumber ? { value: modelNumber, label: modelNumber } : ""
                }
                onChange={(selectedOption) => handleFieldChange(selectedOption, "modelNumber")}
                options={
                  Array.isArray(FModelNumber)
                    ? FModelNumber.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="Model Number"
                isClearable={true}
              />
            </div>
            <div className="w-1/5">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="Item Name " />
              </div>
              <Select
                id="itemName"
                name="itemName"
                value={
                  itemName ? { value: itemName, label: itemName } : ""
                }
                onChange={(selectedOption) => handleFieldChange(selectedOption, "itemName")}
                options={
                  Array.isArray(FItemName)
                    ? FItemName.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="Item Name"
                isClearable={true}
              />
            </div>

            <div className="w-1/5 flex items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500  rounded text-dark"
                style={{ backgroundColor: "#A4DDED" }}
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            <div className="w-1/5 flex items-end">
              <Button
                style={{ backgroundColor: "#A4DDED" }}
                className="text-dark"
                onClick={handleSaveReceivedQuantity}
              >
                Save Received Quantity
              </Button>
            </div>
          </div>
          <br />

          <DataTable
            title="Transfer Receive Summary"
            columns={columns}
            data={data}
            pagination
            subHeader
            persistTableHead
            striped
            highlightOnHover
            // selectableRows
          />
        </div>
      </div>
    </div>
  );
}

export default TransferRecieveSummary;
