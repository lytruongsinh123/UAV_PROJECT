import { EventEmitter } from 'events';

class EventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(20); // Tăng giới hạn listener
    }
}

const emitter = new EventBus();
export default emitter;