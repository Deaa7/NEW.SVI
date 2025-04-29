import './TestSectionContent.css';

import TestPackages from '../../Components/TestPackages/TestPackages'
import { useEffect, useRef, useState } from 'react';
import { science_12_units } from '../../data/SubjectUnitsArrays';
import {reference} from '../../data/SubjectNameReference'
import { useParams } from 'react-router-dom';

import { BaseURL , CountNumberOfExams } from '../../API/APIs';
import axios from 'axios';
export default function TestSectionContent() {

    let { subject_name, Class , count } = useParams();

  

    let subject_icon = () => {

        switch (subject_name) {
            case 'chemistry':
                return <i className='fa-solid fa-flask'></i>
            case 'math':
                return <i className='fa-solid fa-calculator'></i>
            case 'science':
                return <i className='fa-solid fa-brain'></i>
            case 'physics':
                return <i className='fa-solid fa-magnet'></i>
            case 'islam':
                return <i className='fa-regular fa-moon'></i>
        }
    }

    const [{ price, number_of_tests , units , publisher_name ,sort_by ,reverse_order,view_all}, set_filter_state] = useState(
        {
            price: 1000000,
            number_of_tests: 1000,
            units: 'عرض الكل',
            publisher_name:'عرض الكل',
            sort_by: 'none',
            reverse_order: false,
            view_all: false,
        }
    );

    let previous_filter_state = {
        price: price,
        number_of_tests: number_of_tests,
        units: units,
        publisher_name:publisher_name,
        sort_by: sort_by,
        reverse_order: reverse_order,
        view_all: view_all,        
    }
 
    let filter_bar_price = [5000 , 10000 , 15000 , 20000 , 25000];

    let filter_bar_num_of_tests = [20, 40, 60, 80,100];
    
    let filter_price_content = filter_bar_price.map(pr => {
        return <div className='price_filter_option' onClick={(e) => change_price_state(pr,e.target ) }>أقل من : {pr}</div>
    })

    let filter_num_of_test_content = filter_bar_num_of_tests.map(num => {
        return <div className='test_num_filter_option' onClick={(e) => change_test_num_state(num,e.target ) }>أقل من : {num}</div>
    })
    
    let sort_bar_values = ['sort_none', 'sort_price', 'sort_num_of_tests', 'sort_num_of_app'];

    let select_options = science_12_units.map(e => {
        return <option value={e}>{e}</option>
  } )

  
    return <>
       <div id="test_section_upper_part"></div>
        <div id="test_section_content_root">
           
                <p id="select_test_word"> اختر احد الاختبارات في مادة {reference[subject_name + "_" + Class]} {subject_icon()}  :</p>
            
                <button id="filter_button" onClick={show_hide_filter_section}> إظهار الفلترة  <i className='fa-solid fa-filter'></i> </button>
               
            <div id="filter_body_root" >
                  
                <div id="filter_body_upper_part">
                    <div>
                        اسم كاتب الاختبار
                    </div>

                    <div>
                    اختر موضوعاً للأختبار <select name="publisher_name"  id="topic_names_select" onChange={ (e)=>
                            set_filter_state( { ...previous_filter_state , units:e.target.value } )
                            
                        }>{select_options}</select>
                
                    </div> 
                </div>
               
                <div id="filter_price_bar">
                      السعر :
                    <div className='price_filter_option'  onClick={(e) => change_price_state(1000000 ,e.target ) } >عرض الكل   <i className='fa-solid fa-check'></i></div>
                    <div className='price_filter_option'  onClick={(e) => change_price_state(0,e.target )} > مجاني </div>
                    {filter_price_content}

                </div>
                
                <div id="filter_num_test_bar">
                      عدد الأسئلة :
                    <div className="test_num_filter_option" onClick={(e) => change_test_num_state(1000000, e.target)} >عرض الكل   <i className='fa-solid fa-check'></i></div>
                    
                    {filter_num_of_test_content}

                </div>

            </div>

            <TestPackages price={price} number_of_tests={number_of_tests} sort_by={sort_by} publisher_name={publisher_name} units={units}
                view_all={view_all} reverse_order={ reverse_order }  />
        
        </div>
 
    </>

    function show_hide_filter_section()
     {
        let curr = document.getElementById('filter_body_root');
 
        if (curr.style.display == 'none' || curr.style.display.length <= 0) {
            
            curr.style.animationName = 'show_filter_bar';
 
            document.getElementById('filter_button').textContent = `إخفاء الفلترة`;
 
            curr.style.display = 'block';
         
        }
        else {
            curr.style.animationName = 'hide_filter_bar';
            setTimeout(() => {
                curr.style.display = 'none';
           }, 500); 
            document.getElementById('filter_button').innerHTML = `إظهار الفلترة <i class='fa-solid fa-filter'></i>`;
        }
    }

    function change_price_state(current_price , ele) {
 
        if (current_price === price) return;

        // first let's clear the check mark from all prices:
        document.querySelectorAll('.price_filter_option').forEach((e) => {
            
            let d = e.innerHTML.split('<i');
             e.innerHTML = d[0];
        });
             
        let temp = ele.innerHTML;
        ele.innerHTML = temp + `  <i class='fa-solid fa-check'></i>`;

         set_filter_state({ ...previous_filter_state, price: current_price });
    }

    function change_test_num_state( current_num , ele ) {
 
        if (number_of_tests === current_num) return;


        document.querySelectorAll('.test_num_filter_option').forEach((e) => {
            
            let d = e.innerHTML.split('<i');
             e.innerHTML = d[0];
        });
             
        let temp = ele.innerHTML;
        ele.innerHTML = temp + `  <i class='fa-solid fa-check'></i>`;
 
            set_filter_state({ ...previous_filter_state, number_of_tests: current_num });
          
    }

    function change_sort_state(sort_field, ele)
    {
        if (sort_field === sort_by) return;
        
        sort_bar_values.forEach((e) => {
           
            let temp = document.getElementById(e).innerHTML.split('<i');    
             document.getElementById(e).innerHTML = temp[0];    
        })
        let temp = ele.innerHTML;
        ele.innerHTML = temp + ` <i class='fa-solid fa-check'></i>`;
        set_filter_state({ ...previous_filter_state,  sort_by:sort_field });
    }

    function reverse_current_order()
    {
        set_filter_state({ ...previous_filter_state, reverse_order: !reverse_order });   
    }
}