// Analytics dashboard page
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import { Loader2, Users, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import {
  getAnalyticsData,
  getPageViews,
  getActiveUsers,
  getActiveVisitors,
} from "@/lib/analytics";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DailyStats {
  id: string;
  date: string;
  pageViews: number;
  uniqueVisitors?: number;
  newVisitors: number;
  deviceTypes: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  countries: Record<string, number>;
  trafficSources: Record<string, number>;
}

interface PageViewData {
  path: string;
  count: number;
}

interface UserActivity {
  id: string;
  userId: string;
  email: string;
  lastActive: any;
  lastPage: string;
  activityCount: number;
  activities: Array<{
    pagePath: string;
    pageTitle: string;
    timestamp: any;
  }>;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [pageViews, setPageViews] = useState<PageViewData[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserActivity[]>([]);
  const [activeVisitors, setActiveVisitors] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, pageViewsData, usersData, visitorsCount] = await Promise.all([
          getAnalyticsData(period),
          getPageViews(100),
          getActiveUsers(),
          getActiveVisitors(),
        ]);

        setStats(statsData as DailyStats[]);
        setPageViews(pageViewsData as PageViewData[]);
        setActiveUsers(usersData as UserActivity[]);
        setActiveVisitors(visitorsCount);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh active visitors every 30 seconds
    const interval = setInterval(async () => {
      const count = await getActiveVisitors();
      setActiveVisitors(count);
    }, 30000);

    return () => clearInterval(interval);
  }, [period]);

  // Calculate totals
  const totals = stats.reduce(
    (acc, stat) => ({
      pageViews: acc.pageViews + (stat.pageViews || 0),
      newVisitors: acc.newVisitors + (stat.newVisitors || 0),
      uniqueVisitors: acc.uniqueVisitors + (stat.uniqueVisitors || 0),
    }),
    { pageViews: 0, newVisitors: 0, uniqueVisitors: 0 }
  );

  const returningVisitors = totals.uniqueVisitors - totals.newVisitors;

  // Aggregate device types
  const deviceTypes = stats.reduce(
    (acc, stat) => ({
      desktop: acc.desktop + (stat.deviceTypes?.desktop || 0),
      tablet: acc.tablet + (stat.deviceTypes?.tablet || 0),
      mobile: acc.mobile + (stat.deviceTypes?.mobile || 0),
    }),
    { desktop: 0, tablet: 0, mobile: 0 }
  );

  // Aggregate countries
  const countries = stats.reduce((acc, stat) => {
    Object.entries(stat.countries || {}).forEach(([country, count]) => {
      acc[country] = (acc[country] || 0) + (count as number);
    });
    return acc;
  }, {} as Record<string, number>);

  const topCountries = Object.entries(countries)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Aggregate traffic sources
  const trafficSources = stats.reduce((acc, stat) => {
    Object.entries(stat.trafficSources || {}).forEach(([source, count]) => {
      acc[source] = (acc[source] || 0) + (count as number);
    });
    return acc;
  }, {} as Record<string, number>);

  const topSources = Object.entries(trafficSources)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Prepare chart data
  const chartData = stats
    .slice()
    .reverse()
    .map((stat) => ({
      date: format(parseISO(stat.date), period === "daily" ? "MMM dd" : "MMM dd, yyyy"),
      pageViews: stat.pageViews || 0,
      visitors: stat.uniqueVisitors || 0,
      new: stat.newVisitors || 0,
      returning: (stat.uniqueVisitors || 0) - (stat.newVisitors || 0),
    }));

  const deviceChartData = [
    { name: "Desktop", value: deviceTypes.desktop },
    { name: "Tablet", value: deviceTypes.tablet },
    { name: "Mobile", value: deviceTypes.mobile },
  ].filter((item) => item.value > 0);

  const visitorTypeData = [
    { name: "New Visitors", value: totals.newVisitors },
    { name: "Returning Visitors", value: Math.max(0, returningVisitors) },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Analytics & Visitors</h1>
        <p className="text-muted-foreground mt-2">
          Track website visitors, page views, and user engagement
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.uniqueVisitors || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {period === "daily" ? "Last 24 hours" : period === "weekly" ? "Last 7 days" : "Last 30 days"}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.pageViews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total page views
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (Real-time)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVisitors}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active in last 5 minutes
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logged-in Users</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Authenticated users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Time Period</CardTitle>
          <CardDescription>Select the time range for analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={period} onValueChange={(value) => setPeriod(value as "daily" | "weekly" | "monthly")}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Visitors Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Visitors Over Time</CardTitle>
            <CardDescription>Total visitors by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                visitors: {
                  label: "Visitors",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="var(--color-visitors)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Page Views Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views Over Time</CardTitle>
            <CardDescription>Total page views by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                pageViews: {
                  label: "Page Views",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="pageViews" fill="var(--color-pageViews)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* New vs Returning Visitors */}
        <Card>
          <CardHeader>
            <CardTitle>New vs Returning Visitors</CardTitle>
            <CardDescription>Visitor type breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                new: {
                  label: "New Visitors",
                  color: "hsl(var(--chart-3))",
                },
                returning: {
                  label: "Returning Visitors",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={visitorTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {visitorTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>Distribution by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                desktop: {
                  label: "Desktop",
                  color: "hsl(var(--chart-1))",
                },
                tablet: {
                  label: "Tablet",
                  color: "hsl(var(--chart-2))",
                },
                mobile: {
                  label: "Mobile",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={deviceChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>Most viewed pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pageViews.length > 0 ? (
              <ChartContainer
                config={{
                  views: {
                    label: "Page Views",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={pageViews.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="path" type="category" width={200} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-views)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No page view data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Visitors by country</CardDescription>
          </CardHeader>
          <CardContent>
            {topCountries.length > 0 ? (
              <ChartContainer
                config={{
                  visitors: {
                    label: "Visitors",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={topCountries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-visitors)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No country data available</p>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            {topSources.length > 0 ? (
              <ChartContainer
                config={{
                  visitors: {
                    label: "Visitors",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={topSources}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-visitors)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No traffic source data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Logged-in Users */}
      <Card>
        <CardHeader>
          <CardTitle>Logged-in Users</CardTitle>
          <CardDescription>Authenticated users and their activity</CardDescription>
        </CardHeader>
        <CardContent>
          {activeUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Last Page</TableHead>
                  <TableHead>Activity Count</TableHead>
                  <TableHead>Recent Pages</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {user.lastActive
                        ? format(
                            user.lastActive.toDate
                              ? user.lastActive.toDate()
                              : parseISO(user.lastActive),
                            "MMM dd, yyyy HH:mm"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.lastPage || "N/A"}</Badge>
                    </TableCell>
                    <TableCell>{user.activityCount || 0}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.activities?.slice(-3).map((activity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {activity.pagePath}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No logged-in users data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

