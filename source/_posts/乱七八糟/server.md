---
title: 云服务器上乱七八糟的应用
tags:
  - 乱七八糟
categories:
  - Geek
date: 2020-01-19 16:10:32
cover: thumbnails/78375860.png
---

{% pixiv 78375860 昼寝覚めたら夜になった catzz %}

域名备案批下来了，服务器是阿里云的 9.5r/mon

用这个搭了一些小服务，全程使用 docker。所有 `password/key/secret` 用 `QAQ` 替代

用 nginx 进行反向代理

<!-- more -->

### SSL

使用 [acme.sh](https://github.com/Neilpang/acme.sh) 管理

直接申请泛域名，详见 [Wiki](https://github.com/Neilpang/acme.sh/wiki/%E8%AF%B4%E6%98%8E)

### RSS

配合 [RSSHub](https://github.com/DIYgod/RSSHub) 使用

具体参见一站式解决方案 [Awesome-TTRSS](https://github.com/HenryQW/Awesome-TTRSS)

安卓客户端是 Readably（求推荐其他

```yaml
version: "3"
services:
  database.postgres:
    image: sameersbn/postgresql:latest
    container_name: postgres
    environment:
      - PG_PASSWORD=QAQ # please change the password
      - DB_EXTENSION=pg_trgm
    volumes:
      - ~/postgres/data/:/var/lib/postgresql/ # persist postgres data to ~/postgres/data/ on the host
    restart: always

  service.rss:
    image: wangqiru/ttrss:latest
    container_name: ttrss
    ports:
      - 181:80
    environment:
      - SELF_URL_PATH=https://rss.chaigidel.ink/ # please change to your own domain
      - DB_HOST=database.postgres
      - DB_PORT=5432
      - DB_NAME=ttrss
      - DB_USER=postgres
      - DB_PASS=QAQ # please change the password
      - ENABLE_PLUGINS=auth_internal,fever # auth_internal is required. Plugins enabled here will be enabled for all users as system plugins
    stdin_open: true
    tty: true
    restart: always
    command: sh -c 'sh /wait-for.sh database.postgres:5432 -- php /configure-db.php && exec s6-svscan /etc/s6/'

  service.mercury: # set Mercury Parser API endpoint to `service.mercury:3000` on TTRSS plugin setting page
    image: wangqiru/mercury-parser-api:latest
    container_name: mercury
    expose:
      - 3000
    restart: always

  service.opencc: # set OpenCC API endpoint to `service.opencc:3000` on TTRSS plugin setting page
    image: wangqiru/opencc-api-server:latest
    container_name: opencc
    environment:
      NODE_ENV: production
    expose:
      - 3000
    restart: always
```

### Aria2

这个要配合 nginx 和 nextcloud 使用

nginx 是为了保证 SSL 连接。nextcloud 是为了挂载外部存储

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
server {
    listen 80;
    server_name aria2.chaigidel.ink;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    gzip on;
    server_name aria2.chaigidel.ink;

    ssl on;
    ssl_certificate /etc/nginx/ssl/chaigidel.ink.fullchain.cer;
    ssl_certificate_key /etc/nginx/ssl/chaigidel.ink.key;
    location / {
        proxy_pass http://localhost:6880;
    }
    location /jsonrpc {
        proxy_pass http://localhost:6800/jsonrpc;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    }
}
```

```yaml
version: "3"

services:
  aria2:
    container_name: aria2
    image: xujinkai/aria2-with-webui
    ports:
      - "127.0.0.1:6800:6800"
      - "127.0.0.1:6880:80"
      - "6890-6999:6890-6999"
    volumes:
      - "/download:/data"
      - "/var/aria2/conf:/conf"
    environment:
      SECRET: "QAQ"
    restart: always
```

### Nextcloud

注意连接时 host 填 db，详见 [nextcloud/docker](https://github.com/nextcloud/docker)

```yaml
version: '2'

volumes:
  nextcloud:
  db:

services:
  db:
    image: mariadb
    command: --transaction-isolation=READ-COMMITTED --binlog-format=ROW
    restart: always
    volumes:
      - db:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=QAQ
      - MYSQL_PASSWORD=QAQ
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud

  app:
    image: nextcloud
    ports:
      - 127.0.0.1:8372:80
    links:
      - db
    volumes:
      - nextcloud:/var/www/html
      - /download:/aria2
    depends_on:
      - db
    restart: always
```

```nginx
upstream nextcloud {
        server 127.0.0.1:8372;
}
server {
    listen 80;
    server_name cloud.chaigidel.ink;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    gzip on;
    server_name cloud.chaigidel.ink;

    ssl on;
    ssl_certificate /etc/nginx/ssl/chaigidel.ink.fullchain.cer;
    ssl_certificate_key /etc/nginx/ssl/chaigidel.ink.key;


    location / {
        proxy_pass_header Authorization;
        proxy_pass http://nextcloud;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        client_max_body_size 0;
        proxy_read_timeout 36000s;
        proxy_redirect off;
        proxy_ssl_session_reuse off;
    }
}
```

### code-server

在线的 VS Code

```yaml
version: "3"

services:
  code-server:
    container_name: code-server
    image: codercom/code-server:v2
    ports:
      - "8445:8080"
    volumes:
      - "${HOME}/project:/home/coder/project"
      - "${HOME}/.local/share/code-server:/home/coder/.local/share/code-server"
    environment:
      PASSWORD: "QAQ"
    restart: always
    entrypoint: ["dumb-init", "code-server", "--host", "0.0.0.0", "--cert"]
```

### Gitea

参见 [Docs](https://docs.gitea.io/en-us/install-with-docker/)

### Drone CI

不是很懂为什么叫 drone-agent

具体参见 [Drone Docs](https://docs.drone.io/) 和 [这里](https://yeasy.gitbooks.io/docker_practice/cases/ci/drone/install.html)

```yaml
version: '3'

services:

  drone-server:
    image: drone/drone:1
    ports:
      - 127.0.0.1:3243:443
      - 127.0.0.1:3280:80
    volumes:
      - drone-data:/data:rw
    restart: always
    environment:
      - DRONE_AGENTS_ENABLED=true
      - DRONE_GITEA_SERVER=https://git.chaigidel.ink
      - DRONE_GITEA_CLIENT_ID=QAQ
      - DRONE_GITEA_CLIENT_SECRET=QWQ
      - DRONE_RPC_SECRET=QAQ
      - DRONE_SERVER_HOST=drone.chaigidel.ink
      - DRONE_SERVER_PROTO=https

  drone-agent:
    image: drone/drone-runner-docker:1
    restart: always
    depends_on:
      - drone-server
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:rw
    environment:
      - DRONE_RPC_PROTO=http
      - DRONE_RPC_HOST=drone-server
      - DRONE_RPC_SECRET=QAQ
      - DRONE_RUNNER_NAME=runner1
      - DRONE_RUNNER_CAPACITY=2

volumes:
  drone-data:
```
