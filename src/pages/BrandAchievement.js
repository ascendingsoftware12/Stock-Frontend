import React, { useState, useMemo, useEffect, useRef } from "react";

import "flowbite/dist/flowbite.css";
import "../style/table.css";
import { Button, Label, TextInput, Table } from "flowbite-react";
import axios from "axios";
import Select from "react-select";
import "../style/overall.css";
import SelectArrow from "../images/ArrowDn.png";
import { List } from "react-virtualized";

function BrandAchievement() {
  const [asm, setasm] = useState(null);
  const [BrandWise, setBrandWise] = useState([]);
  // const[BrandFlag,setBrandFlag] = useState([]);
  const [OverALLDetails, setOverALLDetails] = useState([]);
  // const[OverALL,setBrandFlag] = useState([]);
  const [loading, setLoading] = useState(false);

  const [placeholdertime, setPlaceholdertime] = useState("All");

  const [placeholderbrand, setPlaceholderbrand] = useState("All");

  const [placeholderbranch, setPlaceholderbranch] = useState("All");

  const [sortColumnsection, setSortColumnsection] = useState("value");
  const [sortDirectionsection, setSortDirectionsection] = useState("desc");
  const [Disable, setDisable] = useState();

  const handleSortsecond = (column) => {
    if (sortColumnsection === column) {
      setSortDirectionsection(sortDirectionsection === "asc" ? "desc" : "asc");
    } else {
      setSortColumnsection(column);
      setSortDirectionsection("desc");
    }
  };

  const loadMoreData = async () => {
    if (loading) return; // Prevent multiple calls
    setLoading(true);

    try {
      const newData = await fetchsetOverALLDetails();
      setOverALLDetails((prevData) => [...prevData, newData]);

      const newData1 = await fetchsetBrandWise();
      setBrandWise((prevData) => [...prevData, newData1]);
    } catch (error) {
      console.error("Error loading more data", error);
    } finally {
      setLoading(false);
    }
  };

  const cellStyle = {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Inter",
    fontWeight: "bold",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // useEffect(() => {
  //  fetchDropdownData()
  // }, []);

  //OverALLDetails
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // const handleSort1 = (key) => {
  //   const direction =
  //     sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
  //   const sortedData = [...OverALLDetails].sort((a, b) => {
  //     if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
  //     if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
  //     return 0;
  //   });
  //   setSortConfig({ key, direction });
  //   setOverALLDetails(sortedData);
  // };
  const handleSort1 = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

    const sortedData = [...OverALLDetails].sort((a, b) => {
      const valA = a[key] || "";
      const valB = b[key] || "";

      if (direction === "asc") {
        if (valA === "" && valB !== "") return -1;
        if (valB === "" && valA !== "") return 1;
      } else {
        if (valA === "" && valB !== "") return 1;
        if (valB === "" && valA !== "") return -1;
      }

      if (valA > valB) return direction === "asc" ? 1 : -1;
      if (valA < valB) return direction === "asc" ? -1 : 1;
      return 0;
    });

    setSortConfig({ key, direction });
    setOverALLDetails(sortedData);
  };
  //BrandWise
  const [sortConfig1, setSortConfig1] = useState({ key: "", direction: "asc" });

  const handleSort2 = (key) => {
    const direction =
      sortConfig1.key === key && sortConfig1.direction === "asc"
        ? "desc"
        : "asc";
    const sortedData = [...BrandWise].sort((a, b) => {
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      return 0;
    });
    setSortConfig1({ key, direction });
    setBrandWise(sortedData);
  };

  const hasFetchedData = useRef(false);
  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    // fetchsetOverALLDetails(1);
    fetchDropdownData(true);
    setDisable(true);
    // fetchsetBrandWise(1);
  }, []);

  // let lastScrollTop = 0;
  let lastScrollTop = 0;

  // const handleScroll = (e, data) => {
  //   const { scrollHeight, scrollTop, clientHeight, scrollLeft } = e.target;

  //   // Ignore horizontal scroll events
  //   if (scrollLeft !== 0) return;
  //   console.log(scrollLeft);

  //   // Check for vertical scrolling
  //   const isVerticalScroll = scrollTop !== lastScrollTop;
  //   lastScrollTop = scrollTop;

  //   if (!isVerticalScroll) return;

  //   const difference = Math.round(scrollHeight - (scrollTop + clientHeight));
  //   const tolerance = 1;
  //   const isNearBottom = Math.abs(difference) <= tolerance;

  //   console.log("Is near bottom:", isNearBottom);

  //   if (isNearBottom) {
  //     switch (data) {
  //       case "Summary":
  //         fetchsetOverALLDetails().finally(() => setSummaryloading(false));
  //         break;
  //       case "BranchWiseDetails":
  //         fetchsetBrandWise().finally(() => setBrandWiseloading(false));
  //         break;
  //       default:
  //         console.warn("Unknown data type:", data);
  //     }
  //   }
  // };

  const [overAllfinalsize8, setoverAllfinalsize8] = useState();

  const handleScroll = (e, data) => {
    if (overAllfinalsize8 > 0) {
      const { scrollHeight, scrollTop, clientHeight, scrollLeft } = e.target;

      if (scrollLeft !== 0) return;
      console.log(scrollLeft);
      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;

      const difference = Math.round(scrollHeight - (scrollTop + clientHeight));
      const tolerance = 1;
      const isNearBottom = Math.abs(difference) <= tolerance;

      console.log("Is near bottom:", isNearBottom);
      if (isVerticalScroll && !Summaryloading) {
        if (isNearBottom) {
          setSummaryPage((prevPage) => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated summary");
              fetchsetOverALLDetails(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });
          // switch (data) {
          //   case "Summary":
          //     fetchsetOverALLDetails().finally(() => setSummaryloading(false));
          //     break;
          //   case "BranchWiseDetails":
          //     fetchsetBrandWise().finally(() => setBrandWiseloading(false));
          //     break;
          //   default:
          //     console.warn("Unknown data type:", data);
          // }
        }
      }
    }
  };

  // Branch Wise Details
  const [finalsize, setfinalsize] = useState();
  const handleScroll1 = (e, dataKey) => {
    if (finalsize > 0) {
      const { scrollHeight, scrollTop, clientHeight } = e.target;

      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;

      if (isVerticalScroll && !BrandWiseloading) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

        if (isNearBottom) {
          setBrandWisePage((prevPage) => {
            const newPage = prevPage + 1;

            // Prevent duplicate fetches
            if (newPage !== lastFetchedPage.current) {
              console.log(newPage, "Updated WeekAnalysispage");
              fetchsetBrandWise(newPage);
              lastFetchedPage.current = newPage; // Update last fetched page
            }

            return newPage;
          });
        }
      }
    }
  };

  const [Summarypage, setSummaryPage] = useState(1);
  const Summarylimit = 8;
  const [Summaryloading, setSummaryloading] = useState(false);
  const [shouldRun, setShouldRun] = useState(true);

  const lastFetchedPage = useRef(0);

  const fetchsetOverALLDetails = async (OverAllpage, selectedTimeValue) => {
    console.log("fetchsetOverALLDetails", selectedTimeValue);
    setSummaryloading(true);
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
        STORE_NAME: cleanEncode(filters.STORE_NAME),
        TGT_TIMELINE: cleanEncode(filters.TGT_TIMELINE || selectedTimeValue),
        BRAND: cleanEncode(filters.BRAND),
      };

      const response = await axios.get(
        `brand_achievement_analysis/brandachivementsummary?asm=${asm}&page=${OverAllpage}&limit=${Summarylimit}&brand=${encodedFilters.BRAND}&tgt_timeline=${encodedFilters.TGT_TIMELINE}`
      );

      const size = Object.keys(response.data?.values || {}).length;

      setoverAllfinalsize8(size);
      if (response.data && Array.isArray(response.data.data)) {
        const newData = response.data.data;
        const brandOrder = ["OPPO", "VIVO", "SAMSUNG"];
        const sortedData = newData.sort((a, b) => {
          return brandOrder.indexOf(a.brand) - brandOrder.indexOf(b.brand);
        });
        if (sortedData.length < Summarylimit) {
          setShouldRun(false);
        }
        setOverALLDetails((prevData) => [...prevData, ...sortedData]);
        // setSummaryPage((prevPage) => prevPage + 1);
        console.log("OverALLDetails updated:", newData);
      } else {
        console.error("Unexpected data format:", response.data);
        setShouldRun(false);
      }
    } catch (error) {
      console.error("Error fetching OverALLDetails data:", error);
    } finally {
      setSummaryloading(false);
    }
  };

  const [BrandWisepage, setBrandWisePage] = useState(1);
  const BrandWiselimit = 8;
  const [BrandWiseloading, setBrandWiseloading] = useState(false);
  const fetchsetBrandWise = async (brandpage, selectedTimeValue) => {
    setBrandWiseloading(true);

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
        STORE_NAME: cleanEncode(filters.STORE_NAME),
        TGT_TIMELINE: cleanEncode(filters.TGT_TIMELINE || selectedTimeValue),
        BRAND: cleanEncode(filters.BRAND),
      };

      const response = await axios.get(
        `brand_achievement_analysis/brandachivementbranchwisedetails?asm=${asm}&page=${brandpage}&limit=${BrandWiselimit}&brand=${encodedFilters.BRAND}&tgt_timeline=${encodedFilters.TGT_TIMELINE}&store_name=${encodedFilters.STORE_NAME}`
      );

      const size = Object.keys(response.data?.data || {}).length;
      console.log(size);

      setfinalsize(size);

      if (response.data && Array.isArray(response.data.data)) {
        const newData = response.data.data;
        const brandOrder = ["OPPO", "VIVO", "SAMSUNG"];

        // ✅ Merge previous & new data
        setBrandWise((prevData) => {
          const combinedData = [...prevData, ...newData];
          const groupedData = combinedData.reduce((acc, item) => {
            acc[item.store_name] = acc[item.store_name] || [];
            acc[item.store_name].push(item);
            return acc;
          }, {});

          // ✅ Convert grouped data to sorted array
          const sortedData = Object.keys(groupedData)
            .sort() // Sort store names alphabetically
            .flatMap((storeName) =>
              brandOrder.flatMap((brand) =>
                groupedData[storeName].filter((item) => item.brand === brand)
              )
            );

          console.log("BrandWise updated:", sortedData);
          return sortedData; // ✅ Must return updated state
        });

        if (newData.length < BrandWiselimit) {
          setShouldRun(false);
        }
      } else {
        console.error("Unexpected data format:", response.data);
        setShouldRun(false);
        setBrandWiseloading(false);
      }
    } catch (error) {
      console.error("Error fetching BrandWise data:", error);
    } finally {
      setBrandWiseloading(false);
      setShouldRun(false);
    }
  };
  // const fetchsetBrandWise = async (brandpage, selectedTimeValue) => {
  //   setBrandWiseloading(true);

  //   try {
  //     const storedAsm = sessionStorage.getItem("asm");
  //     const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;

  //     const cleanEncode = (value) => {
  //       let decodedValue = value || "";
  //       while (decodedValue !== decodeURIComponent(decodedValue)) {
  //         decodedValue = decodeURIComponent(decodedValue);
  //       }
  //       return encodeURIComponent(decodedValue);
  //     };

  //     const encodedFilters = {
  //       STORE_NAME: cleanEncode(filters.STORE_NAME),
  //       TGT_TIMELINE: cleanEncode(filters.TGT_TIMELINE || selectedTimeValue),
  //       BRAND: cleanEncode(filters.BRAND),
  //     };

  //     const response = await axios.get(
  //       `brand_achievement_analysis/brandachivementbranchwisedetails?asm=${asm}&page=${brandpage}&limit=${BrandWiselimit}&brand=${encodedFilters.BRAND}&tgt_timeline=${encodedFilters.TGT_TIMELINE}&store_name=${encodedFilters.STORE_NAME}`
  //     );
  //     const size = Object.keys(response.data?.data || {}).length;
  //     console.log(size);

  //     setfinalsize(size);
  //     if (response.data && Array.isArray(response.data.data)) {
  //       const newData = response.data.data;
  //       const brandOrder = ["OPPO", "VIVO", "SAMSUNG"];

  //        const groupedData = newData.reduce((acc, item) => {
  //       const store = acc[item.store_name] || [];
  //       store.push(item);
  //       acc[item.store_name] = store;
  //       return acc;
  //     }, {});

  //     // Convert grouped data to array and sort brands
  //     const sortedData = Object.keys(groupedData).flatMap((storeName) =>
  //       brandOrder.flatMap((brand) =>
  //         groupedData[storeName].filter((item) => item.brand === brand)
  //       )
  //     );

  //       console.log(sortedData, "sssssssssssssssssss");
  //       if (sortedData.length < BrandWiselimit) {
  //         setShouldRun(false);
  //       }
  //       setBrandWise((prevData) => [...prevData, ...sortedData]); // ✅ Merge previous & new data

  //       // setBrandWisePage((prevPage) => prevPage + 1);
  //       console.log("BrandWise updated:", sortedData);
  //     } else {
  //       console.error("Unexpected data format:", response.data);
  //       setShouldRun(false);
  //       setBrandWiseloading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching BrandWise data:", error);
  //   } finally {
  //     setBrandWiseloading(false);
  //     setShouldRun(false);
  //   }
  // };

  //  const fetchDropdownData = async () => {
  //     setSummaryloading(true);
  //     setBrandWiseloading(true);

  //     try {
  //       const storedAsm = sessionStorage.getItem("asm");
  //       const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;

  //       const response = await axios.get(
  //         `/brand_achievement_analysis/brandachivementcolumn?&asm=${asm}&brand=${filters.BRAND}&tgt_timeline=${filters.TGT_TIMELINE}&store_name=${filters.STORE_NAME}`
  //       );

  //       console.log("API Response:", response.data);

  //       setDropdownData(response.data);

  //       if (response.data.TGT_TIMELINE?.length > 0) {
  //         const selectedTimeValue = response.data.TGT_TIMELINE[3];

  //         setSelectedOptiontime({
  //           label: selectedTimeValue,
  //           value: selectedTimeValue,
  //         });

  //         fetchsetOverALLDetails(1, selectedTimeValue);
  //         fetchsetBrandWise(1, selectedTimeValue);
  //       } else {
  //         console.warn("TGT_TIMELINE is empty or undefined.");
  //       }

  //       console.log("Dropdown Data Fetched:", response.data);
  //     } catch (error) {
  //       console.error("Error fetching Stocksummary Data:", error);
  //     }
  //   };

  const fetchDropdownData = async (initial1) => {
    setSummaryloading(true);
    setBrandWiseloading(true);
  
    try {
      const storedAsm = sessionStorage.getItem("asm");
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
  
      const response = await axios.get(
        `/brand_achievement_analysis/brandachivementcolumn?&asm=${asm}&brand=${filters.BRAND}&tgt_timeline=${filters.TGT_TIMELINE}&store_name=${filters.STORE_NAME}`
      );
  
      console.log("API Response:", response.data);
  
      setDropdownData(response.data);
  
      if (response.data.TGT_TIMELINE?.length > 0) {
        const timelineArray = response.data.TGT_TIMELINE;
        const targetValue = "01 OCT 2024 - 10 NOV 2024";
        const selectedIndex = timelineArray.findIndex(item => item === targetValue);
  
        if (timelineArray.length > 0) {

          if(initial1===true){
            const selectedTimeValue = timelineArray[selectedIndex];
            setSelectedOptiontime({
              label: selectedTimeValue,
              value: selectedTimeValue,
            });
    
            fetchsetOverALLDetails(1, selectedTimeValue);
            fetchsetBrandWise(1, selectedTimeValue);
          }else{
            const selectedTimeValue = timelineArray;
            setSelectedOptiontime({
              label: selectedTimeValue,
              value: selectedTimeValue,
            });
    
            fetchsetOverALLDetails(1, selectedTimeValue);
            fetchsetBrandWise(1, selectedTimeValue);
          }
          
  
          
        } else {
          console.warn("Target timeline value not found.");
        }
      } else {
        console.warn("TGT_TIMELINE is empty or undefined.");
      }
  
      console.log("Dropdown Data Fetched:", response.data);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };

  // option
  const [dropdownData, setDropdownData] = useState({
    BRAND: [],
    STORE_NAME: [],
    TGT_TIMELINE: [],
  });
  const [filters, setFilters] = useState({
    BRAND: "",
    STORE_NAME: "",
    TGT_TIMELINE: "",
  });

  const [refresh, setrefresh] = useState(false);
  const [reload, setreload] = useState(false);

  const reloadRefresh = () => {
    // fetchDropdownData();
    setreload(true); // Trigger reload
    // loadMoreData();
    setFilters({
      BRAND: "",
      STORE_NAME: "",
      TGT_TIMELINE: "",
    });
    setDropdownData({
      BRAND: [],
      STORE_NAME: [],
      TGT_TIMELINE: [],
    });

    setBrandWise(null);
    setSelectedOptiontime(null);
    setSelectedOptionbrand(null);
    // setSelectedOptionbrand([]);
    setSelectedOptionbranch(null);
    setrefresh(false);
    setBrandWisePage(1);
    setSummaryPage(1);
    setDisable(true);
    // fetchsetOverALLDetails();
    // fetchsetBrandWise();
  };

  useEffect(() => {
    if (reload) {
      console.log("reload triggered");
      setBrandWisePage(1);
      setSummaryPage(1);
      setOverALLDetails([]);
      setBrandWise([]);
      fetchDropdownData(true);

      setSelectedOptionbranch(null);
      setSelectedOptionbrand("");
      setSelectedOptiontime(null);

      // Reset reload after operations
      setreload(false);
    }
  }, [reload]);

  const [Filter, setFilter] = useState(false);

  const [initialFilters, setInitialFilters] = useState(filters);
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);

  const reloadWithFilters = () => {
    console.log("filter");
    setrefresh(true);
    setBrandWisePage(1);
    setSummaryPage(1);
    // fetchDropdownData();
    // fetchsetOverALLDetails();
    // fetchsetBrandWise();
    // setOverALLDetails([]);
    setBrandWise([]);
    setInitialFilters(filters);
    setFilter(true);
  };
  useEffect(() => {
    if (Filter) {
      console.log("reload triggered");
      // setInitialFilters(filters);
      setBrandWisePage(1);
      setSummaryPage(1);
      setOverALLDetails([]);
      setBrandWise([]);
      // fetchDropdownData();
      // fetchsetOverALLDetails();
      // fetchsetBrandWise();
      // setSelectedOptionbranch(null);
      // setSelectedOptionbrand("");
      // setSelectedOptiontime(null);
      // fetchsetBrandWise(1);
      // fetchsetOverALLDetails(1);
      fetchDropdownData(false);
      // Reset reload after operations
      setFilter(false);
    }
    // setBrandWisePage(1);
    // setSummaryPage(1);
  }, [Filter]);

  // const formatNumber = (value) => {
  //   if (value !== undefined && value !== null) {
  //     console.log(new Intl.NumberFormat().format(value));

  //     return new Intl.NumberFormat().format(value);
  //   }
  //   return "";
  // };

  // const formatNumber = (value) => {
  //   if (isNaN(value)) return "0";
  //   return parseInt(value).toLocaleString(); // Format without decimal points
  // };
  const formatNumber = (value) => {
    if (isNaN(value)) return "0";
    return parseInt(value, 10).toLocaleString("en-IN"); // Indian format
  };

  const [selectedOptiontime, setSelectedOptiontime] = useState(
    dropdownData?.filters?.TGT_TIMELINE?.length > 2
      ? [
          {
            label: dropdownData.TGT_TIMELINE[2],
            value: dropdownData.TGT_TIMELINE[2],
          },
        ]
      : null
  );
  const dropdownValueoptiontime = selectedOptiontime || filters.TGT_TIMELINE;
  const [selectedOptionbrand, setSelectedOptionbrand] = useState(
    dropdownData?.filters?.BRAND?.length > 2
      ? [
          {
            label: dropdownData.BRAND[2],
            value: dropdownData.BRAND[2],
          },
        ]
      : null
  );
  const dropdownValueoptionbrand = selectedOptionbrand || filters.BRAND;
  const [selectedOptionbranch, setSelectedOptionbranch] = useState(
    dropdownData?.filters?.STORE_NAME?.length > 2
      ? [
          {
            label: dropdownData.STORE_NAME[2],
            value: dropdownData.STORE_NAME[2],
          },
        ]
      : null
  );
  const dropdownValueoptionbranch = selectedOptionbranch || filters.STORE_NAME;
  const optionstime = dropdownData.TGT_TIMELINE.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const optionsbrand = dropdownData.BRAND.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));
  const optionsbranch = dropdownData.STORE_NAME.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({
      label: store,
      value: store,
    }));

  // const handletimeChange = (selectedOptions) => {
  //   setDisable(true);
  //   setSelectedOptiontime(selectedOptions);

  //   console.log("Selected item options:", selectedOptions);
  //   if (selectedOptions) {
  //     const selectedValues = selectedOptions.map((option) => option.value);
  //     const selectedValuesString = selectedValues.join(",");
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       TGT_TIMELINE: selectedValuesString,
  //     }));
  //     setDisable();
  //   } else {
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       TGT_TIMELINE: "",
  //     }));
  //   }
  //   setDisable(true);
  // };
  const handletimeChange = (selectedOptions = []) => {
    setDisable(false);
    setSelectedOptiontime(selectedOptions);
    console.log("Selected item options:", selectedOptions);

    if (selectedOptions) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        TGT_TIMELINE: selectedOptions.value,
      }));
      console.log(filters);
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        TGT_TIMELINE: "",
      }));
    }
  };

  const handlebrandChange = (selectedOptions = []) => {
    setDisable(false);
    setSelectedOptionbrand(selectedOptions);

    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        BRAND: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        BRAND: "",
      }));
    }
  };
  useEffect(() => {
    const filtersChanged = Object.keys(filters).some(
      (key) => filters[key] !== initialFilters[key]
    );
    setIsApplyDisabled(!filtersChanged);
  }, [filters, initialFilters]);
  //   const handlebrandChange = (selectedOptions = []) => {
  //     setDisable(false);
  //     setSelectedOptionbrand(selectedOptions);
  //     console.log("Selected item options:", selectedOptions);

  //     if (selectedOptions.length > 0) {
  //         const selectedValues = selectedOptions.map((option) => option.value);
  //         const selectedValuesString = selectedValues.join(",");

  //         setFilters((prevFilters) => {
  //             const updatedFilters = { ...prevFilters, BRAND: selectedValuesString };

  //             if (updatedFilters.TGT_TIMELINE && updatedFilters.TGT_TIMELINE.length > 0) {
  //                 // setDisable(false);
  //             }

  //             return updatedFilters;
  //         });
  //     } else {
  //         setFilters((prevFilters) => {
  //             const updatedFilters = { ...prevFilters, BRAND: "" };
  //             if (!updatedFilters.TGT_TIMELINE || updatedFilters.TGT_TIMELINE.length === 0) {
  //                 setDisable(true);
  //             }

  //             return updatedFilters;
  //         });
  //     }
  // };

  const handlebranchChange = (selectedOptions = []) => {
    setDisable(false);
    setSelectedOptionbranch(selectedOptions);

    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");
      setFilters((prevFilters) => ({
        ...prevFilters,
        STORE_NAME: selectedValuesString,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        STORE_NAME: "",
      }));
    }
  };

  const rowRenderer = ({ index, key, style }) => {
    //   const section1 = BrandWise;
    // if (!section1) return null;
    // console.log(section1);

    // const sortedSection = [...BrandWise].sort((a, b) => {
    //   if (a.store_name === b.store_name) {
    //     return a.brand.localeCompare(b.brand);
    //   }
    //   return a.store_name.localeCompare(b.store_name);
    // });
    const sortedSection = [...BrandWise].sort((a, b) => {
      const storeA = a.store_name || ""; // Default to empty string if undefined
      const storeB = b.store_name || "";
      const brandA = a.brand || "";
      const brandB = b.brand || "";

      if (storeA === storeB) {
        return brandA.localeCompare(brandB);
      }
      return storeA.localeCompare(storeB);
    });

    function cleanObject(obj) {
      const cleanedObj = {};
      Object.keys(obj).forEach((key) => {
        const cleanedKey = key.trim(); // Remove extra spaces
        cleanedObj[cleanedKey] = obj[key];
      });
      return cleanedObj;
    }
    // const section = sortedSection;
    console.log(sortedSection);
    // const section = sortedSection[index]

    const section = cleanObject(sortedSection[index]);
    // const CurTargetBackgroundColor =
    //   section?.Proj_Target_Ach <= 100 ? "#FD6666" : "#42B0B0";
    // console.log(section?.Cur_Target_Ach,CurTargetBackgroundColor);

    //   const CurTargetBackgroundColor =
    // section?.Proj_Target_Ach == null
    //   ? "rgb(128 128 128 / 38%)"
    //   : parseFloat(section?.Proj_Target_Ach.replace("%", "") || 0) <= 100
    //   ? "#FD6666"
    //   : "#42B0B0";
    const CurTargetBackgroundColor =
      section?.Proj_Target_Ach == null
        ? "rgb(128 128 128 / 38%)"
        : parseFloat(
            typeof section?.Proj_Target_Ach === "string"
              ? section.Proj_Target_Ach.replace("%", "")
              : section?.Proj_Target_Ach || 0
          ) <= 100
        ? "#FD6666"
        : "#42B0B0";

    console.log(CurTargetBackgroundColor);
    // const CurTargetBackgroundColor =
    //   section?.Proj_Target_Ach <= 100 ? "#FD6666" : "#42B0B0";
    return (
      <div
        key={key}
        style={{
          ...style, // Apply style for virtualization
          display: "flex",
          justifyContent: "space-between",
          // minWidth: "2000px",
          // marginTop: '18px',
          overflow: "hidden",
          borderBottom: "1px solid #ccc",
        }}
      >
        <span
          style={{
            flex: 1,
            textAlign: "left",
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          {section?.store_name}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 10,
            fontWeight: "bold",
            padding: "5px",
          }}
        >
          {section?.brand}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 10,
            fontWeight: "bold",
            padding: "5px",
          }}
        >
          {/* {section?.SLAB} */}
          {section?.Slab !== "BLANK" ? section.Slab : ""}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            backgroundColor: CurTargetBackgroundColor,
            padding: "5px",
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.target || "")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            backgroundColor: CurTargetBackgroundColor,
            padding: "5px",
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.Current_Qty || "")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.current_Sales || "")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.Sales_Projection || "")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.Current_Discount || "")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.Discount_Projection || "")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {Number(section?.Avg_Qty_Value || 0).toFixed(2)}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {`${Number(section?.target_ach_percent || 0).toFixed(2)}%`}
          {/* {(section?.Cur_Target_Ach+'%' || "")} */}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {`${Number(section?.Proj_Target_Ach || 0).toFixed(2)}%`}

          {/* {(section?.Proj_Target_Ach+'%'  || "")} */}
        </span>
      </div>
    );
  };
  //render2
  const rowRenderer1 = ({ index, key, style }) => {
    const section = OverALLDetails[index];

    // if (!section) return null;
    // console.log(section.Cur_Target_Ach);
    // const CurTargetBackgroundColor = section?.Proj_Target_Ach >= 100 ? "#FD6666" : "#42B0B0";
    // const CurTargetBackgroundColor =
    //   section?.Proj_Target_Ach <= 100 ? "#FD6666" : " #42B0B0";
    //   console.log(CurTargetBackgroundColor);

    // const projTargetAch = parseFloat(section?.Proj_Target_Ach?.replace("%", "")) || 0;

    // const CurTargetBackgroundColor =
    // section?.Proj_Target_Ach == null
    //   ? "rgb(128 128 128 / 38%)"
    //   : parseFloat(section?.Proj_Target_Ach.replace("%", "") || 0) <= 100
    //   ? "#FD6666"
    //   : "#42B0B0";
    const CurTargetBackgroundColor =
      section?.Proj_Target_Ach == null
        ? "rgb(128 128 128 / 38%)"
        : parseFloat(
            typeof section?.Proj_Target_Ach === "string"
              ? section?.Proj_Target_Ach.replace("%", "")
              : section?.Proj_Target_Ach || 0
          ) <= 100
        ? "#FD6666"
        : "#42B0B0";

    // const CurTargetBackgroundColor = projTargetAch >= 100 ? "#42B0B0" : "#FD6666";

    return (
      <div
        key={key}
        style={{
          ...style,
          display: "flex",
          justifyContent: "space-between",
          // minWidth: "2000px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 10,
            fontFamily: "Inter",
            fontWeight: "bold",
            lineBreak: "anywhere",
          }}
        >
          {section?.brand}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 10,
            fontFamily: "Inter",
            fontWeight: "bold",
          }}
        >
          {section?.Slab !== "BLANK" ? section.Slab : ""}
        </span>

        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            fontFamily: "Inter",
            padding: "5px",
            fontWeight: "bold",
            backgroundColor: CurTargetBackgroundColor,
          }}
        >
          {formatNumber(section?.target || "0")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            fontFamily: "Inter",
            backgroundColor: CurTargetBackgroundColor,

            padding: "5px",
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.Current_Qty || "0")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            fontFamily: "Inter",
            backgroundColor: CurTargetBackgroundColor,
            padding: "5px",
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.current_Sales || "0")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            fontFamily: "Inter",
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.Sales_Projection || "0")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            fontFamily: "Inter",
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.Current_Discount || "0")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            fontFamily: "Inter",
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.Discount_Projection || "0")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            fontFamily: "Inter",
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {formatNumber(section?.Avg_Qty_Value || "0")}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            fontFamily: "Inter",
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {section?.Cur_Target_Ach || "0"}
          {/* {formatNumber(section?.Cur_Target_Ach  || "")} */}
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 9,
            fontFamily: "Inter",
            backgroundColor: CurTargetBackgroundColor,
            fontWeight: "bold",
          }}
        >
          {section?.Proj_Target_Ach || "0"}
          {/* {formatNumber(section?.Proj_Target_Ach || "")} */}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="p-4 mt-10">
        <div
          className="p-4 rounded-lg dark:border-gray-500 overflow-x-auto "
          style={{
            padding: "10px",
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
                background: "#173F46",
                // height: 50,
                justifyContent: "center",
              }}
            >
              <div
                className="d-flex align-items-center justify-space-between px-4 py-2  text-white"
                style={{
                  background: "#173F46",
                  justifyContent: "space-between",
                }}
              >
                {/* Left Side */}
                <div className="d-flex align-items-center  gap-3">
                  <button
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    style={{
                      backgroundColor:
                        !isApplyDisabled && !Disable ? "white" : "gray",
                      width: "116px",
                      height: "31px",
                      clipPath:
                        "polygon(-3% 5%, 88% 4%, 101% 56%, 88% 97%, -5% 95%, 11% 57%)",
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      padding: "7px",
                      color: "black",
                      opacity: !isApplyDisabled && !Disable ? 1 : 0.6,
                    }}
                    onClick={
                      !isApplyDisabled && !Disable
                        ? reloadWithFilters
                        : undefined
                    }
                    disabled={isApplyDisabled || Disable}
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
                  {/* // disabled={
                    //   !filters?.TGT_TIMELINE || filters.TGT_TIMELINE === ""
                    // } */}
                  {refresh && (
                    <div
                      // style={{ backgroundColor: "#fff", color: "#000", padding: '8px', borderRadius: '8px' ,cursor:'pointer' }}
                      // className="apply-filter-button"
                      // type="button"
                      onClick={reloadRefresh}
                      style={{
                        backgroundColor: "#5de1cf",
                        color: "#000",
                        padding: "8px",
                        borderRadius: "16px",
                        cursor: "pointer",
                      }}
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
                    fontFamily: "Inter",
                  }}
                >
                  Brand Achievement Analysis
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
                    {/* Refresh Date */}
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
                    {/* 02-12-2024 02:48:53 */}
                  </span>
                </div>
              </div>
            </div>

            {/* period first row */}
            <div className="container-fluid my-4">
              <div
                className="row g-3"
                style={{
                  display: "flex",
                }}
              >
                {/* Dropdown Filters */}
                <div className="col-md-3">
                  <label
                    htmlFor="Sales Type"
                    style={{
                      color: "black",
                      fontSize: 12,
                      fontFamily: "Inter",
                      fontWeight: "bold",
                    }}
                  >
                    Period
                  </label>
                  {/* <select
                    className="form-control"
                    value={filters.TGT_TIMELINE}
                    onChange={handleFilterChange1}
                    style={{
                      width: "100%",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option value="">All</option>
                    {dropdownData.TGT_TIMELINE.map((TGT_TIMELINE, index) => (
                      <option key={index} value={TGT_TIMELINE}>
                        {TGT_TIMELINE}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionstime} // Dropdown options
                    value={dropdownValueoptiontime} // Controlled value
                    onChange={handletimeChange} // Handle selection changes
                    isMulti={false} // Enable multi-select
                    defaultValue={
                      dropdownData.TGT_TIMELINE.slice() // Create a copy of the array
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.TGT_TIMELINE[2],
                              value: dropdownData.TGT_TIMELINE[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholdertime("Search...")} // Change placeholder on focus
                    onBlur={() => setPlaceholdertime("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholdertime}
                  />
                </div>
                <div className="col-md-3">
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
                    id="division"
                    value={filters.BRAND}
                    onChange={handleFilterChange}
                    className="form-control"
                    style={{
                      width: "100%",
                      height: "31px",
                      backgroundColor: "#F1F1F1",
                      borderRadius: "5px",
                      padding: "5px",
                      fontSize: 11,
                      fontFamily: "Inter",
                    }}
                  >
                    <option value="">All</option>
                    {dropdownData.BRAND.map((BRAND, index) => (
                      <option key={index} value={BRAND}>
                        {BRAND}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionsbrand} // Dropdown options
                    value={dropdownValueoptionbrand} // Controlled value
                    onChange={handlebrandChange} // Handle selection changes
                    isMulti // Enable multi-select
                    defaultValue={
                      dropdownData.BRAND.slice() // Create a copy of the array
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.BRAND[2],
                              value: dropdownData.BRAND[2],
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
                <div className="col-md-3">
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
                    id="division"
                    value={filters.STORE_NAME}
                    onChange={handleFilterChange3}
                    className="form-control"
                    style={{
                      width: "100%",
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
                        // fontColor: "bold",
                      }}
                    >
                      ALL
                    </option>
                    {dropdownData.STORE_NAME.map((STORE_NAME, index) => (
                      <option key={index} value={STORE_NAME}>
                        {STORE_NAME}
                      </option>
                    ))}
                  </select> */}

                  <Select
                    options={optionsbranch} // Dropdown options
                    value={dropdownValueoptionbranch} // Controlled value
                    onChange={handlebranchChange} // Handle selection changes
                    isMulti // Enable multi-select
                    defaultValue={
                      dropdownData.STORE_NAME.slice() // Create a copy of the array
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.STORE_NAME[2],
                              value: dropdownData.STORE_NAME[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderbranch("Search...")} // Change placeholder on focus
                    onBlur={() => setPlaceholderbranch("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderbranch}
                  />
                </div>
              </div>
            </div>
            {/* //period */}

            {/* //table1 */}
            <div>
              <div
                className="row"
                style={
                  {
                    //   height: "433px",
                  }
                }
              >
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "100%",
                    border: "1px solid black",
                    // height: "433px",
                    height: "315px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    // overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                >
                  <div
                  // style={{
                  //   overflow: "auto",
                  //   height: "338px",
                  // }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#173F46",
                        height: "36px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontFamily: "Inter",
                          fontWeight: "500",
                          color: "black",
                          padding: "10px",
                          color: "white",
                        }}
                      >
                        Summary
                      </span>
                    </div>

                    <div
                      // className= "scroll"
                      style={{ overflow: "scroll", height: "260px" }}
                      onScroll={(e) => handleScroll(e, "Summary")}
                    >
                      {/* Table Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                          borderBottom: "2px solid black",
                          paddingBottom: "5px",
                          alignItems: "center",
                          paddingTop: "9px",
                          // minWidth: "2000px",
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
                          Brand
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("brand")}
                        />
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Slab
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("Slab")}
                        />
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Target
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("target")}
                        />

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Qty
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("Current_Qty")}
                        />
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Sales
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("current_Sales")}
                        />

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Sales Projection
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("Sales_Projection")}
                        />

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Discount
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("Current_Discount")}
                        />
                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Discount Projection
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("Discount_Projection")}
                        />
                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Avg Qty/Value to Ach Target
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("Avg_Qty_Value")}
                        />
                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Cur Target Ach %
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("Cur_Target_Ach")}
                        />
                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Proj Taget Ach%
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
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort1("Proj_Target_Ach")}
                        />
                      </div>

                      {/* Table Rows */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          // alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        {OverALLDetails.length > 0
                          ? OverALLDetails.map((section, index) => {
                              const CurTargetBackgroundColor =
                                section?.Proj_Target_Ach == null
                                  ? "rgb(128 128 128 / 38%)"
                                  : parseFloat(
                                      typeof section?.Proj_Target_Ach ===
                                        "string"
                                        ? section?.Proj_Target_Ach.replace(
                                            "%",
                                            ""
                                          )
                                        : section?.Proj_Target_Ach || 0
                                    ) <= 100
                                  ? "#FD6666"
                                  : "#42B0B0";

                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    borderBottom: "1px solid #ccc",
                                  }}
                                >
                                  <span style={cellStyle}>
                                    {section?.brand}
                                  </span>
                                  <span style={cellStyle}>
                                    {section?.Slab !== "BLANK"
                                      ? section.Slab
                                      : ""}
                                  </span>
                                  <span
                                    style={{
                                      ...cellStyle,
                                      backgroundColor: CurTargetBackgroundColor,
                                    }}
                                  >
                                    {/* {formatNumber(section?.target || "0")} */}
                                    {section.target === null
                                      ? ""
                                      : formatNumber(section?.target)}
                                  </span>
                                  <span
                                    style={{
                                      ...cellStyle,
                                      backgroundColor: CurTargetBackgroundColor,
                                    }}
                                  >
                                    {/* {formatNumber(section?.Current_Qty || "0")} */}
                                    {section.Current_Qty === null
                                      ? ""
                                      : formatNumber(section?.Current_Qty)}
                                  </span>
                                  <span
                                    style={{
                                      ...cellStyle,
                                      backgroundColor: CurTargetBackgroundColor,
                                    }}
                                  >
                                    {/* {formatNumber(section?.current_Sales || "0")} */}
                                    {section.current_Sales === null
                                      ? ""
                                      : formatNumber(section?.current_Sales)}
                                  </span>
                                  <span
                                    style={{
                                      ...cellStyle,
                                      backgroundColor: CurTargetBackgroundColor,
                                    }}
                                  >
                                    {/* {formatNumber(section?.Sales_Projection || "0")} */}
                                    {section.Sales_Projection === null
                                      ? ""
                                      : formatNumber(section?.Sales_Projection)}
                                  </span>
                                  <span
                                    style={{
                                      ...cellStyle,
                                      backgroundColor: CurTargetBackgroundColor,
                                    }}
                                  >
                                    {/* {formatNumber(section?.Current_Discount || "0")} */}
                                    {section.Current_Discount === null
                                      ? ""
                                      : formatNumber(section?.Current_Discount)}
                                  </span>
                                  <span
                                    style={{
                                      ...cellStyle,
                                      backgroundColor: CurTargetBackgroundColor,
                                    }}
                                  >
                                    {/* {formatNumber(section?.Discount_Projection || "0")} */}
                                    {section.Discount_Projection === null
                                      ? ""
                                      : formatNumber(
                                          section?.Discount_Projection
                                        )}
                                  </span>
                                  <span
                                    style={{
                                      ...cellStyle,
                                      backgroundColor: CurTargetBackgroundColor,
                                    }}
                                  >
                                    {/* {formatNumber(section?.Avg_Qty_Value || "0")} */}
                                    {section.Avg_Qty_Value === null
                                      ? ""
                                      : formatNumber(section?.Avg_Qty_Value)}
                                  </span>
                                  <span
                                    style={{
                                      ...cellStyle,
                                      backgroundColor: CurTargetBackgroundColor,
                                    }}
                                  >
                                    {/* {section?.Cur_Target_Ach || "0"} */}
                                    {section.Cur_Target_Ach === null
                                      ? ""
                                      : section?.Cur_Target_Ach?.toFixed(2) +
                                        "%"}
                                  </span>
                                  <span
                                    style={{
                                      ...cellStyle,
                                      backgroundColor: CurTargetBackgroundColor,
                                    }}
                                  >
                                    {/* {section?.Proj_Target_Ach || "0"} */}
                                    {section.Proj_Target_Ach === null
                                      ? ""
                                      : section?.Proj_Target_Ach?.toFixed(2) +
                                        "%"}
                                  </span>
                                </div>
                              );
                            })
                          : !Summaryloading && (
                              <div
                                style={{ border: "none", textAlign: "center" }}
                              >
                                <div className="px-2 py-2 bg-white text-sm text-gray-500">
                                  No Data Available
                                </div>
                              </div>
                            )}
                      </div>

                      {Summaryloading && (
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
              </div>
            </div>
            {/* end table 1 */}

            {/* //table2 */}
            <div className="container-fluid mt-4">
              <div>
                <div
                  className="row"
                  style={{
                    height: "433px",
                  }}
                >
                  {/* First Row: Three Tables */}
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "white",
                      width: "100%",
                      border: "1px solid black",
                      // height: "433px",
                      borderLeft: "none",
                      borderBottom: "none",
                      borderTop: "none",
                      flexDirection: "column",
                      // overflow: "auto",
                      // overflow: 'scroll',
                      borderBottom: "1px solid black",
                      // overflow: "scroll",
                      height: "393px",
                    }}
                  >
                    {/* Header */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#173F46",
                        height: "36px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontFamily: "Inter",
                          fontWeight: "500",
                          color: "black",
                          padding: "10px",
                          color: "white",
                        }}
                      >
                        Branch Wise Details
                      </span>
                    </div>
                    {/* Table Header */}
                    <div
                    // className="scroll"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                          borderBottom: "2px solid black",
                          paddingBottom: "5px",
                          alignItems: "center",
                          paddingTop: "9px",
                          // minWidth: "2000px",
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
                          Branch
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("store_name")}
                        />
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Brand
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("brand")}
                        />
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Slab
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("Slab")}
                        />
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Target
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("target")}
                        />
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Qty
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("Current_Qty")}
                        />
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Sales
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("current_Sales")}
                        />
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Sales Projection
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("Sales_Projection")}
                        />
                        {/*  */}

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Discount
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("Current_Discount")}
                        />
                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Discount Projection
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleSortsecond("Discount_Projection")
                          }
                        />
                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Avg Qty/Value to Ach Target
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("Avg_Qty_Value")}
                        />
                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Cur Target Ach%
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("target_ach_percent")}
                        />
                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Proj Taget Ach%
                        </span>

                        <img
                          src={
                            sortConfig1.key === "section" &&
                            sortConfig1.direction === "asc"
                              ? SelectArrow
                              : SelectArrow
                          }
                          alt=""
                          style={{
                            width: "10px",
                            height: "15px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSortsecond("Proj_Target_Ach")}
                        />
                      </div>

                      {/* Table Rows */}
                      <div
                        style={{ overflow: "scroll", height: "290px" }}
                        onScroll={(e) => handleScroll1(e, "BranchWiseDetails")}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            borderBottom:
                              BrandWise?.length > 0 ? "1px solid #ccc" : "none",

                            flexDirection: "column",
                          }}
                        >
                          {BrandWise?.length > 0
                            ? BrandWise.filter(
                                (section) =>
                                  section && Object.keys(section).length > 0
                              )
                                .sort((a, b) => {
                                  const aValue = a[sortColumnsection] || "";
                                  const bValue = b[sortColumnsection] || "";

                                  if (
                                    typeof aValue === "string" &&
                                    typeof bValue === "string"
                                  ) {
                                    return sortDirectionsection === "asc"
                                      ? aValue.localeCompare(bValue)
                                      : bValue.localeCompare(aValue);
                                  } else {
                                    return sortDirectionsection === "asc"
                                      ? aValue - bValue
                                      : bValue - aValue;
                                  }
                                })
                                .map((section, index) => {
                                  const cleanObject = (obj) => {
                                    const cleanedObj = {};
                                    Object.keys(obj).forEach((key) => {
                                      const cleanedKey = key.trim();
                                      cleanedObj[cleanedKey] = obj[key];
                                    });
                                    return cleanedObj;
                                  };

                                  const cleanedSection = cleanObject(section);

                                  const CurTargetBackgroundColor =
                                    cleanedSection?.Proj_Target_Ach == null
                                      ? "rgb(128 128 128 / 38%)"
                                      : parseFloat(
                                          typeof cleanedSection?.Proj_Target_Ach ===
                                            "string"
                                            ? cleanedSection.Proj_Target_Ach.replace(
                                                "%",
                                                ""
                                              )
                                            : cleanedSection?.Proj_Target_Ach ||
                                                0
                                        ) <= 100
                                      ? "#FD6666"
                                      : "#42B0B0";

                                  return (
                                    <div
                                      key={index}
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        overflow: "hidden",
                                        borderBottom: "1px solid #ccc",
                                      }}
                                    >
                                      <span
                                        style={{
                                          flex: 1,
                                          // textAlign: "left",
                                          fontSize: 11,
                                          fontWeight: "bold",
                                          lineBreak: "anywhere",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {cleanedSection?.store_name}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          fontWeight: "bold",
                                          padding: "5px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {cleanedSection?.brand}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          fontWeight: "bold",
                                          padding: "5px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {cleanedSection?.Slab !== "BLANK"
                                          ? cleanedSection.Slab
                                          : ""}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          backgroundColor:
                                            CurTargetBackgroundColor,
                                          padding: "5px",
                                          fontWeight: "bold",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {cleanedSection?.target != null
                                          ? formatNumber(cleanedSection.target)
                                          : ""}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          backgroundColor:
                                            CurTargetBackgroundColor,
                                          padding: "5px",
                                          fontWeight: "bold",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {cleanedSection?.Current_Qty != null
                                          ? formatNumber(
                                              cleanedSection.Current_Qty
                                            )
                                          : ""}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          backgroundColor:
                                            CurTargetBackgroundColor,
                                          fontWeight: "bold",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {cleanedSection?.current_Sales != null
                                          ? formatNumber(
                                              cleanedSection.current_Sales
                                            )
                                          : ""}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          backgroundColor:
                                            CurTargetBackgroundColor,
                                          fontWeight: "bold",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {/* {formatNumber(cleanedSection?.Sales_Projection || "")} */}
                                        {cleanedSection?.Sales_Projection !=
                                        null
                                          ? formatNumber(
                                              cleanedSection.Sales_Projection
                                            )
                                          : ""}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          backgroundColor:
                                            CurTargetBackgroundColor,
                                          fontWeight: "bold",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {/* {formatNumber(cleanedSection?.Current_Discount || "")} */}
                                        {cleanedSection?.Current_Discount !=
                                        null
                                          ? formatNumber(
                                              cleanedSection.Current_Discount
                                            )
                                          : ""}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          backgroundColor:
                                            CurTargetBackgroundColor,
                                          fontWeight: "bold",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {/* {formatNumber(cleanedSection?.Discount_Projection || "")} */}
                                        {cleanedSection?.Discount_Projection !=
                                        null
                                          ? formatNumber(
                                              cleanedSection.Discount_Projection
                                            )
                                          : ""}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          backgroundColor:
                                            CurTargetBackgroundColor,
                                          fontWeight: "bold",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {/* {Number(cleanedSection?.Avg_Qty_Value || 0).toFixed(2)} */}
                                        {/* {!isNaN(
                                          Number(cleanedSection?.Avg_Qty_Value)
                                        )
                                          ? Number(
                                              cleanedSection?.Avg_Qty_Value
                                            ).toFixed(2)
                                          : ""} */}
                                        {cleanedSection?.Avg_Qty_Value != null
                                          ? formatNumber(
                                              cleanedSection.Avg_Qty_Value
                                            )
                                          : ""}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          backgroundColor:
                                            CurTargetBackgroundColor,
                                          fontWeight: "bold",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {/* {`${Number(cleanedSection?.target_ach_percent || 0).toFixed(2)}%`} */}
                                        {!isNaN(
                                          Number(
                                            cleanedSection?.target_ach_percent
                                          )
                                        ) &&
                                        cleanedSection?.target_ach_percent !==
                                          null
                                          ? `${Number(
                                              cleanedSection?.target_ach_percent
                                            ).toFixed(2)}%`
                                          : ""}
                                      </span>
                                      <span
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontSize: 11,
                                          backgroundColor:
                                            CurTargetBackgroundColor,
                                          fontWeight: "bold",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {/* {`${Number(cleanedSection?.Proj_Target_Ach || 0).toFixed(2)}%`} */}
                                        {!isNaN(
                                          Number(
                                            cleanedSection?.Proj_Target_Ach
                                          )
                                        ) &&
                                        cleanedSection?.Proj_Target_Ach !== null
                                          ? `${Number(
                                              cleanedSection?.Proj_Target_Ach
                                            ).toFixed(2)}%`
                                          : ""}
                                      </span>
                                    </div>
                                  );
                                })
                            : !BrandWiseloading && (
                                <div
                                  style={{
                                    border: "none",
                                    textAlign: "center",
                                  }}
                                >
                                  <div className="px-2 py-2 bg-white text-sm text-gray-500">
                                    No Data Available
                                  </div>
                                </div>
                              )}
                        </div>

                        {BrandWiseloading && (
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
                </div>
              </div>
            </div>
            {/* end table 2 */}
          </div>
        </div>
      </div>
    </>
  );
}

export default BrandAchievement;
