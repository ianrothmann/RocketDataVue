<template>
 <span>
  <span v-if="(field.canQuery||field.canOrder)&&fieldTypeEligable">
       <v-menu ref="menu" :close-on-content-click="false">

     <v-icon slot="activator" :class="{'info--text':active}">filter_list</v-icon>
     <v-card>
             <rw-subheader>{{label}}</rw-subheader>
         <v-divider></v-divider>

             <div class="pl-3 pr-3 pb-3" v-if="filterType==='search'&&field.canQuery">
                 <rw-input prepend-icon="search" label="Search" hide-details v-model="searchTerm"></rw-input>
                 <br>
                 <v-btn-toggle small :input-value="searchOperatorIdx" @change="updateSearchOperator($event)">
                    <v-btn flat v-for="operator in operators" :key="operator.value">
                        {{operator.text}}
                    </v-btn>
                 </v-btn-toggle>

             </div>

             <div class="rw_field_actions_filter_container" v-if="filterType==='select'&&field.canQuery" ref="filterContainer">
                  <v-divider></v-divider>
                      <v-text-field
                              class="mt-1 mb-1"
                              prepend-icon="search"
                              label="Search"
                              v-model="filterSearch"
                              full-width
                              single-line
                              full-width
                              hide-details
                      ></v-text-field>
             <v-divider></v-divider>
                 <v-list dense>
                     <v-list-tile avatar v-for="item in pagedFilterList" :key="item.value" @click="toggleFilterValue(item[field.filterListQueryPrimaryKey])">
                        <v-list-tile-action>
                          <v-checkbox :value="item[field.filterListQueryPrimaryKey]" :input-value="filterValue"></v-checkbox>
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>{{item[field.filterListQueryDescriptor]}}</v-list-tile-title>
                        </v-list-tile-content>
                  </v-list-tile>
                 </v-list>
             </div>
             <v-divider v-if="field.canOrder"></v-divider>
              <v-list dense v-if="field.canOrder">
                     <v-subheader>Sort options</v-subheader>
                     <v-list-tile avatar @click="setSort('asc')">
                            <v-list-tile-action>
                              <v-icon :class="{'primary--text':innerSortState!==null&&innerSortState.direction==='asc'}">arrow_downwards</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                              <v-list-tile-title :class="{'primary--text':innerSortState!==null&&innerSortState.direction==='asc'}">Sort {{getAscDescription(field)}}</v-list-tile-title>
                            </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile avatar @click="setSort('desc')">
                            <v-list-tile-action>
                              <v-icon :class="{'primary--text':innerSortState!==null&&innerSortState.direction==='desc'}">arrow_upwards</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                              <v-list-tile-title :class="{'primary--text':innerSortState!==null&&innerSortState.direction==='desc'}">Sort {{getDescDescription(field)}}</v-list-tile-title>
                            </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile avatar @click="setSort(null)" v-if="innerSortState!==null">
                            <v-list-tile-action>
                              <v-icon>delete</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                              <v-list-tile-title>Remove sort</v-list-tile-title>
                            </v-list-tile-content>
                      </v-list-tile>
                 </v-list>
                 <v-divider></v-divider>

                <rw-btn primary flat small @click="save()">Apply</rw-btn>
                <rw-btn error flat @click="clear()" small>Clear</rw-btn>
                <rw-btn flat @click="close()" small>Close</rw-btn>
    </v-card>
 </v-menu>
  </span>

 </span>
</template>
<style>
    .rw_field_actions_filter_container{
        max-height: 400px;
        overflow-y: auto;
    }
</style>
<script>
    import SortStateFunctions from '../../mixins/SortStateFunctionsMixin';
    import CommonFilterFunctionsMixin from '../../mixins/CommonFilterFunctionsMixin';
    export default{
        props : {
            fieldId : String,
            sortState : Array,
            definition : Object,
            dataFilters : Object
        },
        computed:{
            label(){
               return this.field.label;
            },
            active(){
                const sortState=this.getSortEntry(this.fieldId);
                return this.fieldDataFilter!==null || (sortState!==null);
            },
            fieldTypeEligable(){
                return this.field.dataType!=='file'&&this.field.dataType!=='files'&&this.field.dataType!=='image'&&this.field.dataType!=='images';
            },
            field(){
                if(this.definition&&this.definition.fields)
                    return this.definition.fields[this.fieldId];
                else
                  return null;
            },
            filterType(){
                if(this.field.dataType==='enum'||this.field.dataType==='boolean'){
                    return 'select';
                }else if((this.field.dataType==='select'||this.field.dataType==='multiselect')){//&&this.filterList.length<50){
                    return 'search';
                    //return 'select';//ToDO
                }else{
                    return 'search';
                }
            },
            filterList(){
                return (this.field.filterList).filter((item)=>{
                    if(this.filterSearch!=''){
                        return item[this.field.filterListQueryDescriptor].toLowerCase().indexOf(this.filterSearch.toLowerCase())>-1;
                    }else{
                        return true;
                    }
                });
            },
            operators(){
                const oper=[];

                for(let operator of this.field.queryOperators){
                    oper.push({
                        value : operator,
                        text : this.describeOperator(this.field.dataType,operator)
                    });
                }

                return oper;
            },
            fieldDataFilter(){
                return this.dataFilters[this.fieldId] || null;
            },
            numScrollPages(){
               return Math.ceil(this.filterList.length/this.scrollPageSize);
            },
            pagedFilterList(){
               /* const startScrollPage=this.scrollPage>1?this.scrollPage-1:this.scrollPage;
                const endScrollPage=this.scrollPage<this.numScrollPages?this.scrollPage+1:this.scrollPage;
                const start=(this.scrollPageSize)*(startScrollPage-1);
                const end=(this.scrollPageSize)*(endScrollPage-1);
                console.log(start,' - ',end);
                */
               const start=0;
               const end=this.scrollPage*this.scrollPageSize;
               return this.filterList.slice(start,end);

            },
            searchOperatorIdx(){
                for(let i=0;i<this.operators.length;i++){
                    if(this.operators[i].value===this.searchOperator)
                        return i;
                }
                return -1;
            }
        },
        data(){
            return {
                filterSearch : '',
                filterValue : [],
                searchTerm : '',
                searchOperator : null,
                innerSortState : null,
                scrollPage : 1,
                scrollPageSize : 20,
                scrollProcessing : false
            }
        },
        mounted(){

            this.selectDefaultOperator();

            this.$watch('sortState',()=>{
               this.populateSort();
            });
            this.populateSort();

            this.$watch('dataFilters',()=>{
               this.populateDataFilters();
            });
            this.populateDataFilters();

            if(this.$refs.filterContainer){
                this.$refs.filterContainer.addEventListener('scroll',this.filterScrollHandler);
            }

        },
        beforeDestroy(){
            if(this.$refs.filterContainer){
                this.$refs.filterContainer.removeEventListener('scroll',this.filterScrollHandler);
            }
        },
        mixins : [SortStateFunctions,CommonFilterFunctionsMixin],
        methods : {
          updateSearchOperator(value){
              this.searchOperator=this.operators[value].value;
          },
          filterScrollHandler(e){

              const scrollPerc=e.target.scrollTop/(e.target.scrollHeight-e.target.clientHeight);
              if(!this.scrollProcessing&&scrollPerc===1){
                  this.scrollProcessing=true;

                  if(this.scrollPage<this.numScrollPages){
                      this.scrollPage++;
                      setTimeout(()=>{
                          this.scrollProcessing=false;
                      },500);

                  }
//TODO: Better scroll paging
              }/*else if(!this.scrollProcessing&&scrollPerc===0){
                  this.scrollProcessing=true;
                  if(this.scrollPage>1){
                      this.scrollPage--;
                      this.scrollProcessing=false;

                  }

              }*/

          },
          resetPaging(){
              this.scrollPage=1;
          },
          populateSort(){
              const sort=this.getSortEntry(this.fieldId);
              if(sort===null){
                  this.innerSortState=sort;
              }else{
                  this.innerSortState=Object.assign({},sort);
              }
          },
          populateDataFilters(){
              if(this.fieldDataFilter!==null){
                  if(this.filterType==='search'){
                      this.searchOperator=this.fieldDataFilter.operator;
                      this.searchTerm=this.fieldDataFilter.value;
                  }else if(this.filterType==='select'){
                      for(let key of Object.keys(this.fieldDataFilter)){
                          this.filterValue.push(this.fieldDataFilter[key].value);
                      }
                  }
              }else{
                  if(this.filterType==='search'){
                      this.searchTerm='';
                  }else if(this.filterType==='select'){
                      this.filterValue=[];
                  }
              }
          },
          setSort(direction){
             if(direction==null){
                 this.innerSortState=null;
             }else {
                 this.innerSortState={
                     fieldId : this.fieldId,
                     direction
                 }
             }

          },
          selectDefaultOperator(){
              if(this.operators.length>0){
                  this.searchOperator=this.field.defaultQueryOperator || this.operators[0];
              }
          },
          toggleFilterValue(value){
              const idx=this.filterValue.indexOf(value);
             if(idx>-1){
                 this.filterValue.splice(idx, 1);
             }else{
                 this.filterValue.push(value);
             }
          },
          save(){
             let filters=[];
             if(this.filterType==='search'){
               filters=[
                     {
                         value: this.searchTerm,
                         operator: this.searchOperator,
                     }
                 ];
             }else if(this.filterType==='select'){
                 for(let value of this.filterValue){

                     filters.push({
                         value,
                         operator: 'eq',
                     });
                 }
             }
              this.$emit('apply',{
                  filterType : this.filterType,
                  field : this.field,
                  filters,
                  sortState: this.innerSortState
              });

             this.close();
          },
          close(){
              this.resetPaging();
              this.$refs['menu'].isActive=false;
          },
          clear(){
              this.searchTerm='';
              this.filterValue=[];
              this.innerSortState=null;
          }
        }
    }
</script>