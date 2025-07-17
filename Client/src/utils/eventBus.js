// eventBus.js
const events = {};
let lastPayload = {};  // dùng để "remember" emit gần nhất

const emitter = {
    on: (event, callback) => {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push(callback);

        // ✅ Nếu đã từng emit, thì gọi lại callback ngay (replay)
        if (lastPayload[event]) {
            callback(lastPayload[event]);
        }
    },

    emit: (event, data) => {
        lastPayload[event] = data;
        if (events[event]) {
            events[event].forEach((cb) => cb(data));
        }
    },

    off: (event, callback) => {
        if (events[event]) {
            events[event] = events[event].filter((cb) => cb !== callback);
        }
    },
};

export default emitter;
