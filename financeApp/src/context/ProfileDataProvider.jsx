import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const ProfileDataContext = createContext();

export function ProfileDataProvider({ children, ...props }) {
  const [update, setUpdate] = useState(false);
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

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-User-Timezone": userTimeZone,
    },
    withCredentials: true,
  }

  useEffect(() => {
    async function initializeProfile() {
      const profileId = Cookies.get("profile_id");
      if (profileId) {
        setUserId(profileId);
        try {
          const response = await axios.get(
            apiUrl + `/api/profile/read-profile/${profileId}`,
            config
          );
          setUserData(response.data.data);
          setCurrency(response.data.data.currency);
          console.log("UserData available", response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setUserData(null); // Reset userData on failure
        }
      } else {
        console.warn("Profile ID not found in cookies");
        setUserData(null);
      }
      setMainLoading(false);
    }

    const handleResize = () => {
      setDims({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    initializeProfile();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ProfileDataContext.Provider
      {...props}
      value={{
        userId,
        setUserId,
        userData,
        apiUrl,
        config,
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
