import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { useAuth } from "../context/authContext"; // Assuming the useAuth hook provides authentication methods

export default function SidebarWidget() {
  const { logout } = useAuth(); // Get logout function from context
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from context
      alert("You have logged out.");
      navigate("/user"); // Redirect to login page or home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred during logout.");
    }
  };

  return (
    <div
      className={`mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <button
        onClick={handleLogout} // Attach handleLogout function to the onClick event
        className="w-full p-3 font-medium text-white rounded-lg bg-red-500 text-theme-sm hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
