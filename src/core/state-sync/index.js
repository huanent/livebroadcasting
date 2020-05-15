import config from "./config";
import { liveBroadcastService } from "../live-broadcast/live-broadcast-service";

export const syncConfig = config;

export function autoSyncState(app) {
  app.$watch(
    _ => app.$store.state,
    value => {
      const currentRole = value.account.role;
      const senderConfig = config.filter(f => f.sender == currentRole);
      for (const i of senderConfig) {
        let stateValue = getStateValue(value, i.path);
        let comparable =
          stateValue instanceof Object
            ? JSON.stringify(stateValue)
            : stateValue;

        if (comparable != i.value) {
          i.value = comparable;

          let payload = {
            value: stateValue,
            path: i.path,
            toPath: i.toPath
          };

          if (i.primaryKey) {
            payload.primaryKey = value.account.userInfo.username;
            payload.streamId = value.workplace.token.id;
          }

          liveBroadcastService.timService.sendSystemMsg(
            "STATE_SYNC",
            i.listener,
            payload
          );
        }
      }
    },
    { deep: true }
  );
}

export function getStateValue(state, path) {
  let currentValue = state;

  for (const i of path) {
    currentValue = currentValue[i];
    if (currentValue === undefined) break;
  }

  return currentValue;
}
