
import { useParams } from 'react-router-dom';
import {useContext , useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './EditingTeacherProfile.css';
import { User } from '../../Context/Context';
import { BaseURL, BaseURLImages, TeacherProfileInfo, UpdateTeacherProfile } from '../../API/APIs';
import {notification} from '../../utils/notification';
import { first_last_name_verification  } from '../../utils/validations';
export default function EditingTeacherProfile()
{
    let {id} = useParams();
    let [ user , _ ] = useContext(User);
	let nav = useNavigate();
	let phone_number = useRef();
	let another_phone_number = useRef();
	let teaching_in_school = useRef();
	let teaching_in_institutions = useRef();
	let bio = useRef();
	let facebook_link = useRef();
	let instagram_link = useRef();
	let whatsapp_link = useRef();
	let telegram_link = useRef();
	let studying_subjects = useRef();
	let city = useRef();
	let Class = useRef();
	let gender = useRef();
	let image = useRef();
	
	
	if (Number.parseInt(id) != user.user_id)
		nav('/404_not_found' , {replace : true} );
	
	useEffect(() => {
		console.log('here is user', user);
		if( user.user_id < 0 ) return ;
		
		let url = BaseURL + TeacherProfileInfo + user.user_id.toString() + '/';
		
		axios.get(url).then(res => {
		   phone_number.current.value = res.data.phone_number;
		   another_phone_number.current.value = res.data.another_phone_number;
		   teaching_in_school.current.value = res.data.teaching_in_school;
		   teaching_in_institutions.current.value = res.data.teaching_in_institutions;
		   bio.current.value = res.data.bio;
		   facebook_link.current.value = res.data.facebook_link;
		   instagram_link.current.value = res.data.instagram_link;
		   whatsapp_link.current.value = res.data.whatsapp_link;
		   telegram_link.current.value = res.data.telegram_link;
		   studying_subjects.current.value = res.data.studying_subjects;
		   city.current.value = res.data.city;
		   Class.current.value = res.data.Class;
			if (res.data.image)
			{
                  
				image.current.FILES = res.data.image;
			   
				let ele = document.getElementById('image_preview_image');

				if (ele) ele.src =  BaseURLImages + res.data.image ;
			}
		   
		})
		.catch(err => {
		  console.log('here is error in updating the teacher profile ', err);
		})

	}  )

    return <>
	<div id = "editing_teacher_upper_part" > </div>
     <div id="editing_teacher_profile_root">
			<p id="editing_teacher_profile_title" >  صفحة تعديل بياناتي الشخصية </p>
	 
	 <form id="teacher_profile_editing_form" onSubmit={ (e) => open_editing_teacher_profile_process_section(e)  } >
	 
	    {/* <div id = "first_name_container"  className = "input_container" >
		
           <label htmlFor ='first_name_input' id = "first_name_label" className='edit_teacher_profile_input_label' > الاسم الأول </label>
				<input type="text" id='first_name_input' className="input_field" ref={first_name}
					minLength={1}
					maxLength={50}
					onChange={ change_first_name }
				/>
	
				<p id="first_name_error_text" className='error_text' ></p>
		</div>
		
		 <div id = "last_name_container"  className = "input_container" >
		
           <label htmlFor = 'last_name_input' id = "last_name_label"  className='edit_teacher_profile_input_label'> الاسم الأخير </label>
				<input type="text" id='last_name_input' className="input_field" ref={last_name}
					onChange={change_last_name}
					minLength={1}
					maxLength={50}
				/>
		   <p id="last_name_error_text" className='error_text' ></p>
		
		</div> */}

		 <div id = "phone_number_container"  className = "input_container" >
		
           <label htmlFor = 'phone_number_input' id = "phone_number_label"   className='edit_teacher_profile_input_label' > رقم الهاتف </label>
				<input type="text" id='phone_number_input' className="input_field" ref={phone_number}
					onChange={change_phone_number}
					minLength={10}
					maxLength={10}
				/>
		
			<p id="phone_number_error_text" className='error_text' ></p>
		
		 </div>
				

		 <div id = "another_phone_number_container"  className = "input_container" >
		
           <label htmlFor = 'another_phone_number_input' id = "another_phone_number_label"  className='edit_teacher_profile_input_label'> رقم هاتف إضافي </label>
					<input type="text" id='another_phone_number_input' className="input_field" ref={another_phone_number}
						onChange={change_another_phone_number}
						minLength={10}
						maxLength={10}
					/>
		
			<p id="another_phone_number_error_text" className='error_text' ></p>
		
		 </div>
				
		 <div id = "teaching_in_school_container"  className = "input_container" >
		
           <label htmlFor = 'teaching_in_school_input' id = "teaching_in_school_label"  className='edit_teacher_profile_input_label'> المدرسة التي أُدرس فيها  </label>
					<input type="text" id='teaching_in_school_input' className="input_field" ref={teaching_in_school}
						onChange={change_teaching_in_school}
						minLength={2}
						maxLength={150}
					/>
		
			<p id="teaching_in_school_error_text" className='error_text' ></p>
		
		</div>

		 <div id = "teaching_in_institution_container"  className = "input_container" >
		
           <label htmlFor = 'teaching_in_institution_input' id = "teaching_in_institution_label" className='edit_teacher_profile_input_label' > المعهد الذي أُدرس فيه  </label>
					<input type="text" id='teaching_in_institution_input' className="input_field" ref={teaching_in_institutions}
						onChange={change_teaching_in_institution}
						minLength={2}
						maxLength={150}
					/>
		
			<p id="teaching_in_institution_error_text" className='error_text' ></p>
					
		</div>

		<div id = "bio_container"  className = "input_container" >
		
           <label id = "bio_label"  htmlFor = 'bio_input'  className='edit_teacher_profile_input_label' > النبذة الذاتية  </label>
		  <textarea name="bio_text_area" id="bio_text_area" className = "input_field" ref={bio} ></textarea>
		
		   <p id="bio_error_text" className='error_text' ></p>
		
		</div>
     <div id = "image_container"  className = "input_container" >
		
		<label id = "image_label"  htmlFor = 'image_input'  className='edit_teacher_profile_input_label'>   الصورة   </label>  
		
					<button id="upload_image_button_interface" onClick ={ (e) =>open_image_input(e) }  className='input_field'> رفع صورة &nbsp;
					 <i className="fa-solid fa-upload" ></i>
					</button>
		<input type="file" id="image_input"   className = "input_field" accept='image/*' ref={image}  onChange = { change_image } />
		 <div id="editing_teacher_profile_image_preview_details" >
		   <div id="teacher_image_name">
		   </div>				
		   
		   <div id="teacher_image_size">
			</div>	

			<p id="image_error_text" className='error_text' ></p>
						
					</div>
					<img src="none" id="image_preview_image" alt="no-image" />
	   </div>
		 <div id = "facebook_link_container"  className = "input_container" >
		
		  <label htmlFor = 'facebook_link_input' id = "facebook_link_label"  className='edit_teacher_profile_input_label' >  رابط الفيس بوك  </label>
		  <input type="text" id = 'facebook_link_input' className = "input_field"  ref={facebook_link} />
	 
	    </div> 		

		<div id = "instagram_link_container"  className = "input_container" >
		
		<label htmlFor = 'instagram_link_input' id = "instagram_link_label"   className='edit_teacher_profile_input_label'>  رابط الانستاغرام  </label>
		<input type="text" id = 'instagram_link_input' className = "input_field" ref={instagram_link} />
   
		</div>

		<div id="whatsapp_link_container" className="input_container" >
		
		<label htmlFor = 'whatsapp_link_input' id = "whatsapp_link_label"  className='edit_teacher_profile_input_label'>   رقم تواصل واتس اب  </label>
		<input type="text" id = 'whatsapp_link_input' className = "input_field" ref={whatsapp_link} />
   
		</div> 

		<div id="telegram_link_container" className="input_container" >
		
		<label htmlFor = 'telegram_link_input' id = "telegram_link_label"  className='edit_teacher_profile_input_label' >   رابط تواصل تيليغرام  </label>
		<input type="text" id = 'telegram_link_input' className = "input_field" ref={telegram_link} />
   
        </div> 			
			
		
		<div id = "studying_subjects_container"  className = "input_container" >
		
           <label id = "subject_studying_label"  htmlFor = 'subject_studying_input'  className='edit_teacher_profile_input_label'> المواد التي أدرسها  </label>
		   <select name ="subject_studying_input" id = "subject_studying_select" className='input_select' ref={studying_subjects} >
		          <option value="math">رياضيات</option>
                   <option value="physics">فيزياء</option>
                   <option value="chemistry">كيمياء</option>
                   <option value="physics_chemistry">فيزياء و كيمياء </option>
                   <option value="science">علوم</option>
                   <option value="islam">ديانة إسلامية</option>
                   <option value="arabic">عربي</option>
                   <option value="english">إنكليزي</option>
                   <option value="france">فرنسي</option>
		   </select>
		</div>


		<div id = "city_container"  className = "input_container" >
		
           <label id = "city_label"  htmlFor = 'city_select'  className='edit_teacher_profile_input_label'>   المدينة  </label>
		   <select name ="city_input" id = "city_select" className='input_select' ref={city} >
		          <option value="حمص العادية"> حمص العادية</option>
                   <option value="حماة">حماة  ( ريف حمص )</option>
                   <option value="دمشق">دمشق</option>
                   <option value="ريف دمشق">ريف دمشق</option>
                   <option value="سويداء"> سويداء</option>
                   <option value="حلب">حلب</option>
                   <option value="إدلب">إدلب</option>
                   <option value="رقة">رقة</option>
                   <option value="دير الزور">دير الزور</option>
                   <option value="اللاذقية">اللاذقية</option>
                   <option value="طرطوس">طرطوس</option>
		   </select>
	 
		</div>		

		<div id = "class_container"  className = "input_container" >
		
           <label id = "class_label"  htmlFor = 'class_select'  className='edit_teacher_profile_input_label'>   الصف   </label>
		   
		   <select name ="class_input" id = "class_select" className='input_select' ref={Class} >
		     <option value ="12"> بكلوريا </option>
			 <option value ="9"> تاسع </option>
			 <option value ="9_12"> تاسع و بكلوريا </option>
		   </select>
	 
		</div>
		
		{/* <div id = "gender_container"  className = "input_container" >
		
           <label id = "gender_label"  htmlFor = 'gender_select'  className='edit_teacher_profile_input_label'>   الجنس   </label>
		   
		   <select name ="gender_input" id = "gender_select" className='input_select' ref={gender} >
		     <option value ="M"> ذكر </option>
			 <option value ="F"> أنثى </option>
		   </select>
	 
		</div> */}
		
		 <div id="submit_button_container" >
			<input type="submit" id="editing_teacher_submit_data_button" value="إرسال البيانات" className = "input_field"    />
		 </div>
				
		  <div id="editing_teacher_profile_process_section">
               <div id="process_title">	 جاري تحليل و إرسال البيانات  </div>
				<div id="spinner"></div>	
		  </div>
				
	 </form>
	 
	 </div>
     
	</>
	
function open_editing_teacher_profile_process_section(e)
{
	e.preventDefault();	

	let ele = document.getElementById('editing_teacher_profile_process_section');
	if (ele) ele.style.display = 'flex';

	setTimeout( editing_teacher_profile_send_data , 1000);

}

function editing_teacher_profile_send_data() {

	let obj = new FormData();

	obj.append('phone_number', phone_number.current.value);
	obj.append('another_phone_number', another_phone_number.current.value);
	obj.append('teaching_in_school', teaching_in_school.current.value);
	obj.append('teaching_in_institutions', teaching_in_institutions.current.value);
	obj.append('bio', bio.current.value);
	obj.append('facebook_link', facebook_link.current.value);
	obj.append('instagram_link', instagram_link.current.value);
	obj.append('whatsapp_link', whatsapp_link.current.value);
	obj.append('telegram_link', telegram_link.current.value);
	obj.append('studying_subjects', studying_subjects.current.value);
	obj.append('city', city.current.value);
	obj.append('Class', Class.current.value);

	if (image.current.files[0])
	obj.append('image', image.current.files[0]);
  
	let url = BaseURL + UpdateTeacherProfile + user.user_id.toString() + '/';

	axios.post(url, obj)
		.then(res => {
			// console.log('res update is ', res.data);
			let ele = document.getElementById('editing_teacher_profile_process_section');
			if (ele) ele.style.display = 'none';
			notification('تم تعديل بياناتك بنجاح', 'toast_correct');
		})
		.catch(err => {
			console.log('update error: ', err);	
			let ele = document.getElementById('editing_teacher_profile_process_section');
			if (ele) ele.style.display = 'none';
			notification('حدث خطأ في إرسال البيانات , حاول مجدداً لاحقاً', 'toast_error');
		})

}
	
// function change_first_name() {
	
// 		let verdict = first_last_name_verification(first_name.current.value);
// 		if( verdict ) verdict = '*' + verdict;
// 		document.getElementById('first_name_error_text').textContent = verdict;
// }

// function change_last_name() {

// 	let verdict = first_last_name_verification(last_name.current.value);
// 	if( verdict ) verdict = '*' + verdict;
// 	document.getElementById('last_name_error_text').textContent = verdict;
// }

function change_phone_number()
{
	let verdict = first_last_name_verification(phone_number.current.value);
	if( verdict ) verdict = '*' + verdict;
	document.getElementById('phone_number_error_text').textContent = verdict;
}

function change_another_phone_number()
{
	let verdict = first_last_name_verification(another_phone_number.current.value);
	if( verdict ) verdict = '*' + verdict;
	document.getElementById('another_phone_number_error_text').textContent = verdict;
}

function change_teaching_in_school()
{

}

function change_teaching_in_institution()
{

}

function change_image(){

	let ele = document.getElementById('image_preview_image');
	let name = document.getElementById('teacher_image_name');
	let size = document.getElementById('teacher_image_size');
	document.getElementById('image_error_text').textContent = '';
	let file = image.current.files[0];
	if (file.size > 1024 * 1024)
	{
		notification('حجم الصورة أكبر من 1MB', 'toast_error');
		image.current.value = '';

		document.getElementById('image_error_text').textContent = 'حجم الصورة أكبر من 1MB';
		return;
	}
	if (image.current.files[0])
	{
		ele.src = `${URL.createObjectURL(image.current.files[0])}`;
		name.textContent = `اسم الصورة :  ` + image.current.files[0].name;
		size.textContent = `حجم الصورة :  ` + ( (image.current.files[0].size /1024).toFixed(2) >= 1000 ? (image.current.files[0].size /(1024 * 1024)).toFixed(2)+'MB' :(image.current.files[0].size /1024).toFixed(2)+'KB'  ) ;
	}
	else 
	{
		name.textContent = ``;
		size.textContent = ``;
	}
	
	}
	
	function open_image_input(e)
	{
		e.preventDefault();
		document.getElementById('image_input').click();
	}


}