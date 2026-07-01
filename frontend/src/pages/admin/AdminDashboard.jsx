import React, { useState, useEffect, useRef } from 'react'
import { DollarSign, ShoppingBag, Users, Utensils, TrendingUp, AlertCircle, RefreshCw, X } from 'lucide-react'
import {
  MonthlyRevenueChart,
  OrdersChart,
  CategorySalesChart,
  TopProductsChart,
} from '../../components/AnalyticsCharts'

function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrderAlert, setRecentOrderAlert] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);

  const prevOrderCountRef = useRef(0);

  const fetchDashboardData = async (isPoll = false) => {
    try {
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const chartsRes = await fetch('/api/admin/charts', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (statsRes.ok && chartsRes.ok) {
        const statsData = await statsRes.json();
        const chartsData = await chartsRes.json();

        setStats(statsData);
        setCharts(chartsData);

        const currentCount = statsData.sales.totalOrders;

        if (isPoll && prevOrderCountRef.current > 0 && currentCount > prevOrderCountRef.current) {
          setRecentOrderAlert(true);
          setNewOrderCount((prev) => prev + (currentCount - prevOrderCountRef.current));
        }

        prevOrderCountRef.current = currentCount;
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isPoll) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const dismissAlert = () => {
    setRecentOrderAlert(false);
    setNewOrderCount(0);
  };

  if (loading || !stats || !charts) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-neutral-450 text-sm">Compiling smokehouse analytics...</p>
      </div>
    );
  }

  const salesCards = [
    { label: "Today's Sales", val: `$${stats.sales.todaySales.toFixed(2)}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Weekly Sales", val: `$${stats.sales.weeklySales.toFixed(2)}`, icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Monthly Sales", val: `$${stats.sales.monthlySales.toFixed(2)}`, icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Revenue", val: `$${stats.sales.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Orders", val: stats.sales.totalOrders, icon: ShoppingBag, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Customers", val: stats.sales.totalCustomers, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Menu Items", val: stats.sales.totalMenuItems, icon: Utensils, color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Dashboard</h1>
          <p className="text-xs text-neutral-400 mt-1">Real-time revenue metrics and product popularity ratings.</p>
        </div>
        <div className="flex items-center space-x-3">
          {newOrderCount > 0 && (
            <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
              {newOrderCount} New {newOrderCount === 1 ? 'Order' : 'Orders'}
            </span>
          )}
          <button
            onClick={() => fetchDashboardData()}
            className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {recentOrderAlert && (
        <div className="bg-primary/15 border border-primary/30 p-4 rounded-xl flex items-center justify-between text-white text-sm animate-fadeIn">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-primary animate-bounce flex-shrink-0" />
            <span>
              <strong className="font-bold">New Order Notice!</strong> A new order has arrived. Dashboard statistics updated.
            </span>
          </div>
          <button onClick={dismissAlert} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="space-y-2">
                <p className="text-xs font-bold text-neutral-450 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-black text-white">{card.val}</p>
              </div>
              <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Most Selling Product</h3>
          </div>
          {stats.productAnalytics.mostSelling ? (
            <div>
              <p className="text-lg font-bold text-white">{stats.productAnalytics.mostSelling.name}</p>
              <p className="text-xs text-neutral-450 mt-1">
                Qty Sold: <strong className="text-white">{stats.productAnalytics.mostSelling.quantity} units</strong> | Total Revenue: <strong className="text-primary">${stats.productAnalytics.mostSelling.revenue.toFixed(2)}</strong>
              </p>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">No records compiled yet.</p>
          )}
        </div>

        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 text-blue-500">
            <TrendingUp className="w-5 h-5 transform rotate-180" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Least Selling Product</h3>
          </div>
          {stats.productAnalytics.leastSelling ? (
            <div>
              <p className="text-lg font-bold text-white">{stats.productAnalytics.leastSelling.name}</p>
              <p className="text-xs text-neutral-450 mt-1">
                Qty Sold: <strong className="text-white">{stats.productAnalytics.leastSelling.quantity} units</strong> | Total Revenue: <strong className="text-primary">${stats.productAnalytics.leastSelling.revenue.toFixed(2)}</strong>
              </p>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">No records compiled yet.</p>
          )}
        </div>

        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 text-emerald-500">
            <ShoppingBag className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Quantity Summary</h3>
          </div>
          <div>
            <p className="text-2xl font-black text-white">{stats.productAnalytics.totalQuantitySold}</p>
            <p className="text-xs text-neutral-455 mt-1">Total items sold across all processed invoices.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4 shadow-md">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Monthly Revenue Trend</h3>
          <MonthlyRevenueChart data={charts.monthlyRevenue} />
        </div>

        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4 shadow-md">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Weekly Daily Orders</h3>
          <OrdersChart data={charts.dailyOrders} />
        </div>

        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4 shadow-md">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Top 5 Selling Items</h3>
          <TopProductsChart data={charts.topProducts} />
        </div>

        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4 shadow-md">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Sales Share by Category</h3>
          <CategorySalesChart data={charts.categorySales} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
