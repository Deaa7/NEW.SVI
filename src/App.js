
import Header from "./Components/Header/Header";
import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./Components/Footer/Footer";
import './all.min.css';

export default function App()
{
	
	return <>
		<Header />
		
	   
		<Outlet />
		
				   <Footer />
						
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={true}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			
/>


	</>
}