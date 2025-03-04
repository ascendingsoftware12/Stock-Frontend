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
  const [storecode, setstorecode] = useState(null);

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

  const [placeholdersection, setPlaceholdersection] = useState("All");
  const [placeholderbrand, setPlaceholderbrand] = useState("All");
  const [placeholdermodule, setPlaceholdermodule] = useState("All");
  const [placeholderdes, setPlaceholderdes] = useState("All");
  const [placeholderdemo, setPlaceholderdemo] = useState("All");
  const [placeholderage, setPlaceholderage] = useState("All");
  const [placeholderprice, setPlaceholderprice] = useState("All");

  const [sortColumnsection, setSortColumnsection] = useState("value");
  const [sortDirectionsection, setSortDirectionsection] = useState("desc");

  const [sortColumnitem, setSortColumnitem] = useState("value");
  const [sortDirectionitem, setSortDirectionitem] = useState("desc");

  const [sortColumnbrand, setSortColumnbrand] = useState("value");
  const [sortDirectionbrand, setSortDirectionbrand] = useState("desc");

  const [sortColumnmodel, setSortColumnmodel] = useState("value");
  const [sortDirectionmodel, setSortDirectionmodel] = useState("desc");
  const [sortColumnitem1, setSortColumnitem1] = useState("value");
  const [sortDirectionitem1, setSortDirectionitem1] = useState("desc");

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  const handleSort5 = (column) => {
    if (sortColumnsection === column) {
      setSortDirectionsection(sortDirectionsection === "asc" ? "desc" : "asc");
    } else {
      setSortColumnsection(column);
      setSortDirectionsection("desc");
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

  // const storecode = sessionStorage.getItem("storecode");

  // setstorecode(storecode);
  useEffect(() => {
    console.log("useEffect triggered");

    fetchAgeing();
    fetchPrice();
    fetchSectionwise(1, true);

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

  const handleSectionScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hstorecodeoreDataSection &&
      !BySectionloading &&
      BySectionpage > 1
    ) {
      fetchSectionwise(BySectionpage);
    }
  };

  const handleBrandScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hstorecodeoreDataBrand &&
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
      hstorecodeoreDataItemana &&
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
      hstorecodeoreDatamodel &&
      !ByModelloading &&
      Modelpage > 1
    ) {
      fetchPriceAna(Modelpage);
    }
  };

  //ageing
  const [ByAgeingloading, setAgeingloading] = useState(false);

  // const [HstorecodeoreDataAgeing, setHstorecodeoreDataAgeing] = useState(true);
  const [Ageingresponse, setAgeingresponse] = useState("");
  const controllerRef1 = useRef(null);
  const fetchAgeing = async () => {
    setAgeingloading(true);
    if (controllerRef1.current) {
      controllerRef1.current.abort();
    }
    controllerRef1.current = new AbortController();
    const signal = controllerRef1.current.signal;
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreOverAllBucket?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}
        `,
        { signal }
      );
      setAgeingresponse(response.statusText);
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
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setAgeingloading(false);
    }
  };
  //price
  const [ByPriceloading, setPriceloading] = useState(false);
  const [Priceresponse, setPriceresponse] = useState("");
  const controllerRef2 = useRef(null);
  const fetchPrice = async () => {
    setPriceloading(true);
    if (controllerRef2.current) {
      controllerRef2.current.abort();
    }
    controllerRef2.current = new AbortController();
    const signal = controllerRef2.current.signal;
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisPriceBucket?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`,
        { signal }
      );
      setPriceresponse(response.statusText);
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
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setPriceloading(false);
    }
  };

  //section
  const [BySectionloading, setSectionloading] = useState(false);
  const [BySectionpage, setSectionpage] = useState(1);
  const Sectionlimit = 30;
  const [hstorecodeoreDataSection, setHstorecodeoreDataSection] =
    useState(true);
  const [Sectionwiseresponse, setSectionwiseresponse] = useState("");
  const controllerRef3 = useRef(null);
  const fetchSectionwise = async (page = 1, resetData = false) => {
    setSectionloading(true);
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreSection?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${BySectionpage}&limit=${Sectionlimit}`,
        { signal }
      );
      setSectionwiseresponse(response.statusText);
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
        setHstorecodeoreDataSection(false);
      } else {
        setHstorecodeoreDataSection(true);
        setSectionpage(page + 1);
      }
    } catch (error) {
      setHstorecodeoreDataSection(false);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setSectionloading(false);
    }
  };

  //brandana
  const [ByBrandloading, setBrandloading] = useState(false);
  const [Brandpage, setBrandpage] = useState(1);
  const [hstorecodeoreDataBrand, setHstorecodeoreDataBrand] = useState(true);
  const Brandlimit = 30;
  const [BrandAnaresponse, setBrandAnaresponse] = useState("");
  const controllerRef4 = useRef(null);
  const fetchBrandAna = async (page = 1, resetData = false) => {
    setBrandloading(true);
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreBrand?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${Brandpage}&limit=${Brandlimit}`,
        { signal }
      );
      setBrandAnaresponse(response.statusText);
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
        setHstorecodeoreDataBrand(false);
      } else {
        setHstorecodeoreDataBrand(true);
        setBrandpage(page + 1);
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
      setBrandloading(false);
    }
  };

  //itemAnaly
  const [ByItemloading, setItemloading] = useState(false);
  const [Itempage, setItempage] = useState(1);
  const [hstorecodeoreDataItemana, setHstorecodeoreDataItemana] =
    useState(true);
  const Itemlimit = 30;
  const [ItemAnasresponse, setItemAnasresponse] = useState("");
  const controllerRef5 = useRef(null);
  const fetchItemAnas = async (page = 1, resetData = false) => {
    setItemloading(true);
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreItem?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${Itempage}&limit=${Itemlimit}`,
        { signal }
      );
      setItemAnasresponse(response.statusText);
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
        setHstorecodeoreDataItemana(false);
      } else {
        setHstorecodeoreDataItemana(true);
        setItempage(page + 1);
      }
    } catch (error) {
      setHstorecodeoreDataItemana(false);
      console.error("Error fetching data:", error);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setItemloading(false);
    }
  };

  //price
  const [ByModelloading, setModelloading] = useState(false);
  const [Modelpage, setModelpage] = useState(1);
  const [hstorecodeoreDatamodel, setHstorecodeoreDatamodel] = useState(true);
  const Modellimit = 30;
  const [PriceAnaresponse, setPriceAnaresponse] = useState("");
  const controllerRef6 = useRef(null);
  const fetchPriceAna = async (page = 1, resetData = false) => {
    setModelloading(true);
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreModelNo?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}&page=${Modelpage}&limit=${Modellimit}`,
        { signal }
      );
      setPriceAnaresponse(response.statusText);
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
        setHstorecodeoreDatamodel(false);
      } else {
        setHstorecodeoreDatamodel(true);
        setModelpage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setHstorecodeoreDatamodel(false);
      if (axios.isCancel(error)) {
        console.warn(
          "Previous request aborted. Only the last request is processed."
        );
      } else {
        console.error("Error fetching SalesCity Data:", error);
      }
    } finally {
      setModelloading(false);
    }
  };

  // option

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const [DropdownDataresponse, setDropdownDataresponse] = useState("");
  const controllerRef7 = useRef(null);
  const fetchDropdownData = async () => {
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreColumn?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`,
        { signal }
      );
      setDropdownDataresponse(response.statusText);
      setDropdownData(response.data);
      console.log("dropdown");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
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

  const [refresh, setrefresh] = useState(false);
  const [isFiltersUpdated, setIsFiltersUpdated] = useState(false);
  const reloadRefresh = () => {
    setInitialFilters("");
    fetchliveData();
    setIsFiltersUpdated(true);

    setAgeing([]);
    setPrice([]);
    setSections([]);

    setSections3([]);
    setSections4([]);
    setSections5([]);
    setQuantityData([]);
    setValueData([]);
    setBrandData([]);
    setItemData([]);
    setAgeingData([]);
    setHoldingData([]);

    setSectionpage(1);

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

    setSelectedOptionsection(null);
    setSelectedOptionbrand(null);

    setSelectedOptionmodule(null);
    setSelectedOptioncateg(null);
    setSelectedOptiondemo(null);

    setSelectedOptionprice(null);
    setSelectedOptionage(null);
    setrefresh(false);
  };

  const reloadWithFilters = () => {
    setrefresh(true);

    setAgeing([]);
    setPrice([]);
    setSections([]);

    setSections3([]);
    setSections4([]);
    setSections5([]);
    setIsFiltersUpdated(true);

    setSectionpage(1);

    setBrandpage(1);
    setItempage(1);
    setModelpage(1);
    setInitialFilters(filters);
  };
  useEffect(() => {
    if (isFiltersUpdated) {
      setIsApplyDisabled(true);

      setAgeing([]);
      setPrice([]);
      setSections([]);

      setSections3([]);
      setSections4([]);
      setSections5([]);
      setQuantityData([]);
      setValueData([]);
      setBrandData([]);
      setItemData([]);
      setAgeingData([]);
      setHoldingData([]);

      setSectionpage(1);
      setBrandpage(1);
      setItempage(1);
      setModelpage(1);

      setIsFiltersUpdated(false);
      const queryString = new URLSearchParams(filters).toString();
      const baseUrl = "stock_analysis_kore/";
      const clearedUrl = `${baseUrl}?${queryString}`;
      console.log("API URL being called:", clearedUrl);
      fetchDropdownData();

      fetchAgeing();
      fetchSectionwise();

      fetchBrandAna();
      fetchItemAnas();
      fetchPriceAna();

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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreQuantity?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setQuantityData([response.data.data]);
      console.log("fetchQuantityData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchValueData = async () => {
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreSellingPrice?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setValueData([response.data.data]);
      console.log("fetchValueData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchBrandData = async () => {
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreNoOfBrands?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setBrandData([response.data.data]);
      console.log("fetchBrandData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchItemData = async () => {
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreNoOfItems?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setItemData([response.data.data]);
      console.log("fetchItemData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchAgeingData = async () => {
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreAgeing?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
      );
      setAgeingData([response.data.data]);
      console.log("fetchAgeingData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  const fetchHoldingData = async () => {
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
        item_name: cleanEncode(filters.item_name),

        section: cleanEncode(filters.section),
        modelno: cleanEncode(filters.modelno),
        demo_flag: cleanEncode(filters.demo_flag),
        PriceBreakup2: cleanEncode(filters.PriceBreakup2),

        overall_age: cleanEncode(filters.overall_age),
        IMEI_STATUS: cleanEncode(filters.IMEI_STATUS),
        brand: cleanEncode(filters.brand),
      };
      const response = await axios.get(
        `stock_analysis_kore/stockAnalysisKoreHoldingCost?&section=${encodedFilters.section}&brand=${encodedFilters.brand}&demo_flag=${encodedFilters.demo_flag}&PriceBreakup2=${encodedFilters.PriceBreakup2}&modelno=${encodedFilters.modelno}&item_name=${encodedFilters.item_name}&storecode=${storecode}&IMEI_STATUS=${encodedFilters.IMEI_STATUS}&overall_age=${encodedFilters.overall_age}`
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
      const response = await axios.get(
        "/stock_analysis_kore/kore_table_modificatio"
      );

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
                          {formatNumber(item.Purchase_rate)}
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
                    width: "33%",
                    border: "1px solid black",
                    height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "400px",
                    // overflow: "scroll",
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
                    {ByAgeingloading || Ageingresponse !== "OK" ? (
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
                    width: "33%",
                    border: "1px solid black",
                    height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "400px",
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
                    {ByPriceloading || Priceresponse !== "OK" ? (
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
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "33%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "400px",
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
                      By Product
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
                      Product
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
                    {BySectionloading || Sectionwiseresponse !== "OK" ? (
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
              </div>
            </div>

            {/* //table row2*/}

            {/* //table */}

            {/* //table row3*/}
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
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "33%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "400px",
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
                    {ByBrandloading || BrandAnaresponse !== "OK" ? (
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
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "33%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "400px",
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
                    {ByModelloading || PriceAnaresponse !== "OK" ? (
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
                    width: "33%",
                    border: "1px solid black",
                    // height: "433px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    height: "400px",
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
                    {ByItemloading || ItemAnasresponse !== "OK" ? (
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
