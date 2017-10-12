<template>
    <div>

        <ul class="breadcrumbs sortFields pl-0 pr-0" v-if="definition">
            <li data-divider=""><a class="breadcrumbs__item sortLabel pl-2"> Sort options</a></li>
            <li data-divider="/" v-for="(sortEntry,index) in sortState">
                <v-menu offset-y>
                    <a slot="activator" href="javascript:;" class="breadcrumbs__item sortField">
                        {{getFieldLabel(definition.fields[sortEntry.fieldId])}}
                        <v-icon class="ml-1" v-if="sortEntry.direction==='asc'">arrow_downward</v-icon>
                        <v-icon class="ml-1" v-else>arrow_upward</v-icon>
                    </a>
                    <v-list dense subheader>
                        <v-subheader>Sort options</v-subheader>
                        <v-list-tile v-if="sortEntry.direction==='desc'" avatar @click="changeDirection(sortEntry)">
                            <v-list-tile-avatar>
                                <v-icon>arrow_downward</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>Sort {{getAscDescription(definition.fields[sortEntry.fieldId])}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile v-else avatar @click="changeDirection(sortEntry)">
                            <v-list-tile-avatar>
                                <v-icon>arrow_upward</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>Sort {{getDescDescription(definition.fields[sortEntry.fieldId])}}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile @click="removeSortField(sortEntry)">
                            <v-list-tile-avatar>
                                <v-icon>delete</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>Remove sort</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-subheader v-if="sortableFields.length > 0">Insert sort field</v-subheader>
                        <v-list-tile v-for="field in sortableFields" :key="field.fieldId" @click="addSortFieldAfter(sortEntry.fieldId,field.fieldId)" avatar>
                            <v-list-tile-title>{{field.shortLabel || field.label}}</v-list-tile-title>
                            <v-list-tile-avatar>
                                <v-icon>arrow_downward</v-icon>
                            </v-list-tile-avatar>
                        </v-list-tile>

                    </v-list>
                </v-menu>
            </li>
            <li data-divider="">
                    <v-menu>
                        <v-tooltip slot="activator" bottom>
                            <v-btn slot="activator" small flat icon><v-icon>sort</v-icon></v-btn>
                            <span>Sort options</span>
                        </v-tooltip>
                        <v-list dense>
                            <v-list-tile @click="clearSort()">
                                <v-list-tile-content>
                                    <v-list-tile-title>Clear sort</v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-avatar>
                                    <v-icon>delete</v-icon>
                                </v-list-tile-avatar>
                            </v-list-tile>
                            <v-subheader v-if="sortableFields.length > 0">Add sort field</v-subheader>
                            <v-list-tile v-for="field in sortableFields" :key="field.fieldId" @click="addSortField(field.fieldId)" avatar>
                                <v-list-tile-title>{{field.shortLabel || field.label}}</v-list-tile-title>
                                <v-list-tile-avatar>
                                    <v-icon>arrow_downward</v-icon>
                                </v-list-tile-avatar>
                            </v-list-tile>
                        </v-list>
                    </v-menu>

            </li>
        </ul>

    </div>
</template>
<style lang="stylus">

</style>
<script>
    import SortStateFunctions from '../../mixins/SortStateFunctionsMixin';
    export default{
        props : {
            definition : Object,
            sortState : Array
        },
        mixins : [SortStateFunctions],
        computed : {
          sortableFields(){
              if(!this.definition || !this.definition.fields)
                  return [];

              const result=[];
              Object.keys(this.definition.fields).forEach((fieldId)=>{
                  const field=this.definition.fields[fieldId];
                  if(field.canOrder&&!this.hasSortEntry(fieldId)){
                      result.push(field);
                  }
              });

              return result;
          }
        },
        mounted(){

        },
        methods : {
            getFieldLabel(field){
                return field.shortLabel || field.label;
            },
            changeDirection(sortEntry){
                this.$emit('toggle',this.definition.fields[sortEntry.fieldId]);
            },
            addSortField(fieldId){
                this.$emit('add',this.definition.fields[fieldId]);
            },
            addSortFieldAfter(afterFieldId,fieldId){
                this.$emit('add-after',{
                    afterFieldId,
                    field : this.definition.fields[fieldId]
                });
            },
            removeSortField(sortEntry){
               this.$emit('remove',this.definition.fields[sortEntry.fieldId]);
            },
            clearSort(){
                this.$emit('clear');
            }
        }
    }
</script>
