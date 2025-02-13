import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { initFlowbite } from "flowbite";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { MdMenuBook } from "react-icons/md";
import { TbSquareLetterPFilled } from "react-icons/tb";
import { TbSquareLetterSFilled } from "react-icons/tb";
import { FaBoxOpen } from "react-icons/fa";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { BsBoxes } from "react-icons/bs";
import { FaBoxes } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { FiTarget } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { Modal, Button } from "react-bootstrap";
// import { Select } from "flowbite-react";

export default function Sidebar() {
  const [flag, setflag] = useState(null);
  const [asm, setasm] = useState(null);
  const [state, setState] = useState([]);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("showStateModal");
    localStorage.removeItem("selectedState");
    sessionStorage.removeItem("flag");
    sessionStorage.removeItem("asm");
    navigate("/");
  };

  useEffect(() => {
    fetchState();
    const flag = sessionStorage.getItem("flag");
    const asm = sessionStorage.getItem("asm");
    
    setasm(asm);
    setflag(flag);
    if (!flag) {
      navigate("/");
    }
    initFlowbite();
    if (localStorage.getItem("showStateModal") === "true") {
      setShowModal(true);
      // localStorage.removeItem("showStateModal");
    }
  }, []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownExOpen, setIsDropdownExOpen] = useState(false);
  const [isDropdownEyOpen, setIsDropdownEyOpen] = useState(false);
  const [isDropdownEZOpen, setIsDropdownEZOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleDropdownEx = () => setIsDropdownExOpen(!isDropdownExOpen);
  const toggleDropdownEy = () => setIsDropdownEyOpen(!isDropdownEyOpen);
  const toggleDropdownEZ = () => setIsDropdownEZOpen(!isDropdownEZOpen);


  const [showModal, setShowModal] = useState(false);
  const [selectedState, setSelectedState] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);

  const fetchState = async () => {
    try {
      const response = await axios.get(`/statenames`);
      const options = response.data.map((state) => ({
        value: state,
        label: state,
      }));
      setStateOptions(options);
    } catch (error) {
      console.error("Error fetching state options:", error);
    }
  };

  const handleChange = (selectedOptions) => {
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value).join(",")
      : "";
    setSelectedState(values); // Store as comma-separated string
    setSelectedValue(selectedOptions);
  };

  const handleSaveState = () => {
    localStorage.setItem("selectedState", selectedState);
    console.log("States saved:", selectedState);
    localStorage.removeItem("showStateModal");
    handleCloseModal();
    window.location.reload();
  };

  const handleShowModal = () => {
    const storedState = localStorage.getItem("selectedState");
    if (storedState) {
      const storedValues = storedState.split(",");
      const options = stateOptions.filter((option) =>
        storedValues.includes(option.value)
      );

      setSelectedValue(options);
    } else {
      setSelectedValue([]); // Initialize as empty array if no state is found
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Set State</Modal.Title>
          <Button
            variant="link"
            onClick={handleCloseModal}
            className="btn-close"
            style={{ color: "black", fontSize: "1.5rem" }} // Customize style as needed
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Select
            isMulti
            value={selectedValue}
            onChange={handleChange}
            options={stateOptions}
            className="basic-single"
            classNamePrefix="select"
          />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center gap-2 mt-2">
          <Button
            style={{ backgroundColor: "#A4DDED" }}
            onClick={handleSaveState}
            className="text-dark"
          >
            Save
          </Button>
          <Button className="bg-danger text-white" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                data-drawer-target="drawer-navigation"
                data-drawer-show="drawer-navigation"
                aria-controls="drawer-navigation"
                data-drawer-backdrop="true"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              {/* <img src={require("../images/Oppo-Logo.png")} className="h-8 me-3" alt="FlowBite Logo" /> */}
              <div class="text-2xl font-bold text-gray-800">
                Stock Optimization
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  {/* <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  > */}
                  {/* <span className="sr-only">Open user menu</span> */}
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-700 font-semibold">
                      {sessionStorage.getItem("user")}
                    </div>
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={require("../images/profile.jpg")}
                      alt="User photo"
                    />
                  </div>

                  {/* </button> */}
                </div>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        id="drawer-navigation"
        className="fixed top-0 left-0 z-40 h-screen pt-20 overflow-y-auto transition-transform -translate-x-full bg-blue-custom w-64 dark:bg-gray-800"
        tabindex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <h5
          id="drawer-navigation-label"
          className="ps-1 text-base font-semibold text-white uppercase dark:text-gray-400"
        >
          Menu
        </h5>
        <button
          type="button"
          data-drawer-hide="drawer-navigation"
          aria-controls="drawer-navigation"
          className=" pt-20  text-white  bg-transparent  hover:text-lightblue-custom rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {flag == 1 && (
              <>
                <li data-drawer-hide="drawer-navigation">
                  <Link
                    data-drawer-hide="drawer-navigation"
                    to="#"
                    className="text-decoration-none"
                    onClick={handleShowModal}
                    data-drawer-dismiss="drawer-navigation"
                  >
                    <div
                      data-drawer-hide="drawer-navigation"
                      data-drawer-dismiss="drawer-navigation"
                      className="flex items-center p-2 text-slate-100 rounded-lg dark:text-white hover:bg-blue-700 dark:hover:bg-gray-700 group"
                    >
                      <TbSquareLetterSFilled className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />
                      <span className="ms-3">Set State</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center w-full p-2 text-base  text-slate-100 transition duration-75 rounded-lg group hover:bg-blue-700  dark:text-white dark:hover:bg-gray-700"
                    aria-controls="dropdown-example"
                    data-collapse-toggle="dropdown-example"
                    onClick={toggleDropdown}
                  >
                    <FaBoxOpen className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />

                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      Optimize Stock
                    </span>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  <ul
                    id="dropdown-example"
                    className={`${
                      isDropdownOpen ? "" : "hidden"
                    } py-2 space-y-2`}
                  >
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/ApproveTransfer"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full  p-2 ps-5  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          Approve Transfer
                        </div>{" "}
                      </Link>
                    </li>
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/TransferReport"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full  p-2 ps-5 text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          Transfer Report
                        </div>{" "}
                      </Link>
                    </li>
                  </ul>
                </li>
                <li data-drawer-hide="drawer-navigation">
                  <Link
                    data-drawer-hide="drawer-navigation"
                    to="/Procurement"
                    data-drawer-dismiss="drawer-navigation"
                  >
                    <div
                      data-drawer-hide="drawer-navigation"
                      data-drawer-dismiss="drawer-navigation"
                      className="flex items-center p-2 text-slate-100 rounded-lg dark:text-white hover:bg-blue-700 dark:hover:bg-gray-700 group"
                    >
                      <TbSquareLetterPFilled className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />
                      <span className="ms-3">Procurement</span>
                    </div>
                  </Link>
                </li>
                <li data-drawer-hide="drawer-navigation">
                  <Link
                    data-drawer-hide="drawer-navigation"
                    to="/ProcurementApproveReport"
                    data-drawer-dismiss="drawer-navigation"
                  >
                    <div
                      data-drawer-hide="drawer-navigation"
                      data-drawer-dismiss="drawer-navigation"
                      className="flex items-center p-2 text-slate-100 rounded-lg dark:text-white hover:bg-blue-700 dark:hover:bg-gray-700 group"
                    >
                      <TbSquareLetterPFilled className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />
                      <span className="ms-3">Procurement Approve </span>
                    </div>
                  </Link>
                </li>
                <li data-drawer-hide="drawer-navigation">
                  <Link
                    data-drawer-hide="drawer-navigation"
                    to="/StockSummary"
                    data-drawer-dismiss="drawer-navigation"
                  >
                    <div
                      data-drawer-hide="drawer-navigation"
                      data-drawer-dismiss="drawer-navigation"
                      className="flex items-center p-2 text-slate-100 rounded-lg dark:text-white hover:bg-blue-700 dark:hover:bg-gray-700 group"
                    >
                      <FaBoxes className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />
                      <span className="ms-3">Stock Summary</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center w-full p-2 text-base  text-slate-100 transition duration-75 rounded-lg group hover:bg-blue-700  dark:text-white dark:hover:bg-gray-700"
                    aria-controls="dropdown-ex"
                    data-collapse-toggle="dropdown-ex"
                    onClick={toggleDropdownEx}
                  >
                    <AiOutlineStock className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />

                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      Stock Analysis
                    </span>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  <ul
                    id="dropdown-ex"
                    className={`${
                      isDropdownExOpen ? "" : "hidden"
                    } py-2 space-y-2`}
                  >
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/StockAnalysisOverall"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2 ps-5 text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          Over All
                        </div>{" "}
                      </Link>
                    </li>
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/StockAnalysisShoplevel"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2 ps-5  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          Shop Level
                        </div>{" "}
                      </Link>
                    </li>
                  </ul>
                </li>
                {/*
                <li data-drawer-hide="drawer-navigation">
                  <Link
                    data-drawer-hide="drawer-navigation"
                    to="/TargetMonitoring"
                  >
                    <div className="flex items-center p-2 text-slate-100 rounded-lg dark:text-white hover:bg-blue-700 dark:hover:bg-gray-700 group">
                      <FiTarget className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />
                      <span className="ms-3">Target Monitoring</span>
                    </div>
                  </Link>
                </li>
                */}
              </>
            )}

           
            {flag == 2 && (
              <>
               {asm === "null" && (
                <li data-drawer-hide="drawer-navigation">
                  <button
                    data-drawer-hide="drawer-navigation"
                    type="button"
                    className="flex items-center w-full p-2 text-base  text-slate-100 transition duration-75 rounded-lg group hover:bg-blue-700  dark:text-white dark:hover:bg-gray-700"
                    aria-controls="dropdown-example"
                    data-collapse-toggle="dropdown-example"
                    onClick={toggleDropdownEy}
                  >
                    <FaBoxOpen className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />

                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      Optimize Stock
                    </span>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  <ul
                    id="dropdown-ey"
                    className={`${
                      isDropdownEyOpen ? "" : "hidden"
                    } py-2 space-y-2`}
                  >
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/TransferSummaryStore"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          Transfer Summary
                        </div>{" "}
                      </Link>
                    </li>
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/TransferRecieveSummary"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          Transfer Receive Summary
                        </div>{" "}
                      </Link>
                    </li>
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/StockSummaryStore"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                        Stock Summary
                        </div>{" "}
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            <li data-drawer-hide="drawer-navigation">
                  <button
                    data-drawer-hide="drawer-navigation"
                    type="button"
                    className="flex items-center w-full p-2 text-base  text-slate-100 transition duration-75 rounded-lg group hover:bg-blue-700  dark:text-white dark:hover:bg-gray-700"
                    aria-controls="dropdown-example"
                    data-collapse-toggle="dropdown-example"
                    onClick={toggleDropdownEZ}
                  >
                    <FaBoxOpen className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />

                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      Dashboard
                    </span>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  <ul
                    id="dropdown-ey"
                    className={`${
                      isDropdownEZOpen ? "" : "hidden"
                    } py-2 space-y-2`}
                  >
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/SalesAllinone"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                        Sales- All in One
                        </div>{" "}
                      </Link>
                    </li>
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/PeriodComparsion"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          Period Comparsion
                        </div>{" "}
                      </Link>
                    </li>
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/SalesAnalysis"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          Sales Analysis
                        </div>{" "}
                      </Link>
                    </li>
                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/AllinoneStock"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          AllinoneStock
                        </div>{" "}

                      </Link>
                    </li>



                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/TargetAchieve"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          Target Achievement Analysis
                        </div>{" "}

                      </Link>
                    </li>



                    <li data-drawer-hide="drawer-navigation">
                      <Link
                        data-drawer-hide="drawer-navigation"
                        to="/BrandAchievement"
                        data-drawer-dismiss="drawer-navigation"
                      >
                        {" "}
                        <div
                          data-drawer-hide="drawer-navigation"
                          data-drawer-dismiss="drawer-navigation"
                          className="flex items-center w-full p-2  text-slate-100 transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
                        >
                          BrandAchievement
                        </div>{" "}

                      </Link>
                    </li>


                  </ul>
                </li>
                {/* <li data-drawer-hide="drawer-navigation">
                  <Link
                    data-drawer-hide="drawer-navigation"
                    to="/StockSummaryStore"
                    data-drawer-dismiss="drawer-navigation"
                  >
                    <div
                      data-drawer-hide="drawer-navigation"
                      data-drawer-dismiss="drawer-navigation"
                      className="flex items-center p-2 text-slate-100 rounded-lg dark:text-white hover:bg-blue-700 dark:hover:bg-gray-700 group"
                    >
                      <FaBoxes className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />
                      <span className="ms-3">Stock Summary</span>
                    </div>
                  </Link>
                </li> */}
                {/* <li data-drawer-hide="drawer-navigation">
                  <Link
                    data-drawer-hide="drawer-navigation"
                    to="/TargetMonitoringStore"
                    data-drawer-dismiss="drawer-navigation"
                  >
                    <div
                      data-drawer-hide="drawer-navigation"
                      data-drawer-dismiss="drawer-navigation"
                      className="flex items-center p-2 text-slate-100 rounded-lg dark:text-white hover:bg-blue-700 dark:hover:bg-gray-700 group"
                    >
                      <FiTarget className="w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white" />
                      <span className="ms-3">Target Monitoring</span>
                    </div>
                  </Link>
                </li> */}
              </>
            )}
            <li data-drawer-hide="drawer-navigation">
              <div
                data-drawer-hide="drawer-navigation"
                className="flex items-center p-2 text-slate-100 rounded-lg dark:text-white hover:bg-blue-700 dark:hover:bg-gray-700 group"
                onClick={handleLogout}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-lightblue-custom transition duration-75 dark:text-gray-400 group-hover:text-slate-100 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
