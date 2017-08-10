window.debounce=require('debounce');
Vue.component('rocket-data-provider', require('./components/RocketDataProvider.vue'));
Vue.component('rocket-list', require('./components/RocketList.vue'));

Vue.component('rocket-crud', require('./components/RocketCRUD.vue'));

Vue.component('rocket-data-table', require('./components/RocketDataTable.vue'));
Vue.component('rocket-field-actions', require('./components/actions/RocketFieldActions.vue'));
Vue.component('rocket-field-sort', require('./components/actions/RocketFieldSort.vue'));
Vue.component('rocket-field-filter-display', require('./components/actions/RocketFieldFilterDisplay.vue'));
Vue.component('rocket-pager', require('./components/actions/RocketPager.vue'));
Vue.component('rocket-main-menu', require('./components/menus/RocketMainMenu.vue'));
Vue.component('rocket-row-menu', require('./components/menus/RocketRowMenu.vue'));

Vue.component('rocket-field-value', require('./components/displayfields/RocketFieldValueDisplay.vue'));
Vue.component('rocket-field-value-image', require('./components/displayfields/RocketFieldImageDisplay.vue'));
Vue.component('rocket-field-value-file', require('./components/displayfields/RocketFieldFileDisplay.vue'));
Vue.component('rocket-field-value-multi', require('./components/displayfields/RocketFieldMultiValueDisplay.vue'));

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