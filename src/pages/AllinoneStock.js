import React, { useState, useMemo, useEffect, useRef } from "react";

import "flowbite/dist/flowbite.css";
import "../style/table.css";
import { Button, Label, TextInput, Table } from "flowbite-react";
import axios from "axios";
import Select from "react-select";
// import DatePicker from "react-datepicker";
import "../style/overall.css";
import SelectArrow from "../images/ArrowDn.png";

function AllinoneStock() {
  const [asm, setasm] = useState(null);

  const [brandSection, setBrandSection] = useState([]);
  const [citySection, setCitySection] = useState([]);
  const [ageing, setAgeing] = useState([]);
  const [price, setPrice] = useState([]);
  const [sections, setSections] = useState([]);
  const [sections1, setSections1] = useState([]);
  const [sections2, setSections2] = useState([]);
  const [sections3, setSections3] = useState([]);
  const [sections4, setSections4] = useState([]);
  const [sections5, setSections5] = useState([]);
  const [placeholdertime, setPlaceholdertime] = useState("All");
  const [placeholderbranch, setPlaceholderbranch] = useState("All");
  const [placeholdercity, setPlaceholdercity] = useState("All");
  const [placeholdersection, setPlaceholdersection] = useState("All");
  const [placeholderbrand, setPlaceholderbrand] = useState("All");
  const [placeholderitem, setPlaceholderitem] = useState("All");
  const [placeholderproduct, setPlaceholderproduct] = useState("All");
  const [placeholdermodule, setPlaceholdermodule] = useState("All");
  const [placeholderdes, setPlaceholderdes] = useState("All");
  const [placeholderdemo, setPlaceholderdemo] = useState("All");
  const [placeholderage, setPlaceholderage] = useState("All");
  const [placeholderprice, setPlaceholderprice] = useState("All");
  const [sortColumn, setSortColumn] = useState("value");
  const [sortDirection, setSortDirection] = useState("desc");

  const [sortColumnsection, setSortColumnsection] = useState("value");
  const [sortDirectionsection, setSortDirectionsection] = useState("desc");

  const [sortColumnitem, setSortColumnitem] = useState("value");
  const [sortDirectionitem, setSortDirectionitem] = useState("desc");

  const [sortColumnproduct, setSortColumnproduct] = useState("value");
  const [sortDirectionproduct, setSortDirectionproduct] = useState("desc");

  const [sortColumnbrand, setSortColumnbrand] = useState("value");
  const [sortDirectionbrand, setSortDirectionbrand] = useState("desc");

  const [sortColumnmodel, setSortColumnmodel] = useState("value");
  const [sortDirectionmodel, setSortDirectionmodel] = useState("desc");
  const [sortColumnitem1, setSortColumnitem1] = useState("value");
  const [sortDirectionitem1, setSortDirectionitem1] = useState("desc");
  const [sortColumncity, setSortColumncity] = useState("value");
  const [sortDirectioncity, setSortDirectioncity] = useState("desc");
  // const [sortColumnageing, setSortColumnageing] = useState("value");
  // const [sortDirectionageing, setSortDirectionageing] = useState("desc");

  // const [sortColumnprice, setSortColumnprice] = useState("value");
  // const [sortDirectionprice, setSortDirectionprice] = useState("desc");
  //brandsection

  // const formatNumber = (value) => {
  //   if (value !== undefined && value !== null) {
  //     return new Intl.NumberFormat().format(value);
  //   }
  //   return "";
  // };
  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };
  const handleSort2 = (column) => {
    if (sortColumncity === column) {
      setSortDirectioncity(sortDirectioncity === "asc" ? "desc" : "asc");
    } else {
      setSortColumncity(column);
      setSortDirectioncity("desc");
    }
  };

  const handleSort5 = (column) => {
    if (sortColumnsection === column) {
      setSortDirectionsection(sortDirectionsection === "asc" ? "desc" : "asc");
    } else {
      setSortColumnsection(column);
      setSortDirectionsection("desc");
    }
  };
  const handleSort6 = (column) => {
    if (sortColumnitem === column) {
      setSortDirectionitem(sortDirectionitem === "asc" ? "desc" : "asc");
    } else {
      setSortColumnitem(column);
      setSortDirectionitem("desc");
    }
  };
  const handleSort7 = (column) => {
    if (sortColumnproduct === column) {
      setSortDirectionproduct(sortDirectionproduct === "asc" ? "desc" : "asc");
    } else {
      setSortColumnproduct(column);
      setSortDirectionproduct("desc");
    }
  };
  const handleSort8 = (column) => {
    if (sortColumnbrand === column) {
      setSortDirectionbrand(sortDirectionbrand === "asc" ? "desc" : "asc");
    } else {
      setSortColumnbrand(column);
      setSortDirectionbrand("desc");
    }
  };

  const handleSort9 = (column) => {
    if (sortColumnmodel === column) {
      setSortDirectionmodel(sortDirectionmodel === "asc" ? "desc" : "asc");
    } else {
      setSortColumnmodel(column);
      setSortDirectionmodel("desc");
    }
  };
  const handleSort10 = (column) => {
    if (sortColumnitem1 === column) {
      setSortDirectionitem1(sortDirectionitem1 === "asc" ? "desc" : "asc");
    } else {
      setSortColumnitem1(column);
      setSortDirectionitem1("desc");
    }
  };
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "desc" });
  const handleSort1 = (key) => {
    console.log("hhhh", key);

    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

    const sortedData = [...brandSection].sort((a, b) => {
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;

      return 0;
    });
    setSortConfig({ key, direction });
    setBrandSection(sortedData);
  };

  // const asm = sessionStorage.getItem("asm");

  // setasm(asm);
  useEffect(() => {
    console.log("useEffect triggered");
    fetchBrandwise(1, true);
    fetchCitywise(1, true);
    fetchAgeing();
    fetchPrice();
    fetchSectionwise(1, true);
    fetchItemwise(1, true);
    fetchProductwise(1, true);
    fetchBrandAna(1, true);
    fetchItemAnas(1, true);
    fetchPriceAna(1, true);
    fetchDropdownData();
    fetchQuantityData();
    fetchValueData();
    fetchBrandData();
    fetchItemData();
    fetchAgeingData();
    fetchHoldingData();
    fetchliveData();
  }, []);

  const [dropdownData, setDropdownData] = useState({
    brand: [],
    city: [],
    sale_type: [],
    demo_flag: [],
    item_category: [],
    product: [],
    section: [],
    modelno: [],
    selling_price: [],
    branch_name: [],
    item_name: [],
    IMEI_STATUS: [],
    overall_age: [],
  });
  const [filters, setFilters] = useState({
    city: "",
    branch_name: "",
    brand: "",
    product: "",
    section: "",
    modelno: "",
    srn_flag: "",
    demo_flag: "",
    gstfillter: "",
    selling_price: "",
    item_category: "",
    sale_type: "",
    store_name: "",
    item_name: "",
    IMEI_STATUS: "",
    overall_age: "",
  });
  const [initialFilters, setInitialFilters] = useState(filters);
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);

  useEffect(() => {
    const filtersChanged = Object.keys(filters).some(
      (key) => filters[key] !== initialFilters[key]
    );
    setIsApplyDisabled(!filtersChanged);
  }, [filters, initialFilters]);

  const handleBranchScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    console.log("handlel");
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      HasMoreDataBranch &&
      !ByBranchloading &&
      Branchpage > 1
    ) {
      fetchBrandwise(Branchpage);
    }
  };

  const handleCityScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataCity &&
      !ByCityloading &&
      Citypage > 1
    ) {
      fetchCitywise(Citypage);
    }
  };

  const handleSectionScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataSection &&
      !BySectionloading &&
      BySectionpage > 1
    ) {
      fetchSectionwise(BySectionpage);
    }
  };
  const handleItemwiseScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataItemcat &&
      !ByItemCategoryloading &&
      ByItemPage > 1
    ) {
      fetchItemwise(ByItemPage);
    }
  };

  const handleProductScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataProduct &&
      !ByProductloading &&
      Productpage > 1
    ) {
      fetchProductwise(Productpage);
    }
  };

  const handleBrandScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataBrand &&
      !ByBrandloading &&
      Brandpage > 1
    ) {
      fetchBrandAna(Brandpage);
    }
  };
  const handleItemanaScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDataItemana &&
      !ByItemloading &&
      Itempage > 1
    ) {
      fetchItemAnas(Itempage);
    }
  };

  const handleModalScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMoreDatamodel &&
      !ByModelloading &&
      Modelpage > 1
    ) {
      fetchPriceAna(Modelpage);
    }
  };
  const [Branchpage, setBranchpage] = useState(1);
  const [ByBranchloading, setBranchloading] = useState(false);
  const [HasMoreDataBranch, setHasMoreDataBranch] = useState(true);
  const Branchlimit = 10;

  const fetchBrandwise = async (page = 1, resetData = false) => {
    console.log(page, "branchpage");
    setBranchloading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisBranch?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${Branchpage}&limit=${Branchlimit}`
      );

      const data = response.data.data;
      const sortedData = data.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });
      setBrandSection((prevData) =>
        resetData ? sortedData : [...prevData, ...sortedData]
      );

      if (sortedData.length < Branchlimit) {
        setHasMoreDataBranch(false);
      } else {
        setHasMoreDataBranch(true);
        setBranchpage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setHasMoreDataBranch(false);
    } finally {
      setBranchloading(false);
    }
  };

  const [ByCityloading, setCityloading] = useState(false);
  const Citylimit = 60;
  const [Citypage, setCitypage] = useState(1);
  const [hasMoreDataCity, setHasMoreDataCity] = useState(true);
  const fetchCitywise = async (page = 1, resetData = false) => {
    setCityloading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisCity?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${Citypage}&limit=${Citylimit}`
      );

      const data = response.data.data;
      const sortedData = data.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });
      setCitySection((prevData) =>
        resetData ? sortedData : [...prevData, ...sortedData]
      );

      if (sortedData.length < Citylimit) {
        setHasMoreDataCity(false);
      } else {
        setHasMoreDataCity(true);
        setCitypage(page + 1);
      }
    } catch (error) {
      setHasMoreDataCity(false);
      console.error("Error fetching data:", error);
    } finally {
      setCityloading(false);
    }
  };

  //ageing
  const [ByAgeingloading, setAgeingloading] = useState(false);

  // const [HasMoreDataAgeing, setHasMoreDataAgeing] = useState(true);

  const fetchAgeing = async () => {
    setAgeingloading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisOverAllBucket?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}
        `
      );

      const data = response.data.data;
      const sortOrder = [
        "upto 1 week",
        "1-2 weeks",
        "2-3 weeks",
        "3-4 weeks",
        "1-3 Months",
        "4-6 Months",
        "7-9 Months",
        "9-12 Months",
        "More than a year",
        "Null",
      ];

      const sortedData = data.sort((a, b) => {
        return (
          sortOrder.indexOf(a.overall_age_bucket) -
          sortOrder.indexOf(b.overall_age_bucket)
        );
      });

      setAgeing(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAgeingloading(false);
    } finally {
      setAgeingloading(false);
    }
  };
  //price
  const [ByPriceloading, setPriceloading] = useState(false);

  const fetchPrice = async () => {
    setPriceloading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisPriceBucket?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );

      const data = response.data.data;
      const sortedData = data.sort((a, b) => {
        const getMaxValue = (bucket) => {
          if (bucket.includes(">")) return Infinity;
          const parts = bucket.split("-");
          return parts.length > 1
            ? parseInt(parts[1], 10)
            : parseInt(parts[0], 10);
        };

        const maxA = getMaxValue(a.price_bucket);
        const maxB = getMaxValue(b.price_bucket);

        return maxA - maxB;
      });

      setPrice(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPriceloading(false);
    } finally {
      setPriceloading(false);
    }
  };

  //section
  const [BySectionloading, setSectionloading] = useState(false);
  const [BySectionpage, setSectionpage] = useState(1);
  const Sectionlimit = 30;
  const [hasMoreDataSection, setHasMoreDataSection] = useState(true);
  const fetchSectionwise = async (page = 1, resetData = false) => {
    setSectionloading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisSection?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${BySectionpage}&limit=${Sectionlimit}`
      );
      console.log(response);

      const data = response.data.data || [];
      const sortedData = data.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });
      setSections((prevData) =>
        resetData ? sortedData : [...prevData, ...sortedData]
      );
      if (sortedData.length < Sectionlimit) {
        setHasMoreDataSection(false);
      } else {
        setHasMoreDataSection(true);
        setSectionpage(page + 1);
      }
    } catch (error) {
      setHasMoreDataSection(false);
      console.error("Error fetching data:", error);
    } finally {
      setSectionloading(false);
    }
  };

  //item
  const [ByItemPage, setByItemPage] = useState(1);
  const ItemLimit = 15;
  const [ByItemCategoryloading, setItemCategoryLoading] = useState(false);
  const [hasMoreDataItemcat, setHasMoreDataItemcat] = useState(true);
  const fetchItemwise = async (page = 1, resetData = false) => {
    setItemCategoryLoading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisItemCategory?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${ByItemPage}&limit=${ItemLimit}`
      );
      const data = response.data.data || [];
      const sortedData = data.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });
      if (ByItemPage === 1) {
        setSections1(sortedData);
        setSections1(sortedData);
      } else {
        setSections1((prevData) =>
          resetData ? sortedData : [...prevData, ...sortedData]
        );
      }
      if (sortedData.length < ItemLimit) {
        setHasMoreDataItemcat(false);
      } else {
        setHasMoreDataItemcat(true);
        setByItemPage(page + 1);
      }
    } catch (error) {
      setHasMoreDataItemcat(false);
      console.error("Error fetching data:", error);
    } finally {
      setItemCategoryLoading(false);
    }
  };

  //product
  const [ByProductloading, setProductloading] = useState(false);
  const [Productpage, setProductpage] = useState(1);
  const Productlimit = 30;
  const [hasMoreDataProduct, setHasMoreDataProduct] = useState(true);
  const fetchProductwise = async (page = 1, resetData = false) => {
    setProductloading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisProduct?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${Productpage}&limit=${Productlimit}`
      );
      const data = response.data.data;
      const sortedData = data.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });
      if (Productpage === 1) {
        setSections2(sortedData);
      } else {
        setSections2((prevData) =>
          resetData ? sortedData : [...prevData, ...sortedData]
        );
      }
      if (sortedData.length < Productlimit) {
        setHasMoreDataProduct(false);
      } else {
        setHasMoreDataProduct(true);
        setProductpage(page + 1);
        console.log("proooooodddd", Productpage);
      }
    } catch (error) {
      setHasMoreDataProduct(false);
      console.error("Error fetching data:", error);
    } finally {
      setProductloading(false);
    }
  };

  //brandana
  const [ByBrandloading, setBrandloading] = useState(false);
  const [Brandpage, setBrandpage] = useState(1);
  const [hasMoreDataBrand, setHasMoreDataBrand] = useState(true);
  const Brandlimit = 30;
  const fetchBrandAna = async (page = 1, resetData = false) => {
    setBrandloading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisBrand?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${Brandpage}&limit=${Brandlimit}`
      );

      const data = response.data.data;
      const sortedData = data.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });
      if (Brandpage === 1) {
        setSections3(data);
      } else {
        setSections3((prevData) =>
          resetData ? sortedData : [...prevData, ...sortedData]
        );
      }

      if (sortedData.length < Brandlimit) {
        setHasMoreDataBrand(false);
      } else {
        setHasMoreDataBrand(true);
        setBrandpage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setBrandloading(false);
    }
  };

  //itemAnaly
  const [ByItemloading, setItemloading] = useState(false);
  const [Itempage, setItempage] = useState(1);
  const [hasMoreDataItemana, setHasMoreDataItemana] = useState(true);
  const Itemlimit = 30;
  const fetchItemAnas = async (page = 1, resetData = false) => {
    setItemloading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisItem?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${Itempage}&limit=${Itemlimit}`
      );
      const data = response.data.data;
      const sortedData = data.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });
      if (Itempage === 1) {
        setSections5(sortedData);
      } else {
        setSections5((prevData) =>
          resetData ? sortedData : [...prevData, ...sortedData]
        );
      }

      if (sortedData.length < Itemlimit) {
        setHasMoreDataItemana(false);
      } else {
        setHasMoreDataItemana(true);
        setItempage(page + 1);
      }
    } catch (error) {
      setHasMoreDataItemana(false);
      console.error("Error fetching data:", error);
    } finally {
      setItemloading(false);
    }
  };

  //price
  const [ByModelloading, setModelloading] = useState(false);
  const [Modelpage, setModelpage] = useState(1);
  const [hasMoreDatamodel, setHasMoreDatamodel] = useState(true);
  const Modellimit = 30;
  const fetchPriceAna = async (page = 1, resetData = false) => {
    setModelloading(true);
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisModelNo?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${Modelpage}&limit=${Modellimit}`
      );
      const data = response.data.data;
      const sortedData = data.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });
      if (Modelpage === 1) {
        setSections4(sortedData);
      } else {
        setSections4((prevData) =>
          resetData ? sortedData : [...prevData, ...sortedData]
        );
      }

      if (sortedData.length < Itemlimit) {
        setHasMoreDatamodel(false);
      } else {
        setHasMoreDatamodel(true);
        setModelpage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setHasMoreDatamodel(false);
    } finally {
      setModelloading(false);
    }
  };

  // option

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchDropdownData = async () => {
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisColumn?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setDropdownData(response.data);
      console.log("dropdown");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
    }
  };

  const [refresh, setrefresh] = useState(false);
  const [isFiltersUpdated, setIsFiltersUpdated] = useState(false);
  const reloadRefresh = () => {
    setInitialFilters("");
    fetchliveData();
    setIsFiltersUpdated(true);
    setBrandSection([]);
    setCitySection([]);
    setAgeing([]);
    setPrice([]);
    setSections([]);
    setSections1([]);
    setSections2([]);
    setSections3([]);
    setSections4([]);
    setSections5([]);
    setQuantityData([]);
    setValueData([]);
    setBrandData([]);
    setItemData([]);
    setAgeingData([]);
    setHoldingData([]);
    setBranchpage(1);
    setCitypage(1);
    setSectionpage(1);
    setByItemPage(1);
    setProductpage(1);
    setBrandpage(1);
    setItempage(1);
    setModelpage(1);

    setFilters({
      city: "",
      branch_name: "",
      brand: "",
      product: "",
      section: "",
      modelno: "",
      srn_flag: "",
      demo_flag: "",
      gstfillter: "",
      selling_price: "",
      item_category: "",
      sale_type: "",
      store_name: "",
      item_name: "",
      IMEI_STATUS: "",
      overall_age: "",
    });
    setDropdownData({
      brand: [],
      city: [],
      sale_type: [],
      demo_flag: [],
      item_category: [],
      product: [],
      section: [],
      modelno: [],
      selling_price: [],
      branch_name: [],
      item_name: [],
      IMEI_STATUS: [],
      overall_age: [],
    });
    setSelectedOptionbranch(null);
    setSelectedOptioncity(null);
    setSelectedOptionsection(null);
    setSelectedOptionbrand(null);
    setSelectedOptionitem(null);
    setSelectedOptionproduct(null);
    setSelectedOptionmodule(null);
    setSelectedOptioncateg(null);
    setSelectedOptiondemo(null);
    setSelectedOptiontime(null);
    setSelectedOptionprice(null);
    setSelectedOptionage(null);
    setrefresh(false);
  };

  const reloadWithFilters = () => {
    setrefresh(true);
    setBrandSection([]);
    setCitySection([]);
    setAgeing([]);
    setPrice([]);
    setSections([]);
    setSections1([]);
    setSections2([]);
    setSections3([]);
    setSections4([]);
    setSections5([]);
    setIsFiltersUpdated(true);
    setBranchpage(1);
    setCitypage(1);
    setSectionpage(1);
    setByItemPage(1);
    setProductpage(1);
    setBrandpage(1);
    setItempage(1);
    setModelpage(1);
    setInitialFilters(filters);
  };
  useEffect(() => {
    if (isFiltersUpdated) {
      setIsApplyDisabled(true);
      setBrandSection([]);
      setCitySection([]);
      setAgeing([]);
      setPrice([]);
      setSections([]);
      setSections1([]);
      setSections2([]);
      setSections3([]);
      setSections4([]);
      setSections5([]);
      setQuantityData([]);
      setValueData([]);
      setBrandData([]);
      setItemData([]);
      setAgeingData([]);
      setHoldingData([]);
      setBranchpage(1);
      setCitypage(1);
      setSectionpage(1);
      setByItemPage(1);
      setProductpage(1);
      setBrandpage(1);
      setItempage(1);
      setModelpage(1);

      setIsFiltersUpdated(false);
      const queryString = new URLSearchParams(filters).toString();
      const baseUrl = "stock_analysis/";
      const clearedUrl = `${baseUrl}?${queryString}`;
      console.log("API URL being called:", clearedUrl);
      fetchDropdownData();
      fetchBrandwise();
      fetchCitywise();
      fetchAgeing();
      fetchSectionwise();
      fetchItemwise();
      fetchProductwise();
      fetchBrandAna();
      fetchItemAnas();
      fetchPriceAna();
      fetchDropdownData();
      fetchPrice();
      fetchQuantityData();
      fetchValueData();
      fetchBrandData();
      fetchItemData();
      fetchAgeingData();
      fetchHoldingData();
    }
  }, [filters, isFiltersUpdated]);

  const minQty = Math.min(...sections.map((section) => section.qty));
  const maxQty = Math.max(...sections.map((section) => section.qty));
  const minValue = Math.min(...sections.map((section) => section.value));
  const maxValue = Math.max(...sections.map((section) => section.value));
  const minPercentage = Math.min(
    ...sections.map((section) => section.value_sum_percentage)
  );
  const maxPercentage = Math.max(
    ...sections.map((section) => section.value_sum_percentage)
  );
  //branc
  const minQtybrand = Math.min(...brandSection.map((section) => section.qty));
  const maxQtybrand = Math.max(...brandSection.map((section) => section.qty));
  const minValuebrand = Math.min(
    ...brandSection.map((section) => section.value)
  );
  const maxValuebrand = Math.max(
    ...brandSection.map((section) => section.value)
  );
  const minPercentagebrand = Math.min(
    ...brandSection.map((section) => section.value_sum_percentage)
  );
  const maxPercentagebrand = Math.max(
    ...brandSection.map((section) => section.value_sum_percentage)
  );
  //city
  const minQtycity = Math.min(...citySection.map((section) => section.qty));
  const maxQtycity = Math.max(...citySection.map((section) => section.qty));
  const minValuecity = Math.min(...citySection.map((section) => section.value));
  const maxValuecity = Math.max(...citySection.map((section) => section.value));
  const minPercentagecity = Math.min(
    ...citySection.map((section) => section.value_sum_percentage)
  );
  const maxPercentagecity = Math.max(
    ...citySection.map((section) => section.value_sum_percentage)
  );
  //ageing
  const minQtyageing = Math.min(...ageing.map((section) => section.Total_qty));
  const maxQtyageing = Math.max(...ageing.map((section) => section.Total_qty));
  const minValueageing = Math.min(
    ...ageing.map((section) => section.total_selling_price)
  );
  const maxValueageing = Math.max(
    ...ageing.map((section) => section.total_selling_price)
  );
  const minPercentageageing = Math.min(
    ...ageing.map((section) => section.percentage)
  );
  const maxPercentageageing = Math.max(
    ...ageing.map((section) => section.percentage)
  );
  //price
  const minQtyprice = Math.min(
    ...price.map((section) => section.total_quantity)
  );
  const maxQtyprice = Math.max(
    ...price.map((section) => section.total_quantity)
  );
  const minValueprice = Math.min(
    ...price.map((section) => section.total_selling_price)
  );
  const maxValueprice = Math.max(
    ...price.map((section) => section.total_selling_price)
  );
  const minPercentageprice = Math.min(
    ...price.map((section) => section.percentage)
  );
  const maxPercentageprice = Math.max(
    ...price.map((section) => section.percentage)
  );
  //itemcat
  const minQtyitemcat = Math.min(...sections1.map((section) => section.qty));
  const maxQtyitemcat = Math.max(...sections1.map((section) => section.qty));
  const minValueitemcat = Math.min(
    ...sections1.map((section) => section.value)
  );
  const maxValueitemcat = Math.max(
    ...sections1.map((section) => section.value)
  );
  const minPercentageitemcat = Math.min(
    ...sections1.map((section) => section.value_sum_percentage)
  );
  const maxPercentageitemcat = Math.max(
    ...sections1.map((section) => section.value_sum_percentage)
  );
  //product
  const minQtyproduct = Math.min(...sections2.map((section) => section.qty));
  const maxQtyproduct = Math.max(...sections2.map((section) => section.qty));
  const minValueproduct = Math.min(
    ...sections2.map((section) => section.value)
  );
  const maxValueproduct = Math.max(
    ...sections2.map((section) => section.value)
  );
  const minPercentageproduct = Math.min(
    ...sections2.map((section) => section.value_sum_percentage)
  );
  const maxPercentageproduct = Math.max(
    ...sections2.map((section) => section.value_sum_percentage)
  );

  //brandby
  const minQtybrandby = Math.min(...sections3.map((section) => section.qty));
  const maxQtybrandby = Math.max(...sections3.map((section) => section.qty));
  const minValuebrandby = Math.min(
    ...sections3.map((section) => section.value)
  );
  const maxValuebrandby = Math.max(
    ...sections3.map((section) => section.value)
  );
  const minPercentagebrandby = Math.min(
    ...sections3.map((section) => section.value_sum_percentage)
  );
  const maxPercentagebrandby = Math.max(
    ...sections3.map((section) => section.value_sum_percentage)
  );
  //model
  const minQtymodel = Math.min(...sections4.map((section) => section.qty));
  const maxQtymodel = Math.max(...sections4.map((section) => section.qty));
  const minValuemodel = Math.min(...sections4.map((section) => section.value));
  const maxValuemodel = Math.max(...sections4.map((section) => section.value));
  const minPercentagemodel = Math.min(
    ...sections4.map((section) => section.value_sum_percentage)
  );
  const maxPercentagemodel = Math.max(
    ...sections4.map((section) => section.value_sum_percentage)
  );
  ////item
  const minQtyitem = Math.min(...sections5.map((section) => section.qty));
  const maxQtyitem = Math.max(...sections5.map((section) => section.qty));
  const minValueitem = Math.min(...sections5.map((section) => section.value));
  const maxValueitem = Math.max(...sections5.map((section) => section.value));
  const minPercentageitem = Math.min(
    ...sections5.map((section) => section.value_sum_percentage)
  );
  const maxPercentageitem = Math.max(
    ...sections5.map((section) => section.value_sum_percentage)
  );
  // const calculateOpacity = (value, min, max) => {
  //   return min === max ? 1 : 0.2 + ((value - min) / (max - min)) * 0.8;
  // };
  const calculateOpacity = (value, min, max) => {
    if (min === max) return min === 0 ? 0.1 : 1;
    const minOpacity = 0.1;
    const maxOpacity = 1;
    return (
      minOpacity + ((value - min) / (max - min)) * (maxOpacity - minOpacity)
    );
  };

  // const calculateOpacity1 = (percentage) => {
  //   if (!percentage) return 0;
  //   const numericValue = parseFloat(percentage.replace("%", ""));
  //   const maxPercentage = 100;
  //   return Math.min(numericValue / maxPercentage, 1);
  // };
  const calculateOpacity1 = (percentage) => {
    if (!percentage) return 0.1;
    const numericValue = parseFloat(percentage.replace("%", ""));
    const minOpacity = 0.1;
    const maxOpacity = 1;
    return minOpacity + (numericValue / 100) * (maxOpacity - minOpacity);
  };

  // count
  const [QuantityData, setQuantityData] = useState([]);
  const [ValueData, setValueData] = useState([]);
  const [BrandData, setBrandData] = useState([]);
  const [ItemData, setItemData] = useState([]);
  const [AgeingData, setAgeingData] = useState([]);
  const [HoldingData, setHoldingData] = useState([]);

  const fetchQuantityData = async () => {
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisQuantity?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setQuantityData([response.data.data]);
      console.log("fetchQuantityData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchValueData = async () => {
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisSellingPrice?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setValueData([response.data.data]);
      console.log("fetchValueData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchBrandData = async () => {
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisNoOfBrands?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setBrandData([response.data.data]);
      console.log("fetchBrandData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchItemData = async () => {
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisNoOfItems?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setItemData([response.data.data]);
      console.log("fetchItemData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchAgeingData = async () => {
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisAgeing?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setAgeingData([response.data.data]);
      console.log("fetchAgeingData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchHoldingData = async () => {
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
        branch_name: cleanEncode(filters.branch_name),
        item_name: cleanEncode(filters.item_name),
        product: cleanEncode(filters.product),
        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),
        item_category: cleanEncode(filters.item_category),
        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `/stock_analysis/stockAnalysisHoldingCost?city=${encodedFilters.city}&branch_name=${encodedFilters.branch_name}&section=${encodedFilters.section}&item_category=${encodedFilters.item_category}&product=${encodedFilters.product}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&asm=${asm}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setHoldingData([response.data.data]);
      console.log("fetchHoldingData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const [currentDateTime, setCurrentDateTime] = useState("");

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
  const [formatteddate, setLiveDate] = useState();
  const [formattedTime, setformattedTime] = useState();
  const fetchliveData = async () => {
    try {
      const response = await axios.get("/stock_analysis/table_modificatio");

      const currentDate = response?.data?.last_modified;

      if (currentDate) {
        // Split the date and time from the last_modified string
        const [dayOfWeek, day, month, year, time] = currentDate.split(" ");

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

      // if (currentDate) {
      //   setCurrentDateTime(currentDate);
      // } else {
      //   console.error("Missing or invalid 'last_modified' data");
      // }
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

  //   updateDateTime();
  //   const intervalId = setInterval(updateDateTime, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  const [selectedOptiontime, setSelectedOptiontime] = useState([]);
  const dropdownValuetime = selectedOptiontime || filters.IMEI_STATUS;
  const optionstime = [
    { label: "IMEI", value: "IMEI" },
    { label: "NON IMEI", value: "NON IMEI" },
  ];
  const handletimeChange = (selectedOptions) => {
    setSelectedOptiontime(selectedOptions);
    if (selectedOptions) {
      // const selectedValues = selectedOptions.map((option) => option.value);
      // const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        IMEI_STATUS: selectedOptions.value,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        IMEI_STATUS: "",
      }));
    }
  };

  const [selectedOptionbranch, setSelectedOptionbranch] = useState(
    dropdownData?.filters?.branch_name?.length > 2
      ? [
          {
            label: dropdownData.branch_name[2],
            value: dropdownData.branch_name[2],
          },
        ]
      : null
  );
  const dropdownValuebranch = selectedOptionbranch || filters.branch_name;
  const optionsbranch = Array.isArray(dropdownData?.branch_name)
    ? dropdownData.branch_name
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((store) => ({
          label: store,
          value: store,
        }))
    : [];
  const handlebranchChange = (selectedOptions) => {
    setSelectedOptionbranch(selectedOptions);
    console.log("Selected item options:brannnnnnnnnnnn", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        branch_name: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        branch_name: "",
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
  const optionscity = dropdownData.city
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
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
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handlesectionChange = (selectedOptions) => {
    setSelectedOptionsection(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
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

  const [selectedOptionbrand, setSelectedOptionbrand] = useState(
    dropdownData?.filters?.brand?.length > 2
      ? [
          {
            label: dropdownData.brand[2],
            value: dropdownData.brand[2],
          },
        ]
      : null
  );
  const dropdownValuebrand = selectedOptionbrand || filters.brand;
  const optionsbrand = dropdownData.brand
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
        brand: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        brand: "",
      }));
    }
  };

  const [selectedOptionitem, setSelectedOptionitem] = useState(
    dropdownData?.filters?.item_category?.length > 2
      ? [
          {
            label: dropdownData.item_category[2],
            value: dropdownData.item_category[2],
          },
        ]
      : null
  );
  const dropdownValueitem = selectedOptionitem || filters.item_category;
  const optionsitem = dropdownData.item_category
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handleitemChange = (selectedOptions) => {
    setSelectedOptionitem(selectedOptions);
    console.log("Selected item options:", selectedOptions);
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
    }
  };

  const [selectedOptionproduct, setSelectedOptionproduct] = useState(
    dropdownData?.filters?.product?.length > 2
      ? [
          {
            label: dropdownData.product[2],
            value: dropdownData.product[2],
          },
        ]
      : null
  );
  const dropdownValueproduct = selectedOptionproduct || filters.product;
  const optionsproduct = dropdownData.product
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handleproductChange = (selectedOptions) => {
    setSelectedOptionproduct(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");

      setFilters((prevFilters) => ({
        ...prevFilters,
        product: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        product: "",
      }));
    }
  };

  const [selectedOptionmodule, setSelectedOptionmodule] = useState(
    dropdownData?.filters?.modelno?.length > 2
      ? [
          {
            label: dropdownData.modelno[2],
            value: dropdownData.modelno[2],
          },
        ]
      : null
  );
  const dropdownValuemodelno = selectedOptionmodule || filters.modelno;
  const optionsmodule = dropdownData.modelno
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handlemoduleChange = (selectedOptions) => {
    setSelectedOptionmodule(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        modelno: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        modelno: "",
      }));
    }
  };

  const [selectedOptioncateg, setSelectedOptioncateg] = useState(
    dropdownData?.filters?.item_name?.length > 2
      ? [
          {
            label: dropdownData.item_name[2],
            value: dropdownData.item_name[2],
          },
        ]
      : null
  );
  const dropdownValueitemname = selectedOptioncateg || filters.item_name;
  const optionscateg = dropdownData.item_name
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handlecategChange = (selectedOptions) => {
    setSelectedOptioncateg(selectedOptions);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");

      setFilters((prevFilters) => ({
        ...prevFilters,
        item_name: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        item_name: "",
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
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const handledemoChange = (selectedOptions) => {
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

  const [selectedOptionage, setSelectedOptionage] = useState(null);

  const optionsage = [
    // { value: "", label: "Select" },
    { value: "0-7", label: " upto 1 week" },
    { value: "8-14", label: " 1-2 weeks" },
    { value: "15-21", label: "2-3 weeks" },
    { value: "22-28", label: "3-4 weeks" },
    { value: "29-90", label: "1-3 Months" },
    { value: "91-180", label: "4-6 Months" },
    { value: "181-270", label: "7-9 Months" },
    { value: "271-365", label: "9-12 Months" },
    { value: "366+", label: "More than a year" },
    { value: "BLANK", label: "Null" },
  ];

  const defaultOptions =
    dropdownData?.overall_age
      ?.slice()
      ?.filter((value) => optionsprice.some((option) => option.value === value))
      ?.map((value) => optionsprice.find((option) => option.value === value)) ||
    [];

  const handleageChange = (selected) => {
    setSelectedOptionage(selected);
    if (selected) {
      const selectedValues = selected.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");

      setFilters((prevFilters) => ({
        ...prevFilters,
        overall_age: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        overall_age: "",
      }));
    }
  };

  const [selectedOptionprice, setSelectedOptionprice] = useState(null);

  // const optionsprice = [
  //   { value: "", label: "Select" },
  //   { value: "0-3000", label: "0-3000" },
  //   { value: "3001-5000", label: "3001-5000" },
  //   { value: "5001-8000", label: "5001-8000" },
  //   { value: "8001-10000", label: "8001-10000" },
  //   { value: "40001-70000", label: "40001-70000" },

  //   { value: "30001-40000", label: "30001-40000" },
  //   { value: "15001-20000", label: "15001-20000" },
  //   { value: "10001-15000", label: "10001-15000" },

  //   { value: "20001-30000", label: "20001-30000" },

  //   { value: "70001-100000", label: "70001-100000" },
  //   { value: ">100000", label: "100000" },
  // ];

  const optionsprice = [
    { value: "", label: "Select" },
    { value: "0-3000", label: "0-3000" },
    { value: "3001-5000", label: "3001-5000" },
    { value: "5001-8000", label: "5001-8000" },
    { value: "8001-10000", label: "8001-10000" },
    { value: "10001-15000", label: "10001-15000" },
    { value: "15001-20000", label: "15001-20000" },
    { value: "20001-30000", label: "20001-30000" },
    { value: "30001-40000", label: "30001-40000" },
    { value: "40001-70000", label: "40001-70000" },
    { value: "70001-100000", label: "70001-100000" },
    { value: ">100000", label: "100000" },
  ];

  const defaultOptions1 =
    dropdownData?.PriceBreakup2?.slice()
      ?.filter((value) => optionsprice.some((option) => option.value === value))
      ?.map((value) => optionsprice.find((option) => option.value === value)) ||
    [];

  const handlepriceChange = (selected) => {
    setSelectedOptionprice(selected);
    if (selected) {
      const selectedValues = selected.map((option) => option.value);
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
    <>
      <div className="p-4 ">
        <div
          className="p-4 rounded-lg dark:border-gray-500 overflow-x-auto "
          style={{
            padding: "20px",
          }}
        >
          <div
            className="p-4 container-fluid rounded-lg shadow bg-white"
            // style={{
            //   width: 1264,
            //   height: 1951,
            //   padding: "10px",
            // }}
          >
            <div
              className="space-y-6 container-fluid"
              style={{
                // backgroundColor: "#1C3644",
                // // width: 1212,
                // height: 50,
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
                  <button
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    style={{
                      backgroundColor: "white",
                      width: "116px",
                      height: "31px",
                      clipPath:
                        "polygon(-3% 5%, 88% 4%, 101% 56%, 88% 97%, -5% 95%, 11% 57%)",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      padding: "7px",
                      color: "black",
                      cursor: "pointer",
                      opacity: isApplyDisabled ? 0.5 : 1,
                      cursor: isApplyDisabled ? "not-allowed" : "pointer",
                    }}
                    type="button"
                    // onClick={reloadWithFilters}
                    onClick={!isApplyDisabled ? reloadWithFilters : null}
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
                </div>

                {/* Center Title */}
                <h5
                  className="m-0"
                  style={{
                    alignItems: "center",
                    color: "white",
                    fontSize: 16,
                    // fontWeight: 600,
                    fontFamily: "Inter",
                  }}
                >
                  Stock-All In One Summary
                </h5>

                {/* Right Side */}
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
                    {/* {currentDateTime} */}
                    {formatteddate}
                    <br></br>
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>

            {/* period first row */}
            <div className="container-fluid my-4">
              <div
                className="row g-3"
                style={{
                  //   alignItems: "center",
                  display: "flex",
                }}
              >
                {/* Dropdown Filters */}
                {/* <div className="col-md-2">{renderDropdown("Sale Type")}</div> */}
                <div className="col-md-2">
                  <label
                    htmlFor="Sales Type"
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    IMEI/NON IMEI
                  </label>
                  <Select
                    options={optionstime}
                    value={dropdownValuetime}
                    onChange={handletimeChange}
                    defaultValue={[
                      { label: "IMEI", value: "IMEI" },
                      { label: "NON IMEI", value: "NON IMEI" },
                    ]}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onFocus={() => setPlaceholdertime("Search...")}
                    onBlur={() => setPlaceholdertime("All")}
                    placeholder={placeholdertime}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Branch
                  </label>
                  <Select
                    options={optionsbranch}
                    value={dropdownValuebranch}
                    onChange={handlebranchChange}
                    isMulti
                    defaultValue={
                      Array.isArray(dropdownData?.branch_name) &&
                      dropdownData.branch_name.length > 2
                        ? [
                            {
                              label: dropdownData.branch_name[2],
                              value: dropdownData.branch_name[2],
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
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    City
                  </label>

                  <Select
                    options={optionscity}
                    value={dropdownValuecity}
                    onChange={handlecityChange}
                    isMulti
                    defaultValue={
                      dropdownData.city
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
                    onFocus={() => setPlaceholdercity("Search...")}
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
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Section
                  </label>

                  <Select
                    options={optionssection}
                    value={dropdownValuesection}
                    onChange={handlesectionChange}
                    isMulti
                    defaultValue={
                      dropdownData.section
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.section[2],
                              value: dropdownData.section[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholdersection("Search...")}
                    onBlur={() => setPlaceholdersection("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholdersection}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 14,
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
                      dropdownData.brand
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.brand[2],
                              value: dropdownData.brand[2],
                            },
                          ]
                        : null
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
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Item Category
                  </label>

                  <Select
                    options={optionsitem}
                    value={dropdownValueitem}
                    onChange={handleitemChange}
                    isMulti
                    defaultValue={
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
                    onFocus={() => setPlaceholderitem("Search...")}
                    onBlur={() => setPlaceholderitem("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderitem}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Product
                  </label>

                  <Select
                    options={optionsproduct}
                    value={dropdownValueproduct}
                    onChange={handleproductChange}
                    isMulti
                    defaultValue={
                      dropdownData.product
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.product[2],
                              value: dropdownData.product[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderproduct("Search...")}
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
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Model No
                  </label>

                  <Select
                    options={optionsmodule}
                    value={dropdownValuemodelno}
                    onChange={handlemoduleChange}
                    isMulti
                    defaultValue={
                      dropdownData.modelno
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.modelno[2],
                              value: dropdownData.modelno[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholdermodule("Search...")}
                    onBlur={() => setPlaceholdermodule("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholdermodule}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Item Description
                  </label>

                  <Select
                    options={optionscateg}
                    value={dropdownValueitemname}
                    onChange={handlecategChange}
                    isMulti
                    defaultValue={
                      dropdownData.item_name
                        .slice()
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.item_name[2],
                              value: dropdownData.item_name[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderdes("Search...")}
                    onBlur={() => setPlaceholderdes("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderdes}
                  />
                </div>
                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Demo Filter
                  </label>

                  <Select
                    options={optionsdemo}
                    value={dropdownValuedemo}
                    onChange={handledemoChange}
                    isMulti
                    defaultValue={
                      dropdownData.demo_flag
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
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Age Bucket
                  </label>

                  <Select
                    options={optionsage}
                    value={selectedOptionage || defaultOptions}
                    onChange={handleageChange}
                    isMulti
                    defaultValue={defaultOptions}
                    onFocus={() => setPlaceholderage("Search...")}
                    onBlur={() => setPlaceholderage("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderage}
                  />
                </div>

                <div className="col-md-2">
                  <label
                    htmlFor="division"
                    style={{
                      color: "black",
                      fontSize: 14,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Price Bucket
                  </label>

                  <Select
                    options={optionsprice}
                    value={selectedOptionprice || defaultOptions}
                    onChange={handlepriceChange}
                    isMulti
                    defaultValue={defaultOptions1}
                    onFocus={() => setPlaceholderprice("Search...")}
                    onBlur={() => setPlaceholderprice("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderprice}
                  />
                </div>
              </div>
            </div>
            {/* //period */}

            {/* //count */}
            <div className="container-fluid mt-4">
              <div className="row justify-space-between">
                {/* //quantity */}
                <div className="col-md-2 col-4 mb-3" style={{ width: "16%" }}>
                  <div className="card shadow-sm text-center">
                    <div
                      className="card-header text-white"
                      style={{ background: "#5788a5" }}
                    >
                      <strong>Quantity</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {QuantityData.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.Quantity)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* value */}
                <div className="col-md-2 col-4 mb-3" style={{ width: "16%" }}>
                  <div className="card shadow-sm text-center">
                    <div
                      className="card-header text-white"
                      style={{ background: "#5788a5" }}
                    >
                      <strong>Value</strong>
                    </div>

                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {ValueData.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.Selling_Price)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* //brand */}
                <div className="col-md-2 col-4 mb-3" style={{ width: "16%" }}>
                  <div className="card shadow-sm text-center">
                    <div
                      className="card-header text-white"
                      style={{ background: "#5788a5" }}
                    >
                      <strong>No of Brands</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {BrandData.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.No_Of_Brands)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* item */}
                <div className="col-md-2 col-4 mb-3" style={{ width: "16%" }}>
                  <div className="card shadow-sm text-center">
                    <div
                      className="card-header text-white"
                      style={{ background: "#5788a5" }}
                    >
                      <strong>No of Items</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {ItemData.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.No_Of_Items)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* //Ageing */}
                <div className="col-md-2 col-4 mb-3" style={{ width: "16%" }}>
                  <div className="card shadow-sm text-center">
                    <div
                      className="card-header text-white"
                      style={{ background: "#5788a5" }}
                    >
                      <strong>Ageing</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {AgeingData.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(Number(item.total_average)?.toFixed(2))}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* //cost */}

                <div className="col-md-2 col-4 mb-3" style={{ width: "16%" }}>
                  <div className="card shadow-sm text-center">
                    <div
                      className="card-header text-white"
                      style={{ background: "#5788a5" }}
                    >
                      <strong>Holding Cost</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {HoldingData.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.holding_value)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* //table */}
            <div>
              <div
                className="row"
                // style={{
                //   height: "433px",
                // }}
              >
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "50%",
                    border: "1px solid black",
                    height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    // overflow: "auto",
                    // height: "248px",
                    height: "382px",
                    overflow: "scroll",
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
                        fontSize: 18,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By Branch
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
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Branch Name
                    </span>

                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("branch_name")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>

                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("qty")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>

                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("value")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>

                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("value_sum_percentage")}
                    />
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                    onScroll={handleBranchScroll}
                  >
                    {/* Table Rows */}
                    {Array.isArray(brandSection) &&
                      brandSection
                        .sort((a, b) => {
                          const aValue = a[sortColumn];
                          const bValue = b[sortColumn];

                          // if (aValue < bValue)
                          //   return sortDirection === "asc" ? -1 : 1;
                          // if (aValue > bValue)
                          //   return sortDirection === "asc" ? 1 : -1;
                          // return 0;
                          const isNumber =
                            !isNaN(parseFloat(aValue)) &&
                            !isNaN(parseFloat(bValue));

                          if (isNumber) {
                            return sortDirection === "asc"
                              ? parseFloat(aValue) - parseFloat(bValue)
                              : parseFloat(bValue) - parseFloat(aValue);
                          } else {
                            return sortDirection === "asc"
                              ? aValue.localeCompare(bValue)
                              : bValue.localeCompare(aValue);
                          }
                        })
                        .map((section, index) => {
                          const qtypacity = calculateOpacity(
                            section.qty,
                            minQtybrand,
                            maxQtybrand
                          );
                          const valueOpacity = calculateOpacity(
                            section.value,
                            minValuebrand,
                            maxValuebrand
                          );
                          const valueSumPercentage = calculateOpacity1(
                            section.value_sum_percentage,
                            minPercentagebrand,
                            maxPercentagebrand
                          );

                          return (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderBottom: "1px solid #6b728038",
                              }}
                            >
                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "left",
                                  fontSize: 11,

                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                {section.branch_name}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontSize: 13,
                                  fontFamily: "Inter",
                                  backgroundColor: `rgba(4, 126, 163, ${qtypacity})`,
                                  padding: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(section.qty || "")}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontSize: 13,

                                  fontFamily: "Inter",
                                  backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`,
                                  padding: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(section.value || "")}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontSize: 13,
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                                }}
                              >
                                {section.value_sum_percentage || ""}
                              </span>
                            </div>
                          );
                        })}

                    {/* Lazy Loader */}
                    {ByBranchloading ? (
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
                        {brandSection.length === 0 && (
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
                    width: "50%",
                    border: "1px solid black",
                    height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    // height: "248px",
                    height: "382px",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "ByCity")}
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
                        fontSize: 18,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By City
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
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      City
                    </span>

                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort2("city")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>

                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort2("qty")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        // fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>

                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort2("value")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>

                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort2("value_sum_percentage")}
                    />
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                    onScroll={handleCityScroll}
                  >
                    {/* Table Rows */}
                    {citySection
                      .sort((a, b) => {
                        const aValue = a[sortColumncity];
                        const bValue = b[sortColumncity];

                        // if (aValue < bValue)
                        //   return sortDirectioncity === "asc" ? -1 : 1;
                        // if (aValue > bValue)
                        //   return sortDirectioncity === "asc" ? 1 : -1;
                        // return 0;
                        const isNumber =
                          !isNaN(parseFloat(aValue)) &&
                          !isNaN(parseFloat(bValue));

                        if (isNumber) {
                          return sortDirectioncity === "asc"
                            ? parseFloat(aValue) - parseFloat(bValue)
                            : parseFloat(bValue) - parseFloat(aValue);
                        } else {
                          return sortDirectioncity === "asc"
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                        }
                      })
                      .map((section, index) => {
                        const qtypacity = calculateOpacity(
                          section.qty,
                          minQtycity,
                          maxQtycity
                        );
                        const valueOpacity = calculateOpacity(
                          section.value,
                          minValuecity,
                          maxValuecity
                        );
                        const valueSumPercentage = calculateOpacity1(
                          section.value_sum_percentage,
                          minPercentagecity,
                          maxPercentagecity
                        );
                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #6b728038",
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                lineBreak: "anywhere",
                              }}
                            >
                              {section.city}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${qtypacity})`,
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.qty || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`, // Use dynamic background color
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.value || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                              }}
                            >
                              {section.value_sum_percentage}
                            </span>
                          </div>
                        );
                      })}

                    {/* Lazy Loader */}
                    {ByCityloading ? (
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
                        {citySection.length === 0 && (
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

            {/* //table */}

            {/* //table */}
            <div>
              <div
                className="row"
                //  style={{height: "458px"}}
              >
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "50%",
                    border: "1px solid black",
                    height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "382px",
                    overflow: "scroll",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "ByAgeing")}
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
                        fontSize: 18,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By Ageing
                    </span>
                  </div>
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      // fontWeight: "bold",
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
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Overall Age Bucket
                    </span>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                  >
                    {/* Table Rows */}
                    {ageing.map((section, index) => {
                      console.log(ageing);

                      const qtypacity = calculateOpacity(
                        section.Total_qty,
                        minQtyageing,
                        maxQtyageing
                      );
                      const valueOpacity = calculateOpacity(
                        section.total_selling_price,
                        minValueageing,
                        maxValueageing
                      );
                      const valueSumPercentage = calculateOpacity1(
                        section.percentage,
                        minPercentageageing,
                        maxPercentageageing
                      );

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #6b728038",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              lineBreak: "anywhere",
                            }}
                          >
                            {section.overall_age_bucket}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${qtypacity})`, // Apply opacity to backgroundColor
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.Total_qty || "")}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`, // Apply opacity to backgroundColor
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.total_selling_price || "")}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                            }}
                          >
                            {section.percentage}
                          </span>
                        </div>
                      );
                    })}

                    {/* Lazy Loader */}
                    {ByAgeingloading ? (
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
                        {ageing.length === 0 && (
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
                    width: "50%",
                    border: "1px solid black",
                    height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "382px",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "ByPrice")}
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
                        fontSize: 18,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By Price
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
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Overall Price Bucket
                    </span>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                  >
                    {/* Table Rows */}
                    {price.map((section, index) => {
                      const qtypacity = calculateOpacity(
                        section.total_quantity,
                        minQtyprice,
                        maxQtyprice
                      );
                      const valueOpacity = calculateOpacity(
                        section.total_selling_price,
                        minValueprice,
                        maxValueprice
                      );
                      const valueSumPercentage = calculateOpacity1(
                        section.percentage,
                        minPercentageprice,
                        maxPercentageprice
                      );
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #6b728038",
                          }}
                        >
                          <span
                            style={{
                              flex: 1,
                              textAlign: "left",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              lineBreak: "anywhere",
                            }}
                          >
                            {section.price_bucket}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${qtypacity})`,
                              padding: "5px",
                              fontWeight: "bold",
                            }}
                          >
                            {formatNumber(section.total_quantity || "")}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`, // Use dynamic background color
                              padding: "5px",
                            }}
                          >
                            {formatNumber(section.total_selling_price || "")}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              textAlign: "right",
                              fontWeight: "bold",
                              fontSize: 13,
                              fontFamily: "Inter",
                              backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                            }}
                          >
                            {section.percentage}
                          </span>
                        </div>
                      );
                    })}

                    {/* Lazy Loader */}
                    {ByPriceloading ? (
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
                        {price.length === 0 && (
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

            {/* //table row2*/}
            <div>
              <div
                className="row"
                style={
                  {
                    // height: "433px",
                  }
                }
              >
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "50%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "382px",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "BySection")}
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
                        fontSize: 18,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By Section
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
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Section
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort5("section")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort5("qty")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort5("value")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort5("value_sum_percentage")}
                    />
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                    onScroll={handleSectionScroll}
                  >
                    {/* Table Rows */}
                    {sections
                      .sort((a, b) => {
                        const aValue = a[sortColumnsection];
                        const bValue = b[sortColumnsection];

                        // if (aValue < bValue)
                        //   return sortDirectionsection === "asc" ? -1 : 1;
                        // if (aValue > bValue)
                        //   return sortDirectionsection === "asc" ? 1 : -1;
                        // return 0;
                        const isNumber =
                          !isNaN(parseFloat(aValue)) &&
                          !isNaN(parseFloat(bValue));

                        if (isNumber) {
                          return sortDirectionsection === "asc"
                            ? parseFloat(aValue) - parseFloat(bValue)
                            : parseFloat(bValue) - parseFloat(aValue);
                        } else {
                          return sortDirectionsection === "asc"
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                        }
                      })
                      .map((section, index) => {
                        const qtypacity = calculateOpacity(
                          section.qty,
                          minQty,
                          maxQty
                        );
                        const valueOpacity = calculateOpacity(
                          section.value,
                          minValue,
                          maxValue
                        );
                        const valueSumPercentage = calculateOpacity1(
                          section.value_sum_percentage,
                          minPercentage,
                          maxPercentage
                        );

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #6b728038",
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                lineBreak: "anywhere",
                              }}
                            >
                              {section.section}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${qtypacity})`,

                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.qty || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`,

                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.value || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                              }}
                            >
                              {section.value_sum_percentage}
                            </span>
                          </div>
                        );
                      })}

                    {/* Lazy Loader */}
                    {BySectionloading ? (
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
                        {sections.length === 0 && (
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
                    width: "50%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "382px",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "ByItemCategory")}
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
                        fontSize: 18,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By Item Category
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
                        fontSize: 14,
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
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort6("item_category")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                      }}
                      onClick={() => handleSort6("qty")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort6("value")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort6("value_sum_percentage")}
                    />
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                    onScroll={handleItemwiseScroll}
                  >
                    {/* Table Rows */}
                    {sections1
                      .sort((a, b) => {
                        const aValue = a[sortColumnitem];
                        const bValue = b[sortColumnitem];

                        // if (aValue < bValue)
                        //   return sortDirectionitem === "asc" ? -1 : 1;
                        // if (aValue > bValue)
                        //   return sortDirectionitem === "asc" ? 1 : -1;
                        // return 0;
                        const isNumber =
                          !isNaN(parseFloat(aValue)) &&
                          !isNaN(parseFloat(bValue));

                        if (isNumber) {
                          return sortDirectionitem === "asc"
                            ? parseFloat(aValue) - parseFloat(bValue)
                            : parseFloat(bValue) - parseFloat(aValue);
                        } else {
                          return sortDirectionitem === "asc"
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                        }
                      })
                      .map((section, index) => {
                        const qtypacity = calculateOpacity(
                          section.qty,
                          minQtyitemcat,
                          maxQtyitemcat
                        );
                        const valueOpacity = calculateOpacity(
                          section.value,
                          minValueitemcat,
                          maxValueitemcat
                        );
                        const valueSumPercentage = calculateOpacity1(
                          section.value_sum_percentage,
                          minPercentageitemcat,
                          maxPercentageitemcat
                        );

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #6b728038",
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                fontWeight: "bold",
                                lineBreak: "anywhere",
                              }}
                            >
                              {section.item_category}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${qtypacity})`,
                                padding: "5px",
                                fontWeight: "bold",
                              }}
                            >
                              {formatNumber(section.qty || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`, // Use dynamic background color
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.value || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                              }}
                            >
                              {section.value_sum_percentage}
                            </span>
                          </div>
                        );
                      })}

                    {/* Lazy Loader */}
                    {ByItemCategoryloading ? (
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
                        {sections1.length === 0 && (
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
            {/* //table */}

            {/* //table row3*/}
            <div>
              <div className="row">
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "50%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "382px",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "ByProduct")}
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
                        fontSize: 18,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By Product
                    </span>
                  </div>
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      // fontWeight: "bold",
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
                        fontSize: 14,
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
                      onClick={() => handleSort7("product")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort7("qty")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort7("value")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort7("value_sum_percentage")}
                    />
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                    onScroll={handleProductScroll}
                  >
                    {/* Table Rows */}
                    {sections2
                      .sort((a, b) => {
                        const aValue = a[sortColumnproduct];
                        const bValue = b[sortColumnproduct];

                        // if (aValue < bValue)
                        //   return sortDirectionproduct === "asc" ? -1 : 1;
                        // if (aValue > bValue)
                        //   return sortDirectionproduct === "asc" ? 1 : -1;
                        // return 0;
                        const isNumber =
                          !isNaN(parseFloat(aValue)) &&
                          !isNaN(parseFloat(bValue));

                        if (isNumber) {
                          return sortDirectionproduct === "asc"
                            ? parseFloat(aValue) - parseFloat(bValue)
                            : parseFloat(bValue) - parseFloat(aValue);
                        } else {
                          return sortDirectionproduct === "asc"
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                        }
                      })
                      .map((section, index) => {
                        const qtypacity = calculateOpacity(
                          section.qty,
                          minQtyproduct,
                          maxQtyproduct
                        );
                        const valueOpacity = calculateOpacity(
                          section.value,
                          minValueproduct,
                          maxValueproduct
                        );
                        const valueSumPercentage = calculateOpacity1(
                          section.value_sum_percentage,
                          minPercentageproduct,
                          maxPercentageproduct
                        );

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #6b728038",
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                lineBreak: "anywhere",
                              }}
                            >
                              {section.product}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${qtypacity})`, // Apply opacity to backgroundColor
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.qty || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`, // Apply opacity to backgroundColor
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.value || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                              }}
                            >
                              {section.value_sum_percentage}
                            </span>
                          </div>
                        );
                      })}

                    {/* Lazy Loader */}
                    {ByProductloading ? (
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
                        {sections2.length === 0 && (
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
                    width: "50%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "382px",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "ByBrand")}
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
                        fontSize: 18,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By Brand
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
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Brand
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort8("brand")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort8("qty")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort8("value")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort8("value_sum_percentage")}
                    />
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                    onScroll={handleBrandScroll}
                  >
                    {/* Table Rows */}
                    {sections3
                      .sort((a, b) => {
                        const aValue = a[sortColumnbrand];
                        const bValue = b[sortColumnbrand];

                        // if (aValue < bValue)
                        //   return sortDirectionbrand === "asc" ? -1 : 1;
                        // if (aValue > bValue)
                        //   return sortDirectionbrand === "asc" ? 1 : -1;
                        // return 0;
                        const isNumber =
                          !isNaN(parseFloat(aValue)) &&
                          !isNaN(parseFloat(bValue));

                        if (isNumber) {
                          return sortDirectionbrand === "asc"
                            ? parseFloat(aValue) - parseFloat(bValue)
                            : parseFloat(bValue) - parseFloat(aValue);
                        } else {
                          return sortDirectionbrand === "asc"
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                        }
                      })
                      .map((section, index) => {
                        const qtypacity = calculateOpacity(
                          section.qty,
                          minQtybrandby,
                          maxQtybrandby
                        );
                        const valueOpacity = calculateOpacity(
                          section.value,
                          minValuebrandby,
                          maxValuebrandby
                        );
                        const valueSumPercentage = calculateOpacity1(
                          section.value_sum_percentage,
                          minPercentagebrandby,
                          maxPercentagebrandby
                        );

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #6b728038",
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                lineBreak: "anywhere",
                              }}
                            >
                              {section.brand}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${qtypacity})`,
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.qty || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`, // Use dynamic background color
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.value || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                              }}
                            >
                              {section.value_sum_percentage}
                            </span>
                          </div>
                        );
                      })}

                    {/* Lazy Loader */}
                    {ByBrandloading ? (
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
                        {sections3.length === 0 && (
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
            {/* //table */}

            {/* //table row4*/}
            <div>
              <div
                className="row"
                style={
                  {
                    // height: "433px",
                  }
                }
              >
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "50%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "382px",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "ByModelNo")}
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
                        fontSize: 18,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By Model No
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
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Model No
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort9("modelno")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort9("qty")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort9("value")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort9("value_sum_percentage")}
                    />
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                    onScroll={handleModalScroll}
                  >
                    {/* Table Rows */}
                    {sections4
                      .sort((a, b) => {
                        const aValue = a[sortColumnmodel];
                        const bValue = b[sortColumnmodel];

                        // if (aValue < bValue)
                        //   return sortDirectionmodel === "asc" ? -1 : 1;
                        // if (aValue > bValue)
                        //   return sortDirectionmodel === "asc" ? 1 : -1;
                        // return 0;
                        const isNumber =
                          !isNaN(parseFloat(aValue)) &&
                          !isNaN(parseFloat(bValue));

                        if (isNumber) {
                          return sortDirectionmodel === "asc"
                            ? parseFloat(aValue) - parseFloat(bValue)
                            : parseFloat(bValue) - parseFloat(aValue);
                        } else {
                          return sortDirectionmodel === "asc"
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                        }
                      })
                      .map((section, index) => {
                        const qtypacity = calculateOpacity(
                          section.qty,
                          minQtymodel,
                          maxQtymodel
                        );
                        const valueOpacity = calculateOpacity(
                          section.value,
                          minValuemodel,
                          maxValuemodel
                        );
                        const valueSumPercentage = calculateOpacity1(
                          section.value_sum_percentage,
                          minPercentagemodel,
                          maxPercentagemodel
                        );

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #6b728038",
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                lineBreak: "anywhere",
                              }}
                            >
                              {section.modelno}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${qtypacity})`, // Apply opacity to backgroundColor
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.qty || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`, // Apply opacity to backgroundColor
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.value || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                              }}
                            >
                              {section.value_sum_percentage}
                            </span>
                          </div>
                        );
                      })}

                    {/* Lazy Loader */}
                    {ByModelloading ? (
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
                {/* //second row */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "50%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "382px",
                    overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                  // onScroll={(e) => handleScroll(e, "ByItem")}
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
                        fontSize: 20,
                        fontFamily: "Inter",
                        fontWeight: "bold",
                        color: "black",
                        padding: "10px",
                      }}
                    >
                      By Item
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
                        fontSize: 14,
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
                      onClick={() => handleSort10("item_name")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Qty
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort10("qty")}
                    />
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort10("value")}
                    />

                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontFamily: "Inter",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Value%
                    </span>
                    <img
                      src={SelectArrow}
                      alt=""
                      style={{
                        width: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort10("value_sum_percentage")}
                    />
                  </div>
                  <div
                    style={{
                      height: "400px",
                      overflow: "auto",
                    }}
                    onScroll={handleItemanaScroll}
                  >
                    {/* Table Rows */}
                    {sections5
                      .sort((a, b) => {
                        const aValue = a[sortColumnitem1];
                        const bValue = b[sortColumnitem1];

                        // if (aValue < bValue)
                        //   return sortDirectionitem1 === "asc" ? -1 : 1;
                        // if (aValue > bValue)
                        //   return sortDirectionitem1 === "asc" ? 1 : -1;
                        // return 0;
                        const isNumber =
                          !isNaN(parseFloat(aValue)) &&
                          !isNaN(parseFloat(bValue));

                        if (isNumber) {
                          return sortDirectionitem1 === "asc"
                            ? parseFloat(aValue) - parseFloat(bValue)
                            : parseFloat(bValue) - parseFloat(aValue);
                        } else {
                          return sortDirectionitem1 === "asc"
                            ? aValue.localeCompare(bValue)
                            : bValue.localeCompare(aValue);
                        }
                      })
                      .map((section, index) => {
                        const qtypacity = calculateOpacity(
                          section.qty,
                          minQtyitem,
                          maxQtyitem
                        );
                        const valueOpacity = calculateOpacity(
                          section.value,
                          minValueitem,
                          maxValueitem
                        );
                        const valueSumPercentage = calculateOpacity1(
                          section.value_sum_percentage,
                          minPercentageitem,
                          maxPercentageitem
                        );

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #6b728038",
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                textAlign: "left",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                lineBreak: "anywhere",
                              }}
                            >
                              {section.item_name}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${qtypacity})`,
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.qty || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueOpacity})`,
                                padding: "5px",
                              }}
                            >
                              {formatNumber(section.value || "")}
                            </span>

                            <span
                              style={{
                                flex: 1,
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: 13,
                                fontFamily: "Inter",
                                backgroundColor: `rgba(4, 126, 163, ${valueSumPercentage})`,
                              }}
                            >
                              {section.value_sum_percentage}
                            </span>
                          </div>
                        );
                      })}

                    {/* Lazy Loader */}
                    {ByItemloading ? (
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
                        {sections5.length === 0 && (
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
            {/* //table */}
          </div>
        </div>
      </div>
    </>
  );
}

export default AllinoneStock;
