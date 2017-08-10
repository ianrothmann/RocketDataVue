'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    props: {
        pageButtons: {
            type: Number,
            'default': 6
        }
    },
    data: function data() {
        return {
            pageNumber: 1,
            numPageButtons: 6,
            rowsPerPage: null
        };
    },

    computed: {
        pages: function pages() {
            if (!this.recordSet.numberOfPages) return null;
            var numPageButtons = this.numPageButtons;
            var pages = [];
            if (this.recordSet.numberOfPages < numPageButtons) {
                for (var i = 1; i <= this.recordSet.numPages; i++) {
                    pages.push(i);
                }
            } else {
                var start = this.pageNumber - numPageButtons / 2;

                if (start < 1) start = 1;

                var end = start + numPageButtons;

                if (end > this.recordSet.numberOfPages) {
                    end = this.recordSet.numberOfPages;
                    start = end - numPageButtons;
                }

                if (start < 1) start = 1;

                if (start !== 1) pages.push(1);

                for (var _i = start; _i <= end; _i++) {
                    pages.push(_i);
                }if (end < this.recordSet.numberOfPages) {
                    pages.push(this.recordSet.numberOfPages);
                }
            }

            return pages;
        },
        totalPages: function totalPages() {
            return this.recordSet !== null ? this.recordSet.numberOfPages : 0;
        },
        pageSize: function pageSize() {
            return this.recordSet !== null ? this.recordSet.numberOfPages : 0;
        },
        pageSizeOptions: function pageSizeOptions() {
            if (this.definition) {
                return this.definition.pageSizeOptions;
            }
        },
        totalItems: function totalItems() {

            if (this.recordSet && this.recordSet.totalRowCount) {
                return this.recordSet.totalRowCount;
            } else {
                return 0;
            }
        }
    },
    methods: {
        displayPageRecords: function displayPageRecords(pageNumber) {
            var base = this.recordSet.pageSize * pageNumber;
            if (base === 0 || isNaN(base)) return '0 to 0';
            return base - this.recordSet.pageSize + 1 + ' to ' + base;
        },
        pageJump: function pageJump(pageNumber) {
            this.pageNumber = pageNumber;
            this.loadData();
        },
        pageDown: function pageDown() {
            if (this.pageNumber > 1) this.pageJump(this.pageNumber - 1);
        },
        pageUp: function pageUp() {
            if (this.pageNumber < this.totalPages) this.pageJump(this.pageNumber + 1);
        },
        setPageSize: function setPageSize(size) {
            this.rowsPerPage = size;
            this.loadData();
        }
    },
    mounted: function mounted() {
        this.numPageButtons = this.pageButtons;
    }
};