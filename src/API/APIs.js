import axios from "axios";


// export const BaseURL = `http://127.0.0.1:8000/`;
export const BaseURL = `https://deaa7work.pythonanywhere.com/`;


export const BaseURLImages = `http://127.0.0.1:8000`;
// export const BaseURLImages = `https://deaa7work.pythonanywhere.com`;

const api = axios.create({
  baseURL: "https://deaa7work.pythonanywhere.com/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
///////////////////////////////// test packages  urls :  

export const CreateExam = `test_packages/create_test_packages/`;

export const AddQuestion = `questions/add_questions/`;

export const AddQuestionImage = 'questions/add_question_images/';

export const GetTestPackages = `test_packages/get_packages/`;

export const GetSinglePackageView = `test_packages/get_single_package/`;

export const GetTestPackageDetails = 'test_packages/get_package_details/';

export const GetTestPackageByPublisherId = `test_packages/get_test_packages_by_publisher_id/`;

export const GetStudentSolvedExams = `test_packages/get_student_solved_exams/`;

export const GetExamQuestions = `questions/all_questions/`;

export const GetExamQuestionsImage = `questions/get_question_images/`;

export const GetAllExamQuestionsAndImages = `questions/get_all_questions_and_images/`;

export const EditQuestionById = `questions/edit_question_by_id/`;

export const StudentRecordDoneExam = `StudentRelatedExams/examDoneRecord/`;

export const IncreaseNumberOfApps = `test_packages/increase_num_of_apps/`;

export const IncreaseNumberOfExamPurchases = `test_packages/increase_number_of_purchases/`;

export const CountNumberOfExams = `test_packages/count_number_of_exams/`;

export const DeleteQuestionsByPackageId = `questions/delete_questions_by_package_id/`;

export const DeleteQuestionImagesByQuestionId = 'questions/delete_question_images_by_question_id/';

export const IncreaseNumberOfExamComments = `test_packages/increase_number_of_exam_comments/`;

export const DecreaseNumberOfExamComments = `test_packages/decrease_number_of_exam_comments/`;


/////////////////////////////////

///////////////////////////////// temp images

export const UploadTempImage = 'temp_images/upload_temp_image/';

export const DeleteTempImages = 'temp_images/delete_temp_images/';


//////////////////////////////////////////////// comments

export const GetCommentsByExamId = 'comments/get_comments_by_exam_id/';

export const GetCommentsByNoteId = 'comments/get_comments_by_note_id/';

export const GetCommentsByBlogId = 'comments/get_comments_by_blog_id/';

export const GetCommentsByCommentId = 'comments/get_comments_by_comment_id/';

export const AddComment = 'comments/add_comment/';

export const IncreaseNumberOfCommentReplies = 'comments/increase_number_of_comment_replies/';

export const DecreaseNumberOfCommentReplies = 'comments/decrease_number_of_comment_replies/';

export const DeleteCommentById = 'comments/delete_comment_by_id/';


////////////////////////////////////////////////


///////////////////////////////////////// flash cards

export const GetRandomCard = 'flashcards/get_flash_card/';
/////////////////////////////////////////

///////////////////////////////// notes urls :

export const AddNote = `notes/add_note/`;

export const AddNoteImage = 'notes/addNoteImages/';

export const GetNoteWithoutContent = `notes/GetNoteWithoutContent/`; 

export const GetNoteWithContent = `notes/GetNoteWithContent/`;

export const GetNotesWithFilter = `notes/get_by_filter/`;

export const GetNoteImages = `notes/getNoteImages/`;

export const IncreaseNumberOfNoteReads = `notes/IncreaseNumberOfReads/`;

export const GetNotesWithoutContentByTeacherID = 'notes/GetNotesWithoutContentByTeacherID/';

export const IncreaseNumberOfNotePurchases = `notes/increase_number_of_purchases/`;

export const EditNoteById = `notes/edit_note_by_id/`;

export const IncreaseNumberOfNoteComments = `notes/increase_number_of_note_comments/`;

export const DecreaseNumberOfNoteComments = `notes/decrease_number_of_note_comments/`;

/////////////////////////////////

///////////////////////////////// user auth urls : 

export const Register = `users/register/`;

export const Login = `users/login/`;

export const Logout = `users/logout/`;

export const RefreshUserData = 'users/refresh/';

/////////////////////////////////


///////////////////////////////// teacher urls :

export const TeacherPreview = `profiles/get_teacher_preview/`;

export const TeacherProfileInfo = `profiles/get_teacher_info/`;

export const UpdateTeacherProfile = `profiles/update_teacher_profile/`;

export const IncreaseNumberOfTeacherExams = 'profiles/increase_number_of_teacher_exams/';

export const DecreaseNumberOfTeacherExams = 'profiles/decrease_number_of_teacher_exams/';

export const IncreaseNumberOfTeacherNotes = 'profiles/increase_number_of_teacher_notes/';

export const DecreaseNumberOfTeacherNotes = 'profiles/decrease_number_of_teacher_notes/';

/////////////////////////////////

////////////////////////////////  student urls :

export const StudentOwnProfile = `profiles/get_student_own_profile_info/`;

export const GetStudentDoneExams = `StudentRelatedExams/student_done_exams/`;

export const GetStudentPremiumContent = `StudentRelatedExams/get_premium_content_by_student_id/`;

export const PayPremiumContent = `StudentRelatedExams/pay_premium_content/`;

////////////////////////////////

export const CountAll = 'profiles/count_all/'; 
 

//////////////////////////// image names

export const imageNames = [''];

for (let i = 0; i <= 2027; i++)
{
    imageNames.push('d'+i);
}

