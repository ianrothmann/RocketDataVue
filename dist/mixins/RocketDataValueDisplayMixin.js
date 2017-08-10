'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    props: {
        filters: {},
        valueModifiers: {}
    },
    methods: {
        getValueThroughFieldAccessPath: function getValueThroughFieldAccessPath(field, record) {
            if (record && field.fieldAccessPath && Array.isArray(field.fieldAccessPath)) {
                var path = field.fieldAccessPath;
                if (path.length <= 1) {
                    return record[field.fieldId];
                } else if (field.dataType === 'multiselect' || field.dataType === 'images' || field.dataType === 'files' || field.dataType === 'image' || field.dataType === 'file') {
                    var multipath = field.fieldAccessPath.slice();
                    multipath.pop();
                    return this.getValueForAccessPath(multipath, record);
                } else {
                    return this.getValueForAccessPath(path, record);
                }
            } else {
                return record[field.fieldId];
            }
        },
        getValueForAccessPath: function getValueForAccessPath(path, record) {
            if (path.length === 1) {
                return record[path[0]];
            } else if (path.length === 2) {
                return record[path[0]] && record[path[0]][path[1]];
            } else if (path.length === 3) {
                return record[path[0]] && record[path[0]][path[1]] && record[path[0]][path[1]][path[2]];
            } else if (path.length === 4) {
                return record[path[0]] && record[path[0]][path[1]] && record[path[0]][path[1]][path[2]] && record[path[0]][path[1]][path[2]][path[3]];
            }
        },
        summarizeValues: function summarizeValues(valueArr, descriptor) {
            if (valueArr.length === 0) {
                return null;
            } else if (valueArr.length === 1) {
                return valueArr[0][descriptor];
            } else if (valueArr.length > 1) {
                return ' <span v-tooltip:bottom="{ \'html\':\'hello\' }">\n                 TEST\n                </span>';
                //return valueArr[0][descriptor]+'... '+(valueArr.length-1)+' more';
            }
        },
        lookupFilterListValue: function lookupFilterListValue(id, props) {
            if (props.filterList) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = props.filterList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        if (item[props.filterListQueryPrimaryKey] == id) return item[props.filterListQueryDescriptor];
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            return id;
        }
    },
    mounted: function mounted() {}
};