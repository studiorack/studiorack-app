# studiorack-app

![Release](https://github.com/studiorack/studiorack-app/workflows/Release/badge.svg)

Audio plugin app, searchable list of plugins to install and share.

![StudioRack App](/screenshot.jpg)

## Installation

Navigate to GitHub Releases and find the latest download for your system:

    https://github.com/studiorack/studiorack-app/releases

Download the file and open to install the app on to your machine. Follow instructions within the app.

## Developer information

StudioRack App was built using:

- NodeJS 20.x
- TypeScript 5.x
- NextJS 14.x
- React 18.x
- Electron

## Installation

Install dependencies using:

    npm install

## Usage

Run the development server using:

    npm run dev

View the site at:

    http://localhost:3000

Get the api at:

    http://localhost:3000/api/plugins

## Deployment

Release an updated version on GitHub by simply creating a version tag:

    npm version patch
    git push && git push origin --tags

This will run an automated build and deploy process on GitHub Actions:

    .github/workflows/release.yml

## Contact

For more information please contact kmturley
