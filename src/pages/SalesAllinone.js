import React, { useState, useMemo, useEffect, useRef } from "react";

import "flowbite/dist/flowbite.css";
import "../style/table.css";
import { Button, Label, TextInput, Table } from "flowbite-react";
import axios from "axios";
import Select from "react-select";

import "../style/overall.css";
import { parse } from "postcss";
import { filter } from "d3";

function SalesAllinone() {
  const generateMonths = () => {
    const allMonths = [
      "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
    ];
    const currentDate = new Date();
    const currentMonthName = currentDate.toLocaleString("default", { month: "short" });
    const currentMonthIndex = allMonths.findIndex((month) => month === currentMonthName);
    const orderedMonths = [
      allMonths[currentMonthIndex],
      ...allMonths.slice(0, currentMonthIndex).reverse(),
      ...allMonths.slice(currentMonthIndex + 1).reverse(),
    ];
    return orderedMonths;
  };


  const generateMonths1 = () => {
    const allMonths = [
      "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
    ];
    const currentDate = new Date();
    const currentMonthName = currentDate.toLocaleString("default", { month: "short" });
    const currentMonthIndex = allMonths.findIndex((month) => month === currentMonthName);
    const orderedMonths = [
      allMonths[currentMonthIndex],
      ...allMonths.slice(0, currentMonthIndex).reverse(),
      ...allMonths.slice(currentMonthIndex + 1).reverse(),
    ];
    return allMonths;
  };
  const months = [...generateMonths(), "Total"];
  const monthcal = ["FY", ...generateMonths1(), "Total"];

  const [placeholder1, setPlaceholder1] = useState("All");
  const [placeholder2, setPlaceholder2] = useState("All");
  const [placeholder3, setPlaceholder3] = useState("All");
  const [placeholder4, setPlaceholder4] = useState("All");
  const [placeholder5, setPlaceholder5] = useState("All");
  const [placeholder6, setPlaceholder6] = useState("All");
  const [placeholder7, setPlaceholder7] = useState("All");
  const [placeholder8, setPlaceholder8] = useState("All");
  const [placeholder9, setPlaceholder9] = useState("All");
  const [placeholder10, setPlaceholder10] = useState("All");
  const [placeholder11, setPlaceholder11] = useState("All");
  const [placeholder12, setPlaceholder12] = useState("All");
  const [YTD, setYTD] = useState();
  const [YTDloading, setYTDLoading] = useState(false);
  const [YTDFlag, setYTDFlag] = useState();

  const [monthcalender, setmonthcalender] = useState();
  const [monthcalenderloading, setmonthcalenderLoading] = useState(false);
  const [mcFlag, setmcFlag] = useState();

  const [ProductionDimension, setProductionDimension] = useState();
  const [ProductionDimensionloading, setProductionDimensionLoading] =
    useState(false);
  const [pdFlag, setpdFlag] = useState();

  const [BrandDimension, setBrandDimension] = useState();
  const [SectionDimension, setSectionDimension] = useState();
  const [BrandDimensionloading, setBrandDimensionLoading] = useState(false);
  const [bdFlag, setbdFlag] = useState();

  const [ItemDimension, setItemDimension] = useState();
  const [ItemCategoryDimension, setItemCategoryDimension] = useState();
  const [ItemDimensionloading, setItemDimensionLoading] = useState(false);
  const [idFlag, setidFlag] = useState();
  const [WeekAnalysis, setWeekAnalysis] = useState({ years: [] });

  const [WeekAnalysisloading, setWeekAnalysisLoading] = useState(false);
  const [waFlag, setwaFlag] = useState();

  const [DayAnalysis, setDayAnalysis] = useState();
  const [DayAnalysisloading, setDayAnalysisLoading] = useState(false);
  const [daFlag, setdaFlag] = useState();

  const [PriceBreakup1, setPriceBreakup1] = useState();
  const [PriceBreakup1loading, setPriceBreakup1Loading] = useState(false);
  const [pb1Flag, setpb1Flag] = useState();

  const [PriceBreakup2, setPriceBreakup2] = useState();
  const [PriceBreakup2loading, setPriceBreakup2Loading] = useState(false);
  const [pb2Flag, setpb2Flag] = useState();
  const [monthRowSpan, setMonthRowSpan] = useState({});
  const [yearRowSpan, setYearRowSpan] = useState({});
  const [asm, setasm] = useState(null);
  const [period, setPeriod] = useState({
    from: "",
    to: "",
  });
  
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });

  const today = new Date().toISOString()?.split('T')[0];
  const [dropdownData, setDropdownData] = useState({
    store_name: [],
    city: [],
    item_description: [],
    brand_name: [],
    product_group: [],
    section: [],
    model_no: [],
    srn_flag: [],
    demo_flag: [],
    sale_type: [],
    item_category: [],
    gstfillter: [
      "Sales with GST (Cr)",
      "Sales without GST (cr)",
      "Sales with GST (Lk)",
      "Sales without GST (Lk)",
      "Sales Qty",
      "Total Sales",
      "GP (Lk)",
    ],
    price_breakup: [],
  });
  const [filters, setFilters] = useState({
    city: "",
    store_name: "",
    item_description: "",
    brand_name: "",
    product_group: "",
    section: "",
    model_no: "",
    srn_flag: "",
    demo_flag: "",
    sale_type: "",
    item_category: "",
    gstfilter: "cr",
    price_breakup: "",
  });
  let controller;
  let latestRequestId = 0;

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    // setProductionDimensionLoading(true);

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
      gstfilter: cleanEncode(filters.gstfilter),
      price_breakup: cleanEncode(filters.price_breakup),
      sale_type: cleanEncode(filters.sale_type),
      item_category: cleanEncode(filters.item_category),
    };
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;

      const response = await axios.get(
        `sales_all_in_one_live/column?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}`
      );

      setDropdownData(response.data);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setProductionDimensionLoading(false);
    }
  };



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);

    setFilters((prev) => ({ ...prev, [name]: value }));
    // console.log(value); // Log the selected value for debugging
    if (name === "gstfilter") {
      // console.log("Selected GST Filter:", value); // Log the selected gstfilter
    }
  };

  const handleDateChange = (event) => {
    const { id, value } = event.target;
    setPeriod((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const [refresh, setrefresh] = useState(false);

  const [isFiltersUpdatedapply, setIsFiltersUpdatedapply] = useState(false);

  const [initialFilters, setInitialFilters] = useState(filters);
const [isApplyDisabled, setIsApplyDisabled] = useState(true); 

useEffect(() => {
  console.log(initialFilters)
  const filtersChanged = Object.keys(filters).some(
    (key) => filters[key] !== initialFilters[key]
  ) || period.from !== dateRange.start_date || period.to !== dateRange.end_date;
  setIsApplyDisabled(!filtersChanged);
}, [filters,period.from, period.to]);





  const reloadWithFilters = () => {
    setrefresh(true)
    setCitypage(1)
    setBranchpage(1)
    setItemCategorypage(1)
    setItempage(1)
    setSectionpage(1)
    setBrandpage(1)
    setProductpage(1)
    setDayAnalysisPage(1)
    setWeekAnalysisPage(1)
    console.log("productpage");

    setPriceBreakup1("");
    setPriceBreakup2("")
    setWeekAnalysis("");
    setDayAnalysis("");
    setSectionDimension("")
    setItemCategoryDimension("")
    setCityDimension("")
    setBranchDimension("")
    setBrandDimension("")
    setProductionDimension("")
    setItemDimension("")
    setmonthcalender("")
    setYTD("")
    console.log('dsjhj');
    // setIsFiltersUpdatedapply(true);
    fetchDropdownData()
    fetchWeekAnalysis(1);
    // fetchData();
    fetchMonthlyCalendar();
    fetchProductionDimension(1);
    fetchBrandDimension(1);
    fetchItemDimension(1);
    fetchSectionDimension(1);
    fetchItemCategoryDimension(1);
    fetchDayAnalysis();
    fetchPriceBreakup1();
    fetchPriceBreakup2();
    fetchYTD();
    fetchBranchDimension(1);
    fetchCityDimension(1);
    setInitialFilters(filters);
  };



  const [isFiltersUpdated, setIsFiltersUpdated] = useState(false);

  const reloadRefresh = () => {
    // console.log("Filters before reload:", filters);

    const clearedFilters = {
      city: "",
      store_name: "",
      item_description: "",
      brand_name: "",
      product_group: "",
      section: "",
      model_no: "",
      srn_flag: "",
      demo_flag: "",
      sale_type: "",
      item_category: "",
      gstfilter: "cr",
      price_breakup: ""
    };

    fetchDropdownData({
      city: "",
      store_name: "",
      item_description: "",
      brand_name: "",
      product_group: "",
      section: "",
      model_no: "",
      srn_flag: "",
      demo_flag: "",
      sale_type: "",
      item_category: "",
      gstfilter: "cr",
      price_breakup: ""
    })
    setCitypage(1)
    setBranchpage(1)
    setItemCategorypage(1)
    setItempage(1)
    setSectionpage(1)
    setBrandpage(1)
    setProductpage(1)
    setDayAnalysisPage(1)
    setWeekAnalysisPage(1)
    setFilters(clearedFilters);
    setIsFiltersUpdated(true);
    setSelectedOption1("");
    setSelectedOption2("");
    setSelectedOption3("");
    setSelectedOption4("");
    setSelectedOption5("");
    setSelectedOption6("");
    setSelectedOption7("");
    setSelectedOption8("");
    setSelectedOption9("");
    setSelectedOption10("");
    setSelectedOption11("");
    setSelectedOption31("")
    setSelectedOption61("")
    setSelectedOption("")
    setSelectedOptionitem("")
    setPeriod({ from: "", to: "" });
    setrefresh(false);
    // console.log("Reload complete.");
  };

  useEffect(() => {
    if (isFiltersUpdated) {
      setWeekAnalysis("");
      setDayAnalysis("");
      setSectionDimension("")
      setItemCategoryDimension("")
      setCityDimension("")
      setBranchDimension("")
      setBrandDimension("")
      setProductionDimension("")
      setItemDimension("")
      setmonthcalender("")
      setPriceBreakup1("");
      setPriceBreakup2("")
      setYTD("")
      setCitypage(1)
      setBranchpage(1)
      setItemCategorypage(1)
      setItempage(1)
      setSectionpage(1)
      setBrandpage(1)
      setProductpage(1)
      setDayAnalysisPage(1)
      setWeekAnalysisPage(1)

      setCitypage(1)
      setBranchpage(1)
      setItemCategorypage(1)
      setItempage(1)
      setSectionpage(1)
      setBrandpage(1)
      setProductpage(1)
      setDayAnalysisPage(1)
      setWeekAnalysisPage(1)
      setIsFiltersUpdated(false);
      // console.log("Filters updated:", filters);
      const queryString = new URLSearchParams(filters).toString();
      const baseUrl = 'sales_all_in_one_live/';
      const clearedUrl = `${baseUrl}?${queryString}`;
      // console.log("API URL being called:", clearedUrl);

      // fetchDropdownData({
      //   city: "",
      //   store_name: "",
      //   item_description: "",
      //   brand_name: "",
      //   product_group: "",
      //   section: "",
      //   model_no: "",
      //   srn_flag: "",
      //   demo_flag: "",
      //   sale_type: "",
      //   item_category: "",
      //   gstfilter: "cr",
      //   price_breakup: ""
      // })
      // fetchDropdownData()
      fetchData();
      fetchWeekAnalysis(1);

      fetchMonthlyCalendar();
      fetchProductionDimension(1);
      fetchBrandDimension(1);
      fetchItemDimension(1);
      fetchSectionDimension(1);
      fetchItemCategoryDimension(1);
      fetchDayAnalysis();
      fetchPriceBreakup1();
      fetchPriceBreakup2();
      fetchYTD();
      fetchBranchDimension(1);
      fetchCityDimension(1);
    }

  }, [filters, isFiltersUpdated]);


  // useEffect(() => {
  // if(reloadRef){

  // }
  // })

  // popup





  const weekdata = {
    values: {
      "Week 01": { 2024: 32, 2025: 56 },
      "Week 02": { 2024: 32, 2025: 56 },
    },
    years: [2025, 2024],
  };

  function calculateRowSpan(data) {
    if (!Array.isArray(data)) {
      // console.error("Expected an array, but received:", data);
      return { monthRowSpan: {}, yearRowSpan: {} }; // Return empty row spans
    }

    const monthCounts = {};
    const yearCounts = {};

    data.forEach((row) => {
      const { year, month } = row;

      // Initialize month counts
      if (!monthCounts[year]) {
        monthCounts[year] = {};
      }
      if (!monthCounts[year][month]) {
        monthCounts[year][month] = 0;
      }
      monthCounts[year][month] += 1; // Count occurrences for the month

      // Initialize year counts
      if (!yearCounts[year]) {
        yearCounts[year] = 0;
      }
      yearCounts[year] += 1; // Increment for year (this is for counting months)
    });

    // Calculate total month row spans
    const monthRowSpan = {};
    for (const year in monthCounts) {
      monthRowSpan[year] = {};
      for (const month in monthCounts[year]) {
        monthRowSpan[year][month] = monthCounts[year][month]; // Assign the count
      }
    }

    // Calculate total row span for each year
    const yearRowSpan = {};
    for (const year in yearCounts) {
      yearRowSpan[year] = yearCounts[year]; // Set total month counts for each year
    }

    return { monthRowSpan, yearRowSpan };
  }


  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const storedAsm = sessionStorage.getItem("asm");
    const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;

    // Fetch dropdown data
    liveData()
    fetchDropdownData();
    fetchData();
    if (!mcFlag) fetchMonthlyCalendar();
    if (!pdFlag) fetchProductionDimension(1);
    if (!bdFlag) fetchBrandDimension(1);
    if (!idFlag) fetchItemDimension(1);
    if (!waFlag) fetchWeekAnalysis(1);
    if (!daFlag) fetchDayAnalysis();
    if (!pb1Flag) fetchPriceBreakup1();
    if (!pb2Flag) fetchPriceBreakup2();
    if (!YTDFlag) fetchYTD();
    if (!bdFlag) fetchSectionDimension(1);
    if (!bdFlag) fetchBranchDimension(1);
    if (!bdFlag) fetchCityDimension(1);
    if (!bdFlag) fetchItemCategoryDimension(1);

  }, [period.from, period.to]);

  // Fetch Data
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
      gstfilter: cleanEncode(filters.gstfilter),
      price_breakup: cleanEncode(filters.price_breakup),
      sale_type: cleanEncode(filters.sale_type),
      item_category: cleanEncode(filters.item_category),
    };

    // console.log("Decoded and Encoded Filters:", encodedFilters);
    try {
      const response = await axios.get(
        `sales_all_in_one_live/date?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}`
      );
      const responseData = response.data.data[0];
      if (responseData) {
        const formattedStartDate = responseData.start_date
          ?.split(" -")
          .reverse()
          .join("-");
        const formattedEndDate = responseData.end_date
          ?.split(" -")
          .reverse()
          .join("-");
        setDateRange({
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        });
        setPeriod({
          from: formattedStartDate,
          to: formattedEndDate,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  };

  const [popup, setpopup] = useState(false)



  // const[live,setLiveDate]=useState();
  const [formatteddate, setLiveDate] = useState();
  const [formattedTime, setformattedTime] = useState();
  const liveData = async () => {
    try {
      const response = await axios.get(`sales_all_in_one_live/table_modificatio`);
  
      const LiveData = response?.data?.last_modified;
  
      if (LiveData) {
        // Split the date and time from the last_modified string
        const [dayOfWeek, day, month, year, time] = LiveData.split(' ');
  
        // Format the date as DD/MM/YYYY
        const formattedDate = `${day}/${getMonthNumber(month)}/${year}`;
  
        // Bind the date and time
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
  
  // Helper to get month number from month name
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
    return months[monthName] || "01"; // Default to January if not found
  }
  
  



  // Fetch YTD
  const fetchYTD = async () => {
    setIsFetching5(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      // console.log("Decoded and Encoded Filters:", encodedFilters);
      const response = await axios.get(
        `sales_all_in_one_live/ytd_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}`
      );
      const stockpositionData = response.data;

      setYTD(stockpositionData);
      setYTDFlag(true);
    } catch (error) {
      console.error("Error fetching YTD Data:", error);
      setpopup(true)
    } finally {
      setIsFetching5(false);
    }
  };

  // Fetch MonthCalender
  const fetchMonthlyCalendar = async () => {
    setIsFetching6(true);

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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      const response = await axios.get(
        `sales_all_in_one_live/month_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}`
      );
      const stockpositionData = response.data;
      setmonthcalender(stockpositionData);
      setmcFlag(true);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setIsFetching6(false);
    }
  };

  // FetchPriceBreakUp1
  const fetchPriceBreakup1 = async () => {
    setIsFetching7(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };
      const response = await axios.get(
        `sales_all_in_one_live/price_breakup_one_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}`
      );
      const stockpositionData = response.data;
      setPriceBreakup1(stockpositionData);
      setpb1Flag(true);
    } catch (error) {
      console.error("Error fetching PriceBreakup1 Data:", error);
    } finally {
      setIsFetching7(false);
    }
  };

  // FetchPriceBreakUp2
  const fetchPriceBreakup2 = async () => {
    setIsFetching8(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      // console.log("Decoded and Encoded Filters:", encodedFilters);
      const response = await axios.get(
        `sales_all_in_one_live/price_breakup_two_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}`
      );
      const stockpositionData = response.data;
      setPriceBreakup2(stockpositionData);
      setpb2Flag(true);

    } catch (error) {
      console.error("Error fetching PriceBreakup2 Data:", error);
    } finally {
      setIsFetching8(false);
    }
  };

  const LoadingComponent = ({ rowLength = 3, colLength = 6 }) => (
    <div
      role="status"
      className="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 pt-4"
    >
      {Array.from({ length: rowLength }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-between pt-4">
          {Array.from({ length: colLength }).map((_, colIndex) => (
            <div key={colIndex}>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );

  const [page, setPage] = useState(1);
  const [WeekAnalysispage, setWeekAnalysisPage] = useState(1);
  const [DayAnalysispage, setDayAnalysisPage] = useState(1);
  const [productpage, setProductpage] = useState(1);
  const [Brandpage, setBrandpage] = useState(1);
  const [Sectionpage, setSectionpage] = useState(1);
  const [Itempage, setItempage] = useState(1);
  const [ItemCategorypage, setItemCategorypage] = useState(1);
  const limit = 60;
  const Daylimit = 240;
  const productlimit = 99;
  const BrandLimit = 34;
  const ItemLimit = 63;
  const SectionLimit = 155;
  const ItemCategoryLimit = 154;
  let lastScrollTop = 0;

  // Week
  const lastFetchedPage = useRef(0);

  const handleScroll1 = (e, dataKey) => {
    if (finalsize > 0) {
      const { scrollHeight, scrollTop, clientHeight } = e.target;

      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;

      if (isVerticalScroll && !isFetching) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

        if (isNearBottom) {
          setWeekAnalysisPage(prevPage => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated WeekAnalysispage");
              fetchWeekAnalysis(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });
        }
      }
    }
  };

  // Day
  // const handleScroll2 = (e, dataKey) => {
  //   if (finalsize1 > 0) {

  //     const { scrollHeight, scrollTop, clientHeight } = e.target;

  //     const isVerticalScroll = scrollTop !== lastScrollTop;
  //     lastScrollTop = scrollTop;

  //     if (isVerticalScroll) {
  //       const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

  //       if (isNearBottom) {
  //         const fetchMap = {
  //           DayAnalysis: fetchDayAnalysis,
  //         };
  //         if (fetchMap[dataKey]) {
  //           fetchMap[dataKey]()
  //             .then(() => {
  //               setIsFetching(false);
  //             })
  //             .catch((error) => {
  //               console.error("Error in lazy loading:", error);
  //               setIsFetching(false);
  //             });
  //         }
  //       }
  //     }
  //   }
  // };

  // Branch
  const handleScroll3 = (e, dataKey) => {
    if (finalsize2 > 0) {

      const { scrollHeight, scrollTop, clientHeight } = e.target;

      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;

      if (isVerticalScroll && !isFetchingBranchloading) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

        if (isNearBottom) {
          // setBranchpage(Branchpage+1);
          setIsFetchingBranchloading(true);
          setBranchpage(prevPage => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated fetchBranchDimension");
              fetchBranchDimension(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });
          // const fetchMap = {
          //   BranchDimension: fetchBranchDimension,
          // };
          // if (fetchMap[dataKey]) {
          //   fetchMap[dataKey]()
          //     .then(() => {
          //       setIsFetchingBranchloading(false);
          //     })
          //     .catch((error) => {
          //       console.error("Error in lazy loading:", error);
          //       setIsFetchingBranchloading(false);
          //     });
          // }
        }
      }
    }
  };

  // Section
  const handleScroll5 = (e, dataKey) => {
    console.log(finalsize4);

    if (finalsize4 > 0) {
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;
      if (isVerticalScroll && !isFetchingSectionloading) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;
        if (isNearBottom) {
          setSectionpage(prevPage => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated WeekAnalysispage");
              fetchSectionDimension(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });
          // setItempage((prevPage) => prevPage + 1);

          // const fetchMap = {
          //   SectionDimension: fetchSectionDimension,
          // };
          // if (fetchMap[dataKey]) {
          //   fetchMap[dataKey]()
          //     .then(() => {
          //       setIsFetchingSectionloading(false);
          //     })
          //     .catch((error) => {
          //       console.error("Error in lazy loading:", error);
          //       setIsFetchingSectionloading(false);
          //     });
          // }
        }
      }
    }
  };

  // city
  const handleScroll = (e, dataKey) => {
    if (finalsize9 > 0) {
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;
      if (isVerticalScroll) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;
        if (isNearBottom) {

          setCitypage(prevPage => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated WeekAnalysispage");
              fetchCityDimension(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });
        }
      }
    }
  };

  // ItemCategory
  const handleScrol6 = (e, dataKey) => {
    if (finalsize5 > 0) {

      const { scrollHeight, scrollTop, clientHeight } = e.target;

      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;

      if (isVerticalScroll && !isFetchingcategoryloading) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

        if (isNearBottom) {
          setItemCategorypage(prevPage => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated WeekAnalysispage");
              fetchItemCategoryDimension(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });
          // setItemCategorypage(ItemCategorypage+1);
          // const fetchMap = {
          //   ItemCategoryDimension: fetchItemCategoryDimension,
          // };
          // if (fetchMap[dataKey]) {
          //   fetchMap[dataKey]()
          //     .then(() => {
          //       setIsFetchingcategoryloading(false);
          //     })
          //     .catch((error) => {
          //       console.error("Error in lazy loading:", error);
          //       setIsFetchingcategoryloading(false);
          //     });
          // }
        }
      }
    }
  };

  // Product
  const handleScrol7 = (e, dataKey) => {

    if (finalsize6 > 0) {


      const { scrollHeight, scrollTop, clientHeight } = e.target;

      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;

      if (isVerticalScroll && !isFetching2) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

        if (isNearBottom) {
          setProductpage(prevPage => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated WeekAnalysispage");
              fetchProductionDimension(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });

        }

      }
    }

  };

  // Brand
  const handleScrol8 = (e, dataKey) => {
    if (finalsize7 > 0) {
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;
      if (isVerticalScroll && !isFetching3) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;
        console.log(isNearBottom);

        if (isNearBottom) {
          setBrandpage(prevPage => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated WeekAnalysispage");
              fetchBrandDimension(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });
          // setBrandpage(Brandpage+1);

          // const fetchMap = {
          //   BrandDimension: fetchBrandDimension,
          // };
          // if (fetchMap[dataKey]) {
          //   fetchMap[dataKey]()
          //     .then(() => {
          //       setIsFetching3(false);
          //     })
          //     .catch((error) => {
          //       console.error("Error in lazy loading:", error);
          //       setIsFetching3(false);
          //     });
          // }
        }
      }
    }
  };

  // Item
  const handleScrol9 = (e, dataKey) => {
    if (finalsize8 > 0) {

      const { scrollHeight, scrollTop, clientHeight } = e.target;

      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;

      if (isVerticalScroll && !isFetching4) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

        if (isNearBottom) {
          setItempage(prevPage => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated WeekAnalysispage");
              fetchItemDimension(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });
          // setItempage(Itempage+1);
          // const fetchMap = {
          //   ItemDimension: fetchItemDimension,
          // };
          // if (fetchMap[dataKey]) {
          //   fetchMap[dataKey]()
          //     .then(() => {
          //       setIsFetching4(false);
          //     })
          //     .catch((error) => {
          //       console.error("Error in lazy loading:", error);
          //       setIsFetching4(false);
          //     });
          // }
        }
      }
    }
  };


  const [scrolling, setScrolling] = useState(false);
  const gstFilter = filters.gstfilter && filters.gstfilter.sales_with_gst;
  const [shouldRun, setShouldRun] = useState(true);
  const [finalsize, setfinalsize] = useState();

  // Fetch Week
  const fetchWeekAnalysis = async (page) => {
    setIsFetching(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      console.log("Decoded and Encoded Filters:", encodedFilters);

      // Use the updated `page` instead of stale `WeekAnalysispage`
      const response = await axios.get(
        `sales_all_in_one_live/weekly_analysis_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&page=${page}&limit=${limit}`
      );

      const size = Object.keys(response.data?.values || {}).length;

      setfinalsize(size);
      if (response.data && response.data?.values && size > 0) {
        if (page === 1) {
          setWeekAnalysis(response.data);
        } else {
          setWeekAnalysis((prevData) => ({
            ...prevData,
            values: {
              ...prevData?.values,
              ...response.data?.values,
            },
          }));
        }
      } else {
        if (finalsize == 0) {
          setIsFetching(true);
        }
      }
    } catch (error) {
      console.error("Error fetching WeekAnalysis Data:", error);
    } finally {
      setIsFetching(false); // Ensure loading state is reset
    }
  };


  // Fetch Day
  const [finalsize1, setfinalsize1] = useState();
  const fetchDayAnalysis = async () => {
    // if (isFetching1) return;
    setIsFetching1(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };
      const response = await axios.get(
        `sales_all_in_one_live/day_analysis_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}`
      );
      const stockpositionData = response.data;
      setDayAnalysis(stockpositionData);
      const size = Object.keys(response.data || {}).length;
      // console.log(size);

      setfinalsize1(size);
      // if (response.data && size > 0) {
      //   const stockpositionData = response.data;

      //   if (DayAnalysispage === 1) {
      //     setDayAnalysis(stockpositionData);
      //   } else {
      //     setDayAnalysis(prevData => [
      //       ...(Array.isArray(prevData) ? prevData : []),
      //       ...stockpositionData
      //     ]);
      //   }

      //   const { monthRowSpan, yearRowSpan } = calculateRowSpan(stockpositionData);
      //   setMonthRowSpan(monthRowSpan);
      //   setYearRowSpan(yearRowSpan);
      //   setDayAnalysisPage(prevPage => prevPage + 1);
      // }else {
      //   if (finalsize == 0) {
      //     console.log(finalsize);
      //     setIsFetching(true);
      //   }
      // }
    } catch (error) {
      console.error("Error fetching Day Analysis Data:", error);
    } finally {
      setIsFetching1(false);
    }
  };

  // Fetch Product
  const [finalsize6, setfinalsize6] = useState();
  const fetchProductionDimension = async (page) => {
    console.log(productpage);

    setIsFetching2(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      // console.log("Decoded and Encoded Filters:", encodedFilters);
      const response = await axios.get(
        `sales_all_in_one_live/product_dimension_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}&page=${page}&limit=${productlimit}`
      );
      const size = Object.keys(response.data?.values || {}).length;
      setfinalsize6(size)
      if (response.data && response.data?.values && size > 0) {
        const { values } = response.data;

        if (Object.keys(values).length > 0) {

          if (page === 1) {
            setProductionDimension(response.data);
          } else {
            setProductionDimension((prevData) => ({
              ...prevData,
              values: {
                ...prevData?.values,
                ...response.data?.values,
              },
            }));
          }
        }
        setpdFlag(true);
      } else {
        if (finalsize6 === 0) {
          console.log(finalsize);
          setIsFetching2(false);
        }
      }
    } catch (error) {
      console.error("Error fetching Production Dimension Data:", error);
    } finally {
      setIsFetching2(false);
    }
  };

  // fetch Brand
  const [finalsize7, setfinalsize7] = useState();
  const fetchBrandDimension = async (page) => {
    console.log('fetchBrandDimension');

    setIsFetching3(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };
      // console.log("Decoded and Encoded Filters:", encodedFilters);
      const response = await axios.get(
        `sales_all_in_one_live/brand_dimension_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}&page=${page}&limit=${BrandLimit}`
      );
      const size = Object.keys(response.data?.values || {}).length;
      setfinalsize7(size)
      if (response.data && response.data?.values && size > 0) {
        const { values } = response.data;
        if (Object.keys(values)?.length > 0) {
          if (page === 1) {
            setBrandDimension(response.data);
          } else {
            setBrandDimension((prevData) => ({
              ...prevData,
              values: {
                ...prevData?.values,
                ...values,
              },
            }));

          }
          setbdFlag(true);
        }

        else {
          console.error(
            "Expected values object in response data but got:",
            response.data
          );
          if (finalsize7 == 0) {
            // console.log(finalsize);
            setIsFetching3(true);
          }
        }

      } else {
        console.error(
          "Expected values object in response data but got:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching BrandDimension Data:", error);
    } finally {
      setIsFetching3(false);
    }
  };

  // Fetch Item
  const [finalsize8, setfinalsize8] = useState();
  const fetchItemDimension = async (page) => {
    setIsFetching4(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      // console.log("Decoded and Encoded Filters:", encodedFilters);

      const response = await axios.get(
        `sales_all_in_one_live/item_dimension_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}&page=${page}&limit=${ItemLimit}`
      );
      const size = Object.keys(response.data?.values || {}).length;
      setfinalsize8(size)
      if (response.data && response.data?.values && size > 0) {
        const { values } = response.data;
        if (Object.keys(values)?.length > 0) {
          if (page === 1) {
            setItemDimension(response.data);
          } else {
            setItemDimension((prevData) => ({
              ...prevData,
              values: {
                ...prevData?.values,
                ...values,
              },
            }));
          }


        } else {
          if (finalsize8 == 0) {
            // console.log(finalsize);
            setIsFetching4(true);
          }
        }
      } else {
        console.error(
          "Expected values object in response data but got:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching Item Dimension Data:", error);
    } finally {
      setIsFetching4(false);
    }
  };

  // Fetch Section
  const [finalsize4, setfinalsize4] = useState();
  const fetchSectionDimension = async (page3) => {
    setIsFetchingSectionloading(true);

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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      const response = await axios.get(
        `sales_all_in_one_live/section_dimension_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}&page=${page3}&limit=${SectionLimit}`
      );

      const size = Object.keys(response.data?.values || {}).length;
      setfinalsize4(size);

      if (response.data && response.data?.values && size > 0) {

        if (page3 === 1) {
          setSectionDimension(response.data);
        } else {
          setSectionDimension((prevData) => ({
            ...prevData,
            values: {
              ...prevData?.values,
              ...response.data?.values,
            },
          }));
        }
        // Increment page after successful fetch
        // setSectionpage((prevPage) => prevPage + 1);
      } else {
        console.log("No more data available");
      }
    } catch (error) {
      console.error("Error fetching BrandDimension Data:", error);
    } finally {
      setIsFetchingSectionloading(false);
    }
  };



  // Fetch Branch
  const [BranchDimension, setBranchDimension] = useState();
  const [isFetchingBranchloading, setIsFetchingBranchloading] = useState(false);
  const [Branchpage, setBranchpage] = useState(1);
  const BranchLimit = 250;
  const [finalsize2, setfinalsize2] = useState();
  const fetchBranchDimension = async (page1) => {
    setIsFetchingBranchloading(true);

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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      // console.log("Decoded and Encoded Filters:", encodedFilters);
      const response = await axios.get(
        `sales_all_in_one_live/branch_dimension_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}&page=${page1}&limit=${BranchLimit}`
      );

      const size = Object.keys(response.data?.values || {}).length;
      setfinalsize2(size)
      if (response.data && response.data?.values && size > 0) {
        if (page1 === 1) {
          setBranchDimension(response.data);
        } else {
          setBranchDimension((prevData) => ({
            ...prevData,
            values: {
              ...prevData?.values,
              ...response.data?.values,
            },
          }));

        }

        setbdFlag(true);
      } else {
        // console.log("No more data available. Stopping fetch.");
        if (finalsize2 == 0) {
          // console.log(finalsize);
          setIsFetchingBranchloading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching BranchDimension data:", error);
    } finally {
      setIsFetchingBranchloading(false);
    }
  };

  // Fetch City
  const [CityDimension, setCityDimension] = useState();
  const [isFetchingCityloading, setIsFetchingCityloading] = useState(false);
  const [Citypage, setCitypage] = useState(1);
  const CityLimit = 52;
  const [finalsize9, setfinalsize9] = useState();
  const fetchCityDimension = async (page) => {
    setIsFetchingCityloading(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      // console.log("Decoded and Encoded Filters:", encodedFilters);

      const response = await axios.get(
        `sales_all_in_one_live/city_dimension_cr?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}&page=${page}&limit=${CityLimit}`
      );
      const size = Object.keys(response.data?.values || {}).length;
      setfinalsize9(size)
      if (response.data && response.data?.values) {
        const { values } = response.data;
        if (Object.keys(values).length > 0) {
          if (page === 1) {
            setCityDimension(response.data);
          } else {
            setCityDimension((prevData) => ({
              ...prevData,
              values: {
                ...prevData?.values,
                ...values,
              },
            }));
          }
          setbdFlag(true);
        } else {
          if (finalsize9 == 0) {
            // console.log(finalsize);
            setIsFetchingCityloading(true);
          }
        }
      } else {
        console.error(
          "Expected values object in response data but got:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching BrandDimension Data:", error);
    } finally {
      setIsFetchingCityloading(false);
    }
  };
  // Fetch ItemCategory
  const [finalsize5, setfinalsize5] = useState();

  const fetchItemCategoryDimension = async (page) => {
    setIsFetchingcategoryloading(true);
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
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),
        product_group: cleanEncode(filters.product_group),
        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        srn_flag: cleanEncode(filters.srn_flag),
        demo_flag: cleanEncode(filters.demo_flag),
        gstfilter: cleanEncode(filters.gstfilter),
        price_breakup: cleanEncode(filters.price_breakup),
        sale_type: cleanEncode(filters.sale_type),
        item_category: cleanEncode(filters.item_category),
      };

      const response = await axios.get(
        `sales_all_in_one_live/itemcategory?period_from=${period.from}&period_to=${period.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&item_description=${encodedFilters.item_description}&brand_name=${encodedFilters.brand_name}&product_group=${encodedFilters.product_group}&section=${encodedFilters.section}&model_no=${encodedFilters.model_no}&srn_flag=${encodedFilters.srn_flag}&demo_flag=${encodedFilters.demo_flag}&gstfilter=${encodedFilters.gstfilter}&PriceBreakup2=${encodedFilters.price_breakup}&asm=${asm}&sales_type=${encodedFilters.sale_type}&item_category=${encodedFilters.item_category}&page=${page}&limit=${ItemCategoryLimit}`
      );

      const size = Object.keys(response.data?.values || {}).length;
      setfinalsize5(size);
      if (response.data && response.data?.values && size > 0) {
        if (page === 1) {
          setItemCategoryDimension(response.data);
        } else {
          setItemCategoryDimension((prevData) => ({
            ...prevData,
            values: {
              ...prevData?.values,
              ...response.data?.values,
            },
          }));
        }

      } else {
        if (finalsize5 === 0) {
          console.log("No more data available");
        }
      }
    } catch (error) {
      console.error("Error fetching Item Dimension Data:", error);
    } finally {
      setIsFetchingcategoryloading(false); // Ensure the loader stops regardless of success or failure
    }
  };


  const [isFetching, setIsFetching] = useState(false);
  const [isFetching1, setIsFetching1] = useState(false);
  const [isFetching2, setIsFetching2] = useState(false);
  const [isFetching3, setIsFetching3] = useState(false);

  const [isFetchingSectionloading, setIsFetchingSectionloading] =
    useState(false);
  const [isFetchingcategoryloading, setIsFetchingcategoryloading] =
    useState(false);
  const [isFetching4, setIsFetching4] = useState(false);
  const [isFetching5, setIsFetching5] = useState(false);
  const [isFetching6, setIsFetching6] = useState(false);
  const [isFetching7, setIsFetching7] = useState(false);
  const [isFetching8, setIsFetching8] = useState(false);
  // const options = filters.store_name
  // ? filters.store_name.split(",").map((flag) => ({
  //     label: flag.trim(),
  //     value: flag.trim(),
  //   }))
  // : [];

  // Define selectedOption based on the condition
  const [selectedOption, setSelectedOption] = useState(
    Array.isArray(dropdownData?.store_name) && dropdownData?.store_name?.length > 2
      ? [
        {
          label: dropdownData.store_name[2],
          value: dropdownData.store_name[2],
        },
      ]
      : null
  );

  const dropdownValuebranch = selectedOption || filters.store_name;
  const handleChange = (selectedOptions) => {
    setSelectedOption(selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        store_name: selectedValuesString,

      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        store_name: "",
      }));
      // console.log("Cleared filter value");
    }
  };



  const [selectedOption1, setSelectedOption1] = useState(() => {
    // Ensure item_description is an array and has at least 3 items
    if (
      Array.isArray(dropdownData?.filters?.item_description) &&
      dropdownData.filters.item_description.length > 2
    ) {
      return [
        {
          label: dropdownData.filters.item_description[2], // Access the third item
          value: dropdownData.filters.item_description[2],
        },
      ];
    }
    return null; // Default value if the condition is not met
  });


  const dropdownValue1 = selectedOption1 || filters.item_description;

  const handleItemChange = (selectedOptions) => {
    setSelectedOption1(selectedOptions);

    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_description: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_description: "",
      }));
      // console.log("Cleared item filter");
    }
  };


  const getRelatedItems = (selectedModelNos) => {
    // Example: Filter or fetch based on `selectedModelNos`
    const allItems = [
      { model_no: "Model1", item: "Item1" },
      { model_no: "Model1", item: "Item2" },
      { model_no: "Model2", item: "Item3" },
      { model_no: "Model2", item: "Item4" },
    ];

    // Filter items related to selected model numbers
    return allItems
      .filter((entry) => selectedModelNos.includes(entry.model_no))
      .map((entry) => ({ label: entry.item, value: entry.item }));
  };

  const [selectedOption2, setSelectedOption2] = useState(() => {
    const city = dropdownData?.filters?.city;
    return Array.isArray(city) && city.length > 2
      ? [{ label: city[2], value: city[2] }]
      : null;
  });




  const dropdownValuecity = selectedOption2 || filters.city;

  const [selectedOption3, setSelectedOption3] = useState(() => {
    const brandName = dropdownData?.filters?.brand_name;
    return Array.isArray(brandName) && brandName.length > 2
      ? [{ label: brandName[2], value: brandName[2] }]
      : null;
  });

  const dropdownValuebrandname = selectedOption3 || filters.brand_name;

  const [selectedOption4, setSelectedOption4] = useState(() => {
    const productGroup = dropdownData?.filters?.product_group;
    return Array.isArray(productGroup) && productGroup.length > 2
      ? [{ label: productGroup[2], value: productGroup[2] }]
      : null;
  });

  const dropdownValueproduct = selectedOption4 || filters.product_group;

  const [selectedOption5, setSelectedOption5] = useState(() => {
    const section = dropdownData?.filters?.section;
    return Array.isArray(section) && section.length > 2
      ? [{ label: section[2], value: section[2] }]
      : null;
  });

  const dropdownValuesection = selectedOption5 || filters.section;

  const [selectedOption6, setSelectedOption6] = useState(() => {
    const modelNo = dropdownData?.filters?.model_no;
    return Array.isArray(modelNo) && modelNo.length > 2
      ? [{ label: modelNo[2], value: modelNo[2] }]
      : null;
  });

  const dropdownValuemodel = selectedOption6 || filters.model_no;

  const [selectedOption7, setSelectedOption7] = useState(() => {
    const srnFlag = dropdownData?.filters?.srn_flag;
    return Array.isArray(srnFlag) && srnFlag.length > 2
      ? [{ label: srnFlag[2], value: srnFlag[2] }]
      : null;
  });

  const dropdownValuesrnflag = selectedOption7 || filters.srn_flag;

  const [selectedOption8, setSelectedOption8] = useState(() => {
    const demoFlag = dropdownData?.filters?.demo_flag;
    return Array.isArray(demoFlag) && demoFlag.length > 2
      ? [{ label: demoFlag[2], value: demoFlag[2] }]
      : null;
  });

  const dropdownValuedemoflag = selectedOption8 || filters.demo_flag;

  const [selectedOption10, setSelectedOption10] = useState(() => {
    const itemCategory = dropdownData?.filters?.item_category;
    return Array.isArray(itemCategory) && itemCategory.length > 2
      ? [{ label: itemCategory[2], value: itemCategory[2] }]
      : null;
  });

  const dropdownValue10 = selectedOption10 || filters.item_category;

  const [selectedOption11, setSelectedOption11] = useState(() => {
    const saleType = dropdownData?.filters?.sale_type;
    return Array.isArray(saleType) && saleType.length > 2
      ? [{ label: saleType[2], value: saleType[2] }]
      : null;
  });

  // const dropdownValue11 = selectedOption11 || filters.sale_type;



  const dropdownValuesales = selectedOption11 || filters.sale_type;
  const [selectedOption9, setSelectedOption9] = useState([

  ]);
  const dropdownprice = selectedOption9 || filters.price_breakup;

  // Transform store_name into options format required by react-select
  // const selectedOption = filters.store_name
  // ? filters.store_name.split(",").map((name) => ({
  //     label: name,
  //     value: name,
  //   }))
  // : null;
  const options = Array.isArray(dropdownData.store_name)
    ? dropdownData.store_name
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .map((store) => ({
        label: store,
        value: store,
      }))
    : [];



  const options1 = Array.isArray(dropdownData.item_description) ? dropdownData.item_description.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];

  const options2 = Array.isArray(dropdownData.city) ? dropdownData.city.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];

  const options3 = Array.isArray(dropdownData.brand_name) ? dropdownData.brand_name.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];
  const options4 = Array.isArray(dropdownData.product_group) ? dropdownData.product_group.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];

  const options5 = Array.isArray(dropdownData.section) ? dropdownData.section.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];

  const options6 = Array.isArray(dropdownData.model_no) ? dropdownData.model_no.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];
  const options7 = Array.isArray(dropdownData.srn_flag) ? dropdownData.srn_flag.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];
  const options8 = Array.isArray(dropdownData.demo_flag) ? dropdownData.demo_flag.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];

  const options10 = Array.isArray(dropdownData.item_category) ? dropdownData.item_category.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];
  const options11 = Array.isArray(dropdownData.sale_type) ? dropdownData.sale_type.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b)).map((store) => ({
      label: store,
      value: store,
    })) : [];
  const options9 = [
    { label: "Null", value: "Null" },
    { label: "0-1000", value: "0-1000" },
    { label: "1001-2000", value: "1001-2000" },
    { label: "2001-3000", value: "2001-3000" },
    { label: "3001-4000", value: "3001-4000" },
    { label: "4001-5000", value: "4001-5000" },
    { label: "5001-6000", value: "5001-6000" },
    { label: "6001-7000", value: "6001-7000" },
    { label: "7001-8000", value: "7001-8000" },
    { label: "8001-9000", value: "8001-9000" },
    { label: "9001-10000", value: "9001-10000" },
    { label: "10001-20000", value: "10001-20000" },
    { label: "20001-30000", value: "20001-30000" },
    { label: "30001-40000", value: "30001-40000" },
    { label: "40001-50000", value: "40001-50000" },
    { label: ">50000", value: ">50000" },
  ];

  //  city Dropdown
  const handleCityChange = (selectedOptions) => {
    setSelectedOption2(selectedOptions);
    // console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        city: selectedValuesString,
      }));
      // console.log("Updated city filter value:", selectedValuesString);
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        city: "",
      }));
      // console.log("Cleared city filter");
    }
  };

  const handlebrandnameChange = (selectedOptions) => {
    // Update selected state
    setSelectedOption3(selectedOptions);
    // console.log("Selected item options:", selectedOptions);

    if (selectedOptions) {
      // Extract the `value` from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Convert the array of values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the `filters` state with the new value
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand_name: selectedValuesString, // Update the brand_name filter
      }));

      // console.log("Updated brand_name filter value:", selectedValuesString); // Debugging
    } else {
      // If no options are selected, clear the brand_name filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand_name: "", // Clear the brand_name filter
      }));
      // console.log("Cleared brand_name filter");
    }
  };

  // Item Category Dropdown
  const handleitemcategoryChange = (selectedOptions) => {
    setSelectedOption10(selectedOptions);
    // console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_category: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_category: "",
      }));
      // console.log("Cleared item_category filter");
    }
  };

  // SalesType Dropdown
  const handlesalestypeChange = (selectedOptions) => {
    setSelectedOption11(selectedOptions);
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedValues = selectedOptions.map((option) =>
        option.value ? option.value : "Missing value"
      );
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        sale_type: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        sale_type: "",
      }));
    }
  };


  // Product Dropdown
  const handleproductgroupChange = (selectedOptions) => {
    setSelectedOption4(selectedOptions);
    // console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        product_group: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        product_group: "",
      }));
    }
  };

  // Section Dropdown
  const handlesectionChange = (selectedOptions) => {
    setSelectedOption5(selectedOptions);
    // console.log("Selected item options:", selectedOptions);
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        section: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        section: "",
      }));
    }
  };

  const handlemodelnoChange = (selectedOptions) => {
    setSelectedOption6(selectedOptions);
    // console.log("Selected item options:", selectedOptions);

    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        model_no: selectedValuesString,
      }));

      // console.log("Updated model_no filter value:", selectedValuesString);
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        model_no: "",
      }));
      // console.log("Cleared model_no filter");
    }
  };



  // -----------------------------------------------------------------------DK code------------------------------

  const [options51, setOptions51] = useState([]);
  const [options61, setOptions61] = useState([]);
  const [optionitem, setOptionsitem] = useState([]);

  const [selectedOption31, setSelectedOption31] = useState(() => {
    const brandName = dropdownData?.filters?.brand_name;
    return Array.isArray(brandName) && brandName.length > 2
      ? [{ label: brandName[2], value: brandName[2] }]
      : null;
  });;
  const [selectedOption61, setSelectedOption61] = useState(() => {
    const modelNo = dropdownData?.filters?.model_no;
    return Array.isArray(modelNo) && modelNo.length > 2
      ? [{ label: modelNo[2], value: modelNo[2] }]
      : null;
  });
  ;
  const [selectedOptionitem, setSelectedOptionitem] = useState(null);

  // Handle brand_name change
  const handleBrandNameChange1 = (selectedOptions) => {
    setSelectedOption3(selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions
        .map((option) => option.value)
        .join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand_name: selectedValues,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand_name: "",
      }));
    }
  };

  // Handle model_no change
  const handleModelNoChange1 = (selectedOptions) => {
    setSelectedOption6(selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        model_no: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        model_no: "",
      }));
    }
  };


  const handleitemdeschange = (selectedOptions) => {
    setSelectedOption1(selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions
        .map((option) => option.value)
        .join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_description: selectedValues,

      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_description: "",
      }));
    }
  };


  // -----------------------------------------------------------------------DK code end------------------------------


  // SRN Filter Dropdown
  const handlesrnflagChange = (selectedOptions) => {
    setSelectedOption7(selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prev) => ({
        ...prev,
        srn_flag: selectedValuesString
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        srn_flag: ""
      }));
    }
  };

  // Demo Filter Dropdown
  const handledemoflagChange = (selectedOptions) => {
    setSelectedOption8(selectedOptions);
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

  const handleClearEvent = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      srn_flag: selectedValues,
    }));

  }


  // Price Breakup Dropdown
  const handlepricebreakupChange = (selectedOptions) => {
    setSelectedOption9(selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        price_breakup: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        price_breakup: "",
      }));
    }
  };

  // const formatNumber = (value) => {
  //   if (value !== undefined && value !== null) {
  //     return new Intl.NumberFormat().format(value).toLocaleString("en-IN");
  //   }
  //   return "";
  // };


  const formatNumber = (value) => {
    if (value !== undefined && value !== null) {
      return value.toLocaleString("en-IN");  // Correct way to format in Indian number system
    }
    return "";
  };

  // const formatNumber = (value) => {
  //   if (isNaN(value)) return "0";
  //   return parseInt(value, 10).toLocaleString("en-IN"); 
  // };

  // const formatValueString = (valueString) => {
  //   if (!valueString) return "0";

  //   const [numberPart, percentagePart] = valueString.split(" ");
  //   const formattedNumber = new Intl.NumberFormat().format(parseFloat(numberPart).toLocaleString("en-IN") || 0);

  //   return percentagePart ? `${formattedNumber} ${percentagePart}` : formattedNumber;
  // };

  const formatValueString = (valueString) => {
    if (!valueString) return "0";
  
    const [numberPart, percentagePart] = valueString.split(" ");
    const formattedNumber = parseFloat(numberPart || 0).toLocaleString("en-IN"); // Correctly formats number
  
    return percentagePart ? `${formattedNumber} ${percentagePart}` : formattedNumber;
  };
  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto mt-14">
        <div className="p-4 rounded-lg shadow bg-white">
          <div className="space-y-6">
            <div className="headerstock">
              <div className="w-1/7">
                <select
                  style={{
                    width: "180px",
                    borderRadius: "9px",
                    background: "#1C3644",
                  }}
                  name="gstfilter"
                  value={filters.gstfilter}
                  onChange={handleFilterChange}
                  className="px-2 py-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                >
                  <option value="cr">Sales with GST (Cr)</option>
                  {[
                    // { key: "Sales with GST (Cr)", value: "cr" },
                    { key: "Sales without GST (Cr)", value: "cr_without_gst" },
                    { key: "Sales with GST (Lk)", value: "lk" },
                    { key: "Sales without GST (Lk)", value: "lk_without_gst" },
                    { key: "Sales Qty", value: "sales_qty" },
                    { key: "Total Sales", value: "total_sales" },
                    { key: "GP (Lk)", value: "gp" },
                  ].map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.key}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                {" "}
                <h3
                  className="px-2 py-2 border-gray-200 text-left text-xxl font-semibold text-gray-100 uppercase text-center"
                  style={{ margin: "0px" }}
                >
                  Sales All in one
                </h3>
              </div>

              <div className="w-1/6.3">
                <div className="apply-filter-container" style={{ width: 'auto' }}>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      color: "#000",
                      cursor: "pointer",
                      opacity: isApplyDisabled ? 0.5 : 1,
                      cursor: isApplyDisabled ? "not-allowed" : "pointer",
                    }}
                    className="apply-filter-button"
                    type="button"
                    // onClick={reloadWithFilters}
                    onClick={!isApplyDisabled ? reloadWithFilters : null}
                  >
                    {"Apply"}
                  </div>{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {refresh && (
                    <div
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


                  <div
                    style={{
                      // alignItems: "center",

                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
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
                      {formatteddate}<br></br>
                      {formattedTime}

                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form method="post">
              <div className="flex gap-2">
                <div className="w-1/5 filterstock">
                  <div className="mb-2 block">
                    <Label htmlFor="from" value="Period" />
                    <TextInput
                      id="from"
                      type="date"
                      required
                      value={period.from}
                      min={dateRange.start_date}
                      max={period.to}
                      onChange={(e) =>
                        setPeriod((prev) => ({
                          ...prev,
                          from: e.target.value || dateRange.start_date,
                        }))
                      }

                    />



                  </div>
                </div>
                <div
                  className="w-1/5 filterstock"
                  style={{ marginTop: "19px" }}
                >
                  <div className="mb-2 block">
                    <Label htmlFor="to" />
                    <TextInput
                      id="to"
                      type="date"
                      required
                      value={period.to}
                      min={period.from}
                      max={dateRange.end_date}
                      onChange={(e) =>
                        setPeriod((prev) => ({
                          ...prev,
                          to: e.target.value || dateRange.end_date,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="w-1/5 filterstock">
                  <label htmlFor="srn_flag">SRN Filter:</label>

                  <Select
                    options={options7}
                    value={dropdownValuesrnflag}
                    onChange={handlesrnflagChange}
                    isMulti
                    isClearable={true}
                    defaultValue={
                      Array.isArray(dropdownData.srn_flag) && dropdownData.srn_flag.length > 2
                        ? [
                          {
                            label: dropdownData.srn_flag
                              .slice()
                              .sort((a, b) => a.localeCompare(b))[2],
                            value: dropdownData.srn_flag
                              .slice()
                              .sort((a, b) => a.localeCompare(b))[2],
                          },
                        ]
                        : null
                    }

                    onFocus={() => setPlaceholder8("Search...")}
                    onBlur={() => setPlaceholder8("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholder8}
                  />
                </div>

                <div className="w-1/5 filterstock">
                  <label htmlFor="product_group">Sales Type:</label>
                  <Select
                    options={options11}
                    value={dropdownValuesales}
                    onChange={handlesalestypeChange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData.sale_type) && dropdownData.sale_type
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                          {
                            label: dropdownData.sale_type[2],
                            value: dropdownData.sale_type[2],
                          },
                        ]
                        : null
                    }
                    onFocus={() => setPlaceholder12("Search...")}
                    onBlur={() => setPlaceholder12("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholder12}
                    style={{
                      height: "32px",
                      overflow: "auto",
                      overflowX: "auto",
                    }}

                  />
                </div>

                {/* //section */}
                <div className="w-1/5 filterstock">
                  <label htmlFor="section">Section:</label>
                  <Select
                    options={options5}
                    value={dropdownValuesection}
                    onChange={handlesectionChange}
                    isMulti
                    placeholder={placeholder6}
                    onFocus={() => setPlaceholder6("Search...")}
                    onBlur={() => !dropdownValuesection && setPlaceholder6("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div className="w-1/5 filterstock">
                  <label htmlFor="product_group">Item Category:</label>
                  <Select
                    options={options10}
                    value={dropdownValue10}
                    onChange={handleitemcategoryChange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData.item_category) &&
                        dropdownData.item_category
                          .slice()
                          .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                          {
                            label: dropdownData.item_category[2],
                            value: dropdownData.item_category[2],
                          },
                        ]
                        : null
                    }
                    onFocus={() => setPlaceholder11("Search...")}
                    onBlur={() => setPlaceholder11("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholder11}
                  />
                </div>


                <div className="w-1/5 filterstock">
                  <label htmlFor="product_group">Product:</label>
                  <Select
                    options={options4}
                    value={dropdownValueproduct}
                    onChange={handleproductgroupChange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData.product_group) && dropdownData.product_group
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                          {
                            label: dropdownData.product_group[2],
                            value: dropdownData.product_group[2],
                          },
                        ]
                        : null
                    }
                    onFocus={() => setPlaceholder5("Search...")}
                    onBlur={() => setPlaceholder5("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholder5}
                  />
                </div>
                <div className="w-1/5 filterstock">
                  <label htmlFor="brand_name">Brand Name:</label>
                  <Select
                    options={options3}
                    value={selectedOption3}

                    onChange={handleBrandNameChange1
                    }
                    isMulti
                    isSearchable={true}
                    defaultValue={
                      Array.isArray(dropdownData.brand_name) && dropdownData.brand_name
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                          {
                            label: dropdownData.brand_name[2],
                            value: dropdownData.brand_name[2],
                          },
                        ]
                        : null
                    }
                    onFocus={() => setPlaceholder4("Search...")}
                    onBlur={() => setPlaceholder4("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholder4}
                  />
                </div>
                <div className="w-1/5 filterstock">
                  <label htmlFor="model_no">Model No:</label>

                  <Select
                    options={options6}
                    value={selectedOption6}
                    onChange={handleModelNoChange1}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData.model_no) && dropdownData.model_no
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                          {
                            label: dropdownData.model_no[2],
                            value: dropdownData.model_no[2],
                          },
                        ]
                        : null
                    }
                    onFocus={() => setPlaceholder7("Search...")}
                    onBlur={() => setPlaceholder7("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholder7}
                  />
                </div>


                <div className="w-1/5 filterstock">
                  <label htmlFor="item_description">Item Description:</label>

                  <Select
                    options={options1}
                    value={selectedOption1}
                    onChange={handleitemdeschange}
                    isMulti
                    isSearchable={true}
                    defaultValue={
                      Array.isArray(dropdownData.item_description) &&
                        dropdownData.item_description
                          .slice()
                          .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                          {
                            label: dropdownData.item_description[2],
                            value: dropdownData.item_description[2],
                          },
                        ]
                        : null
                    }
                    onFocus={() => setPlaceholder3("Search...")}
                    onBlur={() => setPlaceholder3("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholder3}
                  />
                </div>
                <div className="w-1/5 filterstock">
                  <label htmlFor="store_name">Branch:</label>
                  <div className="App">
                    <Select
                      options={options}
                      value={dropdownValuebranch}
                      onChange={handleChange}
                      isMulti
                      defaultValue={
                        Array.isArray(dropdownData.store_name) && dropdownData.store_name
                          .slice()
                          .sort((a, b) => a.localeCompare(b))?.length > 2
                          ? [
                            {
                              label: dropdownData.store_name[2],
                              value: dropdownData.store_name[2],
                            },
                          ]
                          : null
                      }
                      onFocus={() => setPlaceholder2("Search...")}
                      onBlur={() => setPlaceholder2("All")}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder={placeholder2}
                    />
                  </div>
                </div>

                <div className="w-1/5 filterstock">
                  <label htmlFor="city">City:</label>
                  <Select
                    options={options2}
                    value={dropdownValuecity}
                    onChange={handleCityChange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData.city) && dropdownData.city
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                          {
                            label: dropdownData.city[2],
                            value: dropdownData.city[2],
                          },
                        ]
                        : null
                    }
                    onFocus={() => setPlaceholder1("Search...")}
                    onBlur={() => setPlaceholder1("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholder1}
                  />
                </div>


                <div className="w-1/5 filterstock">
                  <label htmlFor="demo_flag">Demo Filter:</label>
                  <Select
                    options={options8}
                    value={dropdownValuedemoflag}
                    onChange={handledemoflagChange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData.demo_flag) && dropdownData.demo_flag
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                          {
                            label: dropdownData.demo_flag[2],
                            value: dropdownData.demo_flag[2],
                          },
                        ]
                        : null
                    }
                    onFocus={() => setPlaceholder9("Search...")}
                    onBlur={() => setPlaceholder9("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholder9}
                  />
                </div>

                <div className="w-1/5 filterstock">
                  <label htmlFor="demo_flag">Price Breakup :</label>
                  <Select
                    options={options9}
                    value={dropdownprice}
                    onChange={handlepricebreakupChange}
                    isMulti
                    defaultValue={[
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
                    ]}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onFocus={() => setPlaceholder10("Search...")}
                    onBlur={() => setPlaceholder10("All")}
                    placeholder={placeholder10}
                  />
                </div>
              </div>
            </form>
          </div>
          <div style={{
            gap: "10px",
            display: "flex",
            flexDirection: "column"
          }}>
            <div class="d-flex" style={{
              gap: "8px",
              width: "100%",
            }}>
              <div style={{
                background: " #1C3644",
                width: "3%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column"
              }}
              >
                <div class="rotated-text" >
                  Period Analysis
                </div>

              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid #1C3644",
                width: "97%",
              }}>
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-1">
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      YTD
                    </h3>

                    <div
                      className="overflow-x-auto"
                      style={{ height: "261px", overflow: "auto", border: '1px solid #80808075' }}
                    >
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0" style={{ zIndex: "" }}>
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              FY
                            </th>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Sales with GST (Cr)
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {YTD && !isFetching5 && Object.keys(YTD).length > 0 ? (
                            Object.keys(YTD)
                              .sort((a, b) => b - a)
                              .map((year) => {
                                const [value, percentage] = YTD[year]?.split(" ");
                                const currentValue = parseFloat(value);
                                const maxSales = Math.max(
                                  ...Object.keys(YTD).map((y) => {
                                    const value = YTD[y];
                                    if (typeof value === "string") {
                                      return parseFloat(value.split(" ")[0]);
                                    }
                                    return 0;
                                  })
                                );

                                const numericValue = value
                                  ? parseFloat(value.split(" ")[0])
                                  : null;


                                const isDynamicZeroValue = numericValue === 0 && value !== "0";


                                const opacity = !isDynamicZeroValue && maxSales > 0
                                  ? Math.max(numericValue / maxSales, 0.1)
                                  : 0.1;


                                const backgroundColor = !isDynamicZeroValue && numericValue === null ? "transparent" : `rgba(5, 127, 163, ${opacity})`;

                                return (
                                  <tr key={year}>
                                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                      {year}
                                    </td>
                                    <td
                                      style={{
                                        backgroundColor
                                      }}
                                      className="relative px-2 py-2 border-b border-gray-200 text-sm text-center"
                                    >
                                      <span>{formatNumber(value) || 0}</span>
                                      <br />
                                      <span>{percentage}</span>
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (

                            <tr>
                              {!isFetching5 &&
                                <td style={{ border: 'none' }}
                                  colSpan="2"
                                  className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center text-gray-500"
                                >
                                  No Data Available
                                </td>
                              }
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {isFetching5 && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>


                  <div className="col-span-4 ">
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Monthly Calendar
                    </h3>
                    <div
                      className="overflow-x-auto max-h-[400px]"
                      style={{ height: "268px", overflow: "auto", border: '1px solid #80808075' }}
                    >
                      <table className="w-full leading-normal m-0">
                        <thead>
                          <tr>
                            {
                              monthcal
                                ?.map((month, index) => (
                                  <th
                                    style={{ background: "#1C3644" }}
                                    key={index}
                                    className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  >
                                    {month}
                                  </th>
                                ))}
                          </tr>
                        </thead>
                        <tbody>
                          {monthcalender && monthcalender.length > 0 && !isFetching6 ? (
                            (() => {
                              const allValues = monthcalender.flatMap((row) =>
                                generateMonths1().map((monthKey) => {
                                  const value = row[monthKey] ? parseFloat(row[monthKey]?.split(" ")[0]) : 0;
                                  return value || 0;
                                })
                              );
                              const globalMaxSales = Math.max(...allValues);

                              const calculateOpacity = (value) => {
                                const opacity = value / (globalMaxSales || 1);
                                return opacity > 0 ? opacity : 0.1; // Ensure non-zero opacity
                              };

                              return monthcalender
                                .sort((a, b) => parseInt(b.FY) - parseInt(a.FY))
                                .map((row, index) => (
                                  <tr key={index}>
                                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                      {row.FY}
                                    </td>
                                    {generateMonths1().map((monthKey) => {
                                      const monthValue = row[monthKey]
                                        ? parseFloat(row[monthKey].replace("(0.0%)", "(-0.0%)").split(" ")[0]) || row[monthKey].replace("(0.0%)", "(-0.0%)").split(" ")[0]
                                        : 0;
                                      // console.log(row[monthKey]);

                                      const formattedValue = formatNumber(monthValue);
                                      const opacity = calculateOpacity(monthValue);
                                      const style = monthValue
                                        ? {
                                          backgroundColor: `rgba(5, 127, 163, ${opacity})`,
                                        }
                                        : {};

                                      return (
                                        <td
                                          key={monthKey}
                                          className="relative px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          style={style}
                                        >
                                          {row[monthKey] ? `${formattedValue} ${row[monthKey]?.split(" ")[1] || ""}` : "0"}
                                        </td>
                                      );
                                    })}
                                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                      {formatNumber(row.Total || 0)}
                                    </td>
                                  </tr>
                                ));
                            })()
                          ) : (
                            <tr>
                              {!isFetching6 && (
                                <td
                                  style={{ border: "none" }}
                                  colSpan={generateMonths1().length + 2} // Add 2 for FY and Total columns
                                  className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center"
                                >
                                  No Data Available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>

                      </table>
                      {isFetching6 && (
                        <div className="text-center text-gray-600 py-2">
                          <div
                            className="spinner-border gray-spinner"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <br />
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Week Analysis
                    </h3>
                    <div
                      className="overflow-x-auto max-h-[400px]"
                      style={{ height: "248px", overflow: "auto", border: '1px solid #80808075' }}
                      onScroll={(e) => handleScroll1(e, "WeekAnalysis")}
                    >
                      <table id="tblweekanalysis" className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Fiscal Weeks
                            </th>
                            {WeekAnalysis &&
                              WeekAnalysis?.years?.map((year) => (
                                <th
                                  style={{ background: "#1C3644" }}
                                  className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  key={year}
                                >
                                  {year}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {WeekAnalysis && WeekAnalysis.years && WeekAnalysis.years.length > 0 && Object.keys(WeekAnalysis.values || {}).length > 0 ? (
                            <React.Fragment>
                              {Object.entries(WeekAnalysis.values).map(([week, values]) => {
                                const allValues = WeekAnalysis.years.map((year) => {
                                  // const valueString = String(values[year] || '0');
                                  const valueString = String(values?.[year]?.sales_details ?? values?.[year] ?? 0);
                                  const value = parseFloat(valueString.split(" ")[0]) || 0;
                                  // console.log(value);

                                  return value;
                                });



                                const globalMaxValue = Math.max(...allValues);
                                console.log(globalMaxValue);

                                return (
                                  <tr key={week}>
                                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                      {week}
                                    </td>
                                    {WeekAnalysis.years.map((year) => {
                                      const valueString = String(values?.[year]?.sales_details ?? values?.[year] ?? 0);
                                      const value = parseFloat(valueString.split(" ")[0])
                                        || valueString.split(" ")[0] || 0;
                                      console.log(value);

                                      const maxAbsValue = Math.abs(globalMaxValue);
                                      // const opacity = value === 0 ? 0.1 : value / globalMaxValue;
                                      // const backgroundColor = valueString
                                      //   ? `rgba(5, 127, 163, ${opacity})`
                                      //   : "transparent";

                                      const opacity = value === 0
                                        ? 0
                                        : Math.max(value / globalMaxValue, 0.1);

                                      const backgroundColor = valueString != 0
                                        ? `rgba(5, 127, 163, ${opacity})`
                                        : "transparent";

                                      console.log(backgroundColor);

                                      // console.log(`Value: ${value}, Opacity: ${opacity}, Background: ${backgroundColor}`);

                                      // const valueString = String(values?.[year]?.sales_details ?? values?.[year] ?? 0);
                                      // // const valueString = String(values[year]?.sales_details||values[year] || 0);
                                      // const value = parseFloat(valueString.split(" ")[0]) || 0;
                                      // const opacity = value === 0 ? 0.1 : value / globalMaxValue;

                                      // const backgroundColor = valueString
                                      //   ? `rgba(5, 127, 163, ${opacity})`
                                      //   : "transparent";

                                      return (
                                        <td
                                          key={year}
                                          style={{ backgroundColor }}
                                          className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                        >
                                          {formatValueString(valueString)}{" "}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          ) : (
                            <tr>
                              {!isFetching && (
                                <td style={{ border: 'none' }}
                                  colSpan={(WeekAnalysis?.years?.length || 0) + 1}
                                  className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center"
                                >
                                  No Data Available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>

                      </table>

                      {/* Lazy Loader */}
                      {isFetching && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Day Analysis
                    </h3>
                    <div
                      className="overflow-x-auto max-h-[400px]"
                      style={{ height: "248px", overflow: "auto", border: '1px solid #80808075' }}

                    >
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                              colSpan={3}
                            >
                              FY
                            </th>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Mon
                            </th>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Tue
                            </th>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Wed
                            </th>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Thu
                            </th>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Fri
                            </th>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Sat
                            </th>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Sun
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {DayAnalysis && DayAnalysis.length > 0 ? (
                            (() => {
                              let previousYear = null;
                              let previousMonth = null;
                              const yearRowSpan = {};
                              const monthRowSpan = {};

                              // Sorting the data by year and month, but current month comes first
                              const sortedDayAnalysis = [...DayAnalysis].sort((a, b) => {
                                // Prioritize the current year and month
                                const currentDate = new Date();
                                const currentYear = currentDate.getFullYear();
                                const currentMonth = currentDate.getMonth() + 1; // Months are 0-based in JavaScript

                                // If the year and month are the same, prioritize the current one
                                if (a.year === currentYear && a.month === currentMonth) return -1;
                                if (b.year === currentYear && b.month === currentMonth) return 1;

                                // Otherwise, sort by year in descending order
                                if (b.year !== a.year) {
                                  return b.year - a.year; // Sort by year
                                }

                                // Then sort by month in descending order
                                return b.month - a.month; // Sort by month
                              });

                              sortedDayAnalysis.forEach((row) => {
                                if (!yearRowSpan[row.year]) {
                                  yearRowSpan[row.year] = sortedDayAnalysis.filter((r) => r.year === row.year).length;
                                }
                                if (!monthRowSpan[row.year]) {
                                  monthRowSpan[row.year] = {};
                                }
                                if (!monthRowSpan[row.year][row.month]) {
                                  monthRowSpan[row.year][row.month] = sortedDayAnalysis.filter(
                                    (r) => r.year === row.year && r.month === row.month
                                  ).length;
                                }
                              });

                              const globalMaxValue = Math.max(
                                ...sortedDayAnalysis.flatMap((row) =>
                                  ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => {
                                    const value = row[day];
                                    if (typeof value === "string") {
                                      const numericValue = parseFloat(value.split(" ")[0]);
                                      return isNaN(numericValue) ? 0 : numericValue;
                                    }
                                    return typeof value === "number" ? value : 0;
                                  })
                                )
                              );

                              const calculateOpacity = (value) => {
                                if (value === null || value === undefined) return 0.1;
                                const numericValue = parseFloat(value);
                                if (isNaN(numericValue)) return 0.1;
                                const opacity = numericValue / globalMaxValue;
                                return Math.max(0.1, Math.min(opacity, 1));
                              };

                              return sortedDayAnalysis.map((row, index) => {
                                const isFirstYearInstance = row.year !== previousYear;
                                const isFirstMonthInstance = row.month !== previousMonth || isFirstYearInstance;

                                if (isFirstYearInstance) {
                                  previousYear = row.year;
                                }
                                if (isFirstMonthInstance) {
                                  previousMonth = row.month;
                                }

                                return (
                                  <tr key={index} className="bg-white">
                                    {isFirstYearInstance && (
                                      <td
                                        rowSpan={yearRowSpan[row.year]}
                                        className="px-0 py-1 border-b border-gray-200 bg-white text-sm text-center"
                                      >
                                        <p className="transform -rotate-90 origin-center">{row.year}</p>
                                      </td>
                                    )}
                                    {isFirstMonthInstance && (
                                      <td
                                        rowSpan={monthRowSpan[row.year][row.month]}
                                        className="px-1 py-1 border-b border-gray-200 bg-white text-sm text-center"
                                      >
                                        <p className="transform -rotate-90 origin-center">{row.month}</p>
                                      </td>
                                    )}
                                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                      {row.week}
                                    </td>
                                    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => {
                                      const value = row[day];
                                      let displayValue = String(row?.[day]?.sales_with_gst ?? row?.[day] ?? 0);
                                      let percentage = String(row?.[day]?.percentage ?? row?.[day] ?? 0);;
                                      let opacity = 0.1;

                                      if (typeof value === "string") {
                                        const regex = /([0-9.]+)\s?\(([^)]+)\)/;
                                        const match = value.match(regex);
                                        if (match) {
                                          displayValue = match[1];
                                          percentage = match[2];
                                          opacity = calculateOpacity(displayValue);
                                        }
                                      } else if (typeof value === "number") {
                                        displayValue = value.toString();
                                        opacity = calculateOpacity(value);
                                      }

                                      return (
                                        <td
                                          key={day}
                                          style={{
                                            backgroundColor: `rgba(5, 127, 163, ${opacity})`,
                                          }}
                                          className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                        >
                                          {formatValueString(displayValue)}
                                          <br />
                                          <span>({percentage})</span>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              });
                            })()
                          ) : (
                            <tr>
                              {!isFetching1 && (
                                <td colSpan="10" className="text-center py-1" style={{ border: "none" }}>
                                  No data available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>



                      </table>

                      {/* Lazy Loader */}
                      {isFetching1 && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
                <br />
              </div>
            </div>
            <div class="d-flex" style={{
              gap: "8px",
              width: "100%"
            }}>
              {/* Branch Dimension */}
              <div style={{
                background: " #1C3644",
                width: "3%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column"
              }}
              >

                <div class="rotated-text" >
                  Place Analysis
                </div>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid #1C3644",
                width: "97%",
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Branch Dimension
                    </h3>
                    <div
                      className="overflow-x-auto max-h-[400px]"
                      onScroll={(e) => handleScroll3(e, "BranchDimension")}
                      style={{ height: "348px", overflow: "scroll", border: '1px solid #80808075' }}
                    >
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              FY
                            </th>
                            {BranchDimension &&
                              Array.isArray(BranchDimension.years) &&
                              BranchDimension.years
                                .sort((a, b) => b - a)
                                .map((year) => (
                                  <th
                                    style={{ background: "#1C3644" }}
                                    className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                    colSpan={months.length}
                                    key={year}
                                  >
                                    {year}
                                  </th>
                                ))}
                          </tr>
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              STORE NAME
                            </th>
                            {BranchDimension?.years?.length > 0 &&
                              BranchDimension?.years?.map((year) =>
                                months.map((month) => (
                                  <th
                                    style={{ background: "#1C3644" }}
                                    key={`${year}-${month}`}
                                    className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  >
                                    {month}
                                  </th>
                                ))
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {BranchDimension ? (
                            (() => {
                              if (!BranchDimension.values || !BranchDimension.years) {
                                return (
                                  <tr>
                                    <td
                                      style={{ border: 'none' }}
                                      rowSpan="1"
                                      colSpan={BranchDimension.years?.length * months?.length + 1 || 1}
                                      className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center"
                                    >
                                      No data available
                                    </td>
                                  </tr>
                                );
                              }
                              const allValues = Object.values(BranchDimension.values)
                                .flatMap((yearsData) =>
                                  BranchDimension.years.flatMap((year) =>
                                    months.map((month) => {

                                      const valueString = yearsData[year]?.[month];
                                      return valueString ? parseFloat(valueString.split(' ')[0]) : 0;
                                    })
                                  )
                                )
                                .filter((val) => !isNaN(val));

                              const maxValue = Math.max(...allValues);
                              const minValue = Math.min(...allValues);

                              // console.log('Max Value:', maxValue, 'Min Value:', minValue);
                              const calculateOpacity = (value) => {
                                if (maxValue === minValue) return 0.5;;
                                return ((value - minValue) / (maxValue - minValue)) * 0.9 + 0.1;
                              };
                              const sortedRows = Object.entries(BranchDimension.values)
                                .map(([brand, yearsData]) => {
                                  const currentMonthValue = BranchDimension.years?.reduce((max, year) => {
                                    return Math.max(
                                      ...months.map((month) => {
                                        const valueString = yearsData[year]?.[month];
                                        return valueString ? parseFloat(valueString.split(' ')[0]) : 0;
                                      })
                                    );
                                  }, 0);
                                  return { brand, currentMonthValue };
                                })
                                .sort((a, b) => a.currentMonthValue - b.currentMonthValue);
                              return sortedRows.length > 0 ? (
                                sortedRows.map(({ brand, currentMonthValue }) => {
                                  const yearsData = BranchDimension.values[brand];
                                  return (
                                    <tr key={brand} className="bg-white">
                                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                        {brand}
                                      </td>
                                      {BranchDimension.years.map((year) =>
                                        months.map((month) => {
                                          if (month === "Total") {
                                            const totalValue = BranchDimension.yearly_totals[brand]?.[year] || 0;

                                            return (
                                              <td
                                                key={`${year}-${month}`}
                                                className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                              >
                                                {totalValue ? formatNumber(totalValue) : "0"}
                                              </td>
                                            );
                                          }

                                          const valueString = yearsData[year]?.[month];
                                          const numericValue = valueString
                                            ? parseFloat(valueString.replace('(0.0%)').split(' ')[0]) ||
                                            valueString.replace('(0.0%)').split(' ')[0]
                                            : 0;
                                          const formattedValue = formatNumber(numericValue);
                                          const isNegativeZero = Object.is(numericValue, -0);
                                          const opacity = isNegativeZero ? 0.1 : calculateOpacity(numericValue);
                                          // const opacity = calculateOpacity(numericValue);
                                          const backgroundColor = (Object.is(numericValue, -0) || numericValue !== 0 || (valueString && valueString.includes('-0')))
                                            ? `rgba(5, 127, 163, ${opacity})`
                                            : 'transparent';



                                          // console.log(`Value: ${numericValue}, Opacity: ${opacity}, Background: ${backgroundColor}`);

                                          return (
                                            <td
                                              key={`${year}-${month}`}
                                              className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                              style={{ backgroundColor }}
                                            >
                                              {valueString ? `${formattedValue} ${valueString?.split(' ')[1]}` : '0'}
                                            </td>
                                          );
                                        })
                                      )}
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td
                                    style={{ border: 'none' }}
                                    rowSpan="2"
                                    colSpan={BranchDimension.years?.length * months?.length + 1 || 1}
                                    className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center"
                                  >
                                    No data available
                                  </td>
                                </tr>
                              );
                            })()
                          ) : (
                            <tr>
                              {!isFetchingBranchloading && (
                                <td style={{ border: 'none' }} colSpan={1} className="text-center text-gray-500 py-2">
                                  No data available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {isFetchingBranchloading && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* City Dimension */}
                  <div>
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      City Dimension
                    </h3>
                    <div
                      className="overflow-x-auto max-h-[400px]"
                      onScroll={(e) => handleScroll(e, "CityDimension")}
                      style={{ height: "348px", overflow: "auto", border: '1px solid #80808075' }}
                    >
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              FY
                            </th>
                            {CityDimension &&
                              CityDimension?.years?.map((year) => (
                                <th
                                  style={{ background: "#1C3644" }}
                                  className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  colSpan={months.length}
                                  key={year}
                                >
                                  {year}
                                </th>
                              ))}
                          </tr>
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              CITY
                            </th>
                            {CityDimension &&
                              CityDimension?.years?.map((year) =>
                                months?.map((month) => (
                                  <th
                                    style={{ background: "#1C3644" }}
                                    key={month}
                                    className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  >
                                    {month}
                                  </th>
                                ))
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {CityDimension && Object.keys(CityDimension.values).length > 0 ? (
                            (() => {
                              const maxItemValue = CityDimension.max;

                              const calculateOpacity = (value) => {
                                if (!maxItemValue || maxItemValue === 0) {
                                  return 0.1;
                                }
                                const opacity = value / maxItemValue;
                                return Math.min(Math.max(opacity, 0.1), 1);
                              };

                              const sortedEntries = Object.entries(CityDimension.values).sort(
                                ([, yearsDataA], [, yearsDataB]) => {
                                  const valueA = yearsDataA[CityDimension.years[0]]?.[months[0]]
                                    ? parseFloat(yearsDataA[CityDimension.years[0]][months[0]].split(" ")[0])
                                    : 0;
                                  const valueB = yearsDataB[CityDimension.years[0]]?.[months[0]]
                                    ? parseFloat(yearsDataB[CityDimension.years[0]][months[0]].split(" ")[0])
                                    : 0;
                                  return valueB - valueA;
                                }
                              );

                              return sortedEntries.map(([item, yearsData]) => (
                                <tr key={item} className="bg-white">
                                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                    {item}
                                  </td>
                                  {CityDimension.years.map((year) =>
                                    months.map((month) => {
                                      if (month === "Total") {
                                        const totalValue = CityDimension.yearly_totals[item]?.[year];
                                        const numericValue = totalValue ? parseFloat(totalValue) : 0;
                                        const opacity = !isNaN(numericValue) && numericValue !== 0
                                          ? calculateOpacity(numericValue)
                                          : 0.1;
                                        const backgroundColor = totalValue
                                          ? `rgba(5, 127, 163, ${opacity})`
                                          : "transparent";

                                        return (
                                          <td
                                            key={`${year}-${month}`}
                                            className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                            style={{ backgroundColor }}
                                          >
                                            {totalValue ? formatNumber(numericValue) : "0"}
                                          </td>
                                        );
                                      }

                                      const valueString = yearsData[year]?.[month];
                                      const numericValue = valueString ? parseFloat(valueString.split(" ")[0]) : 0;
                                      const opacity = !isNaN(numericValue) && numericValue !== 0
                                        ? calculateOpacity(numericValue)
                                        : 0.1;
                                      const backgroundColor = valueString
                                        ? `rgba(5, 127, 163, ${opacity})`
                                        : "transparent";

                                      return (
                                        <td
                                          key={`${year}-${month}`}
                                          className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          style={{ backgroundColor }}
                                        >
                                          {valueString ? `${formatNumber(numericValue)} ${valueString.split(" ")[1]}` : "0"}
                                        </td>
                                      );
                                    })
                                  )}
                                </tr>
                              ));
                            })()
                          ) : (
                            <tr>
                              {!isFetchingCityloading && (
                                <td
                                  style={{ border: 'none' }}
                                  colSpan={CityDimension?.years?.length * months.length + 1 || 1}
                                  className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center"
                                >
                                  No Data Available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>


                      </table>
                      {isFetchingCityloading && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>


            {/* section Dimension */}
            <div class="d-flex" style={{
              gap: "8px",
              width: "100%"
            }}>
              <div style={{
                background: " #1C3644",
                width: "3%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column"
              }}
              >
                <div class="rotated-text" >
                  Product Analysis
                </div>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid #1C3644",
                width: "97%",
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Section Dimension
                    </h3>
                    <div
                      className="overflow-x-auto max-h-[400px]"
                      onScroll={(e) => handleScroll5(e, "SectionDimension")}
                      style={{ height: "361px", overflow: "auto", border: '1px solid #80808075' }}
                    >
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              FY
                            </th>
                            {SectionDimension &&
                              SectionDimension?.years
                                ?.sort((a, b) => b - a)
                                ?.map((year) => (
                                  <th
                                    style={{ background: "#1C3644" }}
                                    className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                    colSpan={months.length}
                                    key={year}
                                  >
                                    {year}
                                  </th>
                                ))}
                          </tr>
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Section
                            </th>
                            {SectionDimension &&
                              SectionDimension?.years?.map((year) =>
                                months?.map((month) => (
                                  <th
                                    style={{ background: "#1C3644" }}
                                    key={month}
                                    className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  >
                                    {month}
                                  </th>
                                ))
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {SectionDimension && Object.keys(SectionDimension.values || {}).length > 0 ? (
                            (() => {
                              const calculateTotalValueForMonth = (yearsData, month) => {
                                return Object.values(yearsData)?.reduce((total, yearData) => {
                                  const valueString = yearData?.[month];
                                  const numericValue = valueString
                                    ? parseFloat(valueString.split(" ")[0])
                                    : 0;
                                  return total + numericValue;
                                }, 0);
                              };
                              const calculateMaxValue = (yearsData) => {
                                return SectionDimension.years?.reduce((highest, year) => {
                                  return months?.reduce((max, month) => {
                                    const valueString = yearsData[year]?.[month];
                                    const numericValue = valueString
                                      ? parseFloat(valueString.split(" ")[0])
                                      : 0;
                                    return Math.max(max, numericValue);
                                  }, highest);
                                }, 0);
                              };
                              const sortedItems = Object.entries(SectionDimension.values).sort(
                                ([, yearsDataA], [, yearsDataB]) =>
                                  calculateMaxValue(yearsDataB) - calculateMaxValue(yearsDataA)
                              );
                              // console.log(sortedItems);
                              const currentMonth = months[new Date().getMonth()];
                              const sortedByCurrentMonth = sortedItems.map(([brand, yearsData]) => ({
                                brand,
                                yearsData,
                                currentMonthValue: calculateTotalValueForMonth(yearsData, currentMonth),
                              })).sort((a, b) => b.currentMonthValue - a.currentMonthValue);

                              const maxCurrentMonthValue = sortedByCurrentMonth[0]?.currentMonthValue || 1;

                              const calculateOpacity = (value) => Math.max(value / maxCurrentMonthValue, 0.1);

                              return sortedByCurrentMonth.map(({ brand, yearsData }) => (
                                <tr key={brand} className="bg-white">
                                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                    {brand}
                                  </td>
                                  {SectionDimension?.years?.map((year) =>
                                    months?.map((month) => {


                                      const valueString = yearsData[year]?.[month];
                                      // console.log(valueString);

                                      const numericValue = valueString
                                        ? parseFloat(valueString?.split(" ")[0])
                                        : 0;
                                      const backgroundColor = valueString
                                        ? `rgba(5, 127, 163, ${calculateOpacity(numericValue)})`
                                        : "transparent";

                                      if (month === "Total") {
                                        const totalValue = SectionDimension.yearly_totals[brand]?.[year] || 0;

                                        return (
                                          <td
                                            key={`${year}-${month}`}
                                            className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          >
                                            {totalValue ? formatNumber(totalValue) : "0"}
                                          </td>
                                        );
                                      }


                                      return (
                                        <td
                                          key={`${year}-${month}`}
                                          className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          style={{ backgroundColor }}
                                        >
                                          {valueString
                                            ? `${formatNumber(numericValue)} ${valueString?.split(" ")[1] || "0"}`
                                            : "0"}
                                        </td>
                                      );
                                    })
                                  )}
                                </tr>
                              ));
                            })()
                          ) : (
                            <tr>
                              {!isFetchingSectionloading && (
                                <td
                                  style={{ border: "none" }}
                                  colSpan={SectionDimension?.years?.length * months?.length + 1 || 1}
                                  className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center"
                                >
                                  No Data Available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {isFetchingSectionloading && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>


                  {/* Item Category Dimension */}
                  <div>
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Item Category Dimension
                    </h3>
                    <div
                      className="overflow-x-auto max-h-[400px]"
                      onScroll={(e) => handleScrol6(e, "ItemCategoryDimension")}
                      style={{ height: "361px", overflow: "auto", border: '1px solid #80808075' }}
                    >
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              FY
                            </th>
                            {ItemCategoryDimension?.years
                              ?.sort((a, b) => b - a)
                              ?.map((year) => (
                                <th
                                  style={{ background: "#1C3644" }}
                                  className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  colSpan={months.length}
                                  key={year}
                                >
                                  {year}
                                </th>
                              ))}
                          </tr>
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Item Category
                            </th>
                            {ItemCategoryDimension?.years?.map((year) =>
                              months?.map((month) => (
                                <th
                                  style={{ background: "#1C3644" }}
                                  key={month}
                                  className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                >
                                  {month}
                                </th>
                              ))
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {ItemCategoryDimension && Object.keys(ItemCategoryDimension.values).length > 0 ? (
                            (() => {
                              const currentMonth = months[months.length - 1];
                              const sortedItems = Object.entries(ItemCategoryDimension.values).sort(
                                ([itemA, yearsDataA], [itemB, yearsDataB]) => {
                                  const calculateMaxValue = (yearsData) => {
                                    let highestValue = 0;
                                    ItemCategoryDimension.years?.forEach((year) => {
                                      months.forEach((month) => {
                                        const valueString = yearsData[year]?.[month];
                                        const numericValue = valueString
                                          ? parseFloat(valueString?.split(" ")[0])
                                          : 0;
                                        highestValue = Math.max(highestValue, numericValue);
                                      });
                                    });
                                    return highestValue;
                                  };
                                  const maxA = calculateMaxValue(yearsDataA);
                                  const maxB = calculateMaxValue(yearsDataB);
                                  return maxB - maxA;
                                }
                              );
                              const maxItemValue = ItemCategoryDimension.max;

                              const calculateOpacity = (value, maxValue) => {
                                const safeMaxValue = maxValue !== undefined ? maxValue : 1;
                                if (safeMaxValue === 0) return 0.1;
                                const opacity = value / safeMaxValue;
                                return Math.max(opacity, 0.1);
                              };

                              return sortedItems.map(([item, yearsData]) => (
                                <tr key={item} className="bg-white">
                                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                    {item}
                                  </td>
                                  {ItemCategoryDimension?.years?.map((year) =>
                                    months?.map((month) => {
                                      const valueString = yearsData[year]?.[month];
                                      const numericValue = valueString
                                        ? parseFloat(valueString?.split(" ")[0])
                                        : 0;
                                      const calculateTotalValueForYear = (yearsData, year) => {
                                        let total = 0;
                                        for (const month of months) {
                                          const valueString = yearsData[year]?.[month];
                                          const numericValue = valueString
                                            ? parseFloat(valueString.split(" ")[0])
                                            : 0;
                                          total += numericValue;
                                        }
                                        return Math.round(total * 100) / 100;
                                      };

                                      const formattedValue = formatNumber(numericValue);
                                      const yearTotal = calculateTotalValueForYear(yearsData, year);


                                      if (month === "Total") {
                                        return (
                                          <td
                                            key={`${year}-${month}`}
                                            className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          >
                                            {/* {formatValueString(yearTotal ?? "0")} */}
                                            {formatValueString(yearTotal.toFixed(2) ?? "0")}
                                          </td>
                                        );
                                      }
                                      const backgroundColor = valueString
                                        ? `rgba(5, 127, 163, ${calculateOpacity(numericValue, maxItemValue)})`
                                        : "transparent";

                                      return (
                                        <td
                                          key={`${year}-${month}`}
                                          className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          style={{ backgroundColor }}
                                        >
                                          {valueString ? `${formattedValue} ${valueString?.split(" ")[1]}` : "0"}
                                        </td>
                                      );
                                    })
                                  )}
                                </tr>
                              ));
                            })()
                          ) : (
                            <tr>
                              {!isFetchingcategoryloading && (
                                <td style={{ border: 'none' }}
                                  colSpan={ItemCategoryDimension?.years?.length * months.length + 1 || 1}
                                  className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center"
                                >
                                  No Data Available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>

                      </table>
                      {isFetchingcategoryloading && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <br />

                {/*Product Dimension */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Product Dimension
                    </h3>
                    <div
                      style={{ height: "359px", overflow: "auto", border: '1px solid #80808075' }}
                      className="overflow-x-auto max-h-[400px]  "
                      onScroll={(e) => handleScrol7(e, "ProductionDimension")}
                    >
                      <table className="w-full  m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              FY
                            </th>
                            {ProductionDimension &&
                              ProductionDimension?.years?.map((year) => (
                                <th
                                  style={{ background: "#1C3644" }}
                                  className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  colSpan={months.length}
                                  key={year}
                                >
                                  {year}
                                </th>
                              ))}
                          </tr>
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Product
                            </th>
                            {ProductionDimension &&
                              ProductionDimension?.years?.map((year) =>
                                months?.map((month) => (
                                  <th
                                    style={{ background: "#1C3644" }}
                                    key={month}
                                    className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  >
                                    {month}
                                  </th>
                                ))
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {ProductionDimension && ProductionDimension.values && Object.keys(ProductionDimension?.values)?.length > 0 ? (
                            (() => {

                              const currentYear = new Date().getFullYear().toString();


                              const calculateMaxValueForMonth = (products, month) => {
                                return Math.max(
                                  ...products.map(({ yearsData }) =>
                                    Object.keys(yearsData).reduce((max, year) => {
                                      const valueString = yearsData[year]?.[month];
                                      const numericValue = valueString ? parseFloat(valueString.split(" ")[0]) : 0;
                                      return Math.max(max, numericValue);
                                    }, 0)
                                  ),
                                  0
                                );
                              };

                              const calculateTotalValueForCurrentYear = (yearsData) => {
                                if (!yearsData[currentYear]) return 0; // If the year doesn't exist, return 0

                                return Object.values(yearsData[currentYear]).reduce((total, valueString) => {
                                  const numericValue = valueString ? parseFloat(valueString.split(" ")[0]) : 0;
                                  return total + numericValue;
                                }, 0);
                              };

                              const currentMonth = months[new Date().getMonth()];

                              const sortedProducts = Object.entries(ProductionDimension?.values)
                                .map(([product, yearsData]) => ({
                                  product,
                                  yearsData,
                                  currentYearTotal: calculateTotalValueForCurrentYear(yearsData), // Calculate total value for sorting
                                }))

                                .sort((a, b) => b.currentYearTotal - a.currentYearTotal);
                              const maxValuesPerMonth = {};
                              months.forEach((month) => {
                                maxValuesPerMonth[month] = calculateMaxValueForMonth(sortedProducts, month);
                              });

                              return sortedProducts.map(({ product, yearsData }) => (
                                <tr key={product}>
                                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">{product}</td>

                                  {ProductionDimension?.years?.map((year) =>
                                    months?.map((month) => {
                                      const valueString = yearsData[year]?.[month];
                                      const numericValue = valueString ? parseFloat(valueString.split(" ")[0]) : null;

                                      const maxMonthValue = maxValuesPerMonth[month] || 1;

                                      const opacity =
                                        numericValue !== null && maxMonthValue > 0
                                          ? Math.max(numericValue / maxMonthValue, 0.1)
                                          : 0.1;

                                      const backgroundColor =
                                        numericValue === null ? "transparent" : `rgba(5, 127, 163, ${opacity})`;

                                      // Handling the "Total" month (if present)
                                      if (month === "Total") {
                                        const yearTotal = Object.values(yearsData[year] || {}).reduce((sum, val) => {
                                          const num = val ? parseFloat(val.split(" ")[0]) : 0;
                                          return sum + num;
                                        }, 0);

                                        return (
                                          <td
                                            key={`${year}-${month}`}
                                            className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          >
                                            {formatValueString(yearTotal.toFixed(2) ?? "0")}
                                          </td>
                                        );
                                      }

                                      return (
                                        <td
                                          key={`${year}-${month}`}
                                          className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          style={{ backgroundColor }}
                                        >
                                          {/* {valueString || "0"} */}
                                          {valueString && numericValue !== null
                                            ? `${formatValueString(numericValue.toFixed(2))} ${valueString.split(" ")[1]}`
                                            : "0"}
                                        </td>
                                      );
                                    })
                                  )}
                                </tr>
                              ));
                            }
                            )()
                          ) : (
                            <tr>
                              {!isFetching2 && (
                                <td
                                  style={{ border: "none", backgroundColor: "transparent" }}
                                  colSpan={ProductionDimension?.years?.length * months?.length + 1}
                                  className="px-2 py-2 text-center text-gray-500"
                                >
                                  No data available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>







                      </table>

                      {/* Lazy Loader */}
                      {isFetching2 && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>

                    {/*  Brand Dimension */}
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Brand Dimension
                    </h3>
                    <div
                      className="overflow-x-auto max-h-[400px]"
                      onScroll={(e) => handleScrol8(e, "BrandDimension")}
                      style={{ height: "359px", overflow: "auto", border: '1px solid #80808075' }}
                    >
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              FY
                            </th>
                            {BrandDimension &&
                              BrandDimension?.years?.map((year) => (
                                <th
                                  style={{ background: "#1C3644" }}
                                  className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  colSpan={months.length}
                                  key={year}
                                >
                                  {year}
                                </th>
                              ))}
                          </tr>
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Brand
                            </th>
                            {BrandDimension &&
                              BrandDimension?.years?.map((year) =>
                                months?.map((month) => (
                                  <th
                                    style={{ background: "#1C3644" }}
                                    key={month}
                                    className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  >
                                    {month}
                                  </th>
                                ))
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {BrandDimension && BrandDimension.values && Object.keys(BrandDimension.values).length > 0 ? (
                            (() => {
                              const currentYear = new Date().getFullYear().toString();

                              const calculateMaxValueForMonth = (products, month) => {
                                return Math.max(
                                  ...products.map(({ yearsData }) =>
                                    Object.keys(yearsData).reduce((max, year) => {
                                      const valueString = yearsData[year]?.[month];
                                      const numericValue = valueString ? parseFloat(valueString.split(" ")[0]) : 0;
                                      return Math.max(max, numericValue);
                                    }, 0)
                                  ),
                                  0
                                );
                              };

                              const calculateTotalValueForCurrentYear = (yearsData) => {
                                if (!yearsData[currentYear]) return 0;
                                return Object.values(yearsData[currentYear]).reduce((total, valueString) => {
                                  const numericValue = valueString ? parseFloat(valueString.split(" ")[0]) : 0;
                                  return total + numericValue;
                                }, 0);
                              };

                              const brandMaxValues = Object.entries(BrandDimension.values).map(
                                ([brand, yearsData]) => {
                                  const overallTotal = (BrandDimension?.years || []).reduce((total, year) => {
                                    const yearlySum = Object.values(yearsData[year] || {}).reduce((sum, valueString) => {
                                      const numericValue = valueString ? parseFloat(valueString.split(" ")[0]) : 0;
                                      return sum + numericValue;
                                    }, 0);
                                    return total + yearlySum;
                                  }, 0);

                                  const currentYearTotal = calculateTotalValueForCurrentYear(yearsData);

                                  const maxBrandValue = Math.max(
                                    ...(BrandDimension?.years || []).flatMap((year) =>
                                      months
                                        .map((month) => {
                                          const valueString = yearsData[year]?.[month];
                                          return valueString && !valueString.includes("0.0%")
                                            ? parseFloat(valueString.replace(/[\(\)%]/g, "").split(" ")[0])
                                            : null;
                                        })
                                        .filter((value) => value !== null)
                                    )
                                  );

                                  return { brand, maxBrandValue, yearsData, overallTotal, currentYearTotal };
                                }
                              );

                              // Sorting by year-wise total for all years
                              brandMaxValues.sort((a, b) => {
                                const aYearTotal = BrandDimension.years.reduce((sum, year) => {
                                  return sum + Object.values(a.yearsData[year] || {}).reduce((yearSum, val) => {
                                    const numericValue = val ? parseFloat(val.split(" ")[0]) : 0;
                                    return yearSum + numericValue;
                                  }, 0);
                                }, 0);

                                const bYearTotal = BrandDimension.years.reduce((sum, year) => {
                                  return sum + Object.values(b.yearsData[year] || {}).reduce((yearSum, val) => {
                                    const numericValue = val ? parseFloat(val.split(" ")[0]) : 0;
                                    return yearSum + numericValue;
                                  }, 0);
                                }, 0);

                                return bYearTotal - aYearTotal;
                              });

                              const calculateOpacity = (value, maxValue) => {
                                if (value === null || maxValue === 0) return 0.1;
                                const opacity = value / maxValue;
                                return opacity < 0.1 ? 0.1 : opacity;
                              };

                              return brandMaxValues.map(({ brand, yearsData, maxBrandValue, overallTotal, currentYearTotal }) => (
                                <tr key={brand} className="bg-white">
                                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                    {brand}
                                  </td>
                                  {BrandDimension?.years?.map((year) =>
                                    months.map((month) => {
                                      if (month === "Total") {
                                        const yearTotal = Object.values(yearsData[year] || {}).reduce((sum, val) => {
                                          const num = val ? parseFloat(val.split(" ")[0]) : 0;
                                          return sum + num;
                                        }, 0);

                                        return (
                                          <td
                                            key={`${year}-${month}`}
                                            className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          >
                                            {formatValueString(yearTotal.toFixed(2) ?? "0")}
                                          </td>
                                        );
                                      }

                                      const valueString = yearsData[year]?.[month];
                                      const numericValue = valueString
                                        ? parseFloat(valueString.replace(/[\(\)%]/g, "").split(" ")[0])
                                        : null;

                                      const backgroundColor =
                                        numericValue !== null
                                          ? `rgba(5, 127, 163, ${calculateOpacity(numericValue, maxBrandValue)})`
                                          : "transparent";

                                      return (
                                        <td
                                          key={`${year}-${month}`}
                                          className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                          style={{ backgroundColor }}
                                        >
                                          {valueString && numericValue !== null
                                            ? `${formatValueString(numericValue.toFixed(2))} ${valueString.split(" ")[1]}`
                                            : "0"}
                                        </td>
                                      );
                                    })
                                  )}
                                </tr>
                              ));
                            })()
                          ) : (
                            <tr>
                              {!isFetching3 && (
                                <td
                                  style={{ border: "none" }}
                                  colSpan={months.length + 1}
                                  className="px-2 py-2 text-center text-gray-600"
                                >
                                  No Data Available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>



                      </table>
                      {isFetching3 && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>

                    {/*  Item Dimension */}
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Item Dimension
                    </h3>
                    <div
                      className="overflow-x-auto max-h-[400px]"
                      onScroll={(e) => handleScrol9(e, "ItemDimension")}
                      style={{ height: "359px", overflow: "auto", border: '1px solid #80808075' }}
                    >
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              FY
                            </th>
                            {ItemDimension &&
                              ItemDimension?.years?.map((year) => (
                                <th
                                  style={{ background: "#1C3644" }}
                                  className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                  colSpan={months.length}
                                  key={year}
                                >
                                  {year}
                                </th>
                              ))}
                          </tr>
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Item
                            </th>
                            {ItemDimension &&
                              ItemDimension.years &&
                              ItemDimension.years
                                .sort((a, b) => b - a)
                                ?.map((year) =>
                                  months && months.length > 0 ? (
                                    months.map((month) => (
                                      <th
                                        style={{ background: "#1C3644" }}
                                        key={`${year}-${month}`}
                                        className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                      >
                                        {month}
                                      </th>
                                    ))
                                  ) : (
                                    <th
                                      style={{ background: "#1C3644" }}
                                      key={`empty-${year}`}
                                      className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                                    >
                                      No Months Available
                                    </th>
                                  )
                                )}

                          </tr>
                        </thead>
                        <tbody>
                          {ItemDimension && ItemDimension.values && Object.keys(ItemDimension.values).length > 0 ? (
                            (() => {
                              const currentYear = new Date().getFullYear();
                              const currentMonthName = months[new Date().getMonth()]; // Get the name of the current month
                              const allValues = [];

                              // Collect all numeric values to determine the true global maximum for opacity scaling
                              Object.values(ItemDimension.values).forEach((yearsData) => {
                                Object.values(yearsData).forEach((monthsData) => {
                                  months.forEach((month) => {
                                    const valueString = monthsData?.[month] || "0.0%";
                                    const numericValue = parseFloat(valueString.split(" ")[0]) || 0;
                                    if (numericValue > 0) allValues.push(numericValue);
                                  });
                                });
                              });

                              const trueMaxValue = Math.max(...allValues, 1); // Prevent division by zero

                              const calculateOpacity = (value) => {
                                console.log(value);

                                if (value <= 0 || isNaN(value)) return 0.1;
                                if (value === trueMaxValue) return 1;
                                return Math.max(0.3, value / trueMaxValue);
                              };

                              const sortedItems = Object.entries(ItemDimension.values || {})
                                .map(([item, yearsData]) => {
                                  // Get highest value for the current year and month
                                  const currentMonthValue = (() => {
                                    const yearData = yearsData[currentYear];
                                    if (yearData && currentMonthName) {
                                      const valueString = yearData?.[currentMonthName] || "0.0%";
                                      return parseFloat(valueString.split(" ")[0]) || 0;
                                    }
                                    return 0;
                                  })();

                                  // Calculate overall highest value across all months and years
                                  const highestMonthValues = months.map((month) => {
                                    let highestValue = 0;
                                    Object.values(yearsData).forEach((yearsDataYear) => {
                                      const valueString = yearsDataYear?.[month] || "0.0%";
                                      const numericValue = (valueString?.split(" ")[0]) || 0;
                                      if (numericValue > highestValue) {
                                        highestValue = numericValue;
                                      }
                                    });
                                    return highestValue;
                                  });

                                  const highestValueForItem = Math.max(...highestMonthValues);
                                  return { item, yearsData, currentMonthValue, highestValueForItem };
                                })
                                // First sort by current month value, then fallback to overall highest value
                                .sort((a, b) => b.currentMonthValue - a.currentMonthValue || b.highestValueForItem - a.highestValueForItem);

                              return sortedItems.map(({ item, yearsData }) => (
                                <tr key={item} className="bg-white">
                                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                    {item}
                                  </td>
                                  {ItemDimension?.years
                                    ?.sort((a, b) => b - a)
                                    ?.map((year) =>
                                      months.map((month) => {
                                        if (month === "Total") {
                                          const yearTotal = Object.values(yearsData[year] || {}).reduce((sum, val) => {
                                            const num = val ? parseFloat(val.split(" ")[0]) : 0;
                                            return sum + num;
                                          }, 0);

                                          return (
                                            <td
                                              key={`${year}-${month}`}
                                              className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                            >
                                              {formatValueString (yearTotal.toFixed(2) ?? "0")}
                                            </td>
                                          );
                                        }


                                        const valueString = yearsData?.[year]?.[month] || null;

                                        const numericValue = (valueString?.split(" ")[0]) || 0;
                                        const percentageText = valueString?.split(" ")[1] || "";
                                        const isZeroValue = numericValue === 0 || percentageText === "0.0%";

                                        const backgroundColor = !isZeroValue
                                          ? `rgba(5, 127, 163, ${calculateOpacity(numericValue)})`
                                          : "transparent";

                                        const displayValue = !isZeroValue
                                          ? `${formatValueString(numericValue)} ${percentageText}`
                                          : "0";



                                        // const numericValue = (valueString?.split(" ")[0]) || 0;

                                        // const backgroundColor =
                                        //   numericValue > 0 && !isNaN(numericValue)
                                        //     ? `rgba(5, 127, 163, ${calculateOpacity(numericValue)})`
                                        //     : "transparent";

                                        // const displayValue =
                                        // valueString !== "0.0%" && numericValue !== 0
                                        //     ? `${formatNumber(numericValue)} ${valueString.split(" ")[1] || ""}`
                                        //     : "0";

                                        return (
                                          <td
                                            key={`${year}-${month}`}
                                            className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                            style={{ backgroundColor }}
                                          >
                                            {displayValue || "0"}
                                          </td>
                                        );
                                      })
                                    )}
                                </tr>
                              ));
                            })()
                          ) : (
                            <tr>
                              {!isFetching4 && (
                                <td
                                  style={{ border: "none" }}
                                  colSpan={ItemDimension?.years?.length * months.length + 1}
                                  className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                >
                                  No data available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>








                      </table>
                      {isFetching4 && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <br />
              </div>
            </div>


            <div class="d-flex" style={{
              gap: "8px",
              width: "100%"
            }}>
              <div style={{
                background: " #1C3644",
                width: "3%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column"
              }}
              >
                <div class="rotated-text" >
                  Price Analysis
                </div>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid #1C3644",
                width: "97%",
              }}>
                {/*  Price Breakup1 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Price Breakup1
                    </h3>
                    <div className="overflow-x-auto max-h-[330px]" style={{ border: '1px solid #80808075' }}>
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Price Breakup 1
                            </th>
                            {PriceBreakup1?.years?.map((year) => (
                              <th
                                style={{ background: "#1C3644" }}
                                key={year}
                                className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                              >
                                {year}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {PriceBreakup1 && PriceBreakup1.values && PriceBreakup1.years && Object.keys(PriceBreakup1.values).length > 0 ? (
                            (() => {
                              const sortedEntries = Object.entries(PriceBreakup1.values).sort(
                                ([rangeA], [rangeB]) => {
                                  const rangeEndA = parseInt(rangeA.split('-')[1], 10);
                                  const rangeEndB = parseInt(rangeB.split('-')[1], 10);
                                  return rangeEndA - rangeEndB;
                                }
                              );

                              const numericValues = Object.entries(PriceBreakup1.values).flatMap(
                                ([, yearValues]) =>
                                  PriceBreakup1?.years?.map((year) => {
                                    const valueString = yearValues[year];
                                    return valueString ? parseFloat(valueString) : 0;
                                  })
                              );

                              const maxPriceValue = Math.max(...numericValues);

                              const calculateOpacity = (value) => {
                                if (maxPriceValue === 0) return 0.1;
                                const opacity = value / maxPriceValue;
                                return Math.max(opacity, 0.1);
                              };

                              return sortedEntries.map(([range, yearValues]) => (
                                <tr key={range}>
                                  <td className="px-2 py-2 border-b border-gray-200 text-sm text-center">
                                    {range}
                                  </td>
                                  {PriceBreakup1?.years?.map((year) => {
                                    const valueString = yearValues[year];
                                    const numericValue = valueString ? parseFloat(valueString) : 0;
                                    const backgroundColor = valueString
                                      ? `rgba(5, 127, 163, ${calculateOpacity(numericValue)})`
                                      : "transparent";
                                    console.log(valueString);

                                    return (
                                      <td
                                        key={year}
                                        className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                        style={{ backgroundColor }}
                                      >
                                        {formatValueString(valueString) || '0'}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ));
                            })()
                          ) : (
                            <tr>
                              {!isFetching7 && (
                                <td style={{ border: 'none' }}
                                  colSpan={PriceBreakup1?.years?.length + 1}
                                  className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center"
                                >
                                  No Data Available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {isFetching7 && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/*  Price Breakup2 */}
                  <div>
                    <h3 className="text-l font-medium text-center text-gray-900 dark:text-white py-2">
                      Price Breakup2
                    </h3>
                    <div className="overflow-x-auto max-h-[330px]" style={{ border: '1px solid #80808075' }}>
                      <table className="w-full leading-normal m-0">
                        <thead className="sticky top-0">
                          <tr>
                            <th
                              style={{ background: "#1C3644" }}
                              className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                            >
                              Price Breakup 2
                            </th>
                            {PriceBreakup2?.years?.map((year) => (
                              <th
                                style={{ background: "#1C3644" }}
                                key={year}
                                className="px-2 py-2 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-100 uppercase text-center"
                              >
                                {year}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {PriceBreakup2 && PriceBreakup2.values && PriceBreakup2.years && Object.keys(PriceBreakup2.values).length > 0 ? (
                            (() => {
                              const numericValues = Object.entries(PriceBreakup2.values).flatMap(
                                ([, yearValues]) =>
                                  PriceBreakup2?.years?.map((year) => {
                                    const valueString = yearValues[year];
                                    return valueString ? parseFloat(valueString) : 0;
                                  })
                              );
                              const maxPriceValue = Math.max(...numericValues);
                              const calculateOpacity = (value) => {
                                if (maxPriceValue === 0) return 0.1;
                                const opacity = value / maxPriceValue;
                                return Math.max(opacity, 0.1);
                              };
                              const sortedEntries = Object.entries(PriceBreakup2.values).sort(
                                ([rangeA], [rangeB]) => {
                                  const startA = parseInt(rangeA.split('-')[0], 10);
                                  const startB = parseInt(rangeB.split('-')[0], 10);
                                  return startA - startB;
                                }
                              );
                              return sortedEntries.map(([range, yearValues]) => (
                                <tr key={range}>
                                  <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                                    {range}
                                  </td>
                                  {PriceBreakup2?.years?.map((year) => {
                                    const valueString = yearValues[year];
                                    const numericValue = valueString ? parseFloat(valueString) : 0;
                                    const backgroundColor = valueString
                                      ? `rgba(5, 127, 163, ${calculateOpacity(numericValue)})`
                                      : "transparent";
                                    return (
                                      <td
                                        key={year}
                                        className="px-2 py-2 border-b border-gray-200 text-sm text-center"
                                        style={{ backgroundColor }}
                                      >
                                        {formatValueString(valueString) || '0'}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ));
                            })()
                          ) : (
                            <tr>
                              {!isFetching8 && (
                                <td style={{ border: 'none' }}
                                  colSpan={PriceBreakup2?.years?.length + 1}
                                  className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center"
                                >
                                  No Data Available
                                </td>
                              )}
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {isFetching8 && (
                        <div className="text-center text-gray-600 py-2">
                          <div className="spinner-border gray-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 
      {popup && (
      <div className="error-popup-overlay">
      <div className="error-popup">
        <h2 className="error-popup-title">Internal Server Error</h2>
        <p className="error-popup-message">{message||"Something went wrong. Please try again later."}</p>
        <button className="error-popup-button" >
          Close
        </button>
      </div>
    </div>
    )} */}

    </div>
  );
}

export default SalesAllinone;
