<template>
    <span>
        <span v-if="(location===null||location==='')&&locationObj!==null">-</span>
         <v-dialog max-width="60%" v-else v-model="showMap" lazy absolute>
             <v-btn icon slot="activator"><v-icon style="color:grey">location_on</v-icon></v-btn>
             <rw-map :value="locationObj" :center="locationObj" mode="view"></rw-map>
         </v-dialog>
    </span>

</template>
<style>
</style>
<script>
    export default{
        props : {
            location : {type:String, required:true},
        },
        data(){
            return {
                showMap : false
            }
        },
        computed:{
            locationObj(){
                let value=null;
                try{
                    value=JSON.parse(this.location);
                }catch (e){
                    console.error('Invalid location: ' + this.location);
                }
                return value;
            }
        }
    }
</script>
