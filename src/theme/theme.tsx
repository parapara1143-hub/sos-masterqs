"use client";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useUI } from "@/src/store/useUI";
export function SafeINThemeProvider({ children }:{children:React.ReactNode}){
  const { dark } = useUI();
  const theme = createTheme({
    palette:{ mode: dark? "dark":"light", primary:{main:"#005DFF"}, secondary:{main:"#00C851"} },
    shape:{ borderRadius:12 },
    typography:{ fontFamily:"Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }
  });
  return <ThemeProvider theme={theme}><CssBaseline/>{children}</ThemeProvider>;
}
