<templatew>
    <v-card>
        <v-card-title>
            <div class="headline">{{title}}</div>
            <v-spacer></v-spacer>
            <v-btn icon v-tooltip:bottom="{ 'html': 'Refresh' }" @click.native="loadData()"><v-icon>refresh</v-icon></v-btn>
            <rocket-main-menu :main-menu="mainMenu" :state="getRecordRetrievalParameters().state"></rocket-main-menu>
        </v-card-title>

        <div class="ml-3 mr-3 text-xs-left">
            <rocket-field-sort
                    :sort-state="sortState"
                    :definition="definition"
                    @toggle="toggleSortField($event)"
                    @add="addSortField($event)"
                    @add-after="addSortFieldAfter($event.afterFieldId,$event.field)"
                    @remove="removeSortField($event)"
                    @clear="clearSort()"
            ></rocket-field-sort>
            <rocket-field-filter-display
                    :definition="definition"
                    :data-filters="dataFilters"
                    @remove="removeSimpleFilterAndReload($event.field,$event.value)"
            ></rocket-field-filter-display>

        </div>
        <v-divider></v-divider>

        <v-data-table
                      :headers="fieldHeaders"
                      :items="recordSet.data || []"
                      :loading="initialLoading"
                      hide-actions

        >
            <template slot="headerCell" scope="props">
                <span v-tooltip:bottom="{ 'html': props.header.label }">
                  {{ props.header.shortLabel }}
                </span>

                <rocket-field-actions v-if="props.header.value!==''"
                        :field-id="props.header.value"
                        @apply="processFieldAction($event)"
                        class="rocket_table_field_actions"
                        :data-filters="dataFilters"
                        :sort-state="sortState"
                        :definition="definition"
                ></rocket-field-actions>
            </template>
            <template slot="items" scope="props">

                <td v-for="field in definition.fields" :key="field.fieldId"
                    :class="{'text-xs-right':!fieldPositionLeft(field)}"
                >
                    <rocket-field-value
                            :field="field"
                            :record="props.item"
                            :field-filters="filters?filters[field.fieldId]:[]"
                            :value-modifier="valueModifiers?valueModifiers[field.fieldId]:null"
                    ></rocket-field-value>
                </td>

                <td v-if="rowMenu && rowMenu.length>0">
                    <rocket-row-menu
                        :row-menu="rowMenu"
                        :definition="definition"
                        :record="props.item"
                        :state="getRecordRetrievalParameters().state"
                    ></rocket-row-menu>


                </td>

            </template>
        </v-data-table>
        <v-divider></v-divider>
        <rocket-pager
                :page-number="pageNumber"
                :total-pages="totalPages"
                :total-records="totalItems"
                :pages="pages"
                :page-size="rowsPerPage"
                :page-size-options="pageSizeOptions"
                @pageJump="pageJump($event)"
                @pageSize="setPageSize($event)"
        ></rocket-pager>

    </v-card>
</templatew>
<style>
.rocket_table_field_actions i{
    font-size: 16px;
    vertical-align: sub;
    display: inline-block;
}

</style>
<script>
    import DataProviderMixin from '../mixins/RocketDataProviderMixin';
    import GetRecordsMixin from '../mixins/RocketDataGetRecordsMixin';
    import PagingMixin from '../mixins/RocketDataPagingMixin';
    import ValueDisplayMixin from '../mixins/RocketDataValueDisplayMixin';
    import SortMixin from '../mixins/RocketDataSortMixin';
    import SortStateFunctions from '../mixins/SortStateFunctionsMixin';
    import DataFilterMixin from '../mixins/RocketDataFilterMixin';
    import MenuMixin from '../mixins/RocketDataMenuMixin';
    import InitialDisplayStateMixin from '../mixins/RocketDataInitialDisplayStateMixin';
    import SelectorMixin from '../mixins/RocketDataSelectorMixin';

    export default{
        props : {
            title : String
        },
        data(){
           return {
               pagination : {}
           }
        },
        mixins : [InitialDisplayStateMixin,DataFilterMixin,DataProviderMixin,GetRecordsMixin,PagingMixin,ValueDisplayMixin,SortMixin,SortStateFunctions,MenuMixin,SelectorMixin],
        mounted(){
            this.numPageButtons=4;

        },
        computed : {

            fieldHeaders(){
                const headers=[];
                if(this.definition&&this.definition.fields){
                    if(this.enableSelection){
                        headers.push({
                            selector:true,
                            sortable : false
                        });
                    }
                    Object.keys(this.definition.fields).forEach((fieldId)=>{
                        const field=this.definition.fields[fieldId];

                        headers.push({
                            label : field.label,
                            shortLabel : !field.shortLabel?field.label:field.shortLabel,
                            align : this.fieldPositionLeft(field)?'left':'right',
                            sortable : false,
                            value : field.fieldId,
                        });


                    });

                }
                return headers;
            }
        },
        methods : {
            processFieldAction(action){
                this.removeSimpleFilter(action.field);

                for(let filter of action.filters){
                   if(filter.value!==''){
                       this.addSimpleFilter(action.field,filter.value,filter.operator);
                   }
               }

               if(action.sortState!==null){
                   this.setSortEntry(action.field.fieldId,action.sortState.direction);
               }else{
                   this.removeSortField(action.field,false);
               }

               this.loadData(1);

            },
            fieldPositionLeft(field){
                return field.dataType!=='int'&&field.dataType!=='currency'&&field.dataType!=='decimal';
            },
            definitionLoaded(){
                this.pagination.rowsPerPage=this.definition.pageSize;
            },
            dataLoaded(){
                this.pagination.rowsPerPage=this.recordSet.pageSize;
            },
            renderDataTable(h){
                const scopedSlots={};
                scopedSlots['headerCell']=(props)=>{
                    const content=[];
                    if(props.header.selector){
                        content.push(h('td',{},[
                            h('v-checkbox',{
                                props:{
                                    color:'primary',
                                    hideDetails:true,
                                    inputValue:this.isAllSelected(),
                                    indeterminate:this.isSomeSelected()
                                },
                                on:{
                                    change:(selected)=>{
                                        if(!selected)
                                            this.clearSelected();
                                        else
                                            this.recordSelected(selected,this.recordSet.data);
                                    }
                                }
                            })
                        ]));
                    }else{
                        if(props.header.shortLabel!==props.header.label){
                            content.push(h('v-tooltip',{
                                props:{
                                    bottom:true
                                }
                            },[
                                h('span',{
                                    slot:'activator'
                                },props.header.shortLabel),
                                h('span',{},props.header.label)
                            ]));
                        }else {
                            content.push(h('span', {}, props.header.shortLabel));
                        }


                        content.push(h('rocket-field-actions',{
                            class : ['rocket_table_field_actions'],
                            props : {
                                fieldId : props.header.value,
                                dataFilters : this.dataFilters,
                                sortState : this.sortState,
                                definition : this.definition,
                            },
                            on:{
                                apply : (event)=>{
                                    this.processFieldAction(event);
                                }
                            }
                        }));

                    }

                    return content;
                };

                scopedSlots['items']=(props)=>{
                    const content=[];
                    if(this.enableSelection){

                        content.push(h('td',{},[
                            h('v-checkbox',{
                                props:{
                                    color:'primary',
                                    hideDetails:true,
                                    inputValue:this.isRecordSelected(props.item)
                                },
                                on:{
                                    change:(selected)=>{
                                        this.recordSelected(selected,props.item);
                                    }
                                }
                            })
                        ]));

                    }

                    for(let fieldId of Object.keys(this.definition.fields)){

                        const field=this.definition.fields[fieldId];
                        content.push(h('td',{
                            class : {
                                'text-xs-right':!this.fieldPositionLeft(field)
                            }
                        },[h('rocket-field-value',{
                            props:{
                                field,
                                record:props.item,
                                fieldFilters:this.filters?this.filters[field.fieldId]:[],
                                valueModifier:this.valueModifiers?this.valueModifiers[field.fieldId]:null
                            }
                        })]));
                    }

                    if(this.rowMenu && this.rowMenu.length>0){
                        content.push(h('td',{},[h('rocket-row-menu',{
                            props:{
                                rowMenu:this.rowMenu,
                                definition:this.definition,
                                record : props.item,
                                state : this.getRecordRetrievalParameters().state
                            }
                        })]))
                    }

                    return content;
                };

                return h('v-data-table',{
                    props : {
                        headers : this.fieldHeaders,
                        items : this.recordSet.data || [],
                        loading : this.initialLoading,
                        hideActions : true,
                    },
                    scopedSlots,
                    on: {
                        input:(val)=>{
                            this.recordSelected(true,val);
                        }
                    }
                });
            },
            renderPager(h){
                return [h('v-divider'),h('rocket-pager',{
                    props:{
                        pageNumber:this.pageNumber,
                        totalPages:this.totalPages,
                        totalRecords:this.totalItems,
                        pages:this.pages,
                        pageSize:this.rowsPerPage,
                        pageSizeOptions:this.pageSizeOptions
                    },
                    on : {
                        pageJump : (event)=>{
                            this.pageJump(event);
                        },
                        pageSize : (event)=>{
                            this.setPageSize(event);
                        }
                    }
                })];

            },
            renderTitle(h){
                const titleChildren=[];
                titleChildren.push(h('div',{class:'headline'},this.title));
                titleChildren.push(h('v-spacer'));
                const refresh=h('v-btn',{
                    props:{
                        icon:true
                    },
                    on:{
                        click : ()=>{
                            this.loadData();
                        }
                    },
                    slot:'activator'
                },[h('v-icon',{},'refresh')]);


               titleChildren.push(h('v-tooltip',{
                    props:{
                        bottom:true
                    }
                },[refresh,h('span',{},'Refresh')]));





                titleChildren.push(h('rocket-main-menu',{
                    props : {
                       mainMenu:this.mainMenu,
                       state:this.getRecordRetrievalParameters().state
                    }
                }));

                return h('v-card-title',{},titleChildren);
            },
            renderActions(h){
                const actions=[];

                actions.push(h('rocket-field-sort',{
                    props : {
                        sortState:this.sortState,
                        definition:this.definition,
                    },
                    on:{
                        toggle:(event)=>{
                            this.toggleSortField(event);
                        },
                        add:(event)=>{
                            this.addSortField(event);
                        },
                        'add-after':(event)=>{
                            this.addSortFieldAfter(event.afterFieldId,event.field)
                        },
                        remove:(event)=>{
                            this.removeSortField(event)
                        },
                        clear:()=>{
                            this.clearSort();
                        }
                    }
                }));

                actions.push(h('rocket-field-filter-display',{
                    props : {
                        definition:this.definition,
                        dataFilters:this.dataFilters,
                    },
                    on:{
                        remove : (event)=>{
                            this.removeSimpleFilterAndReload(event.field,event.value);
                        }
                    }
                }));

                return [h('div',{class:['ml-3','mr-3','text-xs-left']},actions),h('v-divider')];
            }
        },


        render(h){

            return h('v-card',{},[this.renderTitle(h),this.renderActions(h),this.renderDataTable(h),this.renderPager(h)]);
        }
    }
</script>
