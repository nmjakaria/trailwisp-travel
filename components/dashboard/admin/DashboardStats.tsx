"use client";

import React, { useEffect, useState, transition } from "react";
import { Card, Tabs, Spinner } from "@heroui/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { getAdminStats, AdminStatsData } from "@/lib/api/stats";

const COLOR_PALETTE = ["#0d9488", "#f97316", "#3b82f6", "#ec4899", "#8b5cf6", "#10b981"];

export function DashboardStats() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calling the Server Action directly from the client component inside a transition
    getAdminStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not retrieve admin metrics. Make sure you are logged in as an administrator.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Spinner color="primary" label="Assembling backend analytics..." size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <Card className="p-8 border border-rose-200 dark:border-rose-950/30 bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error || "Something went wrong."}</p>
        </Card>
      </div>
    );
  }

  const { totals, bookingsOverTime, categoryDistribution, topDestinations } = stats;

  const metricCards = [
    { title: "Total Users", value: totals.totalUsers.toLocaleString() },
    { title: "Mapped Destinations", value: totals.totalPlaces.toLocaleString() },
    { title: "Bookings Handled", value: totals.totalBookings.toLocaleString() },
    { title: "Stories Logged", value: totals.totalStories.toLocaleString() },
    { title: "Comments Posted", value: totals.totalComments.toLocaleString() },
  ];

  const lineChartData = bookingsOverTime.map(item => ({
    date: item._id, 
    Bookings: item.count
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">Operational Metrics</h1>
        <p className="text-sm text-zinc-500 mt-1">Live metrics compiled securely via Server Actions.</p>
      </div>

      {/* Dynamic Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((card, i) => (
          <Card 
            key={i} 
            className="p-5 border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl"
          >
            <Card.Header className="p-0 pb-1">
              <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">{card.title}</span>
            </Card.Header>
            <Card.Content className="p-0 mt-1">
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                {card.value}
              </h3>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Charts Layout Card */}
      <Card className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-100 dark:shadow-none">
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={(key) => setActiveTab(key as string)}
          variant="secondary"
        >
          <Tabs.ListContainer className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <Tabs.List aria-label="Database breakdown toggles" className="gap-6">
              <Tabs.Tab 
                id="bookings" 
                className="max-w-fit px-0 h-10 text-sm font-bold text-zinc-500 dark:text-zinc-400 data-[selected=true]:text-teal-500 dark:data-[selected=true]:text-teal-400 transition-colors cursor-pointer relative"
              >
                Booking Velocity
                <Tabs.Indicator className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-500" />
              </Tabs.Tab>
              <Tabs.Tab 
                id="categories" 
                className="max-w-fit px-0 h-10 text-sm font-bold text-zinc-500 dark:text-zinc-400 data-[selected=true]:text-teal-500 dark:data-[selected=true]:text-teal-400 transition-colors cursor-pointer relative"
              >
                Categories & High-Performing Places
                <Tabs.Indicator className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-500" />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          {/* Panel A: Booking Trends over Time */}
          <Tabs.Panel id="bookings" className="pt-8">
            <div className="h-[350px] w-full">
              {lineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                    <XAxis dataKey="date" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgb(24 24 27)", 
                        borderRadius: "12px", 
                        borderColor: "rgb(39 39 42)", 
                        color: "white" 
                      }} 
                    />
                    <Area type="monotone" dataKey="Bookings" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBookings)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center py-20 text-zinc-400 text-sm">No historical booking sequences found yet.</p>
              )}
            </div>
          </Tabs.Panel>

          {/* Panel B: Categories & High Performing Places */}
          <Tabs.Panel id="categories" className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Top Destinations */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Top Rated Spots</h4>
                <div className="h-[250px] w-full">
                  {topDestinations.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topDestinations} layout="vertical" margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                        <XAxis type="number" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="title" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} width={80} />
                        <Tooltip contentStyle={{ backgroundColor: "rgb(24 24 27)", borderRadius: "12px", color: "white" }} />
                        <Bar dataKey="bookings" fill="#f97316" name="Total Bookings" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center py-20 text-zinc-400 text-sm">Waiting for booking operations...</p>
                  )}
                </div>
              </div>

              {/* Category Share */}
              <div className="space-y-4 flex flex-col items-center">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest self-start">Category Share</h4>
                <div className="h-[250px] w-full flex items-center justify-center">
                  {categoryDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          dataKey="count"
                          nameKey="_id"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "rgb(24 24 27)", borderRadius: "12px", color: "white" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center py-20 text-zinc-400 text-sm">No defined categories logged yet.</p>
                  )}
                </div>
              </div>

            </div>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </div>
  );
}