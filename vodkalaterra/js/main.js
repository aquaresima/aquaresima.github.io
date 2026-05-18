/**
 * This example can be found in the Processing examples package
 * that comes with the Processing PDE.v
 * Processing > Examples > Basics > Form > Bezier
 * Adapted by Evelyn Eastmond
 */

// class PopulationModel extends Graphs {


const side_size = 50
var players = new Array(side_size*side_size) ;
var players_next = new Array(side_size*side_size) ;

const FOX = 1;
const RABBIT = 2;
const GRASS = 3;
const DESERT = 4;
players.fill(GRASS)

const R = [0.3,0.6,1];

let c = 1;


const s = ( sketch ) => {
	let fontsize = 7;
	var font;
	let width = $(".text").width();
	// let x = 100;
	let height = width;
	let w = width/side_size;
  
	sketch.preload = () => {
		console.log('preload', typeof font);
	// Ensure the .ttf or .otf font stored in the assets directory
	// is loaded before setup() and draw() are called
		font = sketch.loadFont('http://localhost:8000/fonts/Lucida%20Bright.ttf');
		console.log('preload', typeof font);
	}
   
	sketch.setup = () => {
		
		sketch.textFont(font);
		sketch.textSize(fontsize);
		sketch.textAlign(sketch.CENTER, sketch.CENTER);
		sketch.createCanvas(width, height);
		
		// players = initialize_populations(50, 50);
	};
  
	sketch.draw = () => {
	//   update_population();
	  // Draw population
	  sketch.background(0);
	  players.forEach((item, index) => {
		var pos = get_coordinates(index, side_size)
		var neighbors = get_neighbors(index, side_size);
		//[index] = update_cell(index, neighbors, players );
		// players_next[index] = next_player(index, neighbors,players) 
		
		// let sum = neighbors.reduce((acc, cur)=>acc+players[cur],0);


		
		if(item>0) {
			sketch.text(String(item), w*pos.x, w*pos.y);
		} 	
		
		// players[index] = players_next[index];
		// c = c+10
		
		sketch.rect(pos.x,pos.y,50,50)
		sketch.fill(3, 160, 98);
		// console.log(item, w*pos.x, w*pos.y);
	  });
;
	};
  };

var p5sk;
window.onload = () => {
  p5sk = new p5(s,'sketch_box');
};  

const btn = document.querySelector("#restart_button");

btn.addEventListener("click", function () {
	
	var s = document.getElementById('size').value;
	var r = document.getElementById('ratio').value;
	console.log(r,s);
	var my_players = initialize_populations(r, s);
	console.log(my_players)
	players = my_players
});

const get_coordinates = (index, side_size)=> {
		  return{ 'x': (Math.floor(index%side_size)+1/2),
		  		 'y':(Math.floor(index/side_size)+1/2)}
}
const get_neighbors = (index, l)=> {
	let ll = l*l
	return [
				(ll+(l + index - 1 )%l + l*Math.floor(index/l))%ll,
				(ll+(l+ index + 1 )%l + l*Math.floor(index/l))%ll,
				(ll+index-l)%ll,
				(ll+index+l)%ll
	]
}

https://p5js.org/examples/instance-mode-instance-container.html


// 	var starve = true;
// 	if (boxes[k].type == ROAD) {
// 		return ROAD;
// 	}
// 	if (boxes[k].type == FOX) {
// 		nn.forEach(item=> {if (boxes[item]==RABBIT) {starve=false};})
// 		if (starve) {return DESERT;} 
// 		else {return FOX;}
// 	}
// 	if (boxes[k].type == RABBIT) {
		
// 		nn.forEach(item=> {if (boxes[item]==GRASS) {starve=false};})
// 		if (starve) {return DESERT;} 
// 		nn.forEach(item=> {if (boxes[item]==GRASS) {starve=false};})
// 		if (starve) {return DESERT;} 
// 		else {return FOX;}
// 	}



		
// 	if (animals[index] == 'F') {}

// }


// 		// death conditions
// 		// fox dies if no rabbits

// 		if (boxes[k].type == FOX) {
// 			starve = true;
// 			for (int n = 0; n < neighs[k].surround.length; n++) {
// 				if (boxes[neighs[k].surround[n]].type == RABBIT) {
// 					// there is AT LEAST a rabbit, no starvation
// 					starve = false;
// 					break;
// 				}
// 				if (boxes[neighs[k].surround[n]].type == DESERT) {
// 					// there is AT LEAST a desert,  starvation
// 				   break;
// 				}
// 			}
// 			if (starve) {boxes[k].next = DESERT;}
// 		}
// 		// rabbit dies if no grass

// 		//// birth conditions
// 		//// fox is born eating rabbit
// 		//if (boxes[k].type == RABBIT) {
// 		//    boxes[k].next = RABBIT;


// 		//}
// 		if (boxes[k].type == RABBIT) {
// 			starve = true;
// 			for (int n = 0; n < neighs[k].surround.length; n++) {
// 				if (boxes[neighs[k].surround[n]].type == FOX) {
// 					if (r_fox> random(1)){
// 					boxes[k].next = FOX;
// 					break;
// 				  }
// 				}
// 			}
// 			for (int n = 0; n < neighs[k].surround.length; n++) {
// 				if (boxes[neighs[k].surround[n]].type == GRASS) {
// 					// there is AT LEAST a grass, no starvation
// 					starve = false;
// 					break;
// 				}
// 			}
// 			if (starve) {boxes[k].next = DESERT;}
// 		}
		
// 		// rabbit is born eating grass
// 		if (boxes[k].type == GRASS) {
// 			for (int n = 0; n < neighs[k].surround.length; n++) {
// 				if (boxes[neighs[k].surround[n]].type == RABBIT) {
// 				if (r_rabbit >     random(1)){ 
// 				  boxes[k].next = RABBIT;
// 			   }
// 			}
// 		  }
			
// 		}
// 		// grass grows where desert
// 		if (boxes[k].type == DESERT) {
// 			for (int n = 0; n < neighs[k].surround.length; n++) {
// 				if (boxes[neighs[k].surround[n]].type == GRASS) {
// 					boxes[k].next = GRASS;
// 					break;
// 				}
// 			}
// 		}
// 		k++;
// 	}
// }
// k = 0;
// for (int j = 0; j < n_boxes; j += 1) {
// 	// run over the ys
// 	for (int i = 0; i < n_boxes; i += 1) {
// 		boxes[k].type = boxes[k].next;
// 		k++;
// 	}