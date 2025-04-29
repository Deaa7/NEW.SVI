
import { useContext, useEffect, useRef, useState } from 'react';
import './TeacherForOthersProfile.css';
import { User } from '../../Context/Context';
import axios from 'axios';
import { BaseURL, GetTestPackageByPublisherId, TeacherProfileInfo ,
         GetNotesWithoutContentByTeacherID,
         BaseURLImages} from '../../API/APIs';
import { reference } from '../../data/SubjectNameReference';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { notification } from '../../utils/notification';
import LoadingPage from '../../pages/LoadingPage';
export default function TeacherForOthersProfile({ id } ) {
	
    let [teacher_info, set_teacher_info] = useState([]);

    let loading = useRef(true);
    let content = "";
   
    useEffect(() => {
        loading.current = true;

      let  url = BaseURL + TeacherProfileInfo +   id.toString() + '/';

        axios.get(url).then(res => 
        {
            loading.current = false;
            set_teacher_info(res.data);
        }
         )
            .catch(err =>
            {
                console.log('err in teacher info ', err);
                notification('حدث خطأ , الرجاء المحاولة لاحقاً', 'toast_error');
            }
        );
    }, [])


 
 
	
    let Class = 'بكلوريا و تاسع';
    
    if (teacher_info.Class == '12') Class = 'بكلوريا';
    if (teacher_info.Class == '9') Class = 'تاسع';

    let teacher_name = teacher_info.gender == 'M' ? 'الاستاذ' : 'الآنسة';
    teacher_name += ' '+ teacher_info.full_name ;
    
    teacher_name += ' - ' + Class;
    let array = teacher_name.split('');
    let delay = 0;
      content = array.map(e => {
          return <span >{e}</span>
      })
      let str = "";

      if (reference[teacher_info.studying_subjects]) str = reference[teacher_info.studying_subjects];
    
      array = str.split('');
    
      let subject_content = array.map(e => {
          return <span >{e}</span>
      });
    
    
    
    if (loading.current)
    {
        return <LoadingPage />;
    }

    return <>
        <div id="teacher_for_others_profile_upper_part"></div>
        
        <div id="teacher_for_others_profile_root">
                
            <div id="teacher_for_others_profile_first_part_img_bio_container">
            <div id="teacher_for_others_profile_first_part">
                <div id="teacher_name">{content}</div>
                <div id="teacher_subject_name">{ subject_content }</div>
                    <div id="teaching_school_institution">
                        {teacher_info.teaching_in_school &&
                            <div id="teacher_school">
                            {teacher_info.gender == 'M' ? 'يُدرّس' : 'تُدرًس'} &nbsp;
                            في مدرسة :&nbsp;
                            { teacher_info.teaching_in_school}
                        </div> }
       
                        {
                          teacher_info.teaching_in_institutions &&
                         <div id="teaching_institution">
                            {teacher_info.gender == 'M' ? 'يُدرّس' : 'تُدرًس'}&nbsp;
                            في المعاهد :&nbsp;
                            {teacher_info.teaching_in_institutions}  
                         </div>
                        } 
                    </div>
  
                    <div id="teacher_phone_numbers">
                        {teacher_info.phone_number &&
                            <div id="teacher_first_phone_number">  رقم الهاتف الاساسي : {teacher_info.phone_number} </div>}
                        
                        {teacher_info.another_phone_number &&
                            <div id="teacher_second_phone_number">   رقم هاتف الثانوي : {teacher_info.another_phone_number}</div>}  
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
                            <div id="teacher_city"> تاريخ الانضمام : {teacher_info.created_at} </div>
                    </div>
            </div>
            
            <div id="teacher_image_bio_container">
                <img src={ teacher_info.image ?  BaseURLImages + teacher_info.image  : teacher_info.gender ==='M' ?require('../../assets/TeacherMale.png') :  require('../../assets/TeacherFemale.png')    } alt="الصورة الافتراضية" id="teacher_image" />
                    {teacher_info.bio && <p id="teacher_bio"> {teacher_info.bio} </p> }
             </div>
            </div>
 
     </div>
    </>

 
}
