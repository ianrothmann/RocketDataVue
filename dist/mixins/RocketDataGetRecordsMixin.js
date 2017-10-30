'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    props: {
        id: String
    },
    data: function data() {
        return {
            recordSet: {},
            orderBy: []
        };
    },

    watch: {
        url: function url() {
            this.loadData();
        }
    },
    methods: {
        recordKey: function recordKey(record, index) {
            return this.definition.recordId ? record[this.definition.recordId] : 'idx' + index;
        },
        getRecordRetrievalParameters: function getRecordRetrievalParameters() {
            var state = {
                pageNumber: this.pageNumber
            };
            if (this.rowsPerPage) state.pageSize = this.rowsPerPage;
            if (this.sortState) state.orderBy = this.sortState;
            if (this.dataFilters) state.filters = this.dataFilters;

            if (this.definition === null) {
                return { command: 'def', state: state };
            } else {
                return { command: 'get', state: state };
            }
        },
        loadData: function loadData(jumpToPage) {
            var _this = this;

            if (jumpToPage !== undefined) {
                this.pageNumber = jumpToPage;
            }

            this.dataProvider(this.getRecordRetrievalParameters()).then(function (data) {
                _this.recordSet = data;
                _this.pageNumber = _this.recordSet.pageNumber;
                _this.rowsPerPage = _this.recordSet.pageSize;
                if (typeof _this.dataLoaded === 'function') {
                    _this.dataLoaded();
                }
                _this.clearSelected();
            });
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        RocketEventHub.$on('refresh', function (id) {
            if (id === _this2.id) {
                _this2.loadData();
            }
        });
        this.loadData();
    }
};