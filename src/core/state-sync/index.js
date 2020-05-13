import config from "./config";
import { liveBroadcastService } from "../live-broadcast/live-broadcast-service";

export function sendState(app) {
  app.$watch(
    _ => app.$store.state,
    value => {
      const currentRole = value.account.role;
      const senderConfig = config.filter(f => f.sender == currentRole);
      for (const i of senderConfig) {
        const stateValue = getStateValue(value, i.path);
        if (stateValue != i.value) {
          i.value = stateValue;
          liveBroadcastService.timService.sendSystemMsg(
            "STATE_SYNC",
            i.listener,
            {
              value: i.value,
              path: i.path
            }
          );
        }
      }
    },
    { deep: true }
  );
}

export function listenState(store, data) {
  const currentRole = store.state.account.role;
  if (currentRole == data.userIds) {
    store.commit("SYNC_STATE", data.data);
  }
}

function getStateValue(state, path) {
  let currentValue = state;

  for (const i of path) {
    currentValue = currentValue[i];
    if (currentValue === undefined) break;
  }

  return currentValue;
}
