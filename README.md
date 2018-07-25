# homebridge-sonoff

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/homebridge-sonoff.svg
[npm-url]: https://www.npmjs.com/package/homebridge-sonoff

This is a plugin for [homebridge](https://github.com/nfarina/homebridge) which makes it possible to control Sonoff Basic devices with [Tasmota](https://github.com/arendst/Sonoff-Tasmota) firmware through HTTP only

The Tasmota compatible version of the plugin is 5.11.0 and later

![Demo](https://user-images.githubusercontent.com/13570439/43205164-09e198e8-9023-11e8-9e2d-22b4883ce28e.gif)

# Installation
```bash
npm i -g homebridge-sonoff
```

# Information
Used HTTP routes:
```
http://sonoff/cm?cmnd=Power
http://sonoff/cm?cmnd=Power%20On
http://sonoff/cm?cmnd=Power%20Off
```

## Example config

```json
{
  "platform": "Sonoff",
  "name": "Sonoff",
  "devices": [
    {
      "name": "Name of of the accessory",
      "hostname": "The hostname or local ip address of the Sonoff device"
    }
  ]
}
```

## Multiple Relays

```json
{
  "platform": "Sonoff",
  "name": "Sonoff",
  "devices": [
    {
      "name": "Name of of the accessory",
      "hostname": "The hostname or local ip address of the Sonoff device",
      "relay": "2"
    }
  ]
}
```

## Password specified in Web Interface

```json
{
  "platform": "Sonoff",
  "name": "Sonoff",
  "devices": [
    {
      "name": "Name of of the accessory",
      "hostname": "The hostname or local ip address of the Sonoff device",
      "password": "The password from the web interface"
    }
  ]
}
```
