import { useContext, useState } from 'react';
import './StudentOwnProfile.css';
import { useEffect } from 'react';
import {
  BaseURL, GetStudentDoneExams, StudentOwnProfile as student_info_url,
  GetStudentPremiumContent
} from '../../API/APIs';
import { User } from '../../Context/Context';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { reference } from '../../data/SubjectNameReference';
import ReactPaginate from 'react-paginate';
export default function StudentOwnProfile()
{
  let [student_info, set_student_info] = useState([]);

  let [[student_exams , number_of_exams], set_student_exams] = useState([ [] , 0 ]);
  let [student_exam_page , set_student_exam_page] = useState( 0)
  
  let [[student_premium_content, number_of_premium_content], set_student_premium_content] = useState([[], 0]);
  let [student_premium_content_page , set_student_premium_content_page] = useState( 0)

  let [user, _] = useContext(User);
  let nav = useNavigate();


  useEffect(() => {

    let url = BaseURL + student_info_url + user.user_id.toString() + '/';
    axios.get(url)
      .then(res => {
        // console.log('here is res' , res.data);
        set_student_info(res.data);
      })
      .catch(err => {
        console.log('here is error in student own profile', err);
      });
    
  }, []);   


  useEffect(() => {
   
    let url = BaseURL + GetStudentDoneExams + user.user_id.toString() + '/';
    let obj = {
      count: student_exam_page + 1,
      limit:9,
    }

    axios.get(url , {params:obj})
      .then(res => {
      // console.log('here are student exams' , res.data);
      set_student_exams([res.data.exams , res.data.number_of_exams]);
    })
    .catch(err => {
      console.log('here is error in student exams', err);
    }); 
  
  }, [student_exam_page]);
 
  useEffect(() => {
    
    let url = BaseURL + GetStudentPremiumContent + user.user_id.toString() + '/';
    let obj = {
      count: student_premium_content_page + 1,
      limit:9,
    }

    axios.get(url , {params:obj})
      .then(res => {
      // console.log('here are student content premium' , res.data);
      set_student_premium_content([res.data.premium_content , res.data.number_of_premium_content]);
    })
    .catch(err => {
      console.log('here is error in  student content premium ', err);
    }); 
  }, [student_premium_content_page]);

   
  let full_name_string = student_info.first_name + ' ' + student_info.last_name;
  
  let time = 0;
  
  let full_name = full_name_string.split('').map(e => {
    time += 100; 
    return <span style={{  animationDelay:time.toString() +'ms' , animationName:'show_student_name',opacity:'0'  }} onAnimationEnd={ e => e.target.style.opacity ='1' } >{ e }</span>
  });
   

  let Class_String =   student_info.Class  === '9' ? student_info.gender === 'M' ? "طالب تاسع" : "طالبة تاسع" : student_info.gender === 'M' ? "طالب بكلوريا" : "طالبة بكلوريا"

  let Class_content = Class_String.split('').map(e => {
    time += 100; 
    return <span style={{  animationDelay:time.toString() +'ms' , animationName:'show_student_name',opacity:'0'  }} onAnimationEnd={ e => e.target.style.opacity ='1' } >{ e }</span>
  });
  
 
  let student_own_profile_premium_content = student_premium_content.map(e => {
    return <tr onClick= {()=>go_to_exam_note_page( e.type , e.content_id ,e.subject_name , e.Class ) } >
      <td>{ reference[e.subject_name] }</td> 
      <td>{ e.type ==='exam' ? 'اختبار' : 'نوطة' }</td> 
      <td>{ e.content_name }</td> 
      <td>{e.purchase_date }</td> 
      <td>{e.teacher_full_name }</td> 
      <td>{ e.price}</td> 
      <td>{e.date_of_expiration }</td> 
     </tr>
  })

  let student_own_profile_exams_table = student_exams.reverse().map(e => {
    return <tr>
       <td>{reference[e.subject_name + '_'+ student_info.Class]}</td>
       <td>{ e.exam_name }</td>
       <td> {e.teacher_full_name} </td>
       <td> {e.result} </td>
      <td> { e.time_taken} </td>
      <td> { e.date_of_application} </td>
     </tr>
} )

  let number_of_premium_content_pages = Math.floor(number_of_premium_content / 9);
  if (number_of_premium_content % 9) number_of_premium_content_pages++;

  let number_of_student_exam_pages = Math.floor(number_of_exams / 9);
  if (number_of_exams % 9) number_of_student_exam_pages++;

  
  return <>

    <div id="student_own_profile_upper_part"></div>
    
    <div id="student_own_profile_root">

      <h1 id="student_own_profile_student_name">{full_name}</h1>

       <div id="student_own_profile_class"> { Class_content } </div>
      <div id="student_own_profile_middle_part">
        
              
        <div id="student_own_profile_city_school_container">
        
        <div id="student_own_profile_school" > {student_info.gender === 'M' ? " يدرس في مدرسة " : " تدرس في مدرسة  "}  {student_info.school}  </div>

        <div id="student_own_profile_city" > مقيم في مدينة :  {student_info.city}  </div>
            
        </div>

        <div id="student_own_profile_balance">  الرصيد الحالي :  {student_info.balance}  </div>

        </div>
       
      <h2 id="student_own_profile_premium_content_title">المحتوى المدفوع</h2>
      <div id="student_own_profile_premium_content_table_container">

        <table id="student_own_profile_premium_content_table">
          <thead>
            <th>المادة</th>
            <th>النوع</th>
            <th>الاسم</th>
            <th>تاريخ الشراء</th>
            <th>اسم الناشر</th>
            <th>السعر</th>
            <th>تاريخ انتهاء الصلاحية</th> 
          </thead>
          <tbody>
            { student_own_profile_premium_content }
          </tbody>
        </table>
        { number_of_premium_content_pages > 9 &&
                <ReactPaginate
                breakAriaLabels="..."
                nextLabel={<i className='fa-solid fa-angles-right'></i>}
                previousLabel={<i className='fa-solid fa-angles-left'></i>}
                previousClassName='paginate-control-button previous'
                nextClassName='paginate-control-button next'
                pageRangeDisplayed={2}
                pageCount={number_of_premium_content_pages}
                onPageChange={ (e)=>  set_student_premium_content_page( e.selected )  }
                containerClassName='student-own-profile-paginate-container'
                pageClassName='single-page-element'
                renderOnZeroPageCount={null}
          />
        }
      </div>

      <h2 id="student_own_profile_exams_title">الاختبارات التي قمت بها :</h2>
        
      <div id="student_own_profile_exams_table_container">

      <table id="student_own_profile_exam_table">
        <thead>
          
            <th>المادة</th>
            <th>اسم الاختبار</th>
            <th>اسم الكاتب</th>
            <th>النتيجة</th>
            <th>الوقت المأخوذ</th>  
            <th>  تاريخ التقديم</th>  
        
        </thead>  
        
        <tbody>
          {student_own_profile_exams_table}
        </tbody>

        </table>
        <ReactPaginate
          breakAriaLabels="..."
          nextLabel={<i className='fa-solid fa-angles-right'></i>}
          previousLabel={<i className='fa-solid fa-angles-left'></i>}
          previousClassName='paginate-control-button previous'
          nextClassName='paginate-control-button next'
          pageRangeDisplayed={2}
          pageCount={number_of_student_exam_pages}
          onPageChange={ (e)=>  set_student_exam_page( e.selected )  }
          containerClassName='student-own-profile-paginate-container'
          pageClassName='single-page-element'
          />
      </div>
    
    </div>
    
  </>
  
  function go_to_exam_note_page(type, id , subject_name , Class)
  {
    let url = '/SingleExamView/' + subject_name + '/'+ Class + '/';
    if (type === 'note') url ='/SingleNoteView/' + subject_name + '/'+ Class + '/';
    // else url += 'NoteView/';

    url += id;
    
    nav(url);
  }
}