import axios from "axios";
import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { readCookieValue } from '../utils/readCookieValue';
import { BaseURL, RefreshUserData } from "../API/APIs";
import Cookie from 'cookie-universal';
import LoadingPage from "../pages/LoadingPage";
import katex from 'katex';
import api from "../API/APIs.js";
// import WirisPlugin from '@wiris/mathtype-generic/wirisplugin-generic.js';

export const User = createContext( );

export  function GeneralInfoProvider({ children })
{
    const [auth, set_auth] = useState({
        username: '',
        access_token: '',
        is_teacher: false,
        Class : '12', 
        user_id: -1,
        full_name :'',
        gender: 'M' ,
        image: undefined ,
    });
    
    window.katex = katex;
    
    if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear()
        window.MathJax.typeset()
    }

    useEffect(() => {

        if (typeof window?.MathJax !== "undefined") {
            window.MathJax.typesetClear()
            window.MathJax.typeset()
        }

        if (!readCookieValue('refresh_token')) return;
       
        let url = BaseURL + RefreshUserData;
        
        let obj = {
            refresh:  readCookieValue('refresh_token'),
        }

        api.post(url, obj).then(res => {
            let dd = {
                username: res.data.user.username,
                access_token: res.data.access,
                is_teacher: res.data.user.is_teacher,
                user_id: res.data.user.id,
                full_name: res.data.user.full_name,
                gender: res.data.user.gender,
                image: res.data.user.image,
                Class : res.data.user.Class,
            };
            console.log('here is context ', dd);
            set_auth(dd);
        })
        
            .catch(err => {
                console.log('here is the error in student context', err);
                set_auth({});
                let cookie = new Cookie();
                cookie.removeAll();
            })
			
        // let d = document.querySelector('#hidden_button');
        // d.click();
    },[])
    

    if ( readCookieValue('refresh_token'))
    {
        if (auth.user_id <= 0 )
           return <LoadingPage/>
        else 
        return <User.Provider value={[auth ,set_auth]} >
            {children}
           </User.Provider>
    }
    else 
    return <User.Provider value={[auth ,set_auth]} >
        {children}
    </User.Provider>

}

