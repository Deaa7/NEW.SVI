import './SingleTestPackageView.css';
import   axios   from 'axios';
import {  useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState , useContext } from 'react';
import { reference } from '../../data/SubjectNameReference';
import {notification} from'../../utils/notification';
import {User}   from'../../Context/Context';
import {
  BaseURL, GetSinglePackageView, IncreaseNumberOfApps,
} from '../../API/APIs';
import { readCookieValue } from '../../utils/readCookieValue';
export default function SingleTestPackageView()
{
  const { id , Class , subject_name } = useParams(); 
  const [ user , _ ] = useContext(User);
  const nav = useNavigate();
   const [current_timer, set_timer] = useState('none');
   const [ current_package_content , set_current_package_content] = useState([]);
  let current_count_down = 10;
  
    const reg = /^[0-9]+$/;
    
  if (!reg.test(id))
 
    nav('/no such url' , {replace : true } );
  
  useEffect(() => {

    sessionStorage.clear();  
    localStorage.clear();
    initializePageView();

    let url = BaseURL+GetSinglePackageView+id+`/`;
 
    axios.get(url).then(response => {
      if (response.data.length <= 0)
        nav('/no such url' , {replace : true } ); 
      else
      {
        set_current_package_content(response.data);
        sessionStorage.setItem('publisher_id', response.data[0].publisher_id);
      }
    })
      .catch(err =>
      {
        console.log('err in package info ', err);
        nav('/no such url' , {replace : true });
      }
     );
  }
    , [])
  
 
  let arabic_subject_name = ''; // subject name in arabic
  let teacher_name = '';
  let exam_name = '';

  ////////////////////////////////////

  let package_price = 0; 
  let is_premium = false;
  
  let package_detail_box_content = current_package_content.map(e => {
      
    package_price = e.price;
    teacher_name = e.publisher_name;
    arabic_subject_name = reference[subject_name + "_" + Class];
    exam_name = e.package_name;
    
    if (e.price > 0) is_premium = true;
	  
    let unit_array = e.units.split(',').sort((e, e2) => e.length - e2.length).map(e => {
      return <div className='single_unit'>{e}</div>
    });
    return <>

      <div id="package_detail_row1" >
        <div> اسم الاختبار :  {e.package_name} </div>
        <div> اسم المادة :  {arabic_subject_name} </div>
      </div>
    
      <div id="package_detail_row2">
        <div className='single_unit_title'>  مواضيع الاختبار :</div>
        {unit_array}
      </div>

      <div id="package_detail_row3">
        <div> عدد الاسئلة : {e.number_of_questions}</div>
        <div > تاريخ النشر : {e.date_added}</div>
      </div>
      
      <div id="package_detail_row4">
        <div> عدد مرات التقديم : {e.number_of_apps}</div>
        <div>السعر : {e.price > 0 ? e.price + " ل.س " : 'مجاني'}</div>
      </div>
    </>
  });

  let interval_id = -1;  
  return <div id="single_package_first_root">
          <div id="single_page_upper_part"></div>
    
    <div id="single_package_root">
      
          <h2 id="package_details"> تفاصيل الاختبار :</h2>
            
      <div id="package_detail_box">
        { current_package_content.length <=0 &&  <div id="getting_exam_info_spinner">
          جاري جلب بيانات الاختبار  
          <div id="spinner"></div>
        </div> }
                   {package_detail_box_content}
            </div>  
      <div id="package_detail_lower_part">
   
        
      {!user.is_teacher && <>
 
          {current_package_content.length > 0 && <div id="take_test_button" onClick={go_to_confirm_box}> تقديم هذا الاختبار</div>
          }
      

          <div id="background_black" onClick={hide_black_background}>
          </div>
          <div id="confirm_box">

            <div id="confirm_close" onClick={hide_black_background}>X</div>

 
            <div id="confirm_title">تقديم الاختبار الآن </div>
        

            <div id="confirm_box_body">
           
              <div id="confirm_payment_section">
           
                <div id="confirm_price">
                  {
                    (is_premium ? "تكلفة الاختبار : " + package_price + " ل.س " : "الاختبار مجاني")
                  }
                </div>

              </div>
              <div id="timer_confirm_box">
                اختار مؤقت : <br />
                <select name="timer" id="select_timer" onChange={(e) => set_timer(e.target.value)}>
                  <option value="none" selected >لا أريد مؤقت</option>
                  <option value="30"  > نصف ساعة </option>
                  <option value="60"> ساعة </option>
                  <option value="90"> ساعة و نصف </option>
                  <option value="120"> ساعتان </option>
                  <option value="150"> ساعتان و نصف </option>
                  <option value="180"> ثلاث ساعات </option>
                  <option value="210">  ثلاث ساعات و نصف</option>
                  <option value="240">  اربع ساعات  </option>
                </select>
              </div>

              <div id="start_exam_button_and_count_down_container">

                <div id="count_down">
                  سيبدأ الاختبار بعد : {current_count_down} ثواني
                </div>
                <div id="start_exam_button" onClick={start_exam}>
                  أبدا الاختبار
                </div>
              </div>
            </div>

          </div>
        
          </>}  

        </div>
       
    </div>
  </div>
  
  function initializePageView()
      {
      window.scrollTo({
         top: 0,
         behavior: 'smooth'
      });
    }

  function hide_black_background()
  {
    clearInterval(interval_id);
    current_count_down = 10;
   
    document.getElementById('count_down').textContent = `سيبدأ الاختبار بعد : ${current_count_down} ثواني`;
    document.getElementById('count_down').style.opacity='0';
    document.getElementById('count_down').style.color='white';
    interval_id = -1;
    
    document.getElementById('select_timer').removeAttribute('disabled');
    document.getElementById('select_timer').style.cursor = 'initial';
    document.getElementById('select_timer').style.opacity = '1';

    let ele = document.getElementById('single_package_exam_pay_button');
    if (ele)
    {
      ele.removeAttribute('disabled');
      ele.style.cursor = 'pointer';
      ele.style.opacity = '1';
    }
  
    let now = document.getElementById('background_black');
    now.style.display = 'none';
    now =document.getElementById('confirm_box');
    now.style.animationName = 'none';
    now.style.display = 'none';
    
  }
  
  function go_to_confirm_box() {

    if (!readCookieValue('refresh_token') ) {
       do_not_have_account(); // checks for account
      return;  
    }

    let now = document.getElementById('background_black');

    now.style.display = 'initial';
    now = document.getElementById('confirm_box');

    if( window.innerWidth > 750 )
    now.style.animationName = 'show_confirm_box';
    now.style.display = 'block';

  }
  function do_not_have_account()
  {
    notification('يجب عليك أن تسجل الدخول بحسابك', 'toast_error');
  }

 
  function start_exam()
  {
    if (interval_id > 0) return ;
    
    clearInterval(interval_id);

    document.getElementById('select_timer').setAttribute('disabled', 'disabled');
    document.getElementById('select_timer').style.cursor = 'not-allowed';
    document.getElementById('select_timer').style.opacity = '0.7';

    let ele = document.getElementById('single_package_exam_pay_button');
    if (ele)
    {
      ele.setAttribute('disabled', 'disabled');
      ele.style.cursor = 'not-allowed';
      ele.style.opacity = '0.7';
    }


    let clr = document.getElementById('count_down');

     clr.style.opacity = '1';

    interval_id = setInterval(() => {
      
      current_count_down--;

      if (current_count_down <= 5)
      {
        clr.style.color = 'red';
      }
      if (current_count_down == -1)
        {
          clearInterval(interval_id);
          let number = parseInt(current_timer);
          
          // sessionStorage.setItem('package_id', id);
          sessionStorage.setItem('exam_timer_hours', number/60);
          sessionStorage.setItem('exam_timer_minutes', number%60);
          sessionStorage.setItem('exam_timer_seconds', 0);
          
          // sessionStorage.setItem('arabic_subject_name', reference[subject_name +"_"+Class]);
          sessionStorage.setItem('teacher_name', teacher_name);
          sessionStorage.setItem('exam_name', exam_name);
          
        increaseNumberOfApps();
      
        nav('/examPage/' + subject_name +'/'+ Class + '/' + id);
          return;
        }
        document.getElementById('count_down').textContent = `سيبدأ الاختبار بعد : ${current_count_down} ثواني`;
      }, 1000)
       
  }

  function increaseNumberOfApps() { 
    
    let url  = BaseURL+IncreaseNumberOfApps+id+`/`;
    axios.put(url) 
      .catch(err => console.log("error increaseNumberOfApps ",err));
  }
 
}