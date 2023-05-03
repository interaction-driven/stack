import ActivityGraph from "./Activity";

export default function ActivityItem({ name, description, activity} : { name: string, description: string, activity: any}) {
    return <div className="">
        <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">{name}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{description}</p>
        </div>
        <div className="mt-6 border-t border-gray-100 h-[36rem]">
            <ActivityGraph />
        </div>
    </div>
}
