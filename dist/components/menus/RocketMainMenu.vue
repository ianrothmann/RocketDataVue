<template>
    <v-menu lazy absolute bottom left v-if="mainMenu && mainMenu.length>0">
        <template v-slot:activator="{ on }">
            <v-btn icon v-on="on"><v-icon>more_vert</v-icon></v-btn>
        </template>
        <v-list dense>
            <div v-for="(item,index) in mainMenu" :key="index">
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
            mainMenu : Array,
            state : Object,

        },
        methods : {
            executeItem(item,e){
                this.$emit('itemClicked',{
                    item,e
                });
                item.closure(this.state,e);
            }
        }
    }
</script>
