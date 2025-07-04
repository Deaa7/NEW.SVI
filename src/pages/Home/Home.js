 
import { useEffect, useState ,useRef, useContext} from "react";
import "./Home.css";

import {SubjectSection} from "../../Components/SubjectSection/SubjectSection";
import TeacherPreview from "../../Components/TeacherPreview/TeacherPreview";
import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { BaseURL, CountAll } from "../../API/APIs";
import { useQuery } from "@tanstack/react-query";


export default function Home() {
   
  
  let last_scroll = 0;
  
  // handling head appearing and disappearing when scrolling
  window.addEventListener('scroll', (e) => {
 
    let y = window.scrollY; 
    if (y > last_scroll) {
      document.querySelector('#header_root').style.animationName = 'hide_header';
    }
    else {
      document.querySelector('#header_root').style.display = 'flex';
      document.querySelector('#header_root').style.animationName = 'show_header';
    }

      last_scroll = y;
    
    let curr = document.getElementById('up_button');
    
    if (y >= 1000) {
      if (curr !== null) curr.style.display = 'initial';
    }
    else if( curr !== null )
      curr.style.display = 'none';
    
  });

  //////////////////////////////

  
    const [current_class_content, set_current_class_content] = useState('12');
    // const [counting, set_counting] = useState({});
 
  
  
 
  useEffect(() => {

    let d = document.getElementById(`home_root`);
 
       let all = document.querySelectorAll('.home_colored_text');
    
       let h = document.getElementById('home_title_site_and_home_photos_container');
        d.addEventListener("mousemove", (event) => {
          let x = event.pageX;
          let y = event.pageY;
          let val = 30;
          let val2 = 30;
          if (x < Math.floor(window.outerWidth / 2)   ) {
            val2 *= -1;
          }
    
          if (350 < y ) {
            val *= -1;
          }

          all.forEach(e => {
            e.style.transition = '100ms';
            // e.style.transform = `perspective(800px)  rotateX(${val}deg) rotateY(${val2}deg)`;
            return;
 
          });

         });
      
  } );
  useEffect(() => {

    if (typeof window?.MathJax !== "undefined") {
      window.MathJax.typesetClear()
      window.MathJax.typeset()
    }

    let eles = document.querySelectorAll('[id ^="home_photo_"]');
    
    let time = 300;
    eles.forEach((e , index) => {
      e.style.animationName = 'show_home_images';
      e.style.animationDuration = time + 'ms';
        time += 200;
    } )
 
   }, []);
  
  return (
    <>
 
      <div id="home_root"  >

        <div id="home_title_site_and_home_photos_container">
          
            <div id="home_title_site" onAnimationEnd={(e) => {  e.target.style.opacity = '1'; } }>
        
        المعهد الافتراضي السوري    
        
   
        <div  style={{
          fontSize:'60%',
        }} >  ( الإصدار التجريبي ) </div>  

          <div id="content">
             المعهد الافتراضي السوري هو معهد متخصص لتدريس مواد الشهادتين ( التاسع و البكلوريا العلمي ) , توفير كبير و راحة
            </div>
            
          </div> 

 
    </div>
   
        <button id="up_button" onClick={up_func}> العودة إلى البداية </button>
        
        <div id="home_teacher_preview">
          <h1 id="home_teacher_preview_title">     
            لائحة المعلمين المتعاقدين مع معهد  SVI :</h1>    
            
        <TeacherPreview/>
        </div>
 
        <h1 id="subject_section_title">
          ابدأ رحلتك التعليمية من هنا و اختر إحدى المواد
   
            </h1>
        <div id="subject_list">
        
          <div id="_12th" onClick={() => change_subject_content("_12th")}> مواد بكلوريا </div>
          <div id="_9th"  onClick={ () =>change_subject_content("_9th")}> مواد تاسع</div>
        
        </div>
        <SubjectSection Class={current_class_content} />
        
      </div>
     
    </>
  );

  // function show_title()
  // {
  //   document.getElementById('title').style.display = 'block';
  //   // document.getElementById('title2').style.display = 'block';
  // }
  // function hide_title()
  // {
  //   document.getElementById('title').style.display = 'none';
  //   // document.getElementById('title2').style.display = 'none';
  // }
  // function show_title2()
  // {
  //   // document.getElementById('title').style.display = 'block';
  //   document.getElementById('title2').style.display = 'block';
  // }
  // function hide_title2()
  // {
  //   document.getElementById('title2').style.display = 'none';
  // }

 
  function change_subject_content(id) {
 
    let Class = '12';
    
    if (id === '_9th') Class = '9';

    if (current_class_content !== Class)
      set_current_class_content(Class);

    let def = '_9th';
    if (id === def) def = '_12th';
  
    document.getElementById(id).style.borderBottom = '2px solid rgb(255, 234, 0)';
    document.getElementById(def).style.borderBottom = 'none';
  }
  
  function up_func() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
  }

  function init()
  {
 
 
 
   
  
  }
  
 
}




