import Vue from 'vue'
window.debounce=require('debounce');
Vue.component('rocket-data-provider', require('./components/RocketDataProvider.vue').default);
Vue.component('rocket-list', require('./components/RocketList.vue').default);

Vue.component('rocket-crud', require('./components/RocketCRUD.vue').default);

Vue.component('rocket-data-table', require('./components/RocketDataTable.vue').default);
Vue.component('rocket-field-actions', require('./components/actions/RocketFieldActions.vue').default);
Vue.component('rocket-field-sort', require('./components/actions/RocketFieldSort.vue').default);
Vue.component('rocket-field-filter-display', require('./components/actions/RocketFieldFilterDisplay.vue').default);
Vue.component('rocket-pager', require('./components/actions/RocketPager.vue').default);
Vue.component('rocket-main-menu', require('./components/menus/RocketMainMenu.vue').default);
Vue.component('rocket-row-menu', require('./components/menus/RocketRowMenu.vue').default);

Vue.component('rocket-field-value', require('./components/displayfields/RocketFieldValueDisplay.vue').default);
Vue.component('rocket-field-value-location', require('./components/displayfields/RocketFieldLocationDisplay.vue').default);
Vue.component('rocket-field-value-image', require('./components/displayfields/RocketFieldImageDisplay.vue').default);
Vue.component('rocket-field-value-file', require('./components/displayfields/RocketFieldFileDisplay.vue').default);
Vue.component('rocket-field-value-multi', require('./components/displayfields/RocketFieldMultiValueDisplay.vue').default);

window.RocketEventHub = new Vue({
    data : {
        currentID : 0
    },
    methods:{
        refresh(id){
            RocketEventHub.$emit('refresh',id);
        },
        validate(id){
            RocketEventHub.$emit('validate',id);
        },
        getUniqueID(prefix){
            this.currentID++;
            return 'rdata_'+prefix+this.currentID;
        }
    }
});

export const RocketData = {};

RocketData.install = function (Vue, options) {

    Vue.prototype.$rocketData = {
        refresh(id){
            RocketEventHub.refresh(id);
        }
    }
};