import config from "./config";
import { liveBroadcastService } from "../live-broadcast";

export const syncConfig = config;

let unwatch;
export function autoSyncState(app) {
  unwatch = app.$watch(
    _ => app.$store.state,
    value => {
      const senderConfig = config.filter(f => f.sender == value.workplace.role);
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
            payload.nickName = value.account.userInfo.nickname;
            if (value.workplace.token)
              payload.streamId = value.workplace.token.id;
          }

          if (!liveBroadcastService) return;
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
export function destroySyncState() {
  if (unwatch) {
    unwatch();
  }
}
export function getStateValue(state, path) {
  let currentValue = state;

  for (const i of path) {
    currentValue = currentValue[i];
    if (currentValue === undefined) break;
  }

  return currentValue;
}
