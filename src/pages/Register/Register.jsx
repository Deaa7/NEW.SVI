import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [isTeacher, setIsTeacher] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordR: "",
    full_name: "",
    email: "",
    gender: "M",
    Class: "9",
    city: "",
    phone_number: "",
    studying_subjects: "math",
    school: "", 
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const cities = [
    "دمشق", "ريف دمشق", "حمص", "حماة", "حلب", "اللاذقية", "طرطوس", "درعا", "القنيطرة", "السويداء", "دير الزور", "الرقة", "الحسكة", "إدلب"
  ];

  const subjects = [
    "math", "physics", "chemistry", "science", "arabic", "english", "france", "islam", "physics_chemistry", "geography"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (val) => {
    setIsTeacher(val === "teacher");
    setForm({ ...form, Class: val === "teacher" ? "9_12" : "9" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!form.username || !form.password || form.password.length < 5 || form.password !== form.passwordR || !form.full_name) {
      setErrorMsg("يرجى تعبئة جميع الحقول بشكل صحيح.");
      setLoading(false);
      return;
    }

    let data = {
      username: form.username,
      password: form.password,
      is_teacher: isTeacher,
      full_name: form.full_name,
      email: form.email,
      gender: form.gender,
      Class: form.Class,
      city: form.city,
      phone_number: form.phone_number,
    };

    if (isTeacher) {
      data.studying_subjects = form.studying_subjects;
    }
    else{
      data.school = form.school;
    }

    try {
      const res = await axios.post(
        "https://deaa7work.pythonanywhere.com/users/register/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data) {
        alert("تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.");
        navigate("/login");
      } else {
        console.log(res);
        setErrorMsg("حدث خطأ أثناء التسجيل، يرجى المحاولة لاحقاً.");
      }
    } catch (err) {
      // إذا هناك حقول فيها أخطاء من API مباشرة
      const errMsg =
        err?.response?.data?.detail ||
        (err?.response?.data && typeof err.response.data === "object"
          ? Object.values(err.response.data).join("، ")
          : "فشل التسجيل: اسم المستخدم مستخدم أو البيانات غير صحيحة.");
      setErrorMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Register-page">
      <form className="form-box" onSubmit={handleSubmit} dir="rtl">
        <h2 className="form-title">تسجيل حساب جديد</h2>
        <div className="type-selector input-group">
          <label>
            <input type="radio" name="userType" value="student" checked={!isTeacher} onChange={() => handleTypeChange("student")} />
            طالب
          </label>
          <label style={{ marginRight: "1.5em" }}>
            <input type="radio" name="userType" value="teacher" checked={isTeacher} onChange={() => handleTypeChange("teacher")} />
            أستاذ
          </label>
        </div>
        <div className="input-group">
          <input
            className="input"
            type="text"
            name="username"
            placeholder="اسم المستخدم"
            value={form.username}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="input-group">
          <input
            className="input"
            type="text"
            name="full_name"
            placeholder="الاسم الكامل"
            value={form.full_name}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <input
            className="input"
            type="text"
            name="email"
            placeholder="الايميل"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <input
            className="input"
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>
        <div className="input-group">
          <input
            className="input"
            type="password"
            name="passwordR"
            placeholder="تأكيد كلمة المرور"
            value={form.passwordR}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>
        {!isTeacher && (<div className="input-group">
          <input
            className="input"
            type="text"
            name="school"
            placeholder="اسم المدرسة"
            value={form.school}
            onChange={handleChange}
          />
        </div>)}
        <div className="input-group">
          <select className="input" name="gender" value={form.gender} onChange={handleChange}>
            <option value="M">ذكر</option>
            <option value="F">أنثى</option>
          </select>
        </div>
        <div className="input-group">
          <select className="input" name="Class" value={form.Class} onChange={handleChange}>
            {!isTeacher && <option value="9">صف تاسع</option>}
            {!isTeacher && <option value="12">صف ثالث ثانوي</option>}
            {isTeacher && <option value="9_12">تاسع + بكالوريا</option>}
          </select>
        </div>
        <div className="input-group">
          <select className="input" name="city" value={form.city} onChange={handleChange}>
            <option value="">اختر المحافظة</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <input
            className="input"
            type="text"
            name="phone_number"
            placeholder="رقم الهاتف"
            value={form.phone_number}
            onChange={handleChange}
          />
        </div>
        {isTeacher && (
          <div className="input-group">
            <select className="input" name="studying_subjects" value={form.studying_subjects} onChange={handleChange}>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "جارٍ التسجيل..." : "تسجيل"}
        </button>
        <p className="have-account">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="login-link">
            سجّل الدخول
          </Link>
        </p>
      </form>
    </div>
  );
}
