import "./Login.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
 import axios from "axios";
import { User } from "../../Context/Context";

import { BaseURL } from '../../API/APIs';
import { Login as LoginURL } from '../../API/APIs';

import Cookie from 'cookie-universal';

export default function Login() {
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);
  const [Error, set_Error] = useState("valid");
 
  const [current, set_current] = useContext(User);
  
  // console.log("in login is ", current);
  // console.log("in login 2 is ", current);

  const nav = useNavigate();
  
    function Submit(e) {
      let flag = true;
 
      e.preventDefault();
    setAccept(true);
    if (password.length < 5 ) flag = false;
    
      if (flag) {
      e.preventDefault();
      
      const user = {
        'username': name,
        'password': password ,
        };
        
      let url = BaseURL+LoginURL;
 
        axios.post(url, user)
          .then(response => {
            // console.log("response login", response.data);
 

            let obj = {
              access_token: response.data.access,
              username: name,
              user_id: response.data.user.id,
              is_teacher: response.data.user.is_teacher,
              full_name : response.data.full_name ,
              gender: response.data.gender,
              Class : response.data.gender,
            }
            console.log('here is login', obj);
            // console.log('obj to be set', obj);
            set_current( obj );
            
            // document.cookie = `refresh_token=${response.data.refresh}; expires=${'new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toUTCString()'}; path=/`;
               let c = Cookie();
			   c.set( 'refresh_token' , response.data.refresh );
            nav('/');

          }).catch(error => {
             console.log( 'error' , error )
            set_Error("error");
          
          })
      }
   
  }

  if (Error === 'error')
  {
    hide_error_after_time();
  }
 
  return (
    <div className="login">
      <div className="wrapper">
        <form onSubmit={Submit}>
          <h1>Log in</h1>
          <div className="box">
		     {accept && Error === "error" && (
              <p className="error">invalid user name or password</p>
            )}
            <input
              type="text"
              placeholder="Username"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <i className="fa-solid fa-user" id="icon"></i>
 
          </div>

          <div className="box">
            <input
              type="password"
              id="pass"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={20}
            />
  
            {password.length < 5  && accept && (
              <p className="error">Password must be more than 4 Charcters</p>
            )}
          </div>
 
          <button type="submit" id="button">
            Login
          </button>
            <div className="Link-to-Register">
            <p>
              Don't have an account ?
              <Link to={"/Register"} className="links"> Register</Link>
            </p>
          </div>  
        </form>
      </div>
    </div>
  );

  function hide_error_after_time()
  {
    setTimeout(() => {
      set_Error('valid');
    }, 4000);
  }
}

 