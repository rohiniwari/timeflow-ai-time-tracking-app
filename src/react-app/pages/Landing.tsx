import { useEffect } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { Clock, Sparkles, ArrowRight, Zap } from "lucide-react";

const FLOATING_EMOJIS = ["⏰", "📊", "✨", "🎯", "🚀", "💡", "⚡", "🌟", "📈", "🎨", "🔥", "💪"];

export default function LandingPage() {
  const { user, isPending, redirectToLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/activity");
    }
  }, [user, navigate]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Clock className="w-10 h-10 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATING_EMOJIS.map((emoji, index) => (
          <div
            key={index}
            className="emoji-float absolute"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 2}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              fontSize: `${1.5 + Math.random() * 2}rem`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Animated background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="text-white space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 glass px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold">AI-Powered Time Insights</span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-lg">
                Track Your Day
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-pulse-glow">
                  Smarter ✨
                </span>
              </h1>
              <p className="text-2xl text-white/95 max-w-lg drop-shadow-md leading-relaxed">
                AI-powered insights for your daily life. Understand how you spend your time and optimize your productivity like never before. 🚀
              </p>
            </div>

            {/* Feature highlights with emojis */}
            <div className="space-y-5 pt-6">
              <div className="flex items-center space-x-4 glass px-5 py-4 rounded-2xl hover:bg-white/20 transition-all transform hover:scale-105">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg text-2xl">
                  ⏱️
                </div>
                <div>
                  <span className="text-lg font-semibold block">Track activities in minutes</span>
                  <span className="text-sm text-white/80">Precise time management</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 glass px-5 py-4 rounded-2xl hover:bg-white/20 transition-all transform hover:scale-105">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg text-2xl">
                  📊
                </div>
                <div>
                  <span className="text-lg font-semibold block">Beautiful analytics dashboard</span>
                  <span className="text-sm text-white/80">Visualize your productivity</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 glass px-5 py-4 rounded-2xl hover:bg-white/20 transition-all transform hover:scale-105">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg text-2xl">
                  🎯
                </div>
                <div>
                  <span className="text-lg font-semibold block">Smart category insights</span>
                  <span className="text-sm text-white/80">AI-powered recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login card */}
          <div className="animate-slide-up">
            <div className="glass-card rounded-3xl p-10 lg:p-12 shadow-2xl max-w-md mx-auto relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
              
              <div className="text-center space-y-7">
                <div className="relative inline-block">
                  <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse-glow">
                    <span className="text-4xl">⏰</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <span className="text-sm">✨</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                    Welcome to<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                      TimeFlow
                    </span>
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Get started with your time tracking journey and unlock productivity insights 🚀
                  </p>
                </div>

                <div className="pt-4 space-y-4">
                  <button
                    onClick={redirectToLogin}
                    className="w-full relative overflow-hidden gradient-primary text-white font-bold py-5 px-8 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 group"
                  >
                    <div className="absolute inset-0 shimmer"></div>
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-lg">Continue with Google</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>

                  <div className="flex items-center space-x-2 justify-center text-sm text-gray-500">
                    <Sparkles className="w-4 h-4" />
                    <span>Secure & Private</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 pt-4 leading-relaxed">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>

            {/* Floating accent emojis around card */}
            <div className="absolute -z-10 text-6xl opacity-20">
              <span className="absolute -top-8 -left-8 animate-float">🎯</span>
              <span className="absolute -bottom-8 -right-8 animate-float" style={{ animationDelay: '1s' }}>🚀</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
