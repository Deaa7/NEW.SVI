
import { useEffect, useState } from 'react';
import './SubjectMaterial.css';
import TestSectionContent from '../../pages/TestSectionContent/TestSectionContent';
import TextContentSection from '../../pages/TextContentSection/TextContentSection';
import {   useNavigate, useParams  } from 'react-router-dom';
import { reference } from '../../data/SubjectNameReference';
export default function SubjectMaterial()
{
 
    
    let { subject_name, Class } = useParams();
    let nav = useNavigate();
   
    if (subject_name === null || Class === null || (Class.toString() != '12' && Class.toString() != '9'))   
    { 
        window.history.back();
    }
            
 
    return <>
        
        <div id='subject_materials_root'>
    
            <p id='select_content_paragraph'>  اختر المحتوى لمادة
                {reference[subject_name+'_'+ Class] +' '}  
                :</p>
    
            <div id="subject_materials_upper_part">
                
                <div id="subject_test_materials" onClick={ ()=>change_content_state('test') }>
        
                 </div>

                <div id="subject_text_materials" onClick={ ()=>change_content_state('textContent') }>  
   
                </div>
                
        </div>
               

        {/* TestSectionContent */}
         
        </div>

    {/* {  (content  === 'test' && <TestSectionContent />  ) } */}
    {/* {  (content  === 'textContent' && <TextContentSection/>  ) } */}


        
    </>

 
    function change_content_state(new_state) {
       
        window.scrollTo({
            top: 0,
            behavior:'smooth'
        })
        if(  new_state === 'test')
            nav('/TestSectionContent/' + subject_name + '/' + Class +'/0' );
        else 
        nav('/TextContentSection/' + subject_name + '/' + Class +'/0' );
 
    }

}