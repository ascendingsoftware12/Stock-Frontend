import React, { useState, useMemo, useEffect } from "react";
import "flowbite/dist/flowbite.css";
import "../style/table.css";
import { Button, Label, TextInput, Table } from "flowbite-react";
import axios from "axios";
import Select from "react-select";
import DataTable from "react-data-table-component";
import "../style/overall.css";
let flag = 0;
function StockAnalysisShoplevel() {
  const [stockposition, setstockposition] = useState(null);
  const [newandstockposition, setnewandstockposition] = useState(null);
  const [stockageing, setStockageing] = useState(null);
  const [scbsqb, setscbsqb] = useState(null);
  const [dsi, setdsi] = useState(null);
  const [itemlevel, setitemlevel] = useState(null);
  const [fsection, setfsection] = useState();
  const [fstore, setfstore] = useState();
  const [fbrand, setfbrand] = useState();
  const [fitem, setfitem] = useState();
  const [fitemname, setfitemname] = useState();
  const [fstate, setfstate] = useState();
  const [fcity, setfcity] = useState();
  const [fstorecategory, setfstorecategory] = useState();
  const [ffranchtype, setffranchtype] = useState();

  const [section, setSection] = useState({ value: "MOBILE", label: "MOBILE" });
  const [selectsection, setSelectSection] = useState("MOBILE");
  // const [section, setSection] = useState("");
  // const [selectsection, setSelectSection] = useState("");
  const [Selectsalescat, setSelectsalescat] = useState("");
  const [Selectstockcat, setSelectstockcat] = useState("");
  const [SelectStockAgeing, setSelectStockAgeing] = useState("");
  const [SelectNoOfPieces, setSelectNoOfPieces] = useState("");
  const [SelectDSI, setSelectDSI] = useState("");
  const [SelectStore, setSelectStore] = useState("");
  const [SelectBrand, setSelectBrand] = useState("");
  const [SelectItems, setSelectItems] = useState("");
  const [SelectItemname, setSelectItemname] = useState("");

  const [stockpositionloading, setstockpositionLoading] = useState(false);
  const [newandstockpositionLoading, setnewandstockpositionLoading] =
    useState(false);
  const [StockAgeingLoading, setStockAgeingLoading] = useState(false);
  const [scbsqbLoading, setscbsqbLoading] = useState(false);
  const [dsiLoading, setdsiLoading] = useState(false);
  const [ItemlevelLoading, setItemlevelLoading] = useState(false);

  const [storebrandmodel, setstorebrandmodel] = useState([]);

  const [SelectState, setSelectState] = useState("");
  const [SelectStatecity, setSelectStatecity] = useState("");
  const [SelectStoreCate, setSelectStoreCate] = useState("");
  const [SelectFranchtype, setSelectFranchtype] = useState("");

  const options =
    fsection &&
    fsection.map((section) => ({
      value: section,
      label: section,
    }));

  const SalesCategoryoptions = [
    { value: "NEVER SOLD", label: "Never Sold" },
    { value: "NOT SOLD", label: "Not Sold" },
    { value: "SALEABLE", label: "Sold with in 1 month" },
  ];

  const StockCategoryoptions = [
    { value: "NEW", label: "New Stock" },
    { value: "OLD", label: "Old Stock" },
  ];

  const StockAgeingoptions = [
    { value: "0to30", label: "0-30 days" },
    { value: "30to60", label: "30-60 days" },
    { value: "60to90", label: "60-90 days" },
    { value: "90to180", label: "90-180 days" },
    { value: "above_180", label: "Above 180 days" },
  ];

  const NoOfPiecesoptions = [
    { value: "1-2 Pieces", label: "1-2 PIECES" },
    { value: "3-4 Pieces", label: "3 - 4 PIECES" },
    { value: "5-6 Pieces", label: "5 -6 PIECES" },
    { value: "7-8 Pieces", label: "7 -8 PIECES" },
    { value: "9-10 Pieces", label: "9 -10 PIECES" },
    { value: ">10 Pieces", label: "Above 10 PIECES" },
  ];

  const DSIoptions = [
    { value: "1-7 Days", label: "1-7 Days" },
    { value: "8-14 Days", label: "8-14 Days" },
    { value: "15-30 Days", label: "15-30 Days" },
    { value: "31-60 Days", label: "31-60 Days" },
    { value: "61-90 Days", label: "61-90 Days" },
    { value: ">90 Days", label: "Above 90 Days" },
  ];

  const Stateoptions =
    fstate &&
    fstate.map((state) => ({
      value: state,
      label: state,
    }));

  const Statecityoptions =
    fcity &&
    fcity.map((city) => ({
      value: city,
      label: city,
    }));

  const StoreCateoptions =
    fstorecategory &&
    fstorecategory.map((sc) => ({
      value: sc,
      label: sc,
    }));

  const Storeoptions =
    fstore &&
    fstore.map((store) => ({
      value: store[1],
      label: store[0],
    }));

  const Brandoptions =
    fbrand &&
    fbrand.map((brand) => ({
      value: brand,
      label: brand,
    }));

  const Franchtypeoptions =
    ffranchtype &&
    ffranchtype.map((f) => ({
      value: f,
      label: f,
    }));

  const Itemsoptions =
    fitem &&
    fitem.map((item) => ({
      value: item,
      label: item,
    }));
  const ItemNameOptions =
    fitemname &&
    fitemname.map((item) => ({
      value: item,
      label: item,
    }));

  const [spFlag, setSPFlag] = useState();
  const [nsFlag, setNSFlag] = useState();
  const [saFlag, setsaFlag] = useState();
  const [scbFlag, setSCBFlag] = useState();
  const [dsiFlag, setDSIFlag] = useState();
  const [ilFlag, setILFlag] = useState();
  const [sFlag, setSFlag] = useState();
  const [sbmFlag, setSBMSFlag] = useState();

  useEffect(() => {
    if (!spFlag) fetchstockposition();
    if (!nsFlag) fetchnewandstockposition();
    if (!saFlag) fetchStockAgeing();
    if (!scbFlag) fetchscbsqb();
    if (!dsiFlag) fetchdsi();
    if (!ilFlag) fetchItemlevel();
    if (!sFlag) fetchsection();
    if (!sbmFlag) fetchstorebrandmodel();
  }, [spFlag, nsFlag, saFlag, scbFlag, dsiFlag, ilFlag, sFlag, sbmFlag]);

  const fetchsection = async () => {
    try {
      const response = await axios.get("/section");
      const SectionData = response.data;
      setfsection(SectionData);
    } catch (error) {
      console.error("Error fetching Section Data:", error);
    }
  };

  const fetchstorebrandmodel = async () => {
    try {
      const response = await axios.get("/getmodelbrandstore");
      const temp = response.data;
      console.log(flag);
      if (flag === 0) {
        setstorebrandmodel(temp);
        setSBMSFlag(true);
        flag = 1;
      }
      // if (!filterFlag && sbmFlag) {
      //   console.log("ffil" + filterFlag);
      //   handleFilterChange(section, "section");
      //   filterFlag = true;
      // }
      console.log(flag);
      if (flag === 1) {
        const uniqueState = Array.from(
          new Set(
            temp
              .filter((code) => {
                return (
                  (!selectsection || code.SECTION === "MOBILE") &&
                  (!SelectBrand || code.BRAND === SelectBrand) &&
                  (!SelectItems || code.MODELNUMBER === SelectItems) &&
                  (!SelectItemname || code.ITEMNAME === SelectItemname) &&
                  (!SelectState || code.STATE === SelectState) &&
                  (!SelectStatecity || code.CITY === SelectStatecity) &&
                  (!SelectStore || code.STORE === SelectStore) &&
                  (!SelectStoreCate ||
                    code.STORECATEGORY === SelectStoreCate) &&
                  (!SelectFranchtype || code.FRANCHTYPE === SelectFranchtype)
                );
              })
              // (code) => code.SECTION === "MOBILE")
              .map((item) => item.STATE)
          )
        );
        setfstate(uniqueState);

        const uniqueCity = Array.from(
          new Set(
            temp
              .filter((code) => {
                return (
                  (!selectsection || code.SECTION === "MOBILE") &&
                  (!SelectBrand || code.BRAND === SelectBrand) &&
                  (!SelectItems || code.MODELNUMBER === SelectItems) &&
                  (!SelectItemname || code.ITEMNAME === SelectItemname) &&
                  (!SelectState || code.STATE === SelectState) &&
                  (!SelectStatecity || code.CITY === SelectStatecity) &&
                  (!SelectStore || code.STORE === SelectStore) &&
                  (!SelectStoreCate ||
                    code.STORECATEGORY === SelectStoreCate) &&
                  (!SelectFranchtype || code.FRANCHTYPE === SelectFranchtype)
                );
              })
              .map((item) => item.CITY)
          )
        );
        setfcity(uniqueCity);

        const uniqueStorecategory = Array.from(
          new Set(
            temp
              .filter((code) => {
                return (
                  (!selectsection || code.SECTION === "MOBILE") &&
                  (!SelectBrand || code.BRAND === SelectBrand) &&
                  (!SelectItems || code.MODELNUMBER === SelectItems) &&
                  (!SelectItemname || code.ITEMNAME === SelectItemname) &&
                  (!SelectState || code.STATE === SelectState) &&
                  (!SelectStatecity || code.CITY === SelectStatecity) &&
                  (!SelectStore || code.STORE === SelectStore) &&
                  (!SelectStoreCate ||
                    code.STORECATEGORY === SelectStoreCate) &&
                  (!SelectFranchtype || code.FRANCHTYPE === SelectFranchtype)
                );
              })
              .map((item) => item.STORECATEGORY)
          )
        );
        setfstorecategory(uniqueStorecategory);

        const uniquefranchtype = Array.from(
          new Set(
            temp
              .filter((code) => {
                return (
                  (!selectsection || code.SECTION === "MOBILE") &&
                  (!SelectBrand || code.BRAND === SelectBrand) &&
                  (!SelectItems || code.MODELNUMBER === SelectItems) &&
                  (!SelectItemname || code.ITEMNAME === SelectItemname) &&
                  (!SelectState || code.STATE === SelectState) &&
                  (!SelectStatecity || code.CITY === SelectStatecity) &&
                  (!SelectStore || code.STORE === SelectStore) &&
                  (!SelectStoreCate ||
                    code.STORECATEGORY === SelectStoreCate) &&
                  (!SelectFranchtype || code.FRANCHTYPE === SelectFranchtype)
                );
              })
              .map((item) => item.FRANCHTYPE)
          )
        );
        setffranchtype(uniquefranchtype);

        // response.data.map((item) => { store : item.STORE, storecode : item.STORECODE})

        const uniqueToStoreCodes = Array.from(
          new Set(
            temp
              .filter((code) => {
                return (
                  (!selectsection || code.SECTION === "MOBILE") &&
                  (!SelectBrand || code.BRAND === SelectBrand) &&
                  (!SelectItems || code.MODELNUMBER === SelectItems) &&
                  (!SelectItemname || code.ITEMNAME === SelectItemname) &&
                  (!SelectState || code.STATE === SelectState) &&
                  (!SelectStatecity || code.CITY === SelectStatecity) &&
                  (!SelectStore || code.STORE === SelectStore) &&
                  (!SelectStoreCate ||
                    code.STORECATEGORY === SelectStoreCate) &&
                  (!SelectFranchtype || code.FRANCHTYPE === SelectFranchtype)
                );
              })
              .map((item) => JSON.stringify([item.STORE, item.STORECODE]))
          )
        ).map((item) => JSON.parse(item));

        setfstore(uniqueToStoreCodes);

        const uniquebrand = Array.from(
          new Set(
            temp
              .filter((code) => {
                return (
                  (!selectsection || code.SECTION === "MOBILE") &&
                  (!SelectBrand || code.BRAND === SelectBrand) &&
                  (!SelectItems || code.MODELNUMBER === SelectItems) &&
                  (!SelectItemname || code.ITEMNAME === SelectItemname) &&
                  (!SelectState || code.STATE === SelectState) &&
                  (!SelectStatecity || code.CITY === SelectStatecity) &&
                  (!SelectStore || code.STORE === SelectStore) &&
                  (!SelectStoreCate ||
                    code.STORECATEGORY === SelectStoreCate) &&
                  (!SelectFranchtype || code.FRANCHTYPE === SelectFranchtype)
                );
              })
              .map((item) => item.BRAND)
          )
        );
        setfbrand(uniquebrand);

        const uniquemodel = Array.from(
          new Set(
            temp
              .filter((code) => {
                return (
                  (!selectsection || code.SECTION === "MOBILE") &&
                  (!SelectBrand || code.BRAND === SelectBrand) &&
                  (!SelectItems || code.MODELNUMBER === SelectItems) &&
                  (!SelectItemname || code.ITEMNAME === SelectItemname) &&
                  (!SelectState || code.STATE === SelectState) &&
                  (!SelectStatecity || code.CITY === SelectStatecity) &&
                  (!SelectStore || code.STORE === SelectStore) &&
                  (!SelectStoreCate ||
                    code.STORECATEGORY === SelectStoreCate) &&
                  (!SelectFranchtype || code.FRANCHTYPE === SelectFranchtype)
                );
              })
              .map((item) => item.MODELNUMBER)
          )
        );
        setfitem(uniquemodel);
        const uniqueitem = Array.from(
          new Set(
            temp
              .filter((code) => {
                return (
                  (!selectsection || code.SECTION === "MOBILE") &&
                  (!SelectBrand || code.BRAND === SelectBrand) &&
                  (!SelectItems || code.MODELNUMBER === SelectItems) &&
                  (!SelectItemname || code.ITEMNAME === SelectItemname) &&
                  (!SelectState || code.STATE === SelectState) &&
                  (!SelectStatecity || code.CITY === SelectStatecity) &&
                  (!SelectStore || code.STORE === SelectStore) &&
                  (!SelectStoreCate ||
                    code.STORECATEGORY === SelectStoreCate) &&
                  (!SelectFranchtype || code.FRANCHTYPE === SelectFranchtype)
                );
              })
              .map((item) => item.ITEMNAME)
          )
        );
        setfitemname(uniqueitem);
        flag = 2;
      }
    } catch (error) {
      console.error("Error fetching Section Data:", error);
    }
  };
  const handleFilterChange = (selectedOption, type) => {
    let selectedValue = selectedOption ? selectedOption.value : "";

    switch (type) {
      case "section":
        setSelectSection(selectedValue);
        break;
      case "brand":
        setSelectBrand(selectedValue);
        break;
      case "model":
        setSelectItems(selectedValue);
        break;
      case "itemName":
        setSelectItemname(selectedValue);
        break;
      case "state":
        setSelectState(selectedValue);
        break;
      case "statecity":
        setSelectStatecity(selectedValue);
        break;
      case "store":
        setSelectStore(selectedValue);
        break;
      case "storecategory":
        setSelectStoreCate(selectedValue);
        break;
      case "franchtype":
        setSelectFranchtype(selectedOption);
        break;
      default:
        break;
    }

    console.log(selectedValue);
    // Get current selected values
    const currentSection = type === "section" ? selectedValue : selectsection;
    const currentBrand = type === "brand" ? selectedValue : SelectBrand;
    const currentModelNumber = type === "model" ? selectedValue : SelectItems;
    const currentItemName =
      type === "itemName" ? selectedValue : SelectItemname;
    const currentState = type === "state" ? selectedValue : SelectState;
    const currentstatecity =
      type === "statecity" ? selectedValue : SelectStatecity;
    const currentstore = type === "store" ? selectedValue : SelectStore;
    const currentstorecate =
      type === "storecategory" ? selectedValue : SelectStoreCate;
    const currentfranch =
      type === "franchtype" ? selectedValue : SelectFranchtype;

    //console.log('Current Values:', { currentSection, currentBrand, currentModelNumber, currentItemName });

    // Filter the options based on any combination of selected values
    const filteredOptions = storebrandmodel.filter((item) => {
      return (
        (!currentSection || item.SECTION === currentSection) &&
        (!currentBrand || item.BRAND === currentBrand) &&
        (!currentModelNumber || item.MODELNUMBER === currentModelNumber) &&
        (!currentItemName || item.ITEMNAME === currentItemName) &&
        (!currentState || item.STATE === currentState) &&
        (!currentstatecity || item.CITY === currentstatecity) &&
        (!currentstore || item.STORE === currentstore) &&
        (!currentstorecate || item.STORECATEGORY === currentstorecate) &&
        (!currentfranch || item.FRANCHTYPE === currentfranch)
      );
    });

    console.log("Combined Filtered Options:", filteredOptions);
    setfbrand(Array.from(new Set(filteredOptions.map((item) => item.BRAND))));
    setfitem(
      Array.from(new Set(filteredOptions.map((item) => item.MODELNUMBER)))
    );
    setfitemname(
      Array.from(new Set(filteredOptions.map((item) => item.ITEMNAME)))
    );
    setfsection(
      Array.from(new Set(filteredOptions.map((item) => item.SECTION)))
    );
    setfstate(Array.from(new Set(filteredOptions.map((item) => item.STATE))));
    setfcity(Array.from(new Set(filteredOptions.map((item) => item.CITY))));
    //setfstore(Array.from(new Set(filteredOptions.map((item) => item.STORECODE))) );
    setfstore(
      Array.from(
        new Set(
          filteredOptions.map((item) =>
            JSON.stringify([item.STORE, item.STORECODE])
          )
        )
      ).map((item) => JSON.parse(item))
    );
    setfstorecategory(
      Array.from(new Set(filteredOptions.map((item) => item.STORECATEGORY)))
    );
    setffranchtype(
      Array.from(new Set(filteredOptions.map((item) => item.FRANCHTYPE)))
    );
  };

  const handleSectionChange = (selectedOption) => {
    if (selectedOption) {
      setSection(selectedOption);
      setSelectSection(selectedOption.value);

      const filteredData = storebrandmodel.filter(
        (item) => item.SECTION === selectedOption.value
      );

      const brands = Array.from(
        new Set(filteredData.map((item) => item.BRAND))
      );
      setfbrand(brands);

      const modelNumbers = Array.from(
        new Set(filteredData.map((item) => item.MODELNUMBER))
      );
      setfitem(modelNumbers);

      const states = Array.from(
        new Set(filteredData.map((item) => item.STATE))
      );
      setfstate(states);

      const cities = Array.from(new Set(filteredData.map((item) => item.CITY)));
      setfcity(cities);

      const uniqueToStoreCodes = Array.from(
        new Set(
          filteredData.map((item) =>
            JSON.stringify([item.STORE, item.STORECODE])
          )
        )
      ).map((item) => JSON.parse(item));
      setfstore(uniqueToStoreCodes);

      const storeCategories = Array.from(
        new Set(filteredData.map((item) => item.STORECATEGORY))
      );
      setfstorecategory(storeCategories);

      const franchiseTypes = Array.from(
        new Set(filteredData.map((item) => item.FRANCHTYPE))
      );
      setffranchtype(franchiseTypes);

      const filteredItemName = Array.from(
        new Set(filteredData.map((item) => item.ITEMNAME))
      );
      setfitemname(filteredItemName);
    } else {
      setSection("");
      setSelectSection("");
    }
  };

  const handleStoreChange = (selectedOption) => {
    if (selectedOption) {
      setSelectStore(selectedOption.value);
    } else {
      setSelectStore("");
    }
    if (selectedOption) {
      const filterstate = storebrandmodel
        .filter((item) => item.STORECODE === selectedOption.value)
        .map((item) => item.STATE);

      const uniquestate = Array.from(new Set(filterstate));
      setfstate(uniquestate);

      const filtercity = storebrandmodel
        .filter((item) => item.STORECODE === selectedOption.value)
        .map((item) => item.CITY);

      const uniquecity = Array.from(new Set(filtercity));
      setfcity(uniquecity);

      const filteredBrand = storebrandmodel
        .filter((item) => item.STORECODE === selectedOption.value)
        .map((item) => item.BRAND);

      const uniqueBrandNumbers = Array.from(new Set(filteredBrand));
      setfbrand(uniqueBrandNumbers);

      const filteredmodel = storebrandmodel
        .filter((item) => item.STORECODE === selectedOption.value)
        .map((item) => item.MODELNUMBER);

      const uniquemodelnumber = Array.from(new Set(filteredmodel));
      setfitem(uniquemodelnumber);

      const filterstorecategory = storebrandmodel
        .filter((item) => item.STORECODE === selectedOption.value)
        .map((item) => item.STORECATEGORY);

      const uniquestorecat = Array.from(new Set(filterstorecategory));
      setfstorecategory(uniquestorecat);

      const filterfreshtype = storebrandmodel
        .filter((item) => item.STORECODE === selectedOption.value)
        .map((item) => item.FRANCHTYPE);

      const uniquefreshtype = Array.from(new Set(filterfreshtype));
      setffranchtype(uniquefreshtype);

      const filteredItemName = storebrandmodel
        .filter((item) => item.STORECODE === selectedOption.value)
        .map((item) => item.ITEMNAME);

      const uniqueItemName = Array.from(new Set(filteredItemName));
      setfitemname(uniqueItemName);

      const filteredsection = storebrandmodel
        .filter((item) => item.STORECODE === selectedOption.value)
        .map((item) => item.SECTION);
      const uniquesection = Array.from(new Set(filteredsection));
      setfsection(uniquesection);
    } else {
      fetchstorebrandmodel();
    }
  };

  const handleStoreCategoryChange = (selectedOption) => {
    if (selectedOption) {
      setSelectStoreCate(selectedOption.value);
    } else {
      setSelectStoreCate("");
    }

    if (selectedOption) {
      const filterstate = storebrandmodel
        .filter((item) => item.STORECATEGORY === selectedOption.value)
        .map((item) => item.STATE);

      const uniquestate = Array.from(new Set(filterstate));
      setfstate(uniquestate);

      const filtercity = storebrandmodel
        .filter((item) => item.STORECATEGORY === selectedOption.value)
        .map((item) => item.CITY);

      const uniquecity = Array.from(new Set(filtercity));
      setfcity(uniquecity);

      const uniqueToStoreCodes = Array.from(
        new Set(
          storebrandmodel
            .filter((item) => item.STORECATEGORY === selectedOption.value)
            .map((item) => JSON.stringify([item.STORE, item.STORECODE]))
        )
      ).map((item) => JSON.parse(item));

      // Set the unique store codes to your state
      setfstore(uniqueToStoreCodes);

      const filterfreshtype = storebrandmodel
        .filter((item) => item.STORECATEGORY === selectedOption.value)
        .map((item) => item.FRANCHTYPE);

      const uniquefreshtype = Array.from(new Set(filterfreshtype));
      setffranchtype(uniquefreshtype);

      const filteredBrand = storebrandmodel
        .filter((item) => item.STORECATEGORY === selectedOption.value)
        .map((item) => item.BRAND);

      const uniqueBrandNumbers = Array.from(new Set(filteredBrand));
      setfbrand(uniqueBrandNumbers);

      const filteredmodel = storebrandmodel
        .filter((item) => item.STORECATEGORY === selectedOption.value)
        .map((item) => item.MODELNUMBER);

      const uniquemodelnumber = Array.from(new Set(filteredmodel));
      setfitem(uniquemodelnumber);

      const filteredItemName = storebrandmodel
        .filter((item) => item.STORECATEGORY === selectedOption.value)
        .map((item) => item.ITEMNAME);

      const uniqueItemName = Array.from(new Set(filteredItemName));
      setfitemname(uniqueItemName);
    } else {
      fetchstorebrandmodel();
    }
  };

  const handleStateChange = (selectedOption) => {
    if (selectedOption) {
      setSelectState(selectedOption.value);
    } else {
      setSelectState("");
    }

    if (selectedOption) {
      const filtercity = storebrandmodel
        .filter((item) => item.STATE === selectedOption.value)
        .map((item) => item.CITY);

      const uniquecity = Array.from(new Set(filtercity));
      setfcity(uniquecity);

      const uniqueToStoreCodes = Array.from(
        new Set(
          storebrandmodel
            .filter((item) => item.STATE === selectedOption.value)
            .map((item) => JSON.stringify([item.STORE, item.STORECODE]))
        )
      ).map((item) => JSON.parse(item));

      // Set the unique store codes to your state
      setfstore(uniqueToStoreCodes);

      const filterstorecategory = storebrandmodel
        .filter((item) => item.STATE === selectedOption.value)
        .map((item) => item.STORECATEGORY);

      const uniquestorecat = Array.from(new Set(filterstorecategory));
      setfstorecategory(uniquestorecat);

      const filterfreshtype = storebrandmodel
        .filter((item) => item.STATE === selectedOption.value)
        .map((item) => item.FRANCHTYPE);

      const uniquefreshtype = Array.from(new Set(filterfreshtype));
      setffranchtype(uniquefreshtype);

      const filteredBrand = storebrandmodel
        .filter((item) => item.STATE === selectedOption.value)
        .map((item) => item.BRAND);

      const uniqueBrandNumbers = Array.from(new Set(filteredBrand));
      setfbrand(uniqueBrandNumbers);

      const filteredmodel = storebrandmodel
        .filter((item) => item.STATE === selectedOption.value)
        .map((item) => item.MODELNUMBER);

      const uniquemodelnumber = Array.from(new Set(filteredmodel));
      setfitem(uniquemodelnumber);

      const filteredsection = storebrandmodel
        .filter((item) => item.STATE === selectedOption.value)
        .map((item) => item.SECTION);
      const uniquesection = Array.from(new Set(filteredsection));
      setfsection(uniquesection);

      const filteredItemName = storebrandmodel
        .filter((item) => item.STATE === selectedOption.value)
        .map((item) => item.ITEMNAME);

      const uniqueItemName = Array.from(new Set(filteredItemName));
      setfitemname(uniqueItemName);
    } else {
      fetchstorebrandmodel();
    }
  };

  const handleCityChange = (selectedOption) => {
    if (selectedOption) {
      setSelectStatecity(selectedOption.value);
    } else {
      setSelectStatecity("");
    }

    if (selectedOption) {
      const filterstate = storebrandmodel
        .filter((item) => item.CITY === selectedOption.value)
        .map((item) => item.STATE);

      const uniquestate = Array.from(new Set(filterstate));
      setfstate(uniquestate);

      const uniqueToStoreCodes = Array.from(
        new Set(
          storebrandmodel
            .filter((item) => item.CITY === selectedOption.value)
            .map((item) => JSON.stringify([item.STORE, item.STORECODE]))
        )
      ).map((item) => JSON.parse(item));

      // Set the unique store codes to your state
      setfstore(uniqueToStoreCodes);

      const filterstorecategory = storebrandmodel
        .filter((item) => item.CITY === selectedOption.value)
        .map((item) => item.STORECATEGORY);

      const uniquestorecat = Array.from(new Set(filterstorecategory));
      setfstorecategory(uniquestorecat);

      const filterfreshtype = storebrandmodel
        .filter((item) => item.CITY === selectedOption.value)
        .map((item) => item.FRANCHTYPE);

      const uniquefreshtype = Array.from(new Set(filterfreshtype));
      setffranchtype(uniquefreshtype);

      const filteredBrand = storebrandmodel
        .filter((item) => item.CITY === selectedOption.value)
        .map((item) => item.BRAND);

      const uniqueBrandNumbers = Array.from(new Set(filteredBrand));
      setfbrand(uniqueBrandNumbers);

      const filteredmodel = storebrandmodel
        .filter((item) => item.CITY === selectedOption.value)
        .map((item) => item.MODELNUMBER);

      const uniquemodelnumber = Array.from(new Set(filteredmodel));
      setfitem(uniquemodelnumber);

      const filteredsection = storebrandmodel
        .filter((item) => item.CITY === selectedOption.value)
        .map((item) => item.SECTION);
      const uniquesection = Array.from(new Set(filteredsection));
      setfsection(uniquesection);

      const filteredItemName = storebrandmodel
        .filter((item) => item.CITY === selectedOption.value)
        .map((item) => item.ITEMNAME);

      const uniqueItemName = Array.from(new Set(filteredItemName));
      setfitemname(uniqueItemName);
    } else {
      fetchstorebrandmodel();
    }
  };

  const handleFranchType = (selectedOption) => {
    if (selectedOption) {
      setSelectFranchtype(selectedOption.value);
    } else {
      setSelectFranchtype("");
    }

    if (selectedOption) {
      const filterstate = storebrandmodel
        .filter((item) => item.FRANCHTYPE === selectedOption.value)
        .map((item) => item.STATE);

      const uniquestate = Array.from(new Set(filterstate));
      setfstate(uniquestate);

      const filtercity = storebrandmodel
        .filter((item) => item.FRANCHTYPE === selectedOption.value)
        .map((item) => item.CITY);

      const uniquecity = Array.from(new Set(filtercity));
      setfcity(uniquecity);

      const uniqueToStoreCodes = Array.from(
        new Set(
          storebrandmodel
            .filter((item) => item.FRANCHTYPE === selectedOption.value)
            .map((item) => JSON.stringify([item.STORE, item.STORECODE]))
        )
      ).map((item) => JSON.parse(item));

      // Set the unique store codes to your state
      setfstore(uniqueToStoreCodes);

      const filterstorecategory = storebrandmodel
        .filter((item) => item.FRANCHTYPE === selectedOption.value)
        .map((item) => item.STORECATEGORY);

      const uniquestorecat = Array.from(new Set(filterstorecategory));
      setfstorecategory(uniquestorecat);

      const filteredBrand = storebrandmodel
        .filter((item) => item.FRANCHTYPE === selectedOption.value)
        .map((item) => item.BRAND);

      const uniqueBrandNumbers = Array.from(new Set(filteredBrand));
      setfbrand(uniqueBrandNumbers);

      const filteredmodel = storebrandmodel
        .filter((item) => item.FRANCHTYPE === selectedOption.value)
        .map((item) => item.MODELNUMBER);

      const uniquemodelnumber = Array.from(new Set(filteredmodel));
      setfitem(uniquemodelnumber);

      const filteredsection = storebrandmodel
        .filter((item) => item.FRANCHTYPE === selectedOption.value)
        .map((item) => item.SECTION);
      const uniquesection = Array.from(new Set(filteredsection));
      setfsection(uniquesection);

      const filteredItemName = storebrandmodel
        .filter((item) => item.FRANCHTYPE === selectedOption.value)
        .map((item) => item.ITEMNAME);

      const uniqueItemName = Array.from(new Set(filteredItemName));
      setfitemname(uniqueItemName);
    } else {
      fetchstorebrandmodel();
    }
  };

  const handlemodelnumber = (selectedOption) => {
    if (selectedOption) {
      setSelectItems(selectedOption.value);
    } else {
      setSelectItems("");
    }

    if (selectedOption) {
      const filterstate = storebrandmodel
        .filter((item) => item.MODELNUMBER === selectedOption.value)
        .map((item) => item.STATE);

      const uniquestate = Array.from(new Set(filterstate));
      setfstate(uniquestate);

      const filtercity = storebrandmodel
        .filter((item) => item.MODELNUMBER === selectedOption.value)
        .map((item) => item.CITY);

      const uniquecity = Array.from(new Set(filtercity));
      setfcity(uniquecity);

      const uniqueToStoreCodes = Array.from(
        new Set(
          storebrandmodel
            .filter((item) => item.MODELNUMBER === selectedOption.value)
            .map((item) => JSON.stringify([item.STORE, item.STORECODE]))
        )
      ).map((item) => JSON.parse(item));

      // Set the unique store codes to your state
      setfstore(uniqueToStoreCodes);

      const filterstorecategory = storebrandmodel
        .filter((item) => item.MODELNUMBER === selectedOption.value)
        .map((item) => item.STORECATEGORY);

      const uniquestorecat = Array.from(new Set(filterstorecategory));
      setfstorecategory(uniquestorecat);

      const filterfreshtype = storebrandmodel
        .filter((item) => item.MODELNUMBER === selectedOption.value)
        .map((item) => item.FRANCHTYPE);

      const uniquefreshtype = Array.from(new Set(filterfreshtype));
      setffranchtype(uniquefreshtype);

      const filteredBrand = storebrandmodel
        .filter((item) => item.MODELNUMBER === selectedOption.value)
        .map((item) => item.BRAND);
      const uniqueBrandNumbers = Array.from(new Set(filteredBrand));
      setfbrand(uniqueBrandNumbers);

      const filteredItemName = storebrandmodel
        .filter((item) => item.MODELNUMBER === selectedOption.value)
        .map((item) => item.ITEMNAME);

      const uniqueItemName = Array.from(new Set(filteredItemName));
      setfitemname(uniqueItemName);

      const filteredsection = storebrandmodel
        .filter((item) => item.MODELNUMBER === selectedOption.value)
        .map((item) => item.SECTION);
      const uniquesection = Array.from(new Set(filteredsection));
      setfsection(uniquesection);

      // const filteredmodel = storebrandmodel.filter(
      //   (item) => item.STATE === selectedOption.value
      // ).map((item) => item.MODELNUMBER);

      // const uniquemodelnumber = Array.from(new Set(filteredmodel));
      // setfitem(uniquemodelnumber);
    } else {
      fetchstorebrandmodel();
    }
  };

  const handlebrandChange = (selectedOption) => {
    if (selectedOption) {
      setSelectBrand(selectedOption.value);
    } else {
      setSelectBrand("");
    }

    if (selectedOption) {
      const filteredmodel = storebrandmodel
        .filter((item) => item.BRAND === selectedOption.value)
        .map((item) => item.MODELNUMBER);

      const uniquemodelnumber = Array.from(new Set(filteredmodel));
      setfitem(uniquemodelnumber);

      const filteredItemName = storebrandmodel
        .filter((item) => item.BRAND === selectedOption.value)
        .map((item) => item.ITEMNAME);

      const uniqueItemName = Array.from(new Set(filteredItemName));
      setfitemname(uniqueItemName);

      const filteredsection = storebrandmodel
        .filter((item) => item.BRAND === selectedOption.value)
        .map((item) => item.SECTION);
      const uniquesection = Array.from(new Set(filteredsection));
      setfsection(uniquesection);
    } else {
      fetchstorebrandmodel();
    }
  };
  const handleItemNameChange = (selectedOption) => {
    if (selectedOption) {
      setSelectItemname(selectedOption.value);

      const filteredData = storebrandmodel.filter(
        (item) => item.ITEMNAME === selectedOption.value
      );

      const brands = Array.from(
        new Set(filteredData.map((item) => item.BRAND))
      );
      setfbrand(brands);

      const filteredmodel = storebrandmodel
        .filter((item) => item.ITEMNAME === selectedOption.value)
        .map((item) => item.MODELNUMBER);

      const uniquemodelnumber = Array.from(new Set(filteredmodel));
      console.log(uniquemodelnumber);
      setfitem(uniquemodelnumber);

      const states = Array.from(
        new Set(filteredData.map((item) => item.STATE))
      );
      setfstate(states);

      const cities = Array.from(new Set(filteredData.map((item) => item.CITY)));
      setfcity(cities);

      const uniqueToStoreCodes = Array.from(
        new Set(
          filteredData.map((item) =>
            JSON.stringify([item.STORE, item.STORECODE])
          )
        )
      ).map((item) => JSON.parse(item));
      setfstore(uniqueToStoreCodes);

      const storeCategories = Array.from(
        new Set(filteredData.map((item) => item.STORECATEGORY))
      );
      setfstorecategory(storeCategories);

      const franchiseTypes = Array.from(
        new Set(filteredData.map((item) => item.FRANCHTYPE))
      );
      setffranchtype(franchiseTypes);

      const filteredsection = storebrandmodel
        .filter((item) => item.ITEMNAME === selectedOption.value)
        .map((item) => item.SECTION);
      const uniquesection = Array.from(new Set(filteredsection));
      setfsection(uniquesection);
    } else {
      fetchstorebrandmodel();
    }
  };

  const fetchstockposition = async () => {
    setstockpositionLoading(true);
    try {
      const response = await axios.get(`stockanalysis/shoplevel/stockposition`);
      const stockpositionData = response.data;
      setstockposition(stockpositionData);
      setSPFlag(true);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setstockpositionLoading(false);
    }
  };

  const fetchnewandstockposition = async () => {
    setnewandstockpositionLoading(true);
    try {
      const response = await axios.get(
        `stockanalysis/shoplevel/newandstockposition`
      );
      const newandstockpositionData = response.data;
      setnewandstockposition(newandstockpositionData);
      setNSFlag(true);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setnewandstockpositionLoading(false);
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-IN").format(number);
  };

  const fetchStockAgeing = async () => {
    setStockAgeingLoading(true);
    try {
      const response = await axios.get(`stockanalysis/shoplevel/stockageing`);
      const data = response.data;

      const rows = [
        {
          period: "0-30 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["0to30_stock"]
            )} (${Number(data.never_sold["0to30_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(data.not_sold["0to30_stock"])} (${Number(
              data.not_sold["0to30_stock_percentage"]
            ).toFixed(2)}%)`,
            overall: `${formatNumber(data.overall["0to30_stock"])} (${Number(
              data.overall["0to30_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(data.saleable["0to30_stock"])} (${Number(
              data.saleable["0to30_stock_percentage"]
            ).toFixed(2)}%)`,
          },
        },
        {
          period: "30-60 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["30to60_stock"]
            )} (${Number(data.never_sold["30to60_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(data.not_sold["30to60_stock"])} (${Number(
              data.not_sold["30to60_stock_percentage"]
            ).toFixed(2)}%)`,
            overall: `${formatNumber(data.overall["30to60_stock"])} (${Number(
              data.overall["30to60_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(data.saleable["30to60_stock"])} (${Number(
              data.saleable["30to60_stock_percentage"]
            ).toFixed(2)}%)`,
          },
        },
        {
          period: "60-90 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["60to90_stock"]
            )} (${Number(data.never_sold["60to90_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(data.not_sold["60to90_stock"])} (${Number(
              data.not_sold["60to90_stock_percentage"]
            ).toFixed(2)}%)`,
            overall: `${formatNumber(data.overall["60to90_stock"])} (${Number(
              data.overall["60to90_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(data.saleable["60to90_stock"])} (${Number(
              data.saleable["60to90_stock_percentage"]
            ).toFixed(2)}%)`,
          },
        },
        {
          period: "90-180 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["90to180_stock"]
            )} (${Number(data.never_sold["90to180_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(
              data.not_sold["90to180_stock"]
            )} (${Number(data.not_sold["90to180_stock_percentage"]).toFixed(
              2
            )}%)`,
            overall: `${formatNumber(data.overall["90to180_stock"])} (${Number(
              data.overall["90to180_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(
              data.saleable["90to180_stock"]
            )} (${Number(data.saleable["90to180_stock_percentage"]).toFixed(
              2
            )}%)`,
          },
        },
        {
          period: "Above 180 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["above_180_stock"]
            )} (${Number(data.never_sold["above_180_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(
              data.not_sold["above_180_stock"]
            )} (${Number(data.not_sold["above_180_stock_percentage"]).toFixed(
              2
            )}%)`,
            overall: `${formatNumber(
              data.overall["above_180_stock"]
            )} (${Number(data.overall["above_180_stock_percentage"]).toFixed(
              2
            )}%)`,
            saleable: `${formatNumber(
              data.saleable["above_180_stock"]
            )} (${Number(data.saleable["above_180_stock_percentage"]).toFixed(
              2
            )}%)`,
          },
        },
        {
          period: "Total Stock",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["total_stock"]
            )} (${Number(data.never_sold["total_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(data.not_sold["total_stock"])} (${Number(
              data.not_sold["total_stock_percentage"]
            ).toFixed(2)}%)`,
            overall: `${formatNumber(data.overall["total_stock"])} (${Number(
              data.overall["total_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(data.saleable["total_stock"])} (${Number(
              data.saleable["total_stock_percentage"]
            ).toFixed(2)}%)`,
          },
        },
      ];

      setStockageing(rows);
      setsaFlag(true);
      // console.log(rows);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setStockAgeingLoading(false);
    }
  };

  const fetchscbsqb = async () => {
    setscbsqbLoading(true);
    try {
      const response = await axios.get(`stockanalysis/shoplevel/scbsqb`);
      const scbsqbData = response.data;
      setscbsqb(scbsqbData);
      setSCBFlag(true);
      // console.log(scbsqbData);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setscbsqbLoading(false);
    }
  };

  const fetchdsi = async () => {
    setdsiLoading(true);
    try {
      const response = await axios.get(`stockanalysis/shoplevel/dsi`);

      const rows = [
        {
          category: "1-7 Days",
          values: [
            response.data.combined_totals["1-2 Pieces - 1-7 Days"],
            response.data.combined_totals["3-4 Pieces - 1-7 Days"],
            response.data.combined_totals["5-6 Pieces - 1-7 Days"],
            response.data.combined_totals["7-8 Pieces - 1-7 Days"],
            response.data.combined_totals["9-10 Pieces - 1-7 Days"],
            response.data.combined_totals[">10 Pieces - 1-7 Days"],
            response.data.dsi_range_totals["1-7 Days"],
          ],
        },
        {
          category: "8-14 Days",
          values: [
            response.data.combined_totals["1-2 Pieces - 8-14 Days"],
            response.data.combined_totals["3-4 Pieces - 8-14 Days"],
            response.data.combined_totals["5-6 Pieces - 8-14 Days"],
            response.data.combined_totals["7-8 Pieces - 8-14 Days"],
            response.data.combined_totals["9-10 Pieces - 8-14 Days"],
            response.data.combined_totals[">10 Pieces - 8-14 Days"],
            response.data.dsi_range_totals["8-14 Days"],
          ],
        },
        {
          category: "15-30 Days",
          values: [
            response.data.combined_totals["1-2 Pieces - 15-30 Days"],
            response.data.combined_totals["3-4 Pieces - 15-30 Days"],
            response.data.combined_totals["5-6 Pieces - 15-30 Days"],
            response.data.combined_totals["7-8 Pieces - 15-30 Days"],
            response.data.combined_totals["9-10 Pieces - 15-30 Days"],
            response.data.combined_totals[">10 Pieces - 15-30 Days"],
            response.data.dsi_range_totals["15-30 Days"],
          ],
        },
        {
          category: "31-60 Days",
          values: [
            response.data.combined_totals["1-2 Pieces - 31-60 Days"],
            response.data.combined_totals["3-4 Pieces - 31-60 Days"],
            response.data.combined_totals["5-6 Pieces - 31-60 Days"],
            response.data.combined_totals["7-8 Pieces - 31-60 Days"],
            response.data.combined_totals["9-10 Pieces - 31-60 Days"],
            response.data.combined_totals[">10 Pieces - 31-60 Days"],
            response.data.dsi_range_totals["31-60 Days"],
          ],
        },
        {
          category: "61-90 Days",
          values: [
            response.data.combined_totals["1-2 Pieces - 61-90 Days"],
            response.data.combined_totals["3-4 Pieces - 61-90 Days"],
            response.data.combined_totals["5-6 Pieces - 61-90 Days"],
            response.data.combined_totals["7-8 Pieces - 61-90 Days"],
            response.data.combined_totals["9-10 Pieces - 61-90 Days"],
            response.data.combined_totals[">10 Pieces - 61-90 Days"],
            response.data.dsi_range_totals["61-90 Days"],
          ],
        },

        {
          category: "> 90 Days",
          values: [
            response.data.combined_totals["1-2 Pieces - >90 Days"],
            response.data.combined_totals["3-4 Pieces - >90 Days"],
            response.data.combined_totals["5-6 Pieces - >90 Days"],
            response.data.combined_totals["7-8 Pieces - >90 Days"],
            response.data.combined_totals["9-10 Pieces - >90 Days"],
            response.data.combined_totals[">10 Pieces - >90 Days"],
            response.data.dsi_range_totals[">90 Days"],
          ],
        },
        {
          category: "Total",
          values: [
            response.data.pieces_range_totals["1-2 Pieces"],
            response.data.pieces_range_totals["3-4 Pieces"],
            response.data.pieces_range_totals["5-6 Pieces"],
            response.data.pieces_range_totals["7-8 Pieces"],
            response.data.pieces_range_totals["9-10 Pieces"],
            response.data.pieces_range_totals[">10 Pieces"],
            response.data.grand_totals["overall_total"],
          ],
        },
      ];

      setdsi(rows);
      setDSIFlag(true);
      // console.log(rows);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setdsiLoading(false);
    }
  };

  const fetchItemlevel = async () => {
    setItemlevelLoading(true);
    try {
      const response = await axios.get(`stockanalysis/shoplevel/storelevel`);
      const itemlevelData = response.data;
      setitemlevel(itemlevelData);
      setILFlag(true);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setItemlevelLoading(false);
    }
  };

  const handlesearch = async () => {
    setstockpositionLoading(true);
    setnewandstockpositionLoading(true);
    setStockAgeingLoading(true);
    setscbsqbLoading(true);
    setdsiLoading(true);
    setItemlevelLoading(true);
    try {
      const response = await axios.get(
        `stockanalysis/shoplevel/search?section=${selectsection}&salescategory=${Selectsalescat}&stockcategory=${Selectstockcat}&stockageing=${SelectStockAgeing}&noofpieces=${SelectNoOfPieces}&dsi=${SelectDSI}&store=${SelectStore}&brand=${SelectBrand}&modelno=${SelectItems}&itemname=${SelectItemname}&state=${SelectState}&city=${SelectStatecity}&storecategory=${SelectStoreCate}&franchtype=${SelectFranchtype}`
      );
      const stockpositionData = response.data.overall_stock_position;
      setstockposition(stockpositionData);
      const newandstockpositionData =
        response.data.shop_level_new_and_stock_position;
      setnewandstockposition(newandstockpositionData);

      const data = response.data.shop_level_stock_ageing;

      const rows = [
        {
          period: "0-30 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["0to30_stock"]
            )} (${Number(data.never_sold["0to30_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(data.not_sold["0to30_stock"])} (${Number(
              data.not_sold["0to30_stock_percentage"]
            ).toFixed(2)}%)`,
            overall: `${formatNumber(data.overall["0to30_stock"])} (${Number(
              data.overall["0to30_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(data.saleable["0to30_stock"])} (${Number(
              data.saleable["0to30_stock_percentage"]
            ).toFixed(2)}%)`,
          },
        },
        {
          period: "30-60 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["30to60_stock"]
            )} (${Number(data.never_sold["30to60_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(data.not_sold["30to60_stock"])} (${Number(
              data.not_sold["30to60_stock_percentage"]
            ).toFixed(2)}%)`,
            overall: `${formatNumber(data.overall["30to60_stock"])} (${Number(
              data.overall["30to60_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(data.saleable["30to60_stock"])} (${Number(
              data.saleable["30to60_stock_percentage"]
            ).toFixed(2)}%)`,
          },
        },
        {
          period: "60-90 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["60to90_stock"]
            )} (${Number(data.never_sold["60to90_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(data.not_sold["60to90_stock"])} (${Number(
              data.not_sold["60to90_stock_percentage"]
            ).toFixed(2)}%)`,
            overall: `${formatNumber(data.overall["60to90_stock"])} (${Number(
              data.overall["60to90_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(data.saleable["60to90_stock"])} (${Number(
              data.saleable["60to90_stock_percentage"]
            ).toFixed(2)}%)`,
          },
        },
        {
          period: "90-180 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["90to180_stock"]
            )} (${Number(data.never_sold["90to180_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(
              data.not_sold["90to180_stock"]
            )} (${Number(data.not_sold["90to180_stock_percentage"]).toFixed(
              2
            )}%)`,
            overall: `${formatNumber(data.overall["90to180_stock"])} (${Number(
              data.overall["90to180_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(
              data.saleable["90to180_stock"]
            )} (${Number(data.saleable["90to180_stock_percentage"]).toFixed(
              2
            )}%)`,
          },
        },
        {
          period: "Above 180 days",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["above_180_stock"]
            )} (${Number(data.never_sold["above_180_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(
              data.not_sold["above_180_stock"]
            )} (${Number(data.not_sold["above_180_stock_percentage"]).toFixed(
              2
            )}%)`,
            overall: `${formatNumber(
              data.overall["above_180_stock"]
            )} (${Number(data.overall["above_180_stock_percentage"]).toFixed(
              2
            )}%)`,
            saleable: `${formatNumber(
              data.saleable["above_180_stock"]
            )} (${Number(data.saleable["above_180_stock_percentage"]).toFixed(
              2
            )}%)`,
          },
        },
        {
          period: "Total Stock",
          values: {
            never_sold: `${formatNumber(
              data.never_sold["total_stock"]
            )} (${Number(data.never_sold["total_stock_percentage"]).toFixed(
              2
            )}%)`,
            not_sold: `${formatNumber(data.not_sold["total_stock"])} (${Number(
              data.not_sold["total_stock_percentage"]
            ).toFixed(2)}%)`,
            overall: `${formatNumber(data.overall["total_stock"])} (${Number(
              data.overall["total_stock_percentage"]
            ).toFixed(2)}%)`,
            saleable: `${formatNumber(data.saleable["total_stock"])} (${Number(
              data.saleable["total_stock_percentage"]
            ).toFixed(2)}%)`,
          },
        },
      ];

      setStockageing(rows);

      const scbsqbData =
        response.data.shop_level_sales_category_by_stock_qty_bucket;
      setscbsqb(scbsqbData);

      const dsirows = [
        {
          category: "1-7 Days",
          values: [
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "1-2 Pieces - 1-7 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "3-4 Pieces - 1-7 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "5-6 Pieces - 1-7 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "7-8 Pieces - 1-7 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "9-10 Pieces - 1-7 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              ">10 Pieces - 1-7 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .dsi_range_totals["1-7 Days"],
          ],
        },
        {
          category: "8-14 Days",
          values: [
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "1-2 Pieces - 8-14 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "3-4 Pieces - 8-14 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "5-6 Pieces - 8-14 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "7-8 Pieces - 8-14 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "9-10 Pieces - 8-14 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              ">10 Pieces - 8-14 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .dsi_range_totals["8-14 Days"],
          ],
        },
        {
          category: "15-30 Days",
          values: [
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "1-2 Pieces - 15-30 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "3-4 Pieces - 15-30 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "5-6 Pieces - 15-30 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "7-8 Pieces - 15-30 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "9-10 Pieces - 15-30 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              ">10 Pieces - 15-30 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .dsi_range_totals["15-30 Days"],
          ],
        },
        {
          category: "31-60 Days",
          values: [
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "1-2 Pieces - 31-60 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "3-4 Pieces - 31-60 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "5-6 Pieces - 31-60 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "7-8 Pieces - 31-60 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "9-10 Pieces - 31-60 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              ">10 Pieces - 31-60 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .dsi_range_totals["31-60 Days"],
          ],
        },
        {
          category: "61-90 Days",
          values: [
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "1-2 Pieces - 61-90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "3-4 Pieces - 61-90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "5-6 Pieces - 61-90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "7-8 Pieces - 61-90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "9-10 Pieces - 61-90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              ">10 Pieces - 61-90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .dsi_range_totals["61-90 Days"],
          ],
        },

        {
          category: "> 90 Days",
          values: [
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "1-2 Pieces - >90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "3-4 Pieces - >90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "5-6 Pieces - >90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "7-8 Pieces - >90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              "9-10 Pieces - >90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket.combined_totals[
              ">10 Pieces - >90 Days"
            ],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .dsi_range_totals[">90 Days"],
          ],
        },
        {
          category: "Total",
          values: [
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .pieces_range_totals["1-2 Pieces"],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .pieces_range_totals["3-4 Pieces"],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .pieces_range_totals["5-6 Pieces"],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .pieces_range_totals["7-8 Pieces"],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .pieces_range_totals["9-10 Pieces"],
            response.data.shop_level_dsi_by_saleable_qty_bucket
              .pieces_range_totals[">10 Pieces"],
            response.data.shop_level_dsi_by_saleable_qty_bucket.grand_totals[
              "overall_total"
            ],
          ],
        },
      ];

      setdsi(dsirows);

      const itemlevelData = response.data.shop_level_item_level_details;
      setitemlevel(itemlevelData);
    } catch (error) {
      console.error("Error fetching Stocksummary Data:", error);
    } finally {
      setstockpositionLoading(false);
      setnewandstockpositionLoading(false);
      setStockAgeingLoading(false);
      setscbsqbLoading(false);
      setdsiLoading(false);
      setItemlevelLoading(false);
    }
  };

  const columns = [
    {
      name: "Store",
      selector: (row) => row.iname,
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: "New Stock",
      selector: (row) => row.nevernew,
      sortable: true,
      wrap: true,
    },
    {
      name: "Old Stock",
      selector: (row) => row.neverold,
      sortable: true,
      wrap: true,
    },
    {
      name: "New Stock",
      selector: (row) => row.notsoldnew,
      sortable: true,
      wrap: true,
    },
    {
      name: "Old Stock",
      selector: (row) => row.notsoldold,
      sortable: true,
      wrap: true,
    },
    {
      name: "New Stock",
      selector: (row) => row.soldwithnew,
      sortable: true,
      wrap: true,
    },
    {
      name: "Old Stock",
      selector: (row) => row.soldwithold,
      sortable: true,
      wrap: true,
    },
  ];

  const data = itemlevel
    ? Object.entries(itemlevel).map(([itemName, statuses]) => ({
        iname: itemName,
        nevernew: statuses["NEVER SOLD"]
          ? `${formatNumber(statuses["NEVER SOLD"].new_stock_total)} (${Number(
              statuses["NEVER SOLD"].new_stock_percentage
            ).toFixed(2)}%)`
          : "",
        neverold: statuses["NEVER SOLD"]
          ? `${formatNumber(statuses["NEVER SOLD"].old_stock_total)} (${Number(
              statuses["NEVER SOLD"].old_stock_percentage
            ).toFixed(2)}%)`
          : "",
        notsoldnew: statuses["NOT SOLD"]
          ? `${formatNumber(statuses["NOT SOLD"].new_stock_total)} (${Number(
              statuses["NOT SOLD"].new_stock_percentage
            ).toFixed(2)}%)`
          : "",
        notsoldold: statuses["NOT SOLD"]
          ? `${formatNumber(statuses["NOT SOLD"].old_stock_total)} (${Number(
              statuses["NOT SOLD"].old_stock_percentage
            ).toFixed(2)}%)`
          : "",
        soldwithnew: statuses["SALEABLE"]
          ? `${formatNumber(statuses["SALEABLE"].new_stock_total)} (${Number(
              statuses["SALEABLE"].new_stock_percentage
            ).toFixed(2)}%)`
          : "",
        soldwithold: statuses["SALEABLE"]
          ? `${formatNumber(statuses["SALEABLE"].old_stock_total)} (${Number(
              statuses["SALEABLE"].old_stock_percentage
            ).toFixed(2)}%)`
          : "",
      }))
    : [];

  const subHeaderComponent = (
    <div className="w-full pt-4">
      <table className="w-full border-collapse" style={{ margin: 0 }}>
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center">
              Sales Category
            </th>
            <th
              colSpan="2"
              className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center"
            >
              Never Sold
            </th>
            <th
              colSpan="2"
              className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center"
            >
              {" Not Sold > 1 Month"}
            </th>
            <th
              colSpan="2"
              className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center"
            >
              Sold Within 1 Month
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );

  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto mt-14">
        <div className="p-4 rounded-lg shadow bg-white">
          <div className="space-y-6">
            <nav class="flex" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li>
                  <div class="flex items-center">
                    <a
                      href="#"
                      class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      Stock Analysis
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
                      Store Level Stock Analysis
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <br />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Store Level Stock Analysis
            </h3>
            <form method="post">
              <div className="flex gap-2">
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Section" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    value={
                      selectsection
                        ? { value: selectsection, label: selectsection }
                        : ""
                    }
                    onChange={(selectedOption) =>
                      handleFilterChange(selectedOption, "section")
                    }
                    options={options}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block ">
                    <Label htmlFor="password" value="Brand" />
                  </div>
                  <Select
                    id="brand"
                    name="brand"
                    value={
                      SelectBrand
                        ? { value: SelectBrand, label: SelectBrand }
                        : ""
                    }
                    onChange={(selectedOption) =>
                      handleFilterChange(selectedOption, "brand")
                    }
                    options={Brandoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block ">
                    <Label htmlFor="password" value="Model Number" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    value={
                      SelectItems
                        ? { value: SelectItems, label: SelectItems }
                        : ""
                    }
                    onChange={(selectedOption) =>
                      handleFilterChange(selectedOption, "model")
                    }
                    options={Itemsoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block ">
                    <Label htmlFor="password" value="Item Name" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) =>
                      handleFilterChange(selectedOption, "itemName")
                    }
                    options={ItemNameOptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="State" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    //onChange={handleStateChange}
                    options={Stateoptions}
                    value={
                      SelectState
                        ? { value: SelectState, label: SelectState }
                        : ""
                    }
                    onChange={(selectedOption) =>
                      handleFilterChange(selectedOption, "state")
                    }
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="City" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    //onChange={handleCityChange}
                    options={Statecityoptions}
                    value={
                      SelectStatecity
                        ? { value: SelectStatecity, label: SelectStatecity }
                        : ""
                    }
                    onChange={(selectedOption) =>
                      handleFilterChange(selectedOption, "statecity")
                    }
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Store" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    //onChange={handleStoreChange}
                    value={
                      SelectStore
                        ? { value: SelectStore, label: SelectStore }
                        : ""
                    }
                    onChange={(selectedOption) =>
                      handleFilterChange(selectedOption, "store")
                    }
                    options={Storeoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
              </div>
              <br />
              <div className="flex gap-2">
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Store Category" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    //onChange={handleStoreCategoryChange}
                    options={StoreCateoptions}
                    value={
                      SelectStoreCate
                        ? { value: SelectStoreCate, label: SelectStoreCate }
                        : ""
                    }
                    onChange={(selectedOption) =>
                      handleFilterChange(selectedOption, "storecategory")
                    }
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Franch Type" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    options={Franchtypeoptions}
                    //onChange={handleFranchType}
                    value={
                      SelectStoreCate
                        ? { value: SelectFranchtype, label: SelectFranchtype }
                        : ""
                    }
                    onChange={(selectedOption) =>
                      handleFilterChange(selectedOption, "franchtype")
                    }
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>

                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Sales Category " />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectsalescat(selectedOption.value);
                      } else {
                        setSelectsalescat("");
                      }
                    }}
                    options={SalesCategoryoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Stock Category" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectstockcat(selectedOption.value);
                      } else {
                        setSelectstockcat("");
                      }
                    }}
                    options={StockCategoryoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Stock Ageing " />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectStockAgeing(selectedOption.value);
                      } else {
                        setSelectStockAgeing("");
                      }
                    }}
                    options={StockAgeingoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block ">
                    <Label htmlFor="password" value="No Of Pieces" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectNoOfPieces(selectedOption.value);
                      } else {
                        setSelectNoOfPieces("");
                      }
                    }}
                    options={NoOfPiecesoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="DSI " />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectDSI(selectedOption.value);
                      } else {
                        setSelectDSI("");
                      }
                    }}
                    options={DSIoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
              </div>
              <br />

              <div className="flex gap-4"></div>

              {/*} <div className="flex gap-4">
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Section" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    value={section}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSection(selectedOption);
                        setSelectSection(selectedOption.value);
                      } else {
                        setSection("");
                        setSelectSection("");
                      }
                    }}
                    options={options}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Sales Category " />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectsalescat(selectedOption.value);
                      } else {
                        setSelectsalescat("");
                      }
                    }}
                    options={SalesCategoryoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Stock Category" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectstockcat(selectedOption.value);
                      } else {
                        setSelectstockcat("");
                      }
                    }}
                    options={StockCategoryoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
              </div>
              <br />
              <div className="flex gap-4">
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Stock Ageing " />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectStockAgeing(selectedOption.value);
                      } else {
                        setSelectStockAgeing("");
                      }
                    }}
                    options={StockAgeingoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block ">
                    <Label htmlFor="password" value="No Of Pieces" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectNoOfPieces(selectedOption.value);
                      } else {
                        setSelectNoOfPieces("");
                      }
                    }}
                    options={NoOfPiecesoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="DSI " />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectDSI(selectedOption.value);
                      } else {
                        setSelectDSI("");
                      }
                    }}
                    options={DSIoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
              </div>
              <br />
              <div className="flex gap-4">
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Store" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    // onChange={(selectedOption) => {
                    //   if (selectedOption) {
                    //     setSelectStore(selectedOption.value);
                    //   } else {
                    //     setSelectStore("");
                    //   }
                    // }}
                    onChange={handleStoreChange}
                    options={Storeoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block  ">
                    <Label htmlFor="password" value="Brand " />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    // onChange={(selectedOption) => {
                    //   if (selectedOption) {
                    //     setSelectBrand(selectedOption.value);
                    //   } else {
                    //     setSelectBrand("");
                    //   }
                    // }}
                    onChange={handlebrandChange}
                    options={Brandoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
                <div className="w-1/3">
                  <div className="mb-2 block ">
                    <Label htmlFor="password" value="Model" />
                  </div>
                  <Select
                    id="transferType"
                    name="transferType"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setSelectItems(selectedOption.value);
                      } else {
                        setSelectItems("");
                      }
                    }}
                    options={Itemsoptions}
                    isClearable={true}
                    placeholder="Select an option"
                  />
                </div>
              </div>*/}
              <br />
              <div className="flex justify-center gap-4">
                <Button
                  style={{ backgroundColor: "#A4DDED" }}
                  className="text-dark"
                  type="button"
                  onClick={handlesearch}
                >
                  {"Search"}
                </Button>
              </div>
            </form>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Store Level -Stock Position
          </h3>
          <div className="overflow-x-auto">
            {stockpositionloading && (
              <div
                role="status"
                class="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 pt-4"
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

                <span class="sr-only">Loading...</span>
              </div>
            )}
            {!stockpositionloading && (
              <table className="w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center">
                      Never Sold
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center">
                      {"Not Sold > 1 Month"}
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center">
                      Sold Within 1 Month
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stockposition ? (
                    <tr>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(stockposition.never_sold_total)}
                        <br />(
                        {Number(stockposition.never_sold_percentage).toFixed(2)}
                        %)
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(stockposition.not_sold_total)}
                        <br />(
                        {Number(stockposition.not_sold_percentage).toFixed(2)}%)
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(stockposition.saleable_total)}
                        <br />(
                        {Number(stockposition.saleable_percentage).toFixed(2)}%)
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(stockposition.total)}
                        <br />(
                        {Number(stockposition.total_percentage).toFixed(2)}%)
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            )}
          </div>

          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Store Level - New and Stock Position
          </h3>

          <div className="overflow-x-auto">
            {newandstockpositionLoading && (
              <div
                role="status"
                class="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 pt-4"
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

                <span class="sr-only">Loading...</span>
              </div>
            )}
            {!newandstockpositionLoading && (
              <table className="w-full  leading-normal">
                <thead>
                  <tr>
                    <th
                      colspan="2"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center"
                    >
                      Never Sold
                    </th>
                    <th
                      colspan="2"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center"
                    >
                      {"Not Sold > 1 Month"}
                    </th>
                    <th
                      colspan="2"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase text-center "
                    >
                      Sold Within 1 Month
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                      New Stock
                    </td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                      Old Stock
                    </td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                      New Stock
                    </td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                      Old Stock
                    </td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                      New Stock
                    </td>
                    <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                      Old Stock
                    </td>
                  </tr>
                  {newandstockposition ? (
                    <tr>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(
                          newandstockposition.never_sold_new_stock_total
                        )}
                        <br />(
                        {Number(
                          newandstockposition.percentages
                            .never_sold_new_stock_percent
                        ).toFixed(2)}
                        %)
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(
                          newandstockposition.never_sold_old_stock_total
                        )}
                        <br />(
                        {Number(
                          newandstockposition.percentages
                            .never_sold_old_stock_percent
                        ).toFixed(2)}
                        %)
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(
                          newandstockposition.not_sold_new_stock_total
                        )}
                        <br />(
                        {Number(
                          newandstockposition.percentages
                            .not_sold_new_stock_percent
                        ).toFixed(2)}
                        %)
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(
                          newandstockposition.not_sold_old_stock_total
                        )}
                        <br />(
                        {Number(
                          newandstockposition.percentages
                            .not_sold_old_stock_percent
                        ).toFixed(2)}
                        %)
                      </td>
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(
                          newandstockposition.saleable_new_stock_total
                        )}
                        <br />(
                        {Number(
                          newandstockposition.percentages
                            .saleable_new_stock_percent
                        ).toFixed(2)}
                        %)
                      </td>{" "}
                      <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm text-center">
                        {formatNumber(
                          newandstockposition.saleable_old_stock_total
                        )}
                        <br />(
                        {Number(
                          newandstockposition.percentages
                            .saleable_old_stock_percent
                        ).toFixed(2)}
                        %)
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            )}
          </div>

          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Store Level -Stock Ageing
          </h3>
          <div className="overflow-x-auto">
            {StockAgeingLoading && (
              <div
                role="status"
                class="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 pt-4"
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

                <span class="sr-only">Loading...</span>
              </div>
            )}
            {!StockAgeingLoading && (
              <table className="w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase">
                      Stock Ageing
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      Never Sold
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      {"Not Sold > 1 Month"}
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      Sold Within 1 Month
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stockageing &&
                    stockageing.map((item, index) => (
                      <tr key={index}>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {item.period}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {item.values.never_sold}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {item.values.not_sold}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {item.values.saleable}
                        </td>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {item.values.overall}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>

          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Store Level - Sales Category By Stock Qty Bucket
          </h3>
          <div className="overflow-x-auto">
            {scbsqbLoading && (
              <div
                role="status"
                class="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 pt-4"
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

                <span class="sr-only">Loading...</span>
              </div>
            )}
            {!scbsqbLoading && (
              <table className="w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase">
                      Sales Category
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      1-2 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      3 - 4 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      5 -6 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      7-8 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      9-10 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      {" >10 Pieces"}
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scbsqb &&
                    Object.keys(scbsqb)
                      .filter((category) => category !== "grand_totals")
                      .map((category, index) => (
                        <tr key={index}>
                          <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                            {category}
                          </td>
                          <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                            {formatNumber(scbsqb[category]["1-2 Pieces"])}
                          </td>
                          <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                            {formatNumber(scbsqb[category]["3-4 Pieces"])}
                          </td>
                          <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                            {formatNumber(scbsqb[category]["5-6 Pieces"])}
                          </td>
                          <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                            {formatNumber(scbsqb[category]["7-8 Pieces"])}
                          </td>
                          <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                            {formatNumber(scbsqb[category]["9-10 Pieces"])}
                          </td>
                          <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                            {formatNumber(scbsqb[category][">10 Pieces"])}
                          </td>
                          <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                            {formatNumber(
                              Object.values(scbsqb[category]).reduce(
                                (acc, val) => acc + parseInt(val, 10),
                                0
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            )}
          </div>

          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Store Level - DSI By Saleable Qty Bucket
          </h3>
          <div className="overflow-x-auto">
            {dsiLoading && (
              <div
                role="status"
                class="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 pt-4"
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

                <span class="sr-only">Loading...</span>
              </div>
            )}
            {!dsiLoading && (
              <table className="w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase">
                      Store Category
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      1-2 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      3 - 4 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      5 -6 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      7 -8 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      9 -10 Pieces
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      {" > 10  Pieces"}
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dsi &&
                    dsi.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
                          {row.category}
                        </td>
                        {row.values.map((value, valueIndex) => (
                          <td
                            key={valueIndex}
                            className="px-2 py-2 border-b border-gray-200 bg-white text-sm"
                          >
                            {formatNumber(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>

          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            ShopLevel Details
          </h3>

          <div className="overflow-x-auto">
            {ItemlevelLoading && (
              <div
                role="status"
                class="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 pt-4"
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

                <span class="sr-only">Loading...</span>
              </div>
            )}
            {!ItemlevelLoading && (
              // <table className="w-full  leading-normal">
              //   <thead>
              //     <tr>
              //       <th className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase ">
              //         Sales Category
              //       </th>
              //       <th
              //         colspan="2"
              //         className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase "
              //       >
              //         Never Sold
              //       </th>
              //       <th
              //         colspan="2"
              //         className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase "
              //       >
              //         {"Not Sold > 1 Month"}
              //       </th>
              //       <th
              //         colspan="2"
              //         className="px-5 py-3 border-b-2 border-gray-200 bg-blueheader text-left text-xs font-semibold text-gray-100 uppercase "
              //       >
              //         Sold Within 1 Month
              //       </th>
              //     </tr>
              //   </thead>
              //   <tbody>
              //     <tr>
              //       <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //         Store
              //       </td>
              //       <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //         New Stock
              //       </td>
              //       <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //         Old Stock
              //       </td>
              //       <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //         New Stock
              //       </td>
              //       <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //         Old Stock
              //       </td>
              //       <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //         New Stock
              //       </td>
              //       <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //         Old Stock
              //       </td>
              //     </tr>

              //     {itemlevel &&
              //       Object.entries(itemlevel).map(([itemName, statuses]) => (
              //         <tr key={itemName}>
              //           <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //             {itemName}
              //           </td>
              //           <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //             {formatNumber(statuses["NEVER SOLD"].new_stock_total)}{" "}
              //             (
              //             {Number(
              //               statuses["NEVER SOLD"].new_stock_percentage
              //             ).toFixed(2)}
              //             %)
              //           </td>
              //           <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //             {formatNumber(statuses["NEVER SOLD"].old_stock_total)}{" "}
              //             (
              //             {Number(
              //               statuses["NEVER SOLD"].old_stock_percentage
              //             ).toFixed(2)}
              //             %)
              //           </td>
              //           <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //             {formatNumber(statuses["NOT SOLD"].new_stock_total)} (
              //             {Number(
              //               statuses["NOT SOLD"].new_stock_percentage
              //             ).toFixed(2)}
              //             %)
              //           </td>
              //           <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //             {formatNumber(statuses["NOT SOLD"].old_stock_total)} (
              //             {Number(
              //               statuses["NOT SOLD"].old_stock_percentage
              //             ).toFixed(2)}
              //             %)
              //           </td>
              //           <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //             {formatNumber(statuses["SALEABLE"].new_stock_total)} (
              //             {Number(
              //               statuses["SALEABLE"].new_stock_percentage
              //             ).toFixed(2)}
              //             %)
              //           </td>
              //           <td className="px-2 py-2 border-b border-gray-200 bg-white text-sm">
              //             {formatNumber(statuses["SALEABLE"].old_stock_total)} (
              //             {Number(
              //               statuses["SALEABLE"].old_stock_percentage
              //             ).toFixed(2)}
              //             %)
              //           </td>
              //         </tr>
              //       ))}
              //   </tbody>
              // </table>
              <DataTable
                columns={columns || []}
                data={data || []}
                pagination
                subHeader
                subHeaderComponent={subHeaderComponent}
                persistTableHead
                striped
                highlightOnHover
                noHeader
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockAnalysisShoplevel;
