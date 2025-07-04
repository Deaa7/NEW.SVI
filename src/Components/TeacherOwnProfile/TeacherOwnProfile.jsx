
import { useContext, useEffect, useState } from 'react';
import './TeacherOwnProfile.css';
import { User } from '../../Context/Context';
import axios from 'axios';
import { BaseURL, GetTestPackageByPublisherId, TeacherProfileInfo ,
         GetNotesWithoutContentByTeacherID , BaseURLImages} from '../../API/APIs';
import { reference } from '../../data/SubjectNameReference';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
export default function TeacherOwnProfile() {
    let [user, _] = useContext(User);

    let [teacher_info, set_teacher_info] = useState([]);


    // console.log(" here is teacher info ", teacher_info);
    
    useEffect(() => {
        // let loading_exam = document.querySelector('#teacher_own_profile_root #exam_table_container .loading_row');
        // let loading_note = document.querySelector('#teacher_own_profile_root #note_table_container .loading_row');
        
        // if (loading_exam) loading_exam.style.display = 'block';
        // if (loading_note) loading_note.style.display = 'block';

        // let url = BaseURL + GetTestPackageByPublisherId + user.user_id.toString() + '/';
        
        // axios.get(url).then(res => {
            
        //     if (loading_exam) loading_exam.style.display = 'none';
        //     set_exams(res.data.exams)
        //     // console.log('exams teacher is ', res.data);
        // }) // for getting the exams info
        //     .catch(err => console.log('err in exams  info', err));

        // url = BaseURL + GetNotesWithoutContentByTeacherID + user.user_id.toString() + '/';
		
        // axios.get(url).then(res => {

        //     if (loading_note) loading_note.style.display = 'none';
        //     set_notes(res.data.notes)
        // })
        //     .catch(err => console.log('err in notes info ', err));
   	
        let url = BaseURL + TeacherProfileInfo + user.user_id.toString() + '/';

        axios.get(url).then(
            res => {
                // console.log('here is response of TeacherProfileInfo ', res.data);
                set_teacher_info(res.data);
            }
        )
            .catch(err => console.log('err in teacher info ', err));

    }, []);

 
	
    

    let Class = 'بكلوريا و تاسع';
    
    if (teacher_info.Class == '12') Class = 'بكلوريا';
    if (teacher_info.Class == '9') Class = 'تاسع';

    let teacher_name = teacher_info.gender == 'M' ? 'الاستاذ' : 'الآنسة';
    teacher_name +=  ' '+ teacher_info.full_name;
    
    teacher_name += ' - ' + Class;
    let array = teacher_name.split('');
    let delay = 0;
    
   let content = array.map(e => {
        
        return <span    >{e}</span>
    });

    let str = "";

    if (reference[teacher_info.studying_subjects]) str = reference[teacher_info.studying_subjects];
  
    array = str.split('');
  
    let subject_content = array.map(e => {
        return <span  >{e}</span>
    });


    return <>
        <div id="teacher_own_profile_upper_part"></div>
        
        <div id="teacher_own_profile_root">
            <div style={{ marginBottom: "24px" }}>
                <Link to={'/AddExam'} className="profile-btn">إضافة امتحان</Link>
                <Link to={'/TextEditor'} className="profile-btn">محرر النصوص</Link>
                <Link to={'/EditingTeacherProfile/' + user.user_id} className="profile-btn" id="edit_teacher_info_profile">
                    تعديل بياناتي الشخصية &nbsp;
                    <i className="fa-solid fa-pen-to-square"></i>
                </Link>
            </div>

            <div id="teacher_own_profile_first_part_img_bio_container">
            <div id="teacher_own_profile_first_part">
                <div id="teacher_name">{content}</div>
                    <div id="teacher_subject_name">{ subject_content }</div>
                    <div id="teaching_school_institution">
                    {teacher_info.teaching_in_school && 
                    
                    <div id="teacher_school">
                        {teacher_info.gender == 'M' ? 'يُدرّس' : 'تُدرًس'} &nbsp;
                        في مدرسة :&nbsp;
                        { teacher_info.teaching_in_school}
                    </div>
                    }

                        <div id="teaching_institution">
                            {teacher_info.gender == 'M' ? 'يُدرّس' : 'تُدرًس'}&nbsp;
                            في المعاهد :&nbsp;
                            {teacher_info.teaching_in_institutions}  
                        </div>
                    </div>
  
                <div id="teacher_phone_numbers">
                  <div id="teacher_first_phone_number">  رقم الهاتف الاساسي : {teacher_info.phone_number} </div>     
                  <div id="teacher_second_phone_number">   رقم هاتف الثانوي : {teacher_info.another_phone_number}</div>     
                </div>

                    <div id="contact_teacher_section">
                        {teacher_info.telegram_link &&
                        <a  href={teacher_info.telegram_link } target='_blank' id="telegram_link" className='link'  >رابط التواصل لحساب تيليغرام    <i className='fa-brands fa-telegram'></i> </a>
                        } 

                        {teacher_info.whatsapp_link &&
                            <a href={teacher_info.whatsapp_link} target='_blank' id="whatsapp_link" className='link' >  رابط التواصل واتساب     <i className='fa-brands fa-whatsapp'></i></a>
                        }
                        {teacher_info.facebook_link &&
                            <a href={teacher_info.facebook_link } target='_blank' id="facebook_link" className='link' >رابط صفحة الفيس بوك   <i className='fa-brands fa-facebook'></i></a>
                        }
                        {teacher_info.instagram_link &&
                            <a href={teacher_info.instagram_link} target='_blank' id="instagram_link" className='link' >رابط حساب الانستاغرام  <i className='fa-brands fa-instagram'></i></a>
                        }
                    </div>

                    <div id="teacher_city_and_date_created_container">

                                   {teacher_info.city &&
                              <div id="teacher_city"> المدينة : {teacher_info.city} </div>
                              }       
                        <div id="teacher_city"> تاريخ الانضمام : { teacher_info.created_at } </div>
                    </div>
                    <div id="current_total_net">  الرصيد: {teacher_info.total_net} ل.س 
                        {teacher_info.total_net > 50000 && <p id="pay_ability_text"> *يحق لك مطالبة إدارة المعهد بسحب المبلغ </p>}
                </div>
 
            </div>
            
            <div id="teacher_image_bio_container">
                <img src={ teacher_info.image ?  BaseURLImages + teacher_info.image  : teacher_info.gender ==='M' ?  require('../../assets/TeacherMale.png') :  require('../../assets/TeacherFemale.png')  } alt="الصورة الافتراضية" id="teacher_image" />
               
                    {teacher_info.bio && <p id="teacher_bio"> {teacher_info.bio} </p>}
                
             </div>
            </div>
		

       
		
     </div>
    </>

 
}
