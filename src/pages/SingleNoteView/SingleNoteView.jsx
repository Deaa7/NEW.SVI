
import { useEffect, useState , useContext } from 'react';
import { Link, replace, useNavigate, useParams } from 'react-router-dom';
import './SingleNoteView.css';
import axios from 'axios';
import {reference} from '../../data/SubjectNameReference.js'
import {notification} from '../../utils/notification';
import {User} from '../../Context/Context.jsx';
import {
    BaseURL, GetNoteWithoutContent, IncreaseNumberOfNotePurchases,
    IncreaseNumberOfNoteReads, PayPremiumContent
} from '../../API/APIs.js';
export default function SingleNoteView() {
 
    const { id, subject_name, Class } = useParams(); // id from url parameter

    const [user, _] = useContext(User);

    let nav = useNavigate();
 
    const [single_note, set_single_note] = useState();
    

    useEffect(() => {
 
        let url = BaseURL + GetNoteWithoutContent + id + `/`;

        axios.get(url)
            .then(res => {
                console.log('res of single note', res.data[0]);
                if (res.data[0])
                    set_single_note(res.data[0]);
                else nav('/no such url', { replace: true });
            })
            .catch(err => {
                nav('/no such url', { replace: true });
            })
    
    }
        , [])

 
    let content = "";
    if (single_note) {
        content = (<>
            
            <div id="single_note_first_part" >
            
                <div id="note_subject_name"> اسم المادة :  {reference[subject_name]} </div>
                <div id="note_publisher_name"> اسم الكاتب :  {single_note.publisher_name} </div>
                <div id="note_uploaded_date"> تاريخ النشر :  {single_note.date_uploaded.toString().substring(0, 10)} </div>
            
            </div>
            
            <div id="note_name"> الاسم:  {single_note.title} </div>
        
            <div id="single_note_last_part">
                
                <div id="note_special_id">  الرمز الخاص :   {single_note.id}  </div>
                <div id="note_number_of_read"> عدد مرات القراءة : {single_note.number_of_reads} </div>
                {single_note.price > 0 ?
                    <div id="this_note_is_premium">  السعر :  {single_note.price} ل.س </div>
                    :
                    <div id="this_note_is_free">السعر :  مجاني </div>
                  

                }
            </div>
        </>);
    }
		
    return <>
     
        <div id="single_note_view_upper_part"></div>
        <div id="single_note_view_root" >
            <div id="single_note_view_title"> تفاصيل المحتوى :  </div>
      
            <div id="single_note_view_body">
                {content}

                
            </div>
      
            {!user.is_teacher && <>
                <button id="open_note_button" onClick={open_confirm_box} >  فتح المحتوى</button>
            
                <div id="single_note_black_background" onClick={close_confirm_box} ></div>
            
                <div id="single_note_confirm_box" >
                    <div id="single_note_confirm_box_close_icon" onClick={close_confirm_box} >X</div>
                    <h2 id="single_note_confirm_box_title">قراءة المحتوى الآن</h2>
                    <div id="confirm_box_price">
                    
                        {single_note && single_note.price > 0 ?
                            `تكلفة المحتوى : ${single_note.price} ل.س` :
                            `إن هذا المحتوى مجاني`
                        }
                    
                    </div>
                
                    <Link to={`/NotePage/${id}`} id="go_to_read_page_button" onClick={increase_num_of_reads} > الذهاب إلى صفحة القراءة </Link>
                </div>
            
            </>}
            
        </div>
     
    </>
    
    
   
function open_confirm_box()
{
    let current_name = user.username;
    if( !current_name )
    {
        do_not_have_account();
        return;
    }
    document.getElementById('single_note_black_background').style.display = 'block';
    document.getElementById('single_note_confirm_box').style.display = 'block';      
    }
    
function close_confirm_box()
{
    document.getElementById('single_note_black_background').style.display = 'none';
    document.getElementById('single_note_confirm_box').style.display = 'none';
}
function do_not_have_account()
{
  
  notification('يجب عليك أن تسجل الدخول بحسابك ','toast_error');
  return ;
 
}    

    function increase_num_of_reads()
    {
        let url = BaseURL+IncreaseNumberOfNoteReads+id+`/`;
        axios.put(url)
            .catch(err => console.log('err in increase_num_of_reads ', err))
    }


}