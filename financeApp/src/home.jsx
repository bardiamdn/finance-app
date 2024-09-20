import { useState, useEffect, useLayoutEffect, createContext } from "react";
import axios from "axios";
import "./Home.scss";

// components
import { AddTransaction } from "@/components/pages/transaction-dialog";
import TotalBalance from "./components/pages/TotalBalance";
import IncomeExpenseBalance from "./components/pages/IncomeExpense";
import AccountsAnalyticPie from "./components/pages/Accounts";
import Last90Days from "./components/pages/LastDays";
import History from "./components/pages/History";
import CategoryAnalytic from "./components/pages/CategoryAnalytics";
import IncomeSankey from "./components/pages/IncomeSankey";
import { CategoryLegend } from "@/components/pages/category-legend";

const mode = import.meta.env.VITE_MODE;
const apiUrl =
  mode === "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;
const cfAuth = {
  clientId: import.meta.env.VITE_PUBLIC_CF_Access_Client_Id,
  clientSecret: import.meta.env.VITE_PUBLIC_CF_Access_Client_Secret,
};

export const DataContext = createContext();

export default function Home() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [update, setUpdate] = useState(false); // updating the components
  const [loading, setLoading] = useState(true);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [dims, setDims] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const signOut = () => {
    localStorage.removeItem("FinanceMadaniLabBearerToken");
    localStorage.removeItem("FinanceMadaniLabUserId");
    setToken(null);
    setUserId(null);
    window.location.reload();
    return redirect("/login");
  };

  function getStorageVariables() {
    const storedToken = localStorage.getItem("FinanceMadaniLabBearerToken");
    setToken(`Bearer ${storedToken}`);
    setUserId(localStorage.getItem("FinanceMadaniLabUserId"));
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // console.log("User Time Zone", userTimeZone)
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
  async function getProfileData(userId) {
    try {
      if (token && userId) {
        const response = await axios.get(
          apiUrl + `/api/profile/read-profile/${userId}`,
          config
        );
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function getBalances() {
    try {
      const response = await axios.get(
        apiUrl + "/api/balance/timeframe-total-balance/" + userId,
        config
      );
      setBalanceData(response.data.balance);
      // console.log("BALANCE:", response.data.balance)
    } catch (error) {
      console.log(error);
    }
  }
  useLayoutEffect(() => {
    getStorageVariables();
    getProfileData(userId);

    // setLocalDate(userTimeZone)
  }, [token, userId]);

  useEffect(() => {
    setLoading(true);
    if (userData) {
      getBalances();
      setLoading(false);
    }
  }, [userData, update]);

  useEffect(() => {
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

  // console.log(userData)
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <DataContext.Provider
        value={{
          apiUrl,
          update,
          setUpdate,
          config,
          userData,
          setUserData,
          token,
          userId,
          balanceData,
          getBalances,
          getProfileData,
          dialogIsOpen,
          setDialogIsOpen,
          dims,
        }}
      >
        <div className="main">
          <div className="add-transaction">
            <AddTransaction />
          </div>
          <div className="top-section">
            <div className="total-balance">
              <TotalBalance />
            </div>
            <div className="income-expense-balance">
              <IncomeExpenseBalance />
            </div>
            <div className="account-analytic">
              <AccountsAnalyticPie />
            </div>
            <div className="last-days">
              <Last90Days />
            </div>
            <div className="category-legend">
              <CategoryLegend />
            </div>
          </div>
          <div className="bottom-section">
            <div className="category-analytic">
              <CategoryAnalytic />
            </div>
            <div className="sankey">
              <IncomeSankey />
            </div>
            <div className="history">
              <History />
            </div>
          </div>
        </div>
      </DataContext.Provider>
    </>
  );
}
