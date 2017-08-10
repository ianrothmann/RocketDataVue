<template>
    <div>


        <span v-for="filter in dataFilters" :key="filter.fieldId" v-if="definition">
            <v-chip
                    v-if="filter.hasOwnProperty('fieldId')"
                    small close outline label
                    :class="getFilterColorClasses(filter.fieldId)"
                    @input="removeFilterField(filter, filter.value)"
            >
                {{definition.fields[filter.fieldId].shortLabel || definition.fields[filter.fieldId].label }}
                {{describeOperator(definition.fields[filter.fieldId].dataType,filter.operator)}}
                "{{processFilterValue(filter)}}"
            </v-chip>
            <template v-else>
                 <v-chip
                              v-for="subFilter in filter" :key="subFilter.fieldId"
                              small close outline label
                              :class="getFilterColorClasses(subFilter.fieldId)"
                              @input="removeFilterField(subFilter, subFilter.value)"
                      >
                    {{definition.fields[subFilter.fieldId].shortLabel || definition.fields[subFilter.fieldId].label }}
                    {{describeOperator(definition.fields[subFilter.fieldId].dataType,subFilter.operator)}}
                    "{{processFilterValue(subFilter)}}"
                </v-chip>
            </template>
        </span>


    </div>
</template>
<style lang="stylus">

</style>
<script>
    import CommonFilterFunctionsMixin from '../../mixins/CommonFilterFunctionsMixin';
    import ValueDisplayMixin from '../../mixins/RocketDataValueDisplayMixin';
    export default{
        props : {
            definition : Object,
            dataFilters : Object
        },
        mixins : [CommonFilterFunctionsMixin,ValueDisplayMixin],
        computed : {

        },
        mounted(){

        },
        methods : {
            processFilterValue(filter){
                if(this.definition&&this.definition.fields&&(this.definition.fields[filter.fieldId].dataType==='enum'||this.definition.fields[filter.fieldId].dataType==='boolean')){
                    return this.lookupFilterListValue(filter.value,this.definition.fields[filter.fieldId]);
                }
                return filter.value;
            },
            getFilterColor(fieldId){
                const colors=[
                    'info','secondary','primary',
                    'brown','deep-purple','pink','indigo','teal',
                    'blue-grey','blue',
                    'cyan','grey','amber',
                    'light-blue',
                ];
                const fields=Object.keys(this.definition.fields);
                if(fields.length<colors.length){
                   return colors[fields.indexOf(fieldId)];
                }else{
                    const idx=fields.indexOf(fieldId);
                    return colors[idx%colors.length];
                }
            },
            getFilterColorClasses(fieldId){
              const color=this.getFilterColor(fieldId);
              return [color,color+'--text'];
            },
            removeFilterField(filter, value){
                this.$emit('remove',{
                    field:this.definition.fields[filter.fieldId],
                    value
                });
            }
        }
    }
</script>
