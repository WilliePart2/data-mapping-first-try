const registryMaps = {};

class BaseRegistry {
  constructor(registryKey) {
    if (registryMaps[registryKey]) {
      throw new Error(`Registry with such key already registered! Registry key: ${registryKey}`);
    }

    this.servicesMap = registryMaps[registryKey] = {};
  }

  set(serviceKey, serviceProvider) {
    this.servicesMap[serviceKey] = serviceProvider;
  }

  get(serviceKey) {
    if (!this.servicesMap[serviceKey]) {
      throw new Error(`App try to get service which is not registered. Service: ${serviceKey}`);
    }

    return this.servicesMap[serviceKey].getService();
  }
}

module.exports = BaseRegistry;
