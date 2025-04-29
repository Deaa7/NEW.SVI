import { Link } from "react-router-dom";
import "./Header.css";
import axios from "axios";

import { User } from "../../Context/Context";

import { useContext } from "react";
import { readCookieValue } from "../../utils/readCookieValue";
import { useNavigate } from "react-router-dom";

import { BaseURL } from '../../API/APIs';
import { Logout  , RefreshUserData} from '../../API/APIs';

import Cookie from 'cookie-universal';
import { notification } from "../../utils/notification";

export default function Header() {

  let [user , update_user_info] = useContext(User) ;
 
  let username = user.username;
  let is_teacher = user.is_teacher;
  let access_token = user.access_token;
  let refresh_token = readCookieValue('refresh_token');
  let full_name = user.full_name ;

  let nav = useNavigate();
  
  return (<>
    <div id="header_root" onAnimationEnd={(e) => fix_style_after_animation(e.currentTarget)}>    
      
      {
        refresh_token &&
          <div id="username_and_logout_container">

            <button id="header_logout" className="header_button" onClick={refresh_access_token}>تسجيل الخروج</button>   
            {
              is_teacher ?
              <Link id="header_username" className="header_button" to={`/TeacherProfile/${user.user_id}`}>{ full_name }</Link>
              :
              <button id="header_username" className="header_button">{ full_name }</button>
            } 
          </div>
      }
      
      {
        !refresh_token   &&
        (
          <div id="login_register_container">
      
            <Link to={'/Login'} id="header_login" className="header_button"> تسجيل الدخول   </Link>
            <Link to={'/Register'} id="header_register" className="header_button" > انشاء حساب </Link>  
  
          </div>
        )
      }

      <div id="home_about_container">
        <Link  to={'/About'} id ="header_about" className="header_button"> من نحن  </Link>
        <Link to={'/'} id="header_home" className="header_button"> الصفحة الرئيسية</Link>
       </div>
    
    </div>
  </>
    );

  
  function refresh_access_token()
  {
    let url = BaseURL + RefreshUserData;
    let cookie = new Cookie();
          
        let obj = {
            refresh:  readCookieValue('refresh_token'),
        }
        axios.post(url, obj).then(res => {
          logout(res.data.access);
        })
        .catch(err => {
                console.log('here is the error in student context', err);
                update_user_info({});
                cookie.removeAll();
            })
  }

  async function logout(new_access_token)
  {
    let url = BaseURL + Logout ;
    
    axios.post(url , {
      username:username,
      refresh_token: refresh_token,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${new_access_token}`
      }
      }, 
    )
      .then(() => { 
      
      update_user_info({});
      cookie.removeAll();
      window.location.href = '/';
    })
    .catch(err => { 
      console.log('logout error ', err);
      notification('حدث خطأ أثناء تسجيل الخروج', 'toast_error');
      cookie.removeAll();
      update_user_info({});
      window.location.href = '/';
      });
    
    let cookie = new Cookie();
    cookie.removeAll();
  }
  
}

let fix_style_after_animation = (e) => {
  let state = e.style.animationName;
  if (state === "hide_header") {
    e.style.display = "none";
    e.style.transform = "translateY(-100px)";
  } else {
    e.style.display = "flex";
    e.style.transform = "translateY(0px)";
  }
};
 
 