<template>
    <div>
        <rw-card title="Definition"><code>{{definition}}</code></rw-card>
        <rw-btn @click.native="pageUp()">Page Up</rw-btn>
        <rw-btn @click.native="pageDown()">Page Down</rw-btn>
        <code>{{recordSet}}</code>
    </div>
</template>
<script>
    import DataProviderMixin from '../mixins/RocketDataProviderMixin';
    import GetRecordsMixin from '../mixins/RocketDataGetRecordsMixin';
    export default{
        props : {

        },
        mixins : [DataProviderMixin,GetRecordsMixin],
        /*render(h){
          return h('v-card',{},[h('v-card-text',{},this.$slots.default)]);
        }*/
    }
</script>
