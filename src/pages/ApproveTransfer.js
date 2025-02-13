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
import { sort } from "d3";

function ApproveTransfer() {
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [ApproveTransfer, setApproveTransfer] = useState({});
  const [storeBrandModel, setStoreBrandModel] = useState({});
  const [approvedQuantities, setApprovedQuantities] = useState({});
  const [Ffstorecode, setFfstorecode] = useState({});
  const [Ftstorecode, setFtstorecode] = useState({});
  const [Fmodelnumber, setFmodelnumber] = useState({});
  const [FitemName, setFItemName] = useState({});
  const [Fbrand, setFbrand] = useState({});
  const [editedQuantities, setEditedQuantities] = useState({});
  const [fromStoreCode, setFromStoreCode] = useState("");
  const [toStoreCode, setToStoreCode] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [transferType, setTransferType] = useState("");
  const [loading, setLoading] = useState(false);

  const transferTypeOptions = [
    { value: "All", label: "All" },
    { value: "S", label: "Single" },
    { value: "M", label: "Multiple" },
  ];

  const getTransferTypeLabel = (value) => {
    const selectedOption = transferTypeOptions.find(
      (option) => option.value === value
    );
    return selectedOption
      ? { value: selectedOption.value, label: selectedOption.label }
      : "";
  };
  const state = localStorage.getItem("selectedState");
  const [atFlag, setATFlag] = useState();
  const [sbFlag, setSBFlag] = useState();
  useEffect(() => {
    if (!atFlag) fetchApproveTransfer();
    if (!sbFlag) fetchStoreBrandModel();
  }, [atFlag, sbFlag]);

  const columns = [
    {
      name: <div>Approve</div>,
      selector: (row) => row.show,
      grow: 0,
      sortable: true,

      wrap: true,
    },
    {
      name: <div>From Store code</div>,
      selector: (row) => row.fscode,
      sortable: true,
      wrap: true,
    },
    {
      name: <div>From Store Name</div>,
      selector: (row) => row.fsname,
      sortable: true,
      wrap: true,
    },
    {
      name: <div>To Store Code</div>,
      selector: (row) => row.tscode,
      sortable: true,
      wrap: true,
    },
    {
      name: <div>To Store Name</div>,
      selector: (row) => row.tsname,
      sortable: true,
      wrap: true,
    },
    {
      name: <div>Brand</div>,
      selector: (row) => row.brand,
      sortable: true,
      wrap: true,
    },
    {
      name: <div>Model Number</div>,
      selector: (row) => row.modelno,
      sortable: true,
      wrap: true,
    },
    {
      name: <div>Item</div>,
      selector: (row) => row.itemname,
      sortable: true,
      wrap: true,
    },

    {
      name: <div>Transfer Quantity</div>,
      selector: (row) => row.tfquan,
      sortable: true,
    },
    {
      name: <div>Approved Quantity</div>,
      selector: (row) => row.apquan,
      cell: (row) => (row.apquan < 0 ? 0 : row.apquan),
      sortable: true,
      wrap: true,
    },
  ];
  const fetchStoreBrandModel = async () => {
    const resp = await axios.get(
      `/getfromstoretostorebrandmodel?state=${state}`
    );
    const storeBrandModelData = resp.data;
    setStoreBrandModel(storeBrandModelData);
    const uniquefromStoreCodes = Array.from(
      new Set(storeBrandModelData.map((item) => item.FROM_STORE_CODE))
    );
    setFfstorecode(uniquefromStoreCodes);

    const uniqueToStoreCodes = Array.from(
      new Set(storeBrandModelData.map((item) => item.TO_STORE_CODE))
    );
    setFtstorecode(uniqueToStoreCodes);

    const uniqueModelNumber = Array.from(
      new Set(storeBrandModelData.map((item) => item.MODELNO))
    );
    setFmodelnumber(uniqueModelNumber);

    const uniqueItemName = Array.from(
      new Set(storeBrandModelData.map((item) => item.ITEMNAME))
    );
    setFItemName(uniqueItemName);

    const uniqueBrandnumber = Array.from(
      new Set(storeBrandModelData.map((item) => item.BRAND))
    );
    setFbrand(uniqueBrandnumber);
    setSBFlag(true);
  };
  const fetchApproveTransfer = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/approvetransfer?state=${state}&fromstorecode=${fromStoreCode}&tostorecode=${toStoreCode}&modelnumber=${modelNumber}&itemname=${itemName}&brand=${brand}&transferType=${transferType}`
      );
      const ApproveTransferData = response.data;
      setApproveTransfer(ApproveTransferData);
      setATFlag(true);
    } catch (error) {
      // window.location.reload();
      console.error("Error fetching ApproveTransfer Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchfetchApproveTransfer = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/approvetransfer?state=${state}&fromstorecode=${fromStoreCode}&tostorecode=${toStoreCode}&modelnumber=${modelNumber}&itemname=${itemName}&brand=${brand}&transferType=${transferType}`
      );
      const ApproveTransferData = response.data;
      setApproveTransfer(ApproveTransferData);
      console.log(ApproveTransferData);
    } catch (error) {
      // window.location.reload();
      console.error("Error fetching ApproveTransfer Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedRowIds((prevSelectedRowIds) =>
      prevSelectedRowIds.includes(id)
        ? prevSelectedRowIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedRowIds, id]
    );
    console.log(selectedRowIds);
  };

  // const handleApquanChange = (id, value) => {
  //   const numericValue = Number(value);

  //   setApproveTransfer(prevState =>
  //     prevState.map(item => {
  //       if (item.ID === id) {
  //         if (numericValue <= item.TRANSFER_QUANTITY) {
  //           return { ...item, APPROVED_QUANTITY: numericValue };
  //         } else {
  //           // alert('Approved quantity must be less than or equal to transfer quantity.');
  //           Swal.fire({
  //             icon: "error",
  //             text: "Approved quantity must be less than or equal to transfer quantity...",
  //             type: "error",
  //             timer: 2000,
  //             showConfirmButton: false,
  //           });
  //           return item;
  //         }
  //       }
  //       return item;
  //     })
  //   );
  //   console.log(ApproveTransfer);
  // };

  const handleApquanChange = (id, value, transferquantity) => {
    if (value >= 0 && value <= transferquantity) {
      setEditedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: value,
      }));
    } else {
      Swal.fire({
        icon: "error",
        text: "Approved quantity must be less than or equal to transfer quantity and not less than 0...",
        type: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleSaveApprovedQuantity = () => {
    // const selectedData = ApproveTransfer.filter((AT) => selectedRowIds.includes(AT.ID))
    //   .map((AT) => ({ [AT.ID]: parseInt(AT.APPROVED_QUANTITY, 10) }))
    //   .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    // const selectedData = Object.fromEntries(
    //   Object.entries(editedQuantities).filter(([id]) =>
    //     selectedRowIds.includes(parseInt(id))
    //   )
    // );

    // console.log(selectedData);

    const missingQuantities = selectedRowIds.filter(
      (id) => !editedQuantities[id]
    );

    const missingQuantitiesData = ApproveTransfer.filter((AT) =>
      missingQuantities.includes(AT.ID)
    ).reduce((acc, AT) => {
      acc[AT.ID] = parseInt(AT.APPROVED_QUANTITY, 10);
      return acc;
    }, {});

    const onchangevalues = Object.fromEntries(
      Object.entries(editedQuantities).filter(([id]) =>
        selectedRowIds.includes(parseInt(id))
      )
    );

    const selectedData = {
      ...onchangevalues,
      ...missingQuantitiesData,
    };

    // console.log(selectedData);

    axios
      .put("/approvetransfer/", selectedData)
      .then((res) => {
        if (res.data.success === 1) {
          Swal.fire({
            icon: "success",
            text: "Approved Quantity Saved",
            type: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchApproveTransfer();
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
        // window.location.reload();
        console.error("Error:", error);
      });
  };

  const handleSearch = () => {
    searchfetchApproveTransfer();
  };

  const sortedApproveTransfer = Array.isArray(ApproveTransfer)
    ? ApproveTransfer
    : [];

  const data = sortedApproveTransfer.map((AT) => ({
    show: (
      <input
        type="checkbox"
        checked={AT.Approval_flag === "TRUE" || selectedRowIds.includes(AT.ID)}
        onChange={() => handleCheckboxChange(AT.ID)}
        disabled={AT.Approval_flag === "TRUE"}
        style={{
          cursor: AT.Approval_flag === "TRUE" && "not-allowed",
          opacity: AT.Approval_flag === "TRUE" ? 0.6 : 1,
          backgroundColor: AT.Approval_flag === "TRUE" && "gray",
          color: AT.Approval_flag === "TRUE" && "gray",
        }}
      />
    ),
    fscode: AT.FROM_STORE_CODE,
    fsname: AT.FROM_STORE_NAME,
    tscode: AT.TO_STORE_CODE,
    tsname: AT.TO_STORE_NAME,
    modelno: AT.MODEL_NUMBER,
    itemname: AT.ITEM_NAME,
    brand: AT.BRAND,
    tfquan: AT.TRANSFER_QUANTITY,
    apquan: (
      // <div style={{ display: 'flex', alignItems: 'center' }}>
      //   <TextInput
      //     type="number"
      //     value={
      //       AT.APPROVED_QUANTITY
      //     }
      //     disabled={AT.Approval_flag === "TRUE"}
      //     // max={AT.TRANSFER_QUANTITY}
      //     onChange={(e) => handleApquanChange(AT.ID, e.target.value)}
      //   />
      // </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextInput
          type="number"
          value={
            editedQuantities[AT.ID] !== undefined
              ? editedQuantities[AT.ID]
              : AT.APPROVED_QUANTITY
          }
          min={0}
          disabled={AT.Approval_flag === "TRUE"}
          onChange={(e) =>
            handleApquanChange(AT.ID, e.target.value, AT.TRANSFER_QUANTITY)
          }
        />
      </div>
    ),
    trans_type: AT.TRANSPORT_TYPE,
  }));

  const handleFilterChange = (selectedOption, type) => {
    let selectedValue = selectedOption ? selectedOption.value : "";

    // Update the corresponding state based on the type
    switch (type) {
      case "from":
        setFromStoreCode(selectedValue);
        break;
      case "to":
        setToStoreCode(selectedValue);
        break;
      case "brand":
        setBrand(selectedValue);
        break;
      case "model":
        setModelNumber(selectedValue);
        break;
      case "item":
        setItemName(selectedValue);
        break;
      default:
        break;
    }

    // Get current selected values
    const currentFromStoreCode =
      type === "from" ? selectedValue : fromStoreCode;
    const currentToStoreCode = type === "to" ? selectedValue : toStoreCode;
    const currentBrand = type === "brand" ? selectedValue : brand;
    const currentModelNumber = type === "model" ? selectedValue : modelNumber;
    const currentItemName = type === "item" ? selectedValue : itemName;

    // Filter the options based on current selected values
    const filteredOptions = storeBrandModel.filter((item) => {
      return (
        (!currentFromStoreCode ||
          item.FROM_STORE_CODE === currentFromStoreCode) &&
        (!currentToStoreCode || item.TO_STORE_CODE === currentToStoreCode) &&
        (!currentBrand || item.BRAND === currentBrand) &&
        (!currentModelNumber || item.MODELNO === currentModelNumber) &&
        (!currentItemName || item.ITEMNAME === currentItemName)
      );
    });

    // Update the options for the other fields based on filtered results
    setFbrand(Array.from(new Set(filteredOptions.map((item) => item.BRAND))));
    setFmodelnumber(
      Array.from(new Set(filteredOptions.map((item) => item.MODELNO)))
    );
    setFItemName(
      Array.from(new Set(filteredOptions.map((item) => item.ITEMNAME)))
    );
    setFfstorecode(
      Array.from(new Set(filteredOptions.map((item) => item.FROM_STORE_CODE)))
    );
    setFtstorecode(
      Array.from(new Set(filteredOptions.map((item) => item.TO_STORE_CODE)))
    );

    // If only one option remains after filtering, automatically set it for related fields
    if (filteredOptions.length === 1) {
      const item = filteredOptions[0];
      if (type !== "from") setFromStoreCode(item.FROM_STORE_CODE);
      if (type !== "to") setToStoreCode(item.TO_STORE_CODE);
      if (type !== "brand") setBrand(item.BRAND);
      if (type !== "model") setModelNumber(item.MODELNO);
      if (type !== "item") setItemName(item.ITEMNAME);
    }
  };

  /*const handleBrandChange = (selectedOption) => {
    const selectedBrand = selectedOption ? selectedOption.value : "";
    setBrand(selectedBrand);
  
    const currentFromStoreCode = fromStoreCode;
    const currentToStoreCode = toStoreCode;
  
    if (selectedBrand) {
      let filteredModelNumbers;
      let filteredItemName;
  
      if (currentFromStoreCode && currentToStoreCode) {
        // Both "from" and "to" store codes are selected
        filteredModelNumbers = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.FROM_STORE_CODE === currentFromStoreCode &&
              item.TO_STORE_CODE === currentToStoreCode
          )
          .map((item) => item.MODELNO);
  
        filteredItemName = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.FROM_STORE_CODE === currentFromStoreCode &&
              item.TO_STORE_CODE === currentToStoreCode
          )
          .map((item) => item.ITEMNAME);
  
      } else if (currentFromStoreCode) {
        // Only "fromStoreCode" is selected
        filteredModelNumbers = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.FROM_STORE_CODE === currentFromStoreCode
          )
          .map((item) => item.MODELNO);
  
        filteredItemName = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.FROM_STORE_CODE === currentFromStoreCode
          )
          .map((item) => item.ITEMNAME);
  
      } else if (currentToStoreCode) {
        // Only "toStoreCode" is selected
        filteredModelNumbers = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.TO_STORE_CODE === currentToStoreCode
          )
          .map((item) => item.MODELNO);
  
        filteredItemName = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.TO_STORE_CODE === currentToStoreCode
          )
          .map((item) => item.ITEMNAME);
  
      } else {
        // Neither store code is selected, just filter by brand
        filteredModelNumbers = storeBrandModel
          .filter((item) => item.BRAND === selectedBrand)
          .map((item) => item.MODELNO);
  
        filteredItemName = storeBrandModel
          .filter((item) => item.BRAND === selectedBrand)
          .map((item) => item.ITEMNAME);
      }
  
      const uniqueModelNumbers = Array.from(new Set(filteredModelNumbers));
      setFmodelnumber(uniqueModelNumbers);
  
      const uniqueItemName = Array.from(new Set(filteredItemName));
      setFItemName(uniqueItemName);
  
    } else {
      // If no brand is selected
      const allModelNumbers = Array.from(
        new Set(storeBrandModel.map((item) => item.MODELNO))
      );
      setFmodelnumber(allModelNumbers);
      console.log(modelNumber);
      if (modelNumber) {
        // If modelNumber is selected, filter item names accordingly
        const filteredItemName = storeBrandModel
          .filter((item) => item.MODELNO === modelNumber)
          .map((item) => item.ITEMNAME);
  
        const uniqueItemName = Array.from(new Set(filteredItemName));
        setFItemName(uniqueItemName);
        console.log(uniqueItemName);
      } else {
        // If no model is selected, show all item names
        const allItemName = Array.from(
          new Set(storeBrandModel.map((item) => item.ITEMNAME))
        );
        setFItemName(allItemName);
      }
    }
  }; */

  /*const handleBrandChange = (selectedOption) => {
    const selectedBrand = selectedOption ? selectedOption.value : "";
    setBrand(selectedBrand);

    const currentFromStoreCode = fromStoreCode;
    const currentToStoreCode = toStoreCode;

    if (selectedBrand) {
      let filteredModelNumbers;

      if (currentFromStoreCode && currentToStoreCode) {
        // Both "from" and "to" store codes are selected
        filteredModelNumbers = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.FROM_STORE_CODE === currentFromStoreCode &&
              item.TO_STORE_CODE === currentToStoreCode
          )
          .map((item) => item.MODELNO);

          filteredItemname = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.FROM_STORE_CODE === currentFromStoreCode &&
              item.TO_STORE_CODE === currentToStoreCode
          )
          .map((item) => item.ITEMNAME);

      } else if (currentFromStoreCode) {
        // Only "fromStoreCode" is selected
        filteredModelNumbers = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.FROM_STORE_CODE === currentFromStoreCode
          )
          .map((item) => item.MODELNO);

          filteredItemname = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
            
              item.TO_STORE_CODE === currentToStoreCode
          )
          .map((item) => item.ITEMNAME);


      } else if (currentToStoreCode) {
        // Only "toStoreCode" is selected
        filteredModelNumbers = storeBrandModel
          .filter(
            (item) =>
              item.BRAND === selectedBrand &&
              item.TO_STORE_CODE === currentToStoreCode
          )
          .map((item) => item.MODELNO);
      } else {
        // Neither store code is selected, just filter by brand
        filteredModelNumbers = storeBrandModel
          .filter((item) => item.BRAND === selectedBrand)
          .map((item) => item.MODELNO);
      const uniqueModelNumbers = Array.from(new Set(filteredModelNumbers));
      setFmodelnumber(uniqueModelNumbers);

        filteredItemname = storeBrandModel
          .filter((item) => item.BRAND === selectedBrand)
          .map((item) => item.ITEMNAME);
      }
      const uniqueItemName = Array.from(new Set(filteredItemname));
      setFItemName(uniqueItemName);

      
    } else {
      // If no brand is selected, reset to all model numbers
      const allModelNumbers = Array.from(
        new Set(storeBrandModel.map((item) => item.MODELNO))
      );
      setFmodelnumber(allModelNumbers);

      const allItemName = Array.from(
        new Set(storeBrandModel.map((item) => item.ITEMNAME))
      );
      setFItemName(allItemName);
    }
  }; */

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
                    Approve Transfer
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <br />

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
                  fromStoreCode
                    ? { value: fromStoreCode, label: fromStoreCode }
                    : ""
                }
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "from")
                }
                options={
                  Array.isArray(Ffstorecode)
                    ? Ffstorecode.map((code) => ({ value: code, label: code }))
                    : []
                }
                isClearable={true}
                placeholder="Select an option"
              />
            </div>

            <div className="w-1/6">
              <div className="mb-2 block">
                <label htmlFor="toStoreCode" className="form-label">
                  To Store Code
                </label>
              </div>
              <Select
                id="toStoreCode"
                name="toStoreCode"
                value={
                  toStoreCode ? { value: toStoreCode, label: toStoreCode } : ""
                }
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "to")
                }
                options={
                  Array.isArray(Ftstorecode)
                    ? Ftstorecode.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="Select an option"
                isClearable={true}
              />
            </div>

            <div className="w-1/6">
              <div className="mb-2 block">
                <label htmlFor="brand" className="form-label">
                  Brand
                </label>
              </div>
              <Select
                id="brand"
                name="brand"
                value={brand ? { value: brand, label: brand } : ""}
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "brand")
                }
                options={
                  Array.isArray(Fbrand)
                    ? Fbrand.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="Select an option"
                isClearable={true}
              />
            </div>

            <div className="w-1/6">
              <div className="mb-2 block">
                <label htmlFor="modelNumber" className="form-label">
                  Model Number
                </label>
              </div>
              <Select
                id="modelNumber"
                name="modelNumber"
                value={
                  modelNumber ? { value: modelNumber, label: modelNumber } : ""
                }
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "model")
                }
                options={
                  Array.isArray(Fmodelnumber)
                    ? Fmodelnumber.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="Select an option"
                isClearable={true}
              />
            </div>

            <div className="w-1/6">
              <div className="mb-2 block">
                <label htmlFor="itemName" className="form-label">
                  Item
                </label>
              </div>
              <Select
                id="itemName"
                name="itemName"
                value={itemName ? { value: itemName, label: itemName } : ""}
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "item")
                }
                options={
                  Array.isArray(FitemName)
                    ? FitemName.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="Select an option"
                isClearable={true}
              />
            </div>

            <div className="w-1/6">
              <div className="mb-2 block">
                <label htmlFor="transferType" className="form-label">
                  Transfer Type
                </label>
              </div>
              <Select
                id="transferType"
                name="transferType"
                onChange={(selectedOption) => {
                  setTransferType(selectedOption ? selectedOption.value : "");
                }}
                value={getTransferTypeLabel(transferType)} // Set the label based on the value
                options={transferTypeOptions}
                placeholder="Select an option"
                isClearable={true}
              />
            </div>

            <div className="w-1/6">
              <div className="mt-6 block">
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
          <br />
          <div>
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
              <>
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-lg ">
                    Approve Transfer - {localStorage.getItem("selectedState")}
                  </h1>
                  <Button
                    style={{ backgroundColor: "#A4DDED" }}
                    className="text-dark"
                    onClick={handleSaveApprovedQuantity}
                  >
                    Save Approved Quantity
                  </Button>
                </div>
                <DataTable
                  columns={columns}
                  data={data}
                  pagination
                  subHeader
                  // defaultSortFieldId={}
                  defaultSortAsc
                  persistTableHead
                  striped
                  highlightOnHover
                  // selectableRows
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApproveTransfer;
