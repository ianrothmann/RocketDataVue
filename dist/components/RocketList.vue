<template>
    <div>
        <rw-toolbar :title="title">
            <rw-btn icon="search" @click.native="toggleSearch()"></rw-btn>

            <rw-btn icon="navigate_before" @click.native="pageDown()" :disabled="pageNumber<=1"></rw-btn>
            <rw-btn icon="navigate_next" @click.native="pageUp()" :disabled="pageNumber>=totalPages"></rw-btn>
            <rocket-main-menu :main-menu="mainMenu" :state="getRecordRetrievalParameters().state"></rocket-main-menu>
        </rw-toolbar>


        <v-card class="scroll-list">
            <v-list :two-line="hasSubtitleField">
                <rw-input v-if="showSearch" placeholder="Search" prepend-icon="search" @input="searchTitle($event)" full-width></rw-input>
                <v-list-tile v-for="(record,recordIndex) in recordSet.data" :key="recordKey(record,recordIndex)" @click.native="selectRow(record)">
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <rocket-field-value
                                    :field="definition.fields[titleField]"
                                    :record="record"
                                    :field-filters="filters?filters[titleField]:[]"
                                    :value-modifier="valueModifiers?valueModifiers[titleField]:null"
                            ></rocket-field-value>
                        </v-list-tile-title>
                        <v-list-tile-sub-title v-if="hasSubtitleField">
                            <rocket-field-value
                                    :field="definition.fields[subTitleField]"
                                    :record="record"
                                    :field-filters="filters?filters[subTitleField]:[]"
                                    :value-modifier="valueModifiers?valueModifiers[subTitleField]:null"
                            ></rocket-field-value>
                        </v-list-tile-sub-title>

                    </v-list-tile-content>
                    <v-list-tile-action v-if="hasActionText">
                        <v-list-tile-action-text>
                            <rocket-field-value
                                    :field="definition.fields[actionTextField]"
                                    :record="record"
                                    :field-filters="filters?filters[actionTextField]:[]"
                                    :value-modifier="valueModifiers?valueModifiers[actionTextField]:null"
                            ></rocket-field-value>
                        </v-list-tile-action-text>
                    </v-list-tile-action>

                </v-list-tile>
            </v-list>
            <div class="text-xs-center mt-3" v-if="loading&&(!recordSet.hasOwnProperty('data')||recordSet.data.length===0)"><v-progress-circular indeterminate class="grey--text"></v-progress-circular></div>
            <div class="text-xs-center mt-3" v-if="!initialLoading&&(recordSet&&recordSet.data&&recordSet.data.length===0)"><span class="grey--text">No results found.</span></div>
        </v-card>
        <rocket-pager
                :page-number="pageNumber"
                :total-pages="totalPages"
                :total-records="totalItems"
                :pages="pages"
                :page-size="rowsPerPage"
                page-size-text="Show"
                :page-size-options="pageSizeOptions"
                @pageJump="pageJump($event)"
                @pageSize="setPageSize($event)"
        ></rocket-pager>
    </div>
</template>
<style>
    .scroll-list{
        min-height:80vh;
        max-height:80vh;
        overflow-y: auto;
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
    export default{
        props : {
            title : {type:String, required:true},
            titleField : {type:String, required:true},
            actionTextField : {type:String},
            subTitleField : {type:String},
        },
        mixins : [InitialDisplayStateMixin,DataFilterMixin,DataProviderMixin,GetRecordsMixin,PagingMixin,ValueDisplayMixin,SortMixin,SortStateFunctions,MenuMixin],
        data(){
            return {
                showSearch : false
            }
        },
        mounted(){
            this.numPageButtons=4;
        },
        computed : {
           hasSubtitleField(){
               return this.subTitleField&&this.subTitleField!='';
           },
           hasActionText(){
               return this.actionTextField&&this.actionTextField!='';
           }
        },
        methods : {
            searchTitle(term){
               this.debouncedSetSimpleFilterAndReload(this.definition.fields[this.titleField],term);
            },
            toggleSearch(){
                this.showSearch=!this.showSearch;
                if(!this.showSearch&&this.hasDataFilters){
                    this.removeSimpleFilterAndReload(this.definition.fields[this.titleField]);
                }
            },
            selectRow(record){
                let id=this.definition.recordId?record[this.definition.recordId]:null;

                this.$emit('selected',{
                    id,
                    record
                });
            }
        }
    }
</script>
