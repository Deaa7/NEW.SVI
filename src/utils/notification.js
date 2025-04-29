import { toast } from 'react-toastify';

export function notification(text, class_name , duration = 5000) {
    
	// console.log('yes');
	toast(text, {
		position: "top-right",
		autoClose: duration,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
		className :class_name,
		}    );
    
}