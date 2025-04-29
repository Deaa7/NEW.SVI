import { useEffect, useState , useRef , useContext } from "react";
import "./AddExam.css";
import {
  science_12_units,
  math1_12_units,
  math2_12_units,
  physics_12_units,
  chemistry_12_units,
  arabic_12_units,
  islam_12_units,

} from "../../data/SubjectUnitsArrays.js";
import axios from "axios";
import Swal from "sweetalert2";
// import mathml2latex from 'mathml2latex';
import katex from "katex"
import ReactQuill, { Quill } from "react-quill";
import {notification} from '../../utils/notification.js'
// import 'quill/dist/quill.snow.css';
import { User } from "../../Context/Context.jsx";

import { BaseURL, DeleteTempImages, EditQuestionById, IncreaseNumberOfTeacherExams, UploadTempImage } from "../../API/APIs.js";
import { CreateExam , AddQuestion ,AddQuestionImage  } from "../../API/APIs.js";

import { reference } from "../../data/SubjectNameReference";
import { MathfieldElement } from 'mathlive';
// import 'mathlive/static.css';

const modules = {
  toolbar: {
    container: [
      [{ direction: "rtl" }],
     [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      ["bold", "italic", "underline", "strike" ],
      [{ color: [] }],
      [{ background: [] }],
      [
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{  align:[] }],
      [ "image"],
      ["clean"],
    ],
  },
  clipboard: {
    matchVisual: true,
  },
};

window.mathVirtualKeyboard.layouts = [{
 
  rows: [
    ["9", "8", "7",
      "[separator]",
      { class: 'small', latex: "\\displaystyle\\frac{#0}{#?}" },
      { class: 'small', latex: "\\displaystyle\\int_{#?}^{#0}\\frac{d}{dx}", variants: ["\\int_{#0}^{#0}"] },
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
        variants: ["#0_{#?}"]
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
        latex: "\\left< #0 \\right>",
        variants: ["\\left |#0  \\right | "]
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
}];

export default function AddExam() {
  
  const [user, _] = useContext(User);
  sessionStorage.setItem("user", user.user_id);
  let math_equation = useRef();
  window.addEventListener('popstate', (ev) => {
    localStorage.clear();
    sessionStorage.clear();
  });

  window.katex = katex;

  modules.toolbar.handlers = {
    image: imageHandler,
  };

  
  let previous_subject_name = localStorage.getItem("subject_name");
  let previous_class = localStorage.getItem("class");
  
  if ( !previous_subject_name  ) {
    localStorage.setItem("subject_name", "math");
    previous_subject_name = "math";
  }

  if ( !previous_class )
  {
    localStorage.setItem("class", "12");
    previous_class = "12";
  }
  
  let previous_exam_name = localStorage.getItem("exam_name");
  let previous_units = localStorage.getItem("units");
  let previous_questions = [];

  for (let i = 0; i < 70; i++) {
    let now = localStorage.getItem(`question${i}`);
    if ( !now || now.length <= 0) break;
    now = JSON.parse(now);
    previous_questions.push(now);
  }

  const [{ subject_name, exam_name, units, questions_added , question_added_length , Class } , set_exam_state] =
    useState({

      subject_name: localStorage.getItem('subject_name') ? localStorage.getItem('subject_name') : "math",
      Class: localStorage.getItem('class') ? localStorage.getItem('class') : "12" ,
      exam_name: previous_exam_name  ? previous_exam_name : ""  ,
      units: previous_units && previous_units.length > 0 ? previous_units.split(",") : [] ,
      questions_added: previous_questions ? previous_questions : [],
      question_added_length: previous_questions ? previous_questions.length : 0 ,

    });

  const previous_state = {
    subject_name: subject_name ? subject_name :'math' ,
    Class: Class,
    exam_name: exam_name,
    units: units,
    questions_added: questions_added,
    question_added_length:question_added_length,
  };

  useEffect(() => {

    previous_questions.forEach((e, index) => {
      
      let now = JSON.parse(localStorage.getItem(`question${index}`));

      // now.test_content = now.test_content.toString().replaceAll('blob', 'no-url');
      // now.option_A =  now.option_A.toString().replaceAll('blob', 'no-url');
      // now.option_B =  now.option_B.toString().replaceAll('blob', 'no-url');
      // now.option_C =  now.option_C.toString().replaceAll('blob', 'no-url');
      // now.option_D =  now.option_D.toString().replaceAll('blob', 'no-url');
      // now.option_E =  now.option_E.toString().replaceAll('blob', 'no-url');
      // now.explanation = now.explanation.toString().replaceAll('blob', 'no-url');

      localStorage.setItem(`question${index}`, JSON.stringify(now));

      let ele = document.querySelector(`.question_text_content_container${index} .ql-editor`);
      if (ele) {
        // ele.innerHTML = e.test_content.toString().replaceAll('blob', 'no-url');;
        ele.innerHTML = e.test_content.toString();
        ele.oncopy = (e) => copy_cut_Handler(e);
        ele.oncut = (e) => copy_cut_Handler(e);

        ele = document.querySelector(`.question_text_content_container${index}`);
        if(ele)
        ele.onclick = () => {
          mark_selected_element_with_border(`quill question_text_content_container${index}`)
        }
      }

      ele = document.querySelector(`.question_option_A${index} .ql-editor`);
      if (ele) 
      {
        // ele.innerHTML = e.option_A.toString().replaceAll('blob', 'no-url');
        ele.innerHTML = e.option_A.toString();
        ele.oncopy = (e) => copy_cut_Handler(e);
        ele.oncut = (e) => copy_cut_Handler(e);
        ele = document.querySelector(`.question_option_A${index}`);
        if(ele)
        ele.onclick = () => {
          mark_selected_element_with_border(`quill question_option_A${index}`)
        }
      }
      
      ele = document.querySelector(`.question_option_B${index} .ql-editor`);
      if (ele) 
      {
        // ele.innerHTML = e.option_B.toString().replaceAll('blob', 'no-url');;
        ele.innerHTML = e.option_B.toString();
        ele.oncopy = (e) => copy_cut_Handler(e);
        ele.oncut = (e) => copy_cut_Handler(e);
        ele = document.querySelector(`.question_option_B${index}`);
        if(ele)
        ele.onclick = () => {
          mark_selected_element_with_border(`quill question_option_B${index}`)
        }
      }
      
      ele = document.querySelector(`.question_option_C${index} .ql-editor`);
      if (ele)
      {
        // ele.innerHTML = e.option_C.toString().replaceAll('blob', 'no-url');
        ele.innerHTML = e.option_C.toString();
        ele.oncopy = (e) => copy_cut_Handler(e);
        ele.oncut = (e) => copy_cut_Handler(e);
        ele = document.querySelector(`.question_option_C${index}`);
        if (ele)
        ele.onclick = () => {
          mark_selected_element_with_border(`quill question_option_C${index}`)
        }  
      }
      
      ele = document.querySelector(`.question_option_D${index} .ql-editor`);
      if (ele) 
      {
        // ele.innerHTML = e.option_D.toString().replaceAll('blob', 'no-url');
        ele.innerHTML = e.option_D.toString();
        ele.oncopy = (e) => copy_cut_Handler(e);
        ele.oncut = (e) => copy_cut_Handler(e);
        ele = document.querySelector(`.question_option_D${index}`);
        if(ele)
        ele.onclick = () => {
          mark_selected_element_with_border(`quill question_option_D${index}`)
        }  
      }
      
      ele = document.querySelector(`.question_option_E${index} .ql-editor`); 
      if (ele)
      {
        // ele.innerHTML = e.option_E.toString().replaceAll('blob', 'no-url');
        ele.innerHTML = e.option_E.toString();
        ele.oncopy = (e) => copy_cut_Handler(e);
        ele.oncut = (e) => copy_cut_Handler(e);
        ele = document.querySelector(`.question_option_E${index}`); 
        if(ele)
          ele.onclick = () => {
            mark_selected_element_with_border(`quill question_option_E${index}`)
          } 
      }
    
      ele = document.querySelector(`.explanation${index} .ql-editor`); 
      if (ele) 
      {
        // ele.innerHTML = e.explanation.toString().replaceAll('blob', 'no-url');
        ele.innerHTML = e.explanation.toString();
        ele.oncopy = (e) => copy_cut_Handler(e);
        ele.oncut = (e) => copy_cut_Handler(e);
        ele = document.querySelector(`.explanation${index}`); 
        if(ele)
        ele.onclick = () => {
          mark_selected_element_with_border(`quill explanation${index}`)
        }
      }
      
    })
  

    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typesetClear()
      window.MathJax.typeset()
    }
    
    for (let index = 0; index <= previous_questions.length; index++) {
      let ele = document.querySelectorAll(`.question_text_content_container${index} .ql-editor p span.ql-formula`);
      if (ele) {
        ele.forEach(e => {
          let arr = e.classList;
          e.onclick = () => { set_equation_in_sessionStorage(arr[arr.length-1]) }
        })
      }

      ele = document.querySelectorAll(`.question_option_A${index} .ql-editor p span.ql-formula`);

      if (ele) {
        ele.forEach(e => {
          let arr = e.classList;
          e.onclick = () => { set_equation_in_sessionStorage(arr[arr.length-1]) }
        })
      }

      ele = document.querySelectorAll(`.question_option_B${index} .ql-editor p span.ql-formula`);
      
      if (ele) {
        ele.forEach(e => {
          let arr = e.classList;
          e.onclick = () => { set_equation_in_sessionStorage(arr[arr.length-1]) }
        })
      }

      ele = document.querySelectorAll(`.question_option_C${index} .ql-editor p span.ql-formula`);
      
      if (ele) {
        ele.forEach(e => {
          let arr = e.classList;
          e.onclick = () => { set_equation_in_sessionStorage(arr[arr.length-1]) }
        })
      }

      ele = document.querySelectorAll(`.question_option_D${index} .ql-editor p span.ql-formula`);
      
      if (ele) {
        ele.forEach(e => {
          let arr = e.classList;
          e.onclick = () => { set_equation_in_sessionStorage(arr[arr.length-1]) }
        })
      }

      ele = document.querySelectorAll(`.question_option_E${index} .ql-editor p span.ql-formula`);
      
      if (ele) {
        ele.forEach(e => {
          let arr = e.classList;
          e.onclick = () => { set_equation_in_sessionStorage(arr[arr.length-1]) }
        })
      }

      ele = document.querySelectorAll(`.explanation${index} .ql-editor p span.ql-formula`);
      
      if (ele) {
        ele.forEach(e => {
          let arr = e.classList;
          e.onclick = () => { set_equation_in_sessionStorage(arr[arr.length-1]) }
        })
      }

    }

    let ele = document.getElementById('exam_price');
    
    if (ele) ele.value = localStorage.getItem('price');
    
    ele = document.getElementById('exam_name');
   
    if (ele) ele.value = localStorage.getItem('exam_name');
      
    let unit = [];
    if (subject_name + "_" + Class == 'math_12')
      unit.push( math1_12_units[0]);
    if (subject_name + "_" + Class == 'science_12')
     unit.push( science_12_units[0]);
    if (subject_name + "_" + Class == 'physics_12')
     unit.push( physics_12_units[0]);
    if (subject_name + "_" + Class == 'chemistry_12')
      unit.push(chemistry_12_units[0]);
    if (subject_name + "_" + Class == 'arabic_12')
      unit.push(arabic_12_units[0]);
    if (subject_name + "_" + Class == 'islam_12')
      unit.push(islam_12_units[0]);
    
    if (units.length > 0) unit = units;

    set_exam_state({ ...previous_state, questions_added: previous_questions, question_added_length: previous_questions.length , units:unit });
  
    sessionStorage.removeItem("selected_field");
    sessionStorage.removeItem("selected_image");
    sessionStorage.removeItem("selected_equation"); 
 
    
    // let buu = document.getElementById('hidden_button');
    // if (buu)
    //   buu.click();

    let but = document.querySelectorAll('button.ql-direction');
    if (but) 
    {
      but.forEach(e => {
        e.click();
      } ) 
    }
  }, []);

  
  useEffect(() => {
 
    let index = question_added_length - 1;
    let ele;

    ele = document.querySelector(`.question_text_content_container${index} .ql-editor`);
    
    if (ele) 
      {
        ele.oncopy = (e) => copy_cut_Handler(e);
        ele.oncut = (e) => copy_cut_Handler(e);
        ele = document.querySelector(`.question_text_content_container${index}`);
        if(ele)
        ele.onclick = () => {
          mark_selected_element_with_border(`quill question_text_content_container${index}`)
        }
    }

    ele = document.querySelector(`.question_text_content_container${index} .ql-toolbar .ql-direction`);
    
    if (ele) ele.click();

        ele = document.querySelector(`.question_option_A${index} .ql-editor`);
    
    if (ele) 
      {
        ele.oncopy = (e) => copy_cut_Handler(e);
        ele.oncut = (e) => copy_cut_Handler(e);
        ele = document.querySelector(`.question_option_A${index}`);
        if(ele)
        ele.onclick = () => {
          mark_selected_element_with_border(`quill question_option_A${index}`)
        }
    }

    ele = document.querySelector(`.question_option_A${index} .ql-toolbar .ql-direction`);
    
    if (ele) ele.click();

        ele = document.querySelector(`.question_option_B${index} .ql-editor`);
       
    if (ele)
        {
          ele.oncopy = (e) => copy_cut_Handler(e);
          ele.oncut = (e) => copy_cut_Handler(e);
          ele = document.querySelector(`.question_option_B${index}`);
          if(ele)
          ele.onclick = () => {
            mark_selected_element_with_border(`quill question_option_B${index}`)
          }
    }
    
    ele = document.querySelector(`.question_option_B${index} .ql-toolbar .ql-direction`);
    
    if (ele) ele.click();

        ele = document.querySelector(`.question_option_C${index} .ql-editor`);
     
    if (ele)
        {
          ele.oncopy = (e) => copy_cut_Handler(e);
          ele.oncut = (e) => copy_cut_Handler(e);
          ele = document.querySelector(`.question_option_C${index}`);
          if (ele)
          ele.onclick = () => {
            mark_selected_element_with_border(`quill question_option_C${index}`)
          }          
    }
    
    ele = document.querySelector(`.question_option_C${index} .ql-toolbar .ql-direction`);
    
    if (ele) ele.click();

        ele = document.querySelector(`.question_option_D${index} .ql-editor`);
      
    if (ele) 
        {
          ele.oncopy = (e) => copy_cut_Handler(e);
          ele.oncut = (e) => copy_cut_Handler(e);
          ele = document.querySelector(`.question_option_D${index}`);
          if(ele)
          ele.onclick = () => {
            mark_selected_element_with_border(`quill question_option_D${index}`)
          }              
    }

    ele = document.querySelector(`.question_option_D${index} .ql-toolbar .ql-direction`);
    
    if (ele) ele.click();

        ele = document.querySelector(`.question_option_E${index} .ql-editor`); 
        if (ele) 
        {
          ele.oncopy = (e) => copy_cut_Handler(e);
          ele.oncut = (e) => copy_cut_Handler(e);
          ele = document.querySelector(`.question_option_E${index}`); 
          if(ele)
            ele.onclick = () => {
              mark_selected_element_with_border(`quill question_option_E${index}`)
            }              
    }

    ele = document.querySelector(`.question_option_E${index} .ql-toolbar .ql-direction`);
    
    if (ele) ele.click();

        ele = document.querySelector(`.explanation${index} .ql-editor`); 
        
    if (ele) 
        {
          ele.oncopy = (e) => copy_cut_Handler(e);
          ele.oncut = (e) => copy_cut_Handler(e);
          ele = document.querySelector(`.explanation${index}`); 
          if(ele)
          ele.onclick = () => {
            mark_selected_element_with_border(`quill explanation${index}`)
          }    
    }

    ele = document.querySelector(`.explanation${index} .ql-toolbar .ql-direction`);
    
    if (ele) ele.click();
       
      if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear()
        window.MathJax.typeset()
      }
      
  }, [question_added_length]);

  window.addEventListener('scroll', () => {

    let ele = document.getElementById('add_exam_toolbar_show_hide_button');
    let ele2 = document.getElementById('show_hide_math_api');

    let now = window.scrollY;

    if (now > 100)
    {
      if (ele) ele.style.display = 'block';
      if (ele2) ele2.style.display = 'block';
    }
    else 
    {
      if (ele) ele.style.display = 'none';
      if (ele2) ele2.style.display = 'none';
    }

  });

  // let math_equation_ref = useRef('');
  let science_options = (

    <select id="units_select"  onChange={(e) => add_unit(e.target.value)}>
      {science_12_units.map((e) => {
        return <option value={e}>{e}</option>;
      })}
    </select>
  );


  /////////////////////////   subject units options ///////////////////////////////
  let math_options = (
    <select id="units_select" onChange={(e) => add_unit(e.target.value)}>
      <optgroup label ="الجزء الأول"  style={{color:'white', backgroundColor:'gray'}} >  
      {math1_12_units.map((e) => {
        return <option value={e}>{e}</option>;
      })}
        </optgroup>
          <optgroup label ="الجزء الثاني"  style={{color:'white', backgroundColor:'gray'}}>  
      {math2_12_units.map((e) => {
        return <option value={e}>{e}</option>;
      })}
        
        </optgroup>
    </select>
  );

  let physics_options = (
    <select id="units_select" onChange={(e) => add_unit(e.target.value)}>
      {physics_12_units.map((e) => {
        return <option value={e}>{e}</option>;
      })}
    </select>
  );

  let chemistry_options = (
    <select id="units_select" onChange={(e) => add_unit(e.target.value)}>
      {chemistry_12_units.map((e) => {
        return <option value={e}>{e}</option>;
      })}
    </select>
  );

  let arabic_options = (
    
    <select id="units_select" onChange={(e) => add_unit(e.target.value)}>
    {arabic_12_units.map((e) => {
      return <option value={e}>{e}</option>;
    })}
  </select>
  )

  let islam_options = (
    
    <select id="units_select" onChange={(e) => add_unit(e.target.value)}>
    {islam_12_units.map((e) => {
      return <option value={e}>{e}</option>;
    })}
  </select>
  )
  
  ////////////////////////////////////////////////////////
  
  let questions = questions_added.map((e, index) => {
    
    let json = JSON.parse(localStorage.getItem(`question${index}`));
 
    return (
      <>
        <div className="question_body">
          <div className="add_test_question_number">السؤال {index + 1} :</div>

          <div className="test_content_container">
            <div className="add_question_label"> محتوى السؤال </div>
 

            <ReactQuill
             className={"question_text_content_container" + index}
                theme="snow"
              placeholder="يمكنك وضع نص السؤال هنا"
              modules={modules}
              formats={[
                "direction",
                "image",
                "bold",
                "italic",
                "align",
                "underline",
                "strike",
                "color",
                "background",
                'clean',
                'size',
                'indent',
              ]}
            />  
              
            <button onClick={() => {
              change_question_text("question_text_content_container" + index, index);
              notification(`تم حفظ التغييرات في حقل السؤال رقم ${index + 1}`, 'toast_correct', 2000);
            }}> حفظ التغييرات </button>
            
          </div>
         
          <div className="question_option_section">
            <div className="question_option_A_container">
              <label className="question_option_A_label">الخيار A </label>

              <ReactQuill
              className={"question_option_A"+index}
              theme="snow"
              placeholder="إن كنت لا تريد أن تضيف هذا الخيار , دعه فارغاً"
              modules={modules}
              formats={[
                "direction",
                "image",
                "bold",
                "italic",
                "align",
                "underline",
                "strike",
                "color",
                "background",
                'clean',
                'size',
                'indent',
                ]}
            />  
              <button onClick={() => {
                change_option_A("question_option_A" + index, index);
                notification(`تم حفظ التغييرات في حقل الخيار A في السؤال رقم ${index + 1}`, 'toast_correct', 2000);
            } }> حفظ التغييرات </button>
            </div>

            <div className="question_option_B_container">
              <label className="question_option_B_label"> الخيار B</label>
              
                 <ReactQuill
              className={"question_option_B"+index}
                theme="snow"
                placeholder="إن كنت لا تريد أن تضيف هذا الخيار , دعه فارغاً"
                modules={modules}
                formats={[
                  "direction",
                  "image",
                  "bold",
                  "italic",
                  "align",
                  "underline",
                  "strike",
                  "color",
                  "background",
                  'clean',
                  'size',
                  'indent',
                  ]}
              />
               <button onClick={() => {
                change_option_B("question_option_B" + index, index)
                notification(`تم حفظ التغييرات في حقل الخيار B في السؤال رقم ${index+1}`,'toast_correct',2000)
            } }> حفظ التغييرات </button>
            </div>

            <div className="question_option_C_container">
              <label className="question_option_C_label"> الخيار C </label>
              
              <ReactQuill
              className={"question_option_C"+index}
                theme="snow"
                placeholder="إن كنت لا تريد أن تضيف هذا الخيار , دعه فارغاً"
                modules={modules}
                formats={[
                  "direction",
                  "image",
                  "bold",
                  "italic",
                  "align",
                  "underline",
                  "strike",
                  "color",
                  "background",
                  'clean',
                  'size',
                  'indent',
                  ]}
              />
             <button onClick={() => {
                change_option_C("question_option_C" + index, index)
                notification(`تم حفظ التغييرات في حقل الخيار C في السؤال رقم ${index+1}`,'toast_correct',2000)
            } }> حفظ التغييرات </button>
 
            </div>

            <div className="question_option_D_container">
              <label className="question_option_D_label">الخيار D</label>
              
               <ReactQuill
              className={"question_option_D"+index}
                theme="snow"
                placeholder="إن كنت لا تريد أن تضيف هذا الخيار , دعه فارغاً"
                modules={modules}
                formats={[
                  "direction",
                  "image",
                  "bold",
                  "italic",
                  "align",
                  "underline",
                  "strike",
                  "color",
                  "background",
                  'clean',
                  'size',
                  'indent',
                  ]}
              />
             <button onClick={() => {
                change_option_D("question_option_D" + index, index)
                notification(`تم حفظ التغييرات في حقل الخيار D في السؤال رقم ${index+1}`,'toast_correct',2000)
            } }> حفظ التغييرات </button>
   
            </div>

            <div className="question_option_E_container">
              <label className="question_option_E_label">الخيار E</label>
           
              <ReactQuill
              className={"question_option_E"+index}
                theme="snow"
                placeholder="إن كنت لا تريد أن تضيف هذا الخيار , دعه فارغاً"
                modules={modules}
                formats={[
                  "direction",
                  "image",
                  "bold",
                  "italic",
                  "align",
                  "underline",
                  "strike",
                  "color",
                  "background",
                  'clean',
                  'size',
                  'indent',
                  ]}
              />
              <button onClick={() => {
                change_option_E("question_option_E" + index, index);
                notification(`تم حفظ التغييرات في حقل الخيار E في السؤال رقم ${index+1}`,'toast_correct',2000)
            } }> حفظ التغييرات </button>
 
            </div>
          </div>
          <div className="options_and_answers_section">
            <div className="select_right_option_Container">
              <label className="right_option_label"> الإجابة الصحيحة</label>

              <select
                className={`question_right_option${index}`}
                onChange={(e) => change_right_answer(e.target.value, index)}
                value={json.right_answer}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>

            <div className="explanation_container">
              <label className="explanation_label">شرح الإجابة الصحيحة</label>
              
             <ReactQuill
              className={"explanation" + index}
                theme="snow"
                placeholder="شرح الإجابة الصحيحة"
                modules={modules}
                formats={[
                  "direction",
                  "image",
                  "bold",
                  "italic",
                  "align",
                  "underline",
                  "strike",
                  "color",
                  "background",
                  'clean',
                  'size',
                  'indent',
                ]}
              />    
              <button onClick={() => {
                change_explanation("explanation" + index, index)
                notification(`تم حفظ التغييرات في حقل شرح الإجابة في السؤال رقم ${index+1}`,'toast_correct',2000)
            } }> حفظ التغييرات </button>  
            </div>
          </div>
        </div>

      </>
    );
  });

  return (
    <>
      <div id="upper_part_add_exam"></div>

      <div id="add_exam_root">
        <div id="add_exam_title">صفحة إضافة اختبار 

          <i className="fa-solid fa-pen-to-square"></i>
        </div>

        <div id="add_exam_first_part_section">
          <div id="add_subject_and_exam_name">
            <div id="class_container">
              <div id="class_title">  الصف : </div>
              <select
                name="class_select"
                id="class_select"
                value={Class}
                onChange={ (e) => change_class(e.target.value)  }>
                <option value="12">بكلوريا</option>
                <option value="9">تاسع</option>
              </select>
            </div>
          <div id="subject_name_container">
            <span id="subject_name_word">اختر المادة : </span>
            <select
              name="subject_name"
              id="select_subject_name"
              value={subject_name}
              onChange={(e) => {
                change_subject_name(e.target.value);
                }}>
                
              <optgroup label="مواد بكلوريا">
                <option value="math">رياضيات </option>
                <option value="science">علوم </option>
                <option value="arabic">عربي </option>
                <option value="physics">فيزياء </option>
                <option value="chemistry">كيمياء </option>
                <option value="english">انكليزي </option>
                <option value="islam"> ديانة إسلامية </option>
                <option value="france"> فرنسي </option>
              </optgroup>

              <optgroup label="مواد تاسع">
                <option value="math">رياضيات </option>
                <option value="science">علوم </option>
                <option value="physics_chemistry"> فيزياء و كيمياء </option>
                <option value="arabic">عربي </option>
                <option value="english"> انكليزي </option>
                <option value="islam"> التربية الدينية </option>
                <option value="geography">الاجتماعيات </option>
                <option value="france"> فرنسي </option>
              </optgroup>
            </select>
          </div>

          <div id="exam_name_container">
            <label htmlFor="exam_name" id="exam_name_label">
              اسم الاختبار : 
            </label>
            <input
              type="text"
              id="exam_name"
              onBlur={(e) => change_exam_name(e.target.value)}/>
            
            </div>
            <div id="exam_price_container">
          <label htmlFor="exam_price" id="exam_price_label">
            حدد سعر الاختبار : 
          </label>
          <input
            type="number"
                id="exam_price"
                defaultValue={0}
            onChange={(e) => change_exam_price(e.target.value)}
          />
     
        </div>
          <div id="exam_price_hint">
            * يجب أن يكون السعر أكبر أو يساوي 1000 و أصغر أو يساوي 20000 ,
			إن كنت ترغب بأن يكون الاختبار مجاني , دع هذا الحقل فارغاً
          </div>

        </div>

        <div id="units_section">
          <div id="first_part_units">
            <span id="add_unit_title"> اضف موضوعاً للاختبار : </span>
            {subject_name + "_" + Class === "math_12" && math_options}
            {subject_name + "_" + Class === "science_12" && science_options}
            {subject_name + "_" + Class === "physics_12" && physics_options}
            {subject_name + "_" + Class === "chemistry_12" && chemistry_options}
            {subject_name + "_" + Class === "arabic_12" && arabic_options}
            {subject_name + "_" + Class ===   "islam_12" && islam_options}
          </div>
       
       <div id="second_part_units">
		    <div id="units_hint" >* هون منضيف المواضيع يلي عم يحكي عنها الاختبار , من شان نساعد الطالب يدور ع الشي يلي بدو ياه , اكبس ع X لتحذف موضوع </div>
       
            <div id="units_subject_title">مواضيع الاختبار :   </div>
              <div id="units_subject_container">
              {units.map((e, index) => {
              return (
                <>
                  <div className="single_unit_container">
                    <span className="add_single_unit">{`${e}` } </span>
                    <span
                      className="delete_unit_button"
                      onClick={() => delete_unit(e)}>
                      X
                    </span>
                  </div>
                </>
              );
            })}
             </div>
           
          </div>
		
        </div>
       </div>


        <div id="hint_refresh_add_test">
            <span style={{ color: "red" }}>*ملاحظة هامة</span> عند إعادة تحميل
            الصفحة فإن كل المعلومات المدخلة ستبقى كما هي , لكن كل الصور المُرفقة
            سيتم مسحها 
        </div>
        
         <h1 id="add_test_title"> قسم إضافة الأسئلة: </h1>
         <div id="add_test_title_hint"> *من هنا يمكنك البدء بإضافة الأسئلة , تذكر بان تضغط على الزر "حفظ التغييرات " لكي يتم تحليل المحتوى الذي قمت بكتابته و حفظه </div>
        <div id="add_test_root">
        <div id="AddExam_toolbar">
         
         <div id="AddExam_equation_edit_section" >
           <div id="AddExam_equation_edit_section_header">  قسم تنسيق المعادلات :</div>

             <div id="AddExam_equation_related_styles">
        
             <div id="AddExam_equation_color_container">
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
            
           <div id="AddExam_equation_size_manager_container">
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
         <div id="AddExam_image_edit_section">
           <div id="AddExam_image_edit_header">  قسم تعديل الصور</div>
           <div id="AddExam_image_size_body">
        <label htmlFor="AddExam_input_range" id="input_range_label">
          حجم الصورة الحالي :
        </label>

           <div id="range_and_span_container">
          <span>10px</span>
          <input
            type="range"
            id="AddExam_input_range"
            max={2000}
            min={10}
            defaultValue={150}
            onChange={(e) => range_change_width(e.target.value)}
          />
          <span>2000px</span>
        </div>
      
       </div>  
         </div>
       
     </div>
          <div id="questions_container">{questions}</div>
          <button id="add_test_button" onClick={add_question}>
            اضافة سؤال جديد
          </button>
          {questions_added.length > 0 && (
            <button id="delete_test_button" onClick={delete_question}>
              حذف آخر سؤال
             &nbsp;
              <i className="fa-regular fa-trash-can"></i> 
            </button>
          )}
        </div>
        <button id="show_hide_math_api" onClick={hide_show_math_editor}>
          إضافة معادلة أو رمز
        </button>

        <div className="math_hidden_equation" style={{display:'none'}}></div>
        
           
        <div id="math_api">
          <div id="math_api_row">
                          
            <math-field
             placeholder="أدخل.المعادلة.من.هنا"
            ref ={math_equation}>
            </math-field> 
            

              <button   id="add_equation_button_AddExam" onClick={conv}  >  إضافة المعادلة </button>
         </div>
        </div>

        <div id="add_test_errors"> </div>
      </div>
      <button id="show_exam_box_button" onClick={open_exam_send_box}>
        لقد انتهيت من وضع الاختبار
      </button>

      <div
        id="send_exam_black_background"
        onClick={close_send_exam_background}></div>
      
      <div id="send_exam_check_box">
        <div id="send_exam_close_icon" onClick={close_send_exam_background}>X</div>
      
        <div id="send_exam_loading_title">
          <div id="spinner"></div>
           يتم الآن التحقق من الاختبار
        </div>

        <div id="send_exam_status">
          <div id="send_exam_status_title"></div>
          <div id="send_exam_body_section"></div>
        </div>

        <div id="send_exam_button" onClick={send_exam}>
          إرسال الاختبار
        </div>

        <div id="spinner_and_loading_title" style={{
          width:'fit-content',
          margin:' 5% auto',
          fontSize: '150%',
          display: 'none',
        }} >
          <div id="spinner"></div>
           يتم إرسال البيانات
        </div>

      </div>

      <button id="add_exam_toolbar_show_hide_button"
        onClick={AddExam_show_hide_toolbar} > تنسيق المعادلات والصور</button>
      <div style={{ display: 'none' }} id="math_ml" onClick={conv} ></div>
    </>
  );

  function range_change_width( wid ) {

    let current_element = document.querySelector(`${sessionStorage.getItem('selected_image')}`);
    if (!current_element)
    {
      let ele = document.getElementById('AddExam_image_size_body');
      ele.style.opacity = '0.2';
      ele.style.pointerEvents = 'none';
      return;
    }    
    current_element.style.width = wid + 'px';
  }

 
  function change_equation_feature(porp  , value) {
  
    let current_element = document.querySelector(`[class ^="${sessionStorage.getItem('selected_field')}"] .${sessionStorage.getItem('selected_equation')}  `);
    if (!current_element) return;
    
    let event = new Event('input', {
      bubbles: true,
      cancelable:true,
    })
    current_element.dispatchEvent(event);
      
    current_element.style.cssText += `${porp} : ${value};`;
    
  }

  function AddExam_show_hide_toolbar()
  {
   
    let ele = document.getElementById('AddExam_toolbar');
    let btn = document.getElementById('add_exam_toolbar_show_hide_button');

    if (ele.style.display == "flex")
    {
      ele.style.display = 'none';
      btn.textContent = " تنسيق المعادلات و الصور";
    }
    else 
    {
      ele.style.display = 'flex';
      btn.textContent = 'إخفاء';
    }
  
  }
  
  function change_class(current_class) {

    if (Class === current_class) return;

    let unit = [];
      unit.push( math1_12_units[0]);
   localStorage.setItem('class', current_class);
    set_exam_state({
      units: unit,
      Class : current_class ,
      exam_name: "",
      subject_name: "math",
      questions_added: [],
      question_added_length : 0 ,
    });
  }

  function change_subject_name(name) {

    if (subject_name === name) return;

    localStorage.setItem("subject_name", name);

    let unit = [];
    if (name + "_" + Class == 'math_12')
      unit.push( math1_12_units[0]);
    if (name + "_" + Class == 'science_12')
      unit.push( science_12_units[0]);
    if (name + "_" + Class == 'physics_12')
      unit.push( physics_12_units[0]);
    if (name + "_" + Class  == 'chemistry_12')
      unit.push(chemistry_12_units[0]);
    if (name + "_" + Class == 'arabic_12')
      unit.push( arabic_12_units[0]);
    if (name + "_" + Class == 'islam_12')
      unit.push( islam_12_units[0]);

    set_exam_state({
      units: unit,
      Class : Class ,
      exam_name: "",
      subject_name: name,
      questions_added: [],
      question_added_length : 0 ,
    });
  }

  function change_exam_name(name) {

    if (name === exam_name) return;

    localStorage.setItem("exam_name", name);

    set_exam_state({ ...previous_state, exam_name: name });
  }

  function add_unit(unit) {

    let add = true;

    for (let i = 0; i < units.length; i++) {
      if (units[i] === unit) add = false;
    }

    if (add && unit.length > 0) {
      let new_units = units;

      new_units.push(unit);

      localStorage.setItem("units", new_units);

      set_exam_state({ ...previous_state, units: new_units });
    }
  }

  function delete_unit(unit) {
    let tem = units;

    tem = tem.filter((e) => e != unit);

    localStorage.setItem("units", tem);

    set_exam_state({ ...previous_state, units: tem });
  }

  function change_exam_price(val) {
    localStorage.setItem("price", val);
  }


  function change_question_text(cls, number) {
     
    
    let ele = document.querySelector(`.${cls} .ql-editor`).cloneNode(true);
    
    if (ele.innerHTML === '<p><br></p>'  || ele.innerHTML === '<p class=\"ql-align-right ql-direction-rtl\"><br></p>')
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.test_content = "" ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
        return;
      }
    
    validate_className();
    
    let curr = ele.childNodes;
 
    // curr.forEach(e => {
    //   console.log(' child is ', e);
 
    // } )
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

    if (ele)
    {
      let obj = JSON.parse(localStorage.getItem(`question${number}`));
      obj.test_content =  ele.innerHTML ;
      localStorage.setItem(`question${number}`, JSON.stringify(obj));
    }

  }

  function change_option_A(cls, number) {

    
    let ele = document.querySelector(`.${cls} .ql-editor`).cloneNode(true);

    if (ele.innerHTML === '<p><br></p>'  || ele.innerHTML === '<p class=\"ql-align-right ql-direction-rtl\"><br></p>') 
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
      
        obj.option_A = "" ;
      
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
        return;
    }
    
    validate_className();
    
    let curr = ele.childNodes;

    curr.forEach(e => {

      let rec = e.childNodes;
      
      if (rec)
      {
        rec.forEach(r => {
      
          let equation = "";
      
          if (r.tagName === "SPAN" && r.className.includes('equation_'))
      
            r.classList.forEach(c => { 
      
              if (c.includes('equation_') || c.includes('ql-formula')) return;
      
               equation += c;
               equation += ' ';
            });
          
          if (r.tagName === "SPAN" && r.className.includes('equation_') )
          {
            r.innerHTML = `${equation}`;
          }
        })
      }
    })

    if (ele)
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.option_A =  ele.innerHTML ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
      }
 
  }

  function change_option_B(cls, number) {
    
    let ele = document.querySelector(`.${cls} .ql-editor`).cloneNode(true);
    
    if (ele.innerHTML === '<p><br></p>'  || ele.innerHTML === '<p class=\"ql-align-right ql-direction-rtl\"><br></p>' )
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.option_B = "" ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
        return;
      }
    
    validate_className();
    let curr = ele.childNodes;

    curr.forEach(e => {
    
      let rec = e.childNodes;
    
      if (rec)
      {
        rec.forEach(r => {
      
          let equation = "";
      
          if (r.tagName === "SPAN" && r.className.includes('equation_'))
      
            r.classList.forEach(c => { 
      
          if (c.includes('equation_') || c.includes('ql-formula')) return;
             equation += c;
             equation += ' ';
          });
          
          if (r.tagName === "SPAN" && r.className.includes('equation_') )
          {
            r.innerHTML = `${equation}`;
          }

        })
      }
    })

    if (ele)
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.option_B =  ele.innerHTML ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
      }
  }

  function change_option_C(cls, number) {
    
    let ele = document.querySelector(`.${cls} .ql-editor`).cloneNode(true);

    if (ele.innerHTML === '<p><br></p>'  || ele.innerHTML === '<p class=\"ql-align-right ql-direction-rtl\"><br></p>'  )
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.option_C = "" ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
        return;
    }
    
    validate_className();
    
    let curr = ele.childNodes;

    curr.forEach(e => {
    
      let rec = e.childNodes;
    
      if (rec)
      {
        rec.forEach(r => {
          let equation = "";
    
          if (r.tagName === "SPAN" && r.className.includes('equation_'))
            r.classList.forEach(c => { 
    
          if (c.includes('equation_') || c.includes('ql-formula')) return;
             equation += c;
             equation += ' ';
            });
          
          if (r.tagName === "SPAN" && r.className.includes('equation_') )
          {
            r.innerHTML = `${equation}`;
          }
        })
      }
    })

    if (ele)
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.option_C =  ele.innerHTML ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
      }
  }

  function change_option_D(cls, number) {
    
    let ele = document.querySelector(`.${cls} .ql-editor`).cloneNode(true);

    if (ele.innerHTML === '<p><br></p>' || ele.innerHTML === '<p class=\"ql-align-right ql-direction-rtl\"><br></p>' )
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.option_D = "" ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
        return;
    }
    
    validate_className();
    
    let curr = ele.childNodes;

    curr.forEach(e => {
      let rec = e.childNodes;
      if (rec)
      {
        rec.forEach(r => {
          let equation = "";

          if(r.tagName === "SPAN" && r.className.includes('equation_'))
           r.classList.forEach(c => { 
          
           if (c.includes('equation_') || c.includes('ql-formula')) return;
             equation += c;
             equation += ' ';
           });
          
          if (r.tagName === "SPAN" && r.className.includes('equation_') )
          {
            r.innerHTML = `${equation}`;
          }
        })
      }
    })

    if (ele)
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.option_D =  ele.innerHTML ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
      }
  }

  function change_option_E(cls, number) {
    
    let ele = document.querySelector(`.${cls} .ql-editor`).cloneNode(true);

    if (ele.innerHTML === '<p><br></p>'  || ele.innerHTML === '<p class=\"ql-align-right ql-direction-rtl\"><br></p>' )
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.option_E = "" ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
        return;
    }
    
    validate_className();
    
    let curr = ele.childNodes;

    curr.forEach(e => {
    
      let rec = e.childNodes;
    
      if (rec)
      {
        
        rec.forEach(r => {
        
          let equation = "";
        
          if (r.tagName === "SPAN" && r.className.includes('equation_'))
           r.classList.forEach(c => { 
        
          if (c.includes('equation_') || c.includes('ql-formula')) return;
             equation += c;
             equation += ' ';
           });
          
          if (r.tagName === "SPAN" && r.className.includes('equation_') )
          {
            r.innerHTML = `${equation}`;
          }
        })
      }
    })

    if (ele)
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.option_E =  ele.innerHTML ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
      }
  }

  function change_right_answer(content, index) {

    let ele = JSON.parse(localStorage.getItem(`question${index}`));

    if (ele.right_answer === content) return;
    let error = false;

    if (content === "A" && ele.option_A.trim().length <= 0) error = true;
    if (content === "B" && ele.option_B.trim().length <= 0) error = true;
    if (content === "C" && ele.option_C.trim().length <= 0) error = true;
    if (content === "D" && ele.option_D.trim().length <= 0) error = true;
    if (content === "E" && ele.option_E.trim().length <= 0) error = true;

    if (error) {
      notification(`إن الحقل ${content} فارغ`, 'toast_error');
      return;
    }

    ele.right_answer = content;

    localStorage.setItem(`question${index}`, JSON.stringify(ele));

    let array = questions_added;

    array[index].right_answer = content;
 
    set_exam_state({ ...previous_state, questions_added: array });
  }

  function change_explanation(cls, number) {
    
    let ele = document.querySelector(`.${cls} .ql-editor`).cloneNode(true);
    if (ele.innerHTML === '<p><br></p>'  || ele.innerHTML === '<p class=\"ql-align-right ql-direction-rtl\"><br></p>' )
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.explanation = "" ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
        return;
      }
      validate_className();
    let curr = ele.childNodes;

    curr.forEach(e => {
      let rec = e.childNodes;
      if (rec)
      {
        rec.forEach(r => {
          let equation = "";
          if(r.tagName === "SPAN" && r.className.includes('equation_'))
           r.classList.forEach(c => { 
            if (c.includes('equation_') || c.includes('ql-formula') ) return;
             equation += c;
             equation += ' ';
          });
          if (r.tagName === "SPAN" && r.className.includes('equation_') )
          {
            r.innerHTML = `${equation}`;
          }
        })
      }
    })

    if (ele)
      {
        let obj = JSON.parse(localStorage.getItem(`question${number}`));
        obj.explanation =  ele.innerHTML ;
        localStorage.setItem(`question${number}`, JSON.stringify(obj));
      }
  }

  function add_question() {

    let last = questions_added.length;
    let new_array = questions_added;

    if (last - 1 >= 0) {
      let check_options = JSON.parse(
        localStorage.getItem(`question${last - 1}`)
      );

      let valid = false;
      if (check_options.test_content.trim().length > 0)
        valid = true;

      if (!valid) {
        notification(`يجب عليك أن تضع نصاً لمحتوى السؤال رقم ${last}`, 'toast_error');
        return;
      }

      valid = 0;
      
      if (check_options.option_A.trim().length > 0) valid++;
      if (check_options.option_B.trim().length > 0) valid++;
      if (check_options.option_C.trim().length > 0) valid++;
      if (check_options.option_D.trim().length > 0) valid++;
      if (check_options.option_E.trim().length > 0) valid++;

      if (valid <= 1) {
        notification(`يجب عليك إضافة إجابتين على الأقل للسؤال ${last}`, 'toast_error');
        return;
      }

      valid = false;

      if (
        check_options.option_A.toString().trim().length > 0 &&
        check_options.right_answer === "A"
      )
        valid = true;
      if (
        check_options.option_B.toString().trim().length > 0 &&
        check_options.right_answer === "B"
      )
        valid = true;
      if (
        check_options.option_C.toString().trim().length > 0 &&
        check_options.right_answer === "C"
      )
        valid = true;
      if (
        check_options.option_D.toString().trim().length > 0 &&
        check_options.right_answer === "D"
      )
        valid = true;
      if (
        check_options.option_E.toString().trim().length > 0 &&
        check_options.right_answer === "E"
      )
        valid = true;

      if (!valid) {
        notification(`لقد تم اختيار الخيار ${check_options.right_answer} كإجابة ولكن الخيار فارغ في السؤال رقم ${last}`, 'toast_error');
        return;
      }
    }

    let obj = {
      test_content: "",
      option_A: "",
      option_B: "",
      option_C: "",
      option_D: "",
      option_E: "",
      right_answer: "A",
      explanation: " لا يتوفر شرح للإجابة ",
    };

    new_array.push(obj);

    localStorage.setItem(`question${last}`, JSON.stringify(obj));

    set_exam_state({ ...previous_state, questions_added: new_array ,  question_added_length: new_array.length });    
  }

  function delete_question() {

    let new_arr = questions_added;
    localStorage.removeItem(`question${new_arr.length - 1}`);
    new_arr.pop();
    set_exam_state({ ...previous_state, questions_added: new_arr , question_added_length:new_arr.length  });
  }

  function hide_show_math_editor() {

    let now = document.getElementById("math_api");
    let bt = document.getElementById("show_hide_math_api");

    if (now.style.display =='flex'  ) {
      bt.textContent = "إضافة معادلة أو رمز";
      now.style.display = "none";
    }
     else {

      bt.textContent = "إخفاء مربع الإضافة";
      now.style.display = "flex";
    }
  }
 


  function close_send_exam_background() {

    let ele = document.getElementById("send_exam_black_background");
    
    if (ele)
      ele.style.display = "none";
    
    ele = document.getElementById("send_exam_check_box");
    if (ele) ele.style.display = "none";
    
    ele = document.getElementById("spinner_and_loading_title");
    if (ele) ele.style.display = "none";

    ele = document.getElementById("send_exam_status");
    if (ele) ele.style.display = "none";
    
    ele = document.getElementById("send_exam_button");
    if (ele) ele.style.display = "none";
    
    ele = document.getElementById("send_exam_status_title");
    if (ele) ele.style.display = "none";
    
    ele = document.getElementById("send_exam_body_section");
    if(ele) ele.style.display = "none";

    let d = 2500;
    while (d >= 0) {
      clearTimeout(d);
      d--;
    }
  }


  // initialize the send exam box and background 
  function open_exam_send_box() {

    // if (questions_added.length < 5) {
    // notification("إن عدد الاسئلة المضافة أقل من 5 , قم بإضافة أسئلة أكثر", 'toast_error');
    //   return;
    // }

    document.getElementById("send_exam_check_box").style.backgroundColor =
      "rgb(17, 17, 17)";
    document.getElementById("send_exam_black_background").style.display =
      "block";
    document.getElementById("send_exam_loading_title").style.display = "none";
    document.getElementById("send_exam_check_box").style.display = "block";
    document.getElementById("send_exam_check_box").style.animationName ="show_up_add_exam";

 
      setTimeout(start_check_stage, 400);
  
  }

  // shows the processing spinner with title 
  
  function start_check_stage() {

    document.getElementById("send_exam_loading_title").style.display = "block";
  
    setTimeout(show_exam_status, 2500);
  
  }

  // show the body of the send exam box , error in case of faild or send permission
  
  function show_exam_status() {
    document.getElementById("send_exam_loading_title").style.display = "none";
    document.getElementById("send_exam_status").style.display = "block";
    document.getElementById("send_exam_status_title").style.display = "block";
    document.getElementById("send_exam_body_section").style.display = "block";

    let valid = true;
    let error_array = [];
    let error_num = [];
    // check exam name :
    let examName = localStorage.getItem("exam_name");

    if (examName === null || examName.toString().length <= 3) {
      error_array.push(`يجب أن يكون اسم الاختبار أطول من 3 أحرف`);
      error_num.push(` اسم الاختبار `);

    }
    else if (examName.toString().length >= 70) {
      error_array.push(`يجب أن يكون اسم الاختبار أقل من 70 حرف`);
      error_num.push(` اسم الاختبار  `);
    }

    // check units length

    if (units.length <= 0) {
      error_array.push(`عليك أن تضيف موضوع واحد للاختبار على الأقل`);
      error_num.push(` موضوع الاختبار `);
    }
    // check if the price is valid

    let pr = localStorage.getItem("price");

    if (pr) {
      pr = parseInt(pr);

      if (pr < 1000) {
        error_num.push("السعر");
        error_array.push(" سعر الاختبار يجب أن يكون على الأقل 1000 ل.س");
      }

      if (pr > 20000) {
        error_num.push("السعر");
        error_array.push(" سعر الاختبار أكبر من 20000 ل.س");
      }
    }

    for (let i = 0; i < questions_added.length; i++) {
      let now = JSON.parse(localStorage.getItem(`question${i}`));

      if (now.test_content.trim().length <= 0 ) {
        error_array.push(`هذا السؤال لا يملك نص `);
        error_num.push(`السؤال ${i + 1}`);
      }

      valid = 0;
      
      if (now.option_A.trim().length > 0) valid++;
      if (now.option_B.trim().length > 0) valid++;
      if (now.option_C.trim().length > 0) valid++;
      if (now.option_D.trim().length > 0) valid++;
      if (now.option_E.trim().length > 0) valid++;

      if (valid < 2) {
        error_array.push(`   هذا السؤال يمتلك أقل من خيارين اثنين`);
        error_num.push(`السؤال ${i + 1}`);
      }

      valid = false;
      valid =
        (now.option_A.toString().trim().length <= 0 &&
          now.right_answer === "A") ||
        (now.option_B.toString().trim().length <= 0 &&
          now.right_answer === "B") ||
        (now.option_C.toString().trim().length <= 0 &&
          now.right_answer === "C") ||
        (now.option_D.toString().trim().length <= 0 &&
          now.right_answer === "D") ||
        (now.option_E.toString().trim().length <= 0 &&
          now.right_answer === "E");

      if (valid) {
        error_array.push(`جواب هذا السؤال غير صالح`);
        error_num.push(`السؤال ${i + 1}`);
      }

    }

    if (error_array.length > 0) {
      let ele = document.getElementById("send_exam_status_title");

      ele.innerHTML = `
            النتيجة : <span style="color:red;">فشل</span>
            <br/>
            <br/>
            <div style="font-size:70%;">
                  قم بتصحيح الأخطاء التالية: 

            </div>
            <br/>`;

      let add = ` <div  > `;
      error_array.forEach((e, index) => {
        add += `<div  style="color:red; font-size:16px;  padding:5px;  " >    ${error_num[index]} : ${e} </div>`;
      });
      add += "</div>";

      document.getElementById("send_exam_body_section").innerHTML = add;
    }
    else {

      let body = document.getElementById("send_exam_body_section");
      let Units = "";
      for (let i = 0; i < units.length; i++) {
        Units += units[i];
        if (i < units.length - 1) Units += ' , ';
      }
      body.innerHTML = "";
      body.innerHTML += ` <div class ="exam_info" > <span> المادة : </span> ${reference[
        localStorage.getItem("subject_name") + "_" + Class
      ]} </div> `;
      body.innerHTML += ` <div class ="exam_info"> <span>اسم الاختبار :</span> ${localStorage.getItem(
        "exam_name"
      )} </div> `;
      body.innerHTML += ` <div class ="exam_info"> <span>موضوع الاختبار : </span> ${Units} </div> `;

      body.innerHTML += ` <div class ="exam_info"> <span> السعر : </span> ${
      
        localStorage.getItem("price") === null ||
        localStorage.getItem("price").length <= 0
          ? "مجاني"
          : localStorage.getItem("price")
        } </div> `;
      
      body.innerHTML += ` <div class ="exam_info"> <span>عدد الاسئلة : </span> ${questions_added.length} </div> `;

      document.getElementById(
        "send_exam_status_title"
      ).innerHTML = ` النتيجة : <span style="color:rgb(3, 180, 3); font-weight:bold;">نجاح</span> 
                      <br/>
                      <br/>
                      تستطيع الان إرسال الاختبار`;

      document.getElementById("send_exam_button").style.display = "block";
    }
  }

  function send_exam() {

    let url = BaseURL + CreateExam;

    let Units = "";
    for (let i = 0; i < units.length; i++) {
      Units += units[i];
      if ( i < units.length - 1 ) Units += " , ";
    }

    let price = localStorage.getItem("price");

    if (price) price = 0;

    let obj = {
      publisher_id: user.user_id,
      publisher_name : user.full_name,
      Class : Class ,
      package_name: localStorage.getItem("exam_name"),
      units: Units,
      subject_name: localStorage.getItem("subject_name"),
      price: price ? price : 0 ,
      number_of_questions: questions.length,
    };
    
    axios
      .post(url, obj)
      .then((res) => new_send_qeustions(res.data.id))
      .catch((err) => console.log(err));
  }

  function new_send_qeustions(id)
  {
    let url = BaseURL + AddQuestion ;
    
    let ele = document.getElementById("spinner_and_loading_title");
    if (ele) ele.style.display = "block";
    
    ele = document.getElementById("send_exam_button");
    
    if (ele) ele.style.display = "none";
    
    for (let i = 0; i < questions_added.length; i++) {
      
      let now = JSON.parse(localStorage.getItem(`question${i}`));
      
      let questionObj = {
        test_content: '1',
        option_A: '1',
        option_B: '1',
        option_C: '1',
        option_D: '',
        option_E: '',
        right_answer: 'A',
        explanation: '',
        package: id,
      };

      let obj = {
        test_content: now.test_content,
        option_A: now.option_A,
        option_B: now.option_B,
        option_C:now.option_C,
        option_D: now.option_D,
        option_E: now.option_E,
        right_answer: now.right_answer,
        explanation: now.explanation,
        package: id,
      };

      sessionStorage.setItem('package_id', id);

      let ele = document.createElement('div');

      ele.innerHTML = now.test_content;
      ele = ele.children;
   
      axios.post(url, questionObj)
      .then((res) => {

        send_images_now(res.data.id,i);

          if (i == question_added_length - 1)
             success_and_reload(id);
      })
        .catch((err) => {
          console.log("question error:", err);
          notification(`حدث خطأ في إرسال السؤال رقم ${i + 1}`, 'toast_error');
        });
    }

  }
  
  async function send_images_now( question_id ,i )
  {
    let current_question = JSON.parse( localStorage.getItem('question'+i) );
    console.log('here is sent question  current_question ', current_question);

    let arr = ['test_content', 'option_A', 'option_B', 'option_C', 'option_D', 'option_E', 'explanation'];

    for (let i = 0; i < arr.length; i++)
    {
      let org = document.createElement('div');
      org.innerHTML  = current_question[arr[i]];
 
      // let org = document.createElement('div');
      // org.innerHTML = current_question[ v ];
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
                send_data.append('field_name' , arr[j]);
                send_data.append('test_id' , question_id);
      
                let url = BaseURL + AddQuestionImage;
      
 
            ele.src = await part2(url, send_data);
            console.log('here is data of imagessssssssss  ', ele.src);
    
         }
             
        }
        
      }

      current_question[ arr[i] ] = org.innerHTML;
      // console.log('here is final result of   org ', org );
      // console.log('**********************************')
    }
   
    // console.log('######################## final sent question is ', current_question);

    let url = BaseURL + EditQuestionById + question_id + '/';

    axios.post(url, current_question)
      .then(res => {
        console.log('question is edited successfully', res.data);

        url = BaseURL + DeleteTempImages + user.user_id + '/';
        

        // delete temp images and increase number of teacher exams
        axios.post(url)
          .then(() => {
            if (i == questions.length - 1)
              success_and_reload();
           } )
          .catch(err => {
            console.log('error in deleting temp images', err);
          });
        
        url = BaseURL + IncreaseNumberOfTeacherExams + user.user_id + '/';
      
      if (i == questions.length - 1)
        axios.post(url)
        .catch(err => {
          console.log('error increase number of teacher exams ', err);
        });


      })
      .catch(err => {
        console.log('here is an error');
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
  // function send_image(question, v, file)
  // {
       
  // }

  // function send_questions(id) {

  //   let url = `${BaseURL}${AddQuestion}`;

  //   let ele = document.getElementById("spinner_and_loading_title");
  //   if (ele) ele.style.display = "block";
    
  //   ele = document.getElementById("send_exam_button");
    
  //   if (ele) ele.style.display = "none";
    
  //   for (let i = 0; i < questions_added.length; i++) {
      
  //     let now = JSON.parse(localStorage.getItem(`question${i}`));
      
  //     let questionObj = {
  //       test_content: now.test_content,
  //       option_A: now.option_A,
  //       option_B: now.option_B,
  //       option_C: now.option_C,
  //       option_D: now.option_D,
  //       option_E: now.option_E,
  //       right_answer: now.right_answer,
  //       explanation: now.explanation,
  //       package: id,
  //     };
  //     sessionStorage.setItem('package_id', id);
  //     axios
  //     .post(url, questionObj)
  //     .then((res) => {
        
  //       set_question_images(res.data.id, 'test_content', questionObj.test_content);
  //       set_question_images(res.data.id, 'option_A', questionObj.option_A);
  //       set_question_images(res.data.id, 'option_B', questionObj.option_B);
  //       set_question_images(res.data.id, 'option_C', questionObj.option_C);
  //       set_question_images(res.data.id, 'option_D', questionObj.option_D);
  //       set_question_images(res.data.id, 'option_E', questionObj.option_E);
  //       set_question_images(res.data.id, 'explanation', questionObj.explanation);

  //         if (i == question_added_length - 1)
  //              success_and_reload(id);
  //     })
        
  //       .catch((err) => {
  //         // console.log("question error:", err);
  //         notification(`حدث خطأ في إرسال السؤال رقم ${i + 1}`, 'toast_error');
  //       });
  //   }

  // }

  // function set_question_images( id , field_name , content ) {
    
  //   let arr = content.split('<p');
  //   let url_array = [];

  //   arr.forEach(e => {
  //     if (e.includes('<img'))
  //     {
  //       let arr = e.split('<img');

  //       for (let i = 0; i < arr.length; i++)
  //         {
  //         let url_str = "";
  //         if (!arr[i].includes('blob')) continue;

  //         let sj = arr[i].indexOf('src') + 5;
  //         for (let j = sj; j < arr[i].length; j++)
  //           {
  //             if (arr[i][j] === '"') break;
  //             url_str += arr[i][j];
  //           }
  //           if( url_str .length > 0 ) url_array.push(url_str);
     
  //       }
  //     }
  //    }
  //   )
  
  // if (url_array.length > 0)
  //   convert_photos( id , field_name, url_array);
    
  // }

  // function convert_photos(id , field_name, urls)
  // {   
  //   let func = async (i) => {
  //     try {
  //       let d = await fetch(urls[i]);
  //       let data = await d.blob();
  //       const file = new File([data], 'image.jpg', { type: 'image/jpeg' });
       
  //       await send_photos(id, field_name, file);
        
  //       if (i < urls.length - 1)
  //         await func(i + 1);
  //     }
  //     catch (e)
  //     {
  //       notification('حدث خطأ في تحليل الصور أثناء إرسالها', 'toast_error');
  //       return;
  //     }
  //   };

  //   func(0); 
  // }
 
  
  // async function send_photos(id,field_name, photo)
  // {
  //   const formData = new FormData();
  
  //   formData.append('images', photo);
  //   formData.append('test_id', id);
  //   formData.append('field_name', field_name);
  //   formData.append('package', sessionStorage.getItem('package_id'));
  //   let url = `${BaseURL}${AddQuestionImage}`;

  //      await axios.post(url, formData)
  //     .catch(err => {
  //       console.log('error in photos tests', err);
  //       notification('حدث خطأ أثناء إرسال صور الأسئلة', 'toast_error');
  //     } );
  // }


  function success_and_reload() {

    close_send_exam_background();

      Swal.fire({
       title: `تم إرسال الاختبار بنجاح `,
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
 

  function imageHandler() {
 
    let ele = document.querySelector(`[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor`);

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
    data.append('publisher', sessionStorage.getItem('user') ? sessionStorage.getItem('user') : 1 );
 
    let ele = document.querySelector(`[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor`);

    let url = BaseURL + UploadTempImage;

    axios.post(url, data)
      .then(res => {
        console.log('here is image uploaded', res);
    
     let d = `<img src="${res.data.image}" style="width:180px"  />`;

      ele.innerHTML += d;

      let all = document.querySelectorAll(`[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor img`);
      
      all.forEach((e, index) => {
        e.setAttribute("class", `img${index}`);
        let el = `[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor .img${index}`;
        e.onclick = () => set_in_size_rechange(el);
      });

      })
      .catch(err => {
      console.log('here is error upload image ', err);
    } )
  }

  function set_in_size_rechange(d)
  {
    
    let prev = sessionStorage.getItem('selected_image');


    if (prev === d)
    {
      document.querySelector(d).style.border = 'none';
      sessionStorage.removeItem(`selected_image`);
      let ele = document.getElementById('AddExam_image_size_body');
      if (ele)
      {
        ele.style.opacity = '0.2';
        ele.style.pointerEvents = 'none';
      }
    }
    else 
    {
      if (prev)
      {
        document.querySelector(prev).style.border = 'none';
      }
      document.querySelector(d).style.border = '2px solid black';
  
      sessionStorage.setItem('selected_image', d);
  
  
      let ele = document.getElementById('AddExam_image_size_body');
      
      if (ele)
      {
        ele.style.opacity = '1';
        ele.style.pointerEvents = 'all';
      }
    }
    
  }
  
  function mark_selected_element_with_border(cls)
  {
    let prev = sessionStorage.getItem('selected_field');
  
    if (prev) {
      
      let dd = document.querySelector(`[class ^="${prev}"]`);
     
      if (dd && prev !== cls) 
      {
        dd = document.querySelector(`[class ^="${prev}"]`);
        dd.style.border = 'none';
        sessionStorage.removeItem('selected_equation');
        sessionStorage.removeItem('selected_image');
      }
    }

    let ele = document.querySelector(`[class ^="${cls}"]`);
    
    sessionStorage.setItem('selected_field', cls);

    if (ele)
      ele.style.border = '3px solid #00ff8b';
  }
  
  function conv()
  {
    let txt = math_equation.current.value;
 
    if ( txt.trim().length <= 0) return;

    // txt = mathml2latex.convert(txt);
    let str = `\\(${txt}\\)`;
   
 
    let span = `<span class="${str} ql-formula" contenteditable="false" > ${str} </span> &nbsp;`;
  
    let d = document.querySelector(`[class ^="${sessionStorage.getItem('selected_field')}"] [class ^="ql-container ql-snow"]`);
    if (!d)
    {
      sessionStorage.removeItem('selected_field');
      notification(`يجب عليك إختيار أحد الحقول لإضافة المعادلة إليه`, 'toast_error')
      return;
     }
   
    let quill = Quill.find(d);
   
    quill.root.innerHTML += span;
 
    document.querySelectorAll(`[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor .ql-formula`).forEach((e, index) => {
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
      e.onclick = () => { set_equation_in_sessionStorage('equation_' + index.toString())  }
    })
    
    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typesetClear()
      window.MathJax.typeset()
    }
    
    setTimeout(() => {
      d.focus();
    }, 100);
   
  }
  function validate_className()
  {
    document.querySelectorAll(`[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor span.ql-formula`).forEach((e, index) => {
      let arr = e.classList;
      let cls = "";
      arr.forEach((clls) => {
        if ( clls.includes('equation_') || clls.includes('ql-formula') ) return;
        cls += clls;
        cls += ' ';
      })
  
      cls += ' ql-formula equation_' + index.toString();
      e.setAttribute('class', cls);
      e.style.cursor = 'pointer';
      e.onclick = () => { set_equation_in_sessionStorage('equation_' + index.toString() ) }
    });
  
    let all = document.querySelectorAll(`[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor img`);
        
    all.forEach((e, index) => {
      e.setAttribute("class", `img${index}`);

      let el = `[class ^="${sessionStorage.getItem('selected_field')}"] .ql-editor .img${index}`;
      e.onclick = () => set_in_size_rechange(el);
    });
  
  } 
  
  function set_equation_in_sessionStorage(selector)
  {
    let ele = document.querySelector(`[class ^="${sessionStorage.getItem('selected_field')}"] .${selector}`);
    
    if (!ele) return;
     
    ele.style.border = '1px solid black';
    
    ele = document.querySelector(`[class ^="${sessionStorage.getItem('selected_field')}"] .${sessionStorage.getItem('selected_equation')}`);
    
    if (ele)
    {
      if (sessionStorage.getItem('selected_equation') == selector) 
      {
        ele.style.border = 'none';
        sessionStorage.removeItem('selected_equation');
    
        document.getElementById('AddExam_equation_related_styles').style.opacity='0.3';
        document.getElementById('AddExam_equation_related_styles').style.pointerEvents='none';
      }
      else {
        
        ele.style.border = 'none';
        sessionStorage.setItem('selected_equation' , selector);
       document.getElementById('AddExam_equation_related_styles').style.opacity='1';
       document.getElementById('AddExam_equation_related_styles').style.pointerEvents='all';
      }
      
    }  
    else 
    {
      sessionStorage.setItem('selected_equation' , selector);
      document.getElementById('AddExam_equation_related_styles').style.opacity='1';
      document.getElementById('AddExam_equation_related_styles').style.pointerEvents='all';
    }
  
  }
  
  function copy_cut_Handler(e)
  {
    e.preventDefault();

    let sec = window.getSelection();
    let final = "";
    
      for (let i = 0; i < sec.rangeCount; i++)
      {
        let now = sec.getRangeAt(i);
        let ele = now.cloneContents().childNodes;
        // console.log(' i ', i, 'now is ', now, 'ele is ', ele , 'ele.textContent;' ,ele.textContent);
      
        if (ele.nodeName == "#text")
          final += ele.textContent;
          
        else {

          ele.forEach(e => {

            let ele2 = e.childNodes;
            console.log('ele2 is ', ele2 , 'e is ' , e);
            final += '<p>';
            ele2.forEach(e2 => {
              if (e2.nodeName == "#text")
                final += e2.textContent;
              else if (e2.nodeName != "IMG")
                final += e2.outerHTML;
            });
            final += '</p>';
          });
        }
        // console.log('------------------------------');
        // console.log('final is ', final);
        e.clipboardData.setData('text/html', final);
  
      }
   
  }
  
}
