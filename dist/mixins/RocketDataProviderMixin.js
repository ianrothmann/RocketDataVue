'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    props: {
        url: {
            required: true,
            type: String
        }
    },
    data: function data() {
        return {
            definition: null,
            loading: false,
            initialLoading: true
        };
    },

    methods: {
        dataProvider: function dataProvider(command) {
            var _this = this;

            this.loading = true;
            return this.$http.post(this.url, command).then(function (response) {
                if (_this.definition === null && response.body.definition) {
                    _this.definition = response.body.definition;
                    _this.initialLoading = false;
                    if (typeof _this.definitionLoaded === 'function') {
                        _this.definitionLoaded();
                    }
                }
                _this.loading = false;
                return response.body;
            });
        }
    }
};