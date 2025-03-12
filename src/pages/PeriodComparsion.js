import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactSlider from "react-slider";
import "flowbite/dist/flowbite.css";
import "../style/table.css";
import { Button, Label, TextInput, Table } from "flowbite-react";
import axios from "axios";
import Select from "react-select";

import "../style/overall.css";
import SelectArrow from "../images/ArrowDn.png";

function PeriodComparsion() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [data6, setData6] = useState([]);
  const [error, setError] = useState("");
  const [activeButton, setActiveButton] = useState("");
  const [placeholdersale, setPlaceholdersale] = useState("All");
  const [placeholderselection, setPlaceholderselection] = useState("All");
  const [placeholderitemc, setPlaceholderitemc] = useState("All");
  const [placeholderproduct, setPlaceholderproduct] = useState("All");
  const [placeholderbrand, setPlaceholderbrand] = useState("All");
  const [placeholderitemn, setPlaceholderitemn] = useState("All");
  const [placeholdermodle, setPlaceholdermodle] = useState("All");
  const [placeholderbranch, setPlaceholderbranch] = useState("All");
  const [placeholdercity, setPlaceholdercity] = useState("All");
  const [placeholderdemo, setPlaceholderdemo] = useState("All");
  const [placeholderprice, setPlaceholderprice] = useState("All");
  const [placeholdersrn, setPlaceholdersrn] = useState("All");

  const [brandSection, setBrandSection] = useState([]);
  const [citySection, setCitySection] = useState([]);
  const [sections, setSections] = useState([]);
  const [sections1, setSections1] = useState([]);
  const [sections2, setSections2] = useState([]);
  const [sections3, setSections3] = useState([]);
  const [sections4, setSections4] = useState([]);
  const [sections5, setSections5] = useState([]);

  const [BrandAnalysispage, setBrandAnalysispage] = useState(1);

  const [options51, setOptions51] = useState([]);
  const [options61, setOptions61] = useState([]);
  const [optionitem, setOptionsitem] = useState([]);

  const [selectedOption31, setSelectedOption31] = useState(null);
  const [selectedOption61, setSelectedOption61] = useState(null);
  const [selectedOptionitem, setSelectedOptionitem] = useState(null);

  const renderGrowthIcon = (growth) => {
    const growthString = typeof growth === "string" ? growth : `${growth}%`;
    const growthValue = parseFloat(growthString.replace("%", ""));

    if (growthValue > 0) {
      return <span style={{ color: "green", fontWeight: "bold" }}>↑</span>;
    } else if (growthValue < 0) {
      return <span style={{ color: "red", fontWeight: "bold" }}>↓</span>;
    } else {
      return null;
    }
  };
  const formatNumber1 = (value) => {
    if (value === null || value === undefined) return "0";
    return `${value >= 0 ? "" : ""}${parseFloat(value).toFixed(2)}`;
  };

  const ErrorPopup = ({ tableName, message, onClose }) => {
    return (
      <div className="popup">
        <div className="popupContent">
          <h4>Error in {tableName}</h4>
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  const renderGrowthIcon1 = (growth) => {
    const growthString = typeof growth === "string" ? growth : `${growth}%`;
    const growthValue = parseFloat(growthString.replace("%", ""));

    if (growthValue > 0) {
      return <span style={{ color: "green", fontWeight: "bold" }}>↑</span>;
    } else if (growthValue < 0) {
      return <span style={{ color: "red", fontWeight: "bold" }}>↓</span>;
    } else {
      return null;
    }
  };

  const [sortedSectionsBrand, setSortedSectionsBrand] = useState([]);
  const [sortConfig6, setSortConfig6] = useState({
    key: "null",
    direction: "asc",
  });

  const handleSort6 = (column) => {
    console.log("Sorting brand section");
    let direction = "asc";
    if (sortConfig6.key === column && sortConfig6.direction === "asc") {
      direction = "desc";
    }
    const sortedData = [...sortedSectionsBrand].sort((a, b) => {
      const valueA = a[column] ?? "";
      const valueB = b[column] ?? "";

      if (column === "growth") {
        const growthA =
          parseInt(
            typeof valueA === "string"
              ? valueA.replace(/[^\d.-]/g, "")
              : valueA,
            10
          ) || 0;
        const growthB =
          parseInt(
            typeof valueB === "string"
              ? valueB.replace(/[^\d.-]/g, "")
              : valueB,
            10
          ) || 0;
        return direction === "asc" ? growthA - growthB : growthB - growthA;
      } else if (column === "name") {
        return direction === "asc"
          ? valueA?.localeCompare(valueB) || 0
          : valueB?.localeCompare(valueA) || 0;
      } else if (column === "period1" || column === "period2") {
        const numericValueA =
          typeof valueA === "string"
            ? parseInt(valueA.replace(/,/g, ""), 10)
            : valueA || 0;
        const numericValueB =
          typeof valueB === "string"
            ? parseInt(valueB.replace(/,/g, ""), 10)
            : valueB || 0;
        return direction === "asc"
          ? numericValueA - numericValueB
          : numericValueB - numericValueA;
      } else {
        return 0;
      }
    });
    setSortConfig6({ key: column, direction });
    setSortedSectionsBrand(sortedData);
  };

  //city

  const [sortedCityBrand, setSortedCityBrand] = useState(citySection);
  const [sortConfig7, setSortConfig7] = useState({
    key: "null",
    direction: "asc",
  });
  const handleSort7 = (key) => {
    const direction =
      sortConfig7.key === key && sortConfig7.direction === "asc"
        ? "desc"
        : "asc";
    console.log("city");
    const parseValue = (value) => {
      if (typeof value === "string") {
        const cleanedValue = value.replace(/[^\d.-]/g, "");
        return isNaN(cleanedValue) ? 0 : parseFloat(cleanedValue);
      }
      return value;
    };

    const sortedData = [...sortedCityBrand].sort((a, b) => {
      if (key === "growth" || key === "period1" || key === "period2") {
        const aValue = parseValue(a[key]);
        const bValue = parseValue(b[key]);

        console.log(`${key} - a: ${aValue}, b: ${bValue}`);
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (key === "name") {
        const aValue = a[key].toLowerCase();
        const bValue = b[key].toLowerCase();

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setSortConfig7({ key, direction });
    setSortedCityBrand(sortedData);
  };

  //other

  const [sortedSections, setSortedSections] = useState(sections);
  const [sortConfig, setSortConfig] = useState({
    key: "null",
    direction: "asc",
  });
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

    const parseValue = (value) => {
      if (typeof value === "string") {
        const cleanedValue = value.replace(/[^\d.-]/g, "");
        return isNaN(cleanedValue) ? 0 : parseFloat(cleanedValue);
      }
      return value;
    };

    const sortedData = [...sortedSections].sort((a, b) => {
      if (key === "growth" || key === "period1" || key === "period2") {
        const aValue = parseValue(a[key]);
        const bValue = parseValue(b[key]);

        console.log(`${key} - a: ${aValue}, b: ${bValue}`);
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (key === "name") {
        const aValue = a[key].toLowerCase();
        const bValue = b[key].toLowerCase();

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setSortedSections(sortedData);
  };
  //itemtable
  const [sortSections1, setSortSections1] = useState(sections1);
  const [sortConfig1, setSortConfig1] = useState({
    key: null,
    direction: "asc",
  });
  const handleSort1 = (key) => {
    const direction =
      sortConfig1.key === key && sortConfig1.direction === "asc"
        ? "desc"
        : "asc";

    const parseValue = (value) => {
      if (typeof value === "string") {
        const cleanedValue = value.replace(/[^\d.-]/g, "");
        return isNaN(cleanedValue) ? 0 : parseFloat(cleanedValue);
      }
      return value;
    };

    const sortedData = [...sortSections1].sort((a, b) => {
      if (key === "growth" || key === "period1" || key === "period2") {
        const aValue = parseValue(a[key]);
        const bValue = parseValue(b[key]);

        console.log(`${key} - a: ${aValue}, b: ${bValue}`);
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (key === "name") {
        const aValue = a[key].toLowerCase();
        const bValue = b[key].toLowerCase();

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setSortConfig1({ key, direction });
    setSortSections1(sortedData);
  };
  const [sortSections2, setSortSections2] = useState(sections2);
  const [sortConfig2, setSortConfig2] = useState({
    key: null,
    direction: "asc",
  });

  const handleSort2 = (key) => {
    const direction =
      sortConfig2.key === key && sortConfig2.direction === "asc"
        ? "desc"
        : "asc";

    const parseValue = (value) => {
      if (typeof value === "string") {
        const cleanedValue = value.replace(/[^\d.-]/g, "");
        return isNaN(cleanedValue) ? 0 : parseFloat(cleanedValue);
      }
      return value;
    };

    const sortedData = [...sortSections2].sort((a, b) => {
      if (key === "growth" || key === "period1" || key === "period2") {
        const aValue = parseValue(a[key]);
        const bValue = parseValue(b[key]);

        console.log(`${key} - a: ${aValue}, b: ${bValue}`);
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (key === "name") {
        const aValue = a[key].toLowerCase();
        const bValue = b[key].toLowerCase();

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setSortConfig2({ key, direction });
    setSortSections2(sortedData);
  };
  //brand
  const [sortSections3, setSortSections3] = useState(sections3);
  const [sortConfig3, setSortConfig3] = useState({
    key: null,
    direction: "asc",
  });

  const handleSort3 = (key) => {
    const direction =
      sortConfig3.key === key && sortConfig3.direction === "asc"
        ? "desc"
        : "asc";

    const parseValue = (value) => {
      if (typeof value === "string") {
        // Remove commas and parse as integer
        const cleanedValue = value.replace(/[^\d.-]/g, "");
        return isNaN(cleanedValue) ? 0 : parseFloat(cleanedValue);
      }
      return value;
    };

    const sortedData = [...sortSections3].sort((a, b) => {
      if (key === "growth" || key === "period1" || key === "period2") {
        const aValue = parseValue(a[key]);
        const bValue = parseValue(b[key]);

        console.log(`${key} - a: ${aValue}, b: ${bValue}`);
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (key === "name") {
        const aValue = a[key].toLowerCase();
        const bValue = b[key].toLowerCase();

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setSortConfig3({ key, direction });
    setSortSections3(sortedData);
  };
  //rpoduct
  const [sortSections4, setSortSections4] = useState(sections4);
  const [sortConfig4, setSortConfig4] = useState({
    key: null,
    direction: "asc",
  });

  const handleSort4 = (key) => {
    const direction =
      sortConfig4.key === key && sortConfig4.direction === "asc"
        ? "desc"
        : "asc";

    const parseValue = (value) => {
      if (typeof value === "string") {
        const cleanedValue = value.replace(/[^\d.-]/g, "");
        return isNaN(cleanedValue) ? 0 : parseFloat(cleanedValue);
      }
      return value;
    };

    const sortedData = [...sortSections4].sort((a, b) => {
      if (key === "growth" || key === "period1" || key === "period2") {
        const aValue = parseValue(a[key]);
        const bValue = parseValue(b[key]);

        console.log(`${key} - a: ${aValue}, b: ${bValue}`);
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (key === "name") {
        const aValue = a[key].toLowerCase();
        const bValue = b[key].toLowerCase();

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setSortConfig4({ key, direction });
    setSortSections4(sortedData);
  };
  //price
  const [sortSections5, setSortSections5] = useState(sections5);
  const [sortConfig5, setSortConfig5] = useState({
    key: null,
    direction: "asc",
  });

  const handleSort5 = (key) => {
    const direction =
      sortConfig5.key === key && sortConfig5.direction === "asc"
        ? "desc"
        : "asc";

    const parseValue = (value) => {
      if (typeof value === "string") {
        const cleanedValue = value.replace(/[^\d.-]/g, "");
        return isNaN(cleanedValue) ? 0 : parseFloat(cleanedValue);
      }
      return value;
    };

    const sortedData = [...sortSections5].sort((a, b) => {
      if (key === "growth" || key === "period1" || key === "period2") {
        const aValue = parseValue(a[key]);
        const bValue = parseValue(b[key]);

        console.log(`${key} - a: ${aValue}, b: ${bValue}`);
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (key === "name") {
        const aValue = a[key].toLowerCase();
        const bValue = b[key].toLowerCase();

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });

    setSortConfig5({ key, direction });
    setSortSections5(sortedData);
  };
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  //datepicker
  const [period1, setPeriod1] = useState({ from: "", to: "" });
  const [TempPeriod, setTempPeriod] = useState({ from: "", to: "" });
  const [TempPeriod2, setTempPeriod2] = useState({ from: "", to: "" });
  const [period2, setPeriod2] = useState({ from: "", to: "" });
  const [period3, setPeriod3] = useState({ from: "", to: "" });
  const [period4, setPeriod4] = useState({ from: "", to: "" });
  const [tempPeriod1, setTempPeriod1] = useState({ from: "", to: "" });
  // const [tempPeriod2, setTempPeriod2] = useState({ from: "", to: "" });
  // const [isDisabled, setIsDisabled] = useState(false);
  const [LMTDData, setLMTDData] = useState(false);
  const handleButtonClick = () => {
    setIsApplyDisabled(false);
    setTempPeriod1({ from: "", to: "" });
    setTempPeriod2({ from: "", to: "" });
    setPeriod2({ from: "", to: "" });
    setPeriod1({ from: "", to: "" });
    // Ensure the button behavior works properly during first-time reload and subsequent reloads

    setSlider2({ start: 0, end: 100 });
    setSlider1({ start: 0, end: 100 });
    setLMTDData(true);
    setClickedButton("LMTD vs MTD");
    setActiveButton("LMTD");
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const firstDayPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    const period1From = formatDate(firstDayPrevMonth);
    const period1To = formatDate(
      new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    );
    const firstDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const period2From = formatDate(firstDayCurrentMonth);
    const period2To = formatDate(today);
    setTempPeriod1({ from: period1From, to: period1To });
    setPeriod1({ from: period1From, to: period1To });
    setTempPeriod2({ from: period2From, to: period2To });
    setPeriod2({ from: period2From, to: period2To });
    setShowSlider(true);
  };

  ///////////////////////////dkcode///////////////////////////////////////////////////
  // const [sliderValues, setSliderValues] = useState([0, getDaysOffset(maxDate)]);
  // const [sliderValues1, setSliderValues1] = useState([0, 0]);
  const minDate = tempPeriod1.from;
  const maxDate = tempPeriod1.to;
  // Convert date to numeric value (days from minDate)
  const getDaysOffset = (date) =>
    Math.floor((new Date(date) - new Date(minDate)) / (1000 * 60 * 60 * 24));

  // Convert numeric value back to date
  const getDateFromOffset = (offset) =>
    new Date(new Date(minDate).getTime() + offset * (1000 * 60 * 60 * 24))
      .toISOString()
      .split("T")[0];

  // Handle slider change

  const [sliderValues, setSliderValues] = useState([
    getDaysOffset(minDate),
    getDaysOffset(maxDate),
  ]);

  useEffect(() => {
    if (minDate && maxDate && period1.from && period1.to) {
      setSliderValues([getDaysOffset(period1.from), getDaysOffset(period1.to)]);
    }
  }, [minDate, maxDate, period1]);

  const handleSliderChange = (values) => {
    setIsApplyDisabled(false);
    setSliderValues(values);
    setPeriod1({
      from: getDateFromOffset(values[0]),
      to: getDateFromOffset(values[1]),
    });
  };

  const minDate1 = TempPeriod2.from;
  const maxDate1 = TempPeriod2.to;

  const getDaysOffset1 = (date) =>
    Math.floor((new Date(date) - new Date(minDate1)) / (1000 * 60 * 60 * 24));

  // Convert numeric value back to date
  const getDateFromOffset1 = (offset) =>
    new Date(new Date(minDate1).getTime() + offset * (1000 * 60 * 60 * 24))
      .toISOString()
      .split("T")[0];

  const [sliderValues1, setSliderValues1] = useState([
    getDaysOffset1(minDate1),
    getDaysOffset1(maxDate1),
  ]);

  useEffect(() => {
    if (minDate1 && maxDate1 && period2.from && period2.to) {
      setSliderValues1([
        getDaysOffset1(period2.from),
        getDaysOffset1(period2.to),
      ]);
    }
  }, [minDate1, maxDate1, period2]);

  const handleSliderChange1 = (values) => {
    setIsApplyDisabled(false);
    setSliderValues1(values);
    setPeriod2({
      from: getDateFromOffset1(values[0]),
      to: getDateFromOffset1(values[1]),
    });
  };

  ////////////////////////dkcodeend///////////////////////////////////////////////////

  // let currentDate = new Date().toDateString();

  // const checkDateChange = () => {
  //   const newDate = new Date().toDateString();
  //   if (newDate !== currentDate) {
  //     currentDate = newDate;
  //     setCustomperiod1({ from: "", to: "" });
  //     setCustomperiod2({ from: "", to: "" });
  //     fetchData();
  //     reloadRefresh();

  //     console.log("checking date",currentDate,newDate);
  //   }
  //   console.log("checking date",currentDate,newDate);

  // };

  // setInterval(checkDateChange, 60000);

  useEffect(() => {
    scheduleDailyRun(0, 0); 
  }, []);

  const runDailyTask = async () => {
    console.log("API Triggered at:", new Date());
      setCustomperiod1({ from: "", to: "" });
      setCustomperiod2({ from: "", to: "" });
      fetchData();
      reloadRefresh();
  };

  const scheduleDailyRun = (hour, minute) => {
    const now = new Date();
    const target = new Date();

    target.setHours(hour, minute, 0, 0); 
    if (now > target) {
      console.log("itwork",target);
      
      runDailyTask(); 
      target.setDate(target.getDate() + 1); 
    }
    const timeUntilTarget = target - now;
    console.log("itwork",timeUntilTarget);
    
    const timeoutId = setTimeout(() => {
      runDailyTask();
      setInterval(runDailyTask, 24 * 60 * 60 * 1000); 
    }, timeUntilTarget);

 
    return () => clearTimeout(timeoutId);
  };


  const handleButtonClick1 = () => {
    setIsApplyDisabled(false);
    setTempPeriod1({ from: "", to: "" });
    setTempPeriod2({ from: "", to: "" });
    setPeriod2({ from: "", to: "" });
    setPeriod1({ from: "", to: "" });
    setSlider2({ start: 0, end: 100 });
    setSlider1({ start: 0, end: 100 });
    setClickedButton("LYTD vs YTD");
    setActiveButton("LYTD");
    setIsPreviousMonth(false);

    const today = new Date();
    today.setDate(today.getDate() - 1); // Set to yesterday

    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Period 1: April 1, 2023 to yesterday's date in 2024
    const period1FromDate = new Date(2023, 3, 1);
    const period1ToDate = new Date(2024, currentMonth, currentDate);

    // Period 2: April 1, 2024 to yesterday's date in 2025
    const period2FromDate = new Date(2024, 3, 1);
    const period2ToDate = new Date(2025, currentMonth, currentDate);

    const period1From = formatDate(period1FromDate);
    const period1To = formatDate(period1ToDate);
    const period2From = formatDate(period2FromDate);
    const period2To = formatDate(period2ToDate);
    setTempPeriod1({ from: period1From, to: period1To });
    setPeriod1({ from: period1From, to: period1To });
    console.log(period1);
    setTempPeriod2({ from: period2From, to: period2To });
    setPeriod2({ from: period2From, to: period2To });
    setShowSlider(true);
  };

  const [period, setPeriod] = useState({
    from: "",
    to: "",
  });
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });

  const [customperiod1, setCustomperiod1] = useState({ from: "", to: "" });
  const [customperiod2, setCustomperiod2] = useState({
    from: "",
    to: "",
  });

  const fetchData = async () => {
    const storedAsm = sessionStorage.getItem("asm");
    const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
    const cleanEncode = (value) => {
      let decodedValue = value || "";
      while (decodedValue !== decodeURIComponent(decodedValue)) {
        decodedValue = decodeURIComponent(decodedValue);
      }
      return encodeURIComponent(decodedValue);
    };
    const encodedFilters = {
      city: cleanEncode(filters.city),
      store_name: cleanEncode(filters.store_name),
      item_description: cleanEncode(filters.item_description),
      brand_name: cleanEncode(filters.brand_name),
      product_group: cleanEncode(filters.product_group),
      section: cleanEncode(filters.section),
      model_no: cleanEncode(filters.model_no),
      srn_flag: cleanEncode(filters.srn_flag),
      demo_flag: cleanEncode(filters.demo_flag),
      gstfilter: cleanEncode(filters.gstfillter),
      price_breakup: cleanEncode(filters.PriceBreakup2),
      sale_type: cleanEncode(filters.sale_type),
      item_category: cleanEncode(filters.item_category),
    };

    // console.log("Decoded and Encoded Filters:", encodedFilters);
    try {
      const response = await axios.get(
        `sales_all_in_one_live/date?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}`
      );
      const responseData = response.data.data[0];
      console.log(responseData);

      if (responseData) {
        const formattedStartDate = responseData.start_date
          ?.split(" -")
          .reverse()
          .join("-");
        const formattedEndDate = responseData.end_date
          ?.split(" -")
          .reverse()
          .join("-");
        // setPeriod2({
        //   from: formattedStartDate,
        //   to: formattedEndDate,
        // });

        // setPeriod1({
        //   from: formattedStartDate,
        //   to: formattedEndDate,
        // });

        setTempPeriod({ from: formattedStartDate, to: formattedEndDate });
        setCustomperiod1({
          from: formattedStartDate,
          to: formattedEndDate,
        });
        setCustomperiod2({
          from: formattedStartDate,
          to: formattedEndDate,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (activeButton === "Custom") {
      if (customperiod2.from === "") {
        setIsApplyDisabled1(true);
        console.log("gdgdgf", isApplyDisabled1);
      }
    } else {
      setIsApplyDisabled1(false);
    }
  }, [customperiod2, activeButton]);

  const [showSlider, setShowSlider] = useState(true);
  const handleCustomClick = () => {
    setTempPeriod({ from: "", to: "" });
    setPeriod2(customperiod2);
    setPeriod1(customperiod1);
    setTempPeriod1(customperiod1);
    setTempPeriod2(customperiod2);
    setClickedButton("Custom");
    // setIsDisabled(false);

    setShowSlider(false);
    setActiveButton("Custom");

    // fetchData();
    //  setIsFiltersUpdated(true);
    // if(customperiod2.from===""){
    //   setIsApplyDisabled(true);
    //  }
  };

  const [clickedButton, setClickedButton] = useState(null);
  const [asm, setasm] = useState(null);
  const [customDate, setCustomDate] = useState("");
  const [customDate1, setCustomDate1] = useState("");
  const handlePeriod1Change = (e) => {
    const { value } = e.target;

    if (clickedButton === "Custom") {
      if (customperiod2.from === "") {
        setIsApplyDisabled(true);
      }
      setCustomDate1(value);
    } else {
      setPeriod2((prevPeriod) => ({
        ...prevPeriod,
        to: value,
      }));
    }
  };
  const handlePeriod2Change = (e) => {
    const { value } = e.target;

    if (clickedButton === "Custom") {
      setCustomDate(value);
    } else {
      setPeriod2((prevPeriod) => ({
        ...prevPeriod,
        to: value,
      }));
    }
  };

  const [datechange, setdatechange] = useState(false);

  const [datechange1, setdatechange1] = useState(false);

  //   const handlePeriodChange = (e, setPeriodFn) => {
  //   const { id, value } = e.target;
  // console.log(setPeriodFn);

  //   setdatechange(true);

  //   if (datechange) {
  //     console.log("Updating period3");
  //     setPeriod3((prev) => ({ ...prev, [id]: value }));
  //   } else {
  //     console.log("Updating period1");
  //     setPeriodFn((prev) => ({ ...prev, [id]: value }));
  //   }
  // };

  // const handlePeriodChange = (e, setPeriod1) => {
  //   const { id, value } = e.target;
  //   console.log(setPeriod1);

  //   setdatechange(true);
  //   setdatechange1(true);
  //   if (datechange == true) {
  //     console.log('datechange');
  //     setIsApplyDisabled(false)
  //     setPeriod3((prev) => ({ ...prev, [id]: value }));

  //   }
  //   else {
  //     console.log('datechange');
  //     setPeriod1((prev) => ({ ...prev, [id]: value }));
  //   }

  // };
  const handlePeriodChange1 = (e, setPeriod2) => {
    const { id, value } = e.target;

    setdatechange1(true);
    if (datechange1 == true) {
      console.log("datechange");
      setPeriod4((prev) => ({ ...prev, [id]: value }));
    } else {
      console.log("datechange");
      setPeriod2((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handlePeriodChange = (e, setPeriod1) => {
    setIsApplyDisabled(false);
    const { id, value } = e.target;
    console.log("Updating:", setPeriod1 === setPeriod3 ? "period3" : "period1");

    // setdatechange(true);

    setPeriod1((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    initializePageData();
  }, []);

  const initializePageData = () => {
    setIsApplyDisabled(true);
    setIsFiltersUpdated(true);
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const firstDayPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const firstDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const period1From = formatDate(firstDayPrevMonth);
    const period1To = formatDate(
      new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    );
    const period2From = formatDate(firstDayCurrentMonth);
    const period2To = formatDate(today);
    setInitialFilters({
      filters,
      period1: { from: period1From, to: period1To },
      period2: { from: period2From, to: period2To },
    });

    handleButtonClick();
  };

  // const hasRun = useRef(false); // Ref to track if the effect has already run

  // useEffect(() => {
  //   if (hasRun.current) return; // Prevents the effect from running again
  //   hasRun.current = true;

  // const asm = sessionStorage.getItem("asm");

  // setasm(asm);

  // setasm(asm);
  //   if (period1.from && period1.to && period2.from && period2.to) {
  //     fetchSalesData();
  //   }
  //   if (period1.from && period1.to && period2.from && period2.to) {
  //     fetchDiscAmt();
  //     fetchSalesQty();
  //     fetchASP();
  //     fetchDis();
  //     fetchStoreCt();
  //     fetchBrandwise();
  //     fetchCitywise();
  //     fetchSectionwise();
  //     fetchItemwise();
  //     fetchProductwise();
  //     fetchBrandAna();
  //     fetchItemAnas();
  //     fetchPriceAna();
  //     fetchDropdownData();
  //   }
  // }, [period1, period2]);
  const [debouncedPeriod1, setDebouncedPeriod1] = useState(period1);
  const [debouncedPeriod2, setDebouncedPeriod2] = useState(period2);
  // useEffect(() => {
  //   // fetchDropdownData(filters);
  //   setSortSections3([]);
  //   setBrandAnalysispage(1);
  //   setSortSections4([]);
  //   setItemAnalysispage(1);
  //   setSections2([]);
  //   setSortSections2([]);
  //   setProductwisepage(1);
  //   setBrandSection([]);
  //   setSortedSectionsBrand([]);
  //   setBrandwisepage(1);
  //   setSortedSections([]);
  //   setSections([]);
  //   setSectionpage(1);
  //   setSections1([]);
  //   setSortSections1([]);
  //   setItemwisepage(1);
  //   setSortedCityBrand([]);
  //   setCitySection([]);
  //   setCitywisepage(1);
  // }, [period1, period2]);
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedPeriod1(period1);
  //     setDebouncedPeriod2(period2);
  //   }, 300);

  //   return () => clearTimeout(handler);
  // }, [period1, period2]);
  useEffect(() => {
    if (
      debouncedPeriod1.from &&
      debouncedPeriod1.to &&
      debouncedPeriod2.from &&
      debouncedPeriod2.to
    ) {
      console.log("Triggering functions with debounced values:");
      // console.log("Period1:", debouncedPeriod1);
      // console.log("Period2:", debouncedPeriod2);
      // fetchDropdownData(filters);
      fetchData();
      fetchSalesData();
      fetchDiscAmt();
      fetchSalesQty();
      fetchASP();
      fetchDis();
      fetchStoreCt();
      fetchBrandwise();

      fetchCitywise();
      fetchSectionwise();
      fetchItemwise();
      fetchProductwise();
      fetchBrandAna();
      fetchItemAnas();
      fetchPriceAna();
      fetchDropdownData();
      liveData();

      // fetchDropdownData
    }
  }, []);
  // debouncedPeriod1, debouncedPeriod2
  ///salesdata
  const [isLoadingsales, setIsLoadingsales] = useState(true);
  const [SalesDataresponse, setSalesDataresponse] = useState("");
  const controllerRef1 = useRef(null);
  const fetchSalesData = async () => {
    console.log("Period1:", period1);
    console.log("Period2:", period2);
    if (controllerRef1.current) {
      controllerRef1.current.abort();
    }
    controllerRef1.current = new AbortController();
    const signal = controllerRef1.current.signal;
    try {
      setIsLoadingsales(true);
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setSalesDataresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonsales?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );

      console.log("Fetched data:", response.data);
      setSalesDataresponse(response.statusText);
      if (response.data.success === 1 && response.data.data.length > 0) {
        const salesData = response.data.data[0];
        const formattedData = [
          {
            title: "Sales",
            rows: [
              {
                period1: salesData.period1_total_sales,
                period2: salesData.period2_total_sales,
                growth: salesData.growth_percentage ?? "",
              },
            ],
          },
        ];
        setData1(formattedData);
        setIsLoadingsales(false);
        console.log("Sales data fetched successfully:", formattedData);
      } else {
        console.error("Invalid response or no data available");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setIsLoadingsales(false);
    }
  };

  //salesqty
  const [isLoadingsalesqty, setIsLoadingsalesqty] = useState(true);
  const [SalesQtyresponse, setSalesQtyresponse] = useState("");
  const controllerRef2 = useRef(null);
  const fetchSalesQty = async () => {
    console.log("Period1:", period1);
    console.log("Period2:", period2);
    if (controllerRef2.current) {
      controllerRef2.current.abort();
    }
    controllerRef2.current = new AbortController();
    const signal = controllerRef2.current.signal;
    try {
      setIsLoadingsalesqty(true);
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setSalesQtyresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonSalesQty?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setSalesQtyresponse(response.statusText);
      console.log("Fetched data:", response.data);

      if (response.data.success === 1 && response.data.data.length > 0) {
        const discData = response.data.data[0];
        const growthPercentage = discData.growth_percentage;
        const roundedGrowth = parseFloat(growthPercentage).toFixed(2);
        const growthType = roundedGrowth > 0 ? "up" : "down";

        const growth =
          growthPercentage !== null && growthPercentage !== undefined
            ? `${roundedGrowth}%`
            : "";

        const formattedData = [
          {
            title: "Sales Qty",
            rows: [
              {
                period1: discData.period1_total_sales.toLocaleString("en-IN"),
                period2: discData.period2_total_sales.toLocaleString("en-IN"),
                growth: growth,
                growthType: growthType,
              },
            ],
          },
        ];

        setData2(formattedData);
        setIsLoadingsalesqty(false);
        console.log("Sales Qty data fetched successfully:", formattedData);
      } else {
        console.error("Invalid response or no data available");
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setIsLoadingsalesqty(false);
    }
  };

  //ASP
  const [isLoadingasp, setIsLoadingasp] = useState(true);
  const [ASPresponse, setASPresponse] = useState("");
  const controllerRef3 = useRef(null);
  const fetchASP = async (period1From, period1To, period2From, period2To) => {
    console.log(
      "Fetching ASP with periods:",
      period1From,
      period1To,
      period2From,
      period2To
    );
    setIsLoadingasp(true);
    if (controllerRef3.current) {
      controllerRef3.current.abort();
    }
    controllerRef3.current = new AbortController();
    const signal = controllerRef3.current.signal;
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setASPresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonaps?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setASPresponse(response.statusText);
      console.log("Fetched data:", response.data);

      if (response.data.success === 1 && response.data.data.length > 0) {
        const aspData = response.data.data[0];

        // ✅ Check if values exist before formatting
        const period1Asp = aspData.period1_avg_sales ?? 0; // Default to 0 if undefined
        const period2Asp = aspData.period2_avg_sales ?? 0;

        const growth =
          aspData.growth_percentage !== null
            ? `${parseFloat(aspData.growth_percentage).toFixed(2)}%`
            : "";

        const growthType = aspData.growth_percentage > 0 ? "up" : "down";

        const formattedData = [
          {
            title: "ASP",
            rows: [
              {
                period1: Math.round(period1Asp).toLocaleString("en-IN"),
                period2: Math.round(period2Asp).toLocaleString("en-IN"),
                growth: growth,
                growthType: growthType,
              },
            ],
          },
        ];

        setData3(formattedData);
        console.log("ASP data fetched successfully:", formattedData);
      } else {
        console.error("Invalid response or no data available");
        setData3([]);
      }
    } catch (error) {
      console.error("Error fetching ASP data:", error);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setIsLoadingasp(false);
    }
  };

  //discount data
  const [isLoadingdisamt, setIsLoadingdisamt] = useState(true);
  const [DiscAmtresponse, setDiscAmtresponse] = useState("");
  const controllerRef4 = useRef(null);
  const fetchDiscAmt = async () => {
    console.log("Period1:", period1);
    console.log("Period2:", period2);
    if (controllerRef4.current) {
      controllerRef4.current.abort();
    }
    controllerRef4.current = new AbortController();
    const signal = controllerRef4.current.signal;
    try {
      setIsLoadingdisamt(true);
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setDiscAmtresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonDiscAmt?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setDiscAmtresponse(response.statusText);
      console.log("Fetched data:", response.data);

      if (response.data.success === 1 && response.data.data.length > 0) {
        const discData = response.data.data[0];
        const growth =
          discData.growth_percentage !== null
            ? `${parseFloat(discData.growth_percentage).toFixed(2)}%`
            : "";

        const growthType = discData.growth_percentage > 0 ? "up" : "down";
        const formattedData = [
          {
            title: "Disc Amt",
            rows: [
              {
                period1: discData.period1_total_sales.toLocaleString("en-IN"),
                period2: discData.period2_total_sales.toLocaleString("en-IN"),
                growth: growth,
                growthType: growthType,
              },
            ],
          },
        ];

        setData4(formattedData);
        setIsLoadingdisamt(false);
        console.log("Disc Amt data fetched successfully:", formattedData);
      } else {
        console.error("Invalid response or no data available");
      }
    } catch (error) {
      console.error("Error fetching disc amount data:", error);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setIsLoadingdisamt(false);
    }
  };
  //dis
  const [isLoadingdis, setIsLoadingdis] = useState(true);
  const [Disresponse, setDisresponse] = useState("");
  const controllerRef5 = useRef(null);
  const fetchDis = async () => {
    console.log("Period1:", period1);
    console.log("Period2:", period2);
    if (controllerRef5.current) {
      controllerRef5.current.abort();
    }
    controllerRef5.current = new AbortController();
    const signal = controllerRef5.current.signal;
    try {
      setIsLoadingdis(true);
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setDisresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/perioddisComparisonsales?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setDisresponse(response.statusText);
      console.log("Fetched data:", response.data);

      if (response.data.success === 1 && response.data.data.length > 0) {
        const discData = response.data.data[0];
        const growth =
          discData.growth_percentage !== null
            ? `${parseFloat(discData.growth_percentage).toFixed(2)}%`
            : "";

        const growthType = discData.growth_percentage > 0 ? "up" : "down";
        const formattedData = [
          {
            title: "Disc %",
            rows: [
              {
                period1: discData.period1_discount_ratio.toFixed(2) + "%",
                period2: discData.period2_discount_ratio.toFixed(2) + "%",
                growth: growth,
                growthType: growthType,
              },
            ],
          },
        ];
        setData5(formattedData);
        setIsLoadingdis(false);
        console.log("Disc data fetched successfully:", formattedData);
      } else {
        console.error("Invalid response or no data available");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setIsLoadingdis(false);
    }
  };
  const [isLoadingstorect, setIsLoadingstorect] = useState(true);
  const [StoreCtresponse, setStoreCtresponse] = useState("");
  const controllerRef6 = useRef(null);
  let lastScrollTop = 0;
  const fetchStoreCt = async () => {
    console.log("Period1:", period1);
    console.log("Period2:", period2);
    if (controllerRef6.current) {
      controllerRef6.current.abort();
    }
    controllerRef6.current = new AbortController();
    const signal = controllerRef6.current.signal;
    try {
      setIsLoadingstorect(true);
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setStoreCtresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonsalesstorecode?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setStoreCtresponse(response.statusText);
      console.log("Fetched data:", response.data);

      if (response.data.success === 1 && response.data.overall_totals) {
        const discData = response.data.overall_totals;

        const growth =
          discData.growth_percentage !== null
            ? `${parseFloat(discData.growth_percentage).toFixed(2)}%`
            : "";

        const growthType = discData.growth_percentage > 0 ? "up" : "down";

        const formattedData = [
          {
            title: "Store Count",
            rows: [
              {
                period1: discData.total_period1_count
                  ? parseFloat(discData.total_period1_count).toLocaleString(
                      "en-IN"
                    )
                  : "",
                period2: discData.total_period2_count
                  ? parseFloat(discData.total_period2_count).toLocaleString(
                      "en-IN"
                    )
                  : "",
                growth: growth,
                growthType: growthType,
              },
            ],
          },
        ];

        setData6(formattedData);
        setIsLoadingstorect(false);
        console.log("Sales data fetched successfully:", formattedData);
      } else {
        console.error("Invalid response or no data available");
        setIsLoadingstorect(false);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setIsLoadingstorect(false);
    }
  };

  const handleDateChange = (event, periodSetter) => {
    const { id, value } = event.target;
    periodSetter((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange1 = (event, periodSetter) => {
    const { id, value } = event.target;
    periodSetter((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleBrandScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreData &&
      !Brandloading
    ) {
      fetchBrandAna(BrandAnalysispage);
    }
  };
  const handleItemScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataItem &&
      !ItemCategoryLoading
    ) {
      fetchItemAnas(ItemAnalysispage);
    }
  };

  const handleCityScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataCity &&
      !Citywiseloading
    ) {
      fetchCitywise(Citywisepage);
    }
  };

  const handleProductScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataProduct &&
      !ProductwiseLoading
    ) {
      fetchProductwise(Productwisepage);
    }
  };

  const handleItemwiseScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataItemwise &&
      !ItemwisecategoryLoading
    ) {
      fetchItemwise(Itemwisepage);
    }
  };

  const handleSectionScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataSection &&
      !SectionWiseLoading
    ) {
      fetchSectionwise(Sectionpage);
    }
  };

  const handleBrandwiseScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataBrand &&
      !Brandwiseloading
    ) {
      fetchBrandwise(Brandwisepage);
    }
  };

  const [Brandwiseloading, setBrandwiseloading] = useState(false);
  const [hasMoreDataBrand, setHasMoreDataBrand] = useState(true);
  const [Brandwisepage, setBrandwisepage] = useState(1);
  const Brandwiselimit = 30;
  const [Brandwiseresponse, setBrandwiseresponse] = useState("");
  const controllerRef7 = useRef(null);
  const fetchBrandwise = async (page = 1, resetData = false) => {
    setBrandwiseloading(true);
    console.log(Brandwisepage, "brandwise");
    if (controllerRef7.current) {
      controllerRef7.current.abort();
    }
    controllerRef7.current = new AbortController();
    const signal = controllerRef7.current.signal;
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;

      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setBrandwiseresponse("");

      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonbranchwiseAnalysis?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&gstfilter=${encodedFilters.gstfillter}&asm=${asm}&page=${Brandwisepage}&limit=${Brandwiselimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      console.log(response);
      setBrandwiseresponse(response.statusText);
      const responseData = response?.data?.data;
      // const isValidResponse = responseData && Array.isArray(responseData);

      if (Array.isArray(responseData) && responseData.length > 0) {
        const formattedData = responseData.map((item) => ({
          name: item.store_name || "Unknown Store",
          period1: item.period1_total_sales || 0,
          period2: item.period2_total_sales || 0,
          growth: item.growth_percentage || "0%",
        }));
        const sortedData = formattedData.sort((a, b) => b.period2 - a.period2);

        if (Brandwisepage === 1) {
          setBrandSection(sortedData);
          setSortedSectionsBrand(sortedData);
        } else {
          setBrandSection((prevData) =>
            resetData ? sortedData : [...prevData, ...sortedData]
          );
          setSortedSectionsBrand((prevData) =>
            resetData ? sortedData : [...prevData, ...sortedData]
          );
        }

        if (sortedData.length < Brandwiselimit) {
          setHasMoreDataBrand(false);
        } else {
          setHasMoreDataBrand(true);
          setBrandwisepage(page + 1);
        }
      } else {
        console.error(
          "Invalid response format or data missing:",
          response?.data
        );
        setHasMoreDataBrand(false);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setBrandwiseloading(false);
    }
  };

  //section
  const [SectionWiseLoading, setSectionWiseLoading] = useState(false);
  const [Sectionpage, setSectionpage] = useState(1);
  const [hasMoreDataSection, setHasMoreDataSection] = useState(true);
  const Sectionlimit = 30;
  const [Sectionwiseresponse, setSectionwiseresponse] = useState("");
  const controllerRef8 = useRef(null);
  const fetchSectionwise = async (page = 1, resetData = false) => {
    setSectionWiseLoading(true);
    console.log(Sectionpage, "sectionpage");
    if (controllerRef8.current) {
      controllerRef8.current.abort();
    }
    controllerRef8.current = new AbortController();
    const signal = controllerRef8.current.signal;
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setSectionwiseresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonsectionwiseAnalysis?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&gstfilter=${encodedFilters.gstfillter}&asm=${asm}&page=${Sectionpage}&limit=${Sectionlimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setSectionwiseresponse(response.statusText);
      const data = response?.data?.data;

      if (Array.isArray(data) && data.length > 0) {
        const formattedData = data.map((item) => ({
          name: item.section || "Unknown Section",
          period1: item.period1_section_total_sales || 0,
          period2: item.period2_section_total_sales || 0,
          growth:
            item.growth_percentage !== null
              ? `${item.growth_percentage}%`
              : "0%",
        }));
        const sortedData = formattedData.sort((a, b) => {
          const growthA = parseFloat(a.period2);
          const growthB = parseFloat(b.period2);
          return growthB - growthA;
        });

        if (Sectionpage === 1) {
          setSections(sortedData);
          setSortedSections(sortedData);
        } else {
          setSections((prevData) =>
            resetData ? sortedData : [...prevData, ...sortedData]
          );
          setSortedSections((prevData) =>
            resetData ? sortedData : [...prevData, ...sortedData]
          );
        }

        if (sortedData.length < Sectionlimit) {
          setHasMoreDataSection(false);
        } else {
          setHasMoreDataSection(true);
          setSectionpage(page + 1);
        }
      } else {
        setHasMoreDataSection(false);
        console.error(
          "API response is invalid or data is missing:",
          response?.data
        );
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setSectionWiseLoading(false);
    }
  };
  //itemcategory

  const [ItemwisecategoryLoading, setItemCategoryLoading] = useState(false);
  const [Itemwisepage, setItemwisepage] = useState(1);
  const [hasMoreDataItemwise, setHasMoreDataItemwise] = useState(true);
  const Itemwiselimit = 10;
  const [Itemwiseresponse, setItemwiseresponse] = useState("");
  const controllerRef9 = useRef(null);
  const fetchItemwise = async (page = 1, resetData = false) => {
    setItemCategoryLoading(true);
    console.log(Itemwisepage, "itemwise");
    if (controllerRef9.current) {
      controllerRef9.current.abort();
    }
    controllerRef9.current = new AbortController();
    const signal = controllerRef9.current.signal;
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setItemwiseresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonitemcategorywiseAnalysis?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&gstfilter=${encodedFilters.gstfillter}&asm=${asm}&page=${Itemwisepage}&limit=${Itemwiselimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setItemwiseresponse(response.statusText);
      const data = response?.data?.data;

      if (Array.isArray(data) && data.length > 0) {
        const formattedData = data.map((item) => ({
          name: item.item_category || "Unknown Category",
          period1: item.period1_itemcategory_total_sales || 0,
          period2: item.period2_itemcategory_total_sales || 0,
          growth:
            item.growth_percentage !== null
              ? `${item.growth_percentage.toFixed(2)}%`
              : "0%",
        }));
        const sortedData = formattedData.sort((a, b) => {
          const growthA = parseFloat(a.period2);
          const growthB = parseFloat(b.period2);
          return growthB - growthA;
        });
        if (Itemwisepage === 1) {
          setSections1(sortedData);
          setSortSections1(sortedData);
        } else {
          // setSections1((prevData) =>
          //   resetData ? sortedData : [...prevData, ...sortedData]
          // );
          // setSortSections1((prevData) =>
          //   resetData ? sortedData : [...prevData, ...sortedData]
          // );
          setSections1((prevData) => {
            const mergedData = resetData
              ? sortedData
              : [...prevData, ...sortedData];
            return mergedData.sort(
              (a, b) => parseFloat(b.period2) - parseFloat(a.period2)
            );
          });

          setSortSections1((prevData) => {
            const mergedData = resetData
              ? sortedData
              : [...prevData, ...sortedData];
            return mergedData.sort(
              (a, b) => parseFloat(b.period2) - parseFloat(a.period2)
            );
          });
        }
        if (sortedData.length < Itemwiselimit) {
          setHasMoreDataItemwise(false);
        } else {
          setHasMoreDataItemwise(true);
          setItemwisepage(page + 1);
        }
      } else {
        console.warn(
          "No more data to fetch or invalid API response:",
          response?.data
        );
        setHasMoreDataItemwise(false);
      }
    } catch (error) {
      console.error("Error fetching item-wise data:", error);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setItemCategoryLoading(false);
    }
  };

  const [ProductwiseLoading, setProductwiseLoading] = useState(false);
  const [Productwisepage, setProductwisepage] = useState(1);
  const [hasMoreDataProduct, setHasMoreDataProduct] = useState(true);
  const Productwiselimit = 50;
  const [Productwiseresponse, setProductwiseresponse] = useState("");
  const controllerRef10 = useRef(null);
  const fetchProductwise = async (page = 1, resetData = false) => {
    console.log("Fetching data...");
    setProductwiseLoading(true);
    if (controllerRef10.current) {
      controllerRef10.current.abort();
    }
    controllerRef10.current = new AbortController();
    const signal = controllerRef10.current.signal;

    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setProductwiseresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonproductwiseAnalysis?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&gstfilter=${encodedFilters.gstfillter}&asm=${asm}&page=${Productwisepage}&limit=${Productwiselimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setProductwiseresponse(response.statusText);
      console.log("API response:", response);

      const data = response?.data?.data;

      if (data && Array.isArray(data) && data.length > 0) {
        const formattedData = data.map((item) => ({
          name: item.product_group || "Unknown Product Group",
          period1: item.period1_product_total_sales || 0,
          period2: item.period2_product_total_sales || 0,
          growth:
            item.growth_percentage !== null
              ? `${item.growth_percentage}%`
              : "0%",
        }));
        const sortedData = formattedData.sort((a, b) => {
          const growthA = parseFloat(a.period2);
          const growthB = parseFloat(b.period2);
          return growthB - growthA;
        });
        setSections2((prev) =>
          resetData ? sortedData : [...prev, ...sortedData]
        );
        setSortSections2((prev) =>
          resetData ? sortedData : [...prev, ...sortedData]
        );

        if (sortedData.length > Productwiselimit) {
          setHasMoreDataProduct(false);
        } else {
          setHasMoreDataProduct(true);
          setProductwisepage(page + 1);
        }
      } else {
        setHasMoreDataProduct(false);
        console.log("No data available.");
      }
    } catch (error) {
      console.error("API fetch error:", error.response || error);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setProductwiseLoading(false);
    }
  };

  //citytable
  const [Citywiseloading, setCitywiseloading] = useState(false);
  const [Citywisepage, setCitywisepage] = useState(1);
  const [hasMoreDataCity, setHasMoreDataCity] = useState(true);
  const Citywiselimit = 30;
  const [Citywiseresponse, setCitywiseresponse] = useState("");
  const controllerRef11 = useRef(null);
  const fetchCitywise = async (page = 1, resetData = false) => {
    setCitywiseloading(true);
    console.log(Citywisepage, "pagecity.......................");
    if (controllerRef11.current) {
      controllerRef11.current.abort();
    }
    controllerRef11.current = new AbortController();
    const signal = controllerRef11.current.signal;
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setCitywiseresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisoncitywiseAnalysis?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&gstfilter=${encodedFilters.gstfillter}&asm=${asm}&page=${Citywisepage}&limit=${Citywiselimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setCitywiseresponse(response.statusText);
      const responseData = response?.data?.data;

      if (
        responseData &&
        Array.isArray(responseData) &&
        responseData.length > 0
      ) {
        const formattedData = responseData.map((item) => ({
          name: item.city || "Unknown City",
          period1: item.period1_city_total_sales || 0,
          period2: item.period2_city_total_sales || 0,
          growth:
            item.growth_percentage !== null
              ? `${parseFloat(item.growth_percentage).toFixed(2)}%`
              : "0%",
        }));
        const sortedData = formattedData.sort((a, b) => b.period2 - a.period2);
        if (Citywisepage === 1) {
          setCitySection(sortedData);
          setSortedCityBrand(sortedData);
        } else {
          setCitySection((prevData) =>
            resetData ? sortedData : [...prevData, ...sortedData]
          );
          setSortedCityBrand((prevData) =>
            resetData ? sortedData : [...prevData, ...sortedData]
          );
        }
        if (sortedData.length < Citywiselimit) {
          setHasMoreDataCity(false);
        }
      } else {
        setHasMoreDataCity(true);
        setCitywisepage(page + 1);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setCitywiseloading(false);
    }
  };

  //brandana
  // const [hasMoreData, setHasMoreData] = useState(true);

  const [Brandloading, setBrandloading] = useState(false);

  // const [finalsizebrand, setfinalsizebrand] = useState();
  const [hasMoreData, setHasMoreData] = useState(true);
  const BrandAnalysislimit = 50;
  const [BrandAnaresponse, setBrandAnaresponse] = useState("");
  const controllerRef12 = useRef(null);
  const fetchBrandAna = async (page = 1, resetData = false) => {
    setBrandloading(true);
    console.log(BrandAnalysispage, "pagebrand.......................");
    if (controllerRef12.current) {
      controllerRef12.current.abort();
    }
    controllerRef12.current = new AbortController();
    const signal = controllerRef12.current.signal;

    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setBrandAnaresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonbrandwiseAnalysis?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&gstfilter=${encodedFilters.gstfillter}&asm=${asm}&page=${BrandAnalysispage}&limit=${BrandAnalysislimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setBrandAnaresponse(response.statusText);
      console.log(response);
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const fetchedData = response.data.data;

        const formattedData = fetchedData.map((item) => ({
          name: item.brand_name || "Unknown Brand",
          period1: item.period1_brand_total_sales || 0,
          period2: item.period2_brand_total_sales || 0,
          growth:
            item.growth_percentage !== null
              ? `${item.growth_percentage.toFixed(2)}%`
              : "0%",
        }));
        const sortedData = formattedData.sort((a, b) => {
          const growthA = parseFloat(a.period2);
          const growthB = parseFloat(b.period2);
          return growthB - growthA;
        });
        if (BrandAnalysispage === 1) {
          setSections3(sortedData);
          setSortSections3(sortedData);
        } else {
          setSortSections3((prevData) =>
            resetData ? sortedData : [...prevData, ...sortedData]
          );
        }
        if (sortedData.length < BrandAnalysislimit) {
          setHasMoreData(false);
        } else {
          setHasMoreData(true);
          setBrandAnalysispage(page + 1);
        }
      } else {
        console.error(
          "Invalid API response or no data available:",
          response.data
        );
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setBrandloading(false);
    }
  };

  // setSections3((prevData) => [...prevData, ...formattedData]);
  //   setSortSections3((prevData) => [...prevData, ...formattedData]);
  //itemAnaly
  const [ItemCategoryLoading, setItemLoading] = useState(false);
  const [ItemAnalysispage, setItemAnalysispage] = useState(1);
  const [hasMoreDataItem, setHasMoreDataItem] = useState(true);
  const ItemAnalysislimit = 20;
  const [ItemAnasresponse, setItemAnasresponse] = useState("");
  const controllerRef13 = useRef(null);
  const fetchItemAnas = async (page = 1, resetData = false) => {
    setItemLoading(true);
    console.log(ItemAnalysispage, "itemana"); // Debugging log
    if (controllerRef13.current) {
      controllerRef13.current.abort();
    }
    controllerRef13.current = new AbortController();
    const signal = controllerRef13.current.signal;
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setItemAnasresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonitemwiseAnalysis?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&gstfilter=${encodedFilters.gstfillter}&asm=${asm}&page=${page}&limit=${ItemAnalysislimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setItemAnasresponse(response.statusText);
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const responseData = response.data.data;

        const formattedData = responseData.map((item) => ({
          name: item.item_description || "Unknown Category",
          period1: item.period1_item_total_sales || 0,
          period2: item.period2_item_total_sales || 0,
          growth:
            item.growth_percentage !== null
              ? `${parseFloat(item.growth_percentage).toFixed(2)}%`
              : "0%",
        }));
        const sortedData = formattedData.sort((a, b) => {
          const growthA = parseFloat(a.period2);
          const growthB = parseFloat(b.period2);
          return growthB - growthA;
        });
        if (page === 1) {
          setSortSections4(sortedData);
          setSections4(sortedData);
        } else {
          setSortSections4((prevData) =>
            resetData ? sortedData : [...prevData, ...sortedData]
          );
          setSections4((prevData) =>
            resetData ? sortedData : [...prevData, ...sortedData]
          );
        }

        if (sortedData.length < ItemAnalysislimit) {
          setHasMoreDataItem(false);
        } else {
          setHasMoreDataItem(true);
          setItemAnalysispage((prevPage) => prevPage + 1);
        }
      } else {
        console.error(
          "Invalid API response or no data available:",
          response.data
        );
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
      setHasMoreDataItem(false);
    } finally {
      setItemLoading(false);
    }
  };

  //price
  const [PriceBreakupLoading, setPriceBreakupLoading] = useState(false);
  const [PriceAnaresponse, setPriceAnaresponse] = useState("");
  const controllerRef14 = useRef(null);
  const fetchPriceAna = async () => {
    setPriceBreakupLoading(true);
    if (controllerRef14.current) {
      controllerRef14.current.abort();
    }
    controllerRef14.current = new AbortController();
    const signal = controllerRef14.current.signal;
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };
      setPriceAnaresponse("");
      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonpricewiseAnalysis?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&gstfilter=${encodedFilters.gstfillter}&asm=${asm}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      console.log(response, "price");
      setPriceAnaresponse(response.statusText);
      if (response?.data?.values) {
        const formattedData = Object.keys(response.data.values)
          .map((key) => {
            const item = response.data.values[key];

            return {
              name: key || "Unknown Category",
              period1: item.period1_price_total_sales || 0,
              period2: item.period2_price_total_sales || 0,
              growth: item.growth_percentage
                ? `${parseFloat(item.growth_percentage).toFixed(2)}%`
                : "0%",
            };
          })
          .filter(
            (item) =>
              !(
                item.name === "Null" &&
                item.period1 === 0 &&
                item.period2 === 0 &&
                item.growth === "0%"
              )
          );

        setPriceBreakupLoading(false);
        setSections5(formattedData);
        setSortSections5(formattedData);
      } else {
        console.error(
          "API response is invalid or data is missing:",
          response.data
        );
        setSections5([]);
        setSortSections5([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setPriceBreakupLoading(false);
    }
  };

  // option
  const [dropdownData, setDropdownData] = useState(() => {
    const storedData = localStorage.getItem("dropdownData");
    return storedData
      ? JSON.parse(storedData)
      : {
          brand_name: [],
          city: [],
          sale_type: [],
          demo_flag: [],
          item_category: [],
          store_name: [],
          product_group: [],
          section: [],
          model_no: [],
          item_description: [],
          PriceBreakup2: [],
          srn_flag: [],
          gstfillter: ["totalsales", "salesqty", "dis"],
        };
  });

  const [filters, setFilters] = useState({
    city: "",
    store_name: "",
    brand_name: "",
    product_group: "",
    section: "",
    model_no: "",
    srn_flag: "",
    demo_flag: "",
    gstfillter: "totalsales",
    PriceBreakup2: "",
    item_category: "",
    sale_type: "",
    item_description: "",
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const [refresh, setrefresh] = useState(false);

  const [isFiltersUpdatedreload, setIsFiltersUpdatedreload] = useState(false);

  const reloadRefresh = () => {
    setIsFiltersUpdatedreload(true);
    // setIsApplyDisabled(true);
    console.log(period1);
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const firstDayPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const firstDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const period1From = formatDate(firstDayPrevMonth);
    const period1To = formatDate(
      new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    );
    const period2From = formatDate(firstDayCurrentMonth);
    const period2To = formatDate(today);
    setPeriod1({ from: period1From, to: period1To });
    setPeriod2({ from: period2From, to: period2To });
    const datess = {
      from: period1From,
      to: period1To,
    };
    const dates1 = {
      from: period2From,
      to: period2To,
    };

    setSlider2({ start: 0, end: 100 });
    setSlider1({ start: 0, end: 100 });
    console.log("Resetting values");
    setProductwisepage(1);
    setBrandwisepage(1);
    setSectionpage(1);
    setItemwisepage(1);
    setCitywisepage(1);
    setItemAnalysispage(1);
    setBrandAnalysispage(1);
    setInitialFilters({
      filters: {
        city: "",
        store_name: "",
        brand_name: "",
        product_group: "",
        section: "",
        model_no: "",
        srn_flag: "",
        demo_flag: "",
        gstfillter: "totalsales",
        PriceBreakup2: "",
        item_category: "",
        sale_type: "",
        item_description: "",
        srn_flag: "",
      },
      period1: { from: period1From, to: period1To },
      period2: { from: period2From, to: period2To },
    });
    setSections4([]);
    setSortSections4([]);
    setSections3([]);
    setSortSections3([]);
    setSections5([]);
    setSortSections5([]);
    setSections1([]);
    setSortedSections([]);
    setSections([]);
    setBrandSection([]);
    setSortSections1([]);
    setSortedSectionsBrand([]);
    setSortedCityBrand([]);

    // Reset filters to default empty state
    const clearedFilters = {
      city: "",
      store_name: "",
      brand_name: "",
      product_group: "",
      section: "",
      model_no: "",
      srn_flag: "",
      demo_flag: "",
      gstfillter: "totalsales",
      PriceBreakup2: "",
      item_category: "",
      sale_type: "",
      item_description: "",
      srn_flag: "",
    };

    setFilters(clearedFilters);

    // Reset dropdowns and selections
    setDropdownData({
      brand_name: [],
      city: [],
      sale_type: [],
      demo_flag: [],
      item_category: [],
      store_name: [],
      product_group: [],
      section: [],
      model_no: [],
      item_description: [],
      PriceBreakup2: [],
      gstfillter: [],
      srn_flag: [],
    });

    setSelectedOptionsale("");
    setSelectedOptionsection("");
    setSelectedOptionproduct("");
    setSelectedOptionbrand("");
    setSelectedOptionitemn("");
    setSelectedOptionmodle("");
    setSelectedOptionbranch("");
    setSelectedOptioncity("");
    setSelectedOptiondemo("");
    setSelectedOptionprice("");
    setSelectedOptionitemc("");
    setBrandSection("");
    setSections("");
    setData1("");
    setData2("");
    setData3("");
    setData4("");
    setData5("");
    setData6("");

    setDropdownData((prevData) => ({
      ...prevData,
      gstfillter: [],
    }));

    // Set refresh flag to false

    setrefresh(false);
  };
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);
  const [isApplyDisabled1, setIsApplyDisabled1] = useState(false);
  useEffect(() => {
    if (isFiltersUpdatedreload) {
      // setInitialFilters("");
      console.log(BrandAnalysispage, "brandnamepageee1111");
      handleButtonClick();
      setProductwisepage(1);
      setBrandwisepage(1);
      setSectionpage(1);
      setItemwisepage(1);
      setCitywisepage(1);
      setItemAnalysispage(1);
      setBrandAnalysispage(1);
      setSections3([]);
      setSortSections3([]);
      setSections4([]);
      setSortSections4([]);
      setSections5([]);
      setSortSections5([]);
      setCitySection([]);
      setSortSections2([]);
      setBrandSection([]);
      setSortedSections([]);
      setSortedSectionsBrand([]);
      setSortedCityBrand([]);

      const queryString = new URLSearchParams(filters).toString();
      const baseUrl = "period_comparison/";
      const clearedUrl = `${baseUrl}?${queryString}`;
      console.log("API URL being called:", clearedUrl);
      liveData();
      fetchDropdownData();
      fetchSalesData();
      fetchDiscAmt();
      fetchSalesQty();
      fetchASP(period1.from, period1.to, period2.from, period2.to);
      fetchDis();
      fetchStoreCt();
      fetchData();
      fetchBrandwise(1);
      fetchCitywise(1);
      fetchSectionwise(1);
      fetchItemwise(1);
      fetchProductwise(1);
      fetchBrandAna(1);
      fetchItemAnas(1);
      fetchPriceAna();
      setIsFiltersUpdatedreload(false);
    }
  }, [filters, isFiltersUpdatedreload]);

  const [initialFilters, setInitialFilters] = useState({
    filters,
    period1,
    period2,
  });

  useEffect(() => {
    if (period1 !== "" && period1 !== "") {
      console.log("Initial Filters:", initialFilters);

      if (!initialFilters || !filters || !period1 || !period2) return;

      const filtersChanged = Object.keys(filters).some(
        (key) => filters[key] !== initialFilters.filters[key]
      );

      const periodsChanged =
        period1.from !== initialFilters.period1.from ||
        period1.to !== initialFilters.period1.to ||
        period2.from !== initialFilters.period2.from ||
        period2.to !== initialFilters.period2.to;

      const shouldDisable = !(filtersChanged || periodsChanged);

      console.log("Filters Changed:", filtersChanged);
      console.log("Periods Changed:", periodsChanged);
      console.log("Apply Button Disabled:", shouldDisable);

      setIsApplyDisabled((prev) => {
        if (prev !== shouldDisable) {
          console.log("Updating isApplyDisabled to:", shouldDisable);
          return shouldDisable;
        }
        return prev;
      });
    }
  }, [filters, period1, period2, initialFilters]);

  // const [initialFilters, setInitialFilters] = useState(filters);

  // useEffect(() => {
  //   console.log(initialFilters)
  //   const filtersChanged = Object.keys(filters).some(
  //     (key) => filters[key] !== initialFilters[key]
  //   )
  //   // || period.from !== dateRange.start_date || period.to !== dateRange.end_date;
  //   setIsApplyDisabled(!filtersChanged);
  // }, [filters]);

  const [isFiltersUpdated, setIsFiltersUpdated] = useState(false);
  const reloadWithFilters = () => {
    setrefresh(true);
    //setIsApplyDisabled(false)

    console.log("branditem");
    setSections4([]);
    setSortSections4([]);
    setSections3([]);
    setSortSections3([]);
    setSortSections5([]);
    setSections5([]);
    setCitySection([]);
    setSortSections2([]);
    setBrandSection([]);
    setSortedSections([]);
    setSortedSectionsBrand([]);
    setSortedCityBrand([]);
    setSortSections1([]);
    setSections4([]);
    setSortSections4([]);
    setProductwisepage(1);
    setBrandwisepage(1);
    setSectionpage(1);
    setItemwisepage(1);
    setCitywisepage(1);
    setItemAnalysispage(1);
    setBrandAnalysispage(1);

    setInitialFilters((prev) => ({ ...prev, filters, period1, period2 }));

    setIsFiltersUpdated(true);
    // setdatechange(true);
    // setdatechange1(true);
  };

  function getMonthNumber(monthName) {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    return months[monthName] || "01";
  }
  const [formatteddate, setLiveDate] = useState();
  const [formattedTime, setformattedTime] = useState();
  const liveData = async () => {
    try {
      const response = await axios.get(
        `sales_all_in_one_live/table_modificatio`
      );
      const LiveData = response?.data?.last_modified;
      if (LiveData) {
        const [dayOfWeek, day, month, year, time] = LiveData.split(" ");
        const formattedDate = `${day}/${getMonthNumber(month)}/${year}`;
        setLiveDate(formattedDate);
        setformattedTime(time);
        console.log("Date:", formattedDate);
        console.log("Time:", time);
      } else {
        console.error("Missing or invalid 'last_modified' data");
      }
    } catch (error) {
      console.error("Error fetching Live Data:", error);
    }
  };

  // useEffect(() => {
  //   if(datechange){
  //     console.log("useatechange");
  //     console.log(period3);
  //     fetchDropdownData();
  //     fetchSalesData();
  //     fetchDiscAmt();
  //     fetchSalesQty();
  //     fetchASP();
  //     fetchDis();
  //     fetchStoreCt();
  //     fetchBrandwise();
  //     fetchCitywise();
  //     fetchSectionwise();
  //     fetchItemwise();
  //     fetchProductwise();
  //     fetchBrandAna();
  //     fetchItemAnas();
  //     fetchPriceAna();
  //   }

  // }, [period3]);

  useEffect(() => {
    if (isFiltersUpdated) {
      console.log(BrandAnalysispage, "brandnamepageee1111");
      setProductwisepage(1);
      setBrandwisepage(1);
      setSectionpage(1);
      setItemwisepage(1);
      setCitywisepage(1);
      setItemAnalysispage(1);
      setBrandAnalysispage(1);
      setSections3([]);
      setSortSections3([]);
      setSections4([]);
      setSortSections4([]);
      setSections5([]);
      setSortSections5([]);
      setCitySection([]);
      setSortSections2([]);
      setBrandSection([]);
      setSortedSections([]);
      setSortedSectionsBrand([]);
      setSortedCityBrand([]);
      const queryString = new URLSearchParams(filters).toString();
      const baseUrl = "period_comparison/";
      const clearedUrl = `${baseUrl}?${queryString}`;
      console.log("API URL being called:", clearedUrl);
      liveData();
      fetchData();
      fetchDropdownData();
      fetchSalesData();
      fetchDiscAmt();
      fetchSalesQty();
      fetchASP(period1.from, period1.to, period2.from, period2.to);
      fetchDis();
      fetchStoreCt();
      fetchBrandwise(1);
      fetchCitywise(1);
      fetchSectionwise(1);
      fetchItemwise(1);
      fetchProductwise(1);
      fetchBrandAna(1);
      fetchItemAnas(1);
      fetchPriceAna();
      setIsApplyDisabled(true);
      setIsFiltersUpdated(false);
    }
  }, [filters, isFiltersUpdated]);

  const [isFiltersUpdatedapply, setIsFiltersUpdatedapply] = useState(false);
  const [DropdownDataresponse, setDropdownDataresponse] = useState("");
  const controllerRef15 = useRef(null);
  const fetchDropdownData = async () => {
    // if (!filters) {
    //   // console.error("filters is undefined");
    //   return;
    // }
    if (controllerRef15.current) {
      controllerRef15.current.abort();
    }
    controllerRef15.current = new AbortController();
    const signal = controllerRef15.current.signal;
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        city: cleanEncode(filters.city),
        store_name: cleanEncode(filters.store_name),
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfillter: cleanEncode(filters.gstfillter),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `period_comparison/periodComparisonallincolumn?period1_from=${period1.from}&period1_to=${period1.to}&period2_from=${period2.from}&period2_to=${period2.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&gstfilter=${encodedFilters.gstfillter}&asm=${asm}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setDropdownDataresponse(response.statusText);
      const data = response.data;
      console.log("dropdown", data);

      setDropdownData(data);
      localStorage.setItem("dropdownData", JSON.stringify(data));
      console.log("dropdown");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
    }
  };

  const allValues = sortedSectionsBrand
    .map((section) => [section.period1, section.period2])
    .flat();
  // const allValues = sortedSectionsBrand.map((section) => [
  //   section.period1,
  //   section.period2,
  // ]).flat();
  const globalMaxSales = Math.max(...allValues);

  function calculateDynamicOpacity(value, min, max) {
    if (max === min) return 1; // Avoid division by zero
    const normalized = (value - min) / (max - min);
    return 0.1 + normalized * 0.9; // Ensure opacity is between 0.1 and 1
  }

  const calculateOpacity = (value) => {
    const opacity = value / (globalMaxSales || 1);

    const adjustedOpacity = Math.max(0.1, Math.min(opacity, 0.8));
    return adjustedOpacity;
  };

  const calculateOpacity1 = (value) => {
    const opacity = value / (globalMaxSales || 1);

    const adjustedOpacity = Math.max(0.1, Math.min(opacity, 0.8));
    return adjustedOpacity;
  };

  const [isPreviousMonth, setIsPreviousMonth] = useState(true);

  const [slider1, setSlider1] = useState({ start: 0, end: 100 });
  const [slider2, setSlider2] = useState({ start: 0, end: 100 });

  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);
  const isDraggingRef = useRef(null);

  const percentageToDate = (percentage, isPreviousMonth = false) => {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;

    if (isPreviousMonth) {
      month -= 1;
      if (month === 0) {
        month = 12;
        year -= 1;
      }
    }

    const daysInMonth = new Date(year, month, 0).getDate(); // Get the total days in the month
    const day = Math.round((percentage / 100) * daysInMonth) + 1; // Map percentage to day
    const clampedDay = Math.min(Math.max(day, 1), daysInMonth); // Ensure day is in range

    return `${year}-${month.toString().padStart(2, "0")}-${clampedDay
      .toString()
      .padStart(2, "0")}`; // Format: YYYY-MM-DD
  };

  // Handle dragging for slider 1 (Period 1)
  const handleMouseDown =
    (sliderRef, setSlider, setPeriod, type, isPreviousMonth) => (e) => {
      e.preventDefault();
      console.log(isPreviousMonth);

      // Set the dragging context based on isPreviousMonth
      isDraggingRef.current = {
        type,
        sliderRef,
        setSlider,
        setPeriod,
        isPreviousMonth,
      };
      console.log(isDraggingRef.current);

      // Add event listeners for mouse move and mouse up
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      setIsApplyDisabled(false);
    };

  // Handle mouse move event
  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;

    const { type, sliderRef, setSlider, setPeriod, isPreviousMonth } =
      isDraggingRef.current;

    // Ensure sliderRef is set and accessible
    if (!sliderRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const offsetX = e.clientX - sliderRect.left;

    // Convert position to percentage
    let newPercentage = Math.min(
      Math.max((offsetX / sliderWidth) * 100, 0),
      100
    );
    const roundedPercentage = Math.round(newPercentage);

    // Update slider state based on the percentage
    setSlider((prev) => {
      if (type === "start" && roundedPercentage < prev.end) {
        const newFrom = percentageToDate(roundedPercentage, isPreviousMonth);
        setPeriod((prevPeriod) => ({ ...prevPeriod, from: newFrom }));
        return { ...prev, start: roundedPercentage };
      } else if (type === "end" && roundedPercentage > prev.start) {
        const newTo = percentageToDate(roundedPercentage, isPreviousMonth);
        setPeriod((prevPeriod) => ({ ...prevPeriod, to: newTo }));
        return { ...prev, end: roundedPercentage };
      }
      return prev;
    });
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    // Remove event listeners when mouse up is detected
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    isDraggingRef.current = null; // Clear dragging context
  };

  // Cleanup on mouse up
  // const handleMouseUp = () => {
  //   isDraggingRef.current = null;
  //   document.removeEventListener("mousemove", handleMouseMove);
  //   document.removeEventListener("mouseup", handleMouseUp);
  // };
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const formatNumber = (value) => {
    if (value !== undefined && value !== null) {
      return new Intl.NumberFormat("en-IN").format(value);
    }
    return "";
  };

  useEffect(() => {
    if (Array.isArray(dropdownData?.brand_name)) {
      // Ensure it's an array
      setOptions51(
        dropdownData.brand_name
          .filter((brand) => brand != null) // Remove null or undefined values
          .slice()
          .sort((a, b) => a?.localeCompare(b) || 0) // Use optional chaining for safe comparison
          .map((brand) => ({
            label: brand,
            value: brand,
          }))
      );
    } else {
      // Handle the case where dropdownData.brand_name is not an array
      setOptions51([]);
    }
  }, [dropdownData.brand_name]);

  // Filter model_no options based on selected brand_name
  useEffect(() => {
    if (selectedOption61 && selectedOption61.length > 0) {
      const selectedBrands = selectedOption61?.map((option) => option.value);

      // Ensure dropdownData.model_no is an array before filtering
      const filteredModelNo = Array.isArray(dropdownData.model_no)
        ? dropdownData.model_no.filter((model) =>
            selectedBrands.some(
              (brand) =>
                model && model.toLowerCase().includes(brand.toLowerCase()) // Check if model is not null or undefined
            )
          )
        : []; // Fallback to an empty array if it's not an array

      console.log(filteredModelNo, "filtermodelllllno");

      setOptions61(
        filteredModelNo
          .filter((model) => model != null)
          .slice()
          .sort((a, b) => a?.localeCompare(b) || 0)
          .map((model_no) => ({
            label: model_no,
            value: model_no,
          }))
      );

      // Ensure dropdownData.item_description is an array before filtering
      const filteredItem = Array.isArray(dropdownData.item_description)
        ? dropdownData.item_description.filter((section) =>
            selectedBrands.some(
              (brand) =>
                section && section.toLowerCase().includes(brand.toLowerCase()) // Check if section is not null or undefined
            )
          )
        : []; // Fallback to an empty array if it's not an array

      console.log(filteredItem, "filteritemmmmmm");

      setOptionsitem(
        filteredItem
          .filter((item) => item != null) // Remove null or undefined values
          .slice()
          .sort((a, b) => a?.localeCompare(b) || 0) // Use optional chaining for safe comparison
          .map((item_description) => ({
            label: item_description,
            value: item_description,
          }))
      );
    } else {
      // If no brand is selected, reset to show all model_no options
      setOptions61(
        Array.isArray(dropdownData.model_no)
          ? dropdownData.model_no
              .filter((model) => model != null) // Remove null or undefined values
              .slice()
              .sort((a, b) => a?.localeCompare(b) || 0) // Use optional chaining for safe comparison
              .map((model_no) => ({
                label: model_no,
                value: model_no,
              }))
          : [] // Fallback to empty array if model_no is not available
      );

      setOptionsitem(
        Array.isArray(dropdownData.item_description)
          ? dropdownData.item_description
              .filter((item) => item != null) // Remove null or undefined values
              .slice()
              .sort((a, b) => a?.localeCompare(b) || 0) // Use optional chaining for safe comparison
              .map((item_description) => ({
                label: item_description,
                value: item_description,
              }))
          : [] // Fallback to empty array if item_description is not available
      );
    }
  }, [selectedOption61, dropdownData.model_no, dropdownData.item_description]);

  // Handle brand_name change
  const handleBrandNameChange1 = (selectedOptions) => {
    setSelectedOption31(selectedOptions);

    if (selectedOptions) {
      const selectedValues = selectedOptions
        .map((option) => option.value)
        .join(",");
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          brand_name: selectedValues,
        };
        fetchDropdownData(updatedFilters);
        return updatedFilters;
      });
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          brand_name: "",
        };
        fetchDropdownData(updatedFilters);
        return updatedFilters;
      });
    }
  };

  // Handle model_no change
  const handleModelNoChange1 = (selectedOptions) => {
    console.log("modalno");
    setSelectedOption61(selectedOptions);

    if (selectedOptions) {
      const selectedValues = selectedOptions
        .map((option) => option.value)
        .join(",");

      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          model_no: selectedValues,
        };
        fetchDropdownData(updatedFilters);
        return updatedFilters;
      });
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          model_no: "",
        };
        fetchDropdownData(updatedFilters);
        return updatedFilters;
      });
    }
  };

  const handleitemdeschange = (selectedOptions) => {
    console.log("item");
    setSelectedOptionitem(selectedOptions);

    if (selectedOptions) {
      const selectedValues = selectedOptions
        .map((option) => option.value)
        .join(",");

      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          item_description: selectedValues,
        };
        fetchDropdownData(updatedFilters);
        return updatedFilters;
      });
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          item_description: "",
        };
        fetchDropdownData(updatedFilters);
        return updatedFilters;
      });
    }
  };

  const [selectedOptionsale, setSelectedOptionsale] = useState(
    Array.isArray(dropdownData?.filters?.sale_type) &&
      dropdownData.filters.sale_type.length > 2
      ? [
          {
            label: dropdownData.filters.sale_type[2],
            value: dropdownData.filters.sale_type[2],
          },
        ]
      : null
  );

  const dropdownValuesales = selectedOptionsale || filters.sale_type;

  const optionssale = (dropdownData?.sale_type || [])
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));

  const handlesalechange = (selectedOptions) => {
    setSelectedOptionsale(selectedOptions);

    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        sale_type: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        sale_type: "", // Clear the `sale_type` filter
      }));
    }
  };

  const [selectedOptionsection, setSelectedOptionsection] = useState(
    Array.isArray(dropdownData?.filters?.section) &&
      dropdownData.filters.section.length > 2
      ? [
          {
            label: dropdownData.filters.section[2],
            value: dropdownData.filters.section[2],
          },
        ]
      : null
  );

  const dropdownValuesection = selectedOptionsection || filters.section;

  const optionssection = Array.isArray(dropdownData?.section)
    ? dropdownData.section
        .slice() // Copy the array to avoid mutation
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : []; // Return an empty array if section is not available

  const handlesectionchange = (selectedOptions) => {
    setSelectedOptionsection(selectedOptions);

    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        section: selectedValuesString, // Update the `section` filter
      }));
    } else {
      // If no options are selected, clear the section filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        section: "", // Clear the `section` filter
      }));
    }
  };

  const [selectedOptionitemc, setSelectedOptionitemc] = useState(
    dropdownData?.filters?.item_category?.length > 2
      ? [
          {
            label: dropdownData.item_category[2],
            value: dropdownData.item_category[2],
          },
        ]
      : null
  );

  const dropdownValueitemc = selectedOptionitemc || filters.item_category;

  // Safely filter out null or undefined values before sorting and mapping
  const optionsitemc =
    dropdownData?.item_category
      ?.filter((item) => item != null) // Remove null or undefined values
      .slice() // Create a copy to avoid mutating the original array
      .sort((a, b) => (a && b ? a.localeCompare(b) : 0)) // Safe comparison
      .map((store) => ({
        label: store,
        value: store,
      })) || [];

  // Handle the change for item category selection
  const handleitemcchange = (selectedOptions) => {
    setSelectedOptionitemc(selectedOptions);
    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_category: selectedValuesString, // Update the `item_category` filter
      }));
    } else {
      // If no options are selected, clear the `item_category` filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_category: "", // Clear the `item_category` filter
      }));
    }
  };

  const [selectedOptionproduct, setSelectedOptionproduct] = useState(
    dropdownData?.filters?.product_group?.length > 2
      ? [
          {
            label: dropdownData.product_group[2],
            value: dropdownData.product_group[2],
          },
        ]
      : null
  );
  const dropdownValueproduct = selectedOptionproduct || filters.product_group;
  const optionsproduct = Array.isArray(dropdownData?.product_group)
    ? dropdownData.product_group
        .slice() // Create a copy to avoid mutating the original array
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : [];
  const handleproductchange = (selectedOptions) => {
    setSelectedOptionproduct(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        product_group: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        product_group: "", // Clear the `sale_type` filter
      }));
    }
  };

  const [selectedOptionbrand, setSelectedOptionbrand] = useState(
    dropdownData?.filters?.brand_name?.length > 2
      ? [
          {
            label: dropdownData.brand_name[2],
            value: dropdownData.brand_name[2],
          },
        ]
      : null
  );
  const dropdownValuebrandname = selectedOptionbrand || filters.brand_name;
  const optionsbrand = Array.isArray(dropdownData?.brand_name)
    ? dropdownData.brand_name
        .slice() // Create a copy to avoid mutating the original array
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : [];
  const handlebrandchange = (selectedOptions) => {
    setSelectedOptionbrand(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand_name: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand_name: "", // Clear the `sale_type` filter
      }));
    }
  };

  const [selectedOptionitemn, setSelectedOptionitemn] = useState(
    dropdownData?.filters?.item_description?.length > 2
      ? [
          {
            label: dropdownData.item_description[2],
            value: dropdownData.item_description[2],
          },
        ]
      : null
  );
  const dropdownValueitem = selectedOptionitemn || filters.item_description;
  const optionsitemn = Array.isArray(dropdownData?.item_description)
    ? dropdownData.item_description
        .slice() // Create a copy to avoid mutating the original array
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : [];
  const handleitemnchange = (selectedOptions) => {
    setSelectedOptionitemn(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_description: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_description: "", // Clear the `sale_type` filter
      }));
    }
  };

  const [selectedOptionmodel, setSelectedOptionmodle] = useState(
    dropdownData?.filters?.model_no?.length > 2
      ? [
          {
            label: dropdownData.model_no[2],
            value: dropdownData.model_no[2],
          },
        ]
      : null
  );
  const dropdownValuemodelno = selectedOptionmodel || filters.model_no;
  // const optionsmodel = Array.isArray(dropdownData?.model_no)
  //   ? dropdownData.model_no
  //       .slice()
  //       .sort((a, b) => a.localeCompare(b))
  //       .map((store) => ({
  //         label: store,
  //         value: store,
  //       }))
  //   : [];
  const optionsmodel = Array.isArray(dropdownData?.model_no)
    ? dropdownData.model_no
        .filter((item) => item !== null && item !== undefined)
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : [];
  const handlemodelchange = (selectedOptions) => {
    setSelectedOptionmodle(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        model_no: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        model_no: "", // Clear the `sale_type` filter
      }));
    }
  };

  const [selectedOptionbranch, setSelectedOptionbranch] = useState(
    dropdownData?.filters?.store_name?.length > 2
      ? [
          {
            label: dropdownData.store_name[2],
            value: dropdownData.store_name[2],
          },
        ]
      : null
  );
  const dropdownValuebranch = selectedOptionbranch || filters.store_name;
  const optionsbranch = Array.isArray(dropdownData?.store_name)
    ? dropdownData.store_name
        .slice() // Create a copy to avoid mutating the original array
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : []; // Return an empty array if store_name is undefined

  const handlebranchchange = (selectedOptions) => {
    setSelectedOptionbranch(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        store_name: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        store_name: "", // Clear the `sale_type` filter
      }));
    }
  };

  const [selectedOptioncity, setSelectedOptioncity] = useState(
    dropdownData?.filters?.city?.length > 2
      ? [
          {
            label: dropdownData.city[2],
            value: dropdownData.city[2],
          },
        ]
      : null
  );
  const dropdownValuecity = selectedOptioncity || filters.city;
  const optionscity = Array.isArray(dropdownData?.city)
    ? dropdownData.city
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : [];

  const handlecitychange = (selectedOptions) => {
    setSelectedOptioncity(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        city: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        city: "", // Clear the `sale_type` filter
      }));
    }
  };

  const [selectedOptiondemo, setSelectedOptiondemo] = useState(
    dropdownData?.filters?.demo_flag?.length > 2
      ? [
          {
            label: dropdownData.demo_flag[2],
            value: dropdownData.demo_flag[2],
          },
        ]
      : null
  );
  const dropdownValuedemo = selectedOptiondemo || filters.demo_flag;
  const optionsdemo = Array.isArray(dropdownData?.demo_flag)
    ? dropdownData.demo_flag
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : [];

  const handledemochange = (selectedOptions) => {
    setSelectedOptiondemo(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        demo_flag: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        demo_flag: "",
      }));
    }
  };
  const [selectedOptionsrn, setSelectedOptionsrn] = useState(
    dropdownData?.filters?.srn_flag?.length > 2
      ? [
          {
            label: dropdownData.srn_flag[2],
            value: dropdownData.srn_flag[2],
          },
        ]
      : null
  );
  const dropdownValuesrnflag = selectedOptionsrn || filters.srn_flag;
  const optionssrnflag = Array.isArray(dropdownData?.srn_flag)
    ? dropdownData.srn_flag
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : [];

  const handlesrnflagchange = (selectedOptions) => {
    setSelectedOptionsrn(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        srn_flag: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        srn_flag: "",
      }));
    }
  };
  const [selectedOptionprice, setSelectedOptionprice] = useState([]);

  const dropdownValueprice = selectedOptionprice || filters.PriceBreakup2;

  const optionsprice = [
    { label: "0-5000", value: "0-5000" },
    { label: "5001-10000", value: "5001-10000" },
    { label: "10001-15000", value: "10001-15000" },
    { label: "15001-20000", value: "15001-20000" },
    { label: "20001-25000", value: "20001-25000" },
    { label: "25001-50000", value: "25001-50000" },
    { label: "50001-70000", value: "50001-70000" },
    { label: "70001-100000", value: "70001-100000" },
  ];

  const handlepriceChange = (selectedOptions) => {
    setSelectedOptionprice(selectedOptions);

    console.log("Selected item options:", selectedOptions);

    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        PriceBreakup2: selectedValuesString, // Update the `price_breakup` filter
      }));
    } else {
      // If no options are selected, clear the price_breakup filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        PriceBreakup2: "", // Clear the `price_breakup` filter
      }));
    }
  };
  const closePopup = () => setError("");
  return (
    <>
      <div className="p-1 ">
        <div
          className="p-4 rounded-lg dark:border-gray-500 overflow-x-auto mt-14"
          style={{
            padding: "10px",
          }}
        >
          <div
            className="p-4 rounded-lg shadow bg-white"
            style={{
              // width: 1264,
              // height: 1951,
              padding: "10px",
            }}
          >
            <div
              className="space-y-6"
              style={{
                backgroundColor: "#1C3644",
                // width: 1212,
                height: 50,
                justifyContent: "center",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-between px-4 py-2  text-white"
                style={{
                  backgroundColor: "#1C3644",
                }}
              >
                {/* Left Side */}
                <div className="d-flex align-items-center gap-3">
                  {refresh && (
                    <div
                      // style={{ backgroundColor: "#fff", color: "#000", padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                      // className="apply-filter-button"
                      // type="button"

                      style={{
                        backgroundColor: "#5de1cf",
                        color: "#000",
                        padding: "8px",
                        borderRadius: "16px",
                        cursor: "pointer",
                      }}
                      onClick={reloadRefresh}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-arrow-clockwise"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                        />
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                      </svg>
                    </div>
                  )}

                  <button
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    style={{
                      backgroundColor: "white",
                      width: "116",
                      height: "31",
                      clipPath:
                        "polygon(-3% 5%, 88% 4%, 101% 56%, 88% 97%, -5% 95%, 11% 57%)",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      padding: "7px",
                      color: "black",

                      opacity: isApplyDisabled ? 0.5 : 1,
                      cursor: isApplyDisabled ? "not-allowed" : "pointer",
                    }}
                    onClick={
                      !isApplyDisabled && !isApplyDisabled1
                        ? reloadWithFilters
                        : null
                    }
                  >
                    <span
                      className="me-2"
                      style={{
                        backgroundColor: "white",
                        fontSize: 10,
                        fontFamily: "Inter",
                        color: "black",
                      }}
                    ></span>{" "}
                    Apply Filter
                  </button>
                  <button
                    className={`btn btn-sm ${
                      activeButton === "Custom" ? "btn-light" : "btn-secondary"
                    }`}
                    onClick={handleCustomClick}
                  >
                    Custom
                  </button>
                  <button
                    className={`btn btn-sm ${
                      activeButton === "LMTD" ? "btn-light" : "btn-secondary"
                    }`}
                    onClick={handleButtonClick}
                  >
                    LMTD vs MTD
                  </button>
                  <button
                    className={`btn btn-sm ${
                      activeButton === "LYTD" ? "btn-light" : "btn-secondary"
                    }`}
                    onClick={handleButtonClick1}
                  >
                    LYTD vs YTD
                  </button>
                </div>

                {/* Center Title */}
                <h5
                  className="m-0"
                  style={{
                    alignItems: "center",
                    color: "white",
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: "Inter",
                  }}
                >
                  Period Comparison
                </h5>

                {/* <select
                  style={{
                    width: "180px",
                    borderRadius: "9px",
                    background: "#1C3644",
                  }}
                  name="gstfillter"
                  value={filters.gstfillter}
                  onChange={handleFilterChange}
                  className="px-2 py-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                >
                  <option value="totalsales">TOTAL SALES</option>
                  {[
                    // { key: "totalsales", value: "totalsales" },
                    { key: "salesqty", value: "salesqty" },
                    { key: "dis", value: "dis" },
                  ].map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.key}
                    </option>
                  ))}
                </select> */}

                {/* Right Side */}
                {/* Right Side */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "399px",
                    justifyContent: "flex-end",
                    gap: "59px",
                  }}
                >
                  <select
                    style={{
                      width: "180px",
                      borderRadius: "9px",
                      background: "#1C3644",
                    }}
                    name="gstfillter"
                    value={filters.gstfillter}
                    onChange={handleFilterChange}
                    className="px-2 py-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                  >
                    <option value="totalsales">TOTAL SALES</option>
                    {[
                      // { key: "totalsales", value: "totalsales" },
                      { key: "salesqty", value: "salesqty" },
                      { key: "dis", value: "dis" },
                    ].map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.key}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      // alignItems: "center",

                      display: "flex",
                      flexDirection: "column",
                      alignItems: "baseline",
                      // height: 100,
                    }}
                  >
                    <span
                      className="text-light"
                      style={{
                        alignItems: "center",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      Refresh Date
                    </span>
                    <span
                      className="ms-2 text-white"
                      style={{
                        alignItems: "center",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      {formatteddate}
                      <br></br>
                      {formattedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* period first row */}
            <div className="container my-4">
              <div
                className="row"
                style={{
                  //   alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                {/* Period 1 */}
                <div
                  className="col-md-2"
                  style={{
                    // height: "114px",
                    width: "263px",
                    // marginTop:
                  }}
                >
                  <label
                    className="form-label"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                      margin: "0px",
                    }}
                  >
                    Period 1
                  </label>
                  <div className="d-flex flex-row gap-2">
                    {/* <TextInput
                      id="from"
                      type="date"
                      required
                      value={
                        clickedButton === "Custom" ? period1.from : period1.from
                      }
                      onChange={(e) => handlePeriodChange(e, setPeriod1)}
                      disabled={isDisabled}
                      style={{
                        width: 120,
                        height: 31,
                        backgroundColor: isDisabled ? "#E9ECEF" : "#F1F1F1",
                      }}
                    />
                    <TextInput
                      id="to" // Unique id for the 'to' date input
                      type="date"
                      required
                      value={
                        clickedButton === "Custom" ? period1.to : period1.to
                      }
                      onChange={(e) => handlePeriodChange(e, setPeriod1)}
                      disabled={isDisabled}
                      style={{
                        width: 120,
                        height: 31,
                        backgroundColor: "#F1F1F1",
                      }}
                    /> */}
                    {/* <TextInput
                      id="from"
                      type="date"
                      required
                      value={period1.from}
                      onChange={(e) => handlePeriodChange(e, setPeriod1)}
                      style={{
                        width: 120,
                        height: 31,
                        backgroundColor: "#F1F1F1",
                      }}
                    />
                    <TextInput
                      id="to"
                      type="date"
                      required
                      value={period1.to}
                      onChange={(e) => handlePeriodChange(e, setPeriod1)}
                      style={{
                        width: 120,
                        height: 31,
                        backgroundColor: "#F1F1F1",
                      }}
                    /> */}
                    <TextInput
                      id="from"
                      type="date"
                      value={period1.from}
                      style={{
                        width: 120,
                        height: 31,
                        backgroundColor: "#F1F1F1",
                      }}
                      onChange={(e) => handlePeriodChange(e, setPeriod1)}
                      min={tempPeriod1.from}
                      max={tempPeriod1.to}
                    />

                    <TextInput
                      id="to"
                      type="date"
                      value={period1.to}
                      style={{
                        width: 120,
                        height: 31,
                        backgroundColor: "#F1F1F1",
                      }}
                      min={tempPeriod1.from}
                      max={tempPeriod1.to}
                      onChange={(e) => handlePeriodChange(e, setPeriod1)}
                    />
                  </div>
                  {activeButton !== "Custom" && (
                    <ReactSlider
                      className="horizontal-slider h-2 bg-gray-300 rounded-full my-8"
                      thumbClassName="thumb"
                      trackClassName="track"
                      min={0}
                      max={getDaysOffset(maxDate)}
                      value={sliderValues}
                      onChange={handleSliderChange}
                      pearling
                      minDistance={1} // Prevents overlap
                      style={{ width: "100px" }}
                      disabled={activeButton === "Custom"}
                    />
                  )}
                  <style>
                    {`
          .horizontal-slider {
            width: 100%;
            height: 8px;
            background: #ddd;
            border-radius: 4px;
            position: relative;
          }
          .track {
            background: #9E9E9E;
            height: 8px;
            border-radius: 4px;
          }
          .thumb {
            width: 20px;
            height: 20px;
                background: white;
    border: #9E9E9E 2px solid;
            border-radius: 50%;
            cursor: grab;
            top: -7px;
            position: absolute;
          }
        `}
                  </style>
                  {/* {showSlider && (
                    <div
                      ref={slider1Ref}
                      className="relative h-2 bg-gray-300 rounded-full my-8"
                    // style={{ width: "100px" }}

                    >
                      <div
                        className="absolute h-full bg-gray-500 rounded-full"
                        style={{
                          left: `${slider1.start}%`,
                          width: `${slider1.end - slider1.start}%`,
                        }}

                      />
                      <div
                        className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full cursor-pointer"
                        style={{
                          left: `${slider1.start}%`,
                          transform: "translate(-50%, -50%)",
                          
                        }}
                        onMouseDown={handleMouseDown(
                          slider1Ref,
                          setSlider1,
                          setPeriod1||setPeriod3,
                          "start",
                          isPreviousMonth
                        )}

                        min={period1.from}
                        max={period1.to}
                      />
                      <div
                        className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full cursor-pointer"
                        style={{
                          left: `${slider1.end}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onMouseDown={handleMouseDown(
                          slider1Ref,
                          setSlider1,
                          setPeriod1||setPeriod3,
                          "end",
                          isPreviousMonth
                        )}
                      />
                    </div>
                  )} */}

                  {/* //close */}
                </div>

                {/* Period 2 */}
                <div
                  className="col-md-2"
                  style={{ height: "1px", width: "262px" }}
                >
                  <label
                    className="form-label"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                      margin: "0px",
                    }}
                  >
                    Period 2
                  </label>
                  <div className="d-flex flex-row gap-2">
                    {/* <TextInput
                      id="from"
                      type="date"
                      required
                      value={period2.from}
                      onChange={(e) => handlePeriodChange(e, setPeriod2)}
                      style={{
                        width: 120,
                        height: 31,
                        backgroundColor: "#F1F1F1",
                      }}
                      
                    /> */}
                    <TextInput
                      id="from"
                      type="date"
                      value={
                        clickedButton === "Custom" ? period2.from : period2.from
                        // clickedButton === "Custom"
                        //   ? (datechange1 ? period4.from : period2.from)
                        //   : period2.from
                      }
                      min={TempPeriod2.from}
                      max={TempPeriod2.to}
                      style={{
                        width: 120,
                        height: 31,
                        backgroundColor: "#F1F1F1",
                      }}
                      // disabled={isDisabled}
                      onChange={(e) => handlePeriodChange(e, setPeriod2)}
                      // onChange={(e) => handlePeriodChange1(e, datechange, clickedButton === "Custom" ? setPeriod4 : setPeriod2)}
                    />
                    <TextInput
                      id="to"
                      type="date"
                      value={
                        clickedButton === "Custom" ? period2.to : period2.to
                      }
                      min={TempPeriod2.from}
                      max={TempPeriod2.to}
                      style={{
                        width: 120,
                        height: 31,
                        backgroundColor: "#F1F1F1",
                      }}
                      // disabled={isDisabled}
                      onChange={(e) => handlePeriodChange(e, setPeriod2)}
                      // onChange={(e) => handlePeriodChange1(e, datechange, clickedButton === "Custom" ? setPeriod4 : setPeriod2)}
                    />
                  </div>

                  {activeButton !== "Custom" && (
                    <ReactSlider
                      className="horizontal-slider h-2 bg-gray-300 rounded-full my-8"
                      thumbClassName="thumb"
                      trackClassName="track"
                      min={getDaysOffset1(minDate1)}
                      max={getDaysOffset1(maxDate1)}
                      value={sliderValues1}
                      onChange={handleSliderChange1}
                      pearling
                      minDistance={1} // Prevents overlap
                      style={{ width: "100px" }}
                    />
                  )}
                  <style></style>
                  {/* {showSlider && (
                    <div
                      ref={slider2Ref}
                      className="relative h-2 bg-gray-300 rounded-full my-8"
                    >
                      <div
                        className="absolute h-full bg-gray-500 rounded-full"
                        style={{
                          left: `${slider2.start}%`,
                          width: `${slider2.end - slider2.start}%`,
                        }}
                      />
                      <div
                        className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full cursor-pointer"
                        style={{
                          left: `${slider2.start}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onMouseDown={handleMouseDown(
                          slider2Ref,
                          setSlider2,
                          setPeriod2,
                          "start",
                          false
                        )}
                      />
                      <div
                        className="absolute w-5 h-5 bg-white border-2 border-gray-500 rounded-full cursor-pointer"
                        style={{
                          left: `${slider2.end}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onMouseDown={handleMouseDown(
                          slider2Ref,
                          setSlider2,
                          setPeriod2,
                          "end",
                          false
                        )}
                      />
                    </div>
                  )} */}
                </div>

                {/* <div
                  className="col-md-2"
                  style={{
                    marginLeft: "-43px",
                    width: "133px",
                  }}
                >
                  <label
                    className="form-label"
                    style={{
                      color: "white",
                    }}
                  > */}
                {/* Period 2 */}
                {/* </label>{" "} */}
                {/* <TextInput
                    id="to"
                    type="date"
                    required
                    value={period2.to}
                    onChange={(e) => handlePeriodChange(e, setPeriod2)}
                    style={{
                      width: 120,
                      height: 31,
                      backgroundColor: "#F1F1F1",
                    }}
                    
                  /> */}
                {/* <TextInput
                    id="to"
                    type="date"
                    value={clickedButton === "Custom" ? period2.to : period2.to}
                    style={{
                      width: 120,
                      height: 31,
                      backgroundColor: "#F1F1F1",
                    }}
                    disabled={isDisabled}
                    onChange={(e) => handlePeriodChange(e, setPeriod2)}
                  /> */}
                {/* </div> */}
                {/* Dropdown Filters */}
                {/* <div className="col-md-2">{renderDropdown("Sale Type")}</div> */}
                <div className="col-md-2">
                  <label
                    htmlFor="Sales Type"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Sales Type
                  </label>
                  {/* <select
                        name="sale_type"
                    value={filters.sale_type}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option value="">ALL</option>
                    {dropdownData.sale_type?.map((sale_type, index) => (
                      <option key={index} value={sale_type}>
                        {sale_type}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionssale} // Dropdown options
                    value={dropdownValuesales} // Controlled value
                    onChange={handlesalechange} // Handle selection changes
                    isMulti // Enable multi-select
                    defaultValue={
                      Array.isArray(dropdownData?.sale_type) &&
                      dropdownData.sale_type.length > 2
                        ? [
                            {
                              label: dropdownData.sale_type[2],
                              value: dropdownData.sale_type[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholdersale("Search...")} // Change placeholder on focus
                    onBlur={() => setPlaceholdersale("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholdersale}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Sections
                  </label>
                  {/* <select
                  name="section"
                    value={filters.section}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option value="">All</option>
                    {dropdownData.section?.map((section, index) => (
                      <option key={index} value={section}>
                        {section}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionssection} // Dropdown options
                    value={dropdownValuesection} // Controlled value
                    onChange={handlesectionchange} // Handle selection changes
                    isMulti // Enable multi-select
                    defaultValue={
                      Array.isArray(dropdownData?.section) &&
                      dropdownData.section.length > 2
                        ? [
                            {
                              label: dropdownData.section[2],
                              value: dropdownData.section[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderselection("Search...")} // Change placeholder on focus
                    onBlur={() => setPlaceholderselection("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderselection}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 11,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Item Category
                  </label>
                  {/* <select
                       name="item_category"
                    value={filters.item_category}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option
                      value=""
                      style={{
                        fontFamily: "Inter",
                        fontSize: 11,
                        fontColor: "bold",
                      }}
                    >
                      ALL
                    </option>
                    {dropdownData.item_category?.map((item_category, index) => (
                      <option key={index} value={item_category}>
                        {item_category}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionsitemc}
                    value={dropdownValueitemc}
                    onChange={handleitemcchange}
                    isMulti
                    defaultValue={
                      (dropdownData?.item_category || []).length > 2
                        ? [
                            {
                              label: dropdownData.item_category[2],
                              value: dropdownData.item_category[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderitemc("Search...")}
                    onBlur={() => setPlaceholderitemc("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderitemc}
                  />
                </div>
                <div className="col-md-2 ">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Product
                  </label>
                  {/* <select
                       name="product_group"
                    value={filters.product_group}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option
                      value=""
                      style={{
                        fontFamily: "Inter",
                        fontSize: 11,
                        fontColor: "bold",
                      }}
                    >
                      All
                    </option>
                    {dropdownData.product_group?.map((product_group, index) => (
                      <option key={index} value={product_group}>
                        {product_group}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionsproduct} // Dropdown options
                    value={dropdownValueproduct} // Controlled value
                    onChange={handleproductchange} // Handle selection changes
                    isMulti // Enable multi-select
                    defaultValue={
                      Array.isArray(dropdownData?.product_group) &&
                      dropdownData.product_group.length > 2
                        ? [
                            {
                              label: dropdownData.product_group[2],
                              value: dropdownData.product_group[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderproduct("Search...")} // Change placeholder on focus
                    onBlur={() => setPlaceholderproduct("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderproduct}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Brand
                  </label>
                  {/* <select
                name="brand_name"
                    value={filters.brand_name}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option
                      value=""
                      style={{
                        fontFamily: "Inter",
                        fontSize: 11,
                        fontColor: "bold",
                      }}
                    >
                      ALL
                    </option>
                    {dropdownData.brand_name?.map((brand_name, index) => (
                      <option key={index} value={brand_name}>
                        {brand_name}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionsbrand} // Dropdown options
                    value={dropdownValuebrandname} // Controlled value
                    onChange={handlebrandchange} // Handle selection changes
                    isMulti // Enable multi-select
                    defaultValue={
                      Array.isArray(dropdownData?.brand_name) &&
                      dropdownData.brand_name.length > 2
                        ? [
                            {
                              label: dropdownData.brand_name[2],
                              value: dropdownData.brand_name[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderbrand("Search...")} // Change placeholder on focus
                    onBlur={() => setPlaceholderbrand("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderbrand}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Item Name
                  </label>
                  {/* <select
                    name="item_description"
                    value={filters.item_description}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option
                      value=""
                      style={{
                        fontFamily: "Inter",
                        fontSize: 11,
                        fontColor: "bold",
                      }}
                    >
                      ALL
                    </option>
                    {dropdownData.item_description?.map(
                      (item_description, index) => (
                        <option key={index} value={item_description}>
                          {item_description}
                        </option>
                      )
                    )}
                  </select> */}
                  <Select
                    options={optionsitemn}
                    value={dropdownValueitem}
                    onChange={handleitemnchange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData?.item_description) &&
                      dropdownData.item_description.length > 2
                        ? [
                            {
                              label: dropdownData.item_description[2],
                              value: dropdownData.item_description[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderitemn("Search...")}
                    onBlur={() => setPlaceholderitemn("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderitemn}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Model No
                  </label>
                  {/* <select
                       name="model_no"
                    value={filters.model_no}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option
                      value=""
                      style={{
                        fontFamily: "Inter",
                        fontSize: 11,
                        fontColor: "bold",
                      }}
                    >
                      ALL
                    </option>
                    {dropdownData.model_no?.map((model_no, index) => (
                      <option key={index} value={model_no}>
                        {model_no}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionsmodel}
                    value={dropdownValuemodelno}
                    onChange={handlemodelchange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData?.model_no) &&
                      dropdownData.model_no.length > 2
                        ? [
                            {
                              label: dropdownData.model_no[2],
                              value: dropdownData.model_no[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholdermodle("Search...")}
                    onBlur={() => setPlaceholdermodle("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholdermodle}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Branch
                  </label>
                  {/* <select
                  name="store_name"
                    value={filters.store_name}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option
                      value=""
                      style={{
                        fontFamily: "Inter",
                        fontSize: 11,
                        fontColor: "bold",
                      }}
                    >
                      ALL
                    </option>
                    {dropdownData.store_name?.map((store_name, index) => (
                      <option key={index} value={store_name}>
                        {store_name}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionsbranch}
                    value={dropdownValuebranch}
                    onChange={handlebranchchange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData?.store_name) &&
                      dropdownData.store_name.length > 2
                        ? [
                            {
                              label: dropdownData.store_name[2],
                              value: dropdownData.store_name[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderbranch("Search...")}
                    onBlur={() => setPlaceholderbranch("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderbranch}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    City
                  </label>
                  {/* <select
                  name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option
                      value=""
                      style={{
                        fontFamily: "Inter",
                        fontSize: 11,
                        fontColor: "bold",
                      }}
                    >
                      ALL
                    </option>
                    {dropdownData.city?.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionscity} // Dropdown options
                    value={dropdownValuecity} // Controlled value
                    onChange={handlecitychange} // Handle selection changes
                    isMulti // Enable multi-select
                    defaultValue={
                      Array.isArray(dropdownData?.city) &&
                      dropdownData.city.length > 2
                        ? [
                            {
                              label: dropdownData.city[2],
                              value: dropdownData.city[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholdercity("Search...")} // Change placeholder on focus
                    onBlur={() => setPlaceholdercity("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholdercity}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Demo Filter
                  </label>

                  <Select
                    options={optionsdemo}
                    value={dropdownValuedemo}
                    onChange={handledemochange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData?.demo_flag) &&
                      dropdownData.demo_flag.length > 2
                        ? [
                            {
                              label: dropdownData.demo_flag[2],
                              value: dropdownData.demo_flag[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderdemo("Search...")}
                    onBlur={() => setPlaceholderdemo("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderdemo}
                  />
                </div>

                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    SRN flag
                  </label>

                  <Select
                    options={optionssrnflag}
                    value={dropdownValuesrnflag}
                    onChange={handlesrnflagchange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData?.srn_flag) &&
                      dropdownData.srn_flag.length > 2
                        ? [
                            {
                              label: dropdownData.srn_flag[2],
                              value: dropdownData.srn_flag[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholdersrn("Search...")}
                    onBlur={() => setPlaceholdersrn("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholdersrn}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    PriceBreakup
                  </label>
                  {/* <select
                     name="PriceBreakup2"
                    value={filters.PriceBreakup2}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      // width: "156px",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option value="" style={{ color: "#000" }}>
                      ALL
                    </option>
                    {[
                      { key: "Null", value: "Null" },
                      { key: "0-1000", value: "0-1000" },
                      { key: "1001-2000", value: "1001-2000" },
                      { key: "2001-3000", value: "2001-3000" },
                      { key: "3001-4000", value: "3001-4000" },
                      { key: "4001-5000", value: "4001-5000" },
                      { key: "5001-6000", value: "5001-6000" },
                      { key: "6001-7000", value: "6001-7000" },
                      { key: "7001-8000", value: "7001-8000" },
                      { key: "8001-9000", value: "8001-9000" },
                      { key: "9001-10000", value: "9001-10000" },
                      { key: "10001-20000", value: "10001-20000" },
                      { key: "20001-30000", value: "20001-30000" },
                      { key: "30001-40000", value: "30001-40000" },
                      { key: "40001-50000", value: "40001-50000" },
                      { key: ">50000", value: ">50000" },
                    ].map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.key}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionsprice}
                    value={dropdownValueprice}
                    onChange={handlepriceChange}
                    isMulti
                    defaultValue={[
                      { label: "0-5000", value: "0-5000" },
                      { label: "5001-10000", value: "5001-10000" },
                      { label: "10001-15000", value: "10001-15000" },
                      { label: "15001-20000", value: "15001-20000" },
                      { label: "20001-25000", value: "20001-25000" },
                      { label: "25001-5000", value: "25001-5000" },
                      { label: "50001-70000", value: "50001-70000" },
                      { label: "70001-100000", value: "70001-100000" },
                      // { label: "8001-9000", value: "8001-9000" },
                      // { label: "9001-10000", value: "9001-10000" },
                      // { label: "10001-20000", value: "10001-20000" },
                      // { label: "20001-30000", value: "20001-30000" },
                      // { label: "30001-40000", value: "30001-40000" },
                      // { label: "40001-50000", value: "40001-50000" },
                      { label: ">100000", value: ">100000" },
                    ]}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onFocus={() => setPlaceholderprice("Search...")}
                    onBlur={() => setPlaceholderprice("All")}
                    placeholder={placeholderprice}
                  />
                </div>
              </div>
            </div>
            {/* //period */}
            <div
              style={{
                display: "flex",
                backgroundColor: "black",
                height: 3,
                border: "1px solid black",
                width: "99%",
              }}
            ></div>
            {/* //boostrap code */}

            <div className="container mt-4">
              <div className="row">
                {/* //sales */}
                <div className="col-md-4 mb-3">
                  <div style={{ padding: "5px" }}>
                    <div
                      className="card-header text-center bg-white text-black"
                      style={{
                        display: "flex",
                        fontSize: 15,
                        fontWeight: "bold",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Inter",
                        padding: "3px",
                      }}
                    >
                      Sales
                    </div>
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#D9D9D9",
                            height: 39,
                            padding: "11px",
                            alignItems: "center",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 1
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 2
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Growth%
                          </strong>
                        </div>
                        {isLoadingsales || SalesDataresponse !== "OK" ? (
                          <div className="text-center text-gray-600 py-2">
                            <div
                              className="spinner-border gray-spinner"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>{" "}
                          </div>
                        ) : data1 &&
                          data1[0]?.rows &&
                          data1[0].rows.length > 0 ? (
                          data1[0].rows.map((data, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px",
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {formatNumber(data.period1)}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {formatNumber(data.period2)}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {formatNumber1(data.growth)}{" "}
                                {renderGrowthIcon1(data.growth)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              fontFamily: "Inter",
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            No data available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* sales qty */}
                <div className="col-md-4 mb-3">
                  <div style={{ padding: "5px" }}>
                    <div
                      className="card-header text-center bg-white text-black"
                      style={{
                        display: "flex",
                        fontSize: 15,
                        fontWeight: "bold",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Inter",
                        padding: "3px",
                      }}
                    >
                      Sales Qty
                    </div>
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#D9D9D9",
                            height: 39,
                            padding: "11px",
                            alignItems: "center",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 1
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 2
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Growth%
                          </strong>
                        </div>
                        {isLoadingsalesqty || SalesQtyresponse !== "OK" ? (
                          <div className="text-center text-gray-600 py-2">
                            <div
                              className="spinner-border gray-spinner"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>{" "}
                          </div>
                        ) : data2 &&
                          data2[0]?.rows &&
                          data2[0].rows.length > 0 ? (
                          data2[0].rows.map((data, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px",
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period1}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period2}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.growth} {renderGrowthIcon1(data.growth)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              fontFamily: "Inter",
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            No data available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* //asp */}
                <div className="col-md-4 mb-3">
                  <div style={{ padding: "5px" }}>
                    <div
                      className="card-header text-center bg-white text-black"
                      style={{
                        display: "flex",
                        fontSize: 15,
                        fontWeight: "bold",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Inter",
                        padding: "3px",
                      }}
                    >
                      ASP
                    </div>
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#D9D9D9",
                            height: 39,
                            padding: "11px",
                            alignItems: "center",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 1
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 2
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Growth%
                          </strong>
                        </div>
                        {isLoadingasp || ASPresponse !== "OK" ? (
                          <div className="text-center text-gray-600 py-2">
                            <div
                              className="spinner-border gray-spinner"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>{" "}
                          </div>
                        ) : data3 &&
                          data3[0]?.rows &&
                          data3[0].rows.length > 0 ? (
                          data3[0].rows.map((data, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px",
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period1}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period2}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.growth} {renderGrowthIcon1(data.growth)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              fontFamily: "Inter",
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            No data available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/* //discountAmt */}
                <div className="col-md-4 mb-3">
                  <div style={{ padding: "5px" }}>
                    <div
                      className="card-header text-center bg-white text-black"
                      style={{
                        display: "flex",
                        fontSize: 15,
                        fontWeight: "bold",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Inter",
                        padding: "3px",
                      }}
                    >
                      Disc Amt
                    </div>
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#D9D9D9",
                            height: 39,
                            padding: "11px",
                            alignItems: "center",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 1
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 2
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Growth%
                          </strong>
                        </div>
                        {isLoadingdisamt || DiscAmtresponse !== "OK" ? (
                          <div className="text-center text-gray-600 py-2">
                            <div
                              className="spinner-border gray-spinner"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>{" "}
                          </div>
                        ) : data4 &&
                          data4[0]?.rows &&
                          data4[0].rows.length > 0 ? (
                          data4[0].rows.map((data, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px",
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period1}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period2}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.growth} {renderGrowthIcon1(data.growth)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              fontFamily: "Inter",
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            No data available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* //dis */}
                <div className="col-md-4 mb-3">
                  <div style={{ padding: "5px" }}>
                    <div
                      className="card-header text-center bg-white text-black"
                      style={{
                        display: "flex",
                        fontSize: 15,
                        fontWeight: "bold",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Inter",
                        padding: "3px",
                      }}
                    >
                      Disc %
                    </div>
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#D9D9D9",
                            height: 39,
                            padding: "11px",
                            alignItems: "center",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 1
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 2
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Growth%
                          </strong>
                        </div>
                        {isLoadingdis || Disresponse !== "OK" ? (
                          <div className="text-center text-gray-600 py-2">
                            <div
                              className="spinner-border gray-spinner"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>{" "}
                          </div>
                        ) : data5 &&
                          data5[0]?.rows &&
                          data5[0].rows.length > 0 ? (
                          data5[0].rows.map((data, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px",
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period1}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period2}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.growth} {renderGrowthIcon1(data.growth)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              fontFamily: "Inter",
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            No data available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* //storect */}
                <div className="col-md-4 mb-3">
                  <div style={{ padding: "5px" }}>
                    <div
                      className="card-header text-center bg-white text-black"
                      style={{
                        display: "flex",
                        fontSize: 15,
                        fontWeight: "bold",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Inter",
                        padding: "3px",
                      }}
                    >
                      Store Count
                    </div>
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#D9D9D9",
                            height: 39,
                            padding: "11px",
                            alignItems: "center",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 1
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Period 2
                          </strong>
                          <strong
                            style={{
                              fontSize: 11,
                              fontFamily: "Inter",
                            }}
                          >
                            Growth%
                          </strong>
                        </div>
                        {isLoadingstorect || StoreCtresponse !== "OK" ? (
                          <div className="text-center text-gray-600 py-2">
                            <div
                              className="spinner-border gray-spinner"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>{" "}
                          </div>
                        ) : data6 &&
                          data6[0]?.rows &&
                          data6[0].rows.length > 0 ? (
                          data6[0].rows.map((data, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px",
                              }}
                            >
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period1}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.period2}
                              </div>
                              <div
                                style={{
                                  fontFamily: "Inter",
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                {data.growth} {renderGrowthIcon1(data.growth)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              fontFamily: "Inter",
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            No data available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* close */}
            <div
              style={{
                display: "flex",
                backgroundColor: "black",
                height: 3,
                border: "1px solid black",
                width: "99%",
              }}
            ></div>

            {/* //table */}
            <div>
              <div
                className="row"
                style={{
                  // height: "433px",
                  width: "100%",
                }}
              >
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    // width: "600px",
                    border: "1px solid black",
                    height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    // overflow: "auto",
                    borderBottom: "1px solid black",
                    width: "50%",
                    height: "252px",
                    // height: "172px",
                    overflow: "auto",
                  }}
                  // onScroll={(e) => handleScroll(e, "Brandwise")}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      Branch-Wise Analysis
                    </span>
                  </div>
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      borderBottom: "2px solid black",
                      paddingBottom: "5px",
                      paddingTop: "9px",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Store Name
                    </span>
                    <img
                      src={SelectArrow}
                      onClick={() => handleSort6("name")}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period1
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort6("period1")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period2
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort6("period2")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Growth%
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort6("growth")}
                    />
                  </div>
                  <div
                    style={{
                      overflow: "auto",
                      height: "400px",
                    }}
                    onScroll={handleBrandwiseScroll}
                  >
                    {/* Table Rows */}
                    {sortedSectionsBrand.map((section, index) => {
                      // Calculate opacity for period1 and period2
                      const period1Opacity = calculateOpacity(section.period1);
                      const period2Opacity = calculateOpacity1(section.period2);

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #6b728038",
                            minHeight: "53px",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: 12,
                              fontFamily: "Inter",
                              maxWidth: "106px",
                              // overflowWrap: "break-word",
                              lineBreak: "anywhere",
                            }}
                          >
                            {section.name}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${period1Opacity})`, // Apply opacity to backgroundColor
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period1)}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(175, 83, 42, ${period2Opacity})`, // Apply opacity to backgroundColor
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period2)}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                            }}
                          >
                            {formatNumber1(section.growth)}{" "}
                            {renderGrowthIcon(section.growth)}
                          </span>
                        </div>
                      );
                    })}
                    {/* Lazy Loader */}
                    {/* {(Brandwiseloading || Brandwiseresponse !== "OK") && (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    )}
                    {sortedSectionsBrand.length === 0 && !Brandwiseloading && (
                      <div className="text-center text-gray-600 py-2">
                        <p>No data available</p>
                      </div>
                    )} */}
                    {Brandwiseloading || Brandwiseresponse !== "OK" ? (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    ) : (
                      <>
                        {sortedSectionsBrand.length === 0 && (
                          <div className="text-center text-gray-600 py-2">
                            <p>No data available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* //second row */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    // width: "630px",
                    width: "50%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "252px",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "CityWiseAnalysis")}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      City-Wise Analysis
                    </span>
                  </div>
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      borderBottom: "2px solid black",
                      paddingBottom: "5px",
                      paddingTop: "9px",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      City
                    </span>
                    <img
                      src={SelectArrow}
                      onClick={() => handleSort7("name")}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period1
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort7("period1")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period2
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort7("period2")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Growth%
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort7("growth")}
                    />
                  </div>

                  <div
                    style={{
                      overflow: "auto",
                      height: "400px",
                    }}
                    onScroll={handleCityScroll}
                  >
                    {/* Table Rows */}
                    {sortedCityBrand.map((section, index) => {
                      // Calculate opacity for period1 and period2
                      const period1Opacity = calculateOpacity(section.period1);
                      const period2Opacity = calculateOpacity1(section.period2);

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #6b728038",
                            minHeight: "53px",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: 12,
                              fontFamily: "Inter",
                              lineBreak: "anywhere",
                            }}
                          >
                            {section.name}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${period1Opacity})`,
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period1)}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(175, 83, 42, ${period2Opacity})`, // Use dynamic background color
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period2)}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                            }}
                          >
                            {formatNumber1(section.growth)}{" "}
                            {renderGrowthIcon(section.growth)}
                          </span>
                        </div>
                      );
                    })}

                    {/* Lazy Loader */}
                    {/* {(Citywiseloading || Citywiseresponse !== "OK") && (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    )}

                    {sortedCityBrand.length === 0 && !Citywiseloading && (
                      <div className="text-center text-gray-600 py-2">
                        <p>No data available</p>
                      </div>
                    )} */}
                    {Citywiseloading || Citywiseresponse !== "OK" ? (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    ) : (
                      <>
                        {sortedCityBrand.length === 0 && (
                          <div className="text-center text-gray-600 py-2">
                            <p>No data available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* <h2 className="text-center mb-4">Sales Performance Analysis</h2> */}
              <div
                className="row"
                style={{
                  // height: "433px",
                  width: "100%",
                }}
              >
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    // width: "410px",
                    width: "34%",
                    border: "1px solid black",
                    height: "433px",
                    height: "200px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",

                    borderBottom: "1px solid black",
                    height: "252px",
                    overflow: "auto",
                  }}
                  // onScroll={(e) => handleScroll(e, "SectionWiseAnalysis")}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      Section-Wise Analysis
                    </span>
                  </div>
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      borderBottom: "2px solid black",
                      paddingBottom: "5px",
                      paddingTop: "9px",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Section
                    </span>
                    <img
                      src={SelectArrow}
                      onClick={() => handleSort("name")}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period1
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("period1")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period2
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("period2")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Growth%
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("growth")}
                    />
                  </div>
                  <div
                    style={{
                      overflow: "auto",
                      height: "400px",
                    }}
                    onScroll={handleSectionScroll}
                  >
                    {/* Table Rows */}
                    {sortedSections.map((section, index) => {
                      // Calculate opacity for period1 and period2
                      const period1Opacity = calculateOpacity(section.period1);
                      const period2Opacity = calculateOpacity1(section.period2);

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #6b728038",
                            minHeight: "53px",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: 12,
                              fontFamily: "Inter",
                              maxWidth: "106px",
                              // overflowWrap: "break-word",
                              lineBreak: "anywhere",
                            }}
                          >
                            {section.name}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${period1Opacity})`, // Apply opacity dynamically
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period1)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(175, 83, 42, ${period2Opacity})`, // Apply opacity dynamically
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period2)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                            }}
                          >
                            {formatNumber1(section.growth)}{" "}
                            {renderGrowthIcon(section.growth)}
                          </span>
                        </div>
                      );
                    })}

                    {/* Lazy Loader */}
                    {/* {(SectionWiseLoading || Sectionwiseresponse !== "OK") && (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    )}

                    {sortedSections.length === 0 && !SectionWiseLoading && (
                      <div className="text-center text-gray-600 py-2">
                        <p>No data available</p>
                      </div>
                    )} */}
                    {SectionWiseLoading || Sectionwiseresponse !== "OK" ? (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    ) : (
                      <>
                        {sortedSections.length === 0 && (
                          <div className="text-center text-gray-600 py-2">
                            <p>No data available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* ///second row */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    // width: "410px",
                    width: "33%",
                    border: "1px solid black",
                    height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                    height: "252px",
                    overflow: "auto",
                  }}
                  // onScroll={(e) => handleScroll(e, "ItemCategory")}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      Item Category Analysis
                    </span>
                  </div>

                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      borderBottom: "2px solid black",
                      paddingBottom: "5px",
                      paddingTop: "9px",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Item Category
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                      }}
                      onClick={() => handleSort1("name")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period1
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort1("period1")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period2
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort1("period2")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Growth%
                    </span>
                    <img
                      src={SelectArrow}
                      alt="Sort"
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort1("growth")}
                    />
                  </div>
                  <div
                    style={{
                      overflow: "auto",
                      height: "400px",
                    }}
                    onScroll={handleItemwiseScroll}
                  >
                    {/* Table Rows */}
                    {sortSections1.map((section, index) => {
                      // Calculate opacity values for period1 and period2
                      const period1Opacity = calculateOpacity(section.period1);
                      const period2Opacity = calculateOpacity1(section.period2);

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #6b728038",
                            minHeight: "53px",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: 12,
                              fontFamily: "Inter",
                              padding: "5px",
                              maxWidth: "106px",
                              // overflowWrap: "break-word",
                              lineBreak: "anywhere",
                            }}
                          >
                            {section.name}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${period1Opacity})`,
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period1)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(175, 83, 42, ${period2Opacity})`,
                            }}
                          >
                            {formatNumber(section.period2)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                            }}
                          >
                            {formatNumber1(section.growth)}{" "}
                            {renderGrowthIcon(section.growth)}
                          </span>
                        </div>
                      );
                    })}

                    {/* Lazy Loader */}
                    {/* {(ItemwisecategoryLoading || Itemwiseresponse !== "OK") && (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    )}
                    {sortSections1.length === 0 && !ItemwisecategoryLoading && (
                      <div className="text-center text-gray-600 py-2">
                        <p>No data available</p>
                      </div>
                    )} */}
                    {ItemwisecategoryLoading || Itemwiseresponse !== "OK" ? (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    ) : (
                      <>
                        {sortSections1.length === 0 && (
                          <div className="text-center text-gray-600 py-2">
                            <p>No data available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* //third row */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    // width: "410px",
                    width: "33%",
                    border: "1px solid black",
                    height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",

                    borderBottom: "1px solid black",
                    height: "252px",
                    overflow: "auto",
                  }}
                  // onScroll={(e) => handleScroll(e, "productWise")}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      Product-Wise Analysis
                    </span>
                  </div>
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      borderBottom: "2px solid black",
                      paddingBottom: "5px",
                      paddingTop: "9px",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Product
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort2("name")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period1
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort2("period1")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period2
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort2("period2")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Growth%
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort2("growth")}
                    />
                  </div>
                  <div
                    style={{
                      overflow: "auto",
                      height: "400px",
                    }}
                    onScroll={handleProductScroll}
                  >
                    {/* Table Rows */}
                    {sortSections2.map((section, index) => {
                      // Calculate opacity for period1 and period2
                      const period1Opacity = calculateOpacity(section.period1);
                      const period2Opacity = calculateOpacity1(section.period2);

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #6b728038",
                            minHeight: "53px",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: 12,
                              fontFamily: "Inter",
                              maxWidth: "106px",
                              // overflowWrap: "break-word",
                              lineBreak: "anywhere",
                            }}
                          >
                            {section.name}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${period1Opacity})`,
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period1)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(175, 83, 42, ${period2Opacity})`,
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period2)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                            }}
                          >
                            {formatNumber1(section.growth)}{" "}
                            {renderGrowthIcon(section.growth)}
                          </span>
                        </div>
                      );
                    })}

                    {/* Lazy Loader */}
                    {/* {(ProductwiseLoading || Productwiseresponse !== "OK") && (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    )}
                    {sortSections2.length === 0 && !ProductwiseLoading && (
                      <div className="text-center text-gray-600 py-2">
                        <p>No data available</p>
                      </div>
                    )} */}
                    {ProductwiseLoading || Productwiseresponse !== "OK" ? (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    ) : (
                      <>
                        {sortSections2.length === 0 && (
                          <div className="text-center text-gray-600 py-2">
                            <p>No data available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="row"
                style={{
                  height: "443px",
                  width: "100%",
                }}
              >
                {/* Second Row: Three Tables
                 */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    // width: "410px",
                    width: "34%",
                    border: "1px solid black",
                    height: "453px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",

                    borderBottom: "1px solid black",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      Brand Analysis
                    </span>
                  </div>
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      borderBottom: "2px solid black",
                      paddingBottom: "5px",
                      paddingTop: "9px",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Brand Name
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort3("name")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period1
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort3("period1")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period2
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort3("period2")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Growth%
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort3("growth")}
                    />
                  </div>
                  <div
                    style={{
                      overflow: "auto",
                      height: "400px",
                    }}
                    onScroll={handleBrandScroll}
                    // onScroll={(e) => handleBrandScroll(e, "Brandanalysis")}
                  >
                    {/* Table Rows */}
                    {sortSections3.map((section, index) => {
                      const period1Values = sortSections3.map(
                        (item) => item.period1
                      );
                      const period2Values = sortSections3.map(
                        (item) => item.period2
                      );

                      const minPeriod1 = Math.min(...period1Values);
                      const maxPeriod1 = Math.max(...period1Values);

                      const minPeriod2 = Math.min(...period2Values);
                      const maxPeriod2 = Math.max(...period2Values);
                      // Calculate the opacity values before returning JSX
                      // const period1Opacity = calculateOpacity(section.period1);
                      // const period2Opacity = calculateOpacity1(section.period2);
                      const period1Opacity = calculateDynamicOpacity(
                        section.period1,
                        minPeriod1,
                        maxPeriod1
                      );
                      const period2Opacity = calculateDynamicOpacity(
                        section.period2,
                        minPeriod2,
                        maxPeriod2
                      );
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #6b728038",
                            minHeight: "53px",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: 12,
                              fontFamily: "Inter",
                              padding: "5px",
                              maxWidth: "106px",
                              // overflowWrap: "break-word",
                              lineBreak: "anywhere",
                            }}
                          >
                            {section.name}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${period1Opacity})`,
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period1)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(175, 83, 42, ${period2Opacity})`,
                            }}
                          >
                            {formatNumber(section.period2)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                            }}
                          >
                            {formatNumber1(section.growth)}{" "}
                            {renderGrowthIcon(section.growth)}
                          </span>
                        </div>
                      );
                    })}

                    {/* Lazy Loader */}
                    {/* {(Brandloading || BrandAnaresponse !== "OK") && (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    )}
                    {sortSections3.length === 0 && !Brandloading && (
                      <div className="text-center text-gray-600 py-2">
                        <p>No data available</p>
                      </div>
                    )} */}
                    {Brandloading || BrandAnaresponse !== "OK" ? (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    ) : (
                      <>
                        {sortSections3.length === 0 && (
                          <div className="text-center text-gray-600 py-2">
                            <p>No data available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* five row */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    // width: "410px",
                    width: "33%",
                    border: "1px solid black",
                    height: "453px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",

                    borderBottom: "1px solid black",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      Item-wise Analysis
                    </span>
                  </div>
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      borderBottom: "2px solid black",
                      paddingBottom: "5px",
                      paddingTop: "9px",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Item Name
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort4("name")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period1
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort4("period1")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period2
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort4("period2")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Growth%
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort4("growth")}
                    />
                  </div>
                  <div
                    style={{
                      overflow: "auto",
                      height: "400px",
                    }}
                    onScroll={handleItemScroll}
                  >
                    {/* Table Rows */}
                    {sortSections4.map((section, index) => {
                      const period1Values = sortSections4.map(
                        (item) => item.period1
                      );
                      const period2Values = sortSections4.map(
                        (item) => item.period2
                      );

                      const minPeriod1 = Math.min(...period1Values);
                      const maxPeriod1 = Math.max(...period1Values);

                      const minPeriod2 = Math.min(...period2Values);
                      const maxPeriod2 = Math.max(...period2Values);

                      const period1Opacity = calculateDynamicOpacity(
                        section.period1,
                        minPeriod1,
                        maxPeriod1
                      );
                      const period2Opacity = calculateDynamicOpacity(
                        section.period2,
                        minPeriod2,
                        maxPeriod2
                      );
                      // const period1Opacity = calculateOpacity(section.period1);
                      // const period2Opacity = calculateOpacity1(section.period2);

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #6b728038",
                            minHeight: "53px",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: 12,
                              fontFamily: "Inter",
                              maxWidth: "106px",
                              // overflowWrap: "break-word",
                              lineBreak: "anywhere",
                            }}
                          >
                            {section.name}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${period1Opacity})`,
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period1)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(175, 83, 42, ${period2Opacity})`,
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.period2)}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                            }}
                          >
                            {formatNumber1(section.growth)}{" "}
                            {renderGrowthIcon(section.growth)}
                          </span>
                        </div>
                      );
                    })}

                    {/* Lazy Loader */}

                    {ItemCategoryLoading || ItemAnasresponse !== "OK" ? (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    ) : (
                      <>
                        {sections4.length === 0 && (
                          <div className="text-center text-gray-600 py-2">
                            <p>No data available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* six row */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    // width: "410px",
                    width: "33%",
                    border: "1px solid black",
                    height: "453px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      Price Breakup Analysis
                    </span>
                  </div>
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      borderBottom: "2px solid black",
                      paddingBottom: "5px",
                      paddingTop: "9px",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "Inter",
                        fontSize: 11,
                        fontWeight: "bold",
                      }}
                    >
                      Price Breakup1
                    </span>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period1
                    </span>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Period2
                    </span>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Growth%
                    </span>
                  </div>
                  <div
                    style={{
                      overflow: "auto",
                      height: "400px",
                    }}
                    // onScroll={handleScroll}
                  >
                    {/* Table Rows */}
                    {!PriceBreakupLoading &&
                      sortSections5
                        .sort((a, b) => {
                          const parseRangeStart = (range) => {
                            if (!range || range === null || range === "")
                              return Infinity; // Place null/empty values last
                            const num = parseInt(range.split("-")[0], 10);
                            return isNaN(num) ? Infinity : num;
                          };

                          return (
                            parseRangeStart(a.name) - parseRangeStart(b.name)
                          );
                        })
                        .map((section, index) => {
                          const period1Opacity = calculateOpacity(
                            section.period1
                          );
                          const period2Opacity = calculateOpacity1(
                            section.period2
                          );

                          return (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderBottom: "1px solid #6b728038",
                                minHeight: "53px",
                              }}
                            >
                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  fontSize: 12,
                                  fontFamily: "Inter",
                                  maxWidth: "106px",
                                  overflowWrap: "break-word",
                                }}
                              >
                                {section.name}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontWeight: "bold",
                                  fontSize: 13,
                                  fontFamily: "Inter",
                                  backgroundColor: `rgba(4, 126, 163, ${period1Opacity})`,
                                  padding: "5px",
                                }}
                              >
                                {formatNumber(section.period1)}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontWeight: "bold",
                                  fontSize: 13,
                                  fontFamily: "Inter",
                                  backgroundColor: `rgba(175, 83, 42, ${period2Opacity})`,
                                  padding: "5px",
                                }}
                              >
                                {formatNumber(section.period2)}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontWeight: "bold",
                                  fontSize: 13,
                                  fontFamily: "Inter",
                                }}
                              >
                                {formatNumber1(section.growth)}{" "}
                                {renderGrowthIcon(section.growth)}
                              </span>
                            </div>
                          );
                        })}

                    {/* {(PriceBreakupLoading || PriceAnaresponse !== "OK") && (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    )}
                    {sortSections5.length === 0 && !PriceBreakupLoading && (
                      <div className="text-center text-gray-600 py-2">
                        <p>No data available</p>
                      </div>
                    )} */}
                    {PriceBreakupLoading || PriceAnaresponse !== "OK" ? (
                      <div className="text-center text-gray-600 py-2">
                        <div
                          className="spinner-border gray-spinner"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>{" "}
                      </div>
                    ) : (
                      <>
                        {sortSections5.length === 0 && (
                          <div className="text-center text-gray-600 py-2">
                            <p>No data available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* {error && (
              <ErrorPopup
                tableName={error.tableName}
                message={error.message}
                onClose={() => setError(null)}
              />
            )} */}

            {/* //table */}
          </div>
        </div>
      </div>
    </>
  );
}

export default PeriodComparsion;
