import React from "react";
import { Box, Button } from "@mui/material";

const PaginationComponent = ({
  currentPage,
  handlePageChange,
  filteredData,
  rowsPerPage,
}) => (
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
        handlePageChange(null, Math.ceil(filteredData.length / rowsPerPage) - 1)
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

export default PaginationComponent;
