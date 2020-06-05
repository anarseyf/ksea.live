const axios = require("axios").default;
import { readJSONAsync, saveJSONAsync, appendJSONAsync } from "./fileUtils";

const backfillStop = new Date(2020, 5, 4, 15, 0, 0);

const fetchNew = () => {
  let intervalId;
  const bearer = process.env.BEARER;
  if (!bearer) {
    console.error("No Bearer token, cannot auth");
    return;
  }

  console.log(`Bearer: ...${bearer.slice(bearer.length - 8)}`);

  const interval = 4 * 1011;
  const tick = async () => {
    try {
      const status = await readJSONAsync("status.json", {});

      const config = {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
        params: {
          screen_name: "SeaFDIncidents",
          exclude_replies: true,
          trim_user: true,
          count: 3,
        },
      };

      if (status && status.max_id) {
        config.params.max_id = status.max_id;
      }

      console.log(
        `backfill > requesting ${config.params.count} with max_id ${config.params.max_id}...`
      );

      const res = await axios
        .get("https://api.twitter.com/1.1/statuses/user_timeline.json", config)
        .catch((e) => {
          console.error(
            "user_timeline call failed:",
            e.response.status,
            e.stack
          );
          throw e.message;
        });

      const newData = res.data;
      console.log(`backfill > received ${newData.length} new tweets`);

      let since_id;
      if (!status.since_id && newData.length) {
        const newest = newData[0];
        since_id = newest.id_str;
        console.log(
          `backfill > setting since_id = ${since_id} (${new Date(
            newest.created_at
          ).toLocaleString()})`
        );
      }

      const newTotal = await appendJSONAsync("unprocessed.json", newData, {
        dedupe: true,
      });
      console.log(`backfill > new total: ${newTotal}`);

      const oldest = newData[newData.length - 1];
      const newStatus = {
        ...status,
        max_id_backfill: oldest.id_str,
        since_id,
        updated: new Date().toLocaleString(),
        updatedBy: "backfill",
        fetched: newData.length,
        unprocessed: newTotal,
      };

      if (new Date(oldest.created_at) < backfillStop) {
        console.log(
          `backfill > reached limit (${new Date(
            backfillStop
          ).toLocaleString()}) — stopping runner`
        );
        clearInterval(intervalId);
        newStatus.max_id = undefined;
      }
      await saveJSONAsync("status.json", newStatus);
    } catch (e) {
      console.error("backfill >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  intervalId = setInterval(tick, interval);
};

fetchNew();
