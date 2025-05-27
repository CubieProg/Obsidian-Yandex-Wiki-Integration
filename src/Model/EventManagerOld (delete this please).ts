import { Hash } from 'crypto'
import { v4 as uuid } from 'uuid'

// ECS надо запихивать в контекст. 
// Хотя, это про общий ресурс, который должен чиститься, после того как все подписчики его прочитали.
// Нужно объединять с EM

// ECS нужно делать нормальным. Так как простой кейс требует системы
// Auth === tree ===> TreeConverter === convertedTree ===> View
// Хотя, можно в общий сральник пихать всё

// Можно связывать Subscriber-ов

export enum EventType { // Поменять Enum на ECS
    Test,
    Authtorization,
    All
}

export class Event {
    id: string
    type: EventType
    data: any // Это надо затипизировать Entity.

    constructor(id: string, type: EventType, data: any) {
        this.id = id
        this.type = type
        this.data = data
    }
}


// function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
//     return arr.map(func);
// }
// type DescribableFunction = {
//     description: string;
//     (someArg: number): boolean;
// };

// const b: Function {
//     description: string;
// (someArg: number): boolean;
// };


// const a: Function<integer> = map

export class Subscriber { // Превращается в System
    id: string
    name: string
    private callback: Function
    private recieversId: Set<string>
    private recieverMap: Map<Subscriber, EventType[]>

    constructor(name: string, id: string) {
        this.id = id,//uuid()
            this.name = name
        this.recieversId = new Set<string>()
        this.recieverMap = new Map<Subscriber, EventType[]>()
    }

    public bindCallback(callback: Function, instance: object | null) {
        this.callback = callback

        if (instance !== null) {
            callback.bind(instance)
        }
    }

    public registerEvent(event: Event) {
        console.log(event)
        if (!this.callback) {
            return
        }

        const new_event = this.callback(event)

        if (new_event instanceof Event) {
            this.broadcastEvent(new_event)
        }
    }

    public broadcastEvent(event: Event) {
        this.recieverMap.forEach(
            (subscribedEvents: EventType[], reciever: Subscriber) => {
                if (event.type != EventType.All && !subscribedEvents.includes(event.type)) {
                    return
                }

                reciever.registerEvent(event)
            }
        )
    }

    public useReciever(reciever: Subscriber, ...eventTypes: EventType[]) {
        if (this.recieversId.has(reciever.id) || this.recieverMap.has(reciever)) {
            return
        }

        this.recieversId.add(reciever.id)//.set(reciever, eventTypes)
        this.recieverMap.set(reciever, eventTypes)
    }

    public addReciever(reciever: Subscriber, ...eventTypes: EventType[]) {
        console.log("Adding reciever", reciever.id, this.recieversId)
        if (this.recieversId.has(reciever.id) || this.recieverMap.has(reciever)) {
            throw new Error(`Reciever with id ${reciever.id} already exists`)
        }

        this.recieversId.add(reciever.id)//.set(reciever, eventTypes)
        this.recieverMap.set(reciever, eventTypes)
    }
}

export class EventManager {

    private events: Event[]
    private subscribersId: Set<string>
    private subscribersMap: Map<Subscriber, EventType[]> // Сопоставление


    constructor() {
        this.events = new Array<Event>();
        this.subscribersId = new Set<string>();
        this.subscribersMap = new Map<Subscriber, EventType[]>()
    }

    public pushEvent(eventType: EventType, data: any): string {
        console.log("Pushing")
        const event_id = uuid()

        const new_event = new Event(event_id, eventType, data)
        this.broadcastEvent(new_event)

        // this.events.unshift(new Event(event_id, eventType, data))
        // this.broadcastEvent(this.events.pop())

        return event_id
    }

    public broadcastEvent(event: Event) {
        console.log("Broadcasting on ", this.subscribersMap.size)
        this.subscribersMap.forEach(
            (subscribedEvents: EventType[], subscriber: Subscriber) => {
                if (event.type != EventType.All && !subscribedEvents.includes(event.type)) {
                    return
                }

                subscriber.registerEvent(event)
            }
        )
    }

    public useSubscriber(id: string, add: boolean): Subscriber {
        console.log("Use", id)
        if (this.subscribersId.has(id)) {
            for (let sub of this.subscribersMap.keys()) {
                if (sub.id === id) {
                    return sub
                }
            }
        }

        const new_subscriber = new Subscriber("", id)
        // this.addSubscriber(new_subscriber)
        if (add) { this.addSubscriber(new_subscriber) }

        return new_subscriber
    }

    private addSubscriber(subscriber: Subscriber) {
        console.log("Adding a sub with id: ", subscriber.id)
        if (this.subscribersId.has(subscriber.id) || this.subscribersMap.has(subscriber)) {
            throw new Error(`Subscriber with id ${subscriber.id} already exists`)
        }

        this.subscribersId.add(subscriber.id)
        this.subscribersMap.set(subscriber, [])
    }

    public subscribe(subscriber: Subscriber, ...eventTypes: EventType[]) {

        if (!this.subscribersId.has(subscriber.id) && !this.subscribersMap.has(subscriber)) {
            console.log(this.subscribersMap)
            console.log(this.subscribersId)
            throw new Error(`There is no subscriber with id ${subscriber.id}`)
        }
        // this.subscribersMap[subscriber] = (val: EventType[]) => [...eventTypes, ...val]

        let sub_;
        for (let sub of this.subscribersMap.keys()) {
            if (sub.id === subscriber.id) {
                sub_ = sub
            }
        }

        if (!sub_) { return }

        this.subscribersMap.set(
            sub_,
            [...new Set([...eventTypes, ...(this.subscribersMap.get(subscriber) || [])])]
        )
    }
}