import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  createTheme,
  ThemeProvider,
  Button,
  Box,
  CssBaseline,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchComponent from "../../Atoms/SearchComponent/SearchComponent";
import TableComponent from "../../Compounds/TableComponent/TableComponent";
import PaginationComponent from "../../Atoms/PaginationComponent/PaginationComponent";
import "./AdminPanel.css";

export const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const pageSize = 10;

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    if (data.length > 0) {
      const filtered = data.filter((item) =>
        Object.values(item).some((val) =>
          val.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
      setCurrentPage(0);
    }
  }, [data, searchTerm]);

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(0);

    toast.success("Search successful");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleCheckboxChange = (id) => {
    if (id === "all") {
      // Toggle selection of all displayed rows
      const allDisplayedRowsSelected =
        selectedRows.length ===
        filteredData.slice(
          currentPage * rowsPerPage,
          (currentPage + 1) * rowsPerPage
        ).length;

      const newSelectedRows = allDisplayedRowsSelected
        ? selectedRows.filter(
            (selectedId) =>
              !filteredData
                .slice(
                  currentPage * rowsPerPage,
                  (currentPage + 1) * rowsPerPage
                )
                .some((row) => row.id === selectedId)
          )
        : [
            ...selectedRows,
            ...filteredData
              .slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
              .map((row) => row.id),
          ];

      setSelectedRows(newSelectedRows);
    } else {
      // Toggle selection of a specific row
      const selectedIndex = selectedRows.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedRows, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedRows.slice(1));
      } else if (selectedIndex === selectedRows.length - 1) {
        newSelected = newSelected.concat(selectedRows.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedRows.slice(0, selectedIndex),
          selectedRows.slice(selectedIndex + 1)
        );
      }

      setSelectedRows(newSelected);
    }
  };
  const handleEdit = (id) => {
    setEditMode(id);
  };

  const handleSave = (id) => {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, name: item.name.toUpperCase() } : item
    );

    setData(updatedData);
    setEditMode("");

    toast.success("Data saved successfully");
  };

  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);

    setData(newData);
    setEditMode("");
    toast.error("Data deleted successfully");
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  const handleDeleteSelected = () => {
    const newData = data.filter((item) => !selectedRows.includes(item.id));

    setData(newData);
    setSelectedRows([]);

    toast.error("Selected Rows deleted successfully");
  };
  const renderTableRows = () => {
    const startIdx = currentPage * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    const currentRows = filteredData.slice(startIdx, endIdx);

    return currentRows.map((row) => (
      <TableComponent
        key={row.id}
        row={row}
        isSelected={isSelected}
        handleCheckboxChange={handleCheckboxChange}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleSave={handleSave}
        editMode={editMode}
        setData={setData}
      />
    ));
  };
  const renderPagination = () => {
    return (
      <PaginationComponent
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        filteredData={filteredData}
        rowsPerPage={rowsPerPage}
      />
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <div className="main" gap={1}>
          <SearchComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleKeyPress={handleKeyPress}
            handleSearch={handleSearch}
          />
          <Button
            onClick={handleDeleteSelected}
            variant="contained"
            color="error"
          >
            <DeleteSweepTwoToneIcon />
          </Button>
          <Button onClick={() => setDarkMode(!darkMode)} variant="contained">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>{/* ... (table header cells) */}</TableRow>
            </TableHead>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </TableContainer>
        {renderPagination()}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
      <ToastContainer position="bottom-left" />
    </ThemeProvider>
  );
};
