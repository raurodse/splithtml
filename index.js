$(document).ready(function(){
	$("#documento").load(function(){
		lista = $("#documento").contents()[0];
		body = lista.querySelector('body');
		destino = [];
		p1 = lista.querySelector('#p1');
		p2 = lista.querySelector('#p2');
		p3 = lista.querySelector('#p3');
		p4 = lista.querySelector('#p4');
		p5 = lista.querySelector('#p5');
		p6 = lista.querySelector('#p6');
		p7 = lista.querySelector('#p7');
		p8 = lista.querySelector('#p8');
		p11 = lista.querySelector('#p11');
		p12 = lista.querySelector('#p12');
	});
});

function recorre(){
	agujas = ["p2","p4","p6"];
	root = "body";
}


function primercaso(origen,dondeinsertar,aguja){
	var index;
	for(index=0; index < origen.childNodes.length ; index++){
		var node = origen.childNodes[index];
		if(node.id){
			var temp = aguja;
			if(temp.indexOf("#") === 0){
				temp = temp.substr(1);
			}
			if(node.id === temp){
				break;
			}
		}
		if(node.querySelector){
			if(node.querySelector(aguja)){
				var aux = node.cloneNode();
				primercaso(node,aux,aguja);
				dondeinsertar.appendChild(aux);
				break;
			}
			else{
				dondeinsertar.appendChild(node.cloneNode(true));
			}
		}
		else{
			dondeinsertar.appendChild(node.cloneNode(true));
		}
	}
}

function searchCommonParent(desdedondebuscar,identificadornodoinicio,identificadornodofin){
	var padrecomun;
	var nodoinicio = desdedondebuscar.querySelector(identificadornodoinicio);
	var nodofin = desdedondebuscar.querySelector(identificadornodofin);
	var resultado = nodoinicio.compareDocumentPosition(nodofin);
	var parentinicio, parentfin;
	if(resultado & Node.DOCUMENT_POSITION_CONTAINED_BY){
		// Nodofin es contenido por nodoinicio
		return nodoinicio;

	}

	if( resultado & Node.DOCUMENT_POSITION_CONTAINS){
		// Nodoinicio es contenido por nodofin
		
		return nodofin;
	}

	parentinicio = nodoinicio.parentNode;
	parentfin = nodofin.parentNode;
	while(parentinicio !== null && parentfin !== null){
		if(parentinicio === parentfin){
			// Son hermanos directos
			padrecomun = parentinicio;
			break;
		}
		else{
			resultado = parentinicio.compareDocumentPosition(parentfin);
			if(resultado & Node.DOCUMENT_POSITION_CONTAINED_BY ){
			// parentinicio es contenido por parentfin
				padrecomun = parentinicio;
				break;
			}

			if( resultado & Node.DOCUMENT_POSITION_CONTAINS){
				// Nodoinicio es contenido por nodofin
				padrecomun = parentfin;
				break;
			}
		}
		parentinicio = parentinicio.parentNode;
		parentfin = parentfin.parentNode;
	}
	return padrecomun;
}

function segundocaso(orig,dest,startid,endid){
	var commonparent = searchCommonParent(orig,startid,endid);
	var initialnode = orig.querySelector(startid);
	var container = initialnode.parentNode.cloneNode();
	var node = initialnode;
	var found = false;
	var firstloop = true;
	var i ;
	debugger;
	if (startid === endid){
		dest.appendChild(initialnode.cloneNode(true));
		return ;
	}
	var temp = endid;
	if(temp.indexOf("#") === 0){
		temp = temp.substr(1);
	}

	container.appendChild(initialnode.cloneNode(true));
	if(commonparent !== 'undefined'){
		do{
			while(node.nextSibling !== null){
				node = node.nextSibling;

				
				if(node.id === temp){
					found = true;
					break;
				}

				if(node.querySelector){
					if(node.querySelector(endid)){
						var aux = node.cloneNode();
						primercaso(node,aux,endid);
						container.appendChild(aux);
						found = true;
						break;
					}
				}
				container.appendChild(node.cloneNode(true));
			}
			if(firstloop){

				firstloop = false;
			}
			else{
				var aux = container;
				container = node.parentNode.cloneNode();
				container.appendChild(aux);
			}
			node = node.parentNode;
			if(found){
				break;
			}
		}
		while(true);
		for( i = 0; i < container.childNodes.length; i++){
			dest.appendChild(container.childNodes[i].cloneNode(true));
		}
	}
	
}


function complexCase(orig,dest,startid,endid){
	var commonparent , initialnode, node,
		container = null,
		found = false;

	// Same node
	if(startid === endid){
		dest.appendChild(orig.querySelector(startid).cloneNode(true))
		return;
	}
	// Not related nodes
	try{
		commonparent = searchCommonParent(orig,startid,endid);
	}
	catch(err){
		return;
	}

	// Node contain the other node
	initialnode = orig.querySelector(startid);
	endnode = orig.querySelector(endid);
	if(initialnode === commonparent || endnode === commonparent){
		primercaso(commonparent,dest,endid);
		return;
	}

	node = initialnode;

	loopall:
	while(true){
		if(container === null){
			container = node.parentNode.cloneNode();
			container.appendChild(node.cloneNode(true));
		}
		else{
			var aux = container;
			container = node.parentNode.cloneNode();
			container.appendChild(aux);
		}

		loopsamelevel:
		while(node.nextSibling !== null){
			node = node.nextSibling;

			if(node.parentNode.querySelector && (node.parentNode.querySelector(endid) === node)){
				break loopall;
			}

			if(node.querySelector && node.querySelector(endid)){
					var aux = node.cloneNode();
					primercaso(node,aux,endid);
					container.appendChild(aux);
					break loopall;
			}
			container.appendChild(node.cloneNode(true));
		}
		node = node.parentNode;
	}
		
	for( i = 0; i < container.childNodes.length; i++){
		dest.appendChild(container.childNodes[i].cloneNode(true));
	}
}