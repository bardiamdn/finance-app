import { useContext, useState, useEffect } from "react";

// context
import { DataContext } from "@/Home";

//components
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TotalBalance() {
  // context variable
  const { update, userData, balanceData } = useContext(DataContext);
  // states
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
      <CardContent className="w-full h-full flex justify-center items-center font-semibold">
        {balanceData.totalBalance > 0 ? (
          <p style={{ fontSize: "40px", color: "#25ff1dbd" }}>
            {balanceData.totalBalance.toLocaleString()}
          </p>
        ) : (
          <p style={{ fontSize: "40px", color: "#ff1d1dbd" }}>
            {balanceData.totalBalance.toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
