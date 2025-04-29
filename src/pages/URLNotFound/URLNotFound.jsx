import './URLNotFound.css';
import {Link}  from 'react-router-dom';


export default function URLNotFound()
{
    return <>
              <div id="upper_part_exam_body"></div>
        <div id="not_found_container">
                يبدو أنك دخلت إلى رابط غير صالح
                <br />
                <br />  
                ارجع إلى        
       <Link to ={'/'} id="not_found_to_home_page"> الصفحة الرئيسية </Link>
                
       </div>
    </>
}
