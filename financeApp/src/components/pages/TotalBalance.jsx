import { useContext, useState, useEffect } from "react";

// context
import { BalanceContext } from "@/Home";
import { ProfileDataContext } from "../ProfileDataProvider";

//components
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TotalBalance() {
  // context variable
  const { update, userData } = useContext(ProfileDataContext);
  const { balanceData } = useContext(BalanceContext)

  // loading userData
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
    <Card className="w-full h-full flex flex-col align-stretch justify-stretch">
      <CardHeader className="flex align-start justify-start">
        <CardTitle className="flex flex-row align-center justify-between">
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full h-full flex justify-center items-center font-bold">
        {balanceData.totalBalance > 0 ? (
          <p
            className="lg:text-5xl lg:font-semibold text-3xl"
            style={{ color: "#25ff1dbd" }}
          >
            {balanceData.totalBalance.toLocaleString()}
          </p>
        ) : (
          <p
            className="lg:text-5xl lg:font-semibold text-3xl"
            style={{ color: "#ff1d1dbd" }}
          >
            {balanceData.totalBalance.toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
