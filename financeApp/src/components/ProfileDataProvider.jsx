import {
  createContext,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from "react";
import axios from "axios";

export const ProfileDataContext = createContext();

export function ProfileDataProvider({ children, ...props }) {
  const [update, setUpdate] = useState(false);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mainLoading, setMainLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [currency, setCurrency] = useState({
    code: "USD",
    symbol: "$",
    name: "United States Dollar",
  });
  const [dims, setDims] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const mode = import.meta.env.VITE_MODE;
  const apiUrl =
    mode === "production"
      ? import.meta.env.VITE_API_URL_PROD
      : import.meta.env.VITE_API_URL_DEV;
  const cfAuth = {
    clientId: import.meta.env.VITE_PUBLIC_CF_Access_Client_Id,
    clientSecret: import.meta.env.VITE_PUBLIC_CF_Access_Client_Secret,
  };

  function getStorageVariables() {
    const storedToken = localStorage.getItem("FinanceMadaniLabBearerToken");
    setToken(`Bearer ${storedToken}`);
    setUserId(localStorage.getItem("FinanceMadaniLabUserId"));
  }
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const config = token
    ? {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "X-User-Timezone": userTimeZone,
          "CF-Access-Client-Id": cfAuth.clientId,
          "CF-Access-Client-Secret": cfAuth.clientSecret,
        },
      }
    : null;

  useLayoutEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("FinanceMadaniLabBearerToken");
      const storedUserId = localStorage.getItem("FinanceMadaniLabUserId");

      if (storedToken && storedUserId) {
        setToken("Bearer " + storedToken);
        setUserId(storedUserId);

        try {
          const response = await axios.get(
            apiUrl + "/auth/authenticated/" + storedUserId,
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
          setMainLoading(false);
        } catch (error) {
          setIsAuthenticated(false);
          console.log(error);
        }
      } else {
        setIsAuthenticated(false);
        console.log("Missing token");
      }
    };

    checkAuth();
  }, [update]);

  useEffect(() => {
    async function getProfileData(userId) {
      try {
        if (token && userId) {
          const response = await axios.get(
            apiUrl + `/api/profile/read-profile/${userId}`,
            config
          );
          setUserData(response.data.data);
          setCurrency(response.data.data.currency);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getProfileData(userId);

    // setLocalDate(userTimeZone)
  }, [userId]);

  useEffect(() => {
    getStorageVariables();

    const handleResize = () => {
      setDims({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ProfileDataContext.Provider
      {...props}
      value={{
        token,
        setToken,
        userId,
        setUserId,
        userData,
        apiUrl,
        config,
        isAuthenticated,
        setIsAuthenticated,
        mainLoading,
        update,
        setUpdate,
        setUserData,
        dialogIsOpen,
        setDialogIsOpen,
        setCurrency,
        currency,
        dims,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
}

export const useProfile = () => {
  const profileContext = useContext(ProfileDataContext);

  if (profileContext === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return profileContext;
};
