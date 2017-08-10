<template>
    <v-menu lazy absolute bottom left>
        <v-btn icon slot="activator"><v-icon>more_vert</v-icon></v-btn>
        <v-list dense>
            <div v-for="(item,index) in rowMenu" :key="index">
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
