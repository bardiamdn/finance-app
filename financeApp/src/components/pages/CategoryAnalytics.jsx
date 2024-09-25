import { useContext, useState, useEffect } from "react";
import axios from "axios";

// context
import { ProfileDataContext } from "../ProfileDataProvider";

//components
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryAnalytic() {
  // context variable
  const { apiUrl, update, config, userData, userId, balanceData, dims } =
    useContext(ProfileDataContext);

  let tempData = {};
  // states
  // loading userData
  const [loading, setLoading] = useState(true);
  const [pieDataIncome, setPieDataIncome] = useState(null);
  const [pieDataExpense, setPieDataExpense] = useState(null);
  const [barData, setBarData] = useState(null);
  const [period, setPeriod] = useState("this_month");

  const [temp, setTemp] = useState();

  async function getData(dataPeriod) {
    try {
      const response = await axios.get(
        `${apiUrl}/api/balance/category-analytic/${userId}?period=${dataPeriod}`,
        config
      );
      // console.log(`${apiUrl}/api/balance/category-analytic/${userId}?period=${dataPeriod}`, response.data);
      if (
        response.status === 200 &&
        userData.categories.length > 0 &&
        userData.accounts.length > 0 &&
        (response.data.pieData || response.data.barData)
      ) {
        let dataPieIncome = response.data.pieData.income;
        let dataPieExpense = response.data.pieData.expense;
        let dataBar = response.data.barData;
        // console.log("From Category Analytic", dataBar)
        userData.categories.map((category) => {
          tempData[category._id] = {
            color: category.categoryColor,
            title: category.categoryTitle,
          };
        });
        setTemp(tempData);
        // console.log("Temp from Category Analytic", tempData)
        // pie
        // (dataPieIncome && dataPieIncome.length > 0 ?
        dataPieIncome = dataPieIncome.map((category) => ({
          ...tempData[category.categoryId],
          ...category,
        }));
        // :
        // 	dataPieIncome = []
        // );
        // (dataPieExpense && dataPieExpense.length > 0 ?
        dataPieExpense = dataPieExpense.map((category) => ({
          ...tempData[category.categoryId],
          ...category,
        }));
        // :
        // 	dataPieExpense = []
        // );
        // for ( id of Object.keys(temp) ) {
        // 	if (dataBar.forEach())
        // }

        setBarData(dataBar);
        setPieDataIncome(dataPieExpense);
        setPieDataExpense(dataPieIncome);
        // dataPieIncome = []
        // dataPieExpense = []

        setLoading(false);
      } else if (response.status === 204) {
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // effect for loading the useData
  useEffect(() => {
    setLoading(true);
    getData(period);
    if (userData && balanceData) {
      setLoading(false);
    }
  }, [userData, update]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <Card className="w-full h-full flex flex-col">
      <div className=" flex flex-row justify-between items-center">
        <CardHeader className="w-[50%] flex items-start">
          <CardTitle>Category Analytics</CardTitle>
          {/* <p className="text-sm text-muted-foreground">Bars as gaps</p> */}
        </CardHeader>
        <Select
          onValueChange={(value) => {
            setPeriod(value);
            getData(value);
          }}
          defaultValue={period}
        >
          <SelectTrigger className="w-[130px] mr-[30px] hover:bg-accent">
            <SelectValue placeholder="Choose Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_3_months">Last 3 Months</SelectItem>
            <SelectItem value="last_6_months">Last 6 Months</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem disabled={true} value="max">
              Custom
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading && dims.width > 10 ? (
        <div className="flex lg:flex-row flex-col justify-between px-[40px]">
          <div className="ml-[55px]">
            <Skeleton className="lg:w-12/4 w-full lg:h-[350px]" />
          </div>
          <div className="flex flex-col">
            <Skeleton className="w-[160px] h-[160px] rounded-full mx-[15px] mb-[20px] mt-[8px]"></Skeleton>
            <Skeleton className="w-[160px] h-[160px] rounded-full mx-[15px]"></Skeleton>
          </div>
        </div>
      ) : (
        <CardContent className="flex flex-col lg:flex-row justify-center items-center w-full h-full">
          <div className="flex flex-row lg:flex-col w-full h-[60%] lg:w-[75%] lg:h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                // width={500}
                // height={300}
                data={barData}
                margin={
                  dims.width > 768 && {
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }
                }
              >
                <XAxis dataKey="gap" />
                {dims.width > 768 && <YAxis />}
                <Tooltip
                  labelFormatter={(keys, values) => {
                    values.forEach((value) => {
                      value.name = temp[value.dataKey].title;
                    });
                    return { keys: keys, values: values };
                  }}
                />
                {/* <Legend /> */}
                {userData.categories.length > 0 ? (
                  userData.categories.map((category, index) =>
                    category.categoryType === "expense" ? (
                      <Bar
                        key={index}
                        dataKey={category._id}
                        stackId="expense"
                        fill={category.categoryColor}
                      />
                    ) : category.categoryType === "income" ? (
                      <Bar
                        key={index}
                        dataKey={category._id}
                        stackId="income"
                        fill={category.categoryColor}
                      />
                    ) : (
                      <></>
                    )
                  )
                ) : (
                  <div />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-row lg:flex-col w-full h-[40%] lg:w-[25%] lg:h-[100%]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
              // width={200} height={200}
              >
                <Pie
                  data={pieDataExpense}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  // outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {pieDataExpense ? (
                    pieDataExpense.map((category, index) => (
                      <Cell key={category.categoryId} fill={category.color} />
                    ))
                  ) : (
                    <Skeleton></Skeleton>
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
              // width={200} height={200}
              >
                <Pie
                  data={pieDataIncome}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  // outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {pieDataIncome ? (
                    pieDataIncome.map((category, index) => (
                      <Cell key={category.categoryId} fill={category.color} />
                    ))
                  ) : (
                    <Skeleton></Skeleton>
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
