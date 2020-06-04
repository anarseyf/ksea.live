# Working with Twitter API

https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=SeaFDIncidents

http://www2.seattle.gov/fire/realTime911/getRecsForDatePub.asp?action=Today&incDate=&rad1=des

## Install tools

```sh
brew install httpie # https://httpie.org
brew install jq # https://formulae.brew.sh/formula/jq
```

## Command-line with HTTPie

### Get key & secret from Developer portal

- https://developer.twitter.com/en/apps/17889032
- Keys & Tokens tab
- Copy API key & API secret key into `key.txt` and `secret.txt`

See [Twitter auth guide](https://developer.twitter.com/en/docs/basics/authentication/oauth-2-0/application-only) for details.

### Update bearer token for auth

```sh
echo -n $(cat key.txt):$(cat secret.txt) > combined.txt
base64 -in combined.txt > base64.txt
# make sure it ends in "==". If it ends in "o=" there was an extra newline in combined.txt

BASE64=$(cat consumer.base64.txt)

http --form --print=b POST https://api.twitter.com/oauth2/token Authorization:"Basic $BASE64" Content-Type:"application/x-www-form-urlencoded;charset=UTF-8" grant_type=client_credentials | jq --raw-output .access_token > ./twitterAPI/bearer.txt \
  | jq --raw-output .access_token \
  > bearer.txt

BEARER=$(cat bearer.txt)
```

### Fetch tweets

```sh
http --print=b https://api.twitter.com/1.1/statuses/user_timeline.json Authorization:"Bearer $BEARER" screen_name==SeaFDIncidents exclude_replies==true trim_user==true count==2 max_id==
```

`max_id` is `id_str` of most recent processed tweet. Returned tweets will be older than `max_id`. See [user_timeline API](https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline).
