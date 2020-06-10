import { readJSONAsync, saveJSONAsync, appendJSONAsync } from "./fileUtils";
import { getUserTimeline, decrementIdStr, pathToScriptsJson } from "./utils";
import { checkVersion } from "./version";

const fetchNew = () => {
  let intervalId;
  const bearer = process.env.BEARER;
  if (!bearer) {
    console.error("No Bearer token, cannot auth");
    return;
  }

  console.log(`Bearer: ...${bearer.slice(bearer.length - 8)}`);

  const interval = 30 * 1011;
  const tick = async () => {
    try {
      const status = await readJSONAsync(pathToScriptsJson("status.json"), {});

      if (!status.since_id) {
        console.log(`update > no since_id, retrying in ${interval / 1000} sec`);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
        params: {
          screen_name: "SeaFDIncidents",
          exclude_replies: true,
          trim_user: true,
          count: 10,
          since_id: status.since_id,
        },
      };

      if (status.max_id_update) {
        config.params.max_id = status.max_id_update;
      }

      console.log(`update > requesting:\n`, config.params);

      const newData = await getUserTimeline(config);
      console.log(`update > received ${newData.length} new tweets`);

      const newTotal = await appendJSONAsync(
        pathToScriptsJson("unprocessed.json"),
        newData,
        {
          dedupe: true,
        }
      );
      const newStatus = {
        ...status,
        updated: new Date().toLocaleString(),
        updatedBy: "update",
        fetched: newData.length,
        unprocessed: newTotal,
      };
      const oldest = newData[newData.length - 1];
      if (oldest) {
        newStatus.max_id_update = decrementIdStr(oldest.id_str);
      }
      const newest = newData[0];
      if (newest && !newStatus.since_id_future) {
        newStatus.since_id_future = newest.id_str;
      }

      const reachedLimit =
        !oldest ||
        (oldest.id_str && oldest.id_str.localeCompare(status.since_id) <= 0);

      if (reachedLimit) {
        newStatus.max_id_update = undefined;
        if (newStatus.since_id_future) {
          newStatus.since_id = newStatus.since_id_future;
        }
        newStatus.since_id_future = undefined;
        console.log(
          `update > reached limit (${status.since_id}) — updating to ${newStatus.since_id}`
        );
      }

      await saveJSONAsync(pathToScriptsJson("status.json"), newStatus);
      console.log(`update > new total: ${newTotal}`);
    } catch (e) {
      console.error("update >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  intervalId = setInterval(tick, interval);
};

checkVersion();
fetchNew();
