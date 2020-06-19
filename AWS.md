# AWS

The app is deployed on AWS [Elastic Beanstalk](aws.amazon.com/elasticbeanstalk/).

## Elastic Beanstalk CLI

### Installation

Only [manual install](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-osx.html) worked for me on macOS Catalina 10.15.

```sh
$ eb init # from project root
```

### App deployment

```sh
$ git add . && git commit -m "AWS deploy"
$ npm run build # creates minified files in client/build
$ eb deploy # creates a .zip bundle based on git HEAD
```

### Route 53

The domain is registered via Route 53 and points to the Beanstalk environment.

### CloudFront

TBD.

## Deployment notes

As of June 2020 AWS provides a Node.js v12 environment (12.9.1 highest supported).

I had to remove the engines declaration from `package.json`:

```sh
"engines": {
  "node": ">=12.9.0",
  "npm": ">=6.4"
}
```

The error log lists all supported versions of Node, but even choosing an exact one from the list doesn't work.
