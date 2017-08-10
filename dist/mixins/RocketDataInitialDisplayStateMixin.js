"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    props: {
        initialDisplayState: Object
    },
    created: function created() {

        if (this.initialDisplayState) {
            var state = JSON.parse(JSON.stringify(this.initialDisplayState));

            if (state.pageNumber) {
                this.pageNumber = state.pageNumber;
            }

            if (state.filters) this.dataFilters = state.filters;

            if (state.orderBy) {
                this.sortState = state.orderBy;
            }

            if (state.pageSize) this.rowsPerPage = state.pageSize;
        }
    }
};