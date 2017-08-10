'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    data: function data() {
        return {
            sortState: []
        };
    },

    methods: {
        toggleDirection: function toggleDirection(direction) {
            return direction === 'asc' ? 'desc' : 'asc';
        },
        toggleSortField: function toggleSortField(field) {
            var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var entry = this.getSortEntry(field.fieldId);
            this.setSortEntry(field.fieldId, this.toggleDirection(entry.direction));
            if (reload) this.loadData(1);
        },
        addSortField: function addSortField(field) {
            var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'asc';
            var reload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            if (field.canOrder) {
                if (this.hasSortEntry(field.fieldId)) {
                    this.removeSortEntry(field.fieldId);
                }
                if (direction !== null) {
                    this.addSortEntry(field.fieldId, direction);
                }
                if (reload) this.loadData(1);
            } else {
                console.error(field.fieldId + " cannot order.");
            }
        },
        addSortFieldAfter: function addSortFieldAfter(afterFieldId, field) {
            var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'asc';
            var reload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

            if (field.canOrder) {
                if (this.hasSortEntry(field.fieldId)) {
                    this.removeSortEntry(field.fieldId);
                }
                if (direction !== null) {
                    this.addSortEntryAfter(afterFieldId, field.fieldId, direction);
                }
                if (reload) this.loadData(1);
            } else {
                console.error(field.fieldId + " cannot order.");
            }
        },
        removeSortField: function removeSortField(field) {
            var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            this.removeSortEntry(field.fieldId);
            if (reload) this.loadData(1);
        },
        clearSort: function clearSort() {
            var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.sortState = [];
            if (reload) this.loadData(1);
        }
    },
    mounted: function mounted() {}
};