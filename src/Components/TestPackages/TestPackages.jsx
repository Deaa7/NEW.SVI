
import { useContext, useRef, useState } from 'react';
import './TestPackages.css';
import { useEffect } from 'react';
import { Link , useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BaseURL, GetStudentSolvedExams, GetTestPackages } from '../../API/APIs';
import { User } from '../../Context/Context';
import { notification } from '../../utils/notification';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';

export default function TestPackages({ price, number_of_tests, units, publisher_name, sort_by, reverse_order  }) {
    
    let { subject_name, Class, count } = useParams();
    
    const [user, _] = useContext(User); 
    
    let nav = useNavigate();
	
    let sub_name = subject_name;
    
    let current_conditions = {
        price: price,
        publisher_name: publisher_name,
        Class: Class,
        number_of_questions: number_of_tests,
        sort_by: sort_by,
        reverse_order: reverse_order,
        count: parseInt(count) + 1,
        limit: 9,
    }

    let render = useRef(false);
    let firstRendering = useRef( user.user_id > 0 );

     
    sessionStorage.clear();
    localStorage.clear(); 

    let url = BaseURL + GetStudentSolvedExams + subject_name + '/';

    let user_solved_exams = useQuery({
        queryKey: ['solved_exams'],
        queryFn: ()=> axios.get(url, { params: { user_id: user.user_id } }) ,
        enabled: firstRendering.current && user?.user_id > 0 ,
        
    });

    if (firstRendering.current) firstRendering.current = false;

    let exams_solved = [];
    if (user_solved_exams.isError)
    {
        notification('حدث خطأ , الرجاء إعادة تحميل الصفحة', 'toast_error');
        console.log(' student solved exams error  ', JSON.stringify(user_solved_exams.error.message));
    }
    if (user_solved_exams.isSuccess)
    {
        exams_solved = user_solved_exams.data.data;  
    }

    let  url2 = BaseURL + GetTestPackages + sub_name + `/`;
  
    let exam = useQuery({
            queryKey: ['test_packages' , count , price , number_of_tests , units ,publisher_name , sort_by , reverse_order ],
         keepPreviousData: true ,    
        queryFn: () => {
                return axios.get(url2, { params: current_conditions })
        },
            refetchOnWindowFocus: false,    
        staleTime: 1000 * 5 * 60, 
            placeholderData : [{id : 1 , name :'here is a placeholder data'}],
        });
 
    let  package_content = [];
    let number_of_exams = 0;


    if (exam.isLoading) {
        render.current = true;
    }
    else if (exam.isError) {
        notification('حدث خطأ أثناء جلب بيانات الاختبارات', 'toast_error');
        console.log('here is an error');
    }
    else
    {
        console.log('here is the final result ', exam?.data?.data);
        render.current = false;
        package_content = exam?.data?.data?.exams;
        number_of_exams = exam?.data?.data?.number_of_exams;
    }

    let LoadingContent =
    <div id='test_packages_process_container'>
    <div id="test_packages_process_title">
        جاري جلب البيانات...
    </div>
    <div id="spinner"></div>
        </div>
        ;
    
    let content = [];
        
    // filters second
 
    let s = new Set(); // set has ids of solved packages
            
    exams_solved.forEach(e => {
        s.add(e.exam_id);
    })
            
    
        package_content?.forEach((e, index) => {
                
            let unit_belong = false;
            let num_of_tests = false;
                
            if (index <= 0) content = [];
                
            if (render.current) render.current = false;
                
            if (e.units.includes(units))
                unit_belong = true;
                
            if (e.number_of_questions < number_of_tests)
                num_of_tests = true;
                
            let is_solved = {};
            if (s.has(e.id.toString())) {
                is_solved = {
                    backgroundColor: 'rgb(4 142 0 / 14%)',
                }
            }
        
            if (num_of_tests && (units == 'عرض الكل' || unit_belong)) {
            
                let free_or_not = (
                    (e.price > 0 ? <div className='premium_package' >  التكلفة : {e.price} ل.س   </div> : <div className='free_package'>مجاني</div>))
                content.push(
                    <div className={`package_body_background`}>
                        <Link to={`/SingleExamView/${subject_name}/${Class}/${e.id}`} className={`package_body${e.id}`} style={is_solved} >
           
                            <div className="container_name_and_id">
               
                                <div className='publisher_name'>
                                    الكاتب : {e.publisher_name}
                                </div>
                                <div className="package_name"> اسم الاختبار : {e.package_name} </div>
                            </div>
   
                            <div className='package_units'>
                                موضوع الاختبار : {
                   
                                    e.units.split(',').sort((ele, ele2) => ele.length - ele2.length).map((e) => {
                                        return <div className='single_unit'>{e}</div>
                                    })
                                }
                            </div>
                            <div className="package_date_added" > تاريخ النشر : {e.date_added}  </div>

                            <div className="container_num_test_and_app_and_price">
                                <div className="package_tests_number">  عدد الاسئلة   : {e.number_of_questions} </div>
                                {/* <div className="package_id"> رمز الاختبار : {e.id} </div> */}
                                <div className="num_of_app"> عدد مرات التقديم : {e.number_of_apps}</div>
   
                            </div>
                            <div className="container_price_and_publisher">

                                {free_or_not}
                            </div>
                        </Link>
                    </div>
                )
            }
        }
        )

    if (package_content?.length <= 0 && render.current)
        content = <div className='no_result_found'> لا يوجد نتائج <i className='fa-regular fa-face-sad-tear'></i> </div>;
            
   
 
    let num_of_pages = Math.floor(number_of_exams  / 9);

    if (number_of_exams  % 9) num_of_pages++;

    return <>
 
        <div id="test_package_root">
            {
                !render.current ?
                    content
                    :
                    LoadingContent 
            }
            
            {number_of_exams > 0 &&
                <ReactPaginate
                    breakAriaLabels="..."
                    nextLabel={<i className='fa-solid fa-angles-right'></i>}
                    previousLabel={<i className='fa-solid fa-angles-left'></i>}
                    previousClassName='paginate-control-button previous'
                    nextClassName='paginate-control-button next'
                    pageRangeDisplayed={2}
                    pageCount={num_of_pages}
                    onPageChange={ (e)=>previous_next_page_handler(e) }
                    containerClassName='paginate-root'
                pageClassName='single-page-element'
                initialPage={ parseInt(count)  }
                />
            }
         
        </div>
    </>

    function previous_next_page_handler(e)
    {
        nav(`/TestSectionContent/${subject_name}/${Class}/${e.selected}`);
        window.scrollTo({
            top: '0px',
        })
    }


 
}