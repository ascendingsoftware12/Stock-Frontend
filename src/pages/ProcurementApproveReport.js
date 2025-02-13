import React, { useState, useMemo, useEffect } from "react";

import DataTable, { SortOrder } from "react-data-table-component";
import { Button, Label, TextInput, Table } from "flowbite-react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import "../style/datatablestyle.css";
import "flowbite/dist/flowbite.css";
import { FaFileExcel } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import * as XLSX from "xlsx";

function ProcurementApproveReport() {
  const [loading, setLoading] = useState(false);
  const [Procurement, setProcurement] = useState({});
  const [Ftstorecode, setFtstorecode] = useState({});
  const [Fmodelnumber, setFmodelnumber] = useState({});
  const [Fbrand, setFbrand] = useState({});
  const [ToStoreCode, setToStoreCode] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [storeBrandModel, setStoreBrandModel] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [Projectiondays, setProjectiondays] = useState(28);
  const [excelLoader, setExcelLoader] = useState(false);
  const [Affordablequantity, setAffordablequantity] = useState(0);
  const state = localStorage.getItem("selectedState");
  const [FitemName, setFItemName] = useState({});
  const [itemName, setItemName] = useState("");
  const [pFlag, setPFlag] = useState(false);
  const [sFlag, setSFlag] = useState(false);

  useEffect(() => {
    if (!pFlag) {
      fetchProcurment();
    }
    if (!sFlag) {
      fetchStoreBrandModel();
    }
  }, [pFlag, sFlag]);

  const fetchStoreBrandModel = async () => {
    const resp = await axios.get(
      `/getfromstoretostorebrandmodel?state=${state}`
    );
    const storeBrandModelData = resp.data;
    setStoreBrandModel(storeBrandModelData);

    const uniqueToStoreCodes = Array.from(
      new Set(storeBrandModelData.map((item) => item.TO_STORE_CODE))
    );
    setFtstorecode(uniqueToStoreCodes);

    const uniqueModelNumber = Array.from(
      new Set(storeBrandModelData.map((item) => item.MODELNO))
    );
    setFmodelnumber(uniqueModelNumber);

    const uniqueBrandnumber = Array.from(
      new Set(storeBrandModelData.map((item) => item.BRAND))
    );
    setFbrand(uniqueBrandnumber);

    const uniqueItemName = Array.from(
      new Set(storeBrandModelData.map((item) => item.ITEMNAME))
    );
    setFItemName(uniqueItemName);
    setSFlag(true);
  };
  const fetchProcurment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `procurement/approved?state=${state}&to_store_code=${ToStoreCode}&model_number=${modelNumber}&itemname=${itemName}&brand=${brand}`
      );

      let ProcurementData = response.data;

      // If the array is not empty, move the last element to the beginning
      if (ProcurementData.length > 0) {
        const lastElement = ProcurementData.pop();
        ProcurementData = [lastElement, ...ProcurementData];
      }

      setProcurement(ProcurementData);
      setPFlag(true);
      // document.getElementById("pagination-first-page")
      //   ? console.log(
      //       document.getElementById("pagination-first-page").disabled
      //         ? document.getElementById("row-1").appendChild("setBold")
      //         : document.getElementById("row-1").removeChild("setBold")
      //     )
      //   : console.log("null");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const GeneratePo = async () => {
    try {
      const response = await axios.put("/procurement/generatepo");

      if (response.data.success == 1) {
        Swal.fire({
          icon: "success",
          text: "Po Generate Sucessfully ...",
          type: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "Server Problem. Please Try Again...",
          type: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      fetchProcurment();
    } catch (error) {
      console.error("Error fetching Stock summary Data:", error);
    }
  };

  const GetProjection = async () => {
    setLoading(true);
    try {
      // console.log(typeof parseInt(Affordablequantity));
      // console.log(typeof parseInt(Projectiondays));
      const response = await axios.get("/procurement/approved", {
        params: {
          to_store_code: ToStoreCode,
          model_number: modelNumber,
          item_name: itemName,
          brand: brand,
          affordablequantity: Affordablequantity,
          state: state,
          // projecteddays: Projectiondays,
        },
      });
      let ProcurementData = response.data;
      if (ProcurementData.length > 0) {
        const lastElement = ProcurementData.pop();
        ProcurementData = [lastElement, ...ProcurementData];
      }
      setProcurement(ProcurementData);
    } catch (error) {
      console.error("Error fetching Stock summary Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (item) => {
    setSelectedItems((prevState) => {
      if (prevState.find((selectedItem) => selectedItem.id === item.id)) {
        return prevState.filter((selectedItem) => selectedItem.id !== item.id);
      } else {
        return [...prevState, item];
      }
    });
  };

  const handleSaveClick = async () => {
    try {
      // console.log(Affordablequantity);
      const selectedValues = selectedItems.map((item) => ({
        stock_id: item.id,
        // yet_to_procure_default: parseFloat(item.yet_to_procure_default) || 0,
        yet_to_procure_projected:
          parseFloat(item.yet_to_procure_projected) || 0,

        affordable_quantity: Affordablequantity || 0,
      }));

      const response = await axios.post(
        "/procurement/savefinalpo",
        selectedValues
      );

      Swal.fire({
        icon: "success",
        text: "Procurment saved..",
        type: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchProcurment();
    } catch (error) {
      // Handle error response
      console.error("Error saving procurement:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `procurement/approved?state=${state}&to_store_code=${ToStoreCode}&model_number=${modelNumber}&itemname=${itemName}&brand=${brand}`
      );
      let ProcurementData = response.data;

      // If the array is not empty, move the last element to the beginning
      if (ProcurementData.length > 0) {
        const lastElement = ProcurementData.pop();
        ProcurementData = [lastElement, ...ProcurementData];
      }

      setProcurement(ProcurementData);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcel = async () => {
    document.getElementById("excelBtn").setAttribute("hidden", true);
    document.getElementById("LoaderBtn").removeAttribute("hidden");
    try {
      const response = await axios.get("/procurement/approvedexcel", {
        responseType: "blob",
      });

      // Check if the response is successful
      if (response.status === 200) {
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `REPORT_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
        document.body.appendChild(link);
        link.click();

        Swal.fire({
          icon: "success",
          text: "Excel export successful!",
          timer: 2000,
          showConfirmButton: false,
        });

        // Call the function to fetch procurement data again
        fetchProcurment();
      } else {
        Swal.fire({
          icon: "error",
          text: "Server problem. Please try again...",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error fetching stock summary data:", error);
      Swal.fire({
        icon: "error",
        text: "Error fetching data. Please try again...",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      document.getElementById("LoaderBtn").setAttribute("hidden", true);
      document.getElementById("excelBtn").removeAttribute("hidden");
    }
  };

  function convertArrayOfObjectsToExcel(array) {
    const worksheet = XLSX.utils.json_to_sheet(array);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  }

  function downloadExcel(array) {
    const filteredData = array.map(({ approve, ...rest }) => rest);

    const excelData = convertArrayOfObjectsToExcel(filteredData);
    const blob = new Blob([excelData], { type: "application/octet-stream" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "REPORT_PROCUREMENT_APPROVED.xlsx";
    link.click();
  }

  const data = Array.isArray(Procurement)
    ? Procurement.map((P, i) => ({
        approve:
          i > 0 ? (
            P.p_final_po_flag === "TRUE" ? (
              <input
                type="checkbox"
                checked={true}
                disabled={true}
                style={{
                  cursor: P.p_final_po_flag === "TRUE" && "not-allowed",
                  opacity: P.p_final_po_flag === "TRUE" ? 0.6 : 1,
                  backgroundColor: P.p_final_po_flag === "TRUE" && "gray",
                  color: P.p_final_po_flag === "TRUE" && "gray",
                }}
              />
            ) : (
              <input
                type="checkbox"
                checked={selectedItems.some((item) => item.id === P.id)}
                onChange={() => handleCheckboxChange(P)}
              />
            )
          ) : (
            <></>
          ),
        To_Store_Code: P.to_store_code,
        To_Store_Name: P.to_store_name,
        Model_Number: P.model_number,
        Item_Name: P.item_name,
        Brand: P.brand,
        Last_28_Days_Sold_Quantity: P.last_28_days_sold_qty,
        Current_Stock: P.current_stock,
        Demand_Quantity: P.demand_quantity,
        Transfer_Quantity: P.transfer_quantity,
        Yet_to_Procure_Default: P.yet_to_procure_default,
        Yet_to_Procure_Projected: P.yet_to_procure_projected,
        Projection_Days: P.projection_days,
        Actual_PO_Quantity: P.actual_po_quantity,
        Final_PO_Quantity: P.final_po_quantity,
        PO_Number: P.po_number,
        PO_Date: P.po_date,
      }))
    : [];

  const columns = [
    {
      name: <div>To Store Code</div>,
      selector: (row) => row.To_Store_Code,
      sortable: true,
      wrap: true,
    },
    {
      name: <div>To Store Name</div>,
      selector: (row) => row.To_Store_Name,
      sortable: true,
      wrap: true,
    },
    {
      name: <div>Brand</div>,
      selector: (row) => row.Brand,
      sortable: true,

      wrap: true,
    },
    {
      name: <div>Model Number</div>,
      selector: (row) => row.Model_Number,
      sortable: true,
      wrap: true,
    },
    {
      name: <div>Item</div>,
      selector: (row) => row.Item_Name,
      sortable: true,
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },

    {
      name: <div>Last 28 Days Sold Quantity</div>,
      selector: (row) => row.Last_28_Days_Sold_Quantity,
      sortable: true,
      wrap: true,
      width: "80px",
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>Current Stock</div>,
      selector: (row) => row.Current_Stock,
      width: "80px",
      sortable: true,
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>Demand Quantity</div>,
      selector: (row) => row.Demand_Quantity,
      sortable: true,
      width: "80px",
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>Transfer Quantity</div>,
      selector: (row) => row.Transfer_Quantity,
      sortable: true,
      width: "80px",
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>Yet to Procure Default</div>,
      selector: (row) => row.Yet_to_Procure_Default,
      sortable: true,
      width: "80px",
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>Yet to Procure Projected</div>,
      selector: (row) => row.Yet_to_Procure_Projected,
      sortable: true,
      width: "80px",
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>Approve</div>,
      selector: (row) => row.approve,
      sortable: true,
      width: "80px",
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>Projection Days</div>,
      selector: (row) => row.Projection_Days,
      wrap: true,
      width: "80px",
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>Actual PO Quantity</div>,
      selector: (row) => row.Actual_PO_Quantity,
      wrap: true,
      width: "80px",
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>Final PO Quantity</div>,
      selector: (row) => row.Final_PO_Quantity,
      sortable: true,
      width: "80px",
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>PO Number</div>,
      selector: (row) => row.PO_Number,
      sortable: true,
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
    {
      name: <div>PO Date</div>,
      selector: (row) => row.PO_Date,
      sortable: true,
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.Item_Name === "Total",
          classNames: ["setBold"],
        },
      ],
    },
  ];

  const handleFilterChange = (selectedOption, type) => {
    let selectedValue = selectedOption ? selectedOption.value : "";

    // Update the corresponding state based on the type
    switch (type) {
      case "to":
        setToStoreCode(selectedValue);
        break;
      case "brand":
        setBrand(selectedValue);
        break;
      case "model":
        setModelNumber(selectedValue);
        break;
      case "itemName":
        setItemName(selectedValue);
        break;
      default:
        break;
    }

    // Get current selected values
    const currentToStoreCode = type === "to" ? selectedValue : ToStoreCode;
    const currentBrand = type === "brand" ? selectedValue : brand;
    const currentModelNumber = type === "model" ? selectedValue : modelNumber;
    const currentItemName = type === "itemName" ? selectedValue : itemName;

    // Filter the options based on current selected values
    const filteredOptions = storeBrandModel.filter((item) => {
      return (
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
    setFtstorecode(
      Array.from(new Set(filteredOptions.map((item) => item.TO_STORE_CODE)))
    );

    /* If only one option remains after filtering, automatically set it for related fields
    if (filteredOptions.length === 1) {
      const item = filteredOptions[0];
      if (type !== "to") setToStoreCode(item.TO_STORE_CODE);
      if (type !== "brand") setBrand(item.BRAND);
      if (type !== "model") setModelNumber(item.MODELNO);
      if (type !== "itemName") setItemName(item.ITEMNAME);
    } */
  };
  // const handleBrandChange = (selectedOption) => {
  //   const selectedBrand = selectedOption ? selectedOption.value : "";
  //   setBrand(selectedBrand);
  //   if (selectedBrand) {
  //     const filteredModelNumbers = storeBrandModel.filter(
  //       (item) => item.brand === selectedBrand
  //     ).map((item) => item.model_number);

  //     const uniqueModelNumbers = Array.from(new Set(filteredModelNumbers));
  //     setFmodelnumber(uniqueModelNumbers);
  //   } else {
  //     const allModelNumbers = Array.from(
  //       new Set(Procurement.map((item) => item.MODEL_NUMBER))
  //     );
  //     setFmodelnumber(allModelNumbers);
  //   }
  // };

  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto mt-14">
        <div className="p-4 rounded-lg shadow bg-white">
          <br />
          {/* <div className="flex gap-4">
            <div className="w-1/2">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="To store code " />
              </div>
              <Select
                id="toStoreCode"
                name="toStoreCode"
                onChange={(selectedOption) => { setToStoreCode(selectedOption.value); }}
                options={Array.isArray(Ftstorecode) ? Ftstorecode.map((code) => ({ value: code, label: code })) : []}
                placeholder="To Store Code"
              />
            </div>
            <div className="w-1/2">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="Model Number" />
              </div>
                <Select
                id="modelNumber"
                name="modelNumber"
                onChange={(selectedOption) => { setModelNumber(selectedOption.value); }}
                options={ Array.isArray(Fmodelnumber) ? Fmodelnumber.map((code) => ({ value: code, label: code })) : []}
                placeholder="Select an option"
              />
            </div>
            <div className="w-1/2">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="Brand" />
              </div>
              <Select
                id="brand"
                name="brand"
                onChange={(selectedOption) => { setBrand(selectedOption.value); }}
                options={ Array.isArray(Fbrand) ? Fbrand.map((code) => ({ value: code, label: code })) : []}
                placeholder="Select an option"
              />
            </div>
            <div className="w-1/2">
              <br />
              <Button style={{ backgroundColor: '#A4DDED' }} className="text-dark" type="button" onClick={handleSearch}>
                {"Search"}
              </Button>


            </div>


          </div> */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="To store code " />
              </div>
              <Select
                id="toStoreCode"
                name="toStoreCode"
                value={
                  ToStoreCode ? { value: ToStoreCode, label: ToStoreCode } : ""
                }
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "to")
                }
                options={
                  Array.isArray(Ftstorecode)
                    ? Ftstorecode.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="To Store Code"
                isClearable={true}
              />
            </div>
            <div className="w-1/2">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="Brand" />
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
            <div className="w-1/2">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="Model Number" />
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
            {/* item search */}
            <div className="w-1/2">
              <div className="mb-2 block  ">
                <Label htmlFor="password" value="Item" />
              </div>
              <Select
                id="itemName"
                name="itemName"
                value={itemName ? { value: itemName, label: itemName } : ""}
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "itemName")
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
            <div className="w-1/2">
              <br />
              <Button
                style={{ backgroundColor: "#A4DDED" }}
                className="text-dark"
                type="button"
                onClick={handleSearch}
              >
                {"Search"}
              </Button>
            </div>
          </div>
          <br />
          <form method="post">
            <div className="flex gap-4">
              {/* <div className="w-1/5">
                <div className="mb-2 block  ">
                  <Label htmlFor="password" value="Projection Days " />
                </div>
                <TextInput
                  name="schemename"
                  value={Projectiondays}
                  type="number"
                  required
                  onChange={(e) => {
                    setProjectiondays(e.target.value);
                  }}
                />
              </div> */}
              <div className="w-1/5">
                <div className="mb-2 block  ">
                  <Label htmlFor="password" value="Affordable Quantity" />
                </div>
                <TextInput
                  name="schemename"
                  type="text"
                  required
                  onChange={(e) => {
                    setAffordablequantity(e.target.value);
                  }}
                />
              </div>

              <div className="w-1/5">
                <br />
                <Button
                  style={{ backgroundColor: "#A4DDED" }}
                  className="text-dark"
                  type="button"
                  onClick={GetProjection}
                >
                  {"Get Final PO Quantity"}
                </Button>
              </div>

              <div className="w-1/5 ">
                <br />
                <Button
                  style={{ backgroundColor: "#A4DDED" }}
                  className="text-dark"
                  type="button"
                  onClick={() => downloadExcel(data)}
                  id="excelBtn"
                >
                  <FaFileExcel size={20} />
                </Button>
                <Button
                  hidden
                  style={{ backgroundColor: "#A4DDED" }}
                  className="text-dark"
                  type="button"
                  id="LoaderBtn"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading
                </Button>
              </div>

              <div className="w-1/5">
                <br />
                <Button
                  style={{ backgroundColor: "#A4DDED" }}
                  className="text-dark"
                  type="button"
                  onClick={handleSaveClick}
                >
                  {"Save Procurement"}
                </Button>
              </div>
              <div className="w-1/5">
                <br />
                <Button
                  style={{ backgroundColor: "#A4DDED" }}
                  className="text-dark"
                  type="button"
                  onClick={GeneratePo}
                >
                  {"Generate PO"}
                </Button>
              </div>
            </div>
            <br />
          </form>
          {/* <form method="post" >
            <div className="flex gap-4">
              <Button style={{ backgroundColor: '#A4DDED' }} className="text-dark" type="button" onClick={GeneratePo}>
                {"Generate PO"}
              </Button>
            </div>
            <br />
          </form> */}
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
              className="proc"
              title={
                "Procurement Approve  List" +
                " - " +
                localStorage.getItem("selectedState")
              }
              columns={columns}
              data={data}
              pagination
              subHeader
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

export default ProcurementApproveReport;
