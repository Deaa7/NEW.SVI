
import { useParams } from 'react-router-dom';
import './ReadNoteComponent.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {reference} from '../../data/SubjectNameReference.js'
import { BaseURL, GetNoteWithContent } from '../../API/APIs.js';
import katex from 'katex';
export default function ReadNoteComponent()
{
    const { id } = useParams();

    window.katex = katex;
    
    if (typeof window?.MathJax !== "undefined") {
        window.MathJax.typesetClear()
        window.MathJax.typeset()
    }
    
    useEffect(() => {        
        let url = BaseURL + GetNoteWithContent + id + `/`;
        let should_continue = true;

        axios.get(url)
            .then(res => {
				console.log('note is ', res.data);
                let ele = res.data;
                let header =`
				<div>  اسم المادة :  ${reference[ele.subject_name]}  </div>
				<div> اسم الناشر : ${ele.publisher_name} </div>
				<div> اسم المحتوى : ${ele.title} </div>
				<div>  معهد SVI </div>`;

                // get_images(ele.content, header, ele.id)  
                // console.log('here is the content ', ele.content);
                document.querySelector('#read_note_root .read_note_body').innerHTML = ele.content;

                if (typeof window?.MathJax !== "undefined") {
                    window.MathJax.typesetClear()
                    window.MathJax.typeset()
                }
                document.querySelector('#read_note_root #read_note_title').innerHTML = header;
                 ele = document.getElementById('read_note_background');
                if (ele && should_continue) ele.style.display = 'none';
                // document.querySelectorAll('#read_note_root .read_note_body img').forEach((e, index) => {
                    // e.src = BaseURL + res.data[index].images;
                    // e.style.borderRadius = '3px';
                // });
            })
            .catch(err => {
                console.log('err', err);
                should_continue = false;
                let ele = document.getElementById('read_note_background_body');
                if (ele)
                    ele.innerHTML = `<h1 style="color:red; font-size:100%;"> حدث خطأ أثناء جلب معلومات الملف , حاول أن تعيد تحميل الصفحة </h1>`;
        
            })
        
        // function get_images(content, header , note_id = 0)
        // {
        //     url = BaseURL+GetNoteImages+note_id.toString()+`/`;
            
        //     axios.get(url)
        //         .then(res => {
        //             // console.log('note image is ', res.data);
        //         //     document.querySelector('#read_note_root .read_note_body').innerHTML = content;
        //         // document.querySelector('#read_note_root #read_note_title').innerHTML = header;
               
        //         if (typeof window?.MathJax !== "undefined") {
        //             window.MathJax.typesetClear()
        //             window.MathJax.typeset()
        //           }
        //             document.querySelectorAll('#read_note_root .read_note_body img').forEach((e, index) => {
        //                 e.src = BaseURL + res.data[index].images;
        //                 e.style.borderRadius = '3px';
        //             });
               
        //            let ele = document.getElementById('read_note_background');
        //             if (ele && should_continue) ele.style.display = 'none';
        //         })
        //             .catch(err => {
        //                 console.log('err', err);
        //                 let ele = document.getElementById('read_note_background_body');
        //                 if (ele)
        //                     ele.innerHTML = `<h1 style="color:red; font-size:100%;"> حدث خطأ أثناء جلب معلومات الملف , حاول أن تعيد تحميل الصفحة </h1>`;
        //         } )
        // }
    }, []);
    return <>
        <div id="read_note_upper_part" >
        ملاحظة : في حال عدم تحميل الصور في هذا الملف , قم بإعادة تحميل الصفحة*
        </div>
        <div id="here_is_try"></div>
		 
        <div id="read_note_root">
         
            <div id="read_note_title"> </div>
            
		 <div className="ql-editor read_note_body"></div>
            
            <div id="read_note_background">
                <div id="read_note_background_body">
                    <div id="spinner"></div>
                  <div> ...    جاري جلب بيانات الملف </div>
            
                </div>
            </div>

         </div>
    </>
}