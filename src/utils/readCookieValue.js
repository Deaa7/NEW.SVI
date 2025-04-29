import Cookie from 'cookie-universal';


export function readCookieValue(name)
{

    let cookie = Cookie();
    // console.log('cookie is ', cookie);
    // console.log('name is ', cookie.get(name));
 
    return cookie.get(name);
}