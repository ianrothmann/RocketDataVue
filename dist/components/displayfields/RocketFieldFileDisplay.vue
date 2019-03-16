<template>
    <span>
        <span v-if="files.length===0" class="grey--text">
            -
        </span>
         <v-menu v-else v-model="showFiles" lazy absolute>
             <template v-slot:activator="{ on }">
                  <v-btn flat v-on="on" icon style="color:grey"><v-icon>folder</v-icon></v-btn>
             </template>
             <v-list dense>
                 <v-list-tile v-for="file in files" :key="file.fileid" @click.native="downloadFile(file)">
                     <v-list-tile-content>{{file.originalfilename}}</v-list-tile-content>
                     <v-list-tile-action><v-icon>file_download</v-icon></v-list-tile-action>
                 </v-list-tile>
             </v-list>
         </v-menu>

    </span>

</template>
<script>
    export default{
        props : {
            files : {type:Array, required:true},
        },
        data(){
            return {
                showFiles : false
            }
        },
        methods:{
            downloadFile(file){
                window.open(file.url,'_blank');
            }
        }
    }
</script>
