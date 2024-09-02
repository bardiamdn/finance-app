import React, {
  useState,
  useEffect,
  useLayoutEffect,
  createContext,
} from "react";
import axios from "axios";
// import dotenv from 'dotenv'
//Shadcn
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

import "./home.css";

// components
import { AddTransaction } from "@/components/pages/transaction-dialog";
import { SidebarAccordion } from "@/components/pages/sidebar-accordion";
import {
  TotalBalance,
  IncomeExpenseBalance,
  Last90Days,
  AccountsAnalyticPie,
} from "@/components/pages/top-analytic";
import {
  History,
  CategoryAnalytic,
  IncomeSankey,
} from "@/components/pages/analytics";
import { CategoryLegend } from "@/components/pages/category-legend";

const mode = import.meta.env.VITE_MODE;
const apiUrl =
  mode === "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

export const DataContext = createContext();

const home = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [update, setUpdate] = useState(false); // updating the components
  const [loading, setLoading] = useState(true);

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
          "CF-Access-Client-Id": import.meta.env
            .VITE_PUBLIC_CF_ACCESS_CLIENT_ID,
          "CF-Access-Client-Secret": import.meta.env
            .VITE_PUBLIC_CF_ACCESS_CLIENT_SECRET,
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
      console.log("userData", userData);
      setLoading(false);
      console.log("balanceData from Home", balanceData);
    }
  }, [userData, update]);

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
        }}
      >
        <div className="main">
          {/* <div className="sidebar"> */}
          <div className="add-transaction">
            <AddTransaction />
          </div>
          {/* <div className="menu">
                        <SidebarAccordion />
                    </div> */}
          {/* </div> */}
          <div className="page">
            <div className="total-balance">
              <TotalBalance />
            </div>
            <div className="income-expense-balance">
              <IncomeExpenseBalance />
            </div>
            <div className="accounts-analytic">
              <AccountsAnalyticPie />
            </div>
            <div className="last-days">
              <Last90Days />
            </div>
            <div className="category-legend">
              <CategoryLegend />
            </div>
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
};

export default home;
