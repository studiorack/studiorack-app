# studiorack-app
![Release](https://github.com/studiorack/studiorack-app/workflows/Release/badge.svg)

Audio plugin app, searchable list of plugins to install and share using:

* NodeJS 17.x
* TypeScript 4.x
* NextJS 12.x
* React 17.x
* Electron 15.x


## Installation

Install dependencies using:

    npm install


## Usage

Run the development server using:

    npm run dev

View the app in the application window opened automatically


## Deployment

Release an updated version on GitHub by simply creating a version tag:

    npm version patch
    git push && git push origin --tags

This will run an automated build and deploy process on GitHub Actions:

    .github/workflows/release.yml


## Contact

For more information please contact kmturley
