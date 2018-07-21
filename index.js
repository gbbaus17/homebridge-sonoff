let Service, Characteristic;
let request = require('request');

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-sonoff-tasmota-http', 'SonoffTasmotaHTTP', SonoffTasmotaHTTPAccessory);
}

function SonoffTasmotaHTTPAccessory(log, config) {
  const self = this;
  self.log = log;

  config['devices'] = config['devices'] || [];
  for (let i = 0; i < config['devices'].length; i++) {
    self.configureAccessory(config['devices'][i]);
  }
}

SonoffTasmotaHTTPAccessory.prototype.configureAccessory = function (config) {
  const self = this;
  const service = new Service.Outlet(config['name'] || 'Sonoff');
  service.getCharacteristic(Characteristic.On)
    .on('get', async (callback) => {
      const response = await self.sendRequest(service.url);
      if (!response) {
        callback(new Error('Could not get state'));
        return;
      }

      platform.log(`Get state: ${service.hostname}${service.relay ? `, Relay ${service.relay}` : ''}, Body: ${body}`);
      callback(null, response['POWER' + service.relay] === 'ON' ? 1 : 0);
    })
    .on('set', async (toggle, callback) => {
      const response = await self.sendRequest(`${service.url}%20${toggle ? 'On' : 'Off'}`);
      if (!response) {
        callback(new Error('Could not set state'));
        return;
      }

      platform.log(`Set state: ${service.hostname}${service.relay ? `, Relay ${service.relay}` : ''}, Body: ${body}`);
      callback();
    });

  service.name = config['name'] || 'Sonoff';
  service.relay = config['relay'] || '';
  service.hostname = config['hostname'] || 'sonoff';
  service.password = config['password'] || '';
  service.url = `http://${service.hostname}/cm?user=admin&password=${service.password}&cmnd=Power${service.relay}`;

  self.log('Sonoff Tasmota HTTP Initialized');
  self.services.push(service);
}

SonoffTasmotaHTTPAccessory.prototype.sendRequest = (url) => {
  return new Promise(resolve => {
    request(url, function (error, { }, body) {
      if (error) {
        resolve(false);
        return;
      }

      resolve(JSON.parse(body));
    });
  });
}

SonoffTasmotaHTTPAccessory.prototype.getServices = function () {
  return this.services;
}
