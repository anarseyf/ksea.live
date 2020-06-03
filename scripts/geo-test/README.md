## Working with Twitter API

https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=SeaFDIncidents

http://www2.seattle.gov/fire/realTime911/getRecsForDatePub.asp?action=Today&incDate=&rad1=des

### Install tools

```sh
brew install httpie # https://httpie.org
brew install jq # https://formulae.brew.sh/formula/jq
```

### Command-line with HTTPie

```sh
BASE64=$(cat consumer.base64.txt)

http --form --print=b POST https://api.twitter.com/oauth2/token Authorization:"Basic $BASE64" Content-Type:"application/x-www-form-urlencoded;charset=UTF-8" grant_type=client_credentials | jq --raw-output .access_token > ./twitterAPI/bearer.txt \
  | jq --raw-output .access_token \
  > bearer.txt

BEARER=$(cat bearer.txt)
```

### Fetch tweets

`max_id` is `id_str` of most recent processed tweet. Returned tweets will be older than `max_id`. See [user_timeline API](https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline).

```sh
http --print=b https://api.twitter.com/1.1/statuses/user_timeline.json Authorization:"Bearer $BEARER" screen_name==SeaFDIncidents exclude_replies==true trim_user==true count==2 max_id==
```
