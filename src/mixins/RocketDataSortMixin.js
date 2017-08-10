export default {
    data(){
        return {
            sortState: [],
        }
    },
    methods : {
        toggleDirection(direction){
            return direction==='asc'?'desc':'asc';
        },
        toggleSortField(field, reload=true){
            const entry=this.getSortEntry(field.fieldId);
            this.setSortEntry(field.fieldId,this.toggleDirection(entry.direction));
            if(reload)
                this.loadData(1);
        },
        addSortField(field,direction='asc',reload=true){
            if(field.canOrder){
                if(this.hasSortEntry(field.fieldId)){
                    this.removeSortEntry(field.fieldId);
                }
                if(direction!==null){
                    this.addSortEntry(field.fieldId,direction);
                }
                if(reload)
                    this.loadData(1);
            }else{
                console.error(field.fieldId + " cannot order.");
            }

        },
        addSortFieldAfter(afterFieldId,field,direction='asc',reload=true){
            if(field.canOrder){
                if(this.hasSortEntry(field.fieldId)){
                    this.removeSortEntry(field.fieldId);
                }
                if(direction!==null){
                    this.addSortEntryAfter(afterFieldId,field.fieldId,direction);
                }
                if(reload)
                    this.loadData(1);
            }else{
                console.error(field.fieldId + " cannot order.");
            }
        },
        removeSortField(field,reload=true){
            this.removeSortEntry(field.fieldId);
            if(reload)
                this.loadData(1);

        },
        clearSort(reload=true){
            this.sortState=[];
            if(reload)
             this.loadData(1);
        }

    },
    mounted(){

    }
}