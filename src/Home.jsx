import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import "./Home.scss";

import { ProfileDataContext } from "./context/ProfileDataProvider";

// components
import { AddTransaction } from "@/components/transaction-dialog";
import TotalBalance from "./components/TotalBalance";
import IncomeExpenseBalance from "./components/IncomeExpense";
import AccountsAnalyticPie from "./components/Accounts";
import Last90Days from "./components/LastDays";
import History from "./components/History";
import CategoryAnalytic from "./components/CategoryAnalytics";
// import IncomeSankey from "./components/IncomeSankey";
import { CategoryLegend } from "@/components/category-legend";

const mode = import.meta.env.VITE_MODE;
const apiUrl =
  mode === "production"
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_DEV;

export const BalanceContext = createContext();

export default function Home() {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userData, update, userId, config } =
    useContext(ProfileDataContext);

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
    } else {
      console.log("user data unavailable")
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
          {/* <div className="sankey">
            <IncomeSankey />
          </div> */}
          <div className="history">
            <History />
          </div>
        </div>
      </div>
    </BalanceContext.Provider>
  );
}
