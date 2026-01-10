import { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { StudentsList } from "./components/StudentsList";
import { StudentProfile } from "./components/StudentProfile";
import { IndustryRequirements } from "./components/IndustryRequirements";
import { AIMatchResults } from "./components/AIMatchResults";
import { SkillGapFeedback } from "./components/SkillGapFeedback";

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-white">
        {!isLandingPage && <Navigation />}
        <div className={!isLandingPage ? "pt-16" : ""}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<StudentsList />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/roles" element={<IndustryRequirements />} />
            <Route path="/matches" element={<AIMatchResults />} />
            <Route path="/skill-gap" element={<SkillGapFeedback />} />
          </Routes>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
