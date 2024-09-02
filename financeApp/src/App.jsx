import { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
  Link,
  redirect,
} from "react-router-dom";

// Routes
import Home from "./home";
import Login from "./auth/login";
import Signup from "./auth/signup";

// icons
import { CiSettings } from "react-icons/ci";

//Shadcn
import { Button } from "./components/ui/button";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ProfileToggle } from "@/components/ui/profile-toggle";
import { ProfileDialog } from "@/components/pages/profile-dialog";

function App() {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const mode = import.meta.env.VITE_MODE;
  const apiUrl =
    mode === "production"
      ? import.meta.env.VITE_API_URL_PROD
      : import.meta.env.VITE_API_URL_DEV;
  const config = {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      "CF-Access-Client-Id": import.meta.env.VITE_PUBLIC_CF_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": import.meta.env
        .VITE_PUBLIC_CF_ACCESS_CLIENT_SECRET,
    },
  };

  useLayoutEffect(() => {
    const getBearerToken = async () => {
      const storedToken = localStorage.getItem("FinanceMadaniLabBearerToken");
      const userId = localStorage.getItem("FinanceMadaniLabUserId");

      if (storedToken) {
        setToken(storedToken);

        try {
          console.log("CONF: ", config);
          const response = await axios.get(
            apiUrl + "/auth/authenticated/" + userId,
            config
          );
          console.log(response);
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
          console.log(error);
        }
        // console.log('isAuthenticated: true',token); // it should change to isauthenticated to be secure

        // window.location.reload();
        return redirect("/home");
      } else {
        setIsAuthenticated(false);
        console.log("there is no stored token");
        return redirect("/login");
      }
    };
    getBearerToken();
  }, [token]);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="header">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
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
    </>
  );
}

export default App;
