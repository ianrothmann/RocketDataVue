<template>
    <span>
        <span v-if="values.length===0" class="grey--text">
            -
        </span>
         <v-menu v-else v-model="showMore" lazy absolute>
              <template v-slot:activator="{ on }">
                    <span v-on="on">{{values[0][descriptor]}}<span class="grey--text" v-html="moreText" style="cursor:pointer"></span></span>
             </template>
             <v-list dense>
                 <v-list-tile v-for="value in values" :key="value[descriptor]">
                        {{value[descriptor]}}
                 </v-list-tile>
             </v-list>
         </v-menu>
    </span>

</template>
<script>
    export default{
        props : {
            values : {type:Array, required:true},
            descriptor : String
        },
        computed:{
           moreText(){
               let val='';
               if(this.values.length>1)
                   val+=' and '+(this.values.length-1)+' more...';
               return val;
           }
        },
        data(){
            return {
                showMore : false
            }
        },
        methods:{
            downloadFile(file){
                window.open(file.url,'_blank');
            }
        }
    }
</script>
