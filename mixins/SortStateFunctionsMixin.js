export default {
    methods : {
        addSortEntry(fieldId,direction){
            this.sortState.push({
                fieldId,direction
            });
        },
        addSortEntryAfter(afterFieldId,fieldId,direction){
            const entry={
                fieldId,direction
            };
            const idx=this.findSortEntryIndex(afterFieldId);
            this.sortState.splice(idx+1, 0, entry);
        },
        findSortEntryIndex(fieldId){
            let entryKey=-1;
            let index=0;
            for(let sortEntry of this.sortState){
                if(sortEntry.fieldId===fieldId){
                    entryKey=index;
                    break;
                }
                index++;
            }
            return entryKey;
        },
        setSortEntry(fieldId,direction){
           const idx=this.findSortEntryIndex(fieldId);
           if(idx>-1){
               this.$set(this.sortState,idx,{
                   fieldId,direction
               });
           }else{
               this.addSortEntry(fieldId,direction);
           }
        },
        removeSortEntry(fieldId){
            const index=this.findSortEntryIndex(fieldId);
            if (index !== -1) {
                this.$delete(this.sortState,index);
            }
        },
        hasSortEntry(fieldId){
            const index=this.findSortEntryIndex(fieldId);
            return index !== -1;
        },
        getSortEntry(fieldId){
            const index=this.findSortEntryIndex(fieldId);
            if (index !== -1) {
                return this.sortState[index];
            }else{
                return null;
            }
        },
        getAscDescription(field){
            if(field.dataType==='date'||field.dataType==='time'||field.dataType==='datetime')
                return 'earliest to latest';
            else if(field.dataType==='int'||field.dataType==='decimal'||field.dataType==='currency'){
                return 'smallest to largest';
            }else if(field.dataType==='text'){
                return 'a-Z';
            }else{
                return 'ascending';
            }
        },
        getDescDescription(field){
            if(field.dataType==='date'||field.dataType==='time'||field.dataType==='datetime')
                return 'latest to earliest';
            else if(field.dataType==='int'||field.dataType==='decimal'||field.dataType==='currency'){
                return 'largest to smallest';
            }else if(field.dataType==='text'){
                return 'Z-a';
            }else{
                return 'descending';
            }
        },
    }
}