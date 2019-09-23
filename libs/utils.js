const createFactory = ({providerFn, ...args}) => ({
  create: (...createArgs) => providerFn({
    ...args,
    ...createArgs
  }),
});

const getValue = (value) => typeof value === 'object' ? {...value} : value;

const deepMerge = (object, getFn = getValue) => {
  let result = {};

  switch (typeof object) {
    case 'object':
      for (const [key, value] of Object.entries(object)) {
        result[key] = deepMerge(
          getFn(value)
        );
      }
      break;
    // case 'function':
    //   result = deepMerge(
    //     getFn(
    //       object()
    //     )
    //   );
    //   break;
    default:
      result = getFn(
        object
      );
  }

  return result;
};



module.exports = {
  createFactory,
  deepMerge,
  getValue,
};
