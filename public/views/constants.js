const

	DOM_DEV_NULL = document.createElement('div'),

	PIECES = ['T', 'J', 'Z', 'O', 'S', 'L', 'I'],

	// generate colors at https://paletton.com/

	LINES = {
		1: { name: 'singles', color: '#1678FF' },
		2: { name: 'doubles', color: '#FF9F00' },
		3: { name: 'triples', color: '#FF00B9' },
		4: { name: 'tetris',  color: '#FFFFFF' },
	},

	BOARD_COLORS = {
		floor:        '#747474',
		height:       '#747474', // BBBBBB',
		tetris_ready: '#9F5DC3',
		clean_slope:  '#53BAB2',
		double_well:  '#F8F81B',
		drought:      'orange',
	},

	DAS_COLORS = {
		absent: 'white',
		great:  'limegreen',
		ok:     'orange',
		bad:    'red',
	},

	DAS_THRESHOLDS = {
		0:  'bad',
		1:  'bad',
		2:  'bad',
		3:  'bad',
		4:  'bad',
		5:  'bad',
		6:  'bad',
		7:  'bad',
		8:  'bad',
		9:  'bad',
		10: 'ok',
		11: 'ok',
		12: 'ok',
		13: 'ok',
		14: 'ok',
		15: 'great',
		16: 'great',
	},

	DROUGHT_PANIC_THRESHOLD = 13,

	SCORE_BASES = [0, 40, 100, 300, 1200],

	EFF_LINE_VALUES = [0, 40, 50, 100, 300],

	// arrays of color 1 and color 2
	LEVEL_COLORS = [
		[ '#4A32FF', '#4AAFFE' ],
		[ '#009600', '#6ADC00' ],
		[ '#B000D4', '#FF56FF' ],
		[ '#4A32FF', '#00E900' ],
		[ '#C8007F', '#00E678' ],
		[ '#00E678', '#968DFF' ],
		[ '#C41E0E', '#666666' ],
		[ '#8200FF', '#780041' ],
		[ '#4A32FF', '#C41E0E' ],
		[ '#C41E0E', '#F69B00' ],
	],

	TRANSITIONS = {
		 0:  10,
		 1:  20,
		 2:  30,
		 3:  40,
		 4:  50,
		 5:  60,
		 6:  70,
		 7:  80,
		 8:  90,
		 9: 100,
		10: 100,
		11: 100,
		12: 100,
		13: 100,
		14: 100,
		15: 100,
		16: 110,
		17: 120,
		18: 130,
		19: 130,
	},

	BLOCK_PIXEL_SIZE = 3,

	PIECE_COLORS = {
		T: 1,
		J: 2,
		Z: 3,
		O: 1,
		S: 2,
		L: 3,
		I: 1
	},

	PACE_POTENTIAL = getPacePotential()
;

DAS_THRESHOLDS[-1] = 'absent';


// TODO: store static map?
function getPacePotential() {
	// one time generation of score potential by line and best line clear strategy

	function clearScore(clear, lines) {
		// assumes 18 start: all liones before 130 are level 18 worth
		if (clear + lines < 130) {
			return 19 * SCORE_BASES[clear];
		}
		else {
			const level = Math.floor((clear + lines + 60) / 10);

			return (level + 1) * SCORE_BASES[clear];
		}
	}

	const best_clears = Array(234).fill('');
	const max_scores = Array(230).fill(0);
	const scoring_potential = {};

	for (let lines=230; lines--; ) {
		let best_score = 0;
		let best_clear = 1;

		for (let clear=5; clear--; ) {
			let new_score = clearScore(clear, lines);

			if (clear + lines < 230) {
				new_score += max_scores[clear + lines];
			}

			if (new_score > best_score) {
				best_score = new_score;
				best_clear = clear;
			}
		}

		max_scores[lines] = best_score;
		best_clears[lines] = `${best_clear}${best_clears[lines + best_clear]}`;

		scoring_potential[lines] = {
			score: best_score,
			clears: best_clears[lines],
		};
	}

	return scoring_potential;
}