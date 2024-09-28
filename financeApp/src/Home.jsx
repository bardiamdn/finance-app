import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import "./Home.scss";
import { redirect } from "react-router-dom";

import { ProfileDataContext } from "./components/ProfileDataProvider";

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

export const BalanceContext = createContext();

export default function Home() {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token, userData, update, userId, isAuthenticated } =
    useContext(ProfileDataContext);

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

  async function getBalances() {
    try {
      const response = await axios.get(
        apiUrl + "/api/balance/timeframe-total-balance/" + userId,
        config
      );
      setBalanceData(response.data.balance);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (userData) {
      getBalances();
      setLoading(false);
    }
  }, [userData, update]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <BalanceContext.Provider
      value={{
        balanceData,
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
    </BalanceContext.Provider>
  );
}
