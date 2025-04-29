
import { useState } from 'react';
import './TextContentSection.css';
import Notes from '../../Components/Notes/Notes';
import { reference } from '../../data/SubjectNameReference.js'
import { useParams } from 'react-router-dom';
 export default function TextContentSection()
{
     let { subject_name, Class } = useParams();
    const [
        {
            publisher_name,
            price,
            reverse_order,
            sort_by
        }, set_filter_state] = useState({
            
            publisher_name: "عرض الكل",
            price: 1000000,
            reverse_order: false,
            view_all: 0,
            sort_by:'none'
        })
    
    let previous_state = {
        publisher_name: publisher_name,
        price: price,
        reverse_order: reverse_order,
        sort_by:sort_by
    }
 
    let filter_bar_price = [5000 , 10000 , 15000 , 20000 , 25000];

    let filter_price_content = filter_bar_price.map(pr => {
        return <div className='price_filter_option' onClick={ (e) =>text_editor_change_price(pr , e.target) } >أقل من : {pr}</div>
    })
 
    
    
     return <>
        <div id="text_content_upper_part"></div>
    <div id="text_content_section_root">
    
                
        <p id="text_content_title">
                المحتوى الكتابي لمادة {reference[subject_name +"_" + Class]} :
        </p>
 
             <button id="text_content_filter_button" onClick={text_content_show_hide_filter}  > إظهار الفلترة

                 <i className='fa-solid fa-filter'></i> 
             </button>

     <div id="text_content_filter_root">
                
       <div id="text_editor_first_part">
                </div>
                <div id="filter_price_bar">
                    <span >   السعر :</span>
                    <div className='price_filter_option' onClick={ (e) =>text_editor_change_price(100000 , e.target) }>عرض الكل   <i className='fa-solid fa-check'></i></div>
                    <div className='price_filter_option'  onClick={ (e) =>text_editor_change_price(0 , e.target) }> مجاني </div>
                    {filter_price_content}

                </div>
        
     </div>
  
        <Notes publisher_name ={publisher_name}  price ={price} reverse_order ={reverse_order}  sort_by={sort_by} />
    
        </div>
    </>

    function text_content_show_hide_filter()
    {
        let ele = document.getElementById('text_content_filter_root');
         
        if (ele.style.display == 'none' || ele.style.display.length <= 0) 
        {
            ele.style.display = 'block';
            ele.style.animationName = 'show_filter_bar';
            document.getElementById('text_content_filter_button').innerHTML = 'إخفاء الفلترة';
        }
        else
        {
            ele.style.animationName = 'hide_filter_bar';
            setTimeout(() => {
                ele.style.display = 'none';
           }, 500); 
 
       
            document.getElementById('text_content_filter_button').innerHTML = `إظهار الفلترة <i class='fa-solid fa-filter'></i>`;
            
        }
      
    
    }

    function text_editor_change_price(prc, element)
    {
      
        document.querySelectorAll(`#text_content_filter_root .price_filter_option`).forEach((e) => {
            let tem = e.innerHTML.split('<i');
            e.innerHTML = tem[0];
        })
        element.innerHTML += `<i class='fa-solid fa-check'></i>`;

        set_filter_state({ ...previous_state, price: prc });
     }
     
     function change_sort_by(sort_field, cls)
     {
         
         document.querySelectorAll(`#filter_sort_bar [class ^="filter_sort"]`).forEach((e) => {
             let temp = e.innerHTML.split('<i');
             e.innerHTML = temp[0];
         })
         document.querySelector(`.${cls}`).innerHTML += `<i class='fa-solid fa-check'></i>`;
         set_filter_state({ ...previous_state, sort_by: sort_field });
     }   

}