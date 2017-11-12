<template>
          <div class="datatable__actions">
              <div class="text-xs-left" style="align-self: center;flex:auto">
                  <slot name="pager-actions"></slot>
              </div>
            <div class="datatable__actions__select">{{pageSizeText || 'Rows per page'}}:<v-select
                    hide-details
                    :items="pageSizeOptions"
                    :value="rowsPerPage"
                    single-line
                    bottom
                    @change="setPageSize($event)"
            ></v-select></div>
            <div class="datatable__actions__pagination">

                <rw-menu offset-y v-if="totalPages>1">
                    <span slot="activator">{{displayPageRecords(pageNumber)}} of {{totalRecords}}</span>
                    <rw-list>
                        <rw-list-item :title="displayPageRecords(page)"  @click="pageJump(page)" v-for="page in pages" :key="page"></rw-list-item>
                    </rw-list>
                </rw-menu>
                <span v-else>{{displayPageRecords(pageNumber)}} of {{totalRecords}}</span>
            </div>
            <v-btn icon :disabled="pageNumber<=1" @click.native="pageDown()"><v-icon>chevron_left</v-icon></v-btn>

            <v-btn icon :disabled="pageNumber>=totalPages" @click.native="pageUp()"><v-icon>chevron_right</v-icon></v-btn>
        </div>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        props : {
            pageNumber : Number,
            totalPages : Number,
            totalRecords : Number,
            pageSizeOptions : Array,
            pageSize : Number,
            pages : Array,
            pageSizeText : String

        },
        data(){
            return {
                rowsPerPage : 20
            }
        },
        watch:{
           pageSize(){
                this.rowsPerPage=this.pageSize;
           },
           rowsPerPage(){
               this.$emit('pageSize',this.rowsPerPage);
           }
        },
        mounted(){
            this.rowsPerPage=this.pageSize;
        },
        methods : {
            pageDown(){
                if(this.pageNumber>1)
                    this.pageJump(this.pageNumber-1);
            },
            pageUp(){
                if(this.pageNumber<this.totalPages)
                    this.pageJump(this.pageNumber+1);
            },
            pageJump(page){
                this.$emit('pageJump',page);
            },
            setPageSize(size){
                this.$emit('pageSize',size);
            },
            displayPageRecords(pageNumber){
                let base=this.pageSize*pageNumber;
                if(base===0||isNaN(base))
                    return '0';

                return (base-this.pageSize+1) + ' to ' + (this.totalRecords<base?this.totalRecords:base);
            }
        }
    }
</script>
