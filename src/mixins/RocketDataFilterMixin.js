export default {
    data(){
        return {
            dataFilters : {},
        }
    },
    computed : {
        hasDataFilters(){
            return Object.keys(this.dataFilters).length>0;
        }
    },
    methods : {
        addSimpleFilter(field,value,operator='contains'){
            const filterField={
                fieldId : field.fieldId,
                operator,
                value
            };
            const fieldId=field.fieldId;

            if(this.dataFilters[fieldId]){
                let filterGroup=this.dataFilters[fieldId];
                if(filterGroup.hasOwnProperty('fieldId')){
                    //convert filter to filterGroup
                    const newGroup={};
                    newGroup[filterGroup.value]=Object.assign({},filterGroup);
                    newGroup[value]=filterField;
                    this.$set(this.dataFilters,fieldId,newGroup);
                }else{
                    //add to filterGroup
                    this.$set(this.dataFilters[fieldId],value,filterField);
                }
            }else{
                //Create filter
                this.$set(this.dataFilters,fieldId,filterField);
            }


        },
        removeSimpleFilter(field,value=null){
            if(value===null) {
                //remove all
                this.$delete(this.dataFilters,field.fieldId);
            }
            else if(this.dataFilters[field.fieldId]){
                //Delete if exists
                if(this.dataFilters[field.fieldId].hasOwnProperty('fieldId')||Object.keys(this.dataFilters[field.fieldId]).length===1){
                    //single filter
                    this.$delete(this.dataFilters,field.fieldId);
                }else {
                    //multiple filters
                    this.$delete(this.dataFilters[field.fieldId],value);
                }
            }
        }
        ,
        setSimpleFilter(field,value,operator='contains'){
            const filterField={
                fieldId : field.fieldId,
                operator,
                value
            };

            if(value==='') {
                this.$delete(this.dataFilters,field.fieldId);
            }
            else{
                this.$set(this.dataFilters,field.fieldId,filterField);
            }
        },
        setSimpleFilterAndReload(field,value,operator='contains'){
            this.setSimpleFilter(field,value,operator);
            this.loadData(1);
        },
        removeSimpleFilterAndReload(field,value=null){
            this.removeSimpleFilter(field,value);
            this.loadData(1);
        }
    },
    created(){
        this.debouncedSetSimpleFilterAndReload=debounce(this.setSimpleFilterAndReload,500);
    },
    mounted(){

    }
}