import "./Register.css";
//  import "../../all.min.css";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BaseURL } from "../../API/APIs";
import { Register as RegisterURL } from "../../API/APIs";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [accept, setAccept] = useState(false);
  const [existence, set_existence] = useState([]); // email or(and) name already exist(s)

  // localStorage.clear();

  const pass = document.getElementById("pass");
  const iconeye = document.getElementById("iconeyeR");

  function eye() {
    /* تابع لاظهار واخفاء كلمة السر*/
    if (password.length > 0 && pass.type === "password") {
      pass.type = "text";
      iconeye.className = "fa-solid fa-eye-slash";
    } else if (password.length > 0 && pass.type === "text") {
      pass.type = "password";
      iconeye.className = "fa-solid fa-eye";
    }
  }

  async function Submit(e) {
    let flag = true;
    e.preventDefault();
    setAccept(true);

    if (name === "" || password.length < 5 || password !== passwordR)
      flag = false;
    else flag = true;

    if (!flag) return;

    let url = `${BaseURL}${RegisterURL}`;

    let user = {
      username: name,
      email: email,
      password: password,
      isTeacher: false,
    };

    console.log("the user ", user);

    axios
      .post(url, user)
      .then(() => {
        //  console.log('yes he is added')
        localStorage.setItem("successful_register", true);

        window.location.reload();
      })
      .catch((err) => {
        console.log("there was an error from register", err);

        if (err.response.data !== null) set_existence(err.response.data);
      });
  }

  let show_success_box = false;

  if (localStorage.getItem("successful_register") !== null) {
    show_success_box = true;

    // console.log('yes');
    localStorage.clear();
    setTimeout(hide_success_box, 5000);
  }

  return (
    <>
      <div className="Register-page">
        {show_success_box && (
          <div className="success_box">
            {" "}
            Registration complete successful , log in with your account
          </div>
        )}

        <div className="form-box">
          <form onSubmit={Submit}>
            <h2>SignUp</h2>

            <div className="input-register">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                placeholder=" UserName"
                name="username"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {accept && (existence.length > 1 || existence[0] === "name") && (
                <p className="error" style={{ fontSize: "15px", color: "red" }}>
                  name is already been taken
                </p>
              )}
            </div>

            <div className="input-register">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                placeholder=" Email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {accept && (existence.length > 1 || existence[0] === "email") && (
                <p className="error" style={{ fontSize: "14px", color: "red" }}>
                  Email is already been taken
                </p>
              )}
            </div>

            <div className="input-register">
              <i
                className="fa-solid fa-eye"
                id="iconeyeR"
                onClick={eye}
                style={{ cursor: "pointer" }}></i>
              <input
                type="password"
                placeholder=" Password"
                name="password"
                required
                minLength={5}
                maxLength={20}
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-register">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder=" Confirm Password"
                name="confirm pass"
                required
                minLength={5}
                maxLength={20}
                value={passwordR}
                onChange={(e) => setPasswordR(e.target.value)}
              />
              {passwordR !== password && accept && (
                <p style={{ fontSize: "15px", color: "red" }}>
                  Password does not match
                </p>
              )}
            </div>
            <div className="Buttons">
              <button className="BRegister">Register</button>
              <p>
                Do you already have an account?
                <Link className="BLogin" to={"/Login"}>
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function hide_success_box() {
  let ele = document.querySelector(".success_box");

  if (ele !== undefined && ele !== null)
    document.querySelector(".success_box").style.display = "none";
}
 