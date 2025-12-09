import { useState, useEffect } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { format } from "date-fns";
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  BarChart3,
  Calendar,
  Sparkles,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";
import type { Activity, CreateActivity } from "@/shared/types";

const CATEGORIES = ["Work", "Study", "Sleep", "Exercise", "Entertainment"] as const;

const CATEGORY_COLORS = {
  Work: "from-blue-500 to-blue-600",
  Study: "from-purple-500 to-purple-600",
  Sleep: "from-indigo-500 to-indigo-600",
  Exercise: "from-green-500 to-green-600",
  Entertainment: "from-pink-500 to-pink-600",
};

const CATEGORY_BG = {
  Work: "bg-blue-50",
  Study: "bg-purple-50",
  Sleep: "bg-indigo-50",
  Exercise: "bg-green-50",
  Entertainment: "bg-pink-50",
};

const CATEGORY_EMOJIS = {
  Work: "💼",
  Study: "📚",
  Sleep: "😴",
  Exercise: "💪",
  Entertainment: "🎮",
};

const BACKGROUND_EMOJIS = ["⏰", "📊", "✨", "🎯", "🚀", "💡", "⚡", "🌟"];

export default function ActivityPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [activityName, setActivityName] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Work");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    fetchActivities();
  }, [selectedDate]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/activities/${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalMinutes = activities.reduce((sum, a) => sum + a.duration_minutes, 0);
  const remainingMinutes = 1440 - totalMinutes;
  const canAnalyze = activities.length > 0;
  const progressPercentage = (totalMinutes / 1440) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName || !duration) return;

    const activityData: CreateActivity = {
      activity_name: activityName,
      category,
      duration_minutes: parseInt(duration),
      activity_date: selectedDate,
    };

    try {
      if (editingId) {
        const response = await fetch(`/api/activities/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activityData),
        });
        if (response.ok) {
          await fetchActivities();
          resetForm();
        }
      } else {
        const response = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activityData),
        });
        if (response.ok) {
          await fetchActivities();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Failed to save activity:", error);
    }
  };

  const handleEdit = (activity: Activity) => {
    setActivityName(activity.activity_name);
    setCategory(activity.category as typeof CATEGORIES[number]);
    setDuration(activity.duration_minutes.toString());
    setEditingId(activity.id!);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchActivities();
      }
    } catch (error) {
      console.error("Failed to delete activity:", error);
    }
  };

  const resetForm = () => {
    setActivityName("");
    setCategory("Work");
    setDuration("");
    setEditingId(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
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

      {/* Sticky Header */}
      <div className="glass sticky top-0 z-50 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <span className="text-2xl">⏰</span>
              </div>
              <span className="text-white font-bold text-2xl drop-shadow-lg">TimeFlow</span>
            </div>

            <div className="flex items-center space-x-4 flex-wrap gap-3">
              <div className="flex items-center space-x-2 glass-card px-5 py-3 rounded-xl shadow-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-900 font-semibold"
                />
              </div>

              <div className={`glass-card px-5 py-3 rounded-xl shadow-lg transition-all ${
                remainingMinutes < 0 ? "bg-gradient-to-r from-red-50 to-red-100" : remainingMinutes === 0 ? "bg-gradient-to-r from-green-50 to-green-100" : ""
              }`}>
                <span className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  {remainingMinutes > 0 && (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>{remainingMinutes} min left ⏳</span>
                    </>
                  )}
                  {remainingMinutes === 0 && (
                    <>
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">Day complete! ✨</span>
                    </>
                  )}
                  {remainingMinutes < 0 && (
                    <>
                      <Zap className="w-4 h-4 text-red-600" />
                      <span className="text-red-700">{Math.abs(remainingMinutes)} min over ⚠️</span>
                    </>
                  )}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="glass-card p-3 rounded-xl hover:bg-white/30 transition-all shadow-lg transform hover:scale-105"
              >
                <LogOut className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-white/90">
              <span className="font-medium">Daily Progress</span>
              <span className="font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercentage >= 100 ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gradient-to-r from-purple-400 to-pink-400"
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Activity Input Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="text-3xl">{editingId ? "✏️" : "➕"}</div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {editingId ? "Edit Activity" : "Add New Activity"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Activity Name
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="e.g., Morning workout 💪"
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-lg font-medium shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-4 rounded-2xl font-bold transition-all text-base shadow-md ${
                      category === cat
                        ? `bg-gradient-to-r ${CATEGORY_COLORS[cat]} text-white shadow-xl scale-105 transform`
                        : `${CATEGORY_BG[cat]} text-gray-700 hover:scale-105 transform`
                    }`}
                  >
                    <span className="text-2xl block mb-1">{CATEGORY_EMOJIS[cat]}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 60"
                min="1"
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-lg font-medium shadow-sm"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 gradient-primary text-white font-bold py-4 px-8 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
              >
                <Plus className="w-6 h-6" />
                <span>{editingId ? "Update Activity ✨" : "Add Activity 🚀"}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition-all shadow-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Activities List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📋</span>
              <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Today's Activities</h2>
            </div>
            <button
              onClick={() => navigate("/analytics")}
              disabled={!canAnalyze}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all text-lg shadow-xl ${
                canAnalyze
                  ? "gradient-secondary text-white hover:shadow-2xl transform hover:scale-105"
                  : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span>Analyze Day 📊</span>
            </button>
          </div>

          {isLoading ? (
            <div className="glass-card rounded-3xl p-16 text-center">
              <div className="animate-spin mx-auto mb-4">
                <Clock className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center">
              <div className="text-6xl mb-6 animate-bounce">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No activities yet
              </h3>
              <p className="text-gray-600 text-lg">
                Start tracking your day by adding your first activity above ⬆️
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="glass-card rounded-3xl p-6 hover:shadow-2xl transition-all animate-slide-up transform hover:scale-102"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-center space-x-4">
                      <div className="text-4xl">
                        {CATEGORY_EMOJIS[activity.category as keyof typeof CATEGORY_EMOJIS]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2 flex-wrap">
                          <span
                            className={`px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${
                              CATEGORY_COLORS[activity.category as keyof typeof CATEGORY_COLORS]
                            } text-white shadow-md`}
                          >
                            {activity.category}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">
                            {activity.activity_name}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-5 h-5" />
                          <span className="text-base font-semibold">
                            {activity.duration_minutes} minutes
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all shadow-md transform hover:scale-110"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id!)}
                        className="p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all shadow-md transform hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
