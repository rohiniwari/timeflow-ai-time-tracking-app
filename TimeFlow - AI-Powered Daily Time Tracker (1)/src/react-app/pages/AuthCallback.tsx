import { useEffect } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        navigate("/activity");
      } catch (error) {
        console.error("Failed to exchange code for session token:", error);
        navigate("/");
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="animate-spin">
        <Loader2 className="w-10 h-10 text-white" />
      </div>
      <p className="text-white text-lg">Completing sign in...</p>
    </div>
  );
}
