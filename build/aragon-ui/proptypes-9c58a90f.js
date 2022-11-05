'use strict';

var index = require('./index-46d0e707.js');
var defineProperty = require('./defineProperty-3cad0327.js');

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty.defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var VALID_INTEGER_REGEX = /^[-+]?[0-9]+$/; // Check if a value is “empty”, in the prop-types sense (null or undefined)

function isEmpty(value) {
  return value === undefined || value === null;
} // Require a prop to not be empty


function requireProp(props, propName, componentName) {
  return isEmpty(props[propName]) ? new Error("The prop `".concat(propName, "` is required for `").concat(componentName, "`.")) : null;
} // Create the `isRequired` version of a prop type


function createIsRequired(propTypeFn) {
  return function () {
    return requireProp.apply(void 0, arguments) || propTypeFn.apply(void 0, arguments);
  };
} // Accept any number in the 0 => 1 range


function _0to1(props, propName, componentName) {
  if (isEmpty(props[propName])) {
    return null;
  }

  if (typeof props[propName] === 'number' && props[propName] >= 0 && props[propName] <= 1) {
    return null;
  }

  return new Error("Invalid prop `".concat(propName, "` supplied to `").concat(componentName, "`. Please provide a number in the 0-1 range."));
}

_0to1.isRequired = createIsRequired(_0to1); // Accept DOM Element, in DOM environments

function _element(props, propName, componentName) {
  if (!props[propName]) {
    return null;
  }

  if (typeof Element !== 'undefined') {
    return props[propName] instanceof Element ? null : new Error("Invalid prop `".concat(propName, "` supplied to `").concat(componentName, "`. Please provide a DOM Element."));
  }

  return null;
}

_element.isRequired = createIsRequired(_element);

function _bigIntish(props, propName, componentName) {
  if (isEmpty(props[propName])) {
    return null;
  }

  if (typeof props[propName] === 'number') {
    return null;
  }

  if (typeof props[propName] === 'bigint') {
    return null;
  }

  if (VALID_INTEGER_REGEX.test(String(props[propName]))) {
    return null;
  }

  return new Error("Invalid prop `".concat(propName, "` supplied to `").concat(componentName, "`. Please provide a BigInt, Number or a value that can convert into a BigInt-like string."));
}

_bigIntish.isRequired = createIsRequired(_bigIntish);

var ExtendedPropTypes = _objectSpread(_objectSpread({}, index.propTypes), {}, {
  _bigIntish: _bigIntish,
  _component: index.propTypes.oneOfType([index.propTypes.func, index.propTypes.string, index.propTypes.shape({
    render: index.propTypes.func.isRequired
  })]),
  _spring: index.propTypes.shape({
    mass: index.propTypes.number,
    tension: index.propTypes.number,
    friction: index.propTypes.number,
    precision: index.propTypes.number
  }),
  _null: index.propTypes.oneOf([null]),
  _0to1: _0to1,
  _element: _element
});

exports.ExtendedPropTypes = ExtendedPropTypes;
//# sourceMappingURL=proptypes-9c58a90f.js.map
