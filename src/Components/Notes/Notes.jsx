
import { useEffect  , useRef, useState} from 'react';
import './Notes.css';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BaseURL, GetNotesWithFilter } from '../../API/APIs';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';
import { notification } from '../../utils/notification';

export default function Notes({ publisher_name , price , reverse_order , view_all ,sort_by})
{ 

    let { subject_name, Class , count } = useParams();

    // const [[notes , number_of_notes], set_notes] = useState([[] , 0 ]);
    let nav = useNavigate();
    
    let obj = {
        publisher_name: publisher_name ==='عرض الكل'  ? null : publisher_name,
        price: price === 'عرض الكل' ? null : price,
        subject_name: subject_name, 
        Class: Class,
        count: parseInt(count) + 1,
        limit: 9,
        reverse_order: reverse_order,
        sort_by:sort_by,

    }
    let url = BaseURL + GetNotesWithFilter + subject_name + `/`;
    
    let NOTES = useQuery({
        queryKey: ['notes', count, publisher_name, price, reverse_order, sort_by],
        queryFn: () => axios.get(url, { params: obj }),
        staleTime: 2 * 60 * 1000,
    });
    
    let firstTime = useRef(true);

    let notes_content = [];
    let notes = [] , number_of_notes = 0;
    
    if (NOTES.isLoading)
    {
        notes_content = <div className='notes_process_section'>
            <div id="spinner"></div>&nbsp;
            ...   جاري التحميل 
        </div>;
        console.log('yes we are loading');
    }
    else if (NOTES.isError)
    {
        notes = [];
        notification('error in fetching notes', 'toast_error');
        number_of_notes = 0; 
    }
    else 
    {
        notes = NOTES.data.data.notes;
        number_of_notes = NOTES.data.data.number_of_notes; 
        notes_content = (
           notes.map((e, index) => {
           return <>
               <div className="note_card_background">
               <Link to={`/SingleNoteView/${subject_name}/${Class}/${e.id}`} className={`note_card` + index} >
                 <div className="note_body_first_part">  
             <div className='note_publisher_name' >  الكاتب :<span> {e.publisher_name}  </span>   </div>
             {/* <div className='note_special_id' > الرمز الخاص : <span>{e.id} </span>  </div> */}
              </div>
              
             <div className='note_title' > الاسم :  <span>{e.title} </span>   </div>
             
             <div className="note_body_last_part">  
             <div className='note_upload_date'  > تاريخ النشر: <span> {e.date_uploaded.toString().substring(0,10)}  </span>    </div>
             <div className='note_number_of_reads' >  عدد مرات القراءة :<span>  {e.number_of_reads}</span>  </div>    
                  
            {e.price > 0 ? 
               
              <div className='note_is_premium' > التكلفة : {e.price} ل.س </div>
              :
              <div className='note_is_free' > مجاني</div>
           }
           </div>
            </Link>
            </div>
           </>
           
        })
    );
    if (number_of_notes <= 0)
        {
            notes_content = (<div className='no_result_found'> لا يوجد نتائج <i className='fa-regular fa-face-sad-tear'></i> </div>);
            
        }

    }



    useEffect(() => {
        
        if (firstTime.current) firstTime.current = false;
        
        else 
        NOTES.refetch();
        
    
        // axios.get(url, { params: obj })
        //     .then((res) => {
        //         // console.log('res is', res.data);
        //         set_notes([res.data.notes, res.data.number_of_notes]);
        //     })
        //     .catch(err => {
        //         // console.log('error ', err);
        //         console.log('here is error in getting the notes filtered ', err);
        //     });
        
    } ,[publisher_name , price , count , sort_by  , reverse_order ] )
    
    

    let num = Math.floor(number_of_notes / 9);
    if (number_of_notes % 9) num++;
    
    return <>
     
         <div id="notes_section_upper_part"></div>
        <div id="notes_section_root">
            {notes_content}
            
            {number_of_notes > 0 &&
                <ReactPaginate
                    breakAriaLabels="..."
                    nextLabel={<i className='fa-solid fa-angles-right'></i>}
                    previousLabel={<i className='fa-solid fa-angles-left'></i>}
                    previousClassName='paginate-control-button previous'
                    nextClassName='paginate-control-button next'
                    pageRangeDisplayed={2}
                    pageCount={num}
                    onPageChange={note_change_page}
                    containerClassName='paginate-root'
                pageClassName='single-page-element'
                initialPage={ parseInt(count) }
                />
            }                

        </div>
      
    </>
    function note_change_page(e)
    {
        let url = `/TextContentSection/${subject_name}/${Class}/${e.selected}`;
        nav(url);
        window.scrollTo({top:'0px'})
    }
}