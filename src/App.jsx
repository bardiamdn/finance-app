import { useContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

// Routes
import Home from "./Home";

//Shadcn
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ProfileDataContext } from "./context/ProfileDataProvider";
import Header from "./components/Header";

function App() {
  const { mainLoading } = useContext(ProfileDataContext);
  const [cautionDown, setCautionDown] = useState(true);


  if (mainLoading) {
    <div className="w-full h-full bg-white" />;
  }
  return (
    <>
      <div className={`z-10 fixed top-0 left-0 w-full md:h-[60px] h-[100px] bg-red-500 ${cautionDown ? "" : "-translate-y-full"} transition-all duration-300`}>
        <span className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-sm text-center">⚠️ <strong>Important Notice:</strong> This is a development/testing site and not a finalized product. Data entered here may be lost or deleted without notice. Please do not submit any sensitive or personal information.</span>
        <button onClick={() => setCautionDown(false)} className="absolute top-1/2 right-0 transform -translate-x-full -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div >
      <div className={`mainWrapper ${cautionDown ? "md:mt-[60px] mt-[100px]" : "mt-0"} transition-all duration-300`}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">


          <Header />

          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
