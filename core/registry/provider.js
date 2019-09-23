/**
 * Good practice use providers as abstraction upon resource
 * It allow to use different goods as factories with enclosed arguments and others
 *
 * @param factory
 * @param value
 * @param sourceClass
 * @return {{getService(): (*|undefined)}}
 */

const provider = ({ factory, value, sourceClass }) => ({
  getService() {
    if (factory) {
      return factory.create();
    }
    if (value) {
      return value;
    }
    if (sourceClass) {
      return new sourceClass();
    }
  }
});

module.exports = provider;
