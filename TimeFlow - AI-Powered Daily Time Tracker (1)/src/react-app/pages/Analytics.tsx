import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Activity as ActivityIcon,
  TrendingUp,
  Sparkles,
  Award,
  Target,
  Zap,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DayAnalytics } from "@/shared/types";

const CATEGORY_COLORS_MAP = {
  Work: "#3b82f6",
  Study: "#a855f7",
  Sleep: "#6366f1",
  Exercise: "#22c55e",
  Entertainment: "#ec4899",
};

const CATEGORY_EMOJIS = {
  Work: "💼",
  Study: "📚",
  Sleep: "😴",
  Exercise: "💪",
  Entertainment: "🎮",
};

const BACKGROUND_EMOJIS = ["📊", "📈", "✨", "🎯", "🏆", "💡", "⚡", "🌟"];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [analytics, setAnalytics] = useState<DayAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDate]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pieData = analytics?.categories.map((cat) => ({
    name: cat.category,
    value: cat.total_minutes,
    color: CATEGORY_COLORS_MAP[cat.category as keyof typeof CATEGORY_COLORS_MAP],
  })) || [];

  const barData = analytics?.activities.map((activity) => ({
    name: activity.activity_name.length > 20 
      ? activity.activity_name.substring(0, 20) + "..." 
      : activity.activity_name,
    minutes: activity.duration_minutes,
    category: activity.category,
  })) || [];

  const totalHours = analytics ? Math.floor(analytics.total_minutes / 60) : 0;
  const remainingMinutes = analytics ? analytics.total_minutes % 60 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Clock className="w-10 h-10 text-white" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen p-4 relative overflow-hidden">
        {/* Floating Background Emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {BACKGROUND_EMOJIS.map((emoji, index) => (
            <div
              key={index}
              className="emoji-float absolute"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${index * 3}s`,
                animationDuration: `${20 + Math.random() * 10}s`,
                fontSize: `${1.5 + Math.random() * 1.5}rem`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="glass rounded-3xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => navigate("/activity")}
                className="flex items-center space-x-3 text-white hover:text-white/80 transition-colors font-semibold"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="text-lg">Back to Activities</span>
              </button>

              <div className="flex items-center space-x-2 glass-card px-5 py-3 rounded-xl shadow-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-900 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* No Data State */}
          <div className="glass-card rounded-3xl p-20 text-center shadow-2xl">
            <div className="max-w-md mx-auto space-y-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <span className="text-6xl">📊</span>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <span className="text-3xl">✨</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                  No Data Available
                </h2>
                <p className="text-gray-600 text-xl leading-relaxed">
                  You haven't tracked any activities for{" "}
                  <span className="font-bold text-purple-600">
                    {format(new Date(selectedDate), "MMMM d, yyyy")}
                  </span>
                  {" "}yet. 📅
                </p>
              </div>

              <button
                onClick={() => navigate("/activity")}
                className="gradient-primary text-white font-bold py-5 px-10 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-3 text-lg"
              >
                <ActivityIcon className="w-6 h-6" />
                <span>Start Logging Activities 🚀</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20 relative overflow-hidden">
      {/* Floating Background Emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {BACKGROUND_EMOJIS.map((emoji, index) => (
          <div
            key={index}
            className="emoji-float absolute"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 3}s`,
              animationDuration: `${20 + Math.random() * 10}s`,
              fontSize: `${1.2 + Math.random() * 1}rem`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="glass rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => navigate("/activity")}
              className="flex items-center space-x-3 text-white hover:text-white/80 transition-colors font-semibold"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg">Back to Activities</span>
            </button>

            <div className="flex items-center space-x-2 glass-card px-5 py-3 rounded-xl shadow-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-900 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-5xl">📊</span>
            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
              Daily Analytics
            </h1>
            <span className="text-5xl">✨</span>
          </div>
          <p className="text-xl text-white/90 drop-shadow-md">
            {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-8 space-y-4 hover:shadow-2xl transition-all animate-slide-up relative overflow-hidden transform hover:scale-105">
            <div className="absolute top-0 right-0 text-6xl opacity-10 transform rotate-12">⏰</div>
            <div className="flex items-center justify-between relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Total Time</p>
              <p className="text-4xl font-extrabold text-gray-900">
                {totalHours}h {remainingMinutes}m
              </p>
              <p className="text-sm text-gray-500 mt-1">Time tracked today 📊</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4 hover:shadow-2xl transition-all animate-slide-up relative overflow-hidden transform hover:scale-105" style={{ animationDelay: "50ms" }}>
            <div className="absolute top-0 right-0 text-6xl opacity-10 transform rotate-12">📝</div>
            <div className="flex items-center justify-between relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl">
                <ActivityIcon className="w-8 h-8 text-white" />
              </div>
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Activities</p>
              <p className="text-4xl font-extrabold text-gray-900">
                {analytics.activity_count}
              </p>
              <p className="text-sm text-gray-500 mt-1">Tasks completed ✅</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4 hover:shadow-2xl transition-all animate-slide-up relative overflow-hidden transform hover:scale-105" style={{ animationDelay: "100ms" }}>
            <div className="absolute top-0 right-0 text-6xl opacity-10 transform rotate-12">🎯</div>
            <div className="flex items-center justify-between relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Categories</p>
              <p className="text-4xl font-extrabold text-gray-900">
                {analytics.categories.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Different types 🏷️</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="glass-card rounded-3xl p-8 space-y-6 animate-slide-up shadow-2xl" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🥧</span>
              <h3 className="text-2xl font-extrabold text-gray-900">Time Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={3}
                  stroke="#fff"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value} min`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    padding: '12px 16px',
                    fontWeight: '600',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="glass-card rounded-3xl p-8 space-y-6 animate-slide-up shadow-2xl" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📊</span>
              <h3 className="text-2xl font-extrabold text-gray-900">Activity Durations</h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fontWeight: 600 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  formatter={(value: number) => `${value} min`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    padding: '12px 16px',
                    fontWeight: '600',
                  }}
                />
                <Bar 
                  dataKey="minutes" 
                  fill="url(#colorGradient)"
                  radius={[12, 12, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card rounded-3xl p-8 space-y-8 animate-slide-up shadow-2xl" style={{ animationDelay: "250ms" }}>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🏷️</span>
            <h3 className="text-2xl font-extrabold text-gray-900">Category Breakdown</h3>
          </div>
          <div className="space-y-6">
            {analytics.categories.map((cat) => {
              const percentage = (cat.total_minutes / analytics.total_minutes) * 100;
              const hours = Math.floor(cat.total_minutes / 60);
              const mins = cat.total_minutes % 60;
              
              return (
                <div key={cat.category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">
                        {CATEGORY_EMOJIS[cat.category as keyof typeof CATEGORY_EMOJIS]}
                      </div>
                      <div>
                        <span className="font-extrabold text-gray-900 text-xl">{cat.category}</span>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <span className="font-semibold">
                            {cat.activity_count} {cat.activity_count === 1 ? "activity" : "activities"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-gray-900 text-2xl block">
                        {hours}h {mins}m
                      </span>
                      <span className="text-sm text-gray-500 font-semibold">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-lg"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: CATEGORY_COLORS_MAP[cat.category as keyof typeof CATEGORY_COLORS_MAP],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 border-2 border-purple-200 animate-slide-up shadow-2xl relative overflow-hidden" style={{ animationDelay: "300ms" }}>
          <div className="absolute top-0 right-0 text-8xl opacity-10 transform rotate-12">🤖</div>
          <div className="flex items-start space-x-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-xl animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-extrabold text-gray-900">AI Insights</h3>
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="space-y-3 text-gray-700 text-lg leading-relaxed">
                {analytics.total_minutes === 1440 ? (
                  <p className="flex items-start space-x-2">
                    <span className="text-2xl">🎉</span>
                    <span><strong>Perfect!</strong> You've tracked a full 24-hour day. Great job maintaining comprehensive time awareness!</span>
                  </p>
                ) : analytics.total_minutes > 1440 ? (
                  <p className="flex items-start space-x-2">
                    <span className="text-2xl">⚠️</span>
                    <span><strong>Heads up!</strong> You've logged more than 24 hours. Consider reviewing your entries for any overlaps or errors.</span>
                  </p>
                ) : (
                  <p className="flex items-start space-x-2">
                    <span className="text-2xl">📊</span>
                    <span>You've tracked <strong>{Math.round((analytics.total_minutes / 1440) * 100)}%</strong> of your day. Keep logging to get more comprehensive insights!</span>
                  </p>
                )}
                
                {analytics.categories.length > 0 && (
                  <p className="flex items-start space-x-2">
                    <span className="text-2xl">💡</span>
                    <span>
                      Your most time-intensive category today was{" "}
                      <strong className="text-purple-700">{analytics.categories[0].category}</strong> with{" "}
                      <strong>{Math.floor(analytics.categories[0].total_minutes / 60)}h{" "}
                      {analytics.categories[0].total_minutes % 60}m</strong> logged. {CATEGORY_EMOJIS[analytics.categories[0].category as keyof typeof CATEGORY_EMOJIS]}
                    </span>
                  </p>
                )}

                <div className="pt-4 flex items-center space-x-3">
                  <div className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-lg">
                    Keep up the great work! 🚀
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
