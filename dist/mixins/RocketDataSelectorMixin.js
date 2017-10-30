'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    props: {
        enableSelection: { type: Boolean, default: false },
        value: {}
    },
    data: function data() {
        return {
            selected: []
        };
    },

    methods: {
        receiveSelectionArray: function receiveSelectionArray() {
            if (this.value) this.selected = JSON.parse(JSON.stringify(this.value));
        },
        emitSelectionArray: function emitSelectionArray() {
            var str = JSON.stringify(this.selected);
            if (JSON.stringify(this.value) !== str) {
                this.$emit('input', JSON.parse(str));
            }
        },
        isAllSelected: function isAllSelected() {
            if (!this.recordSet || !this.recordSet.data || !this.selected) return false;
            return this.selected.length === this.recordSet.data.length && this.recordSet.data.length > 0;
        },
        isSomeSelected: function isSomeSelected() {
            if (!this.recordSet || !this.recordSet.data || !this.selected) return false;
            return this.selected.length !== this.recordSet.data.length && this.selected.length > 0;
        },
        recordSelected: function recordSelected(selected, record) {
            var _this = this;

            if (selected) {
                if (Array.isArray(record)) {
                    this.selected = record;
                } else {
                    this.selected.push(record);
                }
            } else {
                this.selected = this.selected.filter(function (i) {
                    return i[_this.definition.recordId] !== record[_this.definition.recordId];
                });
            }
        },
        isRecordSelected: function isRecordSelected(record) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.selected[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    if (i[this.definition.recordId] === record[this.definition.recordId]) return true;
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

            return false;
        },
        clearSelected: function clearSelected() {
            this.selected = [];
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        this.receiveSelectionArray();
        this.$watch('value', function () {
            _this2.receiveSelectionArray();
        }, { deep: true });
        this.$watch('selected', function () {
            _this2.emitSelectionArray();
        }, { deep: true });
    }
};