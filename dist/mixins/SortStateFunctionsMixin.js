'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    methods: {
        addSortEntry: function addSortEntry(fieldId, direction) {
            this.sortState.push({
                fieldId: fieldId, direction: direction
            });
        },
        addSortEntryAfter: function addSortEntryAfter(afterFieldId, fieldId, direction) {
            var entry = {
                fieldId: fieldId, direction: direction
            };
            var idx = this.findSortEntryIndex(afterFieldId);
            this.sortState.splice(idx + 1, 0, entry);
        },
        findSortEntryIndex: function findSortEntryIndex(fieldId) {
            var entryKey = -1;
            var index = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.sortState[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var sortEntry = _step.value;

                    if (sortEntry.fieldId === fieldId) {
                        entryKey = index;
                        break;
                    }
                    index++;
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

            return entryKey;
        },
        setSortEntry: function setSortEntry(fieldId, direction) {
            var idx = this.findSortEntryIndex(fieldId);
            if (idx > -1) {
                this.$set(this.sortState, idx, {
                    fieldId: fieldId, direction: direction
                });
            } else {
                this.addSortEntry(fieldId, direction);
            }
        },
        removeSortEntry: function removeSortEntry(fieldId) {
            var index = this.findSortEntryIndex(fieldId);
            if (index !== -1) {
                this.$delete(this.sortState, index);
            }
        },
        hasSortEntry: function hasSortEntry(fieldId) {
            var index = this.findSortEntryIndex(fieldId);
            return index !== -1;
        },
        getSortEntry: function getSortEntry(fieldId) {
            var index = this.findSortEntryIndex(fieldId);
            if (index !== -1) {
                return this.sortState[index];
            } else {
                return null;
            }
        },
        getAscDescription: function getAscDescription(field) {
            if (field.dataType === 'date' || field.dataType === 'time' || field.dataType === 'datetime') return 'earliest to latest';else if (field.dataType === 'int' || field.dataType === 'decimal' || field.dataType === 'currency') {
                return 'smallest to largest';
            } else if (field.dataType === 'text') {
                return 'a-Z';
            } else {
                return 'ascending';
            }
        },
        getDescDescription: function getDescDescription(field) {
            if (field.dataType === 'date' || field.dataType === 'time' || field.dataType === 'datetime') return 'latest to earliest';else if (field.dataType === 'int' || field.dataType === 'decimal' || field.dataType === 'currency') {
                return 'largest to smallest';
            } else if (field.dataType === 'text') {
                return 'Z-a';
            } else {
                return 'descending';
            }
        }
    }
};