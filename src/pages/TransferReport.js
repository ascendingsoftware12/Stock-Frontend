import React, { useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button, TextInput } from "flowbite-react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import "../style/datatablestyle.css";
import "flowbite/dist/flowbite.css";
import axios from "axios";
import Select from "react-select";

function TransferReport() {
  const [loading, setLoading] = useState(false);
  const [TransferReport, setTransferReport] = useState({});
  const [Ffstorecode, setFfstorecode] = useState({});
  const [Ftstorecode, setFtstorecode] = useState({});
  const [Fmodelnumber, setFmodelnumber] = useState({});
  const [Fbrand, setFbrand] = useState({});
  const [FromStoreCode, setFromStoreCode] = useState("");
  const [ToStoreCode, setToStoreCode] = useState("");
  const [storeBrandModel, setStoreBrandModel] = useState({});
  const [ModelNumber, setModelNumber] = useState("");
  const [Brand, setBrand] = useState("");
  const [Status, setStatus] = useState("");
  const [TransferReportcount, setTransferReportcount] = useState("");
  const state = localStorage.getItem("selectedState");
  const [FitemName, setFItemName] = useState({});
  const [itemName, setItemName] = useState("");
  const [trFlag, setTRFlag] = useState();
  const [ctFlag, setCTFlag] = useState();
  const [sbFlag, setSBFlag] = useState();
  useEffect(() => {
    if (!trFlag) fetchTransferReport();
    if (!ctFlag) fetchCountTransferReport();
    if (!sbFlag) fetchStoreBrandModel();
  }, [trFlag, ctFlag, sbFlag]);

  const statusOptions = [
    { value: "All", label: "All" },
    { value: "ANC", label: "Approved not Couriered" },
    { value: "CNR", label: "Couriered not Received" },
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
  const getStatusLabel = (value) => {
    const selectedOption = statusOptions.find(
      (option) => option.value === value
    );
    return selectedOption
      ? { value: selectedOption.value, label: selectedOption.label }
      : "";
  };

  const fetchTransferReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/transferreport/headoffice?state=${state}&fromstorecode=${FromStoreCode}&tostorecode=${ToStoreCode}&modelnumber=${ModelNumber}&brand=${Brand}&itemname=${itemName}&status=${Status}`
      );
      const TransferReportData = response.data;
      setTransferReport(TransferReportData);
      setTRFlag(true);
    } catch (error) {
      console.error("Error fetching ApproveTransfer Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const SearchfetchTransferReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/transferreport/headoffice?state=${state}&fromstorecode=${FromStoreCode}&tostorecode=${ToStoreCode}&modelnumber=${ModelNumber}&itemname=${itemName}&brand=${Brand}&status=${Status}`
      );
      const TransferReportData = response.data;
      setTransferReport(TransferReportData);
    } catch (error) {
      console.error("Error fetching ApproveTransfer Data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountTransferReport = async () => {
    try {
      const response = await axios.get(
        `/transferreport/headoffice/overallcount?state=${state}&fromstorecode=${FromStoreCode}&tostorecode=${ToStoreCode}&modelnumber=${ModelNumber}&itemname=${itemName}&brand=${Brand}&status=${Status}`
      );
      const TransferReportData = response.data;
      setTransferReportcount(TransferReportData);
      setCTFlag(true);
    } catch (error) {
      console.error("Error fetching ApproveTransfer Data:", error);
    }
  };
  const SearchFetchCountReport = async () => {
    try {
      const response = await axios.get(
        `/transferreport/headoffice/overallcount?state=${state}&fromstorecode=${FromStoreCode}&tostorecode=${ToStoreCode}&modelnumber=${ModelNumber}&itemname=${itemName}&brand=${Brand}&status=${Status}`
      );
      const TransferReportData = response.data;
      setTransferReportcount(TransferReportData);
    } catch (error) {
      console.error("Error fetching ApproveTransfer Data:", error);
    }
  };

  const data = Array.isArray(TransferReport)
    ? TransferReport.map((TR) => ({
        fscode: TR.FROM_STORE_CODE,
        fsname: TR.FROM_STORE_NAME,
        tscode: TR.TO_STORE_CODE,
        tsname: TR.TO_STORE_NAME,
        modelno: TR.MODEL_NUMBER,
        itemName: TR.ITEM_NAME,
        brand: TR.BRAND,
        rcquan: TR.RECOMMENDED_QUANTITY,
        apquan: TR.APPROVED_QUANTITY,
        apdate: TR.APPROVED_DATE,
        trquan: TR.TRANSFER_QUANTITY,
        trdate: TR.TRANSFERRED_DATE,
        recquan: TR.RECEIVED_QUANTITY,
        rcdate: TR.RECEIVED_DATE,
      }))
    : [];

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
      selector: (row) => row.rcquan,
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
      name: "Approved Date",
      selector: (row) => row.apdate,
      sortable: true,
      width: "120px",
      wrap: true,
    },
    {
      name: "Transfered Quantity",
      selector: (row) => row.trquan,
      sortable: true,
      wrap: true,
    },
    {
      name: "Transfered Date",
      selector: (row) => row.trdate,
      sortable: true,
      wrap: true,
    },
    {
      name: "Received Quantity",
      selector: (row) => row.recquan,
      sortable: true,
      wrap: true,
    },
    {
      name: "Received Date",
      selector: (row) => row.rcdate,
      sortable: true,
      wrap: true,
    },
  ];

  const handleSearch = () => {
    SearchfetchTransferReport();
    SearchFetchCountReport();
  };
  /*
  const handleStoreChange = (selectedOption, type) => {
    const selectedValue = selectedOption ? selectedOption.value : "";

    if (type === "from") {
      setFromStoreCode(selectedValue);
    } else if (type === "to") {
      setToStoreCode(selectedValue);
    }

    // Get the current state values for both store codes
    const currentFromStoreCode =
      type === "from" ? selectedValue : fromStoreCode;
    const currentToStoreCode = type === "to" ? selectedValue : toStoreCode;

    if (currentFromStoreCode && currentToStoreCode) {
      // Case 1: Both "from" and "to" are selected
      const filteredBrand = storeBrandModel
        .filter(
          (item) =>
            item.FROM_STORE_CODE === currentFromStoreCode &&
            item.TO_STORE_CODE === currentToStoreCode
        )
        .map((item) => item.BRAND);

      const uniqueBrandNumbers = Array.from(new Set(filteredBrand));

      setFbrand(uniqueBrandNumbers);

      const filteredModelNumbers = storeBrandModel
        .filter(
          (item) =>
            item.FROM_STORE_CODE === currentFromStoreCode &&
            item.TO_STORE_CODE === currentToStoreCode
        )
        .map((item) => item.MODELNO);

        const filteredItemname = storeBrandModel
        .filter(
          (item) =>
            item.FROM_STORE_CODE === currentFromStoreCode &&
            item.TO_STORE_CODE === currentToStoreCode
        )
        .map((item) => item.ITEMNAME);

      const uniqueModelNumbers = Array.from(new Set(filteredModelNumbers));
      setFmodelnumber(uniqueModelNumbers);
      const uniqueItemName = Array.from(new Set(filteredItemname));
      setFItemName(uniqueItemName);

    } else if (currentFromStoreCode && !currentToStoreCode) {
      // Case 2: Only "from" is selected
      const filteredBrand = storeBrandModel
        .filter((item) => item.FROM_STORE_CODE === currentFromStoreCode)
        .map((item) => item.BRAND);

      const uniqueBrandNumbers = Array.from(new Set(filteredBrand));
      setFbrand(uniqueBrandNumbers);

      const filteredModelNumbers = storeBrandModel
        .filter((item) => item.FROM_STORE_CODE === currentFromStoreCode)
        .map((item) => item.MODELNO);

      const uniqueModelNumbers = Array.from(new Set(filteredModelNumbers));
      setFmodelnumber(uniqueModelNumbers);

      const filteredItemname = storeBrandModel
        .filter((item) => item.FROM_STORE_CODE === currentFromStoreCode)
        .map((item) => item.ITEMNAME);

      const uniqueItemName = Array.from(new Set(filteredItemname));
      setFItemName(uniqueItemName);

    } else if (!currentFromStoreCode && currentToStoreCode) {
      // Case 3: Only "to" is selected
      const filteredBrand = storeBrandModel
        .filter((item) => item.TO_STORE_CODE === currentToStoreCode)
        .map((item) => item.BRAND);

      const uniqueBrandNumbers = Array.from(new Set(filteredBrand));
      setFbrand(uniqueBrandNumbers);

      const filteredModelNumbers = storeBrandModel
        .filter((item) => item.TO_STORE_CODE === currentToStoreCode)
        .map((item) => item.MODELNO);

      const uniqueModelNumbers = Array.from(new Set(filteredModelNumbers));
      setFmodelnumber(uniqueModelNumbers);

      const filteredItemname = storeBrandModel
        .filter((item) => item.TO_STORE_CODE === currentToStoreCode)
        .map((item) => item.ITEMNAME);

      const uniqueItemName = Array.from(new Set(filteredItemname));
      setFItemName(uniqueItemName);

    } else {
      // Case 4: Neither "from" nor "to" is selected (reset to all)
      const allModelNumbers = Array.from(
        new Set(storeBrandModel.map((item) => item.MODELNO))
      );
      setFmodelnumber(allModelNumbers);

      const allItemName = Array.from(
        new Set(storeBrandModel.map((item) => item.ITEMNAME))
      );
      setFItemName(allItemName);

      const allBrandNumbers = Array.from(
        new Set(storeBrandModel.map((item) => item.BRAND))
      );
      setFbrand(allBrandNumbers);
    }
  };
  const handleBrandChange = (selectedOption) => {
    const selectedBrand = selectedOption ? selectedOption.value : "";
    setBrand(selectedBrand);

    const currentFromStoreCode = fromStoreCode;
    const currentToStoreCode = toStoreCode;

    if (selectedBrand) {
        let filteredModelNumbers;

        if (currentFromStoreCode && currentToStoreCode) {
            filteredModelNumbers = storeBrandModel
                .filter(
                    (item) =>
                        item.BRAND === selectedBrand &&
                        item.FROM_STORE_CODE === currentFromStoreCode &&
                        item.TO_STORE_CODE === currentToStoreCode
                )
                .map((item) => item.MODELNO);

        } else if (currentFromStoreCode) {
            filteredModelNumbers = storeBrandModel
                .filter(
                    (item) =>
                        item.BRAND === selectedBrand &&
                        item.FROM_STORE_CODE === currentFromStoreCode
                )
                .map((item) => item.MODELNO);

        } else if (currentToStoreCode) {
            filteredModelNumbers = storeBrandModel
                .filter(
                    (item) =>
                        item.BRAND === selectedBrand &&
                        item.TO_STORE_CODE === currentToStoreCode
                )
                .map((item) => item.MODELNO);

        } else {
            filteredModelNumbers = storeBrandModel
                .filter((item) => item.BRAND === selectedBrand)
                .map((item) => item.MODELNO);
        }

        const uniqueModelNumbers = Array.from(new Set(filteredModelNumbers));
        setFmodelnumber(uniqueModelNumbers);

        // Filter Item Names
        if (modelNumber) {
            const filteredItemName = storeBrandModel
                .filter(
                    (item) =>
                        item.BRAND === selectedBrand &&
                        item.MODELNO === modelNumber
                )
                .map((item) => item.ITEMNAME);

            const uniqueItemName = Array.from(new Set(filteredItemName));
            setFItemName(uniqueItemName);
        } else {
            const filteredItemName = storeBrandModel
                .filter((item) => item.BRAND === selectedBrand)
                .map((item) => item.ITEMNAME);

            const uniqueItemName = Array.from(new Set(filteredItemName));
            setFItemName(uniqueItemName);
        }

    } else {
        const allModelNumbers = Array.from(
            new Set(storeBrandModel.map((item) => item.MODELNO))
        );
        setFmodelnumber(allModelNumbers);

        if (modelNumber) {
          console.log(modelNumber);
            const filteredItemName = storeBrandModel
                .filter((item) => item.MODELNO === modelNumber)
                .map((item) => item.ITEMNAME);

            const uniqueItemName = Array.from(new Set(filteredItemName));
            setFItemName(uniqueItemName);
            console.log(FitemName);
        } else {
            const allItemName = Array.from(
                new Set(storeBrandModel.map((item) => item.ITEMNAME))
            );
            setFItemName(allItemName);
        }
    }
};
*/
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
      case "Brand":
        setBrand(selectedValue);
        break;
      case "ModelNumber":
        setModelNumber(selectedValue);
        break;
      case "itemName":
        setItemName(selectedValue);
        break;
      default:
        break;
    }

    // Get current selected values
    const currentFromStoreCode =
      type === "from" ? selectedValue : FromStoreCode;
    const currentToStoreCode = type === "to" ? selectedValue : ToStoreCode;
    const currentBrand = type === "Brand" ? selectedValue : Brand;
    const currentModelNumber =
      type === "ModelNumber" ? selectedValue : ModelNumber;
    const currentItemName = type === "itemName" ? selectedValue : itemName;

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
      if (type !== "Brand") setBrand(item.BRAND);
      if (type !== "ModelNumber") setModelNumber(item.MODELNO);
      if (type !== "itemName") setItemName(item.ITEMNAME);
    }
  };

  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto mt-14">
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
                    Transfer Report
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
                  FromStoreCode
                    ? { value: FromStoreCode, label: FromStoreCode }
                    : ""
                }
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "from")
                }
                /*  onChange={(selectedOption) => { setFromStoreCode(selectedOption ? selectedOption.value : ''); }}*/
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
              <div className="mb-2 block">
                <label htmlFor="toStoreCode" className="form-label">
                  To Store Code
                </label>
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
                /* onChange={(selectedOption) => { setToStoreCode(selectedOption ? selectedOption.value : ''); }}*/
                options={
                  Array.isArray(Ftstorecode)
                    ? Ftstorecode.map((code) => ({ value: code, label: code }))
                    : []
                }
                placeholder="To Store Code"
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
                value={Brand ? { value: Brand, label: Brand } : ""}
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "Brand")
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
                  ModelNumber ? { value: ModelNumber, label: ModelNumber } : ""
                }
                onChange={(selectedOption) =>
                  handleFilterChange(selectedOption, "ModelNumber")
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

            <div className="w-1/6">
              <div className="mb-2 block">
                <label htmlFor="transferType" className="form-label">
                  Status
                </label>
              </div>
              <Select
                id="transferType"
                name="transferType"
                value={getStatusLabel(Status)}
                onChange={(selectedOption) => {
                  setStatus(selectedOption ? selectedOption.value : "");
                }}
                options={statusOptions}
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
          <table className="w-full leading-normal">
            <thead>
              <tr>
                <th className=" bg-white px-2 py-2 border-0 border-gray-200 text-gray-900 text-sm">
                  Total Transfers
                </th>
                <th className="bg-white px-2 py-2 border-0 border-gray-200 text-sm text-gray-900">
                  Total Rec Quantity
                </th>
                <th className="bg-white px-2 py-2 border-0 border-gray-200 text-gray-900 text-sm">
                  Approved Transfers
                </th>
                <th className="bg-white px-2 py-2 border-0 border-gray-200 text-gray-900 text-sm">
                  Recommended Quantity
                </th>
                <th className="bg-white px-2 py-2 border-0 border-gray-200 text-gray-900 text-sm">
                  Approved Quantity By HO
                </th>
                <th className="bg-white px-2 py-2 border-0 border-gray-200 text-gray-900 text-sm">
                  Transfers by Store
                </th>
                <th className="bg-white px-2 py-2 border-0 border-gray-200 text-gray-900 text-sm">
                  Transfered Quantity
                </th>
                <th className="bg-white px-2 py-2 border-0 border-gray-200 text-gray-900 text-sm">
                  Transfers Received
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="px-5 py-3 border-b-2 border-gray-200 bg-light-blue text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ backgroundColor: "#ffd699" }}
                >
                  {TransferReportcount && TransferReportcount.Total_Transfers}
                </td>
                <td
                  className="px-5 py-3 border-b-2 border-gray-200 bg-light-green text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ backgroundColor: "#b3ffb3" }}
                >
                  {TransferReportcount &&
                    TransferReportcount.Total_Rec_Quantity}
                </td>
                <td
                  className="px-5 py-3 border-b-2 border-gray-200 bg-light-yellow text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ backgroundColor: "#ffb3ff" }}
                >
                  {TransferReportcount &&
                    TransferReportcount.Approved_Transfers}
                </td>
                <td
                  className="px-5 py-3 border-b-2 border-gray-200 bg-light-pink text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ backgroundColor: "#99e6ff" }}
                >
                  {TransferReportcount &&
                    TransferReportcount.Recommended_Quantity}
                </td>
                <td
                  className="px-5 py-3 border-b-2 border-gray-200 bg-light-purple text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ backgroundColor: "#E9967A" }}
                >
                  {TransferReportcount &&
                    TransferReportcount.Approved_Quantity_By_HO}
                </td>
                <td
                  className="px-5 py-3 border-b-2 border-gray-200 bg-light-orange text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ backgroundColor: "#ffb3cc" }}
                >
                  {TransferReportcount &&
                    TransferReportcount.Transfers_by_Store}
                </td>
                <td
                  className="px-5 py-3 border-b-2 border-gray-200 bg-light-teal text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ backgroundColor: "#ADFF2F" }}
                >
                  {TransferReportcount &&
                    TransferReportcount.Transfered_Quantity}
                </td>
                <td
                  className="px-5 py-3 border-b-2 border-gray-200 bg-light-teal text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={{ backgroundColor: "#DAA520" }}
                >
                  {TransferReportcount &&
                    TransferReportcount.Transfers_Received}
                </td>
              </tr>
            </tbody>
          </table>
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
              <DataTable
                title={
                  "Transfer Report List" +
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransferReport;
