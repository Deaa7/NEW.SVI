import { useEffect, useState , useRef } from "react";
import "./TeacherList.css";
import axios from 'axios';
import { BaseURL, TeacherPreview , BaseURLImages } from "../../../API/APIs";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { notification } from '../../../utils/notification';
import TeacherMale from '../../../assets/TeacherMale.png';
import TeacherFemale from '../../../assets/TeacherFemale.png';
export default function TeacherList({ subject_name, city, Class, sort_by , teacher_name }) {

  let nav = useNavigate();

  let [[teacher_preview_rows , number_of_teacher_preview_rows], set_teacher_preview_rows] = useState([ [] , 0 ]);
  let[  count , set_count ] = useState(0);

  let teacherLoading = useRef( true);
  useEffect(() => {


    teacherLoading.current = true;

    let but = document.querySelector('.teacher-preview-home-paginate .next a');
    if (but) 
    {
      but.textContent = '';
      but.innerHTML = "<i class='fa-solid fa-angles-right'></i>";
    }
    
    let url = BaseURL + TeacherPreview;
    let obj = {
      subject_name: subject_name,
      city: city,
      Class: Class,
      sort_by:sort_by,
      teacher_name: teacher_name,
      limit: 7, 
      count: count + 1,
    }

    let ele = document.getElementById('teacher_list_background');
    if (ele)
      ele.style.display = 'flex';

    axios.get(url, { params: obj })
      .then((res) => { 
        // console.log('here is it', res.data);
        set_teacher_preview_rows([ res.data.teacher_preview ,res.data.number  ]);
        if(ele)
          ele.style.display = 'none';
        teacherLoading.current = false;
      })
      .catch(err => {
        teacherLoading.current = false;
        console.log('teacher list error', err);
        notification('حدث خطأ في جلب بيانات المعلمين', 'toast_error');
      } );
    
  }, [ subject_name , Class , city , teacher_name , count ])
  

  let content = "";
  if (  !teacherLoading.current && teacher_preview_rows.length <=0 )
  
    content = (<div className="no-result-case" > لا يوجد نتائج  <i class="fa-regular fa-face-sad-tear"></i>  </div>);
  
  else if (teacher_preview_rows)
  
    content = teacher_preview_rows.map((e, index) => {

         return  <div className="teacher_list_row" onClick ={ () => nav('/TeacherProfile/' + e.user_id)  } >
              <div className="number">{index + 1 + 7 * count}.</div>
              <div className ='teacher_info_section'>
               <img src ={  e.image  ?  BaseURLImages + e.image : e.gender === 'M' ? TeacherMale : TeacherFemale   } className="teacher_image"/>
               <div className ="for_flex"> 
               <div className="teacher_full_name"> {e.full_name} </div>
               
               <div className="teacher_subjects_name"> {subject_styling(e.studying_subjects)} </div> 
               
                        <div className="teacher_class"> { e.Class == '12' ? 'بكلوريا' : e.Class == '9' ? 'تاسع' : "تاسع و بكلوريا"  } </div>
                </div>
              </div>
              
               <div className = "rest_info">
                    <div className="name"> المدينة : {e.city} </div>
                  <div className="name"> عدد الاختبارات :{e.number_of_exams} </div>
                  <div className="name"> عدد النوط : {e.number_of_notes} </div>
{/* 
                   <div className="name">
                    عدد الإعجابات&nbsp;
                    <i style=  {{color: "#c6c2c2"}}  
                    className="fa-solid fa-thumbs-up"></i>
                    : {e.number_of_likes}
                  </div> */}
               </div>

             </div>
         
     
  
    
    });
  
  let n = Math.floor(number_of_teacher_preview_rows / 7);
  if (n % 7) n++;

  return (
    <>
  
      <div id="teacher_list_root">
        <div id="teacher_list_background">
          <div id="teacher_list_background_content">
          جاري جلب النتائج
          <div id="spinner"></div>
            </div>
        </div>

        <div id="teacher_list_items">{ content}</div>
        {number_of_teacher_preview_rows > 7 && 
          <ReactPaginate
          breakAriaLabels="..."
          nextLabel={<i className='fa-solid fa-angles-right'></i>}
          previousLabel={<i className='fa-solid fa-angles-left'></i>}
          previousClassName='paginate-control-button previous'
          nextClassName='paginate-control-button next'
          pageRangeDisplayed={2}
          pageCount={n}
          onPageChange={  (e)=> set_count(e.selected)  }
          containerClassName='teacher-preview-home-paginate'
          pageClassName='single-page-element'
      />   
        }
      </div>
    </>
  );

 
    function subject_styling(subject_name)
    {
      
        if (subject_name == "math")
            return  <div className="math_subject">  رياضيات 
                    <i className="fa-solid fa-square-root-variable"></i></div>  ;
          else if (subject_name == "physics")
            return   <div className="physics_subject"> فيزياء
                    <i className="fa-solid fa-bolt-lightning"></i></div> ;
          else if (subject_name == "chemistry")
            return   <div className="chemistry_subject"> كيمياء
                    <i className="fa-brands fa-react"></i></div> ;
          else if (subject_name == "science")
            return  <div className="science_subject"> علوم  
                    <i className="fa-solid fa-heart-pulse"></i></div> ;
          else if (subject_name == "english")
            return   <div className="english_subject"> إنكليزي
                    <i className="fa-solid fa-pen-fancy"></i></div> ;
          else if (subject_name == "france")
            return   <div className="france_subject"> فرنسي  
                    <i className="fa-solid fa-signature"></i></div> ;
          else if (subject_name == "islam")
            return   <div className="islam_subject"> ديانة إسلامية
                    <i className="fa-solid fa-mosque"></i></div> ;
          else if (subject_name == "arabic")
            return   <div className="arabic_subject"> عربي  
                    <i className="fa-solid fa-feather"></i></div> ;
          else if (subject_name == "national")
            return   <div className="national_subject"> وطنية  
            <i className="fa-solid fa-people-group"></i></div> ;
          else if (subject_name == "physics_chemistry")
            return   <div className="physics_chemistry_subject"> فيزياء و كيمياء 
                    <i className="fa-solid fa-cubes"></i></div>   ;
          else if (subject_name == "geography")
            return   <div className="geography_subject"> اجتماعيات  
                    <i className="fa-brands fa-pagelines"></i></div>;
    }

 

}
