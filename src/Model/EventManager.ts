


// TODO сдклать нейминг EMECS

// E - Event
// M - Manager
// E - Entity
// C - Component
// S - System

const IDEMPOTENCY = true

export enum EventType { // Поменять Enum на ECS
    Test,
    Empty,
    Any,
    Authtorization,
}

export class Event {
    readonly id: string
    readonly type: EventType
    readonly data: any // Это надо затипизировать. Entity. Можно сделать ссылку на Entity в Storage-е и тогда уже отказываться от EventType и по компонентам в Entity смотреть

    constructor(id: string, type: EventType, data: any) {
        this.id = id
        this.type = type
        this.data = data
    }

    static Empty(): Event {
        return new Event("", EventType.Empty, null)
    }

    isEmpty(): boolean {
        return this.type === EventType.Empty
    }
}


export class Subscriber {
    readonly name: string

    private ProducersTable: Map<Subscriber, Event | undefined>
    private producersNameMap: Map<string, Subscriber>

    protected ConsumersTable: Map<Subscriber, EventType[]>
    protected consumersNameMap: Map<string, Subscriber>

    private callbackCondition: Array<string>
    private callback: Function

    constructor(name: string) {
        this.ProducersTable = new Map<Subscriber, Event | undefined>();
        this.producersNameMap = new Map<string, Subscriber>();

        this.ConsumersTable = new Map<Subscriber, EventType[]>();
        this.consumersNameMap = new Map<string, Subscriber>();

        this.callbackCondition = new Array<string>();

        this.name = name
    }


    public getConsumerNames(): Array<string> {
        return [...this.consumersNameMap.keys()]
    }

    private getConsumer(name: string): Subscriber {
        const sub = this.consumersNameMap.get(name)
        if (sub instanceof Subscriber) { return sub }
        throw new Error(`${this.name} has no subscriber with name ${name}`)
    }

    public useSubscriber(name: string): Subscriber {
        if (this.consumersNameMap.has(name)) {
            return this.getConsumer(name)
        }

        let new_subscriber = new Subscriber(name);

        new_subscriber.ProducersTable.set(this, undefined)
        new_subscriber.producersNameMap.set(this.name, this)

        this.ConsumersTable.set(new_subscriber, new Array<EventType>())
        this.consumersNameMap.set(name, new_subscriber)

        return new_subscriber
    }

    public setSubscriber(subscriber: Subscriber): void {
        if (this.consumersNameMap.has(subscriber.name)) {
            if (IDEMPOTENCY) { return }
            throw new Error(`Consumer with name ${subscriber.name} already exists as a consumer of ${this.name}`)
        }

        this.ConsumersTable.set(subscriber, new Array<EventType>())
        this.consumersNameMap.set(subscriber.name, subscriber)
    }

    public setCallback(callback: Function, callbackCondition: Array<string> = new Array<string>()) {
        if ((new Set(callbackCondition)).size !== callbackCondition.length) {
            throw new Error(`Each condition may appear only once! You passed: ${callbackCondition.join(', ')}`)
        }

        if (!callbackCondition.every(value => this.producersNameMap.has(value))) {
            throw new Error(
                `A condition set must be a subset of it producers!
                Conditions: ${callbackCondition.join(', ')}
                Producers: ${[...this.producersNameMap].join(', ')}`
            )
        }

        this.callback = callback
        this.callback.bind(this)
        this.callbackCondition = callbackCondition
    }

    protected broadcastEvent(event: Event) {
        this.ConsumersTable.forEach(
            (subscribedEvents: EventType[], reciever: Subscriber) => {
                if (event.type != EventType.Any && !subscribedEvents.includes(event.type)) {
                    reciever.registerEvent(this, Event.Empty())
                } else {
                    reciever.registerEvent(this, event)
                }
            })
    }

    private registerEvent(parent_sub: Subscriber, event: Event | undefined) {
        this.ProducersTable.set(parent_sub, event)

        let new_event: Event | undefined;

        if (this.callbackReady()) { new_event = this.useCallback() }

        if (this.cleanupReady()) { this.cleanup() }

        if (new_event instanceof Event) { this.broadcastEvent(new_event) } else { this.broadcastEvent(Event.Empty()) }
    }

    private useCallback() {
        if (!(this.callback instanceof Function)) { return }

        const args = this.callbackCondition.map(cond => this.getProducerEvent(cond))
        return this.callback(this, ...args)
    }

    private callbackReady(): boolean {
        for (let cond of this.callbackCondition) {
            if (!(this.getProducerEvent(cond) instanceof Event)) { return false }

            // const sub = this.producersNameMap.get(cond)
            // if (sub === undefined) {
            //     throw new Error(`Somehow, condition "${cond}" does not exists in ProducersTable ¯\\_(ツ)_/¯`)
            // }

            // const ev = this.ProducersTable.get(sub)
            // if (!(ev instanceof Event)) {
            //     return false
            // }
        }
        return true
    }

    private cleanupReady(): boolean {
        for (let ev of this.ProducersTable.values()) {
            if (!(ev instanceof Event)) { return false }
        }

        return true
    }

    private cleanup(): void {
        for (let sub of this.ProducersTable.keys()) {
            this.ProducersTable.set(sub, undefined)
        }
    }

    private getProducerEvent(name: string): Event | undefined {
        let prod = this.producersNameMap.get(name)
        if (!(prod instanceof Subscriber)) { return }
        return this.ProducersTable.get(prod)
    }
}



export const EventManagerName: string = "EventManager"

export class EventManager extends Subscriber {

    constructor() {
        super(EventManagerName)
    }

    public pushEvent(event: Event) {
        this.broadcastEvent(event)
    }
}