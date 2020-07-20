# Errors

On 2020-07-17 the background processes failed thusly:

```
Jul 17 11:44:47 ip-172-31-4-106 web: [1] [0] main > (7494ms), restarting in 90sec
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0] >> updateOnce >  started
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0] update > status {
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0]   update: { lastRun: '2020-07-17T11:44:42.611Z' },
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0]   split: { lastRun: '2020-07-17T11:44:43.483Z' }
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0] }
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0] update > most recent: 2020-07-17T00:00:00.000Z.json
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0] update > reading: /var/app/current/datasets/official/2020-07-17T00:00:00.000Z.json
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0] update > dates: [
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0]   2020-07-16T07:00:00.000Z,
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0]   2020-07-17T07:00:00.000Z,
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0]   2020-07-18T07:00:00.000Z
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0] ]
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0] update > date strings: [ '7/16/2020', '7/17/2020', '7/18/2020' ]
Jul 17 11:46:17 ip-172-31-4-106 web: [1] [0] >> scrapeDate > 7/16/2020
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] >> scrapeDate > 7/16/2020 rows:  270
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] >> scrapeDate > 7/16/2020 -> 270 (1347ms)
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] >> scrapeDate > 7/17/2020
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] >> scrapeDate > 7/17/2020 rows:  51
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] >> scrapeDate > 7/17/2020 -> 51 (500ms)
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] >> scrapeDate > 7/18/2020
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] >> scrapeDate > Warning: Cannot read property 'children' of null
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] update > 1914ms
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] combine > 321 --> 261 (55ms)
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] >> resolveLocally > resolved 246 out of 261
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] resolve > requesting 15 out of 15
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] resolve > IDs: F200069909,F200069592,F200069591,F200069590,F200069589,F200069588,F200069587,F200069586,F200069585,F200069583,F200069582,F200069581,F200069579,F200069580,F200069577
Jul 17 11:46:19 ip-172-31-4-106 web: [1] [0] resolve > 15 ids (URI length: 412)
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] >> cleanup unresolved > 397 -> 397
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] resolve > new totals: resolved: 261, unresolved: 397 (635ms)
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] nhoods > resolved in 57ms
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] split > split 261 entries across 2 files (8ms) :
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0]  [ '2020-07-17T00:00:00.000Z', '2020-07-16T00:00:00.000Z' ]
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] split > 104 entries to 2020-07-17T00:00:00.000Z
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] split > 157 entries to 2020-07-16T00:00:00.000Z
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] read 2 files: 104 total entries
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] read 2 files: 104 total entries
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] read 2 files: 104 total entries
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] read 2 files: 104 total entries
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] read 2 files: 104 total entries
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] read 2 files: 104 total entries
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] read 2 files: 354 total entries
Jul 17 11:46:20 ip-172-31-4-106 web: [1] [0] read 8 files: 1433 total entries
Jul 17 11:46:21 ip-172-31-4-106 web: [1] [0] read 732 files: 133641 total entries
Jul 17 11:46:23 ip-172-31-4-106 web: [1] [1] read 732 files: 133641 total entries
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] sh: line 1:  1985 Killed                  node -r esm main.js
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm ERR! code ELIFECYCLE
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm ERR! errno 137
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm ERR! scripts@0.2.0 update:loop: `cd official && node -r esm main.js`
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm ERR! Exit status 137
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm ERR!
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm ERR! Failed at the scripts@0.2.0 update:loop script.
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0]
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm ERR! A complete log of this run can be found in:
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm ERR!     /home/webapp/.npm/_logs/2020-07-17T11_52_37_906Z-debug.log
Jul 17 11:52:37 ip-172-31-4-106 web: [1] [0] npm run update:loop exited with code 137
Jul 17 11:52:40 ip-172-31-4-106 web: [1] [1] annotate > (377902ms)
Jul 17 11:52:40 ip-172-31-4-106 web: [1] [1] slowrunners > (377903ms), restarting in 3661.2sec
```
