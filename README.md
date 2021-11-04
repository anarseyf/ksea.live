# KSEA.live

Real-time visualization of Seattle Fire Department dispatch data.

https://ksea.live

## Local dev

Environment:

- `nvm`
- `node 16`

Dependencies:

```sh
# TODO — turn into an npm script

npm install

cd client
export NODE_OPTIONS=--openssl-legacy-provider # https://github.com/webpack/webpack/issues/14532#issuecomment-947012063

npm install

cd ../scripts/dispatch
npm install
```

Run dev build (deploys at http://http://localhost:3000/):

- `npm run app:dev` Runs all three components (client, server, background tasks)
- `npm run static:dev` Runs client and server
- `npm run update:once` Runs background tasks once (scraper, aggregates, cache)
  - a good option is to run this before running `static:dev`

Run prod build (deploys at http://localhost:3001/):

- `npm start`

## Deploying to AWS

- (optional) Increment version in `package.json`
- `npm run bundle:aws`. This creates a .zip file in the project root directory.
- Login to [AWS Console](https://console.aws.amazon.com/)
- Open [Elastic Beanstalk](https://us-west-2.console.aws.amazon.com/elasticbeanstalk/)
- Open the app's environment
- Click "Upload and Deploy"
- Upload the .zip file created above.

## How it works (TODO)

### 1. Server

Location: project root (`/`)

### 2. Client

Location: `/client`

### 3. Background tasks

Location: `/scripts/dispatch`

## Tech stack

- React + [create-react-app](https://create-react-app.dev/) (not ejected)
- Node.js
- [D3.js](https://d3js.org/) — for building visualizations and data manipulation
- AWS
  - Elastic Beanstalk
  - CloudFront
  - Lambda@Edge
  - Route 53
- MongoDB (currently used only for storing scraped incidents, not retrieval)

## Notes

- Originally this was implemented by integrating with the [Twitter API](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/overview) and fetching the posts by the Seattle Fire Dept account. But it carries a limitation of only providing the 3,200 most recent tweets—not enough to build the annual aggregates. I then switched to scraping the main 911 page.

- Scraped incidents are stored in JSON files under `/datasets/official`, as well as in MongoDB via mongoose (see the `database.js` script). But currently MongoDB is not used for reading at all.

## Screenshots

- TODO

## Credits

Designed and developed by Anar Seyf in 2020.
