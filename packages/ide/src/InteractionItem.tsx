import Interaction from "./Interaction";

export default function InteractionItem({ name, description, interaction} : { name: string, description: string, interaction: any}) {
    return <div className="">
        <div className="sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">{name}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{description}</p>
        </div>
        <div className="mt-1 border-t border-gray-100 pt-4">
            <Interaction {...interaction}/>
        </div>
    </div>
}
