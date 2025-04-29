import "./TextEditor.css";
import katex from "katex";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import ReactQuill  from "react-quill";
// import 'quill/dist/quill.snow.css';
// import 'react-quill/dist/quill.snow.css';
import Swal from "sweetalert2";
import { notification } from "../../utils/notification";
import { User } from "../../Context/Context";
// import mathml2latex from 'mathml2latex';
import {
  AddNote, AddNoteImage, BaseURL, DeleteTempImages, EditNoteById,
  IncreaseNumberOfTeacherNotes, UploadTempImage
} from "../../API/APIs"; 

import 'mathlive/static.css';

const modules = {
  toolbar:
  {
    container: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }   ], // text direction
    
      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
     
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
     
      [{ align: [] }],
      ["image"],
      ["link"],
      ["clean"] // remove formatting button
  ],
      
  }
};



window.mathVirtualKeyboard.layouts = [{
 
  rows: [
    ["9", "8", "7",
      "[separator]",
      { class: 'small', latex: "\\displaystyle\\frac{#0}{#?}" },
      { class: 'small', latex: "\\displaystyle\\int_{#?}^{#0}\\frac{d}{dx}" , variants :["\\int_{#0}^{#0}"] },
      "[separator]",
      { latex: "\\displaystyle\\sqrt{#0}", variants: ["\\sqrt[#0]{#0}"] },
      {
        latex: "\\subseteq",
        variants:
          [
            "\\subset",
            "\\supset",
            "\\supseteq",
            "\\nsubseteq",
            "\\subset",
            "\\in",
            "\\ni",
            "\\notin",

          ]
      },
    ],
    ["6", "5", "4",
    "[separator]",
    "\\displaystyle \\lim_{#0 \\to #0}",
    {
      latex: "#0^{#?}",
      variants: [  "#0_{#?}" ]
    },
    "[separator]",
      {
        latex: "\\displaystyle\\rightarrow",
        variants:
          [
            "\\displaystyle\\leftarrow",
            "\\displaystyle\\xrightarrow[#?]{#0}",
            "\\displaystyle\\xleftarrow[#?]{#0}",
            "\\displaystyle\\rightleftharpoons",
            "\\displaystyle\\leftrightharpoons",
            "\\displaystyle\\Rightarrow",
            "\\displaystyle\\Leftarrow",
          ]
      },
      { class: 'small', latex: "\\displaystyle\\sum_{#0}^{#0}" },
    ],
    ["1", "2", "3",
      "[separator]",
      "c_{#?}^{#0}",
      { class: 'small', latex: "\\displaystyle\\binom{#0}{#0}" },
      "[separator]",
      {
        latex: "\\overrightarrow{#0}",
        variants:
          [
            "\\overleftarrow{#0}",
            "\\overline{#0}",
            "\\widehat{#0}",
          ]
      },
      {
        latex:  "\\left< #0 \\right>",
        variants:  [  "\\left |#0  \\right | " ]
      },
    ],
    [
       "0", "[hide-keyboard]",
       { label: '[separator]', width: 0.5 },
      "[separator]",
      {
        latex: "\\leqslant",
        variants:
          [
            "\\geqslant",
            "\\nless",
            "\\ngtr",
            "\\equiv",
            "\\neq",
            "\\not\\equiv ",
            "\\sim",
            "\\approx",
            "\\simeq",
          ]
      },
      {
        latex: "\\perp ",
        variants:
          [
            "\\vdash",
            "\\dashv",
            "\\models",
            "\\Join",
            "\\parallel",
          ]
      },
      "[separator]",
      {
        latex: "\\varphi",
        variants:
          [
            "\\theta",
            "\\vartheta",
            "\\lambda",
            "\\mu",
            "\\rho",
            "\\pi",
            "\\varpi",
            "\\psi",
            "\\phi",
            "\\delta",
            "\\omega",
            "\\gamma",
            "\\eta",
            "\\Theta",
            "\\Phi",
            "\\Omega ",
            "\\Psi",
            "\\Pi",
            "\\iota",
          ]
      },
      {
        latex: "\\infty",
        variants:
          [
            "\\mathbb{R}",
            "\\mathbb{N}",
            "\\mathbb{Q}",
            "\\mathbb{C}",
            "\\forall",
            "\\exists",
            "\\angle",
            "#0^{\\circ}",
          ]
      },
    ],
  ],
}]


export default function TextEditor() {
  
  window.katex = katex;
  
  window.addEventListener('popstate' ,()=> {
    localStorage.clear();
    sessionStorage.clear();
  })

  modules.toolbar.handlers = {
    image: imageHandler,
  };

  let [user, _] = useContext(User);

  sessionStorage.setItem('publisher', user.user_id);
  
  let name = localStorage.getItem('NoteSubjectName');

  if (!name) localStorage.setItem('NoteSubjectName','math');

  let previous_class = localStorage.getItem('NoteClass');

  if (!previous_class) localStorage.setItem('NoteClass', '12');

  useEffect(() => {
      
    let ele = document.querySelector('.textEditor_editor .ql-editor');
    
    if (ele)
    {
      let text = localStorage.getItem('TextEditorContent');

      if (text)
      {
        ele.innerHTML = text;
        localStorage.setItem('TextEditorContent', text);
      }

    }

    let all = document.querySelectorAll(".textEditor_editor .ql-editor img");

    all.forEach((e, index) => {
      e.setAttribute("class", `img${index}`);
      e.onclick = (d) => set_in_localStorage(d);
    });

    all = document.querySelectorAll(".textEditor_editor .ql-editor span.ql-formula");
    all.forEach((e, index) => {
      e.style.cursor = 'pointer';
      e.style.border = 'none';
      let new_c = "";
      let arr = e.classList;
      arr.forEach(cls => {
        if (cls.includes('equation_') || cls.includes('ql-formula')) return;
        new_c += cls;
        new_c += ' ';
      });
  
      e.innerHTML =  new_c ;
 
      new_c += `ql-formula equation_${index}`;
      e.setAttribute('class', new_c);
      e.onclick = () => { set_equation_in_localStorage(`equation_${index}`)  }
   
    });
   
    localStorage.removeItem('selected_equation');
    localStorage.removeItem('current_image');

    
   if (typeof window?.MathJax !== "undefined") {
    window.MathJax.typesetClear()
    window.MathJax.typeset()
    }
    
    let d = document.querySelector('.ql-direction');
    if (d) d.click();
  
  }, []);

  
  const [{ NoteSubjectName, NoteName, NotePrice , Class }, set_note_state] = useState(
    {
      NoteSubjectName: localStorage.getItem('NoteSubjectName') ,
      NoteName: localStorage.getItem('NoteName') ,
      NotePrice: localStorage.getItem('NotePrice') ?  parseInt(localStorage.getItem('NotePrice')) : 0,
      Class : localStorage.getItem('NoteClass'),      
    }
  );
  
  let previous_state = {
    NoteSubjectName: NoteSubjectName,
    NoteName: NoteName,
    NotePrice: NotePrice,
    Class: Class,
  };

  let math_equation = useRef('');

  if (typeof window?.MathJax !== "undefined") {
    window.MathJax.typesetClear()
    window.MathJax.typeset()
  }

  window.addEventListener('scroll', () => {

    let y = window.scrollY;
    if (y <= 120)
    {
      let e = document.getElementById('editing_window_button');
      if (e) e.style.display = 'none';
      e = document.getElementById('add_equation_button');
      if (e) e.style.display = 'none';
    }
    else 
    {
      let e = document.getElementById('editing_window_button');
      if (e) e.style.display = 'block';
      e = document.getElementById('add_equation_button');
      if (e) e.style.display = 'block';
   }
  });

  return (
    <div id="text_editor_root">
      <div id="text_editor_upper_part"> </div>
   
        <div style={{ display: 'none' }} id="math_ml"  onClick={ conv } ></div>
       
      <div id="text_editor_title"> صفحة إضافة محتوى نصي 
	  <i className="fa-solid fa-pen-fancy"></i>
	  </div>
      
       <div id="text_editor_title_hint">
        * بهاي الصفحة منقدر نضيف ملخصات/أوراق عمل /نوط ... <br /> محرر النصوص
        يلي تحت بيدعم أغلب الصيغ الرياضية و الرموز
      </div>

      <div id="text_editor_middle_part">
        <div id="text_editor_subject_name_class_note_name_container">
            
        <div id="text_editor_class_container">
          <label htmlFor="class_select" id ="note_class_label">  الصف :  </label> &nbsp;&nbsp;&nbsp;
          <select name="class_select" id="class_select"
            value={Class}
            onChange={(e) => {
              localStorage.setItem('NoteClass',e.target.value )
              set_note_state({ ...previous_state, Class: e.target.value });
            }}>
            
            <option value="12">بكلوريا</option>
            <option value="9">تاسع</option>
            </select>
            
          </div>
          
        <div id="text_editor_subject_name_container">
          <label id="text_editor_subject_name_label"> المادة : </label>&nbsp;&nbsp;&nbsp;
           <select name="subject_name" id="text_editor_select_subject_name"
             value={  NoteSubjectName }
             onChange={(e) => {
               localStorage.setItem('NoteSubjectName',e.target.value )
               set_note_state({ ...previous_state, NoteSubjectName: e.target.value });
             }}>
             
            <optgroup label="مواد بكلوريا">
              <option value="math">رياضيات </option>
              <option value="science">علوم </option>
              <option value="arabic">عربي </option>
              <option value="physics">فيزياء </option>
              <option value="chemistry">كيمياء </option>
              <option value="english">انكليزي </option>
              <option value="france">فرنسي </option>
              <option value="islam"> ديانة إسلامية </option>
            </optgroup>

            <optgroup label="مواد تاسع">
              <option value="math">رياضيات </option>
              <option value="science">علوم </option>
              <option value="physics_chemistry"> فيزياء و كيمياء </option>
              <option value="arabic">عربي </option>
              <option value="english"> انكليزي </option>
              <option value="france">فرنسي </option>
              <option value="geography">الاجتماعيات </option>
              <option value="islam"> التربية الدينية </option>
             </optgroup>
             
          </select>
        </div>

        <div id="text_editor_note_name_container">
          <label htmlFor="text_editor_note_name"> الاسم: </label> &nbsp;&nbsp;&nbsp;
          <input type="text" id="text_editor_note_name"   value={ NoteName }
             onChange={(e) => {
              localStorage.setItem('NoteName',e.target.value )
              set_note_state({ ...previous_state, NoteName: e.target.value });
            }}/>

          <div id="text_editor_note_name_hint">
            *هون منحط اسم المحتوى ( الاسم لا يتجاوز 100 حرف )<br />
            متل ملخص درس الأعصاب / ورقة عمل / تجميعة قوانين ....
          </div>
        </div>
        </div>
      <div id="text_editor_note_price_container">
        <div id="text_editor_input_price_container">
          <label htmlFor="text_editor_price_input"  >  السعر :   </label>
           <input type="number" id="text_editor_price_input" value={NotePrice}
            
             onChange={(e) => {
               
              localStorage.setItem('NotePrice',e.target.value )
              set_note_state({ ...previous_state, NotePrice: e.target.value });
            
            }}
           /> ل.س
        </div>
        <div id="text_editor_input_price_hint">
          *منحدد سعر المحتوى يلي كتبتو   
          السعر لازم يكون بين 1000 و 20000  
          اذا كنت بدك ياه مجاني ,تروك الحقل فاضي
        </div>
       </div>
      </div>
    
       <div id="textEditor">
         
         <ReactQuill className="textEditor_editor" theme="snow" modules={modules}

           placeholder="...يمكنك بدء الكتابة هنا"/>
      </div>

       <div id="equation_add_toolbar_container">
       
         <div id="add_equation_text_editor">
 
           <button id="add_equation_button" onClick = { open_add_equation} >إضافة معادلة او رمز</button>
           <button id="editing_window_button" onClick = {open_close_texteditor_tootbar} >فتح نافذة التعديل</button>
           <div id="add_equation_black_background" onClick={close_add_equation}></div>
           
          <div id="add_equation_popup_box">
             <span id="add_equation_popup_box_close_icon" onClick={close_add_equation}>X</span>
            <div id="add_equation_popup_box_row">

              <math-field
               ref = {math_equation}>
              </math-field>
              
              <button id ="text_editor_add_equation_button"  onClick={conv}  >نسخ المعادلة</button>
    
            </div>
           </div>
               </div>
 
       <div id="textEditor_toolbar">

<div id="equation_edit_section" >
  <div id="equation_edit_section_header">  قسم تنسيق المعادلات :</div>

    <div id="equation_related_styles">
   
    <div id="equation_color_container">
         لون خط المعادلة :  <br/>
       <button className="white"   onClick={() => change_equation_feature("color", 'white')} ></button>
       <button className="red"   onClick={() => change_equation_feature("color", 'red')} ></button>
       <button className="black" onClick={() => change_equation_feature("color",'black')} ></button>
       <button className="blue" onClick={() => change_equation_feature("color",'blue')} ></button>
       <button className="green" onClick={() => change_equation_feature("color",'rgb(0, 255, 0)')} ></button>
       <button className="yellow" onClick={() => change_equation_feature("color",'yellow')} ></button>
       <button className="aqua" onClick={() => change_equation_feature("color",'aqua')} ></button>
       <button className="pink" onClick={() => change_equation_feature("color",'rgb(255, 0, 174)')} ></button>
       
    </div>
   
  <div id="equation_size_manager_container">
    حجم خط المعادلة  : <br />  
    <button className="fontsize" onClick={() => change_equation_feature("font-size", '12px')}   >1</button>
    <button className="fontsize" onClick={() => change_equation_feature("font-size", '16px')}  >2</button>
    <button className="fontsize" onClick={() => change_equation_feature("font-size", '20px')}  >3</button>
    <button className="fontsize" onClick={() => change_equation_feature("font-size", '24px')} >4</button>
    <button className="fontsize" onClick={() => change_equation_feature("font-size", '32px')} >5</button>
    <button className="fontsize" onClick={() => change_equation_feature("font-size", '40px')} >6</button>
    <button className="fontsize" onClick={() => change_equation_feature("font-size", '48px')}> 7</button>
    <button className="fontsize" onClick={() => change_equation_feature("font-size", '60px')}> 8</button>
 
   </div>
   </div>
  
  </div>
           

<div id="image_edit_section">
  <div id="image_edit_header">  قسم تعديل الصور</div>

  <div id="image_size_body">
<label htmlFor="text_editor_input_range" id="input_range_label">
 حجم الصورة الحالي :
</label>

<div >
 <div>10px</div>
 <input
   type="range"
   id="text_editor_input_range"
   max={2000}
   min={10}
   defaultValue={150}
   onChange={(e) => range_change_width(e.target.value)}
 />
 <div>2000px</div>
</div>


</div>  
</div>

</div>
        </div>
      
       <div id="text_editor_save_button_container">
         
        <button id="text_editor_save_button" onClick={save_content}>
          حفظ المحتوى الحالي
        </button>
        {/* <button onClick= {  () => window.print() } > print the content </button> */}
         
        <div id="text_editor_save_button_hint">
          *تذكر بأن تحفظ كلشي كتبتو من شان ماتخسر كلشي كتبتو في حالات ضعف
          الإنترنت أو إعادة تحميل الصفحة   </div>
         
      </div>

       <button id="done_button_text_editor" onClick={check_send_conditions}> انتهيت من الكتابة </button>

       <div id="text_editor_check_box_background"  onClick ={  text_editor_close_check_box }> </div>
	   
	   <div id ="text_editor_check_box" >
          <div id="text_editor_close_icon" onClick={text_editor_close_check_box}>X</div>
		  
		  <div id="text_editor_check_box_title" >   <div id="spinner"> </div>  <span>...يتم التحقق </span> </div>
         <div id="text_editor_check_box_body"> 
           
		     <div id ="text_editor_check_box_inner"></div>
		   
           <button id="text_editor_send_note_button" onClick={sendData} >   إرسال </button>
		     
           <div id="text_editor_spinner_loading_container"
             style={{
               color: 'white',
               width: 'fit-content',
               margin: 'auto',
               position: 'relative',
               bottom: '20px',
               right: '20px',
               fontSize: '20px',
               display: 'none',
             }}>
             <div id="spinner"> </div>
             ...يتم إرسال البيانات
                
           </div>
         </div>
	   </div>
    </div>
  );


 
  function conv()
  {

    let txt = math_equation.current.value;
 
    let str = `\\(${txt}\\)`;
    let ele = document.querySelector(`.textEditor_editor .ql-editor`);
    
    if (ele) {

      ele.innerHTML += `<span class="${str} ql-formula" contenteditable="false" >${str} </span>`;
      ele.focus();

    }
    
    document.querySelectorAll('.textEditor_editor .ql-editor   span.ql-formula').forEach( (e , index) =>{
      
      let arr = e.classList;
      let cls = "";
      arr.forEach((clls) => {
        if (clls.includes('equation_')) return;
        cls += clls;
        cls += ' ';
      } )
      
      cls += ' equation_' + index.toString();
      e.setAttribute('class', cls);
      e.style.cursor = 'pointer';
      e.onclick = () => { set_equation_in_localStorage('equation_' + index.toString())  }
   
    })
    if (ele)    
    {
      ele.focus();
      // console.log('text content is ', ele.textContent)
    }

    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typesetClear()
      window.MathJax.typeset()
    }

     notification( 'تم نسخ المعادلة بنجاح', 'toast_correct')
  }

  function close_add_equation()
  {
    let e = document.getElementById('add_equation_black_background');
    if(e)
      e.style.display = 'none';
    e = document.getElementById('add_equation_popup_box');
    if(e)
      e.style.display = 'none';
    
  }

  function open_add_equation()
  {
    let e = document.getElementById('add_equation_black_background');
    if(e)
      e.style.display = 'block';
    e = document.getElementById('add_equation_popup_box');
    if(e)
      e.style.display = 'block';
  }
  
  function open_close_texteditor_tootbar(){
  
   let ele = document.getElementById('textEditor_toolbar');
    let win = document.getElementById('editing_window_button');
   if( ele )
   {
     if (ele.style.display !== 'flex') 
     {
       ele.style.display = 'flex';	   
       win.textContent = 'إغلاق نافذة التعديل';  
      }
      else
      {
        ele.style.display = 'none';
        win.textContent = 'فتح نافذة التعديل';
       
     }
  }	   
   
 }
 
  function change_equation_feature(prop , val)
  {
    let equ = document.querySelector(`.textEditor_editor .ql-editor p .${localStorage.getItem('selected_equation')}`);
     // case no equation selected
    if (!equ) {
      let el = document.getElementById('equation_related_styles');
      el.style.opacity = '0.2';
      el.style.pointerEvents = 'none';
      return; 
    }

    let prev = equ.style.getPropertyValue(prop);
    
    if (prev !== val)
    {
      // equ.style.setProperty(prop, val);
      equ.style.cssText+=`${prop} : ${val} !important;`;
    }
    else 
      equ.style.removeProperty(prop);
  }

  function range_change_width(e) {
    let cls = localStorage.getItem("current_image");

    if (cls) {
      let ele = document.querySelector(`.textEditor_editor .ql-editor .${cls}`);
      if (ele) {
        ele.style.width = `${e}px`; 
      }
      else 
      {
        localStorage.removeItem('current_image');
        ele = document.getElementById("image_size_body");
        ele.style.opacity = '0.2';
        ele.style.eventPointer ='none';
      }
    }
    else 
    {
     let  ele = document.getElementById("image_size_body");
      ele.style.opacity = '0.2';
      ele.style.eventPointer ='none';
    }
  }
 
  function set_equation_in_localStorage(selector)
  {
    let ele = document.querySelector(`.textEditor_editor .ql-editor p .${selector}`);
    
    if (!ele) return;
     
    ele.style.border = '1px solid black';
    
    ele = document.querySelector(`.textEditor_editor .ql-editor p .${localStorage.getItem('selected_equation')}`);
    
    if (ele)
    {
      if (localStorage.getItem('selected_equation') == selector) 
      {
        ele.style.border = 'none';
        localStorage.removeItem('selected_equation');
   	  	document.getElementById('equation_related_styles').style.opacity='0.3';
		    document.getElementById('equation_related_styles').style.pointerEvents='none';
      }
      else {
        ele.style.border = 'none';
        localStorage.setItem('selected_equation' , selector);
		  	document.getElementById('equation_related_styles').style.opacity='1';
		    document.getElementById('equation_related_styles').style.pointerEvents='all';
      }
    }  
    else 
    {
      localStorage.setItem('selected_equation' , selector);
	  	document.getElementById('equation_related_styles').style.opacity='1';
	  	document.getElementById('equation_related_styles').style.pointerEvents='all';
    }

  }

  function set_in_localStorage(e) {
    let ele = e.srcElement;
    e.srcElement.style.border = "2px solid black";
    let cls = ele.getAttribute("class");
    let el;
    let prev = localStorage.getItem("current_image");

    if (!prev)
    {
      localStorage.setItem("current_image", cls);
	    document.getElementById('image_size_body').style.opacity='1';
	    document.getElementById('image_size_body').style.pointerEvents='all';
      return;
    }
    if (cls !== localStorage.getItem("current_image") )
    {
      el = document.querySelector(`.textEditor_editor .${localStorage.getItem("current_image")}`);
      if (el)
      {
        el.style.border = "none";
        localStorage.setItem("current_image", cls);
			  document.getElementById('image_size_body').style.opacity='1';
	      document.getElementById('image_size_body').style.pointerEvents='all';
      }
    }
    else 
    {
      el = document.querySelector(`.textEditor_editor .${localStorage.getItem("current_image")}`)
      if (el)
        el.style.border = "none";
        localStorage.removeItem('current_image');
	  	  document.getElementById('image_size_body').style.opacity='0.2';
	     document.getElementById('image_size_body').style.pointerEvents='none';
    }
    
  }
 
  function save_content() {


    let ele = document.querySelector(".textEditor_editor .ql-editor").cloneNode(true);
 
    // console.log('here is the first root', ele);
    let curr = ele.childNodes;
    curr.forEach(e => {
    
      let rec = e.childNodes;
      
    
      if (rec) {
        rec.forEach(r => {
          let equation = "";
    
          if (r.tagName === "SPAN" && r.className.includes('equation_'))
    
            r.classList.forEach(c => {
    
              if (c.includes('equation_') || c.includes('ql-formula')) return;
    
              equation += c;
              equation += ' ';
            });
    
          if (r.tagName === "SPAN" && r.className.includes('equation_')) {
            r.innerHTML = equation;
          }
        })
      }

    });
    // console.log('here is the first childrens', curr);

    // curr.forEach(e => {

    //   let rec = e.childNodes;

      // console.log('here is the second childrens', rec);

    //   if (rec)
    //   {
    //     rec.forEach(rrr => {  
    //       let equation = "";
    //       let r = rrr; 
    //       // console.log('here we first  with original r', r);
    //       if (r.tagName === 'LI')
    //       {
    //         r = rrr.firstChild;
    //         // console.log(' yes here we are with new r ', r);
    //       }

    //       if (r.tagName === "SPAN" && r.className.includes('equation_'))
    //        r.classList.forEach(c => { 
    //         if (c.includes('equation_') || c.includes('ql-formula') ) return;
    //         equation += c;
    //         equation += ' ';
    //        });
          
    //       if (r.tagName === "SPAN" && r.className.includes('equation_') )
    //       {
    //         // r.innerHTML = `${equation}`;
    //         // console.log('here should be the deleted content', r.innerHTML);
    //         r.innerHTML = ``;
    //         // console.log('here should be the deleted content', r.innerHTML);
    //       }

    //     })

    //   }
    // })

    // console.log('here is result of save thing ', ele.innerHTML);
    
    if (ele)
    {
      localStorage.setItem("TextEditorContent", ele.innerHTML);
      notification("تم حفظ المحتوى بنجاح", "toast_correct" );
    }
  }

 
  function imageHandler() {
 
    // let ele = document.querySelector(`[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor`);

   let ele = document.querySelector(".textEditor_editor .ql-editor");
 
    if (!ele)
    {
      notification(`اختر أحد حقول الكتابة لتضع الصورة بداخله`, "toast_error");
      return;
    }

    const input = document.createElement("input");
  
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      
      const file = input.files[0];

      if (!file.type.includes("image/")) {
        notification("الملف المُرفق ليس صورة", "toast_error");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        let msg = `حجم الصورة المُرفقة أكبر من 
        2MB`;
        notification(msg, "toast_error");
        return;
      }

      send_temp_image( file  );
      
    };
    ele.focus();
  }


  function send_temp_image( file )
  {
    let data = new FormData();
    
    data.append('image', file);
    data.append('publisher', sessionStorage.getItem('publisher') );
 
    // let ele = document.querySelector(`[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor`);
    let ele = document.querySelector(".textEditor_editor .ql-editor");
 

    let url = BaseURL + UploadTempImage;

    axios.post(url, data)
      .then(res => {
        console.log('here is image uploaded', res);
    
     let d = `<img src="${res.data.image}" style="width:180px"  />`;

      ele.innerHTML += d;

      let all = document.querySelectorAll(`.textEditor_editor .ql-editor img`);
      
      all.forEach((e, index) => {
        e.setAttribute("class", `img${index}`);
        let el = `.ql-editor .img${index}`;
        e.onclick = () => set_in_localStorage(el);
      });

      })
      .catch(err => {
      console.log('here is error upload image ', err);
    } )
  
  
   let all = document.querySelectorAll(".textEditor_editor .ql-editor span.ql-formula");
 
   all.forEach((e) => {
      e.style.cursor = 'pointer';
      let arr = e.classList;
      e.onclick = () => { set_equation_in_localStorage( arr[arr.length - 1] )  }
    });
  
  
  
  }


 function text_editor_close_check_box()
 {
	let ele = document.getElementById('text_editor_check_box_background');
     ele.style.display = 'none';	
     ele = document.getElementById('text_editor_check_box');
     ele.style.display = 'none';	
     
     ele = document.getElementById('text_editor_check_box_title');
     ele.style.display = 'flex';
     
     ele = document.getElementById('text_editor_check_box_inner');
     ele.innerHTML = '';
     
     document.getElementById('text_editor_send_note_button').style.display = 'none';
     document.getElementById('text_editor_spinner_loading_container').style.display = 'none';
     
   let up = 1001;
   while (up-- > 0) clearTimeout(up);
 
   ele = document.getElementById("text_editor_notifications");
   if (!ele) return;
   if (ele.style.display == 'block')
   {
      setTimeout(() => {
       ele.style.display = "none";
    }, 2500);
   }
 }

 function check_send_conditions()
 {
	 	let ele = document.getElementById('text_editor_check_box_background');
     ele.style.display = 'block';	
    
       ele = document.getElementById('text_editor_check_box');
     
	 setTimeout( ()=>{
		     ele.style.display = 'block';	
         ele.style.animationName = 'text_editor_check_box_show';	
	 } , 200);
	 
   setTimeout( check_conditions , 2200);
  }


  function check_conditions()
  {
    let ele = document.getElementById('text_editor_check_box_title');
    ele.style.display = 'none';
    
    let errors_array = [];
   
    let temp = localStorage.getItem('NotePrice');

    if (temp)
    {
      temp = parseInt(temp);
      if (temp < 1000) errors_array.push(' السعر أقل من 1000');
      else if (temp > 20000) errors_array.push(' السعر أكثر من 20000');
    }

    temp = localStorage.getItem('NoteName');
    
    if( temp )
    temp = temp.toString();
    
    if ( !temp || temp.length <= 3) errors_array.push('يجب أن يكون الاسم أكثر من 3 أحرف')
    else if (temp.length > 100) errors_array.push(' يجب أن يكون الاسم أقل من 100 حرف');
    
    temp = localStorage.getItem('TextEditorContent');
   
    if (temp === "<p><br></p>")
    {
      temp = "";
      localStorage.setItem('TextEditorContent', temp);
    }
    
    if (!temp || temp.length <= 0)
    {
      errors_array.push("إن المحتوى التي تريد إضافته فارغ");
    }
    
    ele = document.getElementById('text_editor_check_box_inner');

    if (errors_array.length > 0)
    {
      ele.innerHTML = ` <h2>   النتيجة :  <span style="color:red" >فشل</span>  </h2>  <br/><br/>
        <h4>  قم بتصحيح الأخطاء التالية :  </h4> <br/> <br/> `;
        
      errors_array.forEach((e) => {
        ele.innerHTML += ` <div>${e} </div>  `;
       } )
    }
    
    else 
    {
      ele.innerHTML = ` <h1>   النتيجة :  <span style="color:green" >نجاح</span>  </h1>  <br/><br/>
      <h4>  يمكنك الآن الإرسال بنجاح</h4> `;
      document.getElementById('text_editor_send_note_button').style.display = 'block';
      
    }
    
  }

  function sendData()
  {
    let content = localStorage.getItem('TextEditorContent');
      
    let pr = NotePrice;
    let prem = false;
    if (pr) {
      prem = true;
    }
    else pr = 0;

    let full_name = (user.gender === 'M' ? "الاستاذ" : "الانسة") + ' ' + user.full_name;
   
    let obj = {
      title:  localStorage.getItem('NoteName'),
      publisher_id : user.user_id ? user.user_id : 1,
      publisher_name : full_name ,
      Class :   localStorage.getItem('NoteClass'),
      content: '1',
      price: pr,
      premium :prem,
	    subject_name: localStorage.getItem('NoteSubjectName') ? localStorage.getItem('NoteSubjectName'):'math' ,
    }


    let d = document.getElementById('text_editor_spinner_loading_container');

    if (d) d.style.display = 'block';

    let url = BaseURL + AddNote;

    axios.post(url, obj)
      .then(res => {
        fixing_images_function(res.data.id);
      })
      .catch(err => {
        console.log('error in creating image   ', err);
      });
      
 

    
  }
 
  async function fixing_images_function(id)
  {
    let note =  localStorage.getItem('TextEditorContent') ;
    
    let org = document.createElement('div');
    org.innerHTML  = note;

    let children = org.childNodes;

    await bt(children);

       async function bt(node) {
         
         for (let j = 0; j <= node.length; j++)
         {
           
           let ele = node[j];
           let index = j;
            
          if (ele?.childElementCount > 0 )
           await bt(ele.childNodes)
    
          if (ele?.tagName == 'IMG')
          {
            // let tem = await fetch(ele.src);
            // tem = await tem.blob();

            let tem = await part1(ele.src);

                const file = new File([tem], 'image.jpg', { type: tem.type });
                
                let send_data = new FormData();
                
                send_data.append('images', file);
                send_data.append('note_id' , id);
      
                let url = BaseURL + AddNoteImage;
 
                ele.src = await part2(url, send_data);
                console.log('here is data of imagessssssssss  ', ele.src);
    
         }
        }
    }
    // localStorage.setItem('TextEditorContent', org.innerHTML);
    
    let obj = {
      content : org.innerHTML,
    }

    let url = BaseURL + EditNoteById + id + '/';

    axios.post(url, obj)
      .then(res => {
        console.log('note is edited successfully', res.data);

        url = BaseURL + DeleteTempImages + user.user_id + '/';

        // delete temp images and increase number of teacher exams
        axios.post(url)
          .then( success_and_reload )
          .catch(err => {
            console.log('error in deleting temp images', err);
          });
        
        url = BaseURL + IncreaseNumberOfTeacherNotes + user.user_id + '/';

        console.log('here is increase , ', user, user.user_id);
        
        axios.post(url)
        .catch(err => {
          console.log('error increase number of teacher notes ', err);
        });

      })
      .catch(err => {
        console.log('here is an error in note editing ' , err);
      });
  }

  async function part1(src)
  {
    try {

      let tem = await fetch(src);
      tem = await tem.blob();
      return tem;
    }
    catch (err) {
      console.log('error in function part1 ', err);
      return 'invalid_url';
    }
  }

  async function part2( url , send_data)
  {
    let d = await axios.post(url, send_data).catch(err => {
      console.log('error in function part2 ', err);
    } );
    // ele.src = d.data.images;
    return d.data.images;
  }

  function success_and_reload() {

    text_editor_close_check_box();

    Swal.fire({
      title: `تم إرسال النوطة بنجاح `,
      text : '... سيتم إعادة تحميل الصفحة خلال 4 ثواني' ,
      icon: "success",
      background: "#18222b",
      color: "white",
      confirmButtonColor: "rgba(0, 0, 0, 0.255)",
      confirmButtonText: "إنهاء" 
    });
   
    setTimeout(allDone, 4000);
  }

  function allDone() {
 
    localStorage.clear();
    window.location.reload();
  }
 

  function convert_photos(id , urls)
  {
      let func = async (i) => {
        let d = await fetch(urls[i])
          .catch(e => {
            text_editor_close_check_box();
            notification('حدث خطأ أثناء تحليل الصور , تأكد من أن الصور المُرفقة صالحة ', 'toast_error');
            // show_notification('حدث خطأ أثناء تحليل الصور , تأكد من أن الصور المُرفقة صالحة ', 'red');
          });
        try {
          let data = await d.blob();
          const file = new File([data], 'image.jpg', { type: 'image/jpeg' });
          
          await send_photos(id, file ,i , urls.length - 1);
        }
        catch (e)
        {
          text_editor_close_check_box();
          notification('حدث خطأ أثناء تحليل الصور , تأكد من أن الصور المُرفقة صالحة ', 'toast_error');
          // show_notification('حدث خطأ أثناء تحليل الصور , تأكد من أن الصور المُرفقة صالحة ', 'red');
          return;
        }
       
        
        if (i < urls.length - 1)
          await func(i + 1);
      };
  
      func(0); 
    
   

  }
  
  async function send_photos(id, photo , index , last)
  {
    // console.log(' here is file', photo);
    const formData = new FormData();
    formData.append('images', photo);
    formData.append('note_id', id);
    let url = `${BaseURL}${AddNoteImage}`;

    let d = await axios.post(url, formData)
      .catch(err => {
        console.log('error in photos', err);
        text_editor_close_check_box();
        
        notification('حدث خطأ أثناء إرسال الصور  ', 'toast_error');
        // show_notification('حدث خطأ أثناء إرسال الصور  ', 'red');
      });
    
    if (index == last)
    {
      let d = document.getElementById('text_editor_spinner_loading_container');
      if (d) d.style.display = 'none';
      all_done();
    }
  }

  
  function all_done()
  {
    text_editor_close_check_box();
    Swal.fire({
      title: `تم الإرسال بنجاح `,
      icon: "success",
      background: "#18222b",
      color: "white",
      confirmButtonColor: "rgba(0, 0, 0, 0.255)",
      confirmButtonText: "إنهاء" 
    });
   
    let button = Swal.getConfirmButton();
    button.onclick = () => {
      localStorage.removeItem('NoteName');
      localStorage.removeItem('NotePrice');
      localStorage.removeItem('TextEditorContent');
      localStorage.removeItem('subject_name');
      window.location.reload();

    };
  }
}


 