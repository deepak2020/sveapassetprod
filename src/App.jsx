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
import SpeakingChat from './pages/SpeakingChat';
import Tala from './pages/Tala';
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
import Showcase from './pages/Showcase';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, authChecked } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors (only for truly required pages)
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  // Mark first-time visitors as visited so we can identify returning users later
  if (authChecked && !isAuthenticated) {
    localStorage.setItem("svenska:visited", "1");
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
        <Route path="/prata" element={<SpeakingChat />} />
        <Route path="/tala" element={<Tala />} />
        <Route path="/grammar" element={<Grammar />} />
        <Route path="/grammar/:categoryId/:topicId" element={<GrammarTopic />} />
        <Route path="/admin/grammar" element={<AdminGrammar />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
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