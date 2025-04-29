//library
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//pages
import App from "../App";
import AddExam from "../pages/AddExam/AddExam";
import AboutUs from "../pages/AboutUs/AboutUs";
import ExamComponent from "../pages/ExamComponent/ExamComponent";
import EditingTeacherProfile from "../pages/EditingTeacherProfile/EditingTeacherProfile";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import ReadNoteComponent from "../pages/ReadNoteComponent/ReadNoteComponent";
import Register from "../pages/Register/Register";
import SubjectMaterial from "../pages/SubjectMaterial/SubjectMaterial";
import SingleTestPackageView from "../pages/SingleTestPackageView/SingleTestPackageView";
import SingleNoteView from "../pages/SingleNoteView/SingleNoteView";
import TeacherProfile from "../pages/TeacherProfile/TeacherProfile";
import TextEditor from "../pages/TextEditor/TextEditor";
import TestSectionContent from "../pages/TestSectionContent/TestSectionContent";
import TextContentSection from "../pages/TextContentSection/TextContentSection";
import URLNotFound from "../pages/URLNotFound/URLNotFound";

import 'mathlive/static.css';
import 'quill/dist/quill.snow.css';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },

            {
                path: 'SubjectMaterial/:subject_name/:Class',
                element: <SubjectMaterial />,
            },
            {
                path: 'Login',
                element: <Login />
            },
            {
                path: 'Register',
                element: <Register />
            },
            {
                path: 'SingleExamView/:subject_name/:Class/:id',
                element: <SingleTestPackageView />
            },
            {
                path: 'SingleNoteView/:subject_name/:Class/:id',
                element: <SingleNoteView />
            },
            {
                path: 'examPage/:subject_name/:Class/:package_id',
                element: <ExamComponent />
            },
            {
                path: 'NotePage/:id',
                element: <ReadNoteComponent />
            },
            {
                path: 'AddExam',
                element: <AddExam />
            },
            {
                path: 'TextEditor',
                element: <TextEditor />
            },
            {
                path: 'EditingTeacherProfile/:id',
                element: <EditingTeacherProfile />
            },
            {
                path: 'TeacherProfile/:id',
                element: <TeacherProfile />
            },
            {
                path: 'TestSectionContent/:subject_name/:Class/:count',
                element: <TestSectionContent />
            },
            {
                path: 'TextContentSection/:subject_name/:Class/:count',
                element: <TextContentSection />
            },
            {
                path: 'About',
                element: <AboutUs />
            },
            {
                path: '*',
                element: <URLNotFound />
            },
        ]
    }
])

const AppRouter = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRouter