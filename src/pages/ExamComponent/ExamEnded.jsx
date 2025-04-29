import './ExamEnded.css';
import { Link } from 'react-router-dom';
import { BaseURL, BaseURLImages, GetExamQuestionsImage } from '../../API/APIs';
import axios from 'axios';
import { useEffect } from 'react';

export default function ExamEnded({ questions, right_answers, explanations, student_options
    , right_answers_text , student_options_text , subject_name , Class , package_id , question_ids })
{


    useEffect(() => {
        let but = document.getElementById('flash_card_button');
        if (but)
            but.style.display = 'block';
    }, []);
    
  
    let number_of_correct_answers = 0;
    let total_number_of_questions = questions.length;
    let total_number_of_un_chosen_answers = 0;
    let total_number_wrong_answers = 0;


    for (let i = 0; i < right_answers.length; i++)
    {
        if (right_answers[i] === student_options[i]) number_of_correct_answers++;
        else 
        {
            if ( !student_options[i] ) total_number_of_un_chosen_answers++;
            else
                total_number_wrong_answers++;
        }
    }

    let result = (number_of_correct_answers / total_number_of_questions) * 100;
    result = result.toFixed(2);
    
    let question_result_table = (
    
        <table id="question_result_table">
            <tr>
          <tr>
             <th>السؤال</th>   
             <th>الإجابة المختارة</th>   
             <th>الإجابة الصحيحة</th>   
             <th>النتيجة </th>   
         </tr>
          {
           questions.map((e, index) => {
               let color = '#470000';
               if (right_answers[index] === student_options[index]) color = '#003900';
               else if (!student_options[index]) color = 'rgb(53 57 0)';
               return <tr style={{backgroundColor:color}} >
                   <td className='question_number_cell'> {index+1} </td>
                   <td> { student_options[index] ? student_options[index] : '-' } </td>
                   <td> {right_answers[index]} </td>
                   <td> {right_answers[index] === student_options[index] ? 'صح' : "خطأ"    } </td>
           
               </tr>
               
           }  )          
          }
          </tr>
        </table>
 );
                    
    let result_color = '#003900';
     if( result < 50 )
        result_color = '#470000';
    return <>
        <div id="exam_ended_upper_part"></div>
        <div id="exam_ended_root">

            <div id="exam_ended_body_upper_part">
            <div id="result_container" style={{backgroundColor: result_color }}>
                النتيجة :  
              {" "+ result} 
            </div>
                
                </div>
            <div id="exam_ended_middle_section">
             
             <table id="result_summary_table">
                    <thead>
                    <th>النتيجة</th>
                    <th>العدد</th>
                    <th>النسبة</th>
                </thead>
 
                <tr>
                    <td>إجابات صحيحة</td>
                        <td>{ number_of_correct_answers}</td>
                        <td>{result}%</td>
                </tr>
                <tr>
                    <td>إجابات خاطئة</td>
                    <td>{ total_number_wrong_answers }</td>
                    <td> { ( 100 - result ).toFixed(2) }%</td>
                </tr>
                
                <tr>
                   <td>لم يتم الإجابة عنها</td>
                    <td>{total_number_of_un_chosen_answers}</td>
                        <td>{  ((total_number_of_un_chosen_answers / total_number_of_questions) *100) .toFixed(2) }% </td>
                    </tr>
                    <tr>
                        <td>المجموع الكلي</td>
                        <td>{ total_number_of_questions}</td>
                        <td>100%</td>
                    </tr>
            </table>
            </div>

            <div id="exam_ended_middle_part">

              
                <div id="exam_ended_important_links">

                    <div id="first_2_links_container">

                      <Link to={`/SingleExamView/${subject_name}/${Class}/${package_id}`} className='exam_ended_link' > إعادة الاختبار</Link>
                       &nbsp;&nbsp; &nbsp;&nbsp;    
                      <Link to ={`/TestSectionContent/${subject_name}/${Class}/1`} className='exam_ended_link'>اختيار اختبار آخر </Link> 

                    </div>
                
                </div>

            </div>


            {question_result_table}
 
       
     </div>
    </>
  
    
function close_question_details_preview()
{
    document.getElementById("question_details_preview").style.display = "none";

}
    
}