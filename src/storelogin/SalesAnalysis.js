import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/overall.css";
import "flowbite/dist/flowbite.css";
import "../style/table.css";
import SelectArrow from "../images/ArrowDn.png";
import Select from "react-select";
import { filter } from "d3";
const SalesAnalysis = () => {
  const salesData = {
    totalSales: "2.19 Cr",
  };
  const [placeholdersale, setPlaceholdersale] = useState("All");
  const [placeholderselection, setPlaceholderselection] = useState("All");
  const [placeholderbrand, setPlaceholderbrand] = useState("All");
  const [placeholderitemn, setPlaceholderitemn] = useState("All");
  const [placeholdermodle, setPlaceholdermodle] = useState("All");
  const [placeholderbranch, setPlaceholderbranch] = useState("All");
  const [placeholderdemo, setPlaceholderdemo] = useState("All");

  const [placeholdersrn, setPlaceholdersrn] = useState("All");
  const [placeholderprice, setPlaceholderprice] = useState("All");
  const [activeButton, setActiveButton] = useState(true);
  const [SalesType, setSalesType] = useState([]);
  const [Sections, setSections] = useState([]);

  const [SalesCity, setSalesCity] = useState([]);
  const [BrandSales, setBrandSales] = useState([]);
  const [BrandItem, setBrandItem] = useState([]);
  const [DiscountBranch, setDiscountBranch] = useState([]);
  const [DiscountCity, setDiscountCity] = useState([]);
  const [DiscountSection, setDiscountSection] = useState([]);
  const [DiscountBrand, setDiscountBrand] = useState([]);
  const [DiscountModelNo, setDiscountModelNo] = useState([]);
  const [top10BrandItems, settop10BrandItems] = useState([]);
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: "",
  });
  const [tempCustom, setTempCustom] = useState({
    from: "",
    to: "",
  });
  const [asm, setasm] = useState(null);
  let lastScrollTop = 0;
  // const sortedBrandSales = [...BrandSales].sort(
  //   (a, b) => b.total_sales - a.total_sales
  // );

  // const top10Brands = sortedBrandSales.slice(0, 10);

  // const sortedBrandItem = [...BrandItem].sort(
  //   (a, b) => b.total_sales - a.total_sales
  // );

  // const top10Item = sortedBrandItem.slice(0, 10);
  const [sortConfig5, setSortConfig5] = useState({
    key: "total_sales",
    direction: "desc",
  });
  const maxSalesValue = Math.max(
    ...SalesType.map((item) => Math.abs(item.total_sales)),
    1
  );
  const handleSort6 = (key) => {
    let direction = "asc";
    if (sortConfig5.key === key && sortConfig5.direction === "asc") {
      direction = "desc";
    }
    setSortConfig5({ key, direction });
  };

  const sortedBrandSales = [...BrandSales].sort((a, b) => {
    if (sortConfig5.direction === "asc") {
      return a[sortConfig5.key] > b[sortConfig5.key] ? 1 : -1;
    } else {
      return a[sortConfig5.key] < b[sortConfig5.key] ? 1 : -1;
    }
  });

  const top10Brands = sortedBrandSales.slice(0, 10);
  const [sortConfig6, setSortConfig6] = useState({
    key: "total_sales",
    direction: "desc",
  });

  const handleSort7 = (key) => {
    let direction = "asc";
    if (sortConfig6.key === key && sortConfig6.direction === "asc") {
      direction = "desc";
    }
    setSortConfig6({ key, direction });
  };

  const sortedBrandItem = [...BrandItem].sort((a, b) => {
    if (sortConfig6.direction === "asc") {
      return a[sortConfig6.key] > b[sortConfig6.key] ? 1 : -1;
    } else {
      return a[sortConfig6.key] < b[sortConfig6.key] ? 1 : -1;
    }
  });

  const top10Item = sortedBrandItem.slice(0, 10);
  const maxValue = Math.max(
    ...SalesType.map((item) => Math.abs(item.total_sales))
  );
  const minValue = Math.min(...SalesType.map((item) => item.total_sales));

  const [period1, setPeriod1] = useState({ from: "", to: "" });
  const [initialPeriod, setInitialPeriod] = useState({
    from: "",
    to: "",
  });
  const lastFetchedPage = useRef(0);
  const [periodtemp, setPeriodtemp] = useState({ from: "", to: "" });
  const [tempPeriod1, setTempPeriod1] = useState({ from: "", to: "" });
  const [tempPeriod2, setTempPeriod2] = useState({
    from: "",
    to: "",
  });
  const handleButtonClick = () => {
    setIsApplyDisabled(false);
    setClickedButton("LMTD vs MTD");
    const today = new Date();

    const firstDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const period1From = formatDate(firstDayCurrentMonth);
    const period1To = formatDate(yesterday);
    setPeriodtemp({ from: period1From, to: period1To });
    setPeriod1({ from: period1From, to: period1To });

    setIsDisabled(false);
    setActiveButton("LMTD");
  };

  const handleButtonClickYtd = () => {
    setActiveButton("LYTD");
    setIsDisabled(false);
    setClickedButton("LYTD vs YTD");

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split("T")[0];

    const financialYearStart =
      currentMonth < 4 ? `${currentYear - 1}-04-01` : `${currentYear}-04-01`;
    setPeriodtemp({ from: financialYearStart, to: formattedYesterday });
    setPeriod1({ from: financialYearStart, to: formattedYesterday });
    setIsApplyDisabled(false);
  };

  const handleButtonClickyday = () => {
    setIsApplyDisabled(false);
    setActiveButton("YDAY");
    setIsDisabled(false);
    setClickedButton("YDAY");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const formattedYesterday = yesterday.toISOString().split("T")[0];
    setPeriodtemp({ from: formattedYesterday, to: formattedYesterday });
    setPeriod1({ from: formattedYesterday, to: formattedYesterday });
  };
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handlePeriodChange = (e, setPeriod1) => {
    const { id, value } = e.target;
    setPeriod1((prev) => ({ ...prev, [id]: value }));
    setIsApplyDisabled(false);
  };
  const checkIfDatesAreValid = () => {
    if (period1.from && period1.to) {
      setIsApplyDisabled(false);
    } else {
      setIsApplyDisabled(true);
    }
  };
  // useEffect(() => {
  //   handleButtonClickyday();
  // }, []);
  useEffect(() => {
    initializePageData();
  }, []);

  const initializePageData = () => {
    setIsFiltersUpdated(true);
    handleButtonClickyday();
  };

  // useEffect(() => {
  //   // const storecode= sessionStorage.getItem("asm");

  //   // setasm(asm);
  //   // if (period1.from && period1.to) {
  //   fetchDropdownData();
  //   fetchSalesType();
  //   fetchSections(1, true);
  //   fetchItemCategory(1, true);
  //   fetchSalesProduct(1, true);
  //   fetchSalesBranch(1, true);
  //   fetchSalesCity(1, true);
  //   fetchBrandSales(1, true);
  //   fetchBrandItem(1, true);
  //   fetchDiscountBranch(1, true);
  //   fetchDiscountCity(1, true);
  //   fetchDiscountSection(1, true);
  //   fetchDiscountBrand(1, true);
  //   fetchDiscountModelNo(1, true);
  //   fetchSales1();
  //   fetchSales2();
  //   fetchSales3();
  //   fetchliveData();
  //   // }
  // }, [period1]);

  // useEffect(() => {
  //   if (period1.from && period1.to) {
  //     setSections([]);
  //     setSalesType([]);
  //     setItemCategory([]);
  //     setSalesProduct([]);
  //     setSalesBranch([]);
  //     setBrandItem([]);
  //     setDiscountBranch([]);
  //     setDiscountCity([]);
  //     setDiscountSection([]);
  //     setDiscountBrand([]);
  //     setDiscountModelNo([]);
  //     setBrandSales([]);
  //     setSalesCity([]);
  //     setSalesContributionPage(1);
  //     setItemCategoryPage(1);
  //     setSalesproductPage(1);
  //     setSalesBranchPage(1);
  //     setSalesCityPage(1);
  //     setBrandSalePage(1);
  //     setBrandItemPage(1);
  //     setDiscountBranchPage(1);
  //     setDiscountCitypage(1);
  //     setDiscountSectionPage(1);
  //     setDiscountBrandpage(1);
  //     setDiscountModelPage(1);
  //   }
  // }, [period1]);
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
    srnfillter: [],
    PriceBreakup2: [],
    sale_type: [],
    item_category: [],
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
    srnfillter: "",
    PriceBreakup2: "",
    sale_type: "",
    item_category: "",
  });
  const [isFiltersUpdated, setIsFiltersUpdated] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const reloadWithFilters = () => {
    setrefresh(true);
    setsalesData1([]);
    setsalesData2([]);
    setsalesData3([]);
    setSections([]);
    setSalesType([]);
    setSections([]);

    setBrandItem([]);

    setDiscountSection([]);
    setDiscountBrand([]);
    setDiscountModelNo([]);
    setBrandSales([]);

    setSalesContributionPage(1);

    setBrandSalePage(1);
    setBrandItemPage(1);

    setDiscountSectionPage(1);
    setDiscountBrandpage(1);
    setDiscountModelPage(1);
    // fetchDropdownData();
    console.log("dddddddddddd22222222222222222");
    setIsFiltersUpdated(true);
  };
  useEffect(() => {
    if (isFiltersUpdated) {
      setInitialFilters({ filters, period1 });
      setSalesContributionPage(1);

      setBrandSalePage(1);
      setBrandItemPage(1);

      setDiscountSectionPage(1);
      setDiscountBrandpage(1);
      setDiscountModelPage(1);
      setSections([]);
      setSalesType([]);
      setSections([]);

      setBrandItem([]);

      setDiscountSection([]);
      setDiscountBrand([]);
      setDiscountModelNo([]);
      setBrandSales([]);

      setsalesData1([]);
      setsalesData2([]);
      setsalesData3([]);
      fetchData();
      console.log("dddddddddddd111111111111111111");
      setIsFiltersUpdated(false);
      const queryString = new URLSearchParams(filters).toString();
      const baseUrl = "sales_analysis_kore/";
      const clearedUrl = `${baseUrl}?${queryString}`;
      console.log("API URL being called:", clearedUrl);
      // fetchDropdownData();
      fetchliveData();
      fetchSales1();
      fetchSales2();
      fetchSales3();
      fetchSalesType();
      fetchSections(1);
      // fetchItemCategory(1);
      // fetchSalesProduct(1);

      // fetchSalesBranch(1);
      // fetchSalesCity(1);
      fetchBrandSales(1);
      fetchBrandItem(1);
      // fetchDiscountBranch(1);
      // fetchDiscountCity(1);
      fetchDiscountSection(1);
      fetchDiscountBrand(1);
      fetchDiscountModelNo(1);
      fetchDropdownData();

      // fetchData();
    }
  }, [filters, isFiltersUpdated]);

  const reloadRefresh = () => {
    setIsFiltersUpdated(true);
    handleButtonClickyday();

    setSections([]);
    setSalesType([]);
    setSections([]);

    setBrandItem([]);

    setDiscountSection([]);
    setDiscountBrand([]);
    setDiscountModelNo([]);
    setBrandSales([]);

    setSalesType([]);
    setsalesData1([]);
    setsalesData2([]);
    setsalesData3([]);
    setSalesContributionPage(1);

    setBrandSalePage(1);
    setBrandItemPage(1);

    setDiscountSectionPage(1);
    setDiscountBrandpage(1);

    setDiscountModelPage(1);
    // fetchDropdownData();
    // fetchSalesType();
    // fetchSections();
    // fetchItemCategory();
    // fetchSalesProduct();
    // fetchSalesBranch();
    // fetchSalesCity();
    // fetchBrandSales();
    // fetchBrandItem();
    // fetchDiscountBranch();
    // fetchDiscountCity();
    // fetchDiscountSection();
    // fetchDiscountBrand();
    // fetchDiscountModelNo();

    setFilters({
      city: "",
      store_name: "",
      item_description: "",
      brand_name: "",
      product_group: "",
      section: "",
      model_no: "",
      srn_flag: "",
      demo_flag: "",
      srnfillter: "",
      PriceBreakup2: "",
      sale_type: "",
      item_category: "",
    });
    setDropdownData({
      store_name: [],
      city: [],
      item_description: [],
      brand_name: [],
      product_group: [],
      section: [],
      model_no: [],
      srn_flag: [],
      demo_flag: [],
      srnfillter: [],
      PriceBreakup2: [],
      sale_type: [],
      item_category: [],
    });
    setSelectedOptionsrn(null);
    setDropdownData((prevData) => ({
      ...prevData,
      srn_flag: [],
    }));
    setSelectedOptionsale(null);
    setDropdownData((prevData) => ({
      ...prevData,
      sale_type: [],
    }));
    setSelectedOptionsection(null);
    setDropdownData((prevData) => ({
      ...prevData,
      section: [],
    }));
    setSelectedOptionitemc(null);
    setDropdownData((prevData) => ({
      ...prevData,
      item_category: [],
    }));
    setSelectedOptionproduct(null);
    setDropdownData((prevData) => ({
      ...prevData,
      product_group: [],
    }));
    setSelectedOptionbrand(null);
    setDropdownData((prevData) => ({
      ...prevData,
      brand_name: [],
    }));
    setSelectedOptionmodle(null);
    setDropdownData((prevData) => ({
      ...prevData,
      model_no: [],
    }));
    setSelectedOptionitemd(null);
    setDropdownData((prevData) => ({
      ...prevData,
      item_description: [],
    }));
    setSelectedOptionbranch(null);
    setDropdownData((prevData) => ({
      ...prevData,
      store_name: [],
    }));
    setSelectedOptioncity(null);
    setDropdownData((prevData) => ({
      ...prevData,
      city: [],
    }));
    setSelectedOptiondemo(null);
    setDropdownData((prevData) => ({
      ...prevData,
      demo_flag: [],
    }));
    setSelectedOptionprice(null);
    setDropdownData((prevData) => ({
      ...prevData,
      PriceBreakup2: [],
    }));
    // setPeriod1({
    //   from: "",
    //   to: "",
    // });
    setrefresh(false);
  };
  //sort

  //itemcat
  const minQtyitem = Math.min(
    ...Sections.map((section) => section.total_sales)
  );
  const maxQtyitem = Math.max(
    ...Sections.map((section) => section.total_sales)
  );
  const minValueitem = Math.min(
    ...Sections.map((section) => section.total_sales_percentage)
  );
  const maxValueitem = Math.max(
    ...Sections.map((section) => section.total_sales_percentage)
  );
  const minPercentageitem = Math.min(...Sections.map((section) => section.asp));
  const maxPercentageitem = Math.max(...Sections.map((section) => section.asp));
  //product

  //branch

  //city
  const minQtyitemcity = Math.min(
    ...SalesCity.map((section) => section.total_sales)
  );
  const maxQtyitemcity = Math.max(
    ...SalesCity.map((section) => section.total_sales)
  );
  const minValueitemcity = Math.min(
    ...SalesCity.map((section) => section.total_sales_percentage)
  );
  const maxValueitemcity = Math.max(
    ...SalesCity.map((section) => section.total_sales_percentage)
  );
  const minPercentageitemcity = Math.min(
    ...SalesCity.map((section) => section.asp)
  );
  const maxPercentageitemcity = Math.max(
    ...SalesCity.map((section) => section.asp)
  );

  const minSalescity = Math.min(
    ...SalesCity.map((section) => section.sales_qty)
  );
  const maxSalescity = Math.max(
    ...SalesCity.map((section) => section.sales_qty)
  );

  const minSalesQtyPercentagecity = Math.min(
    ...SalesCity.map((section) => section.salesQtyPercentage)
  );
  const maxSalesQtyPercentagecity = Math.max(
    ...SalesCity.map((section) => section.salesQtyPercentage)
  );
  //dis branch

  //section
  const minQtyitemdissection = Math.min(
    ...DiscountSection.map((section) => section.total_sales)
  );
  const maxQtyitemdissection = Math.max(
    ...DiscountSection.map((section) => section.total_sales)
  );
  const minValueitemdissection = Math.min(
    ...DiscountSection.map((section) => section.disc_amt_percentage)
  );
  const maxValueitemdissection = Math.max(
    ...DiscountSection.map((section) => section.disc_amt_percentage)
  );
  const minPercentageitemdissection = Math.min(
    ...DiscountSection.map((section) => section.disc_amt)
  );
  const maxPercentageitemdissection = Math.max(
    ...DiscountSection.map((section) => section.disc_amt)
  );
  //brand
  const minQtyitemdisbrand = Math.min(
    ...DiscountBrand.map((section) => section.total_sales)
  );
  const maxQtyitemdisbrand = Math.max(
    ...DiscountBrand.map((section) => section.total_sales)
  );
  const minValueitemdisbrand = Math.min(
    ...DiscountBrand.map((section) => section.disc_amt_percentage)
  );
  const maxValueitemdisbrand = Math.max(
    ...DiscountBrand.map((section) => section.disc_amt_percentage)
  );
  const minPercentageitemdisbrand = Math.min(
    ...DiscountBrand.map((section) => section.disc_amt)
  );
  const maxPercentageitemdisbrand = Math.max(
    ...DiscountBrand.map((section) => section.disc_amt)
  );

  //model
  const minQtyitemdismodel = Math.min(
    ...DiscountModelNo.map((section) => section.total_sales)
  );
  const maxQtyitemdismodel = Math.max(
    ...DiscountModelNo.map((section) => section.total_sales)
  );
  const minValueitemdismodel = Math.min(
    ...DiscountModelNo.map((section) => section.disc_amt_percentage)
  );
  const maxValueitemdismodel = Math.max(
    ...DiscountModelNo.map((section) => section.disc_amt_percentage)
  );
  const minPercentageitemdismodel = Math.min(
    ...DiscountModelNo.map((section) => section.disc_amt)
  );
  const maxPercentageitemdismodel = Math.max(
    ...DiscountModelNo.map((section) => section.disc_amt)
  );
  //brd sales
  const minQtyitembrandsales = Math.min(
    ...sortedBrandSales.map((section) => section.total_sales)
  );
  const maxQtyitembrandsales = Math.max(
    ...sortedBrandSales.map((section) => section.total_sales)
  );
  const minValueitembrandsales = Math.min(
    ...sortedBrandSales.map((section) => section.total_sales_percentage)
  );
  const maxValueitembrandsales = Math.max(
    ...sortedBrandSales.map((section) => section.total_sales_percentage)
  );
  const minPercentageitembrandsales = Math.min(
    ...sortedBrandSales.map((section) => section.asp)
  );
  const maxPercentageitembrandsales = Math.max(
    ...sortedBrandSales.map((section) => section.asp)
  );

  const minSalesbrandsales = Math.min(
    ...sortedBrandSales.map((section) => section.sales_qty)
  );
  const maxSalesbrandsales = Math.max(
    ...sortedBrandSales.map((section) => section.sales_qty)
  );

  const minSalesQtyPercentagebrandsales = Math.min(
    ...sortedBrandSales.map((section) => section.salesQtyPercentage)
  );
  const maxSalesQtyPercentagebrandsales = Math.max(
    ...sortedBrandSales.map((section) => section.salesQtyPercentage)
  );

  //branchitem
  const minQtyitembranditem = Math.min(
    ...sortedBrandItem.map((section) => section.total_sales)
  );
  const maxQtyitembranditem = Math.max(
    ...sortedBrandItem.map((section) => section.total_sales)
  );
  const minValueitembranditem = Math.min(
    ...sortedBrandItem.map((section) => section.total_sales_percentage)
  );
  const maxValueitembranditem = Math.max(
    ...sortedBrandItem.map((section) => section.total_sales_percentage)
  );
  const minPercentageitembranditem = Math.min(
    ...sortedBrandItem.map((section) => section.asp)
  );
  const maxPercentageitembranditem = Math.max(
    ...sortedBrandItem.map((section) => section.asp)
  );

  const minSalesbranditem = Math.min(
    ...sortedBrandItem.map((section) => section.sales_qty)
  );
  const maxSalesbranditem = Math.max(
    ...sortedBrandItem.map((section) => section.sales_qty)
  );

  const minSalesQtyPercentagebranduitem = Math.min(
    ...sortedBrandItem.map((section) => section.salesQtyPercentage)
  );
  const maxSalesQtyPercentagebranditem = Math.max(
    ...sortedBrandItem.map((section) => section.salesQtyPercentage)
  );

  const calculateOpacity1 = (percentage) => {
    if (!percentage) return 0.1;
    const numericValue = parseFloat(percentage.replace("%", ""));
    const minOpacity = 0.1;
    const maxOpacity = 1;
    return minOpacity + (numericValue / 100) * (maxOpacity - minOpacity);
  };

  const calculateOpacity = (value, min, max) => {
    if (min === max) return min === 0 ? 0.1 : 1;
    const minOpacity = 0.1;
    const maxOpacity = 1;
    return (
      minOpacity + ((value - min) / (max - min)) * (maxOpacity - minOpacity)
    );
  };

  //handlescroll

  const handleSectionScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataSection &&
      !SalesContributionloading &&
      SalesContributionpage > 1
    ) {
      fetchSections(SalesContributionpage);
    }
  };

  // const handleItemcatScroll = (e) => {
  //   const { scrollTop, scrollHeight, clientHeight } = e.target;
  //   if (
  //     scrollHeight - scrollTop <= clientHeight + 50 &&
  //     hasMoreDataItemcategory &&
  //     !ItemCategoryloading &&
  //     ItemCategorypage > 1
  //   ) {
  //     fetchItemCategory(ItemCategorypage);
  //   }
  // };

  const handleBrandSalesScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataBrandSale &&
      !BrandSalesloading &&
      BrandSalepage > 1
    ) {
      fetchBrandSales(BrandSalepage);
    }
  };
  // const handleBrandSalesScroll = (e) => {
  //   // if (finalsize > 0) {
  //   const { scrollHeight, scrollTop, clientHeight } = e.target;

  //   const isVerticalScroll = scrollTop !== lastScrollTop;
  //   lastScrollTop = scrollTop;

  //   if (isVerticalScroll && !BrandSalesloading) {
  //     const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

  //     if (isNearBottom) {
  //       setBrandSalePage((prevPage) => {
  //         const newPage = prevPage + 1;

  //         if (newPage !== lastFetchedPage.current) {
  //           console.log(newPage, "Updated WeekAnalysispage");
  //           fetchBrandSales(newPage);
  //           lastFetchedPage.current = newPage;
  //         }

  //         return newPage;
  //       });
  //     }
  //   }
  //   // }
  // };
  const handleBrandItemScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 80 &&
      hasMoreDataBrandItem &&
      !ItemSalesloading &&
      BrandItempage > 1
    ) {
      fetchBrandItem(BrandItempage);
    }
  };

  const handleDiscountsectionScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataDiscountSection &&
      !DiscountSectionloading &&
      DiscountSectionpage > 1
    ) {
      fetchDiscountSection(DiscountSectionpage);
    }
  };

  const handleDiscountbrandScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataDiscountBrand &&
      !DiscountBrandloading &&
      DiscountBrandpage > 1
    ) {
      fetchDiscountBrand(DiscountBrandpage);
    }
  };

  const handleDiscountmodelScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 70 &&
      hasMoreDataDiscountModel &&
      !DiscountModelloading &&
      DiscountModelpage > 1
    ) {
      fetchDiscountModelNo(DiscountModelpage);
    }
  };

  //  const handleDiscountmodelScroll = (e, dataKey) => {
  //   if (hasMoreDataDiscountModel)
  //     const { scrollHeight, scrollTop, clientHeight } = e.target;

  //     const isVerticalScroll = scrollTop !== lastScrollTop;
  //     lastScrollTop = scrollTop;

  //     if (isVerticalScroll) {
  //       const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

  //       if (isNearBottom) {
  //         const fetchMap = {
  //           DiscountModelNo: fetchDiscountModelNo,
  //         };
  //         if (fetchMap[dataKey]) {
  //           fetchMap[dataKey]()
  //             .then(() => {
  //               setDiscountModelloading(false);
  //             })
  //             .catch((error) => {
  //               console.error("Error in lazy loading:", error);
  //               setDiscountModelloading(false);
  //             });
  //         }
  //       }
  //     }
  //   }
  // };
  const [appliedFilters, setAppliedFilters] = useState(true);
  // const [initialFilters, setInitialFilters] = useState(filters);
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);

  const [isApplyDisabled1, setIsApplyDisabled1] = useState(false);
  useEffect(() => {
    if (activeButton === "Customs") {
      if (tempCustom.from === "") {
        setIsApplyDisabled1(true);
        console.log("gdgdgf", isApplyDisabled1);
      }
    } else {
      setIsApplyDisabled1(false);
    }
  }, [tempCustom, activeButton]);

  const [initialFilters, setInitialFilters] = useState({ filters, period1 });
  useEffect(() => {
    if (period1 !== "" && period1 !== "") {
      console.log("Initial Filters:", initialFilters);

      // Ensure required values are available
      if (!initialFilters || !filters || !period1) return;

      // Check if any filter value has changed
      const filtersChanged = Object.keys(filters).some(
        (key) => filters[key] !== initialFilters.filters[key]
      );

      // Check if period1 or period2 have changed
      const periodsChanged =
        period1.from !== initialFilters.period1.from ||
        period1.to !== initialFilters.period1.to;

      // If any changes are detected, enable the button
      const shouldDisable = !(filtersChanged || periodsChanged);

      console.log("Filters Changed:", filtersChanged);
      console.log("Periods Changed:", periodsChanged);
      console.log("Apply Button Disabled:", shouldDisable);

      // Update state only if it has changed
      setIsApplyDisabled((prev) => {
        if (prev !== shouldDisable) {
          console.log("Updating isApplyDisabled to:", shouldDisable);
          return shouldDisable;
        }
        return prev;
      });
    }
  }, [filters, period1, initialFilters]);
  useEffect(() => {
    if (period1 !== "" && period1 !== "") {
      console.log("Initial Filters:", initialFilters);

      // Ensure required values are available
      if (!initialFilters || !filters || !period1) return;

      // Check if any filter value has changed
      const filtersChanged = Object.keys(filters).some(
        (key) => filters[key] !== initialFilters.filters[key]
      );

      // Check if period1 or period2 have changed
      const periodsChanged =
        period1.from !== initialFilters.period1.from ||
        period1.to !== initialFilters.period1.to;

      // If any changes are detected, enable the button
      const shouldDisable = !(filtersChanged || periodsChanged);

      console.log("Filters Changed:", filtersChanged);
      console.log("Periods Changed:", periodsChanged);
      console.log("Apply Button Disabled:", shouldDisable);

      // Update state only if it has changed
      setIsApplyDisabled((prev) => {
        if (prev !== shouldDisable) {
          console.log("Updating isApplyDisabled to:", shouldDisable);
          return shouldDisable;
        }
        return prev;
      });
    }
  }, [filters, period1, initialFilters]);
  // useEffect(() => {
  //   const filtersChanged = Object.keys(filters).some(
  //     (key) => filters[key] !== initialFilters[key]
  //   );
  //   setIsApplyDisabled(!filtersChanged);
  // }, [filters]);

  // useEffect(() => {
  //   const hasFromChanged = period1.from !== initialPeriod.from;
  //   const hasToChanged = period1.to !== initialPeriod.to;
  //   setIsApplyDisabled(hasFromChanged || hasToChanged);
  // }, [period1.from, period1.to, initialPeriod]);
  const [DropdownDataresponse, setDropdownDataresponse] = useState("");
  const controllerRef1 = useRef(null);
  const fetchDropdownData = async () => {
    if (controllerRef1.current) {
      controllerRef1.current.abort();
    }
    controllerRef1.current = new AbortController();
    const signal = controllerRef1.current.signal;
    try {
      const storedname = sessionStorage.getItem("store");
      const storecode =
        storedname === "null" || storedname === null ? "" : storedname;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/salesAnalysisKoreColumn?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&srn_flag=${encodedFilters.srn_flag}&storecode=${storecode}`,
        { signal }
      );
      setDropdownDataresponse(response.statusText);
      setDropdownData(response.data);
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
  const [SalesTypeloading, setSalesTypeloading] = useState(false);
  const [SalesTyperesponse, setSalesTyperesponse] = useState("");
  const controllerRef2 = useRef(null);
  const fetchSalesType = async () => {
    setSalesTypeloading(true);
    if (controllerRef2.current) {
      controllerRef2.current.abort();
    }
    controllerRef2.current = new AbortController();
    const signal = controllerRef2.current.signal;
    try {
      const store = sessionStorage.getItem("store");
      const storecode = store === "null" || store === null ? "" : store;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/salesAnalysisKoreSalestype?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&srn_flag=${encodedFilters.srn_flag}&storecode=${storecode}`,
        { signal }
      );
      setSalesTyperesponse(response.statusText);
      if (response.data && Array.isArray(response.data.data)) {
        const sortedData = response.data.data.sort(
          (a, b) => b.total_sales - a.total_sales
        );

        setSalesType(sortedData);
        // setSalesType(response.data.data);
        console.log("SalesType updated:", response.data.data);
        setSalesTypeloading(false);
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching SalesType Data:", error);
      setSalesTypeloading(false);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setSalesTypeloading(false);
    }
  };

  const [SalesContributionpage, setSalesContributionPage] = useState(1);
  const SalesContributionlimit = 10;
  const [SalesContributionloading, setSalesContributionloading] =
    useState(false);
  const [hasMoreDataSection, setHasMoreDataSection] = useState(true);
  const [Sectionsresponse, setSectionsresponse] = useState("");
  const controllerRef3 = useRef(null);
  const fetchSections = async (page = 1, resetData = false) => {
    if (resetData) {
      setSalesContributionPage(1);
      setSections([]);
      setHasMoreDataSection(true);
    }
    setSalesContributionloading(true);
    if (controllerRef3.current) {
      controllerRef3.current.abort();
    }
    controllerRef3.current = new AbortController();
    const signal = controllerRef3.current.signal;
    try {
      const stored = sessionStorage.getItem("store");
      const storecode = stored === "null" || stored === null ? "" : stored;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/salesAnalysisKoreSection?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&storecode=${storecode}&page=${SalesContributionpage}&limit=${SalesContributionlimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setSectionsresponse(response.statusText);
      console.log("API Response:", response);

      if (response.data && Array.isArray(response.data.data)) {
        const sectionsData = response?.data?.data;
        const sortedData = sectionsData.sort((a, b) => {
          return b.total_sales - a.total_sales;
        });

        // setSections((prevData) =>
        // const combinedData = resetData
        //     ? sortedData
        //     : [...prevData, ...sortedData];

        //   return combinedData.sort((a, b) => b.disc_amt - a.disc_amt);
        // );
        setSections((prevData) => {
          const combinedData = resetData
            ? sortedData
            : [...prevData, ...sortedData];

          return combinedData.sort((a, b) => b.total_sales - a.total_sales);
        });
        // setSalesContributionPage((prevPage) => prevPage + 1);
        if (sortedData.length < SalesContributionlimit) {
          setHasMoreDataSection(false);
        } else {
          setHasMoreDataSection(true);
          setSalesContributionPage(page + 1);
        }
      } else {
        console.error(
          "No more data to fetch or invalid response:",
          response.data
        );
        setHasMoreDataSection(false);
      }
    } catch (error) {
      console.error("Error fetching WeekAnalysis data:", error);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setSalesContributionloading(false);
    }
  };

  // const [ItemCategorypage, setItemCategoryPage] = useState(1);
  // const ItemCategorylimit = 10;
  // const [ItemCategoryloading, setItemCategoryloading] = useState(false);
  // const [hasMoreDataItemcategory, setHasMoreDataItemcategory] = useState(true);
  // const fetchItemCategory = async (page = 1, resetData = false) => {
  //   setItemCategoryloading(true);

  //   try {
  //     const stored = sessionStorage.getItem("asm");
  //     const storecode= stored === "null" || stored === null ? "" : stored;
  //     const cleanEncode = (value) => {
  //       let decodedValue = value || "";
  //       while (decodedValue !== decodeURIComponent(decodedValue)) {
  //         decodedValue = decodeURIComponent(decodedValue);
  //       }
  //       return encodeURIComponent(decodedValue);
  //     };

  //     const encodedFilters = {
  //       city: cleanEncode(filters.city),
  //       store_name: cleanEncode(filters.store_name),
  //       sale_type: cleanEncode(filters.sale_type),
  //       item_description: cleanEncode(filters.item_description),
  //       brand_name: cleanEncode(filters.brand_name),
  //       product_group: cleanEncode(filters.product_group),
  //       section: cleanEncode(filters.section),
  //       model_no: cleanEncode(filters.model_no),
  //       demo_flag: cleanEncode(filters.demo_flag),
  //       PriceBreakup2: cleanEncode(filters.PriceBreakup2),
  //       item_category: cleanEncode(filters.item_category),
  //       srn_flag: cleanEncode(filters.srn_flag),
  //     };
  //     const response = await axios.get(
  //       `sales_analysis/salesAnalysisitemCategory?period_from=${period1.from}&period_to=${period1.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&page=${ItemCategorypage}&limit=${ItemCategorylimit}&srn_flag=${encodedFilters.srn_flag}`
  //     );

  //     if (response.data && Array.isArray(response.data.data)) {
  //       const newData = response.data.data;
  //       const sortedData = newData.sort((a, b) => {
  //         return b.total_sales - a.total_sales;
  //       });
  //       // setItemCategory((prevData) => {
  //       //   const combinedData = resetData
  //       //     ? sortedData
  //       //     : [...prevData, ...sortedData];

  //       //   return combinedData.sort((a, b) => b.total_sales - a.total_sales);
  //       // });
  //       setItemCategory((prevData) =>
  //         resetData ? sortedData : [...prevData, ...sortedData]
  //       );
  //       if (sortedData.length < ItemCategorylimit) {
  //         setHasMoreDataItemcategory(false);
  //       } else {
  //         setHasMoreDataItemcategory(true);
  //         setItemCategoryPage(page + 1);
  //       }

  //       // setItemCategoryPage((prevPage) => prevPage + 1);
  //       console.log("Salesitemcategory updated:", newData);
  //     } else {
  //       console.error("Unexpected data format:", response.data);
  //       setHasMoreDataItemcategory(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Salesitemcategory Data:", error);
  //   } finally {
  //     setItemCategoryloading(false);
  //   }
  // };

  // const [Salesproductpage, setSalesproductPage] = useState(1);
  // const Salesproductlimit = 10;
  // const [SalesContributionProductloading, setSalesContributionProductloading] =
  //   useState(false);
  // const [hasMoreDataProduct, setHasMoreDataProduct] = useState(true);
  // const fetchSalesProduct = async (page = 1, resetData = false) => {
  //   setSalesContributionProductloading(true);
  //   try {
  //     const stored = sessionStorage.getItem("asm");
  //     const storecode= stored === "null" || stored === null ? "" : stored;
  //     const cleanEncode = (value) => {
  //       let decodedValue = value || "";
  //       while (decodedValue !== decodeURIComponent(decodedValue)) {
  //         decodedValue = decodeURIComponent(decodedValue);
  //       }
  //       return encodeURIComponent(decodedValue);
  //     };

  //     const encodedFilters = {
  //       city: cleanEncode(filters.city),
  //       store_name: cleanEncode(filters.store_name),
  //       sale_type: cleanEncode(filters.sale_type),
  //       item_description: cleanEncode(filters.item_description),
  //       brand_name: cleanEncode(filters.brand_name),
  //       product_group: cleanEncode(filters.product_group),
  //       section: cleanEncode(filters.section),
  //       model_no: cleanEncode(filters.model_no),
  //       demo_flag: cleanEncode(filters.demo_flag),
  //       PriceBreakup2: cleanEncode(filters.PriceBreakup2),
  //       item_category: cleanEncode(filters.item_category),
  //       srn_flag: cleanEncode(filters.srn_flag),
  //     };
  //     const response = await axios.get(
  //       `sales_analysis/salesAnalysisProduct?period_from=${period1.from}&period_to=${period1.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&page=${Salesproductpage}&limit=${Salesproductlimit}&srn_flag=${encodedFilters.srn_flag}`
  //     );
  //     if (response.data && Array.isArray(response.data.data)) {
  //       const newData = response.data.data;
  //       const sortedData = newData.sort((a, b) => {
  //         return b.total_sales - a.total_sales;
  //       });
  //       setSalesProduct((prevData) => {
  //         const combinedData = resetData
  //           ? sortedData
  //           : [...prevData, ...sortedData];

  //         return combinedData.sort((a, b) => b.total_sales - a.total_sales);
  //       });
  //       if (sortedData.length < Salesproductlimit) {
  //         setHasMoreDataProduct(false);
  //       } else {
  //         setHasMoreDataProduct(true);
  //         setSalesproductPage(page + 1);
  //       }

  //       // setSalesproductPage((prevPage) => prevPage + 1);
  //       console.log("SalesProduct updated:", newData);
  //     } else {
  //       console.error("Unexpected data format:", response.data);
  //       setHasMoreDataProduct(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching SalesProduct Data:", error);
  //   } finally {
  //     setSalesContributionProductloading(false);
  //   }
  // };

  // const [SalesBranchpage, setSalesBranchPage] = useState(1);
  // const SalesBranchlimit = 10;
  // const [SalesContributionBranchloading, setSalesContributionBranchloading] =
  //   useState(false);
  // const [hasMoreDataBranch, setHasMoreDataBranch] = useState(true);
  // const fetchSalesBranch = async (page = 1, resetData = false) => {
  //   setSalesContributionBranchloading(true);
  //   try {
  //     const stored = sessionStorage.getItem("asm");
  //     const storecode= stored === "null" || stored === null ? "" : stored;
  //     const cleanEncode = (value) => {
  //       let decodedValue = value || "";
  //       while (decodedValue !== decodeURIComponent(decodedValue)) {
  //         decodedValue = decodeURIComponent(decodedValue);
  //       }
  //       return encodeURIComponent(decodedValue);
  //     };

  //     const encodedFilters = {
  //       city: cleanEncode(filters.city),
  //       store_name: cleanEncode(filters.store_name),
  //       sale_type: cleanEncode(filters.sale_type),
  //       item_description: cleanEncode(filters.item_description),
  //       brand_name: cleanEncode(filters.brand_name),
  //       product_group: cleanEncode(filters.product_group),
  //       section: cleanEncode(filters.section),
  //       model_no: cleanEncode(filters.model_no),
  //       demo_flag: cleanEncode(filters.demo_flag),
  //       PriceBreakup2: cleanEncode(filters.PriceBreakup2),
  //       item_category: cleanEncode(filters.item_category),
  //       srn_flag: cleanEncode(filters.srn_flag),
  //     };
  //     const response = await axios.get(
  //       `sales_analysis/salesAnalysisBranch?period_from=${period1.from}&period_to=${period1.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&page=${SalesBranchpage}&limit=${SalesBranchlimit}&srn_flag=${encodedFilters.srn_flag}`
  //     );

  //     if (response.data && Array.isArray(response.data.data)) {
  //       const newData = response.data.data;
  //       const sortedData = newData.sort((a, b) => {
  //         return b.total_sales - a.total_sales;
  //       });
  //       if (SalesBranchpage == 1) {
  //         setSalesBranch(sortedData);
  //       } else {
  //         setSalesBranch((prevData) => {
  //           const combinedData = resetData
  //             ? sortedData
  //             : [...prevData, ...sortedData];

  //           return combinedData.sort((a, b) => b.total_sales - a.total_sales);
  //         });
  //       }

  //       if (sortedData.length < SalesBranchlimit) {
  //         setHasMoreDataBranch(false);
  //       } else {
  //         setHasMoreDataBranch(true);
  //         setSalesBranchPage(page + 1);
  //       }

  //       // setSalesBranchPage((prevPage) => prevPage + 1);
  //       console.log("SalesBranch updated:", newData);
  //     } else {
  //       console.error("Unexpected data format:", response.data);
  //       setHasMoreDataBranch(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching SalesBranch Data:", error);
  //   } finally {
  //     setSalesContributionBranchloading(false);
  //   }
  // };

  const [BrandSalepage, setBrandSalePage] = useState(1);
  const BrandSalelimit = 15;
  const [BrandSalesloading, setBrandSalesloading] = useState(false);
  const [hasMoreDataBrandSale, setHasMoreDataBrandSale] = useState(true);
  const [BrandSalesresponse, setBrandSalesresponse] = useState("");
  const controllerRef4 = useRef(null);
  const fetchBrandSales = async (page = 1, resetData = false) => {
    setBrandSalesloading(true);
    if (controllerRef4.current) {
      controllerRef4.current.abort();
    }
    controllerRef4.current = new AbortController();
    const signal = controllerRef4.current.signal;
    try {
      const stored = sessionStorage.getItem("store");
      const storecode = stored === "null" || stored === null ? "" : stored;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/salesAnalysisKoreBrandSales?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&storecode=${storecode}&limit=${BrandSalelimit}&page=${BrandSalepage}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setBrandSalesresponse(response.statusText);
      if (response.data && Array.isArray(response.data.data)) {
        const newData = response.data.data;

        if (BrandSalepage === 1) {
          setBrandSales(newData);
        } else {
          setBrandSales((prevData) =>
            resetData ? newData : [...prevData, ...newData]
          );
        }
        if (newData.length < BrandSalelimit) {
          setHasMoreDataBrandSale(false);
        } else {
          setHasMoreDataBrandSale(true);
          setBrandSalePage(page + 1);
        }

        // setBrandSalePage((prevPage) => prevPage + 1);
        console.log("Brand Sales updated:", newData);
      } else {
        console.error("Unexpected data format:", response.data);
        setHasMoreDataBrandSale(false);
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
      setBrandSalesloading(false);
    }
  };

  const [BrandItempage, setBrandItemPage] = useState(1);
  const BrandItemlimit = 15;
  const [ItemSalesloading, setItemSalesloading] = useState(false);
  const [hasMoreDataBrandItem, setHasMoreDataBrandItem] = useState(true);
  const [BrandItemresponse, setBrandItemresponse] = useState("");
  const controllerRef5 = useRef(null);
  const fetchBrandItem = async (page = 1, resetData = false) => {
    setItemSalesloading(true);
    if (controllerRef5.current) {
      controllerRef5.current.abort();
    }
    controllerRef5.current = new AbortController();
    const signal = controllerRef5.current.signal;
    try {
      const stored = sessionStorage.getItem("store");
      const storecode = stored === "null" || stored === null ? "" : stored;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/salesAnalysisKoreItemSales?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&storecode=${storecode}&limit=${BrandItemlimit}&page=${BrandItempage}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setBrandItemresponse(response.statusText);
      if (response.data && Array.isArray(response.data.data)) {
        const newData = response.data.data;
        setBrandItem((prevData) =>
          resetData ? newData : [...prevData, ...newData]
        );
        if (newData.length < BrandItemlimit) {
          setHasMoreDataBrandItem(false);
        } else {
          setHasMoreDataBrandItem(true);
          setBrandItemPage(page + 1);
        }
        // setBrandItemPage((prevPage) => prevPage + 1);
        console.log("SalesBrand Item updated:", newData);
      } else {
        console.error("Unexpected data format:", response.data);
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
      setItemSalesloading(false);
    }
  };

  // const [DiscountBranchpage, setDiscountBranchPage] = useState(1);
  // const DiscountBranchlimit = 15;
  // const [DiscountAvailedloading, setDiscountAvailedloading] = useState(false);
  // const [hasMoreDataDiscountBranch, setHasMoreDataDiscountBranch] =
  //   useState(true);
  // const fetchDiscountBranch = async (page = 1, resetData = false) => {
  //   setDiscountAvailedloading(true);

  //   try {
  //     const stored = sessionStorage.getItem("asm");
  //     const storecode= stored === "null" || stored === null ? "" : stored;
  //     const cleanEncode = (value) => {
  //       let decodedValue = value || "";
  //       while (decodedValue !== decodeURIComponent(decodedValue)) {
  //         decodedValue = decodeURIComponent(decodedValue);
  //       }
  //       return encodeURIComponent(decodedValue);
  //     };

  //     const encodedFilters = {
  //       city: cleanEncode(filters.city),
  //       store_name: cleanEncode(filters.store_name),
  //       sale_type: cleanEncode(filters.sale_type),
  //       item_description: cleanEncode(filters.item_description),
  //       brand_name: cleanEncode(filters.brand_name),
  //       product_group: cleanEncode(filters.product_group),
  //       section: cleanEncode(filters.section),
  //       model_no: cleanEncode(filters.model_no),
  //       demo_flag: cleanEncode(filters.demo_flag),
  //       PriceBreakup2: cleanEncode(filters.PriceBreakup2),
  //       item_category: cleanEncode(filters.item_category),
  //       srn_flag: cleanEncode(filters.srn_flag),
  //     };
  //     const response = await axios.get(
  //       `sales_analysis/DiscountAnalysisBranch?period_from=${period1.from}&period_to=${period1.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&page=${DiscountBranchpage}&limit=${DiscountBranchlimit}&srn_flag=${encodedFilters.srn_flag}`
  //     );

  //     if (response.data && Array.isArray(response.data.data)) {
  //       const newData = response.data.data;
  //       const sortedData = newData.sort((a, b) => {
  //         return b.disc_amt - a.disc_amt;
  //       });
  //       if (DiscountBranchpage == 1) {
  //         setDiscountBranch(sortedData);
  //       } else {
  //         setDiscountBranch((prevData) =>
  //           resetData ? sortedData : [...prevData, ...sortedData]
  //         );
  //       }

  //       if (sortedData.length < DiscountBranchlimit) {
  //         setHasMoreDataDiscountBranch(false);
  //       } else {
  //         setHasMoreDataDiscountBranch(true);
  //         setDiscountBranchPage(page + 1);
  //       }

  //       // setDiscountBranchPage((prevPage) => prevPage + 1);

  //       console.log("DiscountAnalysisBranch updated:", newData);
  //     } else {
  //       console.error("Unexpected data format:", response.data);
  //       setHasMoreDataDiscountBranch(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching DiscountAnalysisBranch Data:", error);
  //   } finally {
  //     setDiscountAvailedloading(false);
  //   }
  // };

  // const [DiscountCitypage, setDiscountCitypage] = useState(1);
  // const DiscountCitylimit = 15;
  // const [DiscountCityloading, setDiscountCityloading] = useState(false);
  // const [hasMoreDataDiscountCity, setHasMoreDataDiscountCity] = useState(true);
  // const fetchDiscountCity = async (page = 1, resetData = false) => {
  //   setDiscountCityloading(true);

  //   try {
  //     const stored = sessionStorage.getItem("asm");
  //     const storecode= stored === "null" || stored === null ? "" : stored;
  //     const cleanEncode = (value) => {
  //       let decodedValue = value || "";
  //       while (decodedValue !== decodeURIComponent(decodedValue)) {
  //         decodedValue = decodeURIComponent(decodedValue);
  //       }
  //       return encodeURIComponent(decodedValue);
  //     };

  //     const encodedFilters = {
  //       city: cleanEncode(filters.city),
  //       store_name: cleanEncode(filters.store_name),
  //       sale_type: cleanEncode(filters.sale_type),
  //       item_description: cleanEncode(filters.item_description),
  //       brand_name: cleanEncode(filters.brand_name),
  //       product_group: cleanEncode(filters.product_group),
  //       section: cleanEncode(filters.section),
  //       model_no: cleanEncode(filters.model_no),
  //       demo_flag: cleanEncode(filters.demo_flag),
  //       PriceBreakup2: cleanEncode(filters.PriceBreakup2),
  //       item_category: cleanEncode(filters.item_category),
  //       srn_flag: cleanEncode(filters.srn_flag),
  //     };
  //     const response = await axios.get(
  //       `sales_analysis/DiscountAnalysisCity?period_from=${period1.from}&period_to=${period1.to}&city=${encodedFilters.city}&store_name=${encodedFilters.store_name}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product_group=${encodedFilters.product_group}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&asm=${asm}&page=${DiscountCitypage}&limit=${DiscountCitylimit}&srn_flag=${encodedFilters.srn_flag}`
  //     );

  //     if (response.data && Array.isArray(response.data.data)) {
  //       const newData = response.data.data;
  //       const sortedData = newData.sort((a, b) => {
  //         return b.disc_amt - a.disc_amt;
  //       });
  //       setDiscountCity((prevData) =>
  //         resetData ? sortedData : [...prevData, ...sortedData]
  //       );

  //       if (sortedData.length < DiscountCitylimit) {
  //         setHasMoreDataDiscountCity(false);
  //       } else {
  //         setHasMoreDataDiscountCity(true);
  //         setDiscountCitypage(page + 1);
  //       }

  //       // setDiscountCity((prevData) => [...prevData, ...newData]);
  //       console.log("DiscountAnalysisCity updated:", newData);
  //     } else {
  //       console.error("Unexpected data format:", response.data);
  //       setHasMoreDataDiscountCity(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching DiscountAnalysisCity Data:", error);
  //   } finally {
  //     setDiscountCityloading(false);
  //   }
  // };

  const [DiscountSectionpage, setDiscountSectionPage] = useState(1);
  const DiscountSectionlimit = 14;
  const [DiscountSectionloading, setDiscountSectionloading] = useState(false);
  const [hasMoreDataDiscountSection, setHasMoreDataDiscountSection] =
    useState(true);
  const [DiscountSectionresponse, setDiscountSectionresponse] = useState("");
  const controllerRef6 = useRef(null);
  const fetchDiscountSection = async (page = 1, resetData = false) => {
    setDiscountSectionloading(true);
    if (controllerRef6.current) {
      controllerRef6.current.abort();
    }
    controllerRef6.current = new AbortController();
    const signal = controllerRef6.current.signal;
    try {
      const stored = sessionStorage.getItem("store");
      const storecode = stored === "null" || stored === null ? "" : stored;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/DiscountAnalysisKoreSection?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&storecode=${storecode}&page=${DiscountSectionpage}&limit=${DiscountSectionlimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setDiscountSectionresponse(response.statusText);
      if (response.data && Array.isArray(response.data.data)) {
        const newData = response.data.data;
        const sortedData = newData.sort((a, b) => {
          return b.disc_amt - a.disc_amt;
        });
        setDiscountSection((prevData) => {
          const combinedData = resetData
            ? sortedData
            : [...prevData, ...sortedData];

          return combinedData.sort((a, b) => b.disc_amt - a.disc_amt);
        });

        if (sortedData.length < DiscountSectionlimit) {
          setHasMoreDataDiscountSection(false);
        } else {
          setHasMoreDataDiscountSection(true);
          setDiscountSectionPage(page + 1);
        }

        // setDiscountSectionPage((prevPage) => prevPage + 1);
      } else {
        console.error("Unexpected data format:", response.data);
        setHasMoreDataDiscountSection(false);
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
      setDiscountSectionloading(false);
    }
  };

  const [DiscountBrandpage, setDiscountBrandpage] = useState(1);
  const DiscountBrandlimit = 15;
  const [DiscountBrandloading, setDiscountBrandloading] = useState(false);
  const [hasMoreDataDiscountBrand, setHasMoreDataDiscountBrand] =
    useState(true);
  const [DiscountBrandresponse, setDiscountBrandresponse] = useState("");
  const controllerRef7 = useRef(null);
  const fetchDiscountBrand = async (page = 1, resetData = false) => {
    setDiscountBrandloading(true);
    if (controllerRef7.current) {
      controllerRef7.current.abort();
    }
    controllerRef7.current = new AbortController();
    const signal = controllerRef7.current.signal;
    try {
      const stored = sessionStorage.getItem("store");
      const storecode = stored === "null" || stored === null ? "" : stored;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/DiscountAnalysisKoreBrand?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&storecode=${storecode}&page=${DiscountBrandpage}&limit=${DiscountBrandlimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setDiscountBrandresponse(response.statusText);
      if (response.data && Array.isArray(response.data.data)) {
        const newData = response.data.data;
        const sortedData = newData.sort((a, b) => {
          return b.disc_amt - a.disc_amt;
        });
        setDiscountBrand((prevData) => {
          const combinedData = resetData
            ? sortedData
            : [...prevData, ...sortedData];

          return combinedData.sort((a, b) => b.disc_amt - a.disc_amt);
        });

        if (sortedData.length < DiscountBrandlimit) {
          setHasMoreDataDiscountBrand(false);
        } else {
          setHasMoreDataDiscountBrand(true);
          setDiscountBrandpage(page + 1);
        }

        // setDiscountBrandpage((prevPage) => prevPage + 1);

        console.log("DiscountBrand updated:", newData);
      } else {
        console.error("Unexpected data format:", response.data);
        setHasMoreDataDiscountBrand(false);
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
      setDiscountBrandloading(false);
    }
  };

  const [DiscountModelpage, setDiscountModelPage] = useState(1);
  const DiscountModellimit = 15;
  const [DiscountModelloading, setDiscountModelloading] = useState(false);
  const [hasMoreDataDiscountModel, setHasMoreDataDiscountModel] =
    useState(true);
  const [DiscountModelNoresponse, setDiscountModelNoresponse] = useState("");
  const controllerRef8 = useRef(null);
  const fetchDiscountModelNo = async (page = 1, resetData = false) => {
    setDiscountModelloading(true);
    if (controllerRef8.current) {
      controllerRef8.current.abort();
    }
    controllerRef8.current = new AbortController();
    const signal = controllerRef8.current.signal;
    try {
      const stored = sessionStorage.getItem("store");
      const storecode = stored === "null" || stored === null ? "" : stored;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/DiscountAnalysisKoreModelNo?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&storecode=${storecode}&page=${page}&limit=${DiscountModellimit}&srn_flag=${encodedFilters.srn_flag}`,
        { signal }
      );
      setDiscountModelNoresponse(response.statusText);
      if (response.data && Array.isArray(response.data.data)) {
        const newData = response.data.data;
        const sortedData = newData.sort((a, b) => {
          return b.disc_amt - a.disc_amt;
        });

        setDiscountModelNo((prevData) => {
          const combinedData = resetData
            ? sortedData
            : [...prevData, ...sortedData];

          return combinedData.sort((a, b) => b.disc_amt - a.disc_amt);
        });
        if (sortedData.length < DiscountModellimit) {
          setHasMoreDataDiscountModel(false);
        } else {
          setHasMoreDataDiscountModel(true);
          setDiscountModelPage(page + 1);
        }

        console.log("DiscountModelNo updated:", newData);
      } else {
        console.error("Unexpected data format:", response.data);
        setHasMoreDataDiscountModel(false);
      }
    } catch (error) {
      console.error("Error fetching DiscountModelNo Data:", error);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setDiscountModelloading(false);
    }
  };

  const parsePercentage = (percentStr) => {
    if (!percentStr) return 0;
    return parseFloat(String(percentStr).replace("%", "")) || 0;
  };

  const handleButtonClick1 = () => {
    setClickedButton("LYTD vs YTD");

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const prevYearSameDay = new Date(
      currentYear - 1,
      currentMonth,
      today.getDate()
    );

    // Format dates
    const period1From = formatDate(prevYearSameDay);
    const period1To = formatDate(today);
    console.log({ from: period1From, to: period1To }, "fdffffffffffff");
    // setTempPeriod1({ from: period1From, to: period1To });
    setPeriod1({ from: period1From, to: period1To });
    setActiveButton("LYTD");
    setIsDisabled(false);
    // setIsApplyDisabled(false);
  };

  // setPeriod1({ from: period1From, to: period1To });
  // setIsFiltersUpdated(true);

  const fetchData = async () => {
    const stored = sessionStorage.getItem("store");
    const storecode = stored === "null" || stored === null ? "" : stored;
    const cleanEncode = (value) => {
      let decodedValue = value || "";
      while (decodedValue !== decodeURIComponent(decodedValue)) {
        decodedValue = decodeURIComponent(decodedValue);
      }
      return encodeURIComponent(decodedValue);
    };

    const encodedFilters = {
      sale_type: cleanEncode(filters.sale_type),
      item_description: cleanEncode(filters.item_description),
      brand_name: cleanEncode(filters.brand_name),

      section: cleanEncode(filters.section),
      model_no: cleanEncode(filters.model_no),
      demo_flag: cleanEncode(filters.demo_flag),
      PriceBreakup2: cleanEncode(filters.PriceBreakup2),

      srn_flag: cleanEncode(filters.srn_flag),
    };
    try {
      const response = await axios.get(
        `sales_all_in_one_live_kore/koredate?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&storecode=${storecode}&srn_flag=${encodedFilters.srn_flag}`
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

        // setPeriod1({
        //   from: formattedStartDate,
        //   to: formattedEndDate,
        // });
        setDateRange({
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        });
        setTempCustom({
          from: formattedStartDate,
          to: formattedEndDate,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };
  const handleCustomClick = () => {
    // setPeriod1({
    //   from: "",
    //   to: " "
    // });
    setPeriod1(tempCustom);
    setPeriodtemp({ from: tempCustom.from, to: tempCustom.to });
    setClickedButton("Custom");
    setActiveButton("Customs");
    setIsDisabled(false);
    setIsApplyDisabled(false);
    // fetchData();
  };
  // setIsApplyDisabled(true);
  // setPeriod1({ from: "2025-02-01", to: "2025-02-12" });
  // setTempPeriod2({ from: "", to: "" });
  const [isDisabled, setIsDisabled] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const [salesData1, setsalesData1] = useState();
  const [salesData2, setsalesData2] = useState();
  const [salesData3, setsalesData3] = useState();
  const fetchSales1 = async () => {
    try {
      const stored = sessionStorage.getItem("store");
      const storecode = stored === "null" || stored === null ? "" : stored;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/salesAnalysisKoreSales?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&storecode=${storecode}&srn_flag=${encodedFilters.srn_flag}`
      );

      setsalesData1(response.data.data);
      console.log("SalesType updated:", response.data.data);
    } catch (error) {
      console.error("Error fetching SalesType Data:", error);
    }
  };
  const fetchSales2 = async () => {
    try {
      const stored = sessionStorage.getItem("store");
      const storecode = stored === "null" || stored === null ? "" : stored;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/DiscountAnalysisKoreDiscount?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&storecode=${storecode}&srn_flag=${encodedFilters.srn_flag}`
      );

      setsalesData2(response.data.data);
    } catch (error) {
      console.error("Error fetching SalesType Data:", error);
    }
  };
  const fetchSales3 = async () => {
    try {
      const stored = sessionStorage.getItem("store");
      const storecode = stored === "null" || stored === null ? "" : stored;
      const cleanEncode = (value) => {
        let decodedValue = value || "";
        while (decodedValue !== decodeURIComponent(decodedValue)) {
          decodedValue = decodeURIComponent(decodedValue);
        }
        return encodeURIComponent(decodedValue);
      };

      const encodedFilters = {
        sale_type: cleanEncode(filters.sale_type),
        item_description: cleanEncode(filters.item_description),
        brand_name: cleanEncode(filters.brand_name),

        section: cleanEncode(filters.section),
        model_no: cleanEncode(filters.model_no),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        srn_flag: cleanEncode(filters.srn_flag),
      };
      const response = await axios.get(
        `sales_analysis_kore/DiscountAnalysisKoreDiscountPercentage?period_from=${period1.from}&period_to=${period1.to}&sale_type=${encodedFilters.sale_type}&section=${encodedFilters.section}&brand_name=${encodedFilters.brand_name}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&model_no=${encodedFilters.model_no}&item_description=${encodedFilters.item_description}&srn_flag=${encodedFilters.srn_flag}&storecode=${storecode}`
      );

      setsalesData3(response.data.data);
    } catch (error) {
      console.error("Error fetching SalesType Data:", error);
    }
  };
  const parseNumber = (value) => {
    // Handle cases where value might be a percentage string or invalid
    if (typeof value === "string" && value.includes("%")) {
      return parseFloat(value.replace("%", "")); // Remove % and parse
    }
    return typeof value === "number" ? value : NaN; // Return NaN for non-numeric or undefined
  };

  //sales
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleSort1 = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedData = [...Sections].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
      if (
        key === "total_sales" ||
        key === "total_sales_percentage" ||
        key === "asp"
      ) {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      }
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      return 0;
    });
    setSortConfig({ key, direction });
    setSections(sortedData);
  };

  // product

  //city

  //Brandsales

  // /setBrandItem

  //DiscountBranch

  //DiscountCity

  //DiscountSection
  const [sortConfig9, setSortConfig9] = useState({ key: "", direction: "asc" });

  const handleSort10 = (key) => {
    const direction =
      sortConfig9.key === key && sortConfig9.direction === "asc"
        ? "desc"
        : "asc";
    const sortedData = [...DiscountSection].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
      if (
        key === "disc_amt" ||
        key === "total_sales" ||
        key === "disc_amt_percentage"
      ) {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      }
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      return 0;
    });
    setSortConfig9({ key, direction });
    setDiscountSection(sortedData);
  };
  // DiscountBrand
  const [sortConfig10, setSortConfig10] = useState({
    key: "",
    direction: "asc",
  });

  const handleSort11 = (key) => {
    const direction =
      sortConfig10.key === key && sortConfig10.direction === "asc"
        ? "desc"
        : "asc";
    const sortedData = [...DiscountBrand].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
      if (
        key === "disc_amt" ||
        key === "total_sales" ||
        key === "disc_amt_percentage"
      ) {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      }
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      return 0;
    });
    setSortConfig10({ key, direction });
    setDiscountBrand(sortedData);
  };
  // DiscountModelNo
  const [sortConfig11, setSortConfig11] = useState({
    key: "",
    direction: "asc",
  });

  const handleSort12 = (key) => {
    const direction =
      sortConfig11.key === key && sortConfig11.direction === "asc"
        ? "desc"
        : "asc";
    const sortedData = [...DiscountModelNo].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
      if (
        key === "disc_amt" ||
        key === "total_sales" ||
        key === "disc_amt_percentage"
      ) {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      }
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      return 0;
    });
    setSortConfig11({ key, direction });
    setDiscountModelNo(sortedData);
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
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [formatteddate, setformatteddate] = useState();
  const fetchliveData = async () => {
    try {
      const response = await axios.get(
        "stock_analysis_kore/kore_table_modificatio"
      );

      const LiveData = response?.data?.last_modified;

      if (LiveData) {
        const [dayOfWeek, day, month, year, time] = LiveData.split(" ");
        const formattedDate = `${day}/${getMonthNumber(month)}/${year}`;
        setCurrentDateTime(formattedDate);
        setformatteddate(time);

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
  //   const updateDateTime = () => {
  //     const now = new Date();
  //     const formattedDateTime = now.toLocaleString("en-GB", {
  //       day: "2-digit",
  //       month: "2-digit",
  //       year: "numeric",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       second: "2-digit",
  //       hour12: false,
  //     });
  //     setCurrentDateTime(formattedDateTime);
  //   };

  //   updateDateTime(); // Initial call
  //   const intervalId = setInterval(updateDateTime, 1000); // Update every second

  //   return () => clearInterval(intervalId); // Cleanup interval on component unmount
  // }, []);
  // const formatNumber = (value) => {
  //   if (value !== undefined && value !== null) {
  //     return new Intl.NumberFormat().format(value);
  //   }
  //   return "";
  // };
  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
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
  // const dropdownValuecity = selectedOptioncity || filters.city;
  // const optionscity = dropdownData.city
  //   .slice()
  //   .sort((a, b) => a.localeCompare(b))
  //   .map((store) => ({
  //     label: store,
  //     value: store,
  //   }));
  const handlecityChange = (selectedOptions) => {
    setSelectedOptioncity(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);

      const selectedValuesString = selectedValues.join(",");

      setFilters((prevFilters) => ({
        ...prevFilters,
        city: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        city: "",
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
  // const optionsbranch = dropdownData.store_name
  //   .slice() // Create a copy to avoid mutating the original array
  //   .sort((a, b) => a.localeCompare(b))
  //   .map((store) => ({
  //     label: store,
  //     value: store,
  //   }));
  const handlebranchChange = (selectedOptions) => {
    setSelectedOptionbranch(selectedOptions);
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

  const [selectedOptionitemd, setSelectedOptionitemd] = useState(
    dropdownData?.filters?.item_description?.length > 2
      ? [
          {
            label: dropdownData.item_description[2],
            value: dropdownData.item_description[2],
          },
        ]
      : null
  );
  const dropdownValueitemd = selectedOptionitemd || filters.item_description;
  const optionsitemd = dropdownData.item_description
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handleitemdChange = (selectedOptions) => {
    setSelectedOptionitemd(selectedOptions);
    console.log("Selected item options:", selectedOptions);
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
  const dropdownValuemodleno = selectedOptionmodel || filters.model_no;
  const optionsmodel = dropdownData.model_no
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handlemodelChange = (selectedOptions) => {
    setSelectedOptionmodle(selectedOptions);
    console.log("Selected item options:", selectedOptions);
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
  const dropdownValuebrand = selectedOptionbrand || filters.brand_name;
  const optionsbrand = dropdownData.brand_name
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handlebrandChange = (selectedOptions) => {
    setSelectedOptionbrand(selectedOptions);
    console.log("Selected item options:", selectedOptions);

    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);

      const selectedValuesString = selectedValues.join(",");

      setFilters((prevFilters) => ({
        ...prevFilters,
        brand_name: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand_name: "",
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
  // const optionsproduct = dropdownData.product_group
  //   .slice()
  //   .sort((a, b) => a.localeCompare(b))
  //   .map((store) => ({
  //     label: store,
  //     value: store,
  //   }));
  const handleproductChange = (selectedOptions) => {
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
  const dropdownValueitem = selectedOptionitemc || filters.item_category;
  // const optionsitemc = dropdownData.item_category.slice() // Create a copy to avoid mutating the original array
  // .sort((a, b) => a.localeCompare(b)).map((store) => ({
  //   label: store,
  //   value: store,
  // }));
  const optionsitemc =
    dropdownData.item_category
      ?.filter((item) => typeof item === "string") // Filter out non-string values
      .slice() // Create a copy to avoid mutating the original array
      .sort((a, b) => a.localeCompare(b)) // Sort strings alphabetically
      .map((store) => ({
        label: store,
        value: store,
      })) || []; // Fallback to an empty array if dropdownData.item_category is null/undefined

  const handleitemcChange = (selectedOptions) => {
    setSelectedOptionitemc(selectedOptions);
    console.log("Selected item options:", selectedOptions);

    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_category: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_category: "", // Clear the `sale_type` filter
      }));
    }
  };

  const [selectedOptionsale, setSelectedOptionsale] = useState(
    dropdownData?.filters?.sale_type?.length > 2
      ? [
          {
            label: dropdownData.sale_type[2],
            value: dropdownData.sale_type[2],
          },
        ]
      : null
  );
  const dropdownValuesales = selectedOptionsale || filters.sale_type;
  const optionssale = dropdownData.sale_type
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
    dropdownData?.filters?.section?.length > 2
      ? [
          {
            label: dropdownData.section[2],
            value: dropdownData.section[2],
          },
        ]
      : null
  );
  const dropdownValuesection = selectedOptionsection || filters.section;
  const optionssection = dropdownData.section
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handlesectionChange = (selectedOptions) => {
    setSelectedOptionsection(selectedOptions);
    console.log("Selected item options:", selectedOptions);

    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        section: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        section: "", // Clear the `sale_type` filter
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
  const optionsdemo = dropdownData.demo_flag
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handledemoChange = (selectedOptions) => {
    setSelectedOptiondemo(selectedOptions);
    console.log("Selected item options:", selectedOptions);

    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        demo_flag: selectedValuesString, // Update the `sale_type` filter
      }));
    } else {
      // If no options are selected, clear the sale_type filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        demo_flag: "", // Clear the `sale_type` filter
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
  const dropdownValuesrn = selectedOptionsrn || filters.srn_flag;
  const optionssrn = dropdownData.srn_flag
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handlesrnChange = (selectedOptions) => {
    setSelectedOptionsrn(selectedOptions);

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

  const optionsprice = [
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

  const dropdownValueprice = selectedOptionprice || filters.PriceBreakup2;
  const handlepriceChange = (selectedOptions) => {
    setSelectedOptionprice(selectedOptions);
    console.log("Selected item options:", selectedOptions);

    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);

      const selectedValuesString = selectedValues.join(",");

      setFilters((prevFilters) => ({
        ...prevFilters,
        PriceBreakup2: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        PriceBreakup2: "",
      }));
    }
  };
  return (
    <div
      className=""
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="p-4 rounded-lg dark:border-gray-500 overflow-x-auto mt-14"
        style={{
          padding: "10px",
          width: "100%",
        }}
      >
        <div
          className="p-3 rounded-lg shadow bg-white"
          style={{
            // width: 1281,
            // height: 1864,
            height: 1522,
            padding: "10px",
          }}
        >
          <div
            className="space-y-6"
            style={{
              backgroundColor: "#1C3644",
              // width: 1226,
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
                    // style={{ backgroundColor: "#fff", color: "#000", padding: '8px', borderRadius: '8px' ,cursor:'pointer' }}
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
                  // onClick={reloadWithFilters}
                  onClick={
                    !isApplyDisabled && !isApplyDisabled1
                      ? reloadWithFilters
                      : null
                  }
                  // disabled={(isApplyDisabled && isApplyDisabled1) ? reloadWithFilters : null}
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
                    activeButton === "Customs" ? "btn-secondary" : "btn-light"
                  }`}
                  // onClick={handleCustomClick}
                  onClick={() => handleCustomClick("Customs")}
                >
                  Custom
                </button>

                <button
                  className={`btn btn-sm ${
                    activeButton === "LMTD" ? "btn-secondary" : "btn-light"
                  }`}
                  onClick={() => handleButtonClick("LMTD")}
                >
                  MTD
                </button>

                <button
                  className={`btn btn-sm ${
                    activeButton === "YDAY" ? "btn-secondary" : "btn-light"
                  }`}
                  onClick={() => handleButtonClickyday("YDAY")}
                >
                  YDay
                </button>
                <button
                  className={`btn btn-sm ${
                    activeButton === "LYTD" ? "btn-secondary" : "btn-light"
                  }`}
                  onClick={() => handleButtonClickYtd("LYTD")}
                >
                  YTD
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
                Sales Analysis-Yesterday / MTD/ YTD Summary
              </h5>

              {/* Right Side */}
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
                  {currentDateTime}
                  <br></br>
                  {formatteddate}
                </span>
              </div>
            </div>
          </div>

          {/* //period first row */}
          <div className="container my-4">
            <div
              className="row g-3"
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                // justifyContent: "center",
                // gap: "27px",
                gap: "6px",
              }}
            >
              {/* Period 1 */}
              <div
                className="col-md-2"
                style={{
                  // height: "167px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <label
                  className="form-label"
                  style={{
                    color: "black",
                    fontSize: 12,
                    fontFamily: "Inter",
                    fontWeight: "bold",
                  }}
                >
                  Period 1
                </label>

                <TextInput
                  id="from"
                  type="date"
                  max={periodtemp.to}
                  // min={period1.from}
                  min={periodtemp.from}
                  value={
                    clickedButton === "Custom" ? period1.from : period1.from
                  }
                  style={{
                    width: "156px",
                    height: "37px",
                    backgroundColor: "#F1F1F1",
                  }}
                  disabled={isDisabled}
                  onChange={(e) =>
                    handlePeriodChange(e, setPeriod1) || dateRange.start_date
                  }
                  // readOnly

                  // disabled
                />
              </div>
              <div
                className="col-md-2"
                style={{
                  // height: "167px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginBottom: "-23px",
                }}
              >
                <TextInput
                  id="to"
                  type="date"
                  min={periodtemp.from}
                  // max={period1.to}
                  max={periodtemp.to}
                  value={clickedButton === "Custom" ? period1.to : period1.to}
                  style={{
                    width: "156px",
                    height: "37px",
                    backgroundColor: "#F1F1F1",
                  }}
                  // readOnly
                  disabled={isDisabled}
                  onChange={(e) =>
                    handlePeriodChange(e, setPeriod1) || dateRange.end_date
                  }
                  // disabled
                />
              </div>
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
                  SRN Filter
                </label>
                {/* <select
                   name="srn_flag"
                  value={filters.srn_flag}
                  onChange={handleFilterChange}
                  className="form-control"
                  style={{
                    width: "156px",
                    height: "31px",
                    backgroundColor: "#F1F1F1",
                    borderRadius: "5px",
                    padding: "5px",
                    fontSize: 11,
                    fontFamily: "Inter",
                  }}
                >
                  <option value="">ALL</option>
                  {dropdownData.srn_flag.map((srn_flag, index) => (
                    <option key={index} value={srn_flag}>
                     {srn_flag}
                    </option>
                  ))}
                </select> */}
                <Select
                  options={optionssrn}
                  value={dropdownValuesrn}
                  onChange={handlesrnChange}
                  isMulti
                  defaultValue={
                    dropdownData.srn_flag &&
                    Array.isArray(dropdownData.srn_flag) &&
                    dropdownData.srn_flag.length > 2
                      ? [
                          {
                            label: dropdownData.srn_flag[2],
                            value: dropdownData.srn_flag[2],
                          },
                        ]
                      : []
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
                    width: "156px",
                    height: "31px",
                    backgroundColor: "#F1F1F1",
                    borderRadius: "5px",
                    padding: "5px",
                    fontSize: 11,
                    fontFamily: "Inter",
                  }}
                >
                  <option value="">ALL</option>
                  {dropdownData.sale_type &&
                  Array.isArray(dropdownData.sale_type) ? (
                    dropdownData.sale_type.map((sale_type, index) => (
                      <option key={index} value={sale_type}>
                        {sale_type}
                      </option>
                    ))
                  ) : (
                    <option disabled>No sale types available</option>
                  )}
                </select> */}
                <Select
                  options={optionssale}
                  value={dropdownValuesales}
                  onChange={handlesalechange}
                  isMulti
                  defaultValue={
                    dropdownData.sale_type &&
                    Array.isArray(dropdownData.sale_type) &&
                    dropdownData.sale_type.length > 2
                      ? [
                          {
                            label: dropdownData.sale_type[2],
                            value: dropdownData.sale_type[2],
                          },
                        ]
                      : []
                  }
                  onFocus={() => setPlaceholdersale("Search...")}
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
                  Product
                </label>

                <Select
                  options={optionssection}
                  value={dropdownValuesection}
                  onChange={handlesectionChange}
                  isMulti
                  defaultValue={
                    dropdownData.section &&
                    Array.isArray(dropdownData.section) &&
                    dropdownData.section.length > 2
                      ? [
                          {
                            label: dropdownData.section[2],
                            value: dropdownData.section[2],
                          },
                        ]
                      : []
                  }
                  onFocus={() => setPlaceholderselection("Search...")}
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
                    fontSize: 12,
                    fontFamily: "Inter",
                    fontWeight: "bold",
                  }}
                >
                  Brand
                </label>

                <Select
                  options={optionsbrand}
                  value={dropdownValuebrand}
                  onChange={handlebrandChange}
                  isMulti
                  defaultValue={
                    dropdownData.brand_name &&
                    Array.isArray(dropdownData.brand_name) &&
                    dropdownData.brand_name.length > 2
                      ? [
                          {
                            label: dropdownData.brand_name[2],
                            value: dropdownData.brand_name[2],
                          },
                        ]
                      : []
                  }
                  onFocus={() => setPlaceholderbrand("Search...")}
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
                  Model No
                </label>

                <Select
                  options={optionsmodel}
                  value={dropdownValuemodleno}
                  onChange={handlemodelChange}
                  isMulti
                  defaultValue={
                    dropdownData.model_no &&
                    Array.isArray(dropdownData.model_no) &&
                    dropdownData.model_no.length > 2
                      ? [
                          {
                            label: dropdownData.model_no[2],
                            value: dropdownData.model_no[2],
                          },
                        ]
                      : []
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
                  Item Description
                </label>

                <Select
                  options={optionsitemd}
                  value={dropdownValueitemd}
                  onChange={handleitemdChange}
                  isMulti
                  defaultValue={
                    dropdownData.item_description &&
                    Array.isArray(dropdownData.item_description) &&
                    dropdownData.item_description.length > 2
                      ? [
                          {
                            label: dropdownData.item_description[2],
                            value: dropdownData.item_description[2],
                          },
                        ]
                      : []
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
                  Demo Filter
                </label>
                {/* <select
                name="demo_flag"
                  value={filters.demo_flag}
                  onChange={handleFilterChange}
                  className="form-control"
                  style={{
                    width: "156px",
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
                  {dropdownData.demo_flag &&
                  Array.isArray(dropdownData.demo_flag) ? (
                    dropdownData.item_description.map((demo_flag, index) => (
                      <option key={index} value={demo_flag}>
                        {demo_flag}
                      </option>
                    ))
                  ) : (
                    <option disabled>No demo_flag available</option>
                  )}
                </select> */}

                <Select
                  options={optionsdemo}
                  value={dropdownValuedemo}
                  onChange={handledemoChange}
                  isMulti
                  defaultValue={
                    dropdownData.demo_flag &&
                    Array.isArray(dropdownData.demo_flag) &&
                    dropdownData.demo_flag.length > 2
                      ? [
                          {
                            label: dropdownData.demo_flag[2],
                            value: dropdownData.demo_flag[2],
                          },
                        ]
                      : []
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
                  PriceBreakup
                </label>
                {/* <select
                 name="PriceBreakup2"
                  value={filters.PriceBreakup2}
                  onChange={handleFilterChange}
                  className="form-control"
                  style={{
                    width: "156px",
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
                  defaultValue={
                    dropdownData.PriceBreakup2 &&
                    Array.isArray(dropdownData.PriceBreakup2) &&
                    dropdownData.PriceBreakup2.length > 2
                      ? [
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
                        ]
                      : []
                  }
                  onFocus={() => setPlaceholderprice("Search...")}
                  onBlur={() => setPlaceholderprice("All")}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder={placeholderprice}
                />
              </div>
            </div>
          </div>

          {/* 
          //row design ft*/}
          <div className="p-1 w-full mt-4">
            <div
              style={{
                display: "flex",
                // gap: "5px",
                justifyContent: "space-between",
                height: "295px",
                width: "100%",
              }}
            >
              {/* Main Sales Circle */}
              <div className="md:col-span-1">
                <div className="pt-0">
                  <div className="flex items-center justify-center flex-col gap-3">
                    <p className="fs-5 text-dark fw-bold">Sales</p>
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: "133px",
                        // width: "20%",
                        height: "133px",
                        borderRadius: "50%",
                        border: "2px solid #003F7F",
                      }}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: "120px",

                          height: "120px",
                          borderRadius: "50%",
                          background:
                            "radial-gradient(87.96% 80.96% at 53% 25.98%, rgb(103, 172, 213) 8%, rgba(93, 118, 174, 23.616) 50%, rgba(9, 87, 177, 0) 181%)",
                          border: "2px solid #003F7F",
                          // background: "#377D9F",
                        }}
                      >
                        <div className="text-center">
                          <h3
                            className="text-2xl  text-white"
                            style={{
                              fontFamily: "Inter",
                              fontSize: 14,
                            }}
                          >
                            {salesData1 && salesData1.total_sales_in_cr
                              ? salesData1.total_sales_in_cr
                              : "Loading..."}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Circle */}
              <div
                className=""
                style={{
                  display: "flex",
                  alignItem: "center",
                  // width: "250px",
                  width: "30%",
                }}
              >
                <div
                  style={{
                    // display: "flex",
                    // width: "250px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      // display: "flex",
                      // width: "250px",
                      width: "100%",
                    }}
                  >
                    <div
                      className="card-header d-flex align-items-center justify-content-center"
                      style={{
                        height: "30px",
                        // width: "234px",
                        background: "#CCCCCC",
                      }}
                    >
                      <h5
                        className="text-center mb-0 fw-bold text-black"
                        style={{ fontSize: "12px", fontFamily: "Inter" }}
                      >
                        Sales Contribution By Sale Type
                      </h5>
                    </div>
                    <div
                      className="card-body"
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      {SalesType.map((item, index) => {
                        const barWidth =
                          (Math.abs(item.total_sales) / maxSalesValue) * 50;

                        const opacity =
                          0.1 +
                          (Math.abs(item.total_sales) / maxSalesValue) * 0.9;

                        return (
                          <div
                            key={index}
                            className=""
                            style={{
                              marginBottom: "3px",
                              //   borderBottom: "1px solid #6b728038",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="w-16 " style={{}}>
                                <span
                                  style={{
                                    color: "#605F5D",
                                    fontFamily: "Inter",
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item.sale_type}
                                </span>
                              </div>

                              <div
                                className="d-flex w-100 position-relative"
                                style={{
                                  height: "24px",
                                  display: "flex",
                                  marginLeft: "-26%",
                                }}
                              >
                                {item.total_sales < 0 && (
                                  <div
                                    className="position-absolute"
                                    style={{
                                      width: `${barWidth}%`,

                                      height: "100%",
                                      right: "50%",
                                      backgroundColor: "transparent",
                                      // borderRight: "2px solid rgba(200, 0, 0, 1)",
                                    }}
                                  ></div>
                                )}

                                {item.total_sales >= 0 && (
                                  <div
                                    className="position-absolute"
                                    style={{
                                      width: `${barWidth}%`,
                                      height: "100%",
                                      left: "50%",
                                      backgroundColor: `rgba(4, 126, 163, ${opacity})`,
                                    }}
                                  ></div>
                                )}

                                <div
                                  className="position-absolute"
                                  style={{
                                    width: "2px",
                                    height: "100%",
                                    left: "50%",
                                    backgroundColor: "rgb(204, 204, 204)",
                                    // zIndex: 10,
                                  }}
                                >
                                  <span
                                    className="position-absolute"
                                    style={{
                                      left:
                                        item.total_sales >= 0
                                          ? `calc(50% + ${barWidth}%)`
                                          : `calc(50% - ${barWidth}%)`,
                                      transform:
                                        item.total_sales >= 0
                                          ? "translateX(8px)"
                                          : "translateX(-100%)",
                                      fontFamily: "Inter",
                                      fontWeight: "bold",
                                      fontSize: "11px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {/* {item.total_sales?.toFixed(2)} */}
                                    {formatNumber(item.total_sales)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className="sub-value"
                              style={{
                                color: "#605F5D",
                                fontFamily: "Inter",
                                fontSize: "11px",
                                fontWeight: "normal",
                                textAlign: "right",
                              }}
                            >
                              {item.sub_value?.toFixed(2)}
                              {/* {formatNumber(item.sub_value)} */}
                            </div>
                          </div>
                        );
                      })}
                      {SalesTypeloading || SalesTyperesponse !== "OK" ? (
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
                          {SalesType.length === 0 && (
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
              {/* salesData  by section */}

              {/* salesclose */}
              {/* salesData  by item category */}

              {/* salesclose */}
              {/* salesData  by Product */}
              <div className="" style={{ width: "50%" }}>
                <div className="" style={{ width: "100%" }}>
                  <div
                    className="card-header d-flex align-items-center justify-content-center"
                    style={{
                      height: "30px",
                      background: "#CCCCCC",
                    }}
                  >
                    <h5
                      className="text-center mb-0 fw-bold text-black"
                      style={{ fontSize: "12px", fontFamily: "Inter" }}
                    >
                      Sales Contribution By Product
                    </h5>
                  </div>
                  <div
                    className="card-body"
                    style={{ maxHeight: "250px", overflow: "auto" }}
                    // onScroll={(e) => handleScroll(e, "SalesContribution")}
                    onScroll={handleSectionScroll}
                  >
                    <div className="table-responsive">
                      <table className="table table-hover no-border mt-2">
                        <thead
                          style={{
                            borderBottom: "1px solid #747474 ",
                          }}
                        >
                          <tr>
                            <th className="p-2 text-left border-b">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium">
                                  Product
                                </span>
                                <img
                                  src={
                                    sortConfig.key === "section" &&
                                    sortConfig.direction === "asc"
                                      ? SelectArrow
                                      : SelectArrow
                                  }
                                  alt=""
                                  style={{
                                    width: "10px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleSort1("section")}
                                />
                              </div>
                            </th>
                            <th className="p-2 text-left border-b">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium">
                                  Total Sales
                                </span>
                                <img
                                  src={
                                    sortConfig.key === "section" &&
                                    sortConfig.direction === "asc"
                                      ? SelectArrow
                                      : SelectArrow
                                  }
                                  alt=""
                                  style={{
                                    width: "10px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleSort1("total_sales")}
                                />
                              </div>
                            </th>
                            <th className="p-2 text-left border-b">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium">
                                  Sales %
                                </span>
                                <img
                                  src={
                                    sortConfig.key === "section" &&
                                    sortConfig.direction === "asc"
                                      ? SelectArrow
                                      : SelectArrow
                                  }
                                  alt=""
                                  style={{
                                    width: "10px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleSort1("total_sales_percentage")
                                  }
                                />
                              </div>
                            </th>

                            <th className="p-2 text-left border-b">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium">
                                  {" "}
                                  ASP
                                </span>
                                <img
                                  src={
                                    sortConfig.key === "section" &&
                                    sortConfig.direction === "asc"
                                      ? SelectArrow
                                      : SelectArrow
                                  }
                                  alt=""
                                  style={{
                                    width: "10px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleSort1("asp")}
                                />
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Sections.map((item, index) => {
                            const totalsales = calculateOpacity(
                              item.total_sales,
                              minQtyitem,
                              maxQtyitem
                            );
                            const totalsalespert = calculateOpacity1(
                              item.total_sales_percentage,
                              minValueitem,
                              maxValueitem
                            );
                            const asp = calculateOpacity(
                              item.asp,
                              minPercentageitem,
                              maxPercentageitem
                            );

                            return (
                              <tr
                                key={index}
                                style={{
                                  borderBottom: "1px solid #6b728038",
                                }}
                              >
                                <td
                                  className="text-dark p-1"
                                  style={{
                                    fontSize: "11px",
                                    fontFamily: "Inter",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item.section}
                                </td>
                                <td
                                  className="text-dark p-1"
                                  style={{
                                    fontSize: "11px",
                                    fontFamily: "Inter",
                                    fontWeight: "bold",
                                    backgroundColor: `rgba(4, 126, 163, ${totalsales})`,
                                  }}
                                >
                                  {formatNumber(item.total_sales)}
                                </td>
                                <td
                                  className="text-dark p-1"
                                  style={{
                                    fontSize: "11px",
                                    fontFamily: "Inter",
                                    fontWeight: "bold",
                                    backgroundColor: `rgba(4, 126, 163, ${totalsalespert})`,
                                  }}
                                >
                                  {item.total_sales_percentage}
                                </td>
                                <td
                                  className="text-dark p-1"
                                  style={{
                                    fontSize: "11px",
                                    fontFamily: "Inter",
                                    fontWeight: "bold",
                                    backgroundColor: `rgba(4, 126, 163, ${asp})`,
                                  }}
                                >
                                  {formatNumber(item.asp)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {SalesContributionloading || Sectionsresponse !== "OK" ? (
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
                          {Sections.length === 0 && (
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
              {/* salesclose */}
            </div>
          </div>
          {/* //close first */}
          {/* sales row 2desgin */}

          {/* close two */}
          {/* row third design */}
          <div
            className="p-1 w-full mt-2"
            style={{
              display: "flex",
              gap: "5px",
              height: "300px",
              width: "100%",
            }}
          >
            {/* top10brand */}
            <div className="" style={{ width: "50%" }}>
              <div className="" style={{ width: "100%" }}>
                <div
                  className="card-header d-flex align-items-center justify-content-center"
                  style={{
                    height: "30px",
                    background: "#CCCCCC",
                  }}
                >
                  <h5
                    className="text-center mb-0 fw-bold text-black"
                    style={{ fontSize: "12px", fontFamily: "Inter" }}
                  >
                    Sales Contribution by Brand
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "250px", overflow: "auto" }}
                  onScroll={handleBrandSalesScroll}
                >
                  <div className="table-responsive">
                    <table className="table table-hover no-border mt-2">
                      <thead
                        style={{
                          borderBottom: "1px solid #747474 ",
                        }}
                      >
                        <tr>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Brand Name
                              </span>
                              <img
                                src={
                                  sortConfig5.key === "brand_name" &&
                                  sortConfig5.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort6("brand_name")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Total Sales
                              </span>
                              <img
                                src={
                                  sortConfig5.key === "total_sales" &&
                                  sortConfig5.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort6("total_sales")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Sales %
                              </span>
                              <img
                                src={
                                  sortConfig5.key ===
                                    "total_sales_percentage" &&
                                  sortConfig5.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSort6("total_sales_percentage")
                                }
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Sales Qty
                              </span>
                              <img
                                src={
                                  sortConfig5.key === "section" &&
                                  sortConfig5.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort6("sales_qty")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Sales Qty%
                              </span>
                              <img
                                src={
                                  sortConfig5.key === "section" &&
                                  sortConfig5.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSort6("sales_qty_percentage")
                                }
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium"> ASP</span>
                              <img
                                src={
                                  sortConfig5.key === "section" &&
                                  sortConfig5.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort6("asp")}
                              />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedBrandSales.map((item, index) => {
                          // const isTop10 = top10Brands.includes(item);
                          // const backgroundColor = isTop10
                          //   ? `rgba(4, 126, 163, ${(10 - index) / 10})`
                          //   : "transparent";
                          const totalsales = calculateOpacity(
                            item.total_sales,
                            minQtyitembrandsales,
                            maxQtyitembrandsales
                          );
                          const totalsalespert = calculateOpacity1(
                            item.total_sales_percentage,
                            minValueitembrandsales,
                            maxValueitembrandsales
                          );
                          const salesQty = calculateOpacity(
                            item.sales_qty,
                            minSalesbrandsales,
                            maxSalesbrandsales
                          );

                          const salesQtyPercentage = calculateOpacity1(
                            item.sales_qty_percentage,
                            minSalesQtyPercentagebrandsales,
                            maxSalesQtyPercentagebrandsales
                          );
                          const asp = calculateOpacity(
                            item.asp,
                            minPercentageitembrandsales,
                            maxPercentageitembrandsales
                          );
                          return (
                            <tr
                              key={index}
                              style={{
                                borderBottom: "1px solid #6b728038",
                              }}
                            >
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                }}
                              >
                                {item.brand_name}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${totalsales})`,
                                }}
                              >
                                {formatNumber(item.total_sales)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  // backgroundColor,
                                  backgroundColor: `rgba(4, 126, 163, ${totalsalespert})`,
                                }}
                              >
                                {item.total_sales_percentage}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${salesQty})`,
                                }}
                              >
                                {formatNumber(item.sales_qty)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${salesQtyPercentage})`,
                                }}
                              >
                                {item.sales_qty_percentage}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${asp})`,
                                }}
                              >
                                {formatNumber(item.asp)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {BrandSalesloading || BrandSalesresponse !== "OK" ? (
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
                        {sortedBrandSales.length === 0 && (
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
            {/* top10brandclose */}
            {/* top10item */}
            <div className="" style={{ width: "50%" }}>
              <div className="" style={{ width: "100%" }}>
                <div
                  className="card-header d-flex align-items-center justify-content-center"
                  style={{
                    height: "30px",
                    background: "#CCCCCC",
                  }}
                >
                  <h5
                    className="text-center mb-0 fw-bold text-black"
                    style={{ fontSize: "12px", fontFamily: "Inter" }}
                  >
                    Sales Contribution by Item
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "250px", overflow: "auto" }}
                  onScroll={handleBrandItemScroll}
                >
                  <div className="table-responsive">
                    <table className="table table-hover no-border mt-2">
                      <thead
                        style={{
                          borderBottom: "1px solid #747474 ",
                        }}
                      >
                        <tr>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {" "}
                                Actual Item
                              </span>
                              <img
                                src={
                                  sortConfig6.key === "section" &&
                                  sortConfig6.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort7("actual_item")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Total Sales
                              </span>
                              <img
                                src={
                                  sortConfig6.key === "section" &&
                                  sortConfig6.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort7("total_sales")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Sales %
                              </span>
                              <img
                                src={
                                  sortConfig6.key === "section" &&
                                  sortConfig6.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSort7("total_sales_percentage")
                                }
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Sales Qty
                              </span>
                              <img
                                src={
                                  sortConfig6.key === "section" &&
                                  sortConfig6.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort7("sales_qty")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Sales Qty%
                              </span>
                              <img
                                src={
                                  sortConfig6.key === "section" &&
                                  sortConfig6.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSort7("sales_qty_percentage")
                                }
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium"> ASP</span>
                              <img
                                src={
                                  sortConfig6.key === "section" &&
                                  sortConfig6.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort7("asp")}
                              />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedBrandItem.map((item, index) => {
                          // const isTop10 = top10Item.includes(item);

                          // const backgroundColor = isTop10
                          //   ? `rgba(4, 126, 163, ${(10 - index) / 10})`
                          //   : "transparent";
                          const totalsales = calculateOpacity(
                            item.total_sales,
                            minQtyitembranditem,
                            maxQtyitembranditem
                          );
                          const totalsalespert = calculateOpacity1(
                            item.total_sales_percentage,
                            minValueitembranditem,
                            maxValueitembranditem
                          );
                          const salesQty = calculateOpacity(
                            item.sales_qty,
                            minSalesbranditem,
                            maxSalesbranditem
                          );

                          const salesQtyPercentage = calculateOpacity1(
                            item.sales_qty_percentage,
                            minSalesQtyPercentagebranduitem,
                            maxSalesQtyPercentagebranditem
                          );
                          const asp = calculateOpacity(
                            item.asp,
                            minPercentageitembranditem,
                            maxPercentageitembranditem
                          );
                          return (
                            <tr
                              key={index}
                              style={{
                                borderBottom: "1px solid #6b728038",
                              }}
                            >
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                }}
                              >
                                {item.actual_item}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${totalsales})`,
                                }}
                              >
                                {formatNumber(item.total_sales)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${totalsalespert})`,
                                }}
                              >
                                {item.total_sales_percentage}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${salesQty})`,
                                }}
                              >
                                {formatNumber(item.sales_qty)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${salesQtyPercentage})`,
                                }}
                              >
                                {item.sales_qty_percentage}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${asp})`,
                                }}
                              >
                                {formatNumber(item.asp)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {ItemSalesloading || BrandItemresponse !== "OK" ? (
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
                        {sortedBrandItem.length === 0 && (
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
            {/* top10close */}
          </div>
          {/* //close third */}
          {/* second nav */}
          <div
            className="space-y-6 d-flex mt-1"
            style={{
              backgroundColor: "#1C3644",
              // width: 1226,
              height: 50,
              justifyContent: "center",
              marginTop: "12px",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-between text-white fw-bold fs-7"
              style={{
                backgroundColor: "#1C3644",
              }}
            >
              <p>Discount Analysis - Y Day</p>
            </div>
          </div>

          {/* close second nav */}
          {/* fourth row */}
          <div
            className="p-1 w-100 d-flex gap-2 mt-1 "
            style={{ height: "500px", width: "100%" }}
          >
            <div
              className="d-flex items-center justify-center gap-4"
              style={{
                width: "28%",
              }}
            >
              {/* discount Circle1 */}
              <div className="md:col-span-1 d-flex items-center justify-center">
                <div className="pt-0">
                  <div className="flex items-center justify-center flex-col gap-1">
                    <p className="fs-6 text-dark fw-bold">Discount</p>

                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: "133px",
                        height: "133px",
                        borderRadius: "50%",
                        border: "2px solid #003F7F",
                      }}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: "122px",
                          height: "122px",
                          borderRadius: "50%",
                          background:
                            "radial-gradient(87.96% 80.96% at 53% 25.98%, rgb(103, 172, 213) 8%, rgba(93, 118, 174, 23.616) 50%, rgba(9, 87, 177, 0) 181%)",
                          border: "2px solid #003F7F",
                          // background: "#377D9F",
                        }}
                      >
                        <div className="text-center">
                          <h3
                            className="text-2xl  text-white"
                            style={{
                              fontFamily: "Inter",
                              fontSize: 14,
                            }}
                          >
                            {salesData2 && salesData2.Disc_amt_in_cr
                              ? salesData2.Disc_amt_in_cr
                              : "Loading..."}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* discri1close */}
              <div className="md:col-span-1 d-flex items-center justify-center">
                <div className="pt-0">
                  <div className="flex items-center justify-center flex-col gap-1">
                    <p className="fs-6 text-dark fw-bold">Discount%</p>
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: "133px",
                        height: "133px",
                        borderRadius: "50%",
                        border: "2px solid #003F7F",
                      }}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: "122px",
                          height: "122px",
                          borderRadius: "50%",
                          background:
                            "radial-gradient(87.96% 80.96% at 53% 25.98%, rgb(103, 172, 213) 8%, rgba(93, 118, 174, 23.616) 50%, rgba(9, 87, 177, 0) 181%)",
                          border: "2px solid #003F7F",
                          // background: "#377D9F",
                        }}
                      >
                        <div className="text-center">
                          <h3
                            className="text-2xl  text-white"
                            style={{
                              fontFamily: "Inter",
                              fontSize: 14,
                            }}
                          >
                            {salesData3 && salesData3.disc_amt_percentage
                              ? salesData3.disc_amt_percentage
                              : "Loading..."}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* dir2circlose */}

            {/* disbranch*/}
            <div
              className=""
              style={{
                width: "36%",
                display: "flex",
                flexDirection: "column",
                // height: "400px",
                // justifyContent: "space-between",
                gap: "37",
              }}
            >
              <div className="" style={{ width: "100%", height: "50%" }}>
                <div
                  className="card-header d-flex align-items-center justify-content-center"
                  style={{
                    height: "30px",
                    background: "#CCCCCC",
                  }}
                >
                  <h5
                    className="text-center mb-0 fw-bold text-black"
                    style={{ fontSize: "12px", fontFamily: "Inter" }}
                  >
                    Discount Availed (Product)
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "250px", overflow: "auto" }}
                  onScroll={handleDiscountsectionScroll}
                >
                  <div className="table-responsive">
                    <table className="table table-hover no-border mt-2">
                      <thead
                        style={{
                          borderBottom: "1px solid #747474 ",
                        }}
                      >
                        <tr>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Product
                              </span>
                              <img
                                src={
                                  sortConfig9.key === "section" &&
                                  sortConfig9.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort10("section")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {" "}
                                Disc amt
                              </span>
                              <img
                                src={
                                  sortConfig9.key === "section" &&
                                  sortConfig9.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort10("disc_amt")}
                              />
                            </div>
                          </th>

                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Total Sales
                              </span>
                              <img
                                src={
                                  sortConfig9.key === "section" &&
                                  sortConfig9.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort10("total_sales")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {" "}
                                Disc %
                              </span>
                              <img
                                src={
                                  sortConfig9.key === "section" &&
                                  sortConfig9.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSort10("disc_amt_percentage")
                                }
                              />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {DiscountSection.map((item, index) => {
                          const totalsales = calculateOpacity(
                            item.total_sales,
                            minQtyitemdissection,
                            maxQtyitemdissection
                          );
                          const totalsalespert = calculateOpacity1(
                            item.disc_amt_percentage,
                            minValueitemdissection,
                            maxValueitemdissection
                          );
                          const disamt = calculateOpacity(
                            item.disc_amt,
                            minPercentageitemdissection,
                            maxPercentageitemdissection
                          );
                          return (
                            <tr
                              key={index}
                              style={{
                                borderBottom: "1px solid #6b728038",
                              }}
                            >
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                }}
                              >
                                {item.section}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${disamt})`,
                                }}
                              >
                                {formatNumber(item.disc_amt)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${totalsales})`,
                                }}
                              >
                                {formatNumber(item.total_sales)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${totalsalespert})`,
                                }}
                              >
                                {item.disc_amt_percentage}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {DiscountSectionloading ||
                    DiscountSectionresponse !== "OK" ? (
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
                        {DiscountSection.length === 0 && (
                          <div className="text-center text-gray-600 py-2">
                            <p>No data available</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="" style={{ width: "100%", height: "50%" }}>
                <div
                  className="card-header d-flex align-items-center justify-content-center"
                  style={{
                    height: "30px",
                    background: "#CCCCCC",
                  }}
                >
                  <h5
                    className="text-center mb-0 fw-bold text-black"
                    style={{ fontSize: "12px", fontFamily: "Inter" }}
                  >
                    Discount Availed (Brand)
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "250px", overflow: "auto" }}
                  onScroll={handleDiscountbrandScroll}
                >
                  <div className="table-responsive">
                    <table className="table table-hover no-border mt-2">
                      <thead
                        style={{
                          borderBottom: "1px solid #747474 ",
                        }}
                      >
                        <tr>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {" "}
                                Brand
                              </span>
                              <img
                                src={
                                  sortConfig10.key === "section" &&
                                  sortConfig10.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort11("brand_name")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {" "}
                                Disc amt
                              </span>
                              <img
                                src={
                                  sortConfig10.key === "section" &&
                                  sortConfig10.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort11("disc_amt")}
                              />
                            </div>
                          </th>

                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Total Sales
                              </span>
                              <img
                                src={
                                  sortConfig10.key === "section" &&
                                  sortConfig10.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort11("total_sales")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {" "}
                                Disc %
                              </span>
                              <img
                                src={
                                  sortConfig10.key === "section" &&
                                  sortConfig10.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSort11("disc_amt_percentage")
                                }
                              />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {DiscountBrand.map((item, index) => {
                          const totalsales = calculateOpacity(
                            item.total_sales,
                            minQtyitemdisbrand,
                            maxQtyitemdisbrand
                          );
                          const totalsalespert = calculateOpacity1(
                            item.disc_amt_percentage,
                            minValueitemdisbrand,
                            maxValueitemdisbrand
                          );
                          const disamt = calculateOpacity(
                            item.disc_amt,
                            minPercentageitemdisbrand,
                            maxPercentageitemdisbrand
                          );
                          return (
                            <tr
                              key={index}
                              style={{
                                borderBottom: "1px solid #6b728038",
                              }}
                            >
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                }}
                              >
                                {item.brand_name}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${disamt})`,
                                }}
                              >
                                {formatNumber(item.disc_amt)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${totalsales})`,
                                }}
                              >
                                {formatNumber(item.total_sales)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${totalsalespert})`,
                                }}
                              >
                                {item.disc_amt_percentage}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {DiscountBrandloading || DiscountBrandresponse !== "OK" ? (
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
                        {DiscountBrand.length === 0 && (
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
            {/* disbranch */}
            {/* discity */}
            <div className="" style={{ width: "36%" }}>
              <div className="" style={{ width: "100%" }}>
                <div
                  className="card-header d-flex align-items-center justify-content-center"
                  style={{
                    height: "30px",
                    background: "#CCCCCC",
                  }}
                >
                  <h5
                    className="text-center mb-0 fw-bold text-black"
                    style={{ fontSize: "12px", fontFamily: "Inter" }}
                  >
                    Discount Availed (Model NO)
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "495px", overflow: "auto" }}
                  onScroll={handleDiscountmodelScroll}
                  // onScroll={(e) => handleDiscountmodelScroll(e, "DiscountModelNo")}
                >
                  <div className="table-responsive">
                    <table className="table table-hover no-border mt-2">
                      <thead
                        style={{
                          borderBottom: "1px solid #747474 ",
                        }}
                      >
                        <tr>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {" "}
                                ModelNo
                              </span>
                              <img
                                src={
                                  sortConfig11.key === "section" &&
                                  sortConfig11.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort12("model_no")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {" "}
                                Disc amt
                              </span>
                              <img
                                src={
                                  sortConfig11.key === "section" &&
                                  sortConfig11.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort12("disc_amt")}
                              />
                            </div>
                          </th>

                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                Total Sales
                              </span>
                              <img
                                src={
                                  sortConfig11.key === "section" &&
                                  sortConfig11.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleSort12("total_sales")}
                              />
                            </div>
                          </th>
                          <th className="p-2 text-left border-b">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {" "}
                                Disc %
                              </span>
                              <img
                                src={
                                  sortConfig11.key === "section" &&
                                  sortConfig11.direction === "asc"
                                    ? SelectArrow
                                    : SelectArrow
                                }
                                alt=""
                                style={{
                                  width: "10px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSort12("disc_amt_percentage")
                                }
                              />
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {DiscountModelNo.map((item, index) => {
                          const totalsales = calculateOpacity(
                            item.total_sales,
                            minQtyitemdismodel,
                            maxQtyitemdismodel
                          );
                          const totalsalespert = calculateOpacity1(
                            item.disc_amt_percentage,
                            minValueitemdismodel,
                            maxValueitemdismodel
                          );
                          const disamt = calculateOpacity(
                            item.disc_amt,
                            minPercentageitemdismodel,
                            maxPercentageitemdismodel
                          );
                          return (
                            <tr
                              key={index}
                              style={{
                                borderBottom: "1px solid #6b728038",
                              }}
                            >
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                }}
                              >
                                {item.model_no}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${disamt})`,
                                }}
                              >
                                {formatNumber(item.disc_amt)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${totalsales})`,
                                }}
                              >
                                {formatNumber(item.total_sales)}
                              </td>
                              <td
                                className="text-dark p-1"
                                style={{
                                  fontSize: "11px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${totalsalespert})`,
                                }}
                              >
                                {item.disc_amt_percentage}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {DiscountModelloading ||
                    DiscountModelNoresponse !== "OK" ? (
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
                        {DiscountModelNo.length === 0 && (
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
            {/* cityclose */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysis;
