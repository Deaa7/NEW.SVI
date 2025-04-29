import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './SubjectSection.css'

export function SubjectSection({ Class }) {
    
    return <>
        <div id="subject_section_root">
                {Class ==='12' && <Class_12th />}      
                {Class ==='9' && <Class_9th />}      
            </div>
        </>
 
    
   
 

function Class_12th()
{
    let content = (
        <>
            <Link to={`./SubjectMaterial/math/`+ Class}   onClick={ ()=> update_subject('math') } className="math_12th" title ="رياضيات بكلوريا"  ></Link>
            <Link to={`./SubjectMaterial/science/`+Class}   onClick={ ()=> update_subject('science') } className="science_12th" title ="علوم بكلوريا">   </Link>
            <Link to={`./SubjectMaterial/arabic/`+Class}   onClick={ ()=> update_subject('arabic') } className="arabic_12th" title ="عربي بكلوريا">  </Link>
            <Link to={`./SubjectMaterial/physics/`+Class}   onClick={ ()=> update_subject( 'physics') } className="physics_12th" title ="فيزياء بكلوريا">  </Link>
            <Link to={`./SubjectMaterial/chemistry/`+Class}   onClick={ ()=> update_subject('chemistry') } className="chemistry_12th" title ="كيمياء بكلوريا">  </Link>
            <Link to={`./SubjectMaterial/english/`+Class}   onClick={ ()=> update_subject('english') } className="english_12th" title ="انكليزي">  </Link>
            <Link to={`./SubjectMaterial/islam/`+Class}   onClick={ ()=> update_subject('islam') } className="islam_12th" title ="ديانة إسلامية">    </Link>
        </>
    );

    return <>
        
            {content}
        
    </>
}

function Class_9th()
{
    let content = (
        <>
 
            <Link to={'./SubjectMaterial/math/'+Class} onClick={ ()=> update_subject('math') } className="subject_card_9th"> رياضيات </Link>
            <Link to={'./SubjectMaterial/science/'+Class} onClick={ ()=> update_subject('science') } className="subject_card_9th"> علوم</Link>
            <Link to={'./SubjectMaterial'+Class} onClick={ ()=> update_subject('physics_chemistry') } className="subject_card_9th"> الفيزياء و الكيمياء</Link>
            <Link to={'./SubjectMaterial'+Class} onClick={ ()=> update_subject('arabic') }  className="subject_card_9th"> اللغة العربية</Link>
            <Link to={'./SubjectMaterial'+Class} onClick={ ()=> update_subject('english') }  className="subject_card_9th"> اللغة الانكليزية </Link>
            <Link to={'./SubjectMaterial'+Class} onClick={ ()=> update_subject('geography') } className="subject_card_9th"> الاجتماعيات</Link>
            <Link to={'./SubjectMaterial'+Class} onClick={ ()=> update_subject('islam') }  className="subject_card_9th"> التربية الدينية</Link>
        </>
    );
    return <>
         
            {content}
       
    </>
    }
    
function update_subject(subject)
{
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });  
        
     
}

}


