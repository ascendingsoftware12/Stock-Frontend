import React, { useState, useMemo, useEffect, useRef } from "react";

import "flowbite/dist/flowbite.css";
import "../style/table.css";
import { Button, Label, TextInput, Table } from "flowbite-react";
import axios from "axios";
import Select from "react-select";
// import DatePicker from "react-datepicker";
import "../style/overall.css";
import SelectArrow from "../images/ArrowDn.png";

function TargetAchieve() {
  const [asm, setasm] = useState(null);
  const [BrandWise, setBrandWise] = useState([]);
  const [OverALLDetails, setOverALLDetails] = useState([]);
  const [BrandWiseGrowth, setBrandWiseGrowth] = useState([]);
  const [loading, setLoading] = useState(false);

  const [placeholderperiod, setPlaceholderperiod] = useState("All");

  const [placeholdersection, setPlaceholdersection] = useState("All");

  const [placeholderbranch, setPlaceholderbranch] = useState("All");
  // const loadMoreData = async () => {
  //   if (loading) return; // Prevent multiple calls
  //   setLoading(true);

  //   try {
  //     const newData = await fetchsetOverALLDetails();
  //     setOverALLDetails((prevData) => [...prevData, newData]);

  //     const newData1 = await fetchsetBrandWise();
  //     setBrandWise((prevData) => [...prevData, newData1]);

  //     const newData2 = await fetchsetBrandWiseGrowth();
  //     setBrandWiseGrowth((prevData) => [...prevData, newData2]);
  //   } catch (error) {
  //     console.error("Error loading more data", error);

  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   loadMoreData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  //OverALLDetails
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleSort1 = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedData = [...OverALLDetails].sort((a, b) => {
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
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

  //BrandWiseGrowth
  const [sortConfig2, setSortConfig2] = useState({ key: "", direction: "asc" });

  const handleSort4 = (key) => {
    const direction =
      sortConfig4.key === key && sortConfig4.direction === "asc" ? "desc" : "asc";
  
    const sortedData = [...BrandWise].sort((a, b) => {
      const valueA = parseFloat(a[key]) || 0; // Convert to number, default to 0 if NaN
      const valueB = parseFloat(b[key]) || 0;
  
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    });
  
    setSortConfig4({ key, direction });
    setBrandWise(sortedData);
  };
  const [sortConfig4, setSortConfig4] = useState({ key: "", direction: "asc" });

  const handleSort5 = (key) => {
    const direction =
      sortConfig5.key === key && sortConfig5.direction === "asc" ? "desc" : "asc";
  
    const sortedData = [...BrandWiseGrowth].sort((a, b) => {
      const valueA = parseFloat(a[key]) || 0; // Convert to number, default to 0 if NaN
      const valueB = parseFloat(b[key]) || 0;
  
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    });
  
    setSortConfig5({ key, direction });
    setBrandWiseGrowth(sortedData);
  };
  const [sortConfig5, setSortConfig5] = useState({ key: "", direction: "asc" });
  

  const handleSort3 = (key) => {
    const direction =
      sortConfig2.key === key && sortConfig2.direction === "asc"
        ? "desc"
        : "asc";
    const sortedData = [...BrandWiseGrowth].sort((a, b) => {
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      return 0;
    });
    setSortConfig2({ key, direction });
    setBrandWiseGrowth(sortedData);
  };
  const hasFetchedData = useRef(false);
  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    setfirsttym(true);
    const asm = sessionStorage.getItem("asm");
    setasm(asm);
    // fetchsetOverALLDetails();
    fetchDropdownData(true);

    // fetchsetBrandWise();
    // fetchsetBrandWiseGrowth();
  }, []);

  const handleScroll = (e, data) => {
    if (!shouldRun) return;
    if (scrollHeight - scrollTop <= clientHeight + 10 && !loading) {
      // loadMoreData();
    }
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    const difference = Math.round(
      Math.round(
        e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)
      )
    );
    const tolerance = 1;
    const isNearBottom = Math.abs(difference) <= tolerance;
    console.log("Is near bottom:", isNearBottom);
    if (isNearBottom) {
      // setIsFetching(false);
      switch (data) {
        case "Overall":
          fetchsetOverALLDetails().finally(() =>
            setOverallDashboardloading(false)
          );
          break;
        case "BranchWise":
          fetchsetBrandWise().finally(() => setBrandWiseloading(false));
          break;
        case "BranchGrowth":
          fetchsetBrandWiseGrowth().finally(() =>
            setBrandWiseGrowthloading(false)
          );
          break;
        default:
          console.warn("Unknown data type:", data);
      }
    }
  };

  const formatNumberWithPercentage = (value) => {
    // Handle null or "None%"
    return `${parseFloat(value).toFixed(2)}%`; // Ensure valid format with %
  };

  // const formatNumberWithPercentage = (value) => {
  //   if (!value || value === "None%") return ""; // Handle null or "None%"
  //   const numericValue = parseFloat(value); // Convert to a number
  //   if (isNaN(numericValue)) return ""; // Ensure it's a valid number
  //   return `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numericValue)}%`;
  // };

  const [shouldRun, setShouldRun] = useState(true);
  const [shouldRun1, setShouldRun1] = useState(false);
  const [overallpage, setOverallPage] = useState(1);
  const [OverallDashboardloading, setOverallDashboardloading] = useState(1);
  const overalllimit = 500;

  const fetchsetOverALLDetails = async (updatedFilters) => {
    setOverallDashboardloading(true);

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
      const currentfilter = updatedFilters ?? filters;
      const encodedFilters = {
        store_name: cleanEncode(currentfilter.store_name),
        section: cleanEncode(currentfilter.section),
        tgt_timeline: cleanEncode(currentfilter.tgt_timeline),
      };

      console.log("Decoded and Encoded Filters:", encodedFilters);
      const response = await axios.get(
        `target_achievement_analysis/targetachievementOverallDetails??&asm=${asm}&tgt_timeline=${encodedFilters.tgt_timeline}&section=${encodedFilters.section}`
      );
      const data = response.data.data;

      const sortedData = [...data].sort((a, b) => {
        const specialCharRegex = /^[^a-zA-Z0-9]/;
        const containsAmpersand = /&/;

        const aSpecial = specialCharRegex.test(a.section);
        const bSpecial = specialCharRegex.test(b.section);

        const aContainsAmpersand = containsAmpersand.test(a.section);
        const bContainsAmpersand = containsAmpersand.test(b.section);

        if (aSpecial && !bSpecial) return -1;
        if (!aSpecial && bSpecial) return 1;

        if (aContainsAmpersand && !bContainsAmpersand) return -1;
        if (!aContainsAmpersand && bContainsAmpersand) return 1;

        return a.section.localeCompare(b.section, "en", {
          sensitivity: "base",
        });
      });

      const size = Object.keys(data).length;
      console.log("hili", data);
      console.log("pagenum", overallpage);
      // setBrandWiseGrowth(data);
      setfinalsize8(size);
      const values = data;
      if (response.data.data && size > 0) {
        if (Object.keys(values)?.length > 0) {
          setOverALLDetails(sortedData);

          setOverallPage(overallpage + 1);
          // setBrandWiseGrowthloading(false);
          setShouldRun1(true);
        } else {
          console.error(
            "Expected values object in response data but got:",
            data
          );

          setfinalsize8(0);
          setOverallDashboardloading(false);
          // setShouldRun(false);
        }
      } else {
        setfinalsize8(0);
        setOverallDashboardloading(false);
        setShouldRun1(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setShouldRun1(false);
    } finally {
      // Stop loading spinner
      setOverallDashboardloading(false);
      // setShouldRun(false);
    }
  };

  // const fetchsetBrandWise = async () => {
  //   try {
  //     const storedAsm = sessionStorage.getItem("asm");
  //     const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
  //     const response = await axios.get(
  //       `target_achievement_analysis/targetachievementBranchWiseDetails?&asm=${asm}`
  //     );
  //     const data = response.data.data;
  //     setBrandWise(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  // ---------------------------------dk code--------------------------------------

  // const handleApiResponse = async () => {
  //   try {
  //       const response = await fetch("/api/your-endpoint");
  //       const responseData = await response.json();

  //       if (responseData.success === 1) {
  //           console.log("Data:", responseData.values);
  //           // Proceed with using the data
  //       } else {
  //           console.error("Error:", responseData.error);
  //           alert("An error occurred: " + responseData.error);
  //       }
  //   } catch (err) {
  //       console.error("Fetch Error:", err);
  //       alert("Failed to fetch data. Please try again later.");
  //   }
  // };

  // handleApiResponse();

  // const [brandDimension, setbrandDimension] = useState();
  const [finalsize6, setfinalsize6] = useState();
  const [finalsize7, setfinalsize7] = useState();
  const [finalsize8, setfinalsize8] = useState();
  const [shouldRun2, setShouldRun2] = useState(false);

  const [BrandWisepage, setBrandWisePage] = useState();
  const [BrandWiseloading, setBrandWiseloading] = useState(1);
  const [BrandWiselimit, setBrandWiselimit] = useState(120, console.log("2"));

  const fetchsetBrandWise = async (pagenum1 = 1, updatedFilters) => {
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
      const currentfilter = updatedFilters ?? filters;

      const encodedFilters = {
        store_name: cleanEncode(currentfilter.store_name),
        section: cleanEncode(currentfilter.section),
        tgt_timeline: cleanEncode(currentfilter.tgt_timeline),
      };

      console.log("Decoded and Encoded Filters:", encodedFilters);
      const response = await axios.get(
        `target_achievement_analysis/targetachievementBranchWiseDetails?&asm=${asm}&page=${pagenum1}&limit=${BrandWiselimit}&tgt_timeline=${encodedFilters.tgt_timeline}&store_name=${encodedFilters.store_name}&section=${encodedFilters.section}`
      );
      const data = response.data.data;

      const sortSections = (sectionsArray) => {
        return sectionsArray.sort((a, b) => {
          const specialCharRegex = /^[^a-zA-Z0-9]/;
          const containsAmpersand = /&/;

          const aSpecial = specialCharRegex.test(a.section);
          const bSpecial = specialCharRegex.test(b.section);

          const aContainsAmpersand = containsAmpersand.test(a.section);
          const bContainsAmpersand = containsAmpersand.test(b.section);

          if (aSpecial && !bSpecial) return -1;
          if (!aSpecial && bSpecial) return 1;

          if (aContainsAmpersand && !bContainsAmpersand) return -1;
          if (!aContainsAmpersand && bContainsAmpersand) return 1;

          return a.section.localeCompare(b.section, "en", {
            sensitivity: "base",
          });
        });
      };

      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.store_name]) {
          acc[item.store_name] = [];
        }
        acc[item.store_name].push(item);
        return acc;
      }, {});

      const sortedData = Object.keys(groupedData)
        .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
        .flatMap((storeName) => sortSections(groupedData[storeName]));

      const size = Object.keys(data).length;
      console.log("hili", data);
      console.log("pagenum", BrandWisepage);
      // setBrandWiseGrowth(data);
      setfinalsize7(size);
      const values = data;
      if (response.data.data && size > 0) {
        if (Object.keys(values)?.length > 0) {
          if (BrandWiselimit === 100) {
            setBrandWise((prevData) => {
              const mergedData = [...prevData, ...sortedData];
              return Object.keys(
                mergedData.reduce((acc, item) => {
                  if (!acc[item.store_name]) acc[item.store_name] = [];
                  acc[item.store_name].push(item);
                  return acc;
                }, {})
              )
                .sort((a, b) =>
                  a.localeCompare(b, "en", { sensitivity: "base" })
                )
                .flatMap((storeName) =>
                  sortSections(
                    mergedData.filter((i) => i.store_name === storeName)
                  )
                );
            });
          } else {
            setBrandWise((prevData) => {
              const mergedData = [...prevData, ...sortedData];
              return Object.keys(
                mergedData.reduce((acc, item) => {
                  if (!acc[item.store_name]) acc[item.store_name] = [];
                  acc[item.store_name].push(item);
                  return acc;
                }, {})
              )
                .sort((a, b) =>
                  a.localeCompare(b, "en", { sensitivity: "base" })
                )
                .flatMap((storeName) =>
                  sortSections(
                    mergedData.filter((i) => i.store_name === storeName)
                  )
                );
            });
          }
          setBrandWisePage(pagenum1);
          setShouldRun2(true);
          // setBrandWiseGrowthloading(false);
        } else {
          console.error(
            "Expected values object in response data but got:",
            data
          );

          setfinalsize7(0);
          // setBrandWiseloading(false);
          // setShouldRun(false);
        }
      } else {
        setfinalsize7(0);
        setShouldRun2(true);
        // setBrandWiseloading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setShouldRun2(false);
    } finally {
      // Stop loading spinner
      setBrandWiseloading(false);
      // setShouldRun(false);
    }
  };

  const handleScroll1 = (e, dataKey) => {
    //  if (shouldRun ) return;

    if (finalsize6 > 0) {
      setBrandWiseGrowthloading(true);
      const { scrollHeight, scrollTop, clientHeight } = e.target;

      const isVerticalScroll = scrollTop !== lastScrollTop;
      lastScrollTop = scrollTop;

      if (isVerticalScroll) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

        if (isNearBottom) {
          setBrandWiseGrowthPage(BrandWiseGrowthpage + 1);
          const fetchMap = {
            BrandWiseGrowth: fetchsetBrandWiseGrowth,
          };

          // Fetch data dynamically based on the `dataKey`
          if (fetchMap[dataKey]) {
            fetchMap[dataKey](BrandWiseGrowthpage + 1).catch((error) => {
              console.error("Error in lazy loading:", error);
              // Ensure loading state resets on error
            });
            // setBrandWiseGrowthloading(false)
          }
        }
        // }
      }
    }
  };

  const handleScroll2 = (e, dataKey) => {
    // if (shouldRun1 ) return;

    if (finalsize7 > 0) {
      setBrandWiseloading(true);
      const { scrollHeight, scrollTop, clientHeight } = e.target;

      const isVerticalScroll = scrollTop !== lastScrollTop1;
      lastScrollTop1 = scrollTop;

      if (isVerticalScroll) {
        const isNearBottom = scrollHeight - scrollTop <= clientHeight + 1;

        if (isNearBottom) {
          setBrandWisePage(BrandWisepage + 1);
          const fetchMap = {
            BrandWise: fetchsetBrandWise,
          };

          // Fetch data dynamically based on the `dataKey`
          if (fetchMap[dataKey]) {
            fetchMap[dataKey](BrandWisepage + 1).catch((error) => {
              console.error("Error in lazy loading:", error);
            });
          }
        }
        // }
      }
    }
  };
  let lastScrollTop = 0;
  let lastScrollTop1 = 0;
  // ---------------------------------dk code--------------------------------------

  const [BrandWiseGrowthpage, setBrandWiseGrowthPage] = useState(1);
  const [BrandWiseGrowthloading, setBrandWiseGrowthloading] = useState(1);
  const [BrandWiseGrowthlimit, setBrandWiseGrowthlimit] = useState(
    50,
    console.log("2")
  );
  const [shouldRun3, setShouldRun3] = useState(false);

  const fetchsetBrandWiseGrowth = async (pagenum = 1, updatedFilters) => {
    setBrandWiseGrowthloading(true);
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
      const currentfilter = updatedFilters ?? filters;
      const encodedFilters = {
        store_name: cleanEncode(currentfilter.store_name),
        section: cleanEncode(currentfilter.section),
        tgt_timeline: cleanEncode(currentfilter.tgt_timeline),
      };

      console.log("Decoded and Encoded Filters:", encodedFilters);

      const response = await axios.get(
        `target_achievement_analysis/targetachievementBranchWiseGrowth?&asm=${asm}&page=${pagenum}&limit=${BrandWiseGrowthlimit}&tgt_timeline=${encodedFilters.tgt_timeline}&store_name=${encodedFilters.store_name}&section=${encodedFilters.section}`
      );
      const data = response.data.data;

      const sortSections = (sectionsArray) => {
        return sectionsArray.sort((a, b) => {
          const specialCharRegex = /^[^a-zA-Z0-9]/;
          const containsAmpersand = /&/;

          const aSpecial = specialCharRegex.test(a.section);
          const bSpecial = specialCharRegex.test(b.section);

          const aContainsAmpersand = containsAmpersand.test(a.section);
          const bContainsAmpersand = containsAmpersand.test(b.section);

          if (aSpecial && !bSpecial) return -1;
          if (!aSpecial && bSpecial) return 1;

          if (aContainsAmpersand && !bContainsAmpersand) return -1;
          if (!aContainsAmpersand && bContainsAmpersand) return 1;

          return a.section.localeCompare(b.section, "en", {
            sensitivity: "base",
          });
        });
      };

      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.store_name]) {
          acc[item.store_name] = [];
        }
        acc[item.store_name].push(item);
        return acc;
      }, {});

      const sortedData = Object.keys(groupedData)
        .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
        .flatMap((storeName) => sortSections(groupedData[storeName]));

      const size = Object.keys(data).length;
      console.log("hili", data);
      console.log("pagenum", BrandWiseGrowthpage);
      // setBrandWiseGrowth(data);
      setfinalsize6(size);
      const values = data;
      if (response.data.data && size > 0) {
        if (Object.keys(values)?.length > 0) {
          if (BrandWiseGrowthlimit === 51) {
            setBrandWiseGrowth((prevData) => {
              const mergedData = [...prevData, ...sortedData];
              return Object.keys(
                mergedData.reduce((acc, item) => {
                  if (!acc[item.store_name]) acc[item.store_name] = [];
                  acc[item.store_name].push(item);
                  return acc;
                }, {})
              )
                .sort((a, b) =>
                  a.localeCompare(b, "en", { sensitivity: "base" })
                )
                .flatMap((storeName) =>
                  sortSections(
                    mergedData.filter((i) => i.store_name === storeName)
                  )
                );
            });
          } else {
            setBrandWiseGrowth((prevData) => {
              const mergedData = [...prevData, ...sortedData];
              return Object.keys(
                mergedData.reduce((acc, item) => {
                  if (!acc[item.store_name]) acc[item.store_name] = [];
                  acc[item.store_name].push(item);
                  return acc;
                }, {})
              )
                .sort((a, b) =>
                  a.localeCompare(b, "en", { sensitivity: "base" })
                )
                .flatMap((storeName) =>
                  sortSections(
                    mergedData.filter((i) => i.store_name === storeName)
                  )
                );
            });
          }
          setBrandWiseGrowthPage(pagenum);
          setShouldRun3(true);
          // setBrandWiseGrowthloading(false);
        } else {
          console.error(
            "Expected values object in response data but got:",
            data
          );

          // setShouldRun(false);
          // setBrandWiseGrowthloading(false);
          // setShouldRun(false);
        }
      } else {
        // setShouldRun(false);
        //setBrandWiseGrowthloading(false);
        setShouldRun3(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // setBrandWiseGrowthloading(fa);
      setShouldRun3(false);
    } finally {
      // Stop loading spinner
      setBrandWiseGrowthloading(false);
      // setShouldRun(false);
    }
  };

  // option
  const [dropdownData, setDropdownData] = useState({
    section: [],
    store_name: [],
    tgt_timeline: [],
  });
  const [filters, setFilters] = useState({
    section: "",
    store_name: "",
    tgt_timeline: "",
  });
  const handleFilterChange = (e) => {
    setFilters({ ...filters, tgt_timeline: e.target.value });
  };
  const handleFilterChange1 = (event) => {
    setFilters({ ...filters, store_name: event.target.value });
  };
  const handleFilterChange2 = (event) => {
    setFilters({ ...filters, section: event.target.value });
  };

  const [firsttym, setfirsttym] = useState();

  const fetchDropdownData = async (isinitialfetch) => {
    console.log(isinitialfetch);

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

      const encodedFilters = isinitialfetch
        ? { store_name: "", section: "", tgt_timeline: "" }
        : {
            store_name: cleanEncode(filters.store_name),
            section: cleanEncode(filters.section),
            tgt_timeline: cleanEncode(filters.tgt_timeline),
          };

      // setfirsttym(encodedFilters);

      console.log("Decoded and Encoded Filters:", encodedFilters);

      const response = await axios.get(
        `/target_achievement_analysis/targetachievementColumn?asm=${asm}&tgt_timeline=${encodedFilters.tgt_timeline}&store_name=${encodedFilters.store_name}&section=${encodedFilters.section}`
      );

      setDropdownData(response.data);

      if (refresh && isinitialfetch) {
        const parseDate = (dateStr) => {
          const match = dateStr.match(
            /(\d{1,2})?[- ]?(\d{1,2})? ([A-Z]{3}) (\d{4})/
          );
          if (!match) return null;

          const [_, startDay, endDay, month, year] = match;
          const monthIndex = {
            JAN: 0,
            FEB: 1,
            MAR: 2,
            APR: 3,
            MAY: 4,
            JUN: 5,
            JUL: 6,
            AUG: 7,
            SEP: 8,
            OCT: 9,
            NOV: 10,
            DEC: 11,
          }[month];

          if (monthIndex === undefined) return null;
          return new Date(
            parseInt(year),
            monthIndex,
            endDay ? parseInt(endDay) : 1
          );
        };

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const sortedDates = response.data.tgt_timeline
          .map((dateStr) => ({
            original: dateStr,
            parsedDate: parseDate(dateStr),
          }))
          .filter((item) => item.parsedDate !== null);

        const currentMonthData = sortedDates.find(
          (item) =>
            item.parsedDate.getMonth() === currentMonth &&
            item.parsedDate.getFullYear() === currentYear
        );

        if (currentMonthData) {
          const latestDate = currentMonthData.original;

          setSelectedOptionperiod({
            label: latestDate,
            value: latestDate,
          });
        }
      }

      if (isinitialfetch) {
        const parseDate = (dateStr) => {
          const match = dateStr.match(
            /(\d{1,2})?[- ]?(\d{1,2})? ([A-Z]{3}) (\d{4})/
          );
          if (!match) return null;

          const [_, startDay, endDay, month, year] = match;
          const monthIndex = {
            JAN: 0,
            FEB: 1,
            MAR: 2,
            APR: 3,
            MAY: 4,
            JUN: 5,
            JUL: 6,
            AUG: 7,
            SEP: 8,
            OCT: 9,
            NOV: 10,
            DEC: 11,
          }[month];

          if (monthIndex === undefined) return null;
          return new Date(
            parseInt(year),
            monthIndex,
            endDay ? parseInt(endDay) : 1
          );
        };

        const sortedDates = response.data.tgt_timeline
          .map((dateStr) => ({
            original: dateStr,
            parsedDate: parseDate(dateStr),
          }))
          .filter((item) => item.parsedDate !== null);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const currentMonthData = sortedDates.find(
          (item) =>
            item.parsedDate.getMonth() === currentMonth &&
            item.parsedDate.getFullYear() === currentYear
        );

        if (currentMonthData) {
          const latestDate = currentMonthData.original;

          setSelectedOptionperiod({
            label: latestDate,
            value: latestDate,
          });

          handleperiodChange([{ value: latestDate, label: latestDate }]);
          setfirsttym(true);
          setBrandWise([]);
          setBrandWiseGrowth([]);
          //setCount([]);
          // setfirsttym({
          //   tgt_timeline: latestDate
          // });
          // setFilters({
          //   section: "",
          //   store_name: "",
          //   tgt_timeline: "",
          // })

          await fetchsetBrandWiseGrowth(1, { tgt_timeline: latestDate });
          await fetchsetBrandWise(1, { tgt_timeline: latestDate });
          await fetchsetOverALLDetails({ tgt_timeline: latestDate });
          await fetchQuantityData({ tgt_timeline: latestDate });
        }
      }

      console.log("dropdown", response.data);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };

  const [refresh, setrefresh] = useState(false);
  const reloadRefresh = () => {
    setBrandWiseGrowthloading(true);
    setBrandWiseloading(true);
    setOverallDashboardloading(true);
    // setfirsttym(true);
    setFilters({
      section: "",
      store_name: "",
      tgt_timeline: "",
    });
    setBrandWiseGrowth("");
    setBrandWise("");
    setOverALLDetails("");
    setInitialFilters("");
    setDropdownData({
      section: [],
      store_name: [],
      tgt_timeline: [],
    });
    setCount([]);
    setBrandWiselimit(120);
    setBrandWiseGrowthlimit(50);

    console.log(filters.tgt_timeline);

    fetchDropdownData(true);
    // setSelectedOptionperiod();
    // setDropdownData((prevData) => ({
    //   ...prevData,
    //   tgt_timeline: [],
    // }));

    setSelectedOptionbranch("");
    // setDropdownData({
    //   store_name: [],
    // }
    // );
    setSelectedOptionsection("");
    // setDropdownData((prevData) => ({
    //   ...prevData,
    //   section: [],
    // }));

    setrefresh(false);
  };

  const [initialFilters, setInitialFilters] = useState(filters); // Store initial values
  const [isApplyDisabled, setIsApplyDisabled] = useState(true);
  useEffect(() => {
    console.log("ghhgdd6666", firsttym);
    console.log("hghh999", filters);

    const filtersChanged = Object.keys(filters).some(
      (key) => filters[key] !== initialFilters[key]
    );
    setIsApplyDisabled(!filtersChanged);
  }, [filters, firsttym, initialFilters]);

  const reloadWithFilters = () => {
    console.log("testindbro", filters.tgt_timeline);

    if (filters.tgt_timeline !== "") {
      setrefresh(true);
      setInitialFilters(filters);
      setBrandWiseGrowth("");
      setBrandWise("");
      setOverALLDetails("");
      setBrandWisePage(1);
      setBrandWiselimit(100);
      setBrandWiseGrowthPage(1);
      setBrandWiseGrowthlimit(51);
      fetchsetBrandWiseGrowth();
      fetchsetBrandWise();
      fetchQuantityData();
      fetchDropdownData(false);
      fetchsetOverALLDetails();
    }
    // } else {
    //   setBrandWiseGrowthloading(true);
    //   setBrandWiseloading(true);
    //   setOverallDashboardloading(true);
    //   setBrandWiseGrowth([""]);
    //   setBrandWise("");
    //   setOverALLDetails("");
    //   setDropdownData({
    //     section: [],
    //     store_name: [],
    //     tgt_timeline: [],
    //   });
    //   setCount([]);
    //   setFilters({
    //     section: "",
    //     store_name: "",
    //     tgt_timeline: "",
    //   });
    //   fetchDropdownData(true);
    //   setSelectedOptionbranch("");
    //   setSelectedOptionsection("");
    //   // alert("select period for filter")
    // }
    // fetchQuantityData()
  };

  // count
  const [Count, setCount] = useState([]);

  const fetchQuantityData = async (updatedFilters) => {
    try {
      // const currentfilter = updatedFilters ?? filters
      const storedAsm = sessionStorage.getItem("asm");
      const currentfilter = updatedFilters ?? filters;
      const asm = storedAsm === "null" || storedAsm === null ? "" : storedAsm;
      const response = await axios.get(
        `/target_achievement_analysis/targetachievementTarget`,
        {
          params: {
            tgt_timeline: currentfilter.tgt_timeline,
            asm: asm,
            // section:filters.section,
            store_name: currentfilter.store_name,
          },
        }
      );
      setCount(response.data.data);
      console.log("fetchQuantityData");
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    }
  };
  // const formatNumber = (value) => {
  //   if (value !== undefined && value !== null) {
  //     return new Intl.NumberFormat().format(value);
  //   }
  //   return "";
  // };

  // const formatNumber = (value) => {
  //   if (isNaN(value)) return "0";
  //   return parseInt(value).toLocaleString("en-IN"); // Format without decimal points
  // };


  const formatNumber = (value) => {
    if (isNaN(value)) return "0";
    const number = parseInt(value, 10);
    if (number < 10) {
      return number.toString().padStart(2, '0');
    }
    return number.toLocaleString("en-IN");
  };

  
  const formatNumber2 = (value) => {
    if (value === null || value === undefined) return " ";
    return `${value >= 0 ? "" : ""}${Math.round(parseFloat(value))}`;
  };
  const formatNumber1 = (value) => {
    if (value === null || value === undefined) return " ";
    return parseFloat(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderGrowthIcon = (CMvs3Mnth) => {
    const growthString =
      typeof CMvs3Mnth === "string" ? CMvs3Mnth : `${CMvs3Mnth}%`;
    const growthValue = parseFloat(growthString.replace("%", ""));

    if (growthValue > 0) {
      return <span style={{ color: "green", fontWeight: "bold" }}>↑</span>;
    } else if (growthValue < 0) {
      return <span style={{ color: "red", fontWeight: "bold" }}>↓</span>;
    } else {
      return null;
    }
  };
  const renderGrowthIcon1 = (CMvsLM) => {
    const growthString = typeof CMvsLM === "string" ? CMvsLM : `${CMvsLM}%`;
    const growthValue = parseFloat(growthString.replace("%", ""));

    if (growthValue > 0) {
      return <span style={{ color: "green", fontWeight: "bold" }}>↑</span>;
    } else if (growthValue < 0) {
      return <span style={{ color: "red", fontWeight: "bold" }}>↓</span>;
    } else {
      return null;
    }
  };
  const [selectedOptionperiod, setSelectedOptionperiod] = useState(
    dropdownData?.filters?.tgt_timeline?.length > 2
      ? [
          {
            label: dropdownData.tgt_timeline[2],
            value: dropdownData.tgt_timeline[2],
          },
        ]
      : null
  );
  const dropdownValueoptionperiod =
    selectedOptionperiod || filters.tgt_timeline;
  const [selectedOptionbranch, setSelectedOptionbranch] = useState(() => {
    const productGroup = dropdownData?.filters?.store_name;
    return Array.isArray(productGroup) && productGroup.length > 2
      ? [
          {
            label: dropdownData.store_name[2],
            value: dropdownData.store_name[2],
          },
        ]
      : null;
  });
  const dropdownValueoptionbranch = selectedOptionbranch || filters.store_name;

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
  const dropdownValueoptionsection = selectedOptionsection || filters.section;
  // const optionsperiod = dropdownData.tgt_timeline.slice() // Create a copy to avoid mutating the original array
  // .sort((a, b) => a.localeCompare(b)).map((store) => ({
  //   label: store,
  //   value: store,
  // }));
  const optionsperiod = Array.isArray(dropdownData?.tgt_timeline)
    ? dropdownData.tgt_timeline
        .slice() // Avoid mutation
        .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
        .map((store) => ({
          label: store,
          value: store,
        }))
    : []; // Fallback to an empty array

  const optionsbranch = Array.isArray(dropdownData.store_name)
    ? dropdownData.store_name
        .slice() // Avoid mutation
        .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
        .map((store) => ({
          label: store,
          value: store,
        }))
    : []; // Fallback to an empty array if store_name is undefined or not an array

  const optionssection = Array.isArray(dropdownData?.section)
    ? dropdownData.section
        .slice() // Avoid mutation
        .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
        .map((store) => ({
          label: store,
          value: store,
        }))
    : []; // Fallback to an empty array if section is undefined or not an array

  const handleperiodChange = (selectedOptions) => {
    console.log(selectedOptions);

    setfirsttym(false);
    setSelectedOptionperiod(selectedOptions);
    console.log("Selected item options:", selectedOptions);

    if (Array.isArray(selectedOptions)) {
      // Check if it's an array
      const selectedValues = selectedOptions.map((option) => option.value);
      const selectedValuesString = selectedValues.join(",");

      setFilters((prevFilters) => ({
        ...prevFilters,
        tgt_timeline: selectedValuesString,
      }));
    } else if (selectedOptions && selectedOptions.value) {
      // Handle single object scenario
      setFilters((prevFilters) => ({
        ...prevFilters,
        tgt_timeline: selectedOptions.value,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        tgt_timeline: "",
      }));
    }
  };

  const handlebranchChange = (selectedOptions) => {
    setSelectedOptionbranch(selectedOptions);
    setfirsttym(false);
    console.log("Selected item options:", selectedOptions);
    if (selectedOptions) {
      // Extract values from selected options
      const selectedValues = selectedOptions.map((option) => option.value);

      // Join the values into a comma-separated string
      const selectedValuesString = selectedValues.join(",");

      // Update the filters state
      setFilters((prevFilters) => ({
        ...prevFilters,
        store_name: selectedValuesString, // Update the `item_category` filter
      }));
    } else {
      // If no options are selected, clear the item_category filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        store_name: "", // Clear the `item_category` filter
      }));
    }
  };

  const handlesectionChange = (selectedOptions) => {
    setfirsttym(false);
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
        section: selectedValuesString, // Update the `item_category` filter
      }));
    } else {
      // If no options are selected, clear the item_category filter
      setFilters((prevFilters) => ({
        ...prevFilters,
        section: "", // Clear the `item_category` filter
      }));
    }
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
                        filters.tgt_timeline !== "" &&
                        !isApplyDisabled &&
                        !firsttym
                          ? "white"
                          : "gray",
                      width: "116px",
                      height: "31px",
                      clipPath:
                        "polygon(-3% 5%, 88% 4%, 101% 56%, 88% 97%, -5% 95%, 11% 57%)",
                      border: "none",
                      outline: "none",
                      cursor:
                        filters.tgt_timeline !== "" &&
                        !isApplyDisabled &&
                        !firsttym
                          ? "pointer"
                          : "not-allowed",
                      padding: "7px",
                      color: "black",
                      opacity:
                        filters.tgt_timeline !== "" &&
                        !isApplyDisabled &&
                        !firsttym
                          ? 1
                          : 0.6,
                    }}
                    onClick={
                      filters.tgt_timeline !== "" &&
                      !isApplyDisabled &&
                      !firsttym
                        ? reloadWithFilters
                        : undefined
                    }
                    disabled={
                      filters.tgt_timeline === "" && isApplyDisabled && firsttym
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
                    ></span>
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
                    fontFamily: "Inter",
                  }}
                >
                  Target Achievement Analysis
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
                    value={filters.tgt_timeline}
                    onChange={handleFilterChange}
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
                    {dropdownData.tgt_timeline.map((tgt_timeline, index) => (
                      <option key={index} value={tgt_timeline}>
                        {tgt_timeline}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionsperiod} // Dropdown options
                    value={dropdownValueoptionperiod} // Controlled value
                    onChange={handleperiodChange} // Handle selection changes
                    isMulti={false} // Enable multi-select
                    defaultValue={
                      dropdownData.tgt_timeline
                        .slice() // Create a copy of the array
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.tgt_timeline[2],
                              value: dropdownData.tgt_timeline[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholderperiod("Search...")} // Change placeholder on focus
                    onBlur={() => setPlaceholderperiod("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholderperiod}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#f0f0f0", // Background color of the select box
                      }),

                      option: (base, { isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? "#ADD8E6" : "white", // Selected option color
                        color: isSelected ? "black" : "black",
                        ":hover": {
                          backgroundColor: "#ADD8E6", // Hover effect
                        },
                      }),
                    }}
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
                    value={filters.store_name}
                    onChange={handleFilterChange1}
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
                    {dropdownData.store_name.map((store_name, index) => (
                      <option key={index} value={store_name}>
                        {store_name}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionsbranch} // Dropdown options
                    value={dropdownValueoptionbranch} // Controlled value
                    onChange={handlebranchChange} // Handle selection changes
                    isMulti // Enable multi-select
                    defaultValue={
                      Array.isArray(dropdownData.store_name) &&
                      dropdownData.store_name
                        .slice() // Create a copy of the array
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.store_name[2],
                              value: dropdownData.store_name[2],
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
                    Section
                  </label>
                  {/* <select
                    id="division"
                    value={filters.section}
                    onChange={handleFilterChange2}
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
                    {dropdownData.section.map((section, index) => (
                      <option key={index} value={section}>
                        {section}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={optionssection} // Dropdown options
                    value={dropdownValueoptionsection} // Controlled value
                    onChange={handlesectionChange} // Handle selection changes
                    isMulti // Enable multi-select
                    defaultValue={
                      dropdownData.section
                        .slice() // Create a copy of the array
                        .sort((a, b) => a.localeCompare(b))?.length > 2
                        ? [
                            {
                              label: dropdownData.section[2],
                              value: dropdownData.section[2],
                            },
                          ]
                        : null
                    }
                    onFocus={() => setPlaceholdersection("Search...")} // Change placeholder on focus
                    onBlur={() => setPlaceholdersection("All")}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={placeholdersection}
                  />
                </div>
              </div>
            </div>
            {/* //period */}

            {/* //count */}
            <div className="container-fluid mt-4">
              <div className="row justify-space-between">
                {/* //Total Stores */}
                <div className="col-md-3 col-4 mb-3">
                  <div
                    className="card shadow-sm text-center"
                    style={{ maxHeight: "118px" }}
                  >
                    <div
                      className="card-header text-black"
                      style={{
                        background: "#7CBBC6",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      <strong>Total Stores</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {Count.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.total_store)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Taget */}
                <div className="col-md-3 col-4 mb-3">
                  <div
                    className="card shadow-sm text-center"
                    style={{ maxHeight: "118px" }}
                  >
                    <div
                      className="card-header text-black"
                      style={{
                        background: "#7CBBC6",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      <strong>Target</strong>
                    </div>

                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {Count.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.Target)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* //Current Sales */}
                <div className="col-md-3 col-4 mb-3">
                  <div
                    className="card shadow-sm text-center"
                    style={{ maxHeight: "118px" }}
                  >
                    <div
                      className="card-header text-black"
                      style={{
                        background: "#7CBBC6",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      <strong>Current Sales</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {Count.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.total_sales)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Sales Projection */}
                <div className="col-md-3 col-4 mb-3">
                  <div
                    className="card shadow-sm text-center"
                    style={{ maxHeight: "118px" }}
                  >
                    <div
                      className="card-header text-black"
                      style={{
                        background: "#7CBBC6",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      <strong>Sales Projection</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {Count.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.sales_proj)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* //Current Discount */}
                <div className="col-md-3 col-4 mb-3">
                  <div
                    className="card shadow-sm text-center"
                    style={{ maxHeight: "118px" }}
                  >
                    <div
                      className="card-header text-black"
                      style={{
                        background: "#7CBBC6",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      <strong>Current Discount</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {Count.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.total_disc)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* //Discount */}
                <div className="col-md-3 col-4 mb-3">
                  <div
                    className="card shadow-sm text-center"
                    style={{ maxHeight: "118px" }}
                  >
                    <div
                      className="card-header text-black"
                      style={{
                        background: "#7CBBC6",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      <strong>Discount Projection</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {Count.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber(item.disc_proj)}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Current target */}
                <div className="col-md-3 col-4 mb-3">
                  <div
                    className="card shadow-sm text-center"
                    style={{ maxHeight: "118px" }}
                  >
                    <div
                      className="card-header text-black"
                      style={{
                        background: "#7CBBC6",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      <strong>Cur Taget Ach%</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {Count.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber1(item.target_ach_percentage) + "%" || 0}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Proj Taget */}
                <div className="col-md-3 col-4 mb-3">
                  <div
                    className="card shadow-sm text-center"
                    style={{ maxHeight: "118px" }}
                  >
                    <div
                      className="card-header text-black"
                      style={{
                        background: "#7CBBC6",
                        fontSize: "14px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                      }}
                    >
                      <strong>Proj Target Ach%</strong>
                    </div>
                    <div
                      className="card-body "
                      style={{ fontSize: "15px", fontWeight: "700" }}
                    >
                      {Count.map((item, index) => (
                        <h5 key={index} className="card-text">
                          {formatNumber1(item.proj_target) + "%" || 0}
                        </h5>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*count end */}

            {/* //table1 */}
            <div>
              <div
                className="row"
                style={{
                  height: "233px",
                }}
              >
                {/* First Row: Three Tables */}
                <div
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    width: "100%",
                    border: "1px solid black",
                    height: "243px",
                    borderLeft: "none",
                    borderBottom: "none",
                    borderTop: "none",
                    flexDirection: "column",
                    // overflow: "auto",
                    borderBottom: "1px solid black",
                  }}
                >
                  <div
                    style={{
                      // overflow: "auto",
                      height: "233px",
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
                        OverAll Details
                      </span>
                    </div>

                    <div
                      className="scroll"
                      style={{ overflow: "scroll", height: "205px" }}
                      onScroll={(e) => handleScroll(e, "Overall")}
                    >
                      {/* Table Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          // marginBottom: "10px",
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Section
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
                            onClick={() => handleSort1("section")}
                          />
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Target
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
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Sales
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
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Sales Projection
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
                        </span>

                        {/*  */}

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Discount
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
                        </span>

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Discount Projection
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
                        </span>

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Avg Value to Ach Target
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
                        </span>

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Target Ach%
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
                            onClick={() => handleSort1("target_ach_percent")}
                          />
                        </span>

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Proj Target Ach%
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
                        </span>
                      </div>

                      {/* Table Rows */}
                      {OverALLDetails && OverALLDetails.length > 0 ? (
                        OverALLDetails.filter(
                          (section) =>
                            section && Object.keys(section).length > 0
                        ).map((section, index) => {
                          const getColor = (value) =>
                            // value >= 100 ? "#42B0B0" : "#FD6666";
                            {
                              if (value >= 100) {
                                return "#42B0B0";
                              } else if (value < 100 && value >= 0) {
                                return "#FD6666";
                              } else {
                                return "#d6d6d6";
                              }
                            };

                          return (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                // minWidth: "2000px",
                                borderBottom: "1px solid #ccc",
                              }}
                            >
                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "left",
                                  fontSize: 10,
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.section}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  padding: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.target === null
                                  ? ""
                                  : formatNumber(section?.target)}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  padding: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.current_Sales === null
                                  ? ""
                                  : formatNumber(section?.current_Sales)}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  padding: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.Sales_Projection === null
                                  ? ""
                                  : formatNumber(section?.Sales_Projection)}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.Current_Discount === null
                                  ? ""
                                  : formatNumber(section?.Current_Discount)}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.Discount_Projection === null
                                  ? ""
                                  : formatNumber(section?.Discount_Projection)}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.Avg_Qty_Value === null
                                  ? ""
                                  : formatNumber(section?.Avg_Qty_Value)}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.target_ach_percent === null
                                  ? ""
                                  : formatNumberWithPercentage(
                                      section?.target_ach_percent
                                    )}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.Proj_Target_Ach !== "None%" &&
                                section?.Proj_Target_Ach !== null
                                  ? formatNumberWithPercentage(
                                      section?.Proj_Target_Ach
                                    )
                                  : ""}

                                {/* {(section?.PROJ_TARGET!=="None%"||null)? formatNumber1(section?.PROJ_TARGET):""} */}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div></div>
                      )}
                      {OverallDashboardloading && (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <div
                            class="spinner-border gray-spinner"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                      {!shouldRun1 && !OverallDashboardloading && (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <div>
                            <span>No Data Available...</span>
                          </div>
                        </div>
                      )}
                      {/* {loading ? (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <div
                            className="spinner-border gray-spinner"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <List
                          height={400} // Height of the visible list
                          itemCount={OverALLDetails.length} // Total number of items
                          itemSize={50} // Height of each row
                          width={2000} // Width of the list
                        >
                          {Row}
                        </List>
                      )} */}
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
                      height: "433px",
                      borderLeft: "none",
                      borderBottom: "none",
                      borderTop: "none",
                      flexDirection: "column",
                      // overflow: "auto",
                      borderBottom: "1px solid black",
                    }}
                  >
                    {/* Header */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#173F46",
                        // height: "248px",
                        // overflow: "auto",
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
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          // marginBottom: "10px",
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Branch
                          <img
                            src={
                              sortConfig1.key === "store_name" &&
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
                            onClick={() => handleSort2("store_name")}
                          />
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Section
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
                            onClick={() => handleSort2("section")}
                          />
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Target
                          <img
                            src={
                              sortConfig1.key === "target" &&
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
                            onClick={() => handleSort4("target")}
                          />
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Sales
                          <img
                            src={
                              sortConfig1.key === "current_Sales" &&
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
                            onClick={() => handleSort4("current_Sales")}
                          />
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Sales Projection
                          <img
                            src={
                              sortConfig1.key === "Sales_Projection" &&
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
                            onClick={() => handleSort4("Sales_Projection")}
                          />
                        </span>

                        {/*  */}

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Current Discount
                          <img
                            src={
                              sortConfig1.key === "Current_Discount" &&
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
                            onClick={() => handleSort4("Current_Discount")}
                          />
                        </span>

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Discount Projection
                          <img
                            src={
                              sortConfig1.key === "Discount_Projection" &&
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
                            onClick={() => handleSort4("Discount_Projection")}
                          />
                        </span>

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          <div>
                          Avg Value to Ach Target
                          </div>
                          <img
                            src={
                              sortConfig1.key === "Avg_Qty_Value" &&
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
                            onClick={() => handleSort4("Avg_Qty_Value")}
                          />
                        </span>

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Target Ach%
                          <img
                            src={
                              sortConfig1.key === "target_ach_percent" &&
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
                            onClick={() => handleSort4("target_ach_percent")}
                          />
                        </span>

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Proj Target Ach%
                          <img
                            src={
                              sortConfig1.key === "Proj_Target_Ach" &&
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
                            onClick={() => handleSort4("Proj_Target_Ach")}
                          />
                        </span>
                      </div>
                      <div
                      className="scroll"
                      style={{ overflow: "scroll", height: "393px" }}
                      onScroll={(e) => handleScroll2(e, "BrandWise")}
                    >
                      {/* Table Rows */}
                      {BrandWise && BrandWise.length > 0 ? (
                        BrandWise.filter(
                          (section) =>
                            section && Object.keys(section).length > 0
                        ).map((section, index) => {
                          const getColor = (value) =>
                            // value >= 100 ? "#42B0B0" : "#FD6666";
                            {
                              console.log("val", { value });
                              if (value >= 100) {
                                return "#42B0B0";
                              } else if (value < 100 && value >= 0) {
                                return "#FD6666";
                              } else {
                                return "#d6d6d6";
                              }
                            };

                          return (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                // minWidth: "2000px",
                                borderBottom: "1px solid #ccc",
                              }}
                            >
                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  fontSize: 10,
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                {section?.store_name}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  fontSize: 9,
                                  fontFamily: "Inter",

                                  padding: "5px",
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                <div style={{
                                  marginLeft:'10px'
                                }}>
                                {section?.section || ""}
                                </div>
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  padding: "5px",
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                {section?.target === null
                                  ? ""
                                  : formatNumber(section?.target)}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                {section?.current_Sales === null
                                  ? ""
                                  : formatNumber(section?.current_Sales)}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                {section?.Sales_Projection === null
                                  ? ""
                                  : formatNumber(section?.Sales_Projection)}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                {section?.Current_Discount === null
                                  ? ""
                                  : formatNumber(section?.Current_Discount)}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                {section?.Discount_Projection === null
                                  ? ""
                                  : formatNumber(section?.Discount_Projection)}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                {section?.Avg_Qty_Value === null
                                  ? ""
                                  : formatNumber(section?.Avg_Qty_Value)}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                  lineBreak: "anywhere",
                                }}
                              >
                                {section?.target_ach_percent === null
                                  ? ""
                                  : formatNumberWithPercentage(
                                      section?.target_ach_percent
                                    )}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    parseFloat(section?.Proj_Target_Ach)
                                  ),
                                  fontWeight: "bold",
                                }}
                              >
                                {section.Proj_Target_Ach === null
                                  ? ""
                                  : formatNumberWithPercentage(
                                      section?.Proj_Target_Ach
                                    )}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div></div>
                      )}

                      {BrandWiseloading && (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <div
                            class="spinner-border gray-spinner"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                      {!shouldRun2 && !BrandWiseloading && (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "10px",
                            color: "black",
                          }}
                        >
                          <div>
                            <span>No data available...</span>
                          </div>
                        </div>
                      )}
                      {/* {loading ? (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <div
                            className="spinner-border gray-spinner"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <List
                          height={400} // Height of the visible list
                          itemCount={BrandWise.length}
                          itemSize={50} // Height of each row
                          width={2000} // Width of the list
                        >
                          {Row1}
                        </List>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end table 2 */}

            {/* //table3 */}

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
                      height: "433px",
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
                        Branch Wise Growth & Ach%
                      </span>
                    </div>
                    {/* Table Header */}
                   
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          // marginBottom: "10px",
                          borderBottom: "2px solid black",
                          paddingBottom: "5px",
                          alignItems: "center",
                          paddingTop: "9px",
                          // minWidth: "1000px",
                        }}
                      >
                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Branch
                          <img
                            src={
                              sortConfig2.key === "section" &&
                              sortConfig2.direction === "asc"
                                ? SelectArrow
                                : SelectArrow
                            }
                            alt=""
                            style={{
                              width: "10px",
                              height: "15px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort3("store_name")}
                          />
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Section
                          <img
                            src={
                              sortConfig2.key === "section" &&
                              sortConfig2.direction === "asc"
                                ? SelectArrow
                                : SelectArrow
                            }
                            alt=""
                            style={{
                              width: "10px",
                              height: "15px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort3("section")}
                          />
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          CM Vs 3Mnth
                          <img
                            src={
                              sortConfig2.key === "section" &&
                              sortConfig2.direction === "asc"
                                ? SelectArrow
                                : SelectArrow
                            }
                            alt=""
                            style={{
                              width: "10px",
                              height: "15px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort5("CMvs3Mnth")}
                          />
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          CM Vs LM
                          <img
                            src={
                              sortConfig2.key === "section" &&
                              sortConfig2.direction === "asc"
                                ? SelectArrow
                                : SelectArrow
                            }
                            alt=""
                            style={{
                              width: "10px",
                              height: "15px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort5("CMvsLM")}
                          />
                        </span>

                        {/*  */}

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Target LM Ach%
                          <img
                            src={
                              sortConfig2.key === "section" &&
                              sortConfig2.direction === "asc"
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
                              handleSort5("target_lm_ach_percentage")
                            }
                          />
                        </span>

                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Target MB Ach%
                          <img
                            src={
                              sortConfig2.key === "section" &&
                              sortConfig2.direction === "asc"
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
                              handleSort5("target_mb_ach_percentage")
                            }
                          />
                        </span>

                        {/*  */}
                        <span
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          Target 2MB Ach%
                          <img
                            src={
                              sortConfig2.key === "section" &&
                              sortConfig2.direction === "asc"
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
                              handleSort5("target_2mb_ach_percentage")
                            }
                          />
                        </span>
                      </div>

                      {/* Table Rows */}
                      {/* {BrandWiseGrowth && BrandWiseGrowth.length >0 &&
                        BrandWiseGrowth.map((section, index) => {
                          const getColor = (value) => {
                            return value >= 100 ? "#42B0B0" : "#FD6666";
                          };

                          return (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                minWidth: "1000px",
                                borderBottom: "1px solid #ccc",
                              }}
                            >
                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "left",
                                  fontSize: 10,
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.store_name}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontSize: 9,
                                  fontFamily: "Inter",

                                  padding: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {section?.section }
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontSize: 9,
                                  fontFamily: "Inter",

                                  padding: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(section?.CMvs3Mnth )}
                                {renderGrowthIcon(section?.CMvs3Mnth)}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontSize: 9,
                                  fontFamily: "Inter",

                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(section?.CMvsLM )}
                                {renderGrowthIcon1(section?.CMvsLM)}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    section?.target_lm_ach_percentage
                                  ),
                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(
                                  section?.target_lm_ach_percentage 
                                )}
                              </span>

                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    section?.target_mb_ach_percentage 
                                  ),
                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(
                                  section?.target_mb_ach_percentage 
                                )}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  textAlign: "right",
                                  fontSize: 9,
                                  fontFamily: "Inter",
                                  backgroundColor: getColor(
                                    section?.target_2mb_ach_percentage 
                                  ),
                                  fontWeight: "bold",
                                }}
                              >
                                {formatNumber(
                                  section?.target_2mb_ach_percentage
                                )}
                              </span>
                            </div>
                          );
                        })
                        }
                      {BrandWiseGrowthloading && (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <div
                            class="spinner-border gray-spinner"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                      {BrandWiseGrowth && BrandWiseGrowth.length === 0 && (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <div>
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )} */}

<div
                      className="scroll"
                      style={{ overflow: "scroll", height: "393px" }}
                      onScroll={(e) => handleScroll1(e, "BrandWiseGrowth")}
                    >
                      {BrandWiseGrowth && BrandWiseGrowth.length > 0 ? (
                        BrandWiseGrowth.filter(
                          (section) =>
                            section && Object.keys(section).length > 0
                        ) // Remove empty/null entries
                          .map((section, index) => {
                            const getColor = (value) =>
                              // value >= 100 ? "#42B0B0" : "#FD6666";
                              {
                                console.log("val", { value });
                                if (value >= 100) {
                                  return "#42B0B0";
                                } else if (value < 100 && value >= 0) {
                                  return "#FD6666";
                                } else {
                                  return "#d6d6d6";
                                }
                              };

                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  // minWidth: "1000px",
                                  borderBottom: "1px solid #ccc",
                                }}
                              >
                                <span
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    fontSize: 10,
                                    fontFamily: "Inter",
                                    fontWeight: "bold",
                                    // width:"20px",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {section?.store_name}
                                </span>

                                <span
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",

                                    fontSize: 9,
                                    fontFamily: "Inter",
                                    padding: "5px",
                                    fontWeight: "bold",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  <div style={{
                                    
                                    marginLeft:'20%'
                                  }}>
                                  {section?.section}
                                  </div>

                                </span>

                                <span
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 9,
                                    fontFamily: "Inter",
                                    padding: "5px",
                                    fontWeight: "bold",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {section?.CMvs3Mnth !== null
                                    ? formatNumber1(section?.CMvs3Mnth)
                                    : " "}
                                  {renderGrowthIcon(section?.CMvs3Mnth)}
                                </span>

                                <span
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 9,
                                    fontFamily: "Inter",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {section?.CMvsLM !== null
                                    ? formatNumber1(section?.CMvsLM)
                                    : ""}
                                  {renderGrowthIcon1(section?.CMvsLM)}
                                </span>

                                <span
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 9,
                                    fontFamily: "Inter",
                                    backgroundColor: getColor(
                                      section?.target_lm_ach_percentage
                                    ),
                                    fontWeight: "bold",
                                  }}
                                >
                                  {section?.target_lm_ach_percentage !== null
                                    ? formatNumberWithPercentage(
                                        section?.target_lm_ach_percentage
                                      )
                                    : ""}
                                </span>

                                <span
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 9,
                                    fontFamily: "Inter",
                                    backgroundColor: getColor(
                                      section?.target_mb_ach_percentage
                                    ),
                                    fontWeight: "bold",
                                  }}
                                >
                                  {section?.target_mb_ach_percentage === null
                                    ? ""
                                    : formatNumberWithPercentage(
                                        section?.target_mb_ach_percentage
                                      )}
                                </span>

                                <span
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 9,
                                    fontFamily: "Inter",
                                    backgroundColor: getColor(
                                      section?.target_2mb_ach_percentage
                                    ),
                                    fontWeight: "bold",
                                  }}
                                >
                                  {section?.target_2mb_ach_percentage !== null
                                    ? formatNumberWithPercentage(
                                        section?.target_2mb_ach_percentage
                                      )
                                    : ""}
                                </span>
                              </div>
                            );
                          })
                      ) : (
                        <div></div>
                      )}
                      {BrandWiseGrowthloading && (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <div
                            class="spinner-border gray-spinner"
                            role="status"
                          >
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                      {!shouldRun3 && !BrandWiseGrowthloading && (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "10px",
                            color: "black",
                          }}
                        >
                          <div>
                            <span>No Data Available...</span>
                          </div>
                        </div>
                      )}

                      {/* {loading ? (
                        <div style={{ textAlign: "center", padding: "10px" }}>
                          <div
                            className="spinner-border gray-spinner"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <List
                          height={400} // Height of the visible list
                          itemCount={BrandWise.length}
                          itemSize={50} // Height of each row
                          width={2000} // Width of the list
                        >
                          {Row1}
                        </List>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end table 3 */}
          </div>
        </div>
      </div>
    </>
  );
}

export default TargetAchieve;
