export default {
    props : {
        enableSelection:{type:Boolean,default:false},
        value:{}
    },
    data(){
        return {
            selected : []
        }
    },
    methods : {
        receiveSelectionArray(){
            if(this.value)
                this.selected=JSON.parse(JSON.stringify(this.value));
        },
        emitSelectionArray(){
            const str=JSON.stringify(this.selected);
            if(JSON.stringify(this.value)!==str){
                this.$emit('input',JSON.parse(str));
            }
        },
        isAllSelected(){
            if(!this.recordSet||!this.recordSet.data||!this.selected)
                return false;
          return this.selected.length===this.recordSet.data.length&&this.recordSet.data.length>0;
        },
        isSomeSelected(){
            if(!this.recordSet||!this.recordSet.data||!this.selected)
                return false;
          return this.selected.length!==this.recordSet.data.length&&this.selected.length>0;
        },
        recordSelected(selected,record){
            if(selected){
                if(Array.isArray(record)){
                    this.selected=record;
                }else{
                    this.selected.push(record);
                }
            }else{
                this.selected=this.selected.filter((i)=>{
                    return i[this.definition.recordId]!==record[this.definition.recordId];
                });
            }
        },
        isRecordSelected(record){
            for(let i of this.selected){
                if(i[this.definition.recordId]===record[this.definition.recordId])
                   return true;
            }
            return false;
        },
        clearSelected(){
            this.selected=[];
        }
    },
    mounted(){
        this.receiveSelectionArray();
        this.$watch('value',()=>{
            this.receiveSelectionArray();
        },{deep:true});
        this.$watch('selected',()=>{
            this.emitSelectionArray();
        },{deep:true});
    }
}