const _ = require('lodash');

const Room = require('./Room');

class PrivateRoom extends Room {
	constructor(owner) {
		super(owner);

		this.onProducerMesssage = this.onProducerMesssage.bind(this);
	}

	addProducer(connection) {
		// producer can only be owner
		if (socket.nestris.user.id != this.owner.id) return false; // throw?

		// user is owner, he should take over connection
		this.producers.forEach(connection => connection.kick('concurrency_limit'));
		this.producers.clear();

		this.producers.add(connection);

		connection.socket.addListener('message', this.onProducerMesssage);
		connection.socket.addListener('close', () => {
			this.producers.delete(connection);
		});
	}

	onProducerMesssage(message) {
		this.views.forEach(connection => connection.send(message));
	}
}

module.exports = PrivateRoom;