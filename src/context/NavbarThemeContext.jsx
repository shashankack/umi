import { createContext, useContext, useState } from "react";

const NavbarThemeContext = createContext();

export const NavbarThemeProvider = ({ children }) => {
  const [navbarTheme, setNavbarTheme] = useState("pink");

  return (
    <NavbarThemeContext.Provider value={{ navbarTheme, setNavbarTheme }}>
      {children}
    </NavbarThemeContext.Provider>
  );
};

export const useNavbarTheme = () => useContext(NavbarThemeContext);
