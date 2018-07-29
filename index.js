const request = require('request');

const pluginName = 'homebridge-sonoff';
const platformName = 'Sonoff';

let Service;
let Characteristic;
let Accessory;
let UUIDGen;

function Sonoff(log, config, api) {
  const platform = this;
  platform.log = log;
  platform.accessories = [];
  platform.config = config;
  platform.config.devices = platform.config.devices || [];

  for (let i = 0; i < platform.config.devices.length; i += 1) {
    platform.config.devices[i] =
      platform.config.devices[i] || {};
    platform.config.devices[i].name =
      platform.config.devices[i].name || 'Sonoff';
    platform.config.devices[i].hostname =
      platform.config.devices[i].hostname || 'sonoff';
    platform.config.devices[i].relay =
      platform.config.devices[i].relay || '';
    platform.config.devices[i].password =
      platform.config.devices[i].password || '';
  }

  if (api) {
    platform.api = api;
    platform.api.on('didFinishLaunching', () => {
      platform.log('Cached accessories loaded.');
      if (platform.accessories.length < platform.config.devices.length) {
        for (let i = platform.platform.accessories.length;
          i < config.devices.length; i += 1) {
          platform.addAccessory(i);
        }
      }
    });
  }
}

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  Accessory = homebridge.platformAccessory;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerPlatform(pluginName, platformName, Sonoff, true);
};

Sonoff.prototype.addAccessory = function addAccessory(index) {
  const platform = this;

  const accessoryName = platform.config.devices[index].name;
  const accessory = new Accessory(accessoryName,
    UUIDGen.generate(accessoryName));

  accessory.context = { index };
  accessory.addService(Service.Outlet, accessoryName);

  platform.log(`Added ${accessoryName}`);
  platform.api.registerPlatformAccessories(pluginName, platformName,
    [accessory]);
  platform.configureAccessory(accessory);
};

/* eslint max-len: ["error", { "ignoreComments": true }] no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["accessory"] }] */
Sonoff.prototype.configureAccessory = function configureAccessory(accessory) {
  const platform = this;

  platform.accessories.push(accessory);

  const index = accessory.context.index;
  if (!platform.config.devices[index]) {
    platform.removeAccessory(accessory.displayName);
    return;
  }

  if (platform.config.devices[index].name !== accessory.displayName) {
    platform.removeAccessory(accessory.displayName);
    platform.addAccessory(index);
    return;
  }

  const config = platform.config.devices[index];
  accessory.context.relay = config.relay;
  accessory.context.hostname = config.hostname;
  accessory.context.url = `http://${config.hostname
    }/cm?user=admin&password=${config.password}&cmnd=Power${config.relay}`;

  accessory.getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, 'Sonoff')
    .setCharacteristic(Characteristic.Model, 'Basic')
    .setCharacteristic(Characteristic.SerialNumber, config.hostname);

  accessory.getService(Service.Outlet).getCharacteristic(Characteristic.On)
    .on('get', async (callback) => {
      const response = await platform.sendRequest(accessory.context.url);
      if (!response) {
        callback(new Error('Could not get state'));
        return;
      }

      callback(null,
        response[`POWER${accessory.context.relay}`] === 'ON' ? 1 : 0);
    })
    .on('set', async (toggle, callback) => {
      const response = await platform
        .sendRequest(`${accessory.context.url}%20${toggle ? 'On' : 'Off'}`);
      if (!response) {
        callback(new Error('Could not set state'));
        return;
      }

      callback();
    });

  platform.log(`Loaded accessory ${accessory.displayName}`);
};

Sonoff.prototype.removeAccessory = function removeAccessory(name) {
  const platform = this;

  platform.log(`Removing accessory ${name}`);
  const remainingAccessories = [];
  const removedAccessories = [];

  for (let i = 0; i < platform.accessories.length; i += 1) {
    if (platform.accessories[i].displayName === name) {
      removedAccessories.push(platform.accessories[i]);
    } else {
      remainingAccessories.push(platform.accessories[i]);
    }
  }

  if (removedAccessories.length > 0) {
    platform.api.unregisterPlatformAccessories(pluginName, platformName,
      removedAccessories);
    platform.accessories = remainingAccessories;
    platform.log(`${removedAccessories.length} accessories removed.`);
  }
};

Sonoff.prototype.sendRequest = function sendRequest(url) {
  return new Promise((resolve) => {
    request(url, (error, response) => {
      if (error) {
        resolve(false);
        return;
      }

      resolve(JSON.parse(response.body));
    });
  });
};

