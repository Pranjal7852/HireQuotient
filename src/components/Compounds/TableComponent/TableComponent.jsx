import React from "react";
import {
  Checkbox,
  TableRow,
  TableCell,
  TextField,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";

const TableComponent = ({
  row,
  isSelected,
  handleCheckboxChange,
  handleEdit,
  handleDelete,
  handleSave,
  editMode,
  setData,
}) => (
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
                item.id === row.id ? { ...item, name: e.target.value } : item
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
            onClick={() => handleEdit("")}
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
);

export default TableComponent;
