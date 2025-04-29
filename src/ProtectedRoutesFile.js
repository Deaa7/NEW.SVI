import { useContext } from "react"
import { User } from "./Context/Context"
import { readCookieValue } from "./Components/readCookieValue";
import { Navigate, Outlet } from "react-router-dom";


let token = readCookieValue('refresh_token');

export function UnknownUsersOnly() {
    
    return token?  <Navigate to={'/no such url'} replace={true}/>: <Outlet />  
}
export function TeachersOnly()
{
    let [user , _ ]= useContext(User);
    return token && user.is_teacher ? <Outlet /> : <Navigate to={'/no such url'} replace={true} />;

    
}
export function StudentOnly()
{
    let [user, _] = useContext(User);
    
    return token && !user.is_teacher ? <Outlet /> : <Navigate to={'/no such url'} replace={true} />;
  
}