
import { useContext, useEffect, useState } from 'react';
import './ExamComponent.css';
import URLNotFound from '../URLNotFound/URLNotFound';
import axios from 'axios';
import Swal from 'sweetalert2';
import MathML2LaTeX from 'mathml2latex';
import katex from 'katex';
import ExamEnded from './ExamEnded';
import {
    BaseURL, GetExamQuestions, GetExamQuestionsImage,
    StudentRecordDoneExam
} from '../../API/APIs';
import { User } from '../../Context/Context';
import { useParams } from 'react-router-dom';
import { reference } from '../../data/SubjectNameReference';
// import 'mathlive/static.css';
// import 'quill/dist/quill.snow.css';

export default function ExamComponent() {

    let { package_id , Class , subject_name } = useParams();
 
    window.addEventListener('popstate', (ev) => {
        // ev.preventDefault();
        // ev.preventDefault();
     
        // let v =  window.confirm('هل انت متأكد من ترك الامتحان ؟');
        // console.log('v is ', v);/
    //   if(v)
    //     {
            
            // window.history.back();
            let up = 2000;
          while (up--) {
              clearInterval(up);
          }
          sessionStorage.clear();
          localStorage.clear();
            // }
        // window.confirm();

    });

    
    if (package_id == null) {
        return <>
            <URLNotFound />
        </>
    }

        return <ExamContent />;
}

// we send package id to get  questions and the right answer text and 
// chosen option and check out if the option is wrong or not , and explanation

  function ExamContent() {

    let { package_id , Class , subject_name } = useParams();
    const [user, _] = useContext(User); 
    window.katex = katex;
  
      const [exam_content, set_exam_content] = useState([]);
    
    
      let done_exam = sessionStorage.getItem('done_exam');
      
    const [is_exam_over, set_exam_over_state] = useState(done_exam ? true : false);
      
 
    let exam_timer_hours   = parseInt( sessionStorage.getItem('exam_timer_hours'));
    let exam_timer_minutes = parseInt( sessionStorage.getItem('exam_timer_minutes'));
    let exam_timer_seconds = parseInt( sessionStorage.getItem('exam_timer_seconds'));
    
    let teacher_name = sessionStorage.getItem('teacher_name');
    let exam_name =    sessionStorage.getItem('exam_name');
    
    let timer = new Date();
    
    let is_this_exam_done = (done_exam !== null);
      
    timer.setHours(exam_timer_hours);
    timer.setMinutes(exam_timer_minutes);
    timer.setSeconds(exam_timer_seconds);
    
    let interval_time = 2000;
    
      let time_passed = sessionStorage.getItem('time_passed'); // time in seconds
      if (!time_passed) time_passed = 0;

      sessionStorage.setItem('time_passed', time_passed);

      useEffect(() => { 
          
          let url = BaseURL + GetExamQuestions + package_id + '/';
   
          axios.get(url)
              .then(res => {
                  console.log('here is exam response ', res.data);
                  if (res.data.length > 0)
                      set_exam_content(res.data);
                  else {
                      let error = `<div style="color:red; font-size:120%; "> حدث خطأ أثناء جلب بيانات الاختبار , الرجاء المحاولة مجدداً </div>`
                      document.getElementById('exam_page_background_body').innerHTML = error;
                  }
              })
              .catch(err => {
                  let error = `<div style="color:red; font-size:120%; "> حدث خطأ أثناء جلب بيانات الاختبار , الرجاء المحاولة مجدداً </div>`
                  document.getElementById('exam_page_background_body').innerHTML = error;
              });
        
        if (  !isNaN(exam_timer_hours) && !is_this_exam_done ) // if a student select a timer 
        {
            interval_time = setInterval(() => { 
                    
                time_passed = Number.parseInt(sessionStorage.getItem('time_passed')) + 1;
              
                if (!sessionStorage.getItem('done_exam'))
                 sessionStorage.setItem('time_passed',time_passed);
              
                if (timer.getHours() == '0' && timer.getMinutes() == '0' && timer.getSeconds() == '0')
                {
                    document.getElementById('submit_answer_button').click();
                    clearInterval(interval_time);
                    return;
                }
                
                timer.setSeconds(timer.getSeconds() - 1);
                sessionStorage.setItem('exam_timer_hours', timer.getHours());
                sessionStorage.setItem('exam_timer_minutes', timer.getMinutes());
                sessionStorage.setItem('exam_timer_seconds', timer.getSeconds());
                
                let tt = document.getElementById('rest_time');
                
                if (tt)
                 tt.textContent = `${timer.getHours()} : ${timer.getMinutes()} : ${timer.getSeconds()}`;
           }, 1000);    
           
          }
        else 
        {
 
            interval_time = setInterval(() => {

                time_passed = parseInt(sessionStorage.getItem('time_passed')) + 1;
                if (!sessionStorage.getItem('done_exam'))
                    sessionStorage.setItem('time_passed', time_passed);
                else
                 clearInterval(interval_time);
            }, 1000);  
        }
          
       if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear()
        window.MathJax.typeset()
      }
      let ele = document.getElementById('flash_card_root');
      let but = document.getElementById('flash_card_button');
        
          if (ele)
              ele.style.display = 'none';
          if (but)
          {
              but.textContent = 'flash_card';
              but.style.display = 'none';
          }

          return () => {
            let up = 2000; 
            while (up--) 
                clearInterval(up);
          }
          
      } ,  []);
    
 
    let number_of_questions = 0;
    
    let st = new Set(); // for the number of remaining questions .
    
      let correct_answers = [];
      let correct_answer_text = [];
      let question_array = [];  // question text
      let explanation_array = [];
      let student_options_array = [];
      let student_options_text_array = [];
      let question_ids = [];


    let questions = exam_content.map((e, index) => {
      
        number_of_questions++;
        question_array.push(e.test_content);
        question_ids.push(e.id);
        correct_answers.push(e.right_answer);
        explanation_array.push(e.explanation);
   
        if (e.right_answer === 'A') correct_answer_text.push(e.option_A);
        if (e.right_answer === 'B') correct_answer_text.push(e.option_B);
        if (e.right_answer === 'C') correct_answer_text.push(e.option_C);
        if (e.right_answer === 'D') correct_answer_text.push(e.option_D);
        if (e.right_answer === 'E') correct_answer_text.push(e.option_E);


        return <div className={`question_body${index}`} >
          
            <div className='question_content'>
              <div className="question_number">: السؤال { index+1}  </div>
              <div className="question_part">
                      <div className={`question_text_content${index} ql-editor` }>   </div>
              </div>
                
            </div>

            <div className="question_options">

                {e.option_A && <div className={`A${index}`} onClick={() => choose('A', index)} > <div className='option_letter'>A</div>  <div className='option_text ql-editor'>  </div>  </div>}
                {e.option_B && <div className={`B${index}`} onClick={() => choose('B', index)} > <div className='option_letter'>B </div> <div className='option_text ql-editor'> </div>   </div>}
                {e.option_C && <div className={`C${index}`} onClick={() => choose('C', index)} > <div className='option_letter'>C </div> <div className='option_text ql-editor'> </div>   </div>}
                {e.option_D && <div className={`D${index}`} onClick={() => choose('D', index)} > <div className='option_letter'>D</div>  <div className='option_text ql-editor'>  </div>  </div>}
                {e.option_E && <div className={`E${index}`} onClick={() => choose('E', index)} > <div className='option_letter'>E </div> <div className='option_text ql-editor'>  </div>  </div>}
              
            </div>
 
        </div>
    });

      let date = new Date();
      
    useEffect(() => { // stored answers in localStorage and get images
        
        if (questions.length <= 0 ||   sessionStorage.getItem('done_exam') ) return;
       
             exam_content.forEach((e, index) => {

                let classes = [`.question_text_content${index} `, `.A${index} .option_text`, `.B${index} .option_text`, `.C${index} .option_text`, `.D${index} .option_text`, `.E${index} .option_text`,
                   `.question_body${index} .correct_option_is .option_text` ,`.question_body${index} .explanation_is`
                ];
    
                let correct_option_text = "";
                if (e.right_answer === 'A') correct_option_text = e.option_A;
                if (e.right_answer === 'B') correct_option_text = e.option_B;
                if (e.right_answer === 'C') correct_option_text = e.option_C;
                if (e.right_answer === 'D') correct_option_text = e.option_D;
                if (e.right_answer === 'E') correct_option_text = e.option_E;
    
                let content = [e.test_content, e.option_A, e.option_B, e.option_C, e.option_D, e.option_E , correct_option_text , e.explanation];
                
                let fields_names = ['test_content', 'option_A', 'option_B', 'option_C', 'option_D', 'option_E', 'none', 'explanation'];
               
                 for (let i = 0; i < classes.length; i++){
                    let d = document.querySelector(classes[i]);
    
                    if (d !== null) 
                        d.innerHTML = content[i];
                   
                    if (typeof window?.MathJax !== "undefined") {
                        window.MathJax.typesetClear()
                        window.MathJax.typeset()
                    }
    
                    if (index === exam_content.length - 1   )
                    {
                        let stp = document.getElementById('exam_page_background');
                        if (stp) stp.style.display = 'none';
                    }
                
    
                    // let url = BaseURL + GetExamQuestionsImage + e.id + `/`;
                    
                    // let ob = {
                    //     field_name: fields_names[i] 
                    // };
    
                    //   axios.get(url ,{params:ob})
                    //     .then(res => { 
    
                    //      let e = res.data;
    
                    //     //  if (content[i] === correct_option_text) is = true;
    
                    //      document.querySelectorAll(`${classes[i]} img`).forEach((ele, index) => { 
                    //         ele.src = BaseURL + e[index].images;
                    //      });
                            
                    //     //  if (is)
                    //     //  {
                    //     //     document.querySelector(`.correct_option_is .option_text`).innerHTML =
                    //     //     document.querySelector(`${classes[i]}`).innerHTML; 
                    //     //  }
                    //       if (index === exam_content.length - 1 && fields_names[i] =='explanation')
                    //       {
                    //             let stp = document.getElementById('exam_page_background');
                    //             if (stp) stp.style.display = 'none';
                    //       }
                    //  })
                    //     .catch(err => {
                    //         // console.log('error', err);
                    //         let error =`<div style="color:red; font-size:120%; "> حدث خطأ أثناء جلب بيانات الاختبار , الرجاء المحاولة مجدداً </div>`
                    //         document.getElementById('exam_page_background_body').innerHTML = error;
                    // } )
                }
    
             });
      
        for (let i = 0; i < questions.length; i++)
        {
            let curr_answer = sessionStorage.getItem(i);
        
            if (curr_answer === null) continue;
        
            choose(curr_answer, i);
        }

    if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear()
        window.MathJax.typeset()
        }

    }, [exam_content]);
      
    if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear()
        window.MathJax.typeset()
      }
      
      if (is_exam_over || sessionStorage.getItem('done_exam') ) 
      {
          student_options_array = [];

          for (let i = 0; i < exam_content.length; i++)
          {
              student_options_array.push(sessionStorage.getItem(i));
              let e = exam_content[i];
              if (sessionStorage.getItem(i) === 'A') student_options_text_array.push(e.option_A);
              if (sessionStorage.getItem(i) === 'B') student_options_text_array.push(e.option_B);
              if (sessionStorage.getItem(i) === 'C') student_options_text_array.push(e.option_C);
              if (sessionStorage.getItem(i) === 'D') student_options_text_array.push(e.option_D);
              if (sessionStorage.getItem(i) === 'E') student_options_text_array.push(e.option_E);
          }
        
        if (typeof window?.MathJax !== "undefined") {
            window.MathJax.typesetClear()
            window.MathJax.typeset()
          }
 
          return <ExamEnded
              questions={question_array}
              right_answers={correct_answers}
              right_answers_text = {correct_answer_text}
              explanations={explanation_array}
              student_options={student_options_array}
              student_options_text={student_options_text_array}
              subject_name={subject_name}
              Class={Class}
              package_id={package_id}
              question_ids = {question_ids}
              
          
              
          />;
      }
      
    return <>
        
        <div id="upper_part_exam_body"></div>
        {
            sessionStorage.getItem('done_exam') === null 
            && (
              <div id='timer_and_num_of_questions' >
                { !isNaN(exam_timer_hours ) && (<>
                    : <i className="fa-regular fa-clock"></i> الوقت المتبقي
                <div id="rest_time">{timer.getHours()} : {timer.getMinutes()} : {timer.getSeconds() }</div>
               </>)}
                :  عدد الأسئلة المتبقية
                <div id="rest_questions">
                    { number_of_questions - st.size }
                </div>
            </div>
            )
         }

        
        <div id="exam_root">

            <div id="exam_header">
            
                <div> المادة :{ reference[subject_name + "_" + Class] } </div>
                <div> اسم الاختبار :  {exam_name} </div>
                <div>  اسم الناشر : {teacher_name}</div>
                <div> التاريخ :  {`${date.getFullYear()} / ${date.getMonth()+1} / ${date.getDate()} `} </div>
                <div> معهد  SVI </div>
            
            </div>
            
                <div id="final_result"> </div>
            
            <div id="exam_body"> {questions} </div>
 
          <div onClick={send_answers} id="submit_answer_button"> إرسال الأجوبة </div>
            <div id="exam_page_background">
                <div id="exam_page_background_body">
                  جاري جلب بيانات الاختبار   ...
                    <div id="spinner"> </div>
                </div>
            </div>
        </div>
      </>

      
function choose(letter, ind)
{
    if (is_this_exam_done) return;

    student_options_array[ind] = letter; 
    
    let ll = ['A', 'B', 'C', 'D', 'E'];

    ll.forEach(e => {

        let curr = document.querySelector(`.question_options  .${e + ind} `);

        if (curr !== null)
        {
            if (st.has(`${e + ind}`))
                st.delete(`${e + ind}`);
            
            curr.style.backgroundColor = ' rgba(255, 255, 255, 0.921)  ';
            curr.style.border = 'none';
 
        }
    });

    sessionStorage.setItem(ind, letter);

    let curr = document.querySelector(`.question_options  .${letter + ind} `);
   
    st.add(`${letter + ind}`);
   
    document.getElementById('rest_questions').textContent = ` ${number_of_questions - st.size} `;
    
    curr.style.backgroundColor = 'rgba(216, 216, 216, 0.674)';
    if( window.innerWidth >750)
        curr.style.border = '4px solid rgba(0, 0, 0, 0.77)';
    else 
    curr.style.border = '2px solid rgba(0, 0, 0, 0.77)';

}

    function send_answers()
    {
 
        // first hide the submit answer button
        set_exam_over_state(true);

        document.getElementById('submit_answer_button').style.display = 'none';
        sessionStorage.setItem('done_exam', true);

        document.getElementById('timer_and_num_of_questions').style.display = 'none';
        document.getElementById('submit_answer_button').setAttribute('disabled', 'disabled');
       
        let number_of_correct_answers = 0;
        let number_of_un_selected_answers = 0;
        let number_of_all_answers = exam_content.length; 
      
             exam_content.forEach((e, index) => {
              
                if (e.right_answer === student_options_array[index]) // right answer
                    number_of_correct_answers++;
            }) 
            
        while (interval_time >= 0 )
        {
            clearInterval(interval_time);
            interval_time--;
        }

 window.scrollTo({
    top: 0,
    behavior: 'smooth'
 });
        
        let res = ((number_of_correct_answers * 100.0) / number_of_all_answers).toFixed(2);
 
        let url = BaseURL + StudentRecordDoneExam;
       
        let time = parseInt(sessionStorage.getItem('time_passed'));

        let passed_hours = Math.floor( time / 3600 );
        time %= 3600;

        let passed_minutes =  Math.floor( time / 60 );
        time %= 60;

        

        let passed_seconds = time;
 

        console.log('time sent', `${passed_hours}:${passed_minutes < 9 ? '0' + passed_minutes.toString() : passed_minutes}:${passed_seconds < 9 ? '0' + passed_seconds.toString() : passed_seconds}`);

        let obj = {
            student : user.user_id,
            subject_name: subject_name,
            exam_name: exam_name,
            exam_id: package_id,
            result: res,
            time_taken: `${passed_hours}:${passed_minutes < 9 ? '0'+passed_minutes.toString() : passed_minutes}:${passed_seconds<9? '0'+passed_seconds.toString() : passed_seconds}`,
            publisher_id : sessionStorage.getItem('publisher_id'),
        }

        axios.post(url , obj).then(
            // res => console.log('yes record done', res.data)
        )
        .catch( err => console.log('error StudentRecordDoneExam', err))    ;
     
        Swal.fire({
            title: " تم تصحيح إجاباتك بنجاح" ,
            text: `النتيجة : ${res} من 100 `,
            icon: "success",
            background: 'rgb(22 22 22)',
            color:'white',
            confirmButtonColor: 'rgba(0, 0, 0, 0.255)',
            confirmButtonText:'حسناً',
        });
        
    }
 
}


 