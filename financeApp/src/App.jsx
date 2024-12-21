import { useContext } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import "./App.css";

// Routes
import Home from "./Home";
import Login from "./auth/login";
import Signup from "./auth/signup";

//Shadcn
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ProfileDataContext } from "./components/ProfileDataProvider";
import Header from "./components/pages/Header";

function App() {
  const { mainLoading, isAuthenticated } = useContext(ProfileDataContext);


  if (mainLoading) {
    <div className="w-full h-full bg-white" />;
  }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        {isAuthenticated ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Navigate to="/home" />} />
            <Route path="/signup" element={<Navigate to="/home" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
