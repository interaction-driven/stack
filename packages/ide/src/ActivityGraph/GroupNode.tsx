import {Group} from "../../../base/types";
import ActivityGraph from "./ActivityGraph";

export default function GroupNode({ data } : { data: Group }) {
    return <div  className="inline-block bg-white px-3 py-1 shadow sm:rounded-lg">
        <div  className="py-1 text-center">{data.type.toUpperCase()} group</div>
        <div className="py-3">
            <ActivityGraph data={data}/>
        </div>
    </div>
}