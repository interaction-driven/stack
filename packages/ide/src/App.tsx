import './App.css'
import logo from '../public/ineraqt.logo.svg'
import Sidebar from "./Sidebar";
import Module from "./Module";
import Navbar from "./Navbar";
import Activity from "./Activity";
import Editor from "./Editor";
import ActivityPage from "./ActivityPage";
import EditorOverlay from "./EditorOverlay";
import ChatWidget from "./ChatWidget";
import {
    Outlet,
    useLocation
} from 'react-router-dom'
import ConceptOverlay from "./ConceptOverlay";

function App() {
  const location = useLocation();
  let title = location.pathname.split("/").pop() || "module";
  title = title.replace(title[0], title[0].toUpperCase());
  return (
    <div className="h-full">
      <Sidebar />
      <div className="lg:ml-full-menu sm:ml-mini-menu flex flex-col h-full">
        <Navbar title={title} />
        <main className="grow bg-gray-bg mr-6 border border-gray-bd1 rounded-[18px]">
          <div className="h-full relative">
            <Outlet />
          </div>
        </main>
        <div className='h-6 w-full shrink-0'></div>
      </div>
      <EditorOverlay />
      <ConceptOverlay />
      <ChatWidget className="fixed lg:left-full-menu sm:left-mini-menu bottom-6" />
    </div>
  );
}

export default App;

