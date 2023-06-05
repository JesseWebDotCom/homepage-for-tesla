![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/src/logo.png)

A self hosted, personal homepage for use inside your Tesla - organize your favorite bookmarks and launch them in fullscreen (automatically dimming your Tesla's interior and exterior lights).

![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_1.png) 

<a href="https://www.paypal.com/donate/?hosted_button_id=XQMVL329W7M32" rel="noopener noreferrer"><img alt=donate src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"></a>

Github Repo: [https://github.com/JesseWebDotCom/homepage-for-tesla](https://github.com/JesseWebDotCom/homepage-for-tesla)

Personal Website: [https://jesseweb.com/self-hosting/homepage-for-tesla](https://jesseweb.com/self-hosting/homepage-for-tesla)

## About

Only Tesla native apps (ex. Netflix) open in fullscreen and dim your car's interior and exterior lighting (perfectly setting the mood for media viewing). So what if you wanted to do the same for other sites? `Homepage` can open any site (ex. Prime Video, Disney+, etc) and safely trick the Tesla into opening fullscreen and dim the lights. While there are several great non-self hosted solutions that utilize the same trick (ex. [testube.app](https://testube.app), [abettertheater.com](https://abettertheater.com), [fullscreentesla.com](https://fullscreentesla.com)), `Homepage` gives you privacy and control (plus some enhancements) that only a self hosted solution can provide.

## Features

- **Fullscreen!** Launch any bookmark in fullscreen (automatically dimming your Tesla's interior and exterior lights).
- **Personal!** All your favorite bookmarks in one place.
- **Private!** Keep the bookmarks you visit private.
- **Organized!** Organize your bookmarks into categories.
- **Themeable!** Pick from a preconfigured theme or configure your own.
- bookmarks can be horizontally scrolled per category
- Current date/time displayed

## Getting Started

To get started, you'll need:
* somewhere to run this app (ex. Pi, NUC, etc)
* docker (and preferably docker compose)
* securely and publically exposing this app

### Publically Exposing Homepage
The Tesla in car web browser can only access publically exposed sites (i.e. no local IP addresses). So you'll need
to publically expose `Homepage`. While setting this up is out of scope for these instructions, I have included a [docker compose example](#expanded-example-using-docker-compose) below that uses a socket proxy, HTTPS, custom domain, and Traefik.

If you are unable to publically expose / self host this app, I recommend using any of the following non-self hosted solutions:
* [testube.app](https://testube.app), [abettertheater.com](https://abettertheater.com), [fullscreentesla.com](https://fullscreentesla.com)

### Run with Docker

This project is available as a docker container on [Docker Hub](https://hub.docker.com/repository/docker/jessewebdotcom/homepage-for-tesla/general).

#### Docker Parameters

You will need to set the correct parameters for your setup:

| Parameter                                | Function                                                                                                                                                                                                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-v /path/to/bookmarks.json:/app/public/bookmarks.json` | (required) Volume mount for bookmarks file. You can use the one in this repo to get started. |
| `-v /path/to/images:/app/public/images` | (optional) Volume mount for images folder for any local bookmark images. |
| `-e DEFAULT_THEME="1"`        | (optional, default=1) Sets the look and feel to one of the availble [themes](#themes) (ex. `DEFAULT_THEME=7` sets the theme to **[Theme 7](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_7.png)**). Set to "0" to customize your own theme.                      |
| `-e BOOKMARK_HEGHT="150"`        | (optional, default=150) Only applicable when DEFAULT_THEME=0. Sets the pixel height of the bookmark image.                      |
| `-e BOOKMARK_PADDING="15"`        | (optional, default=15) Only applicable when DEFAULT_THEME=0. Sets the pixel padding between bookmark images.                      |
| `-e BOOKMARK_RADIUS="24"`        | (optional, default=24) Only applicable when DEFAULT_THEME=0. Sets the pixel rouding of the bookmark image.                      |
| `-e BOOKMARK_WIDTH="150"`        | (optional, default=150) Only applicable when DEFAULT_THEME=0. Sets the pixel width of the bookmark image.                      |
| `-e SHOW_CATEGORIES="1"`        | (optional, default=1) Only applicable when DEFAULT_THEME=0. Shows the category name. Set to "0" to hide the category name.                      |
| `-e SHOW_NAMES="1"`        | (optional, default=1) Only applicable when DEFAULT_THEME=0. Shows the bookmark name. Set to "0" to hide the bookmark name.                      |
| `-p 3000:3000`                             | (optional, default=3000) Expose the UI via the selected port (in this case `3000`). Change the left value to the port of your choosing.                                                                                             |

##### Minimal example running directly with docker

```bash
docker run \
  -v /path/to/bookmarks.json:/app/public/bookmarks.json \
  jessewebdotcom/homepage-for-tesla:latest
```

##### Minimal example using Docker Compose

```yaml
version: '3'
services:
  app:
    image: jessewebdotcom/homepage-for-tesla:latest
    volumes:
      - /path/to/bookmarks.json:/app/public/bookmarks.json
```

##### Expanded example using Docker Compose

Here is an expanded docker compose example that:
* adds the container to the `socket_proxy` network (change to your desired network)
* adds Traefik labels to HTTPS access this app through a domain (with a basic auth username and password) - assuming you have HTTPS, a domain, and Traefik configured
* selects theme 1
* maps public/images and public/bookmarks.json to local volumes

```yaml
version: '3'

networks:
  socket_proxy:
    name: socket_proxy
    external: true

services:
  homepage-for-tesla:
    image: jessewebdotcom/homepage-for-tesla:latest
    container_name: homepage-for-tesla
    hostname: homepage-for-tesla
    networks:
      - socket_proxy
    environment:
      - DEFAULT_THEME=1
    volumes:
      - /path/to/bookmarks.json:/app/public/bookmarks.json
      - /path/to/images:/app/public/images
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.tesla-rtr.entrypoints=https"
      - "traefik.http.routers.tesla-rtr.rule=Host(`YOUR_DOMAIN`)"
      - "traefik.http.routers.tesla-rtr.tls=true"
      - "traefik.http.routers.tesla-rtr.middlewares=auth"
      - "traefik.http.middlewares.auth.basicauth.users=YOUR_USERNAME:YOUR_HASHED_PASSWORD"
      - "traefik.http.routers.tesla-rtr.service=tesla-svc"
      - "traefik.http.services.tesla-svc.loadbalancer.server.port=3000"
```

***Note***
You can use [this site](https://bcrypt-generator.com) to create a hashed password (just remember to double up any $ signs for docker compose compatibility).

#### Build an image from scratch

If you want to build your own image from source code, clone [this repo](https://github.com/JesseWebDotCom/homepage-for-tesla) and then run the following:

```bash
docker build -t homepage-for-tesla .
```

## Usage

Open your car's browser and navigate to `Homepage's` publically accessible domain name (ex. homepage.example.com).

if you have a lot of bookmarks per category, you swipe on the bookmarks to scroll horizontally.
If you have more categories and bookmarks than can fit on the screen, you can swipe up and down.

## Going Fullscreen

To go fullscreen and intiate the fullscreen trick (browser opens fullscreen, lights dim), just tap on any bookmark.

A Youtube window will display, just click `GO TO SITE` and that's it.

## Bookmarks

Your bookmarks are stored in [/app/public/bookmarks.json](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/public/bookmarks.json) and there are a tons of examples included to get you started. Here's a breakdown of a `bookmark` key:

| Key | Description |
| -------- | ------- |
| name | (required) name shown under the bookmark image |
| url | (required) link to bookmark's website |
| image | (required) image to display |
| background | (optional) background behind the image |
| border | (optional) border around the image |

`image` can be a remote url (ex. https://example.com/image.png) or a data URI (ex. data:image/png;base64,SOME_JUNK).
It can also be a relative url to a local imges (ex. /images/plex.png) - where you have uploaded `plex.png` to `/app/public/images` inside the conatiner. For realiability, privacy, and performance, you are better off using local images.

`background` is useful for transparent images (ex. 'white' which displays a white background). The value here can be anything valid for the CSS background property (ex. white).

`border` is useful for dark images (ex. a white border makes it easier to see the image boundary). The value here can be anything valid for the CSS border property (ex. "1px solid white").

## Themes
| ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_1.png) **[Theme 1](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_1.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_2.png) **[Theme 2](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_2.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_3.png) **[Theme 3](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_3.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_4.png) **[Theme 4](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_4.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_5.png) **[Theme 5](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_5.png)**  |
|:-:|:-:|:-:|:-:|:-:|
| ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_6.png) **[Theme 6](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_6.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_7.png) **[Theme 7](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_7.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_8.png) **[Theme 8](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_8.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_9.png) **[Theme 9](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_9.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_10.png) **[Theme 10](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_10.png)**  |
| ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_11.png) **[Theme 11](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_11.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_12.png) **[Theme 12](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_12.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_13.png) **[Theme 13](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_13.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_14.png) **[Theme 14](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_14.png)**  | ![](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_15.png) **[Theme 15](https://github.com/JesseWebDotCom/homepage-for-tesla/raw/main/docs/images/themes/theme_15.png)**  |

## Credits
Thanks and credit to the following non-self hosted solutions:
* [testube.app](https://testube.app), [abettertheater.com](https://abettertheater.com), [fullscreentesla.com](https://fullscreentesla.com)