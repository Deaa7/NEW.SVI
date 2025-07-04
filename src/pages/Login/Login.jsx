import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from 'cookie-universal';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!username || !password || password.length < 5) {
      setErrorMsg("يرجى إدخال اسم المستخدم وكلمة مرور لا تقل عن 5 أحرف.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://deaa7work.pythonanywhere.com/users/login/",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data && res.data.access && res.data.refresh) {

        localStorage.setItem("token", res.data.access);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        console.log("USER after set:", localStorage.getItem("user"));
        
        let cookie = new Cookie();
        cookie.set("refresh_token", res.data.refresh, { path: "/" });
      
        navigate("/");
        window.location.reload();
        
      } else {
        setErrorMsg("بيانات الدخول غير صحيحة.");
      }
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.detail || "خطأ في تسجيل الدخول، تحقق من البيانات."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login-page">
      <form className="login-form-box" onSubmit={handleSubmit} dir="rtl">
        <h2 className="login-form-title">تسجيل الدخول</h2>
        <div className="input-group">
          <input
            className="input"
            type="text"
            name="username"
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="input-group">
          <input
            className="input"
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "جاري الدخول..." : "تسجيل الدخول"}
        </button>
        <p className="no-account">
          ليس لديك حساب؟{" "}
          <Link to="/Register" className="register-link">
            أنشئ حساب جديد
          </Link>
        </p>
      </form>
    </div>
  );
}
