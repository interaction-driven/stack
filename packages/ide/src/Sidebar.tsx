import logo from "../public/ineraqt.logo.svg";
import {useMatch, useNavigate, useResolvedPath, useRoutes} from "react-router-dom";
import {
    Squares2X2Icon,
    CursorArrowRippleIcon,
    CursorArrowRaysIcon,
    DocumentIcon,
    ChartPieIcon,
    UsersIcon,
    BookOpenIcon,
    ArrowLeftIcon
} from "@heroicons/react/20/solid";




function Menu({ menu, active, back } : {menu: any, active?: number, back?: string}) {
    const navigate = useNavigate()
    return (
        <nav className="flex flex-1 flex-col">
            {back && (
                <button
                    onClick={() => navigate(back)}
                    type="button"
                    className="inline-flex mb-10 items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Back
                </button>
            )}
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                    <ul role="list" className="-mx-2 space-y-1">
                        {menu.map(({title, Icon}, index) => (
                            <li>
                                <a href="#"
                                   className={
                                    index === active?
                                       "bg-gray-50 text-indigo-600 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold":
                                       "text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                   }>
                                    <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true"/>
                                    {title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </li>

                <li className="mt-auto">
                    <a href="#"
                       className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                        <svg className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                             fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                             aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        Settings
                    </a>
                </li>
            </ul>
        </nav>
    )
}


export default function Sidebar() {
    const mainMenu = [{
        title: 'Module',
        Icon: Squares2X2Icon
    }, {
        title: 'Use Case',
        Icon: CursorArrowRaysIcon
    },{
        title: 'Document',
        Icon: DocumentIcon
    },{
        title: 'Report',
        Icon: ChartPieIcon
    },{
        title: 'Team',
        Icon: UsersIcon
    }]

    const moduleMenu = [{
        title: 'Activity',
        Icon: CursorArrowRippleIcon
    }, {
        title: 'Concept',
        Icon: BookOpenIcon
    }]


    // const menuElement = useRoutes([{
    //     path: '/',
    //     element: <Menu menu={mainMenu} active={0}/>,
    //     children: []
    // },{
    //     path: '/module/:moduleId/activity',
    //     element: <Menu menu={moduleMenu} active={0} back='/module'/>
    // }, {
    //     path: '/module',
    //     element: <Menu menu={mainMenu} active={0}/>
    // }])

    const matched = useMatch('/module/:moduleId/activity')
    console.log(useMatch('/module/:moduleId/activity'))


    const menuElement = matched ? <Menu menu={moduleMenu} active={0} back='/module'/>:  <Menu menu={mainMenu} active={0}/>


    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                    <img className="h-8 w-auto"
                         src={logo} alt="Your Company"/>
                </div>
                {menuElement}
            </div>
        </div>
    )
}
