'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    data: function data() {
        return {
            dataFilters: {}
        };
    },

    computed: {
        hasDataFilters: function hasDataFilters() {
            return Object.keys(this.dataFilters).length > 0;
        }
    },
    methods: {
        addSimpleFilter: function addSimpleFilter(field, value) {
            var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'contains';

            var filterField = {
                fieldId: field.fieldId,
                operator: operator,
                value: value
            };
            var fieldId = field.fieldId;

            if (this.dataFilters[fieldId]) {
                var filterGroup = this.dataFilters[fieldId];
                if (filterGroup.hasOwnProperty('fieldId')) {
                    //convert filter to filterGroup
                    var newGroup = {};
                    newGroup[filterGroup.value] = Object.assign({}, filterGroup);
                    newGroup[value] = filterField;
                    this.$set(this.dataFilters, fieldId, newGroup);
                } else {
                    //add to filterGroup
                    this.$set(this.dataFilters[fieldId], value, filterField);
                }
            } else {
                //Create filter
                this.$set(this.dataFilters, fieldId, filterField);
            }
        },
        removeSimpleFilter: function removeSimpleFilter(field) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (value === null) {
                //remove all
                this.$delete(this.dataFilters, field.fieldId);
            } else if (this.dataFilters[field.fieldId]) {
                //Delete if exists
                if (this.dataFilters[field.fieldId].hasOwnProperty('fieldId') || Object.keys(this.dataFilters[field.fieldId]).length === 1) {
                    //single filter
                    this.$delete(this.dataFilters, field.fieldId);
                } else {
                    //multiple filters
                    this.$delete(this.dataFilters[field.fieldId], value);
                }
            }
        },
        setSimpleFilter: function setSimpleFilter(field, value) {
            var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'contains';

            var filterField = {
                fieldId: field.fieldId,
                operator: operator,
                value: value
            };

            if (value === '') {
                this.$delete(this.dataFilters, field.fieldId);
            } else {
                this.$set(this.dataFilters, field.fieldId, filterField);
            }
        },
        setSimpleFilterAndReload: function setSimpleFilterAndReload(field, value) {
            var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'contains';

            this.setSimpleFilter(field, value, operator);
            this.loadData(1);
        },
        removeSimpleFilterAndReload: function removeSimpleFilterAndReload(field) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            this.removeSimpleFilter(field, value);
            this.loadData(1);
        }
    },
    created: function created() {
        this.debouncedSetSimpleFilterAndReload = debounce(this.setSimpleFilterAndReload, 500);
    },
    mounted: function mounted() {}
};