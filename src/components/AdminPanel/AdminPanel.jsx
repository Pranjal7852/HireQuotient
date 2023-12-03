import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Box,
  Typography,
  TablePagination,
  createTheme,
  ThemeProvider,
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";
import EditIcon from "@mui/icons-material/Edit";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import "./AdminPanel.css";
const AdminPanel = () => {
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
      <TableRow
        key={row.id}
        hover
        role="checkbox"
        selected={isSelected(row.id)}
        aria-checked={isSelected(row.id)}
        className={isSelected(row.id) ? "selected-row" : ""}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected(row.id)}
            onChange={() => handleCheckboxChange(row.id)}
          />
        </TableCell>
        <TableCell>
          {editMode === row.id ? (
            <TextField
              value={row.name}
              onChange={(e) =>
                setData((prevData) =>
                  prevData.map((item) =>
                    item.id === row.id
                      ? { ...item, name: e.target.value }
                      : item
                  )
                )
              }
              onKeyPress={(e) => e.key === "Enter" && handleSave(row.id)}
            />
          ) : (
            row.name
          )}
        </TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.role}</TableCell>
        <TableCell>
          {editMode === row.id ? (
            <Box display="flex" gap={1}>
              <Button
                className="save-btn"
                onClick={() => handleSave(row.id)}
                variant="contained"
              >
                <SaveTwoToneIcon />
              </Button>

              <Button
                className="cancel-btn"
                onClick={() => setEditMode("")}
                variant="contained"
                color="secondary"
              >
                <CancelTwoToneIcon />
              </Button>
            </Box>
          ) : (
            <Box display="flex" gap={1}>
              <Button
                className="edit-btn"
                onClick={() => handleEdit(row.id)}
                variant="contained"
              >
                <EditIcon />
              </Button>
              <Button
                className="delete-btn"
                onClick={() => handleDelete(row.id)}
                variant="contained"
                color="error"
              >
                <DeleteOutlineTwoToneIcon />
              </Button>
            </Box>
          )}
        </TableCell>
      </TableRow>
    ));
  };

  const renderPagination = () => {
    return (
      <Box display="flex" justifyContent="flex-end" marginTop={2} gap={1}>
        <Button
          onClick={() => handlePageChange(null, 0)}
          variant="contained"
          disabled={currentPage === 0}
        >
          First Page
        </Button>
        <Button
          onClick={() => handlePageChange(null, currentPage - 1)}
          variant="contained"
          disabled={currentPage === 0}
        >
          Previous Page
        </Button>
        <Button
          onClick={() => handlePageChange(null, currentPage + 1)}
          variant="contained"
          disabled={
            currentPage === Math.ceil(filteredData.length / rowsPerPage) - 1
          }
        >
          Next Page
        </Button>
        <Button
          onClick={() =>
            handlePageChange(
              null,
              Math.ceil(filteredData.length / rowsPerPage) - 1
            )
          }
          variant="contained"
          disabled={
            currentPage === Math.ceil(filteredData.length / rowsPerPage) - 1
          }
        >
          Last Page
        </Button>
      </Box>
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <div className="main">
          <TextField
            className="text-field"
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            className="search-icon"
            onClick={handleSearch}
            variant="contained"
            color="primary"
          >
            <SearchTwoToneIcon />
          </Button>
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
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.length === filteredData.length}
                    onChange={() => handleCheckboxChange("all")}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
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

export default AdminPanel;
