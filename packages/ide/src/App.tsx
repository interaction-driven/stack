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
    Outlet
} from 'react-router-dom'
import ConceptOverlay from "./ConceptOverlay";

function App() {
    return (
        <div className="h-full">
            <Sidebar />
            <div className="lg:pl-72 flex flex-col h-full">
                <Navbar />
                <main className="grow">
                    <div className="h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
            <EditorOverlay />
            <ConceptOverlay />
            <ChatWidget />
        </div>
    )
}

export default App

