const dbPool = require('../modules/db');

class ScoreDAO {
	constructor() {}

	async getStats(user) {
		const db_client = await dbPool.connect();

		try {
			return {
				current_player: user.login,
				pbs: [
					await this._getPBs(db_client, user, 18),
					await this._getPBs(db_client, user, 19),
				],
				high_scores: {
					overall: await this._getBestOverall(db_client, user),
					today:   await this._getBestToday(db_client, user)
				}
			};
		}
		catch(err) {
			console.log('Error getting user stats');
			console.error(err);
			return {};
		}
		finally {
			db_client.release();
		}
	}

	async _getPBs(db_client, user, start_level) {
		const result = await db_client.query(`
			SELECT start_level, end_level, score, lines, das_avg, tetris_rate
			FROM scores
			WHERE player_id=$1 and start_level=$2
			ORDER BY score DESC
			LIMIT 1
			`,
			[
				user.id, start_level
			]
		);

		return result.rows[0];
	}

	async _getBestOverall(db_client, user) {
		const result = await db_client.query(`
			SELECT start_level, score, tetris_rate
			FROM scores
			WHERE player_id=$1
			ORDER BY score DESC
			LIMIT 7
			`,
			[ user.id ]
		);

		return result.rows;
	}

	async _getBestToday(db_client, user) {
		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);

		const result = await db_client.query(`
			SELECT start_level, score, tetris_rate
			FROM scores
			WHERE player_id=$1
				AND datetime>=$2
			ORDER BY score DESC
			LIMIT 7
			`,
			[
				user.id,
				today.toISOString(),
			]
		);

		return result.rows;
	}

	async recordGame(user, game_data) {
		if (!game_data) return;

		const result = await dbPool.query(`
			INSERT INTO scores
			(
				datetime,
				player_id,
				start_level,
				end_level,
				score,
				lines,
				tetris_rate,
				num_droughts,
				max_drought,
				das_avg
			)
			VALUES
			(
				NOW(), $1, $2, $3, $4, $5, $6, $7, $8, $9
			)
			`,
			[
				user.id,
				game_data.start_level,
				game_data.end_level,
				game_data.score,
				game_data.lines,
				game_data.tetris_rate,
				game_data.num_droughts,
				game_data.max_drought,
				game_data.das_avg,
			]
		);
	}
}

module.exports = new ScoreDAO();

