import { useContext, useState, useEffect } from "react";
import axios from "axios";

// context
import { DataContext } from "@/Home";

//components
import { Skeleton } from "@/components/ui/skeleton";
import {
  XAxis,
  YAxis,
  Tooltip,
  Brush,
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const green = "#25ff1dbd";
const red = "#ff1d1dbd";
export default function Last90Days() {
  // context variable
  const { apiUrl, update, config, userData, userId } = useContext(DataContext);

  const [ninetyDaysData, setNinetyDaysData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const getData = async () => {
      try {
        const response = await axios.get(
          apiUrl + "/api/balance/last90days-expense-income-balance/" + userId,
          config
        );
        if (response.status === 200) {
          const data = response.data.data.map((item) => {
            return {
              ...item,
              date: item.date.split("T")[0].split("-")[2],
            };
          });

          setNinetyDaysData(data);

          // console.log("90 Days Data:", response.data.data)
          setLoading(false);
        } else if (response.status === 204) {
          setLoading(true);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getData();
  }, [userData, userId, update]);

  if (loading) {
    return <Skeleton className="w-[700px] h-[515px]"></Skeleton>;
  }
  return (
    <Card className="w-full h-full flex flex-col align-stretch justify-stretch">
      <CardHeader className="flex align-start justify-start">
        <CardTitle className="flex flex-row align-center justify-between">
          Last 30 Days
        </CardTitle>
        {/* <CardDescription className="flex align-start justify-start">Change the Category's Type, Color and Name</CardDescription> */}
      </CardHeader>
      <CardContent className="w-full h-full flex flex-col justify-center items-center">
        <ResponsiveContainer>
          <BarChart
            data={ninetyDaysData}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar type="monotone" dataKey="expense" stroke={red} fill={red} />
            <Bar type="monotone" dataKey="income" stroke={green} fill={green} />
            <Brush
              height={30}
              startIndex={60}
              dataKey="date"
              fill="#c9c9c9ce"
              stroke="c9c9c9b2"
            />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer>
          <AreaChart
            data={ninetyDaysData}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#838383"
              fill="#9494949d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
