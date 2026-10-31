
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    LockKeyhole,
    User,
    LogIn,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

import API from "../Services/api";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!username.trim() || !password) {
            setError("Please enter your username and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/auth/login", {
                username: username.trim(),
                password,
            });

            if (response.data?.success === true) {
                onLogin();
                navigate("/dashboard", { replace: true });
            } else {
                setError("Invalid username or password.");
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Invalid username or password.");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to connect to the server. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">

            <form className="login-card" onSubmit={handleSubmit}>

                {/* Shop Banner Inside Login Card */}
                <div className="login-brand">
                    <img
                        src="/mahesh-banner.png"
                        alt="Mahesh Digital Studio"
                    />
                </div>

                <h1>Admin Login</h1>
                <p>Mahesh Digital Studio</p>

                {/* Username */}
                <label htmlFor="username">
                    Username
                </label>

                <div className="login-input">
                    <User size={19} />

                    <input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        autoComplete="username"
                        required
                    />
                </div>

                {/* Password */}
                <label htmlFor="password">
                    Password
                </label>

                <div className="login-input">
                    <LockKeyhole size={19} />

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        required
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="login-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Button */}
                <button
                    className="upload-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <LoaderCircle
                                className="spin"
                                size={20}
                            />
                            VERIFYING...
                        </>
                    ) : (
                        <>
                            <LogIn size={20} />
                            LOGIN
                        </>
                    )}
                </button>

                {/* Back to Customer Upload */}
                <button
                    className="back-link"
                    type="button"
                    onClick={() => navigate("/upload")}
                >
                    Back to customer upload
                </button>

            </form>

        </main>
    );
}

export default LoginPage;
