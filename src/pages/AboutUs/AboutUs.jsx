import "./AboutUs.css";
import aboutImg from "../../assets/about-edu.jpg"; // ضع صورة مناسبة في مجلد assets أو استخدم صورة من الإنترنت

export default function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-card">
        <img src={aboutImg} className="about-img" alt="التعليم الافتراضي" />
        <h2 className="about-title">عن المعهد الافتراضي السوري</h2>
        <p className="about-text">
          المعهد الافتراضي السوري منصة تعليمية رائدة تهدف لتقديم أفضل الخدمات التعليمية عن بُعد للطلاب والمدرسين في سوريا والوطن العربي. نسعى لتسهيل الوصول للعلم والمعرفة باستخدام أحدث وسائل التقنية، مع دعم كامل للتواصل بين الطالب والمعلم بطريقة احترافية وآمنة.
        </p>
        <div className="about-features">
          <div className="feature">
            <span className="icon">🎓</span>
            <span>تعليم تفاعلي لجميع الصفوف</span>
          </div>
          <div className="feature">
            <span className="icon">🧑‍🏫</span>
            <span>طاقم تدريسي متميز</span>
          </div>
          <div className="feature">
            <span className="icon">💡</span>
            <span>دروس واختبارات حديثة ومتجددة</span>
          </div>
          <div className="feature">
            <span className="icon">🌐</span>
            <span>دعم فني وتواصل مباشر 24/7</span>
          </div>
        </div>
        <a className="about-btn" href="/">العودة للصفحة الرئيسية</a>
      </div>
    </div>
  );
}
