const WINNER_FACE_BLOCKS = [
	[12, 3],
	[12, 6],
	[15, 2],
	[15, 7],
	[16, 3],
	[16, 4],
	[16, 5],
	[16, 6],
];

const LOSER_FACE_BLOCKS = [
	[12, 3],
	[12, 6],
	[15, 3],
	[15, 4],
	[15, 5],
	[15, 6],
	[16, 2],
	[16, 7],
];

const BORDER_BLOCKS = [
	[0,  0],
	[1,  0],
	[2,  0],
	[3,  0],
	[4,  0],
	[5,  0],
	[6,  0],
	[7,  0],
	[8,  0],
	[9,  0],
	[10, 0],
	[11, 0],
	[12, 0],
	[13, 0],
	[14, 0],
	[15, 0],
	[16, 0],
	[17, 0],
	[18, 0],
	[19, 0],

	[19, 1],
	[19, 2],
	[19, 3],
	[19, 4],
	[19, 5],
	[19, 6],
	[19, 7],
	[19, 8],
	[19, 9],

	[18, 9],
	[17, 9],
	[16, 9],
	[15, 9],
	[14, 9],
	[13, 9],
	[12, 9],
	[11, 9],
	[10, 9],
	[9,  9],
	[8,  9],
	[7,  9],
	[6,  9],
	[5,  9],
	[4,  9],
	[3,  9],
	[2,  9],
	[1,  9],
	[0,  9],

	[0,  8],
	[0,  7],
	[0,  6],
	[0,  5],
	[0,  4],
	[0,  3],
	[0,  2],
	[0,  1],
];


function renderBlock(level, block_index, pixel_size, ctx, pos_x, pos_y) {
	let color;

	if (block_index < 1) {
		return;
	}

	switch (block_index) {
		case 1:
			// maybe inefficient because it draws the area twice
			// but drawing the zones will bemore function calls
			// hmmm... check speed and optimize if necessary
			color = LEVEL_COLORS[level % 10][0];

			ctx.fillStyle = color;
			ctx.fillRect(
				pos_x,
				pos_y,
				pixel_size * 7,
				pixel_size * 7
			);

			/*
			// Drawing just the needed border
			ctx.fillRect(
				pos_x,
				pos_y + pixel_size,
				pixel_size,
				pixel_size * 6
			);
			ctx.fillRect(
				pos_x + pixel_size,
				pos_y,
				pixel_size * 6,
				pixel_size
			);
			ctx.fillRect(
				pos_x + pixel_size * 6,
				pos_y + pixel_size,
				pixel_size,
				pixel_size * 6
			);
			ctx.fillRect(
				pos_x + pixel_size,
				pos_y + pixel_size * 6,
				pixel_size * 5,
				pixel_size
			);
			/**/

			ctx.fillStyle = 'white';
			ctx.fillRect(
				pos_x,
				pos_y,
				pixel_size,
				pixel_size
			);

			ctx.fillRect(
				pos_x + pixel_size,
				pos_y + pixel_size,
				pixel_size * 5,
				pixel_size * 5
			);

			break;

		case 2:
		case 3:
			color = LEVEL_COLORS[level % 10][block_index - 2];

			ctx.fillStyle = color;
			ctx.fillRect(
				pos_x,
				pos_y,
				pixel_size * 7,
				pixel_size * 7
			);

			ctx.fillStyle = 'white';
			ctx.fillRect(
				pos_x,
				pos_y,
				pixel_size,
				pixel_size
			);
			ctx.fillRect(
				pos_x + pixel_size,
				pos_y + pixel_size,
				pixel_size * 2,
				pixel_size
			);
			ctx.fillRect(
				pos_x + pixel_size,
				pos_y + pixel_size * 2,
				pixel_size,
				pixel_size
			);

			break;

		case 4:
		case 5:
		case 6:
			if (block_index === 4) {
				color = '#FFFFFF';
			}
			else {
				color = LEVEL_COLORS[level % 10][block_index - 5];
			}

			ctx.fillStyle = `${color}90`;
			ctx.fillRect(
				pos_x,
				pos_y,
				pixel_size * 7,
				pixel_size
			);
			ctx.fillRect(
				pos_x,
				pos_y + pixel_size,
				pixel_size,
				pixel_size * 6
			);
			ctx.fillRect(
				pos_x + pixel_size * 6,
				pos_y + pixel_size,
				pixel_size,
				pixel_size * 6
			);
			ctx.fillRect(
				pos_x + pixel_size,
				pos_y + pixel_size * 6	,
				pixel_size * 5,
				pixel_size
			);

			break;
	}

	/**/
	ctx.fillStyle = 'black';
	ctx.fillRect(
		pos_x,
		pos_y + pixel_size * 7,
		pixel_size * 7,
		pixel_size
	);
	ctx.fillRect(
		pos_x + pixel_size * 7,
		pos_y,
		pixel_size,
		pixel_size * 8
	);
	/**/
}


/*
	dom: {
		score:   text element
		level:   text element
		lines:   text element
		trt:     text element
		preview: div for canva
		field:   div for canva
	}

	options: {
		preview_pixel_size: int,
		field_pixel_size: int,
		running_trt_rtl: bool,
		wins_rtl: bool,
	}
*/

const DEFAULT_OPTIONS = {
	field_pixel_size: 3,
	preview_pixel_size: 3,
	preview_align: 'c',
	running_trt_rtl: 0,
	wins_rtl: 0,
	tetris_flashes: 1,
	tetris_sound: 1,
	reliable_field: 1,
	format_score: (v, size) => {
		if (!size) {
			size = 7;
		}

		if (size == 6 && v >= 1000000) {
			const tail = `${v % 100000}`.padStart(5, '0');
			const head = Math.floor(v / 100000);
			v = `${head.toString(16).toUpperCase()}${tail}`;
		}
		else {
			v = `${v}`;
		}

		return v.padStart(size, ' ');
	},
	format_tetris_diff: v => {
		// ensure result is at most 4 char long
		if (v >= 100) {
			return Math.round(v);
		}
		else if (v >= 10) {
			return v.toFixed(1);
		}
		else {
			return v.toFixed(2);
		}
	}
};

class Player {
	constructor(dom, options) {
		this.dom = dom;
		this.options = {
			...DEFAULT_OPTIONS,
			...options
		};

		this.field_pixel_size = this.options.field_pixel_size || this.options.pixel_size;
		this.preview_pixel_size = this.options.preview_pixel_size || this.options.pixel_size;
		this.render_running_trt_rtl = !!this.options.running_trt_rtl;
		this.render_wins_rtl = !!this.options.wins_rtl;

		this.pieces = [];
		this.clear_events = [];

		const styles = getComputedStyle(dom.field);

		// Avatar Block
		this.avatar = document.createElement('div');
		this.avatar.classList.add('avatar');
		Object.assign(this.avatar.style, {
			position:           'absolute',
			top:                `${this.field_pixel_size * 8 * 1}px`,
			left:               `${css_size(styles.padding) - this.field_pixel_size}px`,
			width:              `${css_size(styles.width) + this.field_pixel_size * 2}px`,
			height:             `${css_size(styles.width) + this.field_pixel_size * 2}px`,
			backgroundRepeat:   'no-repeat',
			backgroundSize:     'cover',
			backgroundPosition: '50% 50%',
			filter:              'brightness(0.20)'
		});
		dom.field.appendChild(this.avatar);

		// Field Flash
		this.field_bg = document.createElement('div');
		this.field_bg.classList.add('background');
		Object.assign(this.field_bg.style, {
			position: 'absolute',
			top:      `${css_size(styles.padding) - this.field_pixel_size}px`,
			left:     `${css_size(styles.padding) - this.field_pixel_size}px`,
			width:    `${css_size(styles.width) + this.field_pixel_size * 2}px`,
			height:   `${css_size(styles.height) + this.field_pixel_size * 2}px`
		});
		dom.field.appendChild(this.field_bg);

		// set up field and preview canvas
		['field', 'preview', 'running_trt']
			.forEach(name => {
				console.log(name);

				const styles = getComputedStyle(dom[name]);
				const canvas = document.createElement('canvas');

				canvas.style.position = 'absolute';
				canvas.style.top = styles.padding;
				canvas.style.left = styles.padding;

				canvas.setAttribute('width', styles.width);
				canvas.setAttribute('height', styles.height);

				dom[name].appendChild(canvas);

				this[`${name}_ctx`] = canvas.getContext('2d');
			});


		this.field_ctx.canvas.style.top = `${this.field_pixel_size}px`;
		this.field_ctx.canvas.style.left = `${this.field_pixel_size}px`;
		this.field_bg.appendChild(this.field_ctx.canvas);

		if (this.render_running_trt_rtl) {
			this.running_trt_ctx.canvas.style.transform = 'scale(-1, 1)';
		}

		// buils audio objects
		// TODO: handle left-right channel
		this.sounds = {
			tetris: new Audio('/views/Tetris_Clear.mp3')
		};

		this.renderWinnerFrame = this.renderWinnerFrame.bind(this);

		this.reset();

		this.game_over = true; // we start gae over, waiting for the first good frame
	}

	onPiece() {}
	onDroughtStart() {}
	onDroughtEnd() {}
	onGameStart() {}

	onTetris() {
		if (this.options.tetris_flashes) {
			let remaining_frames = 12;

			const steps = () => {
				const bg_color = (--remaining_frames % 2) ? 'white' : 'rgba(0,0,0,0)';

				this.field_bg.style.background = bg_color;

				if (remaining_frames > 0) {
					this.tetris_animation_ID = window.requestAnimationFrame(steps);
				}
			}

			this.tetris_animation_ID = window.requestAnimationFrame(steps);
		}

		if (this.options.tetris_sound) {
			this.sounds.tetris.play();
		}
	}

	clearTetrisAnimation() {
		window.cancelAnimationFrame(this.tetris_animation_ID);
		this.clear_animation_remaining_frames = -1;
	}

	reset() {
		this.pending_piece = false;
		this.pending_single = false;

		this.pieces.length = 0;
		this.clear_events.length = 0;
		this.preview = '';
		this.score = 0;
		this.lines = 0;
		this.level = 0;
		this.pace_score = this.getPaceScore();
		this.drought = 0;
		this.field_num_blocks = 0;
		this.field_string = '';

		this.lines_trt = 0;
		this.total_eff = 0;

		this.gameid = -1;
		this.game_over = false;
		this.winner_frame = 0;

		this.preview_ctx.clear();
		this.field_ctx.clear();
		this.running_trt_ctx.clear();

		this.clearTetrisAnimation();
		this.clearWinnerAnimation();
		this.field_bg.style.background = 'rbga(0,0,0,0)';

		this.dom.score.textContent = this.options.format_score(this.score);
		this.dom.pace.textContent = this.options.format_score(this.pace_score, 7);
		this.dom.trt.textContent = '---';
		this.dom.eff.textContent = '---';
	}

	getScore() {
		return this.score;
	}

	setDiff(diff, t_diff) {
		// implement in subclasses
	}

	setPaceDiff(diff, t_diff) {
		// implement in subclasses
	}

	setAvatar(url) {
		if (!url) {
			// try local files...
			url = `./avatars/${this.player_name}.png`;
		}

		this.avatar_url = url;
		this.avatar.style.backgroundImage = `url('${encodeURI(url)}')`;
	}

	setName(name) {
		this.dom.name.textContent = this.player_name = name;
	}

	setId(id) {
		this.id = id;
	}

	setLogin(login) {
		this.login = login;
	}

	_getPieceStats(data) {
		return PIECES.reduce(
			(acc, piece) => {
				const num = data[piece];

				if (num === null) {
					throw new SyntaxError(`Invalid piece stat: [${piece}, ${data[piece]}`);
				}

				acc[piece] = num;
				acc.count += num;

				return acc;
			},
			{ count: 0 }
		);
	}

	setFrame(data) {
		const lines = data.lines;
		const level = data.level;
		const num_blocks = data.field.reduce((acc, v) => acc + (v ? 1 : 0), 0);

		if (this.game_over && data.gameid == this.gameid) {
			return;
		}

		if (data.gameid != this.gameid) {
			// new game!
			this.reset();

			// we initialize the game state based on this first frame
			// dangerous for field data if input is badly detected, but what to do -_-

			this.gameid = data.gameid;
			this.field_num_blocks = num_blocks;
			this.start_level = level;

			if (data.cur_piece) {
				// Ideally, we'd want to wait one frame to read cur_piece -_-
				this.prev_preview = data.cur_piece;
			}

			this.onGameStart();
		}

		if (data.lines != null) {
			this.dom.lines.textContent = `${data.lines}`.padStart(3, '0');
		}

		if (data.level != null) {
			this.dom.level.textContent = `${data.level}`.padStart(2, '0');
		}

		if (this.pending_piece) {
			// console.log('pending piece', this.drought);

			let cur_piece = this.prev_preview;
			let drought = this.drought;

			do {
				if (this.options.reliable_field) {
					if (cur_piece === 'I') {
						drought = 0;
					}
					else {
						drought++;
					}
				}
				else {
					try {
						const piece_stats = this._getPieceStats(data);
						const diff = piece_stats.count - this.piece_stats.count
						const i_diff = piece_stats.I - this.piece_stats.I;

						if (i_diff === 0) {
							drought += diff;
						}
						else if (diff === 1) {
							cur_piece = 'I';
							drought = 0;
						}
						else {
							// unknown state, we'll simply store it as new valid state
						}

						this.piece_stats = piece_stats;
					}
					catch(e) {
						console.error(e);
						break;
					}
				}

				if (drought === 0) {
					if (this.drought >= 13) {
						this.onDroughtEnd(this.drought);
					}
				}
				else if (drought === 13) {
					if (this.drought < 13) {
						this.onDroughtStart();
					}
				}

				this.drought = drought;
				this.dom.drought.textContent = this.drought;
				this.pending_piece = false;
				this.prev_preview = data.preview;
				this.onPiece(cur_piece);
			}
			while(false);
		}

		if (level != null) {
			this.level = level;

			const field_string = data.field.join('');

			this.renderField(this.level, data.field, field_string);
			this.renderPreview(this.level, data.preview);

			if (this.options.reliable_field) {
				this.updateField(data.field, num_blocks, field_string);
			}
			else {
				try {
					const piece_stats = this._getPieceStats(data);

					if (this.piece_stats) {

						if (this.piece_stats.count != piece_stats.count) {
							this.pending_piece = true;
						}
					}
					else {
						this.piece_stats = piece_stats;
					}
				}
				catch(e) {
					console.error(e);
				}
			}

			if (num_blocks === 200) {
				// note, gameover can also be detected when top row of field is full
				this.game_over = true;
			}
		}

		if (this.pending_score) {
			if (lines === null || data.score === null) {
				return;
			}

			// weird readings... wait one more frame
			if (data.score < this.score || lines < this.lines) {
				return;
			}

			const score = data.score;

			this.score = score;
			this.dom.score.textContent = this.options.format_score(this.score);
			this.pending_score = false;

			if (lines > this.lines) {
				const cleared = lines - this.lines;

				if (cleared === 4) {
					this.lines_trt += 4;

					if (!this.options.reliable_field) {
						this.onTetris();
					}
				}

				const line_value = cleared <= 4 ? EFF_LINE_VALUES[cleared] : EFF_LINE_VALUES[1];


				this.total_eff += line_value * cleared;

				const trt = this.lines_trt / lines;
				const eff = this.total_eff / lines;

				this.clear_events.push({ trt, eff, cleared });
				this.dom.trt.textContent = getPercent(trt);
				this.dom.eff.textContent = (Math.round(eff) || 0).toString().padStart(3, '0');
				this.renderRunningTRT();
				this.lines = lines;
			}

			this.pace_score = this.getPaceScore();
			this.dom.pace.textContent = this.options.format_score(this.pace_score, 7);
		}

		if (data.score != null) {
			if (data.score != this.score) {
				this.pending_score = true;
			}
		}
	}

	getPaceScore() {
		return this.score + PACE_POTENTIAL[this.lines].score;
	}

	renderPreview(level, preview) {
		const piece_id = `${level}${preview}`;

		if (piece_id === this.current_preview) return;

		this.current_preview = piece_id;

		const
			ctx              = this.preview_ctx,
			col_index        = PIECE_COLORS[preview],
			pixels_per_block = this.preview_pixel_size * (7 + 1),
			positions        = [];

		ctx.clear();

		let pos_x, pos_y, x_offset_3;

		if (this.options.preview_align == 'tr') {
			// top-right alignment
			pos_x = Math.ceil(ctx.canvas.width - pixels_per_block * 3);
			pos_y = 0;
			x_offset_3 = Math.ceil(ctx.canvas.width - pixels_per_block * 3);
		}
		else {
			// default is center
			pos_x      = 0;
			pos_y      = Math.ceil((ctx.canvas.height - pixels_per_block * 2) / 2);
			x_offset_3 = Math.ceil((ctx.canvas.width - pixels_per_block * 3) / 2);
		}

		let x_idx = 0;

		switch(preview) {
			case 'I':
				if (this.options.preview_align == 'tr') {
					pos_x = Math.ceil(ctx.canvas.width - pixels_per_block * 4);
				}
				else {
					pos_x = Math.ceil((ctx.canvas.width - pixels_per_block * 4) / 2);
					pos_y = Math.ceil((ctx.canvas.height - pixels_per_block) / 2);
				}

				positions.push([pos_x + pixels_per_block * 0, pos_y]);
				positions.push([pos_x + pixels_per_block * 1, pos_y]);
				positions.push([pos_x + pixels_per_block * 2, pos_y]);
				positions.push([pos_x + pixels_per_block * 3, pos_y]);
				break;

			case 'O':
				if (this.options.preview_align == 'tr') {
					pos_x = Math.ceil(ctx.canvas.width - pixels_per_block * 2);
				}
				else {
					pos_x = Math.ceil((ctx.canvas.width - pixels_per_block * 2 + this.preview_pixel_size) / 2);
				}

				positions.push([pos_x, pos_y]);
				positions.push([pos_x, pos_y + pixels_per_block]);
				positions.push([pos_x + pixels_per_block, pos_y]);
				positions.push([pos_x + pixels_per_block, pos_y + pixels_per_block]);
				break;

			case 'T':
			case 'J':
			case 'L':
				// top line is the same for both pieces
				positions.push([x_offset_3 + x_idx++ * pixels_per_block, pos_y]);
				positions.push([x_offset_3 + x_idx++ * pixels_per_block, pos_y]);
				positions.push([x_offset_3 + x_idx++ * pixels_per_block, pos_y]);

				if (preview == 'L') {
					x_idx = 0;
				}
				else if (preview == 'T') {
					x_idx = 1;
				}
				else {
					x_idx = 2;
				}

				positions.push([x_offset_3 + x_idx * pixels_per_block, pos_y + pixels_per_block]);
				break;

			case 'Z':
			case 'S':
				positions.push([x_offset_3 + pixels_per_block, pos_y]);
				positions.push([x_offset_3 + pixels_per_block, pos_y + pixels_per_block]);

				if (preview == 'Z') {
					positions.push([x_offset_3, pos_y]);
					positions.push([x_offset_3 + pixels_per_block * 2, pos_y + pixels_per_block]);
				}
				else {
					positions.push([x_offset_3, pos_y + pixels_per_block]);
					positions.push([x_offset_3 + pixels_per_block * 2, pos_y]);
				}
		}

		positions.forEach(([pos_x, pos_y]) => {
			renderBlock(
				level,
				col_index,
				this.preview_pixel_size,
				ctx,
				pos_x,
				pos_y
			);
		});
	}

	updateField(field, num_blocks, field_string) {
		if (field_string == this.field_string) return;

		// state is considered valid, track data
		this.field_string = field_string;

		if (this.clear_animation_remaining_frames-- > 0) return;

		const block_diff = num_blocks - (this.field_num_blocks || 0);

		if (block_diff === 4) {
			this.field_num_blocks = num_blocks;
			this.pending_piece = true;
			return;
		}

		const CLEAR_ANIMATION_NUM_FRAMES = 7;

		// assuming we aren't dropping any frame, the number of blocks only reduces when the
		// line animation starts, the diff is twice the number of lines being cleared.
		//
		// Note: diff.stage_blocks can be negative at weird amounts when the piece is rotated
		// while still being at the top of the field with some block moved out of view

		switch(block_diff) {
			case -16:
				// second frame of tetris (Trey's tetris Flash messed up the frames)
				this.onTetris();
				this.clear_animation_remaining_frames = CLEAR_ANIMATION_NUM_FRAMES - 2;
				this.field_num_blocks -= 40;
				break;

			case -8:
				this.onTetris();
			case -6:
				// indicate animation for triples and tetris
				this.clear_animation_remaining_frames = CLEAR_ANIMATION_NUM_FRAMES - 1;
				this.field_num_blocks += (block_diff * 5); // equivalent to fast forward on how many blocks will have gone after the animation

				break;

			case -4:
				if (this.pending_single) {
					// verified single (second frame of clear animation)
					this.clear_animation_remaining_frames = CLEAR_ANIMATION_NUM_FRAMES - 2;
					this.field_num_blocks -= 10;
				}
				else
				{
					// genuine double
					this.clear_animation_remaining_frames = CLEAR_ANIMATION_NUM_FRAMES - 1;
					this.field_num_blocks -= 20;
				}

				this.pending_single = false;
				break;

			case -2:
				// -2 can happen on the first clear animation frame of a single
				// -2 can also happen when the piece is at the top of the field and gets rotated and is then partially off field
				// to differentiate the 2, we must wait for the next frame, if it goes to -4, then it is the clear animation continuing
				this.pending_single = true;
				break;

			default:
				this.pending_single = false;
		}
	}

	renderField(level, field, field_string) {
		const stage_id = `${level}${field_string}`;

		if (stage_id === this.current_field) return;

		this.current_field = stage_id;

		const pixels_per_block = this.field_pixel_size * (7 + 1);

		this.field_ctx.clear();

		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 20; y++) {
				renderBlock(
					level,
					field[y * 10 + x],
					this.field_pixel_size,
					this.field_ctx,
					x * pixels_per_block,
					y * pixels_per_block
				);
			}
		}
	}

	renderRunningTRT() {
		const
			ctx = this.running_trt_ctx,
			rtl = this.render_running_trt_rtl,
			current_trt = peek(this.clear_events).trt,
			pixel_size_line_clear = 4,
			pixel_size_baseline = 2;

		let pixel_size, max_pixels, y_scale;

		ctx.clear();

		// show the current tetris rate baseline
		// always vertically centered on the line clear event dot
		pixel_size = pixel_size_baseline;
		max_pixels = Math.floor(ctx.canvas.width / (pixel_size + 1));
		y_scale = (ctx.canvas.height - pixel_size_line_clear) / pixel_size;

		const pos_y = Math.round(
			((1 - current_trt) * y_scale * pixel_size)
			+
			(pixel_size_line_clear - pixel_size_baseline) / 2
		);

		ctx.fillStyle = 'grey'; // '#686868';

		for (let idx = max_pixels; idx--; ) {
			ctx.fillRect(
				idx * (pixel_size + 1),
				pos_y,
				pixel_size,
				pixel_size
			);
		}

		// Show the individual line clear events
		pixel_size = pixel_size_line_clear;
		max_pixels = Math.floor(ctx.canvas.width / (pixel_size + 1));
		y_scale = (ctx.canvas.height - pixel_size) / pixel_size;

		let
			to_draw = this.clear_events.slice(-1 * max_pixels),
			len = to_draw.length;

		for (let idx = len; idx--;) {
			const { cleared, trt } = to_draw[idx];
			const lines_data = LINES[cleared]
			const color = LINES[cleared] ? LINES[cleared].color : 'grey';

			ctx.fillStyle = color;
			ctx.fillRect(
				idx * (pixel_size + 1),
				Math.round((1 - trt) * y_scale * pixel_size),
				pixel_size,
				pixel_size
			);
		}
	}

	clearField() {
		this.field_ctx.clear();
		this.clearWinnerAnimation();
	}

	showLoserFrame() {
		this.winner_frame = 0;
		this.clearField();
		this.renderLoserFace();
		this.renderBorder(false);
	}

	playWinnerAnimation() {
		this.winner_frame = 0;
		this.clearField();
		this.winner_animation_id = setInterval(this.renderWinnerFrame, 1000/18);
	}

	clearWinnerAnimation() {
		this.winner_animation_id = clearInterval(this.winner_animation_id);
	}

	renderWinnerFrame() {
		this.winner_frame++;
		this.renderWinnerFace();
		this.renderBorder(true);
	}

	renderWinnerFace() {
		const pixels_per_block = this.field_pixel_size * (7 + 1);
		const level = Math.floor(this.winner_frame / 3) % 10;

		WINNER_FACE_BLOCKS.forEach(([y, x]) => {
			renderBlock(
				level,
				1,
				this.field_pixel_size,
				this.field_ctx,
				x * pixels_per_block,
				y * pixels_per_block
			);
		});
	}

	renderLoserFace() {
		const pixels_per_block = this.field_pixel_size * (7 + 1);
		const level = 6;

		LOSER_FACE_BLOCKS.forEach(([y, x]) => {
			renderBlock(
				level,
				3,
				this.field_pixel_size,
				this.field_ctx,
				x * pixels_per_block,
				y * pixels_per_block
			);
		});
	}

	renderBorder(is_winner) {
		const pixels_per_block = this.field_pixel_size * (7 + 1);

		BORDER_BLOCKS.forEach(([y, x], idx) => {
			const offset = this.winner_frame + idx;

			let level, color;

			if (is_winner) {
				level = Math.floor(offset / 3) % 10;
				color = (offset % 3) + 1;
			}
			else {
				// ugly grey piece
				level = 6;
				color = 3;
			}

			renderBlock(
				level,
				color,
				this.field_pixel_size,
				this.field_ctx,
				x * pixels_per_block,
				y * pixels_per_block
			);
		});
	}
}
