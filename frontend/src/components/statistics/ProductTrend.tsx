import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useProductTrendContext } from "../../contexts/ProductTrendContext";

export default function ProductTrend() {
  const { productTrend } = useProductTrendContext();
  return productTrend.length > 0 ? (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Rank</b>
            </TableCell>
            <TableCell>
              <b>Journey ID</b>
            </TableCell>
            <TableCell>
              <b>Number of Sales</b>
            </TableCell>
            <TableCell>
              <b>Journey Name</b>
            </TableCell>
            <TableCell>
              <b>Journey Duration (day)</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productTrend.map(({ id, name, count, duration }, index) => (
            <TableRow key={id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{id}</TableCell>
              <TableCell>{count}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Typography>No region selected yet</Typography>
  );
}
