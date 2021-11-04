# KSEA.live

Real-time visualization of Seattle Fire Department dispatch data.

https://ksea.live

## Local dev

```node
npm install

cd client
export NODE_OPTIONS=--openssl-legacy-provider # https://github.com/webpack/webpack/issues/14532#issuecomment-947012063

npm install

cd ..
npm app:dev

```

## Deploying to AWS

```node
npm build
```

- TODO

## Tech stack

- React
- AWS
  - Elastic Beanstalk
  - CloudFront
  - Lambda@Edge
  - Route 53

## Screenshots

- TODO

## Credits

Designed and developed by Anar Seyf in 2020.
