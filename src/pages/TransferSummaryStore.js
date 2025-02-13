import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import { Button, TextInput, Label } from "flowbite-react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import "../style/datatablestyle.css";
import "flowbite/dist/flowbite.css";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

function TransferSummaryStore() {
  const [TransferSummary, setTransferSummary] = useState({});
  const [FToStoreCode, setFToStoreCode] = useState();
  const [FModelNumber, setFModelNumber] = useState();
  const [FItemName, setFItemName] = useState();
  const [FBrand, setFBrand] = useState();
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [courierDetails, setCourierDetails] = useState([]);
  const [toStoreCode, setToStoreCode] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const user = sessionStorage.getItem("user");

  useEffect(() => {
    fetchTransferSummary();
  }, []);

  const fetchTransferSummary = async () => {
    try {
      const response = await axios.get(
        `transfersummary/${user}?tostorecode=${toStoreCode}&modelnumber=${modelNumber}&brand=${brand}&item_name=${itemName}`
      );
      const TransferSummaryData = response.data;
      setTransferSummary(TransferSummaryData);

      const uniqueToStoreCodes = Array.from(
        new Set(TransferSummaryData.map((item) => item.TO_STORE_CODE))
      );
      setFToStoreCode(uniqueToStoreCodes);

      const uniqueModelNumber = Array.from(
        new Set(TransferSummaryData.map((item) => item.MODELNO))
      );
      setFModelNumber(uniqueModelNumber);

      const uniqueBrand = Array.from(
        new Set(TransferSummaryData.map((item) => item.BRAND))
      );
      setFBrand(uniqueBrand);

      const uniqueItemName = Array.from(
        new Set(TransferSummaryData.map((item) => item.ITEM_NAME))
      );
     setFItemName(uniqueItemName);

    } catch (error) {
      console.error("Error fetching TransferSummary Data:", error);
    }
  };

  const SearchfetchTransferSummary = async () => {
    try {
      const response = await axios.get(
        `transfersummary/${user}?tostorecode=${toStoreCode}&modelnumber=${modelNumber}&brand=${brand}&item_name=${itemName}`
      );
      const TransferSummaryData = response.data;
      setTransferSummary(TransferSummaryData);
    } catch (error) {
      console.error("Error fetching TransferSummary Data:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // ISO format 'yyyy-MM-dd'
  };
  const today = formatDate(new Date());

  const handleCourierQuantityChange = (id, value, approved_qty) => {
    if (approved_qty >= value && value > 0) {
      setCourierDetails((prevDetails) => {
        const existingDetail = prevDetails.find((detail) => detail.id === id);
        if (existingDetail) {
          return prevDetails.map((detail) =>
            detail.id === id ? { ...detail, courieredQuantity: value } : detail
          );
        } else {
          return [
            ...prevDetails,
            { id, courieredQuantity: value, courieredDate: "" },
          ];
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "Couriered quantity must be less than or equal to approved quantity ...",
        type: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleCourierDateChange = (id, value) => {
    setCourierDetails((prevDetails) => {
      const existingDetail = prevDetails.find((detail) => detail.id === id);
      if (existingDetail) {
        return prevDetails.map((detail) =>
          detail.id === id ? { ...detail, courieredDate: value } : detail
        );
      } else {
        return [
          ...prevDetails,
          { id, courieredQuantity: "", courieredDate: value },
        ];
      }
    });
  };
  const handleFieldChange = (selectedOption, type) => {
    let selectedValue = selectedOption ? selectedOption.value : "";
  
    // Update the corresponding state based on the type
    switch (type) {
      case "toStoreCode":
        setToStoreCode(selectedValue);
        break;
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
        fetchTransferSummary();
        break;
    }
  
    // Get current selected values
    const currentToStoreCode = type === "toStoreCode" ? selectedValue : toStoreCode;
    const currentBrand = type === "brand" ? selectedValue : brand;
    const currentModelNumber = type === "modelNumber" ? selectedValue : modelNumber;
    const currentItemName = type === "itemName" ? selectedValue : itemName;
  
    // Filter the options based on current selected values
    const filteredOptions = TransferSummary.filter((item) => {
      return (
        (!currentToStoreCode || item.TO_STORE_CODE === currentToStoreCode) &&
        (!currentBrand || item.BRAND === currentBrand) &&
        (!currentModelNumber || item.MODELNO === currentModelNumber) &&
        (!currentItemName || item.ITEM_NAME === currentItemName)
      );
    });
  
    // Filtered options arrays
    const filteredBrands = Array.from(new Set(filteredOptions.map((item) => item.BRAND)));
    const filteredModelNumbers = Array.from(new Set(filteredOptions.map((item) => item.MODELNO)));
    const filteredItemNames = Array.from(new Set(filteredOptions.map((item) => item.ITEM_NAME)));
    const filteredToStoreCodes = Array.from(new Set(filteredOptions.map((item) => item.TO_STORE_CODE)));
  
    // Update state with filtered options
    setFBrand(filteredBrands);
    setFModelNumber(filteredModelNumbers);
    setFItemName(filteredItemNames);
    setFToStoreCode(filteredToStoreCodes);
  /*
    // Automatically select the only available option if only one option is left after filtering
    if (filteredBrands.length === 1 && !currentBrand) setBrand(filteredBrands[0]);
    if (filteredModelNumbers.length === 1 && !currentModelNumber) setModelNumber(filteredModelNumbers[0]);
    if (filteredItemNames.length === 1 && !currentItemName) setItemName(filteredItemNames[0]);
    if (filteredToStoreCodes.length === 1 && !currentToStoreCode) setToStoreCode(filteredToStoreCodes[0]);
    */
  };
  const handleCheckboxChange = (id) => {
    setSelectedRowIds((prevSelectedRowIds) =>
      prevSelectedRowIds.includes(id)
        ? prevSelectedRowIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedRowIds, id]
    );
    // console.log(selectedRowIds);
  };

  const handleSaveApprovedQuantity = () => {
    const CourierDetails = courierDetails.filter((detail) =>
      selectedRowIds.includes(detail.id)
    );

    const hasEmptyValues = CourierDetails.some(
      (detail) => detail.courieredQuantity === "" || detail.courieredDate === ""
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
        .put("/transfersummary/", CourierDetails)
        .then((res) => {
          if (res.data.success === 1) {
            Swal.fire({
              icon: "success",
              text: "Courier Quantity Saved",
              type: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            fetchTransferSummary();
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

  const handleSearch = () => {
    SearchfetchTransferSummary();
  };

  const sortedTransferSummary = Array.isArray(TransferSummary)
    ? TransferSummary.sort((a, b) => (a.t_couriered_flag === "TRUE" ? -1 : 1))
    : [];

  const data = sortedTransferSummary.map((TS) => ({
    show: (
      <input
        type="checkbox"
        checked={
          TS.t_couriered_flag === "TRUE" || selectedRowIds.includes(TS.ID_NO)
        }
        onChange={() => handleCheckboxChange(TS.ID_NO)}
        disabled={TS.t_couriered_flag === "TRUE"}
        style={{
          cursor: TS.t_couriered_flag === "TRUE" && "not-allowed",
          opacity: TS.t_couriered_flag === "TRUE" ? 0.6 : 1,
          backgroundColor: TS.t_couriered_flag === "TRUE" && "gray",
          color: TS.t_couriered_flag === "TRUE" && "gray",
        }}
      />
    ),
    tscode: TS.TO_STORE_CODE,
    tsname: TS.TO_STORE_NAME,
    modelno: TS.MODELNO,
    brand: TS.BRAND,
    itemName: TS.ITEM_NAME,
    requan: TS.SUPPLY_QTY,
    apquan: TS.approved_qty,
    cquan: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextInput
          type="number"
          value={
            courierDetails.find((detail) => detail.id === TS.ID_NO)
              ?.courieredQuantity || TS.t_couriered_qty
          }
          onChange={(e) =>
            handleCourierQuantityChange(
              TS.ID_NO,
              e.target.value,
              TS.approved_qty
            )
          }
          disabled={TS.t_couriered_flag === "TRUE"}
          min={1}
        />
      </div>
    ),
    cdate: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextInput
          type="date"
          value={
            courierDetails.find((detail) => detail.id === TS.ID_NO)
              ?.courieredDate || formatDate(TS.d_couriered_date) 
          }
          max={today}
          disabled={TS.t_couriered_flag === "TRUE"}
          onChange={(e) => handleCourierDateChange(TS.ID_NO, e.target.value)}
        />
      </div>
    ),
  }));

  const columns = [
    {
      name: "To Store Code",
      selector: (row) => row.tscode,
      sortable: true,
      wrap: true,
    },
    {
      name: "To Store Name",
      selector: (row) => row.tsname,
      sortable: true,
      wrap: true,
    },
    
    {
      name: "Brand",
      selector: (row) => row.brand,
      sortable: true,
      wrap: true,
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
      sortable: true,
      wrap: true,
    },
    {
      name: "Approved Quantity",
      selector: (row) => row.apquan,
      sortable: true,
      wrap: true,
    },
    {
      name: "Couriered  Quantity",
      selector: (row) => row.cquan,
      sortable: true,
      wrap: true,
    },
    {
      name: "Couriered",
      selector: (row) => row.show,
      wrap: true,
    },
    {
      name: "Couriered  Date",
      selector: (row) => row.cdate,
      sortable: true,
      wrap: true,
      grow: 2,
    },
  ];

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
                    Transfer Summary
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <br />

          <br />
          <div className="flex gap-4">
            <div className="w-1/5">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="To Store Code " />
              </div>
              <Select
                id="toStoreCode"
                name="toStoreCode"
                value={
                  toStoreCode ? { value: toStoreCode, label: toStoreCode } : ""
                }
                onChange={(selectedOption) => handleFieldChange(selectedOption, "toStoreCode")}
                /*  onChange={(selectedOption) => {
                  setToStoreCode(selectedOption ? selectedOption.value : "");
                }}*/
                options={
                  Array.isArray(FToStoreCode)
                    ? FToStoreCode.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="To Store Code"
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
                onClick={handleSaveApprovedQuantity}
              >
                Save Couriered Quantity
              </Button>
            </div>
          </div>
          <br />

          <DataTable
            title="Transfer Summary"
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

export default TransferSummaryStore;
