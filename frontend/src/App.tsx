import {Routes, Route, Navigate} from "react-router";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import JobsPage from "./pages/JobsPage.tsx";
import JobFormPage from "./pages/JobFormPage.tsx";

export default function App() {
  return(
      <Routes> {/*routes between the page*/}
        <Route path ="/login" element={<LoginPage />} />
        <Route path ="/register" element={<RegisterPage />} />
        <Route path ="/jobs" element={<JobsPage />} />
          <Route path="/jobs/new" element={<JobFormPage />} />
          <Route path="/jobs/:id/edit" element={<JobFormPage/>} /> {/* : any values */}
          <Route path ="*" element={<Navigate to="/login" replace />} />
      </Routes>
  )
}