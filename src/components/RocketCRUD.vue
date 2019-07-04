<script>
    export default{
        props : {
            url : {
              required : true,
              type : String
            },
            id : String,
            title : String,
            displayType : {
                type : String,
                default : 'table'
            },
            canEdit : {
                type : Boolean,
                default : true
            },
            canView : {
                type : Boolean,
                default : true
            },
            canAdd : {
                type : Boolean,
                default : true
            },
            canDelete : {
                type : Boolean,
                default : true
            },
            rowMenu : {
                type : Array
            },
            mainMenu : {
                type : Array
            },
            viewMenu : {
                type : Array
            },
            displayModifiers : Object,
            displayFilters : Object,
            createModifiers : Object,
            editModifiers : Object,
            viewModifiers : Object,
            createSlots : Array,
            editSlots : Array,
            viewSlots : Array,
            //RocketList Only
            titleField : {type:String},
            actionTextField : {type:String},
            subTitleField : {type:String},
        },
        mixins : [],
        data(){
           return {
               currentState : 'display',
               selectedRecord : null,
               selectedID : null,
               lastDisplayState : null,
               showDelete : false,
               crudID : null,
               renderMasterDetail:true,
           }
        },
        computed : {
           finalMainMenu(){
               let menu=[];
               if(this.canAdd){
                   menu.push({
                       label : 'Add...',
                       icon : 'add',
                       closure : function(state){
                           this.currentState='add';
                           this.lastDisplayState=JSON.parse(JSON.stringify(state));
                       }.bind(this)
                   });
               }

               if(this.mainMenu){
                   if(this.canAdd)
                       menu.push({}); //separator

                   menu=menu.concat(this.mainMenu);
               }

               return menu;
           },
           finalRowMenu(){
               let menu=[];

               if(this.canView){
                   menu.push({
                       label : 'View...',
                       icon : 'toc',
                       closure : function(id,record,state){
                           this.selectedID=id;
                           this.selectedRow=record;
                           this.currentState='view';
                           this.lastDisplayState=JSON.parse(JSON.stringify(state));
                       }.bind(this)
                   });
               }

               if(this.canEdit){
                   menu.push({
                       label : 'Edit...',
                       icon : 'mode_edit',
                       closure : function(id,record,state){
                           this.selectedID=id;
                           this.selectedRow=record;
                           this.currentState='edit';
                           this.lastDisplayState=JSON.parse(JSON.stringify(state));
                       }.bind(this)
                   });
               }
               if(this.canDelete){
                   menu.push({
                       label : 'Delete...',
                       icon : 'delete',
                       closure : this.deleteRecord
                   });
               }

               if(this.rowMenu){
                   if(this.canEdit||this.canDelete||this.canView)
                       menu.push({}); //separator

                   menu=menu.concat(this.rowMenu);
               }

               return menu;
           },
           finalViewMenu(){
               let menu=[];

               if(this.displayMode==='list'){
                   if(this.canDelete){
                       menu.push({
                           label : 'Delete...',
                           icon : 'delete',
                           closure : this.deleteRecord
                       });
                   }
               }

               if(this.viewMenu){
                   if(this.canDelete&&this.displayMode==='list')
                       menu.push({}); //separator

                   menu=menu.concat(this.viewMenu);
               }

               return menu;
           }
        },
        created(){
            this.crudID=this.id || RocketEventHub.getUniqueID('display');
            this.renderMasterDetail=this.displayType==='list';
        },
        methods : {
            deleteRecord(id,record,state,e){
                this.selectedID=id;
                this.selectedRow=record;
                this.lastDisplayState=JSON.parse(JSON.stringify(state));
                this.showDelete=true;
            },
            renderDisplay(h){
               if(this.displayType==='table'){
                   return this.renderTable(h);
               }else if(this.displayType==='list'){
                   return this.renderList(h);
               }
            },
            renderTable(h){
                return h('rocket-data-table',{
                  props : {
                      url : this.url,
                      rowMenu : this.finalRowMenu,
                      mainMenu : this.finalMainMenu,
                      id : this.crudID,
                      title : this.title,
                      initialDisplayState : this.lastDisplayState,
                      valueModifiers : this.displayModifiers,
                      filters : this.displayFilters,
                  }
                });
            },
            renderList(h){
                return h('rocket-list',{
                  props : {
                      url : this.url,
                    //  rowMenu : this.finalRowMenu,
                      mainMenu : this.finalMainMenu,
                      id : this.crudID,
                      title : this.title,
                      titleField : this.titleField,
                      subTitleField : this.subTitleField,
                      actionTextField : this.actionTextField,
                      initialDisplayState : this.lastDisplayState,
                      valueModifiers : this.displayModifiers,
                      filters : this.displayFilters,
                  },
                  on : {
                      selected : (record)=>{
                          this.selectedID=record.id;
                          this.selectedRecord=record.record;
                          this.currentState='view';
                      }
                  }
                });
            },
            renderView(h){
                return h('rocket-view-edit',{
                    props : {
                        url : this.url,
                        value : this.selectedID,
                        title : this.title,
                        backButton : true,
                        backButtonHint : 'Back to '+this.title,
                        viewModifiers : this.viewModifiers,
                        viewSlots : this.viewSlots,
                        editModifiers : this.editModifiers,
                        editSlots : this.editSlots,
                        menu : this.finalViewMenu
                    },
                    scopedSlots : this.$scopedSlots,
                    on : {
                        back : ()=>{
                            this.currentState='display';
                            RocketEventHub.refresh(this.crudID);
                        }
                    }
                });
            },
            renderEdit(h){
                return h('rocket-view-edit',{
                    props : {
                        url : this.url,
                        value : this.selectedID,
                        title : this.title,
                        backButton : true,
                        backButtonHint : 'Back to '+this.title,
                        initialEdit:true,
                        viewModifiers : this.viewModifiers,
                        viewSlots : this.viewSlots,
                        editModifiers : this.editModifiers,
                        editSlots : this.editSlots,
                        menu : this.finalViewMenu
                    },
                    on : {
                        back : ()=>{
                            this.currentState='display';

                        }
                    },
                    scopedSlots : this.$scopedSlots
                });
            },
            renderAdd(h){
                const add=h('rocket-form',{
                    props : {
                        url : this.url,
                        operation : 'add',
                        createModifiers : this.createModifiers,
                        createSlots : this.createSlots,
                    },
                    scopedSlots : this.$scopedSlots,
                    on : {
                        input : (id)=>{
                            RocketEventHub.refresh(this.crudID);
                            this.selectedID=id;
                            this.currentState='view';
                        },
                        cancel : ()=>{
                            this.currentState='display';

                        }
                    }
                });

                return h('rw-card',{
                   props : {
                       title : this.title+ ': Add new'
                   }
                },[add]);
            },
            renderDelete(h){
                return h('rocket-delete',{
                    props : {
                      value : this.selectedID,
                      url : this.url,
                    },
                    on : {
                        cancel : ()=>{
                            this.showDelete=false;

                        },
                        'delete' : ()=>{
                            this.showDelete=false;
                            RocketEventHub.refresh(this.crudID);
                        },
                    }
                });
            },
            renderDisplayLayout(h,children){
                if(this.displayType==='list'){
                    return h('s-cell',{
                        props : {
                            md:4
                        }
                    },[children]);
                }else{
                    return children;
                }
            },
            renderDetailLayout(h,children){
                if(this.displayType==='list'){
                    return h('s-cell',{
                        props : {
                            md:8
                        }
                    },[children]);
                }else{
                    return children;
                }
            }
        },
        render(h){
            const children=[];
            if(this.renderMasterDetail){
                children.push(this.renderDisplayLayout(h,this.renderDisplay(h)));
                if(this.currentState==='display'){
                    //Empty placeholder
                   // children.push(this.renderDetailLayout(h,this.renderView(h)));
                }


                if(this.currentState==='view')
                    children.push(this.renderDetailLayout(h,this.renderView(h)));
                else if(this.currentState==='edit')
                    children.push(this.renderDetailLayout(h,this.renderEdit(h)));
                else if(this.currentState==='add')
                    children.push(this.renderDetailLayout(h,this.renderAdd(h)));

                if(this.showDelete){
                    children.push(this.renderDelete(h));
                }
                return h('s-grid',{props:{

                }},children);
            }else{
                if(this.currentState==='display')
                    children.push(this.renderDisplay(h));
                else if(this.currentState==='view')
                    children.push(this.renderView(h));
                else if(this.currentState==='edit')
                    children.push(this.renderEdit(h));
                else if(this.currentState==='add')
                    children.push(this.renderAdd(h));

                if(this.showDelete){
                    children.push(this.renderDelete(h));
                }

                return h('div',{},children);
            }

        }
    }
</script>
