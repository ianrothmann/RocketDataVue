export default {
    props : {
        filters : {},
        valueModifiers : {}
    },
    methods : {
        getValueThroughFieldAccessPath(field,record){
            if(record&&field.fieldAccessPath&&Array.isArray(field.fieldAccessPath)){
                const path=field.fieldAccessPath;
                if(path.length<=1){
                    return record[field.fieldId];
                }else if(field.dataType==='multiselect'||field.dataType==='images'||field.dataType==='files'||field.dataType==='image'||field.dataType==='file'){
                    const multipath=field.fieldAccessPath.slice();
                    multipath.pop();
                    return this.getValueForAccessPath(multipath,record);
                }else {
                    return this.getValueForAccessPath(path,record);
                }

            }else{
                return record[field.fieldId];
            }

        },
        getValueForAccessPath(path,record){
            if(path.length===1){
                return record[path[0]];
            }else if(path.length===2){
                return record[path[0]] && record[path[0]][path[1]];
            }else if(path.length===3){
                return (record[path[0]] && record[path[0]][path[1]] && record[path[0]][path[1]][path[2]]);
            }else if(path.length===4){
                return record[path[0]] && record[path[0]][path[1]] && record[path[0]][path[1]][path[2]] && record[path[0]][path[1]][path[2]][path[3]];
            }
        },
        summarizeValues(valueArr,descriptor){
            if(valueArr.length===0){
                return null;
            }else if(valueArr.length===1){
                return valueArr[0][descriptor];
            }else if(valueArr.length>1){
                return ` <span v-tooltip:bottom="{ 'html':'hello' }">
                 TEST
                </span>`;
                //return valueArr[0][descriptor]+'... '+(valueArr.length-1)+' more';
            }
        },
        lookupFilterListValue(id,props){
            if(props.filterList){
                for(let item of props.filterList){
                    if(item[props.filterListQueryPrimaryKey]==id)
                        return item[props.filterListQueryDescriptor];
                }
            }
            return id;
        }
    },
    mounted(){

    }
}