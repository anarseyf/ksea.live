# Errors

## 2020-08-01

```
Aug  1 20:33:26 ip-172-31-4-106 web: [1] main > (7111ms), restarting in 60sec
Aug  1 20:34:26 ip-172-31-4-106 web: [1] main > memory usage: pid: 12047, title: node
Aug  1 20:34:26 ip-172-31-4-106 web: [1] #011rss 151.18 MB
Aug  1 20:34:26 ip-172-31-4-106 web: [1] #011heapTotal 62.76 MB
Aug  1 20:34:26 ip-172-31-4-106 web: [1] #011heapUsed 56.87 MB
Aug  1 20:34:26 ip-172-31-4-106 web: [1] #011external 22.42 MB
Aug  1 20:34:26 ip-172-31-4-106 web: [1] #011arrayBuffers 20.52 MB
Aug  1 20:34:26 ip-172-31-4-106 web: [1] >> updateOnce >  started
Aug  1 20:34:26 ip-172-31-4-106 web: [1] update > status {
Aug  1 20:34:26 ip-172-31-4-106 web: [1]   update: { lastRun: '2020-08-01T20:33:21.328Z' },
Aug  1 20:34:26 ip-172-31-4-106 web: [1]   split: { lastRun: '2020-08-01T20:33:22.186Z' }
Aug  1 20:34:26 ip-172-31-4-106 web: [1] }
Aug  1 20:34:26 ip-172-31-4-106 web: [1] update > most recent: 2020-08-01T00:00:00.000Z.json
Aug  1 20:34:26 ip-172-31-4-106 web: [1] update > reading: /var/app/current/datasets/official/2020-08-01T00:00:00.000Z.json
Aug  1 20:34:26 ip-172-31-4-106 web: [1] update > dates: [
Aug  1 20:34:26 ip-172-31-4-106 web: [1]   2020-07-31T07:00:00.000Z,
Aug  1 20:34:26 ip-172-31-4-106 web: [1]   2020-08-01T07:00:00.000Z,
Aug  1 20:34:26 ip-172-31-4-106 web: [1]   2020-08-02T07:00:00.000Z
Aug  1 20:34:26 ip-172-31-4-106 web: [1] ]
Aug  1 20:34:26 ip-172-31-4-106 web: [1] update > date strings: [ '7/31/2020', '8/1/2020', '8/2/2020' ]
Aug  1 20:34:26 ip-172-31-4-106 web: [1] >> scrapeDate > 7/31/2020
Aug  1 20:34:27 ip-172-31-4-106 web: [1] >> scrapeDate > 7/31/2020 rows:  302
Aug  1 20:34:27 ip-172-31-4-106 web: [1] >> scrapeDate > 7/31/2020 -> 302 (1403ms)
Aug  1 20:34:27 ip-172-31-4-106 web: [1] >> scrapeDate > 8/1/2020
Aug  1 20:34:28 ip-172-31-4-106 web: [1] >> scrapeDate > 8/1/2020 rows:  121
Aug  1 20:34:28 ip-172-31-4-106 web: [1] >> scrapeDate > 8/1/2020 -> 121 (607ms)
Aug  1 20:34:28 ip-172-31-4-106 web: [1] >> scrapeDate > 8/2/2020
Aug  1 20:34:28 ip-172-31-4-106 web: [1] >> scrapeDate > Warning: Cannot read property 'children' of null
Aug  1 20:34:28 ip-172-31-4-106 web: [1] update > 2079ms
Aug  1 20:34:28 ip-172-31-4-106 web: [1] combine > 423 --> 348 (85ms)
Aug  1 20:34:28 ip-172-31-4-106 web: [1] database > downloaded 347 entries in 0.208 sec
Aug  1 20:34:28 ip-172-31-4-106 web: [1] >> resolveLocally > resolved 347 out of 348
Aug  1 20:34:28 ip-172-31-4-106 web: [1] resolve > requesting 1 out of 1
Aug  1 20:34:28 ip-172-31-4-106 web: [1] resolve > IDs: F200075589
Aug  1 20:34:28 ip-172-31-4-106 web: [1] resolve > 1 ids (URI length: 174)
Aug  1 20:34:28 ip-172-31-4-106 web: [1] data.seattle.gov call failed: Error: getaddrinfo ENOTFOUND data.seattle.gov
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:66:26) {
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   errno: 'ENOTFOUND',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   code: 'ENOTFOUND',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   syscall: 'getaddrinfo',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   hostname: 'data.seattle.gov',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   config: {
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     url: 'https://data.seattle.gov/resource/fire-911.json?$$app_token=DvY4gobAudCWKcwYz3yqTd25h&$select=incident_number,latitude,longitude&$where=incident_number%20in(%22F200075589%22)',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     method: 'get',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     headers: {
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       Accept: 'application/json, text/plain, */*',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       'User-Agent': 'axios/0.19.2'
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     },
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     transformRequest: [ [Function: transformRequest] ],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     transformResponse: [ [Function: transformResponse] ],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     timeout: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     adapter: [Function: httpAdapter],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     xsrfCookieName: 'XSRF-TOKEN',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     xsrfHeaderName: 'X-XSRF-TOKEN',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     maxContentLength: -1,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     validateStatus: [Function: validateStatus],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     data: undefined
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   },
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   request: Writable {
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _writableState: WritableState {
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       objectMode: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       highWaterMark: 16384,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       finalCalled: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       needDrain: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       ending: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       ended: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       finished: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       destroyed: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       decodeStrings: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       defaultEncoding: 'utf8',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       length: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       writing: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       corked: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       sync: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       bufferProcessing: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       onwrite: [Function: bound onwrite],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       writecb: null,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       writelen: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       afterWriteTickInfo: null,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       bufferedRequest: null,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       lastBufferedRequest: null,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       pendingcb: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       prefinished: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       errorEmitted: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       emitClose: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       autoDestroy: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       bufferedRequestCount: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       corkedRequestsFree: [Object]
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     },
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     writable: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _events: [Object: null prototype] {
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       response: [Function: handleResponse],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       error: [Function: handleRequestError]
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     },
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _eventsCount: 2,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _maxListeners: undefined,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _options: {
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       protocol: 'https:',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       maxRedirects: 21,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       maxBodyLength: 10485760,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       path: '/resource/fire-911.json?$$app_token=DvY4gobAudCWKcwYz3yqTd25h&$select=incident_number,latitude,longitude&$where=incident_number%20in(%22F200075589%22)',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       method: 'GET',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       headers: [Object],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       agent: undefined,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       agents: [Object],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       auth: undefined,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       hostname: 'data.seattle.gov',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       port: null,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       nativeProtocols: [Object],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       pathname: '/resource/fire-911.json',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       search: '?$$app_token=DvY4gobAudCWKcwYz3yqTd25h&$select=incident_number,latitude,longitude&$where=incident_number%20in(%22F200075589%22)'
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     },
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _redirectCount: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _redirects: [],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _requestBodyLength: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _requestBodyBuffers: [],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _onNativeResponse: [Function],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _currentRequest: ClientRequest {
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _events: [Object: null prototype],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _eventsCount: 6,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _maxListeners: undefined,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       outputData: [],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       outputSize: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       writable: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _last: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       chunkedEncoding: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       shouldKeepAlive: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       useChunkedEncodingByDefault: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       sendDate: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _removedConnection: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _removedContLen: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _removedTE: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _contentLength: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _hasBody: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _trailer: '',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       finished: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _headerSent: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       socket: [TLSSocket],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       connection: [TLSSocket],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _header: 'GET /resource/fire-911.json?$$app_token=DvY4gobAudCWKcwYz3yqTd25h&$select=incident_number,latitude,longitude&$where=incident_number%20in(%22F200075589%22) HTTP/1.1\r\n' +
Aug  1 20:34:28 ip-172-31-4-106 web: [1]         'Accept: application/json, text/plain, */*\r\n' +
Aug  1 20:34:28 ip-172-31-4-106 web: [1]         'User-Agent: axios/0.19.2\r\n' +
Aug  1 20:34:28 ip-172-31-4-106 web: [1]         'Host: data.seattle.gov\r\n' +
Aug  1 20:34:28 ip-172-31-4-106 web: [1]         'Connection: close\r\n' +
Aug  1 20:34:28 ip-172-31-4-106 web: [1]         '\r\n',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _onPendingData: [Function: noopPendingOutput],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       agent: [Agent],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       socketPath: undefined,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       method: 'GET',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       insecureHTTPParser: undefined,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       path: '/resource/fire-911.json?$$app_token=DvY4gobAudCWKcwYz3yqTd25h&$select=incident_number,latitude,longitude&$where=incident_number%20in(%22F200075589%22)',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _ended: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       res: null,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       aborted: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       timeoutCb: null,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       upgradeOrConnect: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       parser: null,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       maxHeadersCount: null,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       reusedSocket: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       _redirectable: [Circular],
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       [Symbol(kCapture)]: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       [Symbol(kNeedDrain)]: false,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       [Symbol(corked)]: 0,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]       [Symbol(kOutHeaders)]: [Object: null prototype]
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     },
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     _currentUrl: 'https://data.seattle.gov/resource/fire-911.json?$$app_token=DvY4gobAudCWKcwYz3yqTd25h&$select=incident_number,latitude,longitude&$where=incident_number%20in(%22F200075589%22)',
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     [Symbol(kCapture)]: false
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   },
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   response: undefined,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   isAxiosError: true,
Aug  1 20:34:28 ip-172-31-4-106 web: [1]   toJSON: [Function]
Aug  1 20:34:28 ip-172-31-4-106 web: [1] } Error: getaddrinfo ENOTFOUND data.seattle.gov
Aug  1 20:34:28 ip-172-31-4-106 web: [1]     at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:66:26)
Aug  1 20:34:28 ip-172-31-4-106 web: [1] resolve >>> stopped due to error: getaddrinfo ENOTFOUND data.seattle.gov
Aug  1 20:34:28 ip-172-31-4-106 web: [1] main >>> stopped due to error: nhoods > No source file provided
Aug  1 20:34:28 ip-172-31-4-106 web: [1] npm run backgroundTasks exited with code 0
```

## 2020-07-17

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
