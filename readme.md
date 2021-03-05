<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/ericellb/homeassisant-mqtt-client">
    <img src="images/home_assistant.png" alt="Logo" width="120" height="120">
  </a>
  </br>
  <a href="https://github.com/ericellb/homeassisant-mqtt-client">
    <img src="images/mqtt.png" alt="Logo" width="400" height="80">
  </a>
  <p align="center">
    NodeJS <a href="https://mqtt.org/">MQTT</a> Client built to use with <a href="https://www.home-assistant.io/">Home Assisant</a> to add automation to your computer.
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

TODO

### Built With

- TypeScript (NodeJS)
- MQTT

<!-- GETTING STARTED -->

## Getting Started

Download the latest release.

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

### Installation (for contributers)

### Prerequisites

This is an example of how to list things you need to use the contribute and how to install them.

- [mqtt broker (mosquitto)](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-the-mosquitto-mqtt-messaging-broker-on-ubuntu-16-04)
- [AudioCmdlets (OPTIONAL)](https://github.com/frgnca/AudioDeviceCmdlets)
  - Required to use any of the audioCmdlets build in commands
    - Change Sound Devices
    - Control Volume
    - Change mute state

1. Clone the repo

   ```
   git clone https://github.com/ericellb/homeassisant-mqtt-client
   ```

2. Install deps
   ```
   yarn install OR npm install
   ```
3. Create your .env file
   ```ts
   // EXAMPLE ENV FILE
   MQTT_URL = 'mqtt://192.168.0.3:1883';
   MQTT_USERNAME = 'your_username';
   MQTT_PASSWORD = 'your_password';
   ```

### Installation (for users)

1. Download the release
2. Add the homeassistant-mqtt-client.exe to windows startup folder
3. Add the included VBS script that will autorun the exe
4. Run the cli-integration-adder to add new custom integrations
5. Start the homeassistant-mqtt-client (will auto start on next startup)
6. Profit!

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See [LICENSE](https://github.com/ericellb/homeassisant-mqtt-client/blob/master/LICENSE) for more information.

<!-- CONTACT -->

## Contributers

Eric Ellbogen - ericellb@gmail.com

Project Link: [https://github.com/ericellb/homeassisant-mqtt-client](https://github.com/ericellb/homeassisant-mqtt-client)
