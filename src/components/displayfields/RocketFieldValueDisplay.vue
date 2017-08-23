<script>
    import ValueDisplayMixin from '../../mixins/RocketDataValueDisplayMixin';

    export default{
        props : {
            field : {type:Object, required:true},
            record :{type:Object, required:true},
            dataFilters : Object,
            fieldFilters : Array,
            valueModifier : Function
        },
        functional : true,
        render(h,c){
            const field=c.props.field;
            const record=c.props.record;

            let value=ValueDisplayMixin.methods.getValueThroughFieldAccessPath(field,record);

            if(c.props.valueModifier&&typeof c.props.valueModifier==='function')
                value=c.props.valueModifier(value,record);

            if(Array.isArray(c.props.fieldFilters)){
                for(let filter of c.props.fieldFilters){
                    const temp=filter.concat([]);
                    const filtername=temp[0];
                    temp[0]=value;
                    value=Vue.filter(filtername)(...temp);
                }
            }

            let displayChildren=[];
            let displayData={
                props : {},
                'class' : [],
                on : {},
                directives : []
            };
            if(value===null){
                value='-';
                displayData['class'].push('grey--text');
                displayChildren.push(value);
            }else if(field.dataType==='multiselect'){
                const descriptor=field.fieldAccessPath[field.fieldAccessPath.length-1];
                displayChildren.push(h('rocket-field-value-multi',{
                    props : {
                        values : value,
                        descriptor
                    }
                }));
            }else if((field.dataType==='enum'||field.dataType==='boolean')){
                value=ValueDisplayMixin.methods.lookupFilterListValue(value,field);
                displayChildren.push(value);
            }else if(field.dataType==='image'){
                displayChildren.push(h('rocket-field-value-image',{
                    props : {
                        files : [value]
                    }
                }));
            }else if(field.dataType==='location'){
                displayChildren.push(h('rocket-field-value-location',{
                    props : {
                        location : value
                    }
                }));
            }else if(field.dataType==='images'){
                displayChildren.push(h('rocket-field-value-image',{
                    props : {
                        files : value
                    }
                }));
            }else if(field.dataType==='file'){
                displayChildren.push(h('rocket-field-value-file',{
                    props : {
                        files : [value]
                    }
                }));
            }else if(field.dataType==='files'){
                displayChildren.push(h('rocket-field-value-file',{
                    props : {
                        files : value
                    }
                }));
            }else{
                if(field.dataType==='date'){
                    value=Vue.filter('rdate')(value,'compactdate');
                }else if(field.dataType==='time'){
                    value=Vue.filter('rdate')(value,'time');
                }else if(field.dataType==='datetime') {
                    value = Vue.filter('rdate')(value, 'compactdatetime');
                }
                displayChildren.push(value);
            }



            return h('span',displayData,displayChildren);

        }
    }
</script>
