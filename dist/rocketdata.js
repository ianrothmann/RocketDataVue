'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RocketData = undefined;

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.debounce = require('debounce');
_vue2.default.component('rocket-data-provider', require('./components/RocketDataProvider.vue').default);
_vue2.default.component('rocket-list', require('./components/RocketList.vue').default);

_vue2.default.component('rocket-crud', require('./components/RocketCRUD.vue').default);

_vue2.default.component('rocket-data-table', require('./components/RocketDataTable.vue').default);
_vue2.default.component('rocket-field-actions', require('./components/actions/RocketFieldActions.vue').default);
_vue2.default.component('rocket-field-sort', require('./components/actions/RocketFieldSort.vue').default);
_vue2.default.component('rocket-field-filter-display', require('./components/actions/RocketFieldFilterDisplay.vue').default);
_vue2.default.component('rocket-pager', require('./components/actions/RocketPager.vue').default);
_vue2.default.component('rocket-main-menu', require('./components/menus/RocketMainMenu.vue').default);
_vue2.default.component('rocket-row-menu', require('./components/menus/RocketRowMenu.vue').default);

_vue2.default.component('rocket-field-value', require('./components/displayfields/RocketFieldValueDisplay.vue').default);
_vue2.default.component('rocket-field-value-location', require('./components/displayfields/RocketFieldLocationDisplay.vue').default);
_vue2.default.component('rocket-field-value-image', require('./components/displayfields/RocketFieldImageDisplay.vue').default);
_vue2.default.component('rocket-field-value-file', require('./components/displayfields/RocketFieldFileDisplay.vue').default);
_vue2.default.component('rocket-field-value-multi', require('./components/displayfields/RocketFieldMultiValueDisplay.vue').default);

window.RocketEventHub = new _vue2.default({
    data: {
        currentID: 0
    },
    methods: {
        refresh: function refresh(id) {
            RocketEventHub.$emit('refresh', id);
        },
        validate: function validate(id) {
            RocketEventHub.$emit('validate', id);
        },
        getUniqueID: function getUniqueID(prefix) {
            this.currentID++;
            return 'rdata_' + prefix + this.currentID;
        }
    }
});

var RocketData = exports.RocketData = {};

RocketData.install = function (Vue, options) {

    Vue.prototype.$rocketData = {
        refresh: function refresh(id) {
            RocketEventHub.refresh(id);
        }
    };
};