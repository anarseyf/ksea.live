import { readJSONAsync, saveJSONAsync, appendJSONAsync } from "../fileUtils";
import { getUserTimeline, pathToScriptsJson } from "../serverUtils";

const backfillStop = new Date(2020, 4, 1);

const fetchNew = () => {
  let intervalId;
  const bearer = process.env.BEARER;
  if (!bearer) {
    console.error("No Bearer token, cannot auth");
    return;
  }

  console.log(`Bearer: ...${bearer.slice(bearer.length - 8)}`);

  const interval = 5 * 1011;
  const tick = async () => {
    try {
      const status = await readJSONAsync(pathToScriptsJson("status.json"), {});

      if (!status.max_id_backfill) {
        console.warn("backfill > No max_id_backfill found, stopping runner");
        clearInterval(intervalId);
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
          count: 200,
          max_id: status.max_id_backfill,
        },
      };

      console.log(
        `backfill > backstop is (${new Date(backfillStop).toLocaleString()})`
      );
      console.log(
        `backfill > requesting ${config.params.count} with max_id ${config.params.max_id}...`
      );
      console.log(`backfill > `, config.params);

      const newData = await getUserTimeline(config);
      console.log(`backfill > received ${newData.length} new tweets`);

      let since_id;
      if (!status.since_id && newData.length) {
        // since_id is used by the update runner
        // as the cutoff point. Anything older than since_id
        // is assumed to be taken care of by the backfill.
        const newest = newData[0];
        since_id = newest.id_str;
        console.log(
          `backfill > setting since_id = ${since_id} (${new Date(
            newest.created_at
          ).toLocaleString()})`
        );
      }

      const newTotal = await appendJSONAsync(
        pathToScriptsJson("unprocessed.json"),
        newData,
        {
          merge: true,
        }
      );
      console.log(`backfill > new total: ${newTotal}`);

      const newStatus = {
        ...status,
        updated: new Date().toLocaleString(),
        updatedBy: "backfill",
        fetched: newData.length,
        unprocessed: newTotal,
      };
      const oldest = newData[newData.length - 1];
      if (oldest) {
        newStatus.max_id_backfill = oldest.id_str;
      }

      if (since_id) {
        newStatus.since_id = since_id;
      }

      if (new Date(oldest.created_at) <= backfillStop) {
        console.log(
          `backfill > reached backstop (${new Date(
            backfillStop
          ).toLocaleString()}) — stopping runner`
        );
        clearInterval(intervalId);
        newStatus.max_id_backfill = undefined;
      }
      await saveJSONAsync(pathToScriptsJson("status.json"), newStatus);
    } catch (e) {
      console.error("backfill >>> Canceling runner due to error:", e);
      clearInterval(intervalId);
    }
  };
  tick();
  intervalId = setInterval(tick, interval);
};

const init = async () => {
  ["unprocessed", "populated", "resolveQueue", "resolved"].forEach(
    async (file) => {
      await saveJSONAsync(pathToScriptsJson(`${file}.json`), []);
      console.log(`backfill > emptied queue ${file}.json`);
    }
  );
};

init();
fetchNew();
