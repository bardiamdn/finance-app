import { useContext, useState, useEffect } from "react";

// context
import { BalanceContext } from "@/Home";

//components
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileDataContext } from "../context/ProfileDataProvider";

export default function IncomeExpenseBalance() {
  // context variable
  const { update, userData, currency } = useContext(ProfileDataContext);
  const { balanceData } = useContext(BalanceContext);
  const [loading, setLoading] = useState(true);

  // effect for loading the useData
  useEffect(() => {
    setLoading(true);
    if (userData && balanceData) {
      setLoading(false);
    }
  }, [userData, balanceData, update]);

  if (loading) {
    return <Skeleton className="w-full h-full"></Skeleton>;
  }
  return (
    <Card className="w-full h-full flex flex-col items-center">
      <CardHeader className="w-full flex align-start justify-start">
        <CardTitle className="flex flex-row align-center justify-between">
          Income, Expense Balance
        </CardTitle>
        {/* <CardDescription className="flex align-start justify-start">Change the Category's Type, Color and Name</CardDescription> */}
      </CardHeader>
      <CardContent className="h-full w-full sm:w-[90%] flex flex-row justify-between items-center">
        <div className="w-[40%] flex flex-col justify-center items-center mr-10">
          <p
            className="font-semibold text-lg mb-5"
            style={{ color: "#25ff1dbd" }}
          >
            {balanceData.totalIncome.toLocaleString()} {currency.symbol}
          </p>
          <p className="font-semibold text-lg" style={{ color: "#ff1d1dbd" }}>
            {balanceData.totalExpense.toLocaleString()} {currency.symbol}
          </p>
        </div>
        <div className="w-[60%] h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                {
                  name: "balance",
                  expense: balanceData.totalExpense,
                  income: balanceData.totalIncome,
                },
              ]}
            >
              <Bar dataKey="expense" fill="#ff1d1dbd" />
              <Bar dataKey="income" fill="#25ff1dbd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
