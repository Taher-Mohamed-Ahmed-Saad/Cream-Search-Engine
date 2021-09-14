document.getElementById("textbox").addEventListener('input',(e)=>{
    console.log(document.getElementById('textbox').value);
    //clearing the datalist
    while(document.getElementById('suggestions').firstChild){
        document.getElementById('suggestions').removeChild(document.getElementById('suggestions').firstChild);
    }
    if(document.getElementById('textbox').value==""){
        console.log("empty field deleting req");
        return;
    }
    //sending the ajax post request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST','/suggest/'+document.getElementById('textbox').value,[true]);
    xmlhttp.send(document.getElementById('textbox').value);
    xmlhttp.onprogress=function(event){
        console.log(JSON.parse(event['srcElement']['responseText']));
        var listWords=JSON.parse(event['srcElement']['responseText']);
        
        console.log(listWords[0])
        if(event.lengthComputable){
            
            for(var i=0;i<listWords.length && i<5;i++){
                console.log(listWords[i].sugg_word);
                
                var node=document.createElement("option");
                //var textnode = document.createTextNode(listWords[i]['value']);
                //node.appendChild(textnode);
                node.value=listWords[i].sugg_word;
                console.log(listWords.length);
                document.getElementById('suggestions').appendChild(node);
            }
        }
    }
    xmlhttp.onerror=(err)=>{console.log(err);}
});