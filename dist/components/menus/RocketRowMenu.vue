<template>
    <v-menu lazy absolute bottom left>
        <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" v-if="processedRowMenu.length>0"><v-icon>more_vert</v-icon></v-btn>
        </template>
        <v-list dense>
            <div v-for="(item,index) in processedRowMenu" :key="index">
                <v-list-tile @click="executeItem(item,$event)" v-if="item.label">
                    <v-list-tile-content>{{item.label}}</v-list-tile-content>
                    <v-list-tile-action v-if="item.icon"><v-icon>{{item.icon}}</v-icon></v-list-tile-action>
                </v-list-tile>
                <v-divider v-else></v-divider>
            </div>

        </v-list>
    </v-menu>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        props : {
            definition : Object,
            record : Object,
            rowMenu : Array,
            state : Object,

        },
        computed : {
           processedRowMenu(){
               const menu=[];
               let idx=0;
               for(let item of this.rowMenu){
                   if((!item.hasOwnProperty('show')||item.show(this.record,this.state))){
                       if(item.label||idx<this.rowMenu-1)
                        menu.push(item);
                   }
                   idx++;
               }

               return menu;
           }
        },
        methods : {
            executeItem(item,e){
                this.$emit('itemClicked',{
                    item,e,
                    record:this.record,
                    id:this.record[this.definition.recordId]
                });
                item.closure(this.record[this.definition.recordId],this.record,this.state,e)
            }
        }
    }
</script>
