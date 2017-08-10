export default {
    props : {
        url : {
            required:true,
            type : String
        }
    },
    data(){
        return {
            definition : null,
            loading : false,
            initialLoading : true,
        }
    },
    methods : {
        dataProvider(command){
            this.loading=true;
            return this.$http.post(this.url, command).then((response)=>{
                if(this.definition===null&&response.body.definition){
                    this.definition=response.body.definition;
                    this.initialLoading=false;
                    if (typeof this.definitionLoaded === 'function') {
                        this.definitionLoaded();
                    }
                }
                this.loading=false;
                return response.body;
            });
        }
    }
}