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
  Typography,
  TablePagination,
} from "@mui/material";
const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState("");

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
    // Check if data exists before filtering
    if (data.length > 0) {
      // Filter data based on search term
      const filtered = data.filter((item) =>
        Object.values(item).some((val) =>
          val.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);

      // Reset current page when filtering
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
  };

  const handleKeyPress = (e) => {
    // Trigger search logic when Enter key is pressed
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
  };

  const handleEdit = (row) => {
    // For simplicity, let's just create a copy of the row and update its name
    const updatedRow = { ...row, name: "Updated Name" };

    // Find the index of the row in the data array
    const dataIndex = data.findIndex((item) => item.id === row.id);

    // Create a copy of the data array
    const newData = [...data];

    // Replace the old row with the updated row
    newData[dataIndex] = updatedRow;

    // Update state with the new data
    setData(newData);

    // You can open a modal or perform other actions as needed
    console.log("Edit:", updatedRow);
  };

  const handleDelete = (id) => {
    // For simplicity, let's filter out the row with the specified ID
    const newData = data.filter((item) => item.id !== id);

    // Update state with the new data
    setData(newData);

    // You can show a confirmation dialog and perform other actions as needed
    console.log("Delete:", id);
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

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
            <>
              <Button onClick={() => handleSave(row.id)} variant="contained">
                Save
              </Button>
              <Button
                onClick={() => setEditMode("")}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleEdit(row.id)} variant="contained">
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(row.id)}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </>
          )}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <div>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress} // Added onKeyPress event for Enter key
        />
        <Button onClick={handleSearch} variant="contained" color="primary">
          Search
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
  );
};

export default AdminPanel;
