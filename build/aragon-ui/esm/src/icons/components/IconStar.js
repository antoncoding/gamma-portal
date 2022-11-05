import _extends_1 from '../../../node_modules/@babel/runtime/helpers/extends.js';
import objectWithoutProperties from '../../../node_modules/@babel/runtime/helpers/objectWithoutProperties.js';
import React from 'react';
import useIconSize from '../icon-size.js';
import IconPropTypes from '../IconPropTypes.js';

function IconStar(_ref) {
  var size = _ref.size,
      props = objectWithoutProperties(_ref, ["size"]);

  var sizeValue = useIconSize(size);
  return /*#__PURE__*/React.createElement("svg", _extends_1({
    width: sizeValue,
    height: sizeValue,
    fill: "none",
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M19.968 10.066a.656.656 0 00-.52-.46l-4.746-.727-2.122-4.502A.644.644 0 0012 4a.644.644 0 00-.58.377L9.299 8.88l-4.745.726a.655.655 0 00-.521.461.7.7 0 00.163.694l3.434 3.502-.81 4.947a.692.692 0 00.257.662.622.622 0 00.68.051L12 17.585l4.244 2.337a.622.622 0 00.68-.051.692.692 0 00.258-.662l-.81-4.947 3.433-3.502a.7.7 0 00.163-.694zm-4.742 3.474a.697.697 0 00-.186.6l.646 3.946-3.385-1.864a.622.622 0 00-.602 0l-3.385 1.864.646-3.946a.697.697 0 00-.186-.6l-2.74-2.793 3.787-.58a.65.65 0 00.486-.37L12 6.206l1.693 3.59a.65.65 0 00.486.371l3.786.58-2.74 2.793z"
  }));
}

IconStar.propTypes = IconPropTypes;

export default IconStar;
//# sourceMappingURL=IconStar.js.map
