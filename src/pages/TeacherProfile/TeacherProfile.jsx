import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import './TeacherProfile.css';
import { User } from '../../Context/Context';
import TeacherOwnProfile from '../../Components/TeacherOwnProfile/TeacherOwnProfile';
import TeacherForOthersProfile from '../../Components/TeacherForOthersProfile/TeacherForOthersProfile';

export default function TeacherProfile()
{
 
    let { id } = useParams();
    id = parseInt(id);
    let [user, _] = useContext(User);
    
    if (user === undefined || user.user_id !== id )
    {
        return <TeacherForOthersProfile id = { id } />
    }
    else 
    {
        return <TeacherOwnProfile  />
    }
}