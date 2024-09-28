import { useContext } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import "./App.css";

// Routes
import Home from "./Home";
import Login from "./auth/login";
import Signup from "./auth/signup";

//Shadcn
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ProfileDialog } from "@/components/pages/profile-dialog";
import { ProfileDataContext } from "./components/ProfileDataProvider";

function App() {
  const { mainLoading, isAuthenticated } = useContext(ProfileDataContext);

  if (mainLoading) {
    <div className="w-full h-full bg-white" />;
  }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="header">
        <h2 className="scroll-m-20 pb-2 lg:text-2xl font-semibold tracking-tight">
          <a href="https://finance.madanilab.site">MadaniLab Finance</a>
        </h2>
        {!isAuthenticated ? <ModeToggle /> : <ProfileDialog />}
      </div>

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
