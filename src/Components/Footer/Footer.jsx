import "./Footer.css";
import { Link } from "react-router-dom";
export default function Footer() {

  return <>
    <div id="footer_root">
      
      <div id="description_logo_container" className="footer_container">
        
        <div id="footer_description">
         المعهد الافتراضي السوري
        </div>
      </div>
       
      <div id="footer_important_links_container" className="footer_container">
        <div id="footer_important_links_title" className="footer_title">روابط مهمة</div>
        <Link to={"/"} id="home_link_footer" className="footer_links" onClick={up} title="الصفحة الرئيسية"  >
              الصفحة الرئيسية
              <i className="fa-solid fa-house"> </i>
           </Link>
               
            
			    <Link to={"../About/About.js"} id="about_link_footer" className="footer_links" onClick={up}  title="من نحن"  >
              من نحن
              <i className="fa-solid fa-address-card"> </i> 
          </Link>
        
      </div>

      <div id="footer_contact_us_container" className="footer_container">

        <div id="contact_us_title" className="footer_title" >
                تابعنا و ادعمنا
            </div>  
          {/* <i className="fa-solid fa-phone"></i> */}

            {/* <div id="contact_number" title="call us">
              963938469453+
              <i className="fa-solid fa-phone"></i>
            </div> */}

            {/* <a
              title="mail us"
              id="footer_googleMail"
              href="mailto:SVI.work@gmail.com">
              SVI.work@gmail.com
              <i className="fa-brands fa-google"></i>
             </a> */}
       
        <div className="footer_like_icon_container">
        <a href="">
              <i className="fa-brands fa-whatsapp"></i>
           </a>
        
           <a href="">
              <i className="fa-brands fa-telegram"></i>
           </a>
        </div>
        <div className="footer_like_icon_container">
        <a href="">
              <i className="fa-brands fa-instagram"></i>
        </a>
        
           <a href="">
              <i className="fa-brands fa-facebook"></i>
          </a>
          </div>
        
      </div>
      <div id="lower_part_of_footer">
          المعهد الافتراضي السوري SVI 
     
          كل الحقوق محفوظة     &#169;   2025
        </div>
    
    </div>
  </>
 
 
  function up()
  {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }); 
  }

}
