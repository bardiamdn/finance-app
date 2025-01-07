import { useContext, useState, useEffect } from "react";
import axios from "axios";

// context
import { ProfileDataContext } from "../context/ProfileDataProvider";

//components
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveSankey } from "@nivo/sankey";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// colors
const green = "#25ff1dbd";
const red = "#ff1d1dbd";

export default function IncomeSankey() {
  // context variable
  const { apiUrl, update, config, userData, userId, dims } =
    useContext(ProfileDataContext);

  const [sankeyData, setSankeyData] = useState(null);
  const [period, setPeriod] = useState("this_month");
  const [loading, setLoading] = useState(true);

  async function getSankeyData(dataPeriod) {
    try {
      const result = await axios.get(
        apiUrl + "/api/balance/sankey/" + userId + `?period=${dataPeriod}`,
        config
      );

      if (
        result.status === 200 &&
        userData.accounts.length > 0 &&
        userData.categories.length > 0 &&
        result.data.sankeyData
      ) {
        let tempAccounts = {};
        userData.accounts.map((account) => {
          tempAccounts[account._id] = {
            color: account.accountColor,
            title: account.accountTitle,
          };
        });
        let tempCategories = {};
        userData.categories.map((category) => {
          tempCategories[category._id] = {
            color: category.categoryColor,
            title: category.categoryTitle,
          };
        });

        let nodes = [];
        let links = [];
        let outflowAmount = 0;
        let incomeAmount = 0;
        result.data.sankeyData.forEach((data) => {
          if (data.type === "initial" && tempAccounts[data.accountId]) {
            // accounts
            const amount = data.totalAmount;
            if (amount >= 0) {
              nodes.push({
                id: `${tempAccounts[data.accountId].title} (initial)`,
                nodeColor: tempAccounts[data.accountId].color,
              });
              links.push({
                source: `${tempAccounts[data.accountId].title} (initial)`,
                target: "Inflow",
                value: amount,
              });
            } else if (amount < 0) {
              if (
                nodes.map(
                  (node) =>
                    node.id === "Old Debts" &&
                    node.id !== tempAccounts[data.accountId].title
                )
              ) {
                nodes.push({
                  id: `${tempAccounts[data.accountId].title} (initial)`,
                  nodeColor: tempAccounts[data.accountId].color,
                });
                nodes.push({ id: "Old Debts", nodeColor: red });
                links.push({
                  source: "Inflow",
                  target: "Old Debts",
                  value: -amount,
                });
                links.push({
                  source: "Old Debts",
                  target: `${tempAccounts[data.accountId].title} (initial)`,
                  value: -amount,
                });
              } else if (nodes.map((node) => node.id === "Old Debts")) {
                links.push({
                  source: "Inflow",
                  target: "Old Debts",
                  value: -amount,
                });
                links.push({
                  source: "Old Debts",
                  target: `${tempAccounts[data.accountId].title} (initial)`,
                  value: -amount,
                });
              }
            }
          } else if (data.type === "final" && tempAccounts[data.accountId]) {
            // accounts
            const amount = data.totalAmount;
            if (amount >= 0) {
              nodes.push({
                id: tempAccounts[data.accountId].title,
                nodeColor: tempAccounts[data.accountId].color,
              });
              links.push({
                source: "Total Income",
                target: tempAccounts[data.accountId].title,
                value: amount,
              });
            } else if (amount < 0) {
              nodes.push({
                id: tempAccounts[data.accountId].title,
                nodeColor: tempAccounts[data.accountId].color,
              });
              nodes.push({ id: "Current Debts", nodeColor: red });

              links.push({
                source: tempAccounts[data.accountId].title,
                target: "Current Debts",
                value: amount,
              });
              links.push({
                source: "Current Debts",
                target: "Inflow",
                value: amount,
              });
            }
            incomeAmount += amount > 0 ? amount : -amount;
          } else if (
            data.type === "income" &&
            tempCategories[data.categoryId]
          ) {
            // categories
            const amount = data.totalAmount;
            nodes.push({
              id: tempCategories[data.categoryId].title,
              nodeColor: tempCategories[data.categoryId].color,
            });
            links.push({
              source: tempCategories[data.categoryId].title,
              target: "Inflow",
              value: amount,
            });
          } else if (
            data.type === "expense" &&
            tempCategories[data.categoryId]
          ) {
            // categories
            const amount = data.totalAmount;
            outflowAmount += amount > 0 ? amount : -amount;
            nodes.push({
              id: tempCategories[data.categoryId].title,
              nodeColor: tempCategories[data.categoryId].color,
            });
            links.push({
              source: "Outflow",
              target: tempCategories[data.categoryId].title,
              value: amount,
            });
          } else {
            console.log("type undefined");
          }
        });
        nodes.push(
          { id: "Inflow", nodeColor: green },
          { id: "Outflow", nodeColor: red },
          { id: "Total Income", nodeColor: green }
        );
        links.push(
          { source: "Inflow", target: "Outflow", value: outflowAmount },
          { source: "Inflow", target: "Total Income", value: incomeAmount }
        );
        setSankeyData({ nodes, links });
        // nodes = [];
        // links = [];
        setLoading(false);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const nodeThickness = Math.max(8, dims.width / 100);
  const nodeSpacing = Math.max(16, dims.width / 50);

  useEffect(() => {
    getSankeyData(period);
  }, [userData, update]);

  if (loading) {
    return <Skeleton className="w-full h-full"></Skeleton>;
  }
  return (
    <Card className=" w-full h-full flex flex-col align-stretch justify-stretch">
      <div className=" flex flex-row justify-between items-center">
        <CardHeader className=" w-[50%] flex items-start">
          <CardTitle>Cash Flow</CardTitle>
          {/* <CardDescription>
            Please use light mode for better quality of data
          </CardDescription> */}
        </CardHeader>
        <Select
          onValueChange={(value) => {
            setPeriod(value);
            getSankeyData(value);
          }}
          defaultValue={period}
        >
          <SelectTrigger className=" w-[130px] mt-[15px] mr-[30px] hover:bg-accent">
            <SelectValue placeholder="Choose Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_3_months">Last 3 Months</SelectItem>
            <SelectItem value="last_6_months">Last 6 Months</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="last_3_years">Last 3 Years</SelectItem>
            <SelectItem disabled={true} value="max">
              Custom
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <CardContent className=" flex justify-center items-center w-[100%] h-full">
        <ResponsiveSankey
          data={sankeyData}
          // margin={{ top: 40, right: 50, bottom: 40, left: 50 }}
          align="justify"
          // colors={{ scheme: 'category10' }}
          colors={(node) => node.nodeColor}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={nodeThickness}
          nodeSpacing={nodeSpacing}
          nodeBorderWidth={0}
          nodeBorderColor={{
            from: "color",
            modifiers: [["darker", 0.8]],
          }}
          nodeBorderRadius={2}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="vertical"
          labelPadding={16}
          borderColor={{ theme: "background" }}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1]],
          }}
          // legends={[
          // 	{
          // 		anchor: 'bottom-right',
          // 		direction: 'column',
          // 		translateX: 130,
          // 		itemWidth: 100,
          // 		itemHeight: 14,
          // 		itemDirection: 'right-to-left',
          // 		itemsSpacing: 2,
          // 		itemTextColor: '#999',
          // 		symbolSize: 14,
          // 		effects: [
          // 			{
          // 				on: 'hover',
          // 				style: {
          // 					itemTextColor: '#000'
          // 				}
          // 			}
          // 		]
          // 	}
          // ]}
          linkColor={(link) => link.source.nodeColor}
        />
      </CardContent>
    </Card>
  );
}
