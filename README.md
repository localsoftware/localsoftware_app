# localsoftware_website

> local code website

# Development

## Requirements
- **Docker** and **Docker Compose** are Installed.
- Install AWS Elastic Beanstalk [Install EB CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html), [Mac](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-osx.html)
- Stable internet connection.

## Nuxt Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).


## API Server
clone localcode software github [repository](https://github.com/localsoftware/localsoftware).

### Run
``` bash
$ docker-compose up
```

### pgAdmin Database management
open browser to [localhost:8084](http://localhost:8084)
 - the username could be changed in `/docker-compopse.yml` file
 - the database passworkd could be found in `/app/config.json` file

# Deployment

## AWS
- region: **Oregon**
- Console
    - [Elastic Beanstalk](https://us-west-2.console.aws.amazon.com/elasticbeanstalk/)
    - [ECR](https://us-west-2.console.aws.amazon.com/ecr/repositories)
    - [S3](https://s3.console.aws.amazon.com/s3/)
    - [EC2](https://ap-northeast-2.console.aws.amazon.com/ec2/v2/)
    - [VPC](https://ap-northeast-2.console.aws.amazon.com/vpc/)
    - [Route 53](https://console.aws.amazon.com/route53/)
    - [ACM](https://us-west-2.console.aws.amazon.com/acm/)

## Deploy
We are using AWS beanstalk service. check [Intro](https://aws.amazon.com/elasticbeanstalk/) and [Documentation](https://aws.amazon.com/elasticbeanstalk/developer-resources/).


### Run scripts to deploy

Build docker image and push to [ECR](https://us-west-2.console.aws.amazon.com/ecr/repositories)
``` bash
$ yarn push
```

Use `eb cli` to deploy the website to [Elastic Beanstalk](https://us-west-2.console.aws.amazon.com/elasticbeanstalk/)
``` bash
$ yarn deploy
```

## Beanstalk Setting (TODO)

We need set up 2 setting to deploy the site on Elastic Beanstalk service.

### Beanstalk Environment Configuration

init environment [EB_CLI] [How_to_Install_EB_CLI] 
``` bash
eb xxxxx
```

restart an eb env
``` bash
# get the env name list
eb list

# restart the specific env name
aws elasticbeanstalk restart-app-server --environment-name <EnvironmentName>
```

### Dockerrun for multi-containers application
Dockerrun.aws.json [Reference]()

## Firebase
We are only using [Firebase Auth](https://firebase.google.com/docs/auth) service to manage the SignUp/LogIn process.

### Available Settings
- Email Template [console](https://console.firebase.google.com/project/local-code/authentication/emails)
- Users [console](https://console.firebase.google.com/project/local-code/authentication/users)


# Resources
 - [Nuxt](https://nuxtjs.org)
 - [Antd UI](https://vue.ant.design)
 - [Vue](https://vuejs.org)
