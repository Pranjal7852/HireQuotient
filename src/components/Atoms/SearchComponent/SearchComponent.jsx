import React from "react";
import { TextField, Button } from "@mui/material";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";

const SearchComponent = ({
  searchTerm,
  setSearchTerm,
  handleKeyPress,
  handleSearch,
}) => (
  <>
    <TextField
      className="text-field"
      label="Search"
      variant="outlined"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyPress={handleKeyPress}
      fullWidth
    />
    <Button
      className="search-icon"
      onClick={handleSearch}
      variant="contained"
      color="primary"
    >
      <SearchTwoToneIcon />
    </Button>
  </>
);

export default SearchComponent;
