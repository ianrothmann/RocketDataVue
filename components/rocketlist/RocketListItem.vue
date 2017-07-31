<script>
    export default{
        props : {
            title : {required:true},
            icon : {},
            id : {required:false},
            active : {required:false}
        },
        functional : true,
        render(h,c){
          return h('v-card',{},[h('v-card-text',{},this.$slots.default)]);
        }
    }
</script>
