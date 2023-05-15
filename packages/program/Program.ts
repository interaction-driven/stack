import * as process from "process";
import {Activity} from "../runtime/types";
import {RoleType} from "../base/types";

export class Module {
    constructor(
        private program: Program,
        public name: string
    ) {
    }
    get activities() {
        return this.program.activities.getBy('module', this.name)
    }
    get interactions() {
        return this.program.interactions.getBy('module', this.name)
    }
}

export class Activities {
    constructor(
        public activities: Activity[]
    ) {
    }

    getBy(indexName: string, value: string): Map<string, Activity> {
        return new Map()
    }
}

export class Interactions {
    constructor(
        public interactions: Activity[]
    ) {
    }

    getBy(indexName: string, value: string): Map<string, Activity> {
        return new Map()
    }
}

type Concepts = {
    userRole: RoleType
    [k: string]: any
}


// 就是个 读写查询工具，可以从各种索引查询，还可以从提供引用信息。

export default class Program {
    activities: Activities
    interactions: Interactions
    constructor(public modules: Map<string, Module>, activities: Activity[], public concepts: Concepts) {
        this.activities = new Activities(activities)
        this.interactions = new Interactions([])
    }
}


export class Plugin {

}
