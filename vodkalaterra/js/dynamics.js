round  = Math.round

initialize_populations = (ratio, s, density) => {
	var density = (typeof density === 'number') ? density : 50;
	const desert = round((100-density) *0.5)+1;
	const grass = round((100-density) *0.5)+1;

	ratio = Number(ratio);
	var rabbit = round(density*(ratio/100))+1
	var fox = round(density*(100-ratio)/100)+1
	console.log(fox, rabbit, desert, grass)
	var data = [[FOX,fox],
				[RABBIT,rabbit],
				[DESERT,desert],
				[GRASS,grass]]
	// var data = [[1,fox],
	// 			[-1,rabbit]]	
	var wl = new WeightedList(data);
	console.log(players);
	
	_players = new Array(s*s) ;
	for (let i = 0; i < s*s; i++) {
		_players[i] = Number(wl.peek()[0]);
	  }
	return _players;
}

const next_player = (index, neighbors, players ) => {
	var predators = 0;
	var prey = 0;

	if (players[index] ==FOX)
		{
			prey  = neighbors.reduce((acc,value)=>acc += (players[value]==RABBIT))
			predators = neighbors.reduce((acc,value)=>acc += (players[value]==FOX))
			if (prey - predators - 1 < 0) return DESERT;
			else return FOX
		} 
	if (players[index] ==RABBIT)
		{
			if (players.includes(FOX)){
				if (Math.random() < R[FOX]) return FOX;
				else return RABBIT;
			}
			else
			{
				predators = neighbors.reduce((acc,value)=>acc += (players[value]==RABBIT))
				prey = neighbors.reduce((acc,value)=>acc += (players[value]==GRASS))
				if (prey - predators -1 < 0) return DESERT;
				else return RABBIT;
			}
		} 
	if (players[index] ==GRASS)
		{
			if (players.includes(RABBIT)){
				if (Math.random() < R[RABBIT]) return RABBIT;
				else return GRASS;
			}
		}
	if (players[index] ==DESERT)
		{
			
			if (players.includes(GRASS)){
				if (Math.random() < R[GRASS]) return GRASS;
				else return DESERT;
			}
		} 
}
