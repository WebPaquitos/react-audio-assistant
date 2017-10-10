#### Disclaimer
This package is still in a pre-alpha release, so any issues, problems or doubts, let us know on our email or on this project issues.

# React Audio Assistant

This packages' purpose is to enable audio navigation and interaction in your website/webapp.

As Siri or Google Assistant is to the smartphone, so is this to the web.

This package is heavily dependent on [react-router-dom](https://reacttraining.com/react-router/web/guides/philosophy) (commonly known as react-router v4) and [API.ai](https://api.ai/).

An option to integrate with [redux](http://redux.js.org/) is also present.

## Instructions

1. The first step in the process is to create an account at [API.ai](https://api.ai/) and configure an agent suited for your website/webapp (more info at [Creating an API.ai Agent]()).
2. In order to use this package, a register is required in our backoffice page [here]() where you will provide us your access token for your API.ai setup.
3. After the register is done, an API key is provided to you with which you are going to make the authenticated requests to our server.
4. `npm i --save react-audio-assistant`
5. Import the component an use it where you want.

## Demo Project

A demo project is available at [DEMO]().

A simple use case:
```javascript
import React, { Component } from 'react';
import { ReactAudioAssistant } from 'react-audio-assistant';

export default class YourComponent extends Component {
    render() {
        return (
            <div>
                <p>This is a div with my custom component stuff</p>
                // The component is position: fixed, so you can place it where you want.
                <ReactAudioAssistant token={YOUR_ASSIGNED_TOKEN}/>
            </div>
        );
    }
}
```

## Creating an API.ai Agent

Head over to [API.ai](https://api.ai/) and create your account.

After this is done, create a new agent (which requires you to create a new project on google console too).

Now is the time to create an Intent. Intents are the building blocks of logic for our application navigation.

## License

MIT
