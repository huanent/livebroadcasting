import { EventEmitter2 } from "eventemitter2";

export let Emitter;

export const initEmitter = function() {
  Emitter = new EventEmitter2({
    //
    // set this to `true` to use wildcards. It defaults to `false`.
    //
    wildcard: true,

    //
    // the delimiter used to segment namespaces, defaults to `.`.
    //
    delimiter: "::",

    //
    // set this to `true` if you want to emit the newListener event. The default value is `false`.
    //
    newListener: false,

    //
    // set this to `true` if you want to emit the removeListener event. The default value is `false`.
    //
    removeListener: false,

    //
    // the maximum amount of listeners that can be assigned to an event, default 10.
    //
    maxListeners: 20,

    //
    // show event name in memory leak message when more than maximum amount of listeners is assigned, default false
    //
    verboseMemoryLeak: false,
    //
    // disable throwing uncaughtException if an error event is emitted and it has no listeners
    //
    ignoreErrors: false
  });
};
initEmitter();
export const destroyEmitter = function() {
  if (Emitter) Emitter = null;
};
