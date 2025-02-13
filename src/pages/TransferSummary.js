import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import { Button, TextInput } from "flowbite-react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import "../style/datatablestyle.css";
import "flowbite/dist/flowbite.css";
const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #457b9d;
`;

const FilterComponent = ({ onFilter, onClear, filterText }) => (
  <>
    <TextField
      placeholder="Filter By Title"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton onClick={onClear}>X</ClearButton>
  </>
);

function TransferSummary() {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    // Fetch or initialize data if needed
  }, []);

  const data = [
    {
      TSCode: "STORE33",
      TSName: "STORE33",
      ModelNo: "ITEM314",
      Brand: "BRAND38",
      RQuantity: 4,
      AQuantity: 3,
      CQuantity: 2,
      CStatus: "",
      CDate: "31-10-2023",
    },
  ];

  const columns = [
    {
      name: "To Store Name	",
      selector: (row) => row.TSName,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <p>
          {" "}
          {row.TSName} <br />
          <b>( {row.TSCode}</b> )
        </p>
      ),
    },
    {
      name: "Model Number",
      selector: (row) => row.ModelNo,
      wrap: true,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) => row.Brand,
      wrap: true,
      sortable: true,
    },
    {
      name: "Recommended Quantity",
      selector: (row) => row.RQuantity,
      wrap: true,
      sortable: true,
    },
    {
      name: "Approved Quantity",
      selector: (row) => row.AQuantity,
      wrap: true,
      sortable: true,
    },
    {
      name: "Couriered Quantity",
      selector: (row) => row.CQuantity,
      wrap: true,
      sortable: true,
    },
    // {
    //   name: "Couriered Status ",
    //   selector: (row) => row.trquan,
    //   sortable: true,
    //   cell :(row) => (
    //     <TextInput type="checkbox" value={row.apquan}/>
    // )
    // },
    {
      name: "Couriered Date",
      selector: (row) => row.CDate,
      sortable: true,
      wrap: true,
      cell: (row) => <TextInput type="text" value={row.CDate} />,
    },
  ];

  const filteredItems = data.filter(
    (item) =>
      (item.TSCode &&
        item.TSCode.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.TSName &&
        item.TSName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.ModelNo &&
        item.ModelNo.toLowerCase().includes(filterText.toLowerCase()))
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div className="p-4 ">
      <div className="p-4 rounded-lg dark:border-gray-700 overflow-x-auto mt-14">
        <div className="p-4 rounded-lg shadow bg-white">
          <DataTable
            title="Transfer Summary List"
            columns={columns}
            data={filteredItems}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
            striped
            highlightOnHover
          />
        </div>
      </div>
    </div>
  );
}

export default TransferSummary;
