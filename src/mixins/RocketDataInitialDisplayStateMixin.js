export default {
    props : {
        initialDisplayState : Object
    },
    created(){

        if(this.initialDisplayState){
            const state=JSON.parse(JSON.stringify(this.initialDisplayState));

            if(state.pageNumber){
                this.pageNumber=state.pageNumber;
            }

            if(state.filters)
                this.dataFilters=state.filters;

            if(state.orderBy){
                this.sortState=state.orderBy;
            }


            if(state.pageSize)
                this.rowsPerPage=state.pageSize;
        }
    }
}