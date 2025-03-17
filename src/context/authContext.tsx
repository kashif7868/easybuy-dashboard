import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch
import { useSnackbar } from 'notistack'; 

interface User {
  fullName: string;
  email: string;
  // Add other fields according to your user model
}

interface AuthContextType {
  user: User | null;
  error: string;
  signUp: (userData: { email: string, password: string, fullName: string }) => Promise<void>;
  login: (credentials: { email: string, password: string }) => Promise<void>;
  logout: () => Promise<void>;
  getUserById: (userId: string) => Promise<User | undefined>;
  updateProfile: (userId: string, updatedData: any) => Promise<User | undefined>;
  dispatch: any; // You may want to be more specific here based on your redux store
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to safely parse JSON
const parseJSON = (data: string | null): User | null => {
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    return null;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const { enqueueSnackbar } = useSnackbar(); // Initialize notistack's enqueueSnackbar

  const [user, setUser] = useState<User | null>(() =>
    parseJSON(localStorage.getItem("user"))
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken") || null
  );
  const [error, setError] = useState<string>(""); // Initialize error state to handle errors

  const clearTokens = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  useEffect(() => {
    if (accessToken && !user) {
      axios
        .post("http://localhost:8000/api/auth/refresh", { token: refreshToken })
        .then((response) => {
          const { user, tokens } = response.data;
          setUser(user);
          setAccessToken(tokens.access.token);
          setRefreshToken(tokens.refresh.token);

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("accessToken", tokens.access.token);
          localStorage.setItem("refreshToken", tokens.refresh.token);
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          clearTokens();
        });
    }
  }, [accessToken, user, refreshToken, clearTokens]);

  const saveTokens = (tokens: { access: { token: string }; refresh: { token: string } }) => {
    setAccessToken(tokens.access.token);
    setRefreshToken(tokens.refresh.token);

    localStorage.setItem("accessToken", tokens.access.token);
    localStorage.setItem("refreshToken", tokens.refresh.token);
  };

  // SignUp API call
  const signUp = async (userData: { email: string, password: string, fullName: string }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register", // Full URL with localhost
        userData // Ensure password_confirmation is included here
      );
      const { user, tokens } = response.data;

      setUser(user);
      saveTokens(tokens);

      localStorage.setItem("user", JSON.stringify(user));

      enqueueSnackbar(`Welcome ${user.fullName}! You have successfully signed up.`, { variant: 'success' });

      navigate("/"); // Redirect to dashboard after signup
    } catch (error: any) {
      setError(error.response?.data?.message || "Signup failed"); // Set error message
      enqueueSnackbar(error.response?.data?.message || "Signup failed", { variant: 'error' });
    }
  };

  // Login API call
  const login = async ({ email, password }: { email: string, password: string }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { user, tokens } = response.data;

      setUser(user);
      saveTokens(tokens);

      localStorage.setItem("user", JSON.stringify(user));

      enqueueSnackbar(`Welcome back ${user.fullName}! You have successfully logged in.`, { variant: 'success' });

      navigate("/"); // Redirect to dashboard after login
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed"); // Set error message
      enqueueSnackbar(error.response?.data?.message || "Login failed", { variant: 'error' });
    }
  };

  // Logout API call
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout",
        { refreshToken: refreshToken || "" },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      clearTokens();

      enqueueSnackbar("You have successfully logged out!", { variant: 'success' });

      navigate("/user"); // Redirect to sign-in page after logout
    } catch (error: any) {
      setError(error.response?.data?.message || "Logout failed"); // Set error message
      enqueueSnackbar(error.response?.data?.message || "Logout failed", { variant: 'error' });
    }
  };

  // Get user by ID
  const getUserById = async (userId: string) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/auth/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data; // Return the user data directly
    } catch (error: any) {
      setError("Failed to fetch user data.");
      enqueueSnackbar("Failed to fetch user data.", { variant: 'error' });
    }
  };

  // Update user by ID
  const updateProfile = async (userId: string, updatedData: any) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:8000/api/auth/users/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUser(data); // Update the current user with the updated info
      enqueueSnackbar("Your user information has been updated successfully.", { variant: 'success' });
      return data; // Return the updated user data directly
    } catch (error: any) {
      setError("Failed to update user data.");
      enqueueSnackbar("Failed to update user data.", { variant: 'error' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        signUp,
        login,
        logout,
        getUserById,
        updateProfile,
        dispatch, // Provide dispatch for actions like addSignUpBonus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
