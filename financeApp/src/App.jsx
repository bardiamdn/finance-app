import { useState, useLayoutEffect } from "react";
import axios from "axios";
import { Route, Navigate, Routes, redirect } from "react-router-dom";
import "./App.css";
import { ProfileDataProvider } from "./components/ProfileDataProvider";

// Routes
import Home from "./Home";
import Login from "./auth/login";
import Signup from "./auth/signup";

//Shadcn
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ProfileDialog } from "@/components/pages/profile-dialog";

function App() {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const mode = import.meta.env.VITE_MODE;
  const apiUrl =
    mode === "production"
      ? import.meta.env.VITE_API_URL_PROD
      : import.meta.env.VITE_API_URL_DEV;
  const cfAuth = {
    clientId: import.meta.env.VITE_PUBLIC_CF_Access_Client_Id,
    clientSecret: import.meta.env.VITE_PUBLIC_CF_Access_Client_Secret,
  };

  useLayoutEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("FinanceMadaniLabBearerToken");
      const userId = localStorage.getItem("FinanceMadaniLabUserId");

      if (storedToken) {
        setToken("Bearer " + storedToken);

        try {
          const response = await axios.get(
            apiUrl + "/auth/authenticated/" + userId,
            {
              headers: {
                authorization: "Bearer " + storedToken,
                "Content-Type": "application/json",
                "CF-Access-Client-Id": cfAuth.clientId,
                "CF-Access-Client-Secret": cfAuth.clientSecret,
              },
            }
          );
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
          console.log(error);
        }

        // window.location.reload();
        return redirect("/home");
      } else {
        setIsAuthenticated(false);
        console.log("Missing token");
        return redirect("/login");
      }
    };
    checkAuth();
  }, [token]);

  return (
    <>
      <ProfileDataProvider>
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
                isAuthenticated ? (
                  <Navigate to="/home" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/home"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
            />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/home" /> : <Signup />}
            />
          </Routes>
        </ThemeProvider>
      </ProfileDataProvider>
    </>
  );
}

export default App;
