import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Home from './pages/Home';
import LanguageLessons from './pages/LanguageLessons';
import LessonDetail from './pages/LessonDetail';
import TopicLessons from './pages/TopicLessons';
import CivicTopics from './pages/CivicTopics';
import TopicDetail from './pages/TopicDetail';
import ListeningTest from './pages/ListeningTest';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Gym from './pages/Gym';
import Speaking from './pages/Speaking';
import Tala from './pages/Tala';
import MissionPlayer from './pages/MissionPlayer';
import TalaShadowing from './pages/tala/Shadowing';
import TalaSprint from './pages/tala/WordSprint';
import TalaChunks from './pages/tala/Chunks';
import TalaDailyWorkout from './pages/tala/DailyWorkout';
import CitizenshipTest from './pages/CitizenshipTest';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Contact from './pages/Contact';
import ThemeSync from './components/ThemeSync';
import XPToast from './components/shared/XPToast';
import StreakMilestoneModal from './components/shared/StreakMilestoneModal';
import WhatsNewModal from './components/shared/WhatsNewModal';
import SignupNudge from './components/shared/SignupNudge';
import Grammar from './pages/Grammar';
import GrammarTopic from './pages/GrammarTopic';
import AdminGrammar from './pages/AdminGrammar';
import AdminUsers from './pages/AdminUsers';
import AdminFeedback from './pages/AdminFeedback';
import AdminMissions from './pages/AdminMissions';
import Showcase from './pages/Showcase';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, authChecked, navigateToLogin } = useAuth();

  // Returning visitors (seen the app before) who aren't logged in are asked to
  // register/login. First-time visitors can still browse freely.
  useEffect(() => {
    if (authChecked && !isAuthenticated && authError?.type !== 'user_not_registered') {
      const isReturning = localStorage.getItem("svenska:visited") === "1";
      if (isReturning) {
        navigateToLogin();
      } else {
        localStorage.setItem("svenska:visited", "1");
      }
    }
  }, [authChecked, isAuthenticated, authError, navigateToLogin]);

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Returning unauthenticated visitors get a spinner while redirecting to login
  if (!isAuthenticated && localStorage.getItem("svenska:visited") === "1") {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }
  // Render the main app
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/language" element={<LanguageLessons />} />
        <Route path="/language/topic/:course/:topic" element={<TopicLessons />} />
        <Route path="/language/:id" element={<LessonDetail />} />
        <Route path="/civic" element={<CivicTopics />} />
        <Route path="/civic/:id" element={<TopicDetail />} />
        <Route path="/listening/:course" element={<ListeningTest />} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/tala" element={<Tala />} />
        <Route path="/tala/mission/:id" element={<MissionPlayer />} />
        <Route path="/tala/daily" element={<TalaDailyWorkout />} />
        <Route path="/tala/shadowing" element={<TalaShadowing />} />
        <Route path="/tala/sprint" element={<TalaSprint />} />
        <Route path="/tala/chunks" element={<TalaChunks />} />
        <Route path="/grammar" element={<Grammar />} />
        <Route path="/grammar/:categoryId/:topicId" element={<GrammarTopic />} />
        <Route path="/admin/grammar" element={<AdminGrammar />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/missions" element={<AdminMissions />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/citizenship-test" element={<CitizenshipTest />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeSync />
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <XPToast />
        <StreakMilestoneModal />
        <WhatsNewModal />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App