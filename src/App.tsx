import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import LessonsPage from "./pages/LessonsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import TeacherManagement from "./pages/admin/TeacherManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import LessonManagement from "./pages/admin/LessonManagement";
import TeacherLessonManagement from "./pages/teacher/LessonManagement";
import HomeworkReview from "./pages/teacher/HomeworkReview";
import HomeworkPage from "./pages/student/HomeworkPage";
import ChatPage from "./pages/ChatPage";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <ContentProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/lessons" element={<LessonsPage />} />
                
                {/* Student Routes */}
                <Route path="/student/homework" element={<HomeworkPage />} />
                
                {/* Teacher Routes */}
                <Route path="/teacher/lessons" element={<TeacherLessonManagement />} />
                <Route path="/teacher/homework" element={<HomeworkReview />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/teachers" element={<TeacherManagement />} />
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/lessons" element={<LessonManagement />} />
                
                {/* Chat Route */}
                <Route path="/chat" element={<ChatPage />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ContentProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
