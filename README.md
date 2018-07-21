# homebridge-sonoff-tasmota-http

This is a plugin for [homebridge](https://github.com/nfarina/homebridge) which makes it possible to control Sonoff Basic devices with [Tasmota](https://github.com/arendst/Sonoff-Tasmota) firmware through HTTP only

The Tasmota compatible version of the plugin is 5.11.0 and later

If you need compatibility with previous Tasmota versions, fork this commit: https://github.com/ageorgios/homebridge-sonoff-tasmota-http/tree/6f73a32fd8ae01f16813f8f0bd3844d3da469e4d

# Information
```
http://sonoff/cm?cmnd=Power
http://sonoff/cm?cmnd=Power%20On
http://sonoff/cm?cmnd=Power%20Off
```

## Example config

```json
{
  "accessory": "SonoffTasmotaHTTP",
  "name": "Sonoff",
  "devices": [
    {
      "name": "Sonoff",
      "hostname": "The hostname or local ip address of the Sonoff device"
    }
  ]
}
```

## Multiple Relays

```json
{
  "accessory": "SonoffTasmotaHTTP",
  "name": "Sonoff",
  "devices": [
    {
      "name": "Sonoff",
      "hostname": "The hostname or local ip address of the Sonoff device",
      "relay": "2"
    }
  ]
}
```

## Password specified in Web Interface

```json
{
  "accessory": "SonoffTasmotaHTTP",
  "name": "Sonoff",
  "devices": [
    {
      "name": "Sonoff",
      "hostname": "The hostname or local ip address of the Sonoff device",
      "password": "The password from the web interface"
    }
  ]
}
```
