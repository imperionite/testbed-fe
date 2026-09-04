import { createTheme } from "@mui/material/styles";
import { components } from "./components";
import createPalette from "./palette";
// import {tokens} from "./tokens"
// import { typography } from "./typography";

export const createAppTheme = (mode) =>
  createTheme({
    palette: createPalette(mode),

    // typography: typography,
    // spacing: tokens,

    components,
  }); 