import { useEffect, useState } from 'react';
import './TeacherPreview.css';
import TeacherList from './TeacherList/TeacherList';
// import ScrollTrigger from "react-scroll-trigger";

export default function TeacherPreview()
{

    const [{ Class , subject_name , city ,sort_by }, set_filter_state] = useState(
    {
        Class :'12',
        city :'all',
        subject_name: 'عرض الكل',
        sort_by:'none',
    }
   )

    let previous_state = {
        Class: Class,
        city: city,
        subject_name: subject_name,
        sort_by:sort_by,
    }

    let subject_array = ['عرض الكل','رياضيات', 'فيزياء', 'كيمياء', 'علوم', 'عربي', 'إنكليزي', 'فرنسي', 'وطنية', 'ديانة'];
    let subject_value = ['عرض الكل','math','physics','chemistry','science','arabic','english','france','national','islam']
    
    let _12_subject = (
        subject_array.map((e, index) => {
            let style = {};
            if (!index)
                style = { outline: '2px solid rgb(150, 150, 150)' };
             return <button className='filter_subject_name' onClick={ (d)=>change_subject(subject_value[index] , d.target) } key={index} style={style} > {e} </button>         
        } )
      );

    subject_array = ['عرض الكل','رياضيات', 'فيزياء و كيمياء', 'عربي', 'علوم', 'اجتماعيات', 'انكليزي', 'فرنسي', 'ديانة'];
  
    let subject_value2 = ['عرض الكل', 'math', 'physics_chemistry', 'arabic', 'science', 'geography', 'english', 'france', 'islam']
  
    let _9_subject = (
        subject_array.map((e, index) => {
            let style = {};
            if (!index)
                style = { outline: '2px solid rgb(150, 150, 150)' };

            return <button className='filter_subject_name' onClick={(d) => change_subject(subject_value2[index], d.target)} key={index}   style={style} > {e} </button>         
         } )
       );
 
    return <>
        
            <div id="teacher_preview_root">
         <button id="teacher_preview_show_hide_filter" onClick={show_hide_filter} > إظهار الفلترة  &nbsp;
         <i className="fa-solid fa-sliders"></i>
        </button>
         <div id="teacher_preview_filter_root">
             <div id="teacher_name_class_container">
              
                 <div id="class_selection_container">
                     <span>   الصف : </span>
                     <button id="teacher_class_12"
                         onClick={() => { change_class('12') }}
                      > بكلوريا </button>
                     <button id="teacher_class_9"
                         onClick={ ()=>change_class('9')  }
                      >  تاسع </button>
 
                 </div>

                 
                 <div id="teacher_city_container">
                 
                     <label htmlFor="syrian_cities_select" id="teacher_preview_city_title">المحافظة :</label>
                     <select name="syrian_cities" id="syrian_cities_select" onChange={ (e) =>change_city(e.target.value) }>
                         <option value="all">عرض الكل</option>
                         <option value="حمص">حمص</option>
                         <option value="حماة">حماة</option>
                         <option value="دمشق">دمشق</option>
                         <option value="ريف دمشق">ريف دمشق</option>
                         <option value="سويداء"> سويداء</option>
                         <option value="حلب">حلب</option>
                         <option value="إدلب">إدلب</option>
                         <option value="رقة">رقة</option>
                         <option value="دير الزور">دير الزور</option>
                         <option value="اللاذقية">اللاذقية</option>
                         <option value="طرطوس">طرطوس</option>
                         <option value="قنيطرة">قنيطرة</option>
                     </select>
                 </div>

             </div>
             
             <div id="subject_filter_bar">
                 <span> المادة : </span>
                  {Class == '12' && _12_subject}
                  {Class == '9' && _9_subject}
             </div>

             <div id="teacher_preview_sort_bar">
                  <div className='sort_by_title'>ترتيب حسب : </div>
                  <button className='teacher_name' onClick={ () =>change_sort_by('teacher_name') } > الاسم </button>
                  <button className='number_of_likes' onClick={ () =>change_sort_by('number_of_likes') } > الشعبية </button>
                  <button className='number_of_exams'onClick={ () =>change_sort_by('number_of_exams') } > عدد الاختبارات </button>
                  <button className='number_of_notes' onClick={ () =>change_sort_by('number_of_notes') } > عدد النوط </button>

             </div>
        
            </div>
            
            <TeacherList subject_name={subject_name}
                city={city} Class={Class}
                sort_by={sort_by}  /> 
            </div>
 
 </>

function show_hide_filter()
{
    let ele = document.getElementById('teacher_preview_filter_root');
    if (ele) 
    {
        if (ele.style.display == 'none' ||ele.style.display.length <= 0 ) 
        {
            ele.style.display = 'block';
            document.getElementById('teacher_preview_show_hide_filter').textContent = 'إخفاء الفلترة';
        }
        else
        {
         ele.style.display = 'none';
         document.getElementById('teacher_preview_show_hide_filter').innerHTML = 'إظهار الفلترة &nbsp;  <i class="fa-solid fa-sliders"></i>';
        }
    }
}
 function change_class(Class)
 {
     let id = 'teacher_class_' + Class;
     document.querySelectorAll('#teacher_class_12 , #teacher_class_9').forEach(e => {
         e.style.outline = 'none';
     })
    document.getElementById(id).style.outline = '2px solid rgb(150, 150, 150)';
     set_filter_state({...previous_state, Class:Class , sort_by:'none' , subject_name:'عرض الكل' }); 
}
function change_subject(subject, element)
{
    set_filter_state({ ...previous_state, subject_name: subject });
    document.querySelectorAll('.filter_subject_name').forEach(e => {
        e.style.outline = 'none';
    })
    element.style.outline = '2px solid rgb(150, 150, 150)';
}

function change_city(city)
{
  set_filter_state({ ...previous_state, city: city });
}

function change_sort_by(sort_by)
{
    document.querySelectorAll('#teacher_preview_sort_bar button').forEach(e => {
        e.style.outline = 'none';
    })

    document.querySelector(`.${sort_by}`).style.outline = '2px solid rgb(0 255 217)';
    

    set_filter_state({ ...previous_state, sort_by: sort_by });
}








































































































}
