export class SortFilterClass {

    sortFlag =  [0,0,0,0,0];

    sortTable(colNumber: any, colType: string, tableName: string) {
        var table, rows, switching, x, y, shouldSwitch, forLoopCounter: number;
        
        table = (<HTMLTableElement> document.getElementById(tableName)); 
        switching = true;
        forLoopCounter=0;
        
        //Take Current value of Flag, then set to next
        let ascFlag: any = this.sortFlag[colNumber];
        if (ascFlag === 0){
          this.sortFlag[colNumber]=1;
        }
        else {
          this.sortFlag[colNumber]=0;
        }
    
        /*Make a loop that will continue until
        no switching has been done:*/
        
        while (switching) {
          //start by saying: no switching is done:
          switching = false;
          rows = table.rows;
          /*Loop through all table rows (except the
          first, which contains table headers):
          2nd Row is Filter Row
          */
          for (let i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
    
            x = rows[i].getElementsByTagName("TD")[colNumber];
            y = rows[i + 1].getElementsByTagName("TD")[colNumber];
    
    
            //check if the two rows should switch place:
            if (ascFlag ==0) 
            {
    
              if (colType==='string'){
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                  //if so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  forLoopCounter=i;
                  break;
                }
      
              }
              else {//Number
                let a: number =  parseInt(x.innerHTML);
                let b: number = parseInt(y.innerHTML);
                if (a>b){
                  //if so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  forLoopCounter=i;
                  break;
                }
    
              }
      
    
            }
            else
            {
              if (colType==='string'){
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                  //if so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  forLoopCounter=i;
                  break;
                }
      
              }
              else{//Number
                let a: number =  parseInt(x.innerHTML);
                let b: number = parseInt(y.innerHTML);
                if (a < b){
                  //if so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  forLoopCounter=i;
                  break;
    
                }
              }
            
            }
    
    
    
          } // for loop
    
          if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            //let t1 = 1;
            //let r1 = rows[t1];
            //let r2 = rows[t1].parentNode;
            //let r3: HTMLTableRowElement = r2?.insertBefore(rows[t1 + 1], rows[t1]);
    
            rows[forLoopCounter].parentNode?.insertBefore(rows[forLoopCounter + 1], rows[forLoopCounter]);
            switching = true;
          }
        }
      }               
      
      filterTable(colNumber: any, myInput: any, tableName: string) {
        var input, filter, table, tr, td, txtValue;
        var savedPos=0;
        var rows: any;
    
        input = <HTMLInputElement>document.getElementById(myInput);
        filter = input.value.toUpperCase();
        table = (<HTMLTableElement> document.getElementById(tableName)); 
        rows = table.rows;
    
        //tr = table?.getElementsByTagName("tr");
        for (let i = 1; i < rows.length; i++) {
          
          td = rows[i].getElementsByTagName("TD")[colNumber];
    
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              rows[i].style.display = "";
            } else {
              rows[i].style.display = "none";
            }
          }       
        }
      }
    
      //myInput is string
      filterField(colNumber: any, myInput: string, tableName: string) {
        var input, filter, table, tr, td, txtValue;
        var savedPos=0;
        var rows: any;
    
        myInput = myInput.trim();
        filter = myInput.toUpperCase();

        table = (<HTMLTableElement> document.getElementById(tableName)); 
        rows = table.rows;
    
        //tr = table?.getElementsByTagName("tr");
        for (let i = 1; i < rows.length; i++) {
          
          td = rows[i].getElementsByTagName("TD")[colNumber];
    
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              rows[i].style.display = "";
            } else {
              rows[i].style.display = "none";
            }
          }       
        }
      }

            //myInput is string
            clearFilter(tableName: string) {
              var input, filter, table, tr, td, txtValue;
              var savedPos=0;
              var rows: any;
          
              table = (<HTMLTableElement> document.getElementById(tableName)); 
              rows = table.rows;
          
              //tr = table?.getElementsByTagName("tr");
              for (let i = 1; i < rows.length; i++) {
                
                    rows[i].style.display = "";
              }
            }
      

}
