export default {
    props : {
        pageButtons : {
            type : Number,
            'default' : 6
        }
    },
    data(){
        return {
            pageNumber : 1,
            numPageButtons : 6,
            rowsPerPage : null,
        }
    },
    computed:{
        pages(){
            if(!this.recordSet.numberOfPages)
                return null;
            const numPageButtons=this.numPageButtons;
            const pages=[];
            if(this.recordSet.numberOfPages < numPageButtons){
                for(let i = 1; i <= this.recordSet.numPages; i++)
                    pages.push(i);
            }else{
                let start=this.pageNumber-(numPageButtons/2);

                if(start<1)
                    start=1;

                let end=start+numPageButtons;

                if(end>this.recordSet.numberOfPages){
                    end=this.recordSet.numberOfPages;
                    start=end-numPageButtons;
                }

                if(start<1)
                    start=1;

                if(start!==1)
                    pages.push(1);


                for(let i = start; i <= end; i++)
                    pages.push(i);

                if(end<this.recordSet.numberOfPages){
                    pages.push(this.recordSet.numberOfPages);
                }

            }

            return pages;
        },
        totalPages(){
            return this.recordSet!==null ? this.recordSet.numberOfPages : 0;
        },
        pageSize(){
            return this.recordSet!==null ? this.recordSet.numberOfPages : 0;
        },
        pageSizeOptions(){
            if(this.definition){
                return this.definition.pageSizeOptions;
            }
        },
        totalItems(){

            if(this.recordSet&&this.recordSet.totalRowCount){
                return this.recordSet.totalRowCount;
            }else{
                return 0;
            }
        }
    },
    methods : {

        displayPageRecords(pageNumber){
            const base=this.recordSet.pageSize*pageNumber;
            if(base===0||isNaN(base))
                return '0 to 0';
            return (base-this.recordSet.pageSize+1) + ' to ' + base;
        },
        pageJump(pageNumber){
            this.pageNumber=pageNumber;
            this.loadData();
        },
        pageDown(){
            if(this.pageNumber>1)
                this.pageJump(this.pageNumber-1);
        },
        pageUp(){
            if(this.pageNumber<this.totalPages)
                this.pageJump(this.pageNumber+1);
        },
        setPageSize(size){
            this.rowsPerPage=size;
            this.loadData();
        },
    },
    mounted(){
        this.numPageButtons=this.pageButtons;
    }
}