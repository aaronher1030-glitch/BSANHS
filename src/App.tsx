import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
import About from "./pages/About";
import Accomplishments from "./pages/Accomplishments";
import ActivityPage from "./pages/ActivityPage";
import Feedback from "./pages/Feedback";
import Finance from "./pages/Finance";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Transparency from "./pages/Transparency";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="accomplishments" element={<Accomplishments />} />
        <Route path="accomplishments/:slug" element={<ActivityPage />} />
        <Route path="finance" element={<Finance />} />
        <Route path="transparency" element={<Transparency />} />
        <Route path="about-us" element={<About />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
