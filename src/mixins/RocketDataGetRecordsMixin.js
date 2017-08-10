export default {
    props : {
        id : String,
    },
    data(){
        return {
            recordSet : {},
            orderBy : []
        }
    },
    watch : {
        url(){
            this.loadData();
        }
    },
    methods : {
        recordKey(record,index){
            return this.definition.recordId? record[this.definition.recordId] : 'idx'+index;
        },
        getRecordRetrievalParameters(){
            const state={
                pageNumber : this.pageNumber
            };
            if(this.rowsPerPage)
                state.pageSize=this.rowsPerPage;
            if(this.sortState)
                state.orderBy=this.sortState;
            if(this.dataFilters)
                state.filters=this.dataFilters;

            if(this.definition===null){
                return {command:'def',state}
            }else{
                return {command:'get',state};
            }

        },

        loadData(jumpToPage){
            if(jumpToPage!==undefined){
                this.pageNumber=jumpToPage;
            }

            this.dataProvider(this.getRecordRetrievalParameters()).then((data)=>{
               this.recordSet=data;
               this.pageNumber=this.recordSet.pageNumber;
               this.rowsPerPage=this.recordSet.pageSize;
                if (typeof this.dataLoaded === 'function') {
                    this.dataLoaded();
                }
            });
        }

    },
    mounted(){
        RocketEventHub.$on('refresh',(id)=>{
            if(id===this.id){
                this.loadData();
            }
        });
        this.loadData();
    }

}