
 
import { useQuery, useMutation ,useQueryClient } from '@tanstack/react-query';
import { notification } from '../../utils/notification';
import './AboutUs.css'; 
import { useEffect , useRef} from 'react';
import { AddNote, BaseURL , CreateExam  ,Register} from '../../API/APIs';
import axios from 'axios';
 
 
export default function AboutUs() {

  let name = useRef('');
  let units = useRef('');
  let id = useRef(1);

  let queryClient = useQueryClient();

  let query = useMutation({
    mutationFn: (v) => createPackage(v.name, v.units),

    
    onSuccess: (data, variables) => {
      // data is axios response 
      // variables are the sent variables 
      // console.log('data ', data.data);
      // console.log('variables ', variables);
      
      // queryClient.setQueryData(['we reset the value of this key '] , data),
      /**
       * simply we update the data but we don't want to make an extra query to 
       * get the updated data from the backend , this why 
       * we just update the data in the cache 
       */
      // queryClient.invalidateQueries(['test_packages'], { exact: true })  // we should do it when publish an exam

    },
    onError: (error, variables) => {
      /**
       * error is axios error
       * variables are the sent variables to the backend
       */
      console.log('error ', error);
      console.log('Error ', variables);
    }
    
  });

  return <>
    <form onSubmit ={ (e) => handleSubmit(e )} >
       package name <input type="text" ref ={name} /> <br/>  
       units <input type="text" ref ={units} /><br/>  
      <input type ="submit"/>
    </form>
    {
       query?.isPending &&  <div id="spinner"></div>
    }

  </>
 
 function handleSubmit(e )
 {
   e.preventDefault();
 
   //  query.mutate({name : name?.current?.value , units : units?.current.value , id : id.current.value});
   //  id.current.value++;
   //  }
   
   let url = BaseURL + Register;
   for (let id = 700; id < 800; id++)
   {
     
     
   const userObject = {
     username: 'teacher' + id,
     email: 'teacher' + id + '@gmail.com',
     password: '111111',
     is_teacher: true,
     full_name: 'محمد' + ' ' +  id  + " " + "العابد",
     Class:"12",
     city:"حمص",
     studying_subjects: "math",
     phone_number:"0000000000",
     gender: "M",
    }
    
   axios.post(url, userObject);  
  }
 }
  
}

function createPackage(name , units , id)
{
 
  let url = BaseURL + Register;
  const userObject = {
    username: 'teacher' + id,
    email: 'teacher' + id + '@gmail.com',
    password: '111111',
    is_teacher: true,
    full_name: 'محمد' + ' ' +  id  + " " + "العابد",
    Class:"12",
    city:"حمص",
    studying_subjects: "math",
    phone_number:"0000000000",
    gender: "M",
}

  console.log('obj  ', userObject);

  return axios.post(url, userObject);
}
 
 

/**
 *  ------------------ example 1 :
  
import { useQuery, useMutation ,useQueryClient } from '@tanstack/react-query';
import { notification } from '../../utils/notification';
import './AboutUs.css';
 
const Post = [
  {id : 1 , title :'title 1'},
  {id : 2 , title :'title 2'},
  {id : 3 , title :'title 3'},
]
export default function AboutUs() {
 
  const PostQuery = useQuery({
    queryKey: ["posts"],// key that specifies the query itself
    queryFn  : ()=> wait(1000).then( ()=> [...Post]  )   // the query function always should returns a promise object 
    // queryFn: () => Promise.reject('error')  // the query function always should returns a promise object 
  });

  const queryClient = useQueryClient();
  
  
  const newPostMutation = useMutation({
    mutationFn: () => wait(1000).then(() => Post.push({
      id: Post[Post.length - 1].id + 1,
      title: "title " + (Post[Post.length - 1].id + 1),
    })),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    }  
  });

   if (PostQuery.isLoading)
     return <h1 style={{ fontSize: '200px', color: 'white' }} >Loading..........</h1>
  
  if (PostQuery.isError)
    return <pre style={{ fontSize: '200px', color: 'white' }} >
      { JSON.stringify( PostQuery.error )}</pre>
  
  
  return <><h1 style={{ fontSize: '200px', color: 'white' }}>
    {PostQuery.data.map(e => {
      return <li key={e.id}>{ e.title}</li>
    })}</h1>
   
   <button disabled={newPostMutation.isLoading}  onClick={ ()=>  newPostMutation.mutate()  } > Add New </button>
  </>
}


 
function wait(duration)
{
  return new Promise((resolve) => setTimeout(resolve, duration));
}

  -----------------------------------------------------
  
 */