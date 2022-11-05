'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('./extends-023d783e.js');
var objectWithoutProperties = require('./objectWithoutProperties-c6d3675c.js');
var React = require('react');
var IconPropTypes = require('./IconPropTypes-b9997416.js');
require('./_commonjsHelpers-1b94f6bc.js');
require('./slicedToArray-a8a77f0e.js');
require('./unsupportedIterableToArray-f175acfa.js');
require('./index-c33eeeef.js');
require('./index-37353731.js');
require('./constants.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function IconWorld(_ref) {
  var size = _ref.size,
      props = objectWithoutProperties.objectWithoutProperties(_ref, ["size"]);

  var sizeValue = IconPropTypes.useIconSize(size);
  return /*#__PURE__*/React__default['default'].createElement("svg", _extends._extends_1({
    width: sizeValue,
    height: sizeValue,
    fill: "none",
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React__default['default'].createElement("path", {
    fill: "currentColor",
    d: "M17.657 6.343A7.947 7.947 0 0012 4a7.948 7.948 0 00-5.657 2.343A7.948 7.948 0 004 12c0 2.137.832 4.146 2.343 5.657A7.948 7.948 0 0012 20a7.948 7.948 0 005.657-2.343A7.948 7.948 0 0020 12a7.948 7.948 0 00-2.343-5.657zM12 18.707A6.715 6.715 0 015.293 12 6.715 6.715 0 0112 5.293 6.715 6.715 0 0118.707 12 6.715 6.715 0 0112 18.707z"
  }), /*#__PURE__*/React__default['default'].createElement("path", {
    fill: "currentColor",
    d: "M19.354 11.354H4.646a.646.646 0 100 1.292h14.708a.646.646 0 100-1.292z"
  }), /*#__PURE__*/React__default['default'].createElement("path", {
    fill: "currentColor",
    d: "M12.477 4.21a.646.646 0 00-.954 0 11.893 11.893 0 00-3.11 7.804 11.893 11.893 0 003.11 7.776.646.646 0 00.954 0 11.893 11.893 0 003.11-7.803 11.894 11.894 0 00-3.11-7.777zM12 18.358A10.6 10.6 0 019.705 12c.051-2.32.86-4.55 2.295-6.358A10.601 10.601 0 0114.295 12 10.6 10.6 0 0112 18.358z"
  }));
}

IconWorld.propTypes = IconPropTypes.IconPropTypes;

exports.default = IconWorld;
//# sourceMappingURL=IconWorld.js.map
