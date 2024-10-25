import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

const GlobalProvider = ({ children }) => {
  const [croppedImageBase64, setCroppedImageBase64] = useState([]);

  return (
    <GlobalContext.Provider
      value={{ croppedImageBase64, setCroppedImageBase64 }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
