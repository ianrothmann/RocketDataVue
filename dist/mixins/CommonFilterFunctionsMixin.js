'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    methods: {
        describeOperator: function describeOperator(dataType, operator) {

            if (dataType === 'date' || dataType === 'time' || dataType === 'datetime') {
                if (operator === 'lt') operator = 'before';else if (operator === 'gt') operator = 'after';
            }

            var descriptions = {
                eq: '=',
                gt: '>',
                gte: '>=',
                lt: '<',
                lte: '<=',
                contains: 'contains',
                startswith: 'starts with',
                endswith: 'ends with',
                before: 'is before',
                after: 'is after',
                in: 'contains'
            };

            return descriptions[operator];
        }
    }
};