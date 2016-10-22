"use strict";

let ChatModel = require("./../../storage/models/chat-model.js");

	let getStatistics = (date) => { 
		
		let dateFilter = !date ? {} : { finished : { $gte: date }};
		
		let result = {};
		let totalGamePlayed = ChatModel
			.count(dateFilter)
			.then((data) => { result.totalGamePlayed = data; });
			
		let uniquePlayers = ChatModel.distinct('telegramChatId', dateFilter)
			.then((data) => { result.uniquePlayers = data.length; });
	
		let players = ChatModel
			.aggregate([
				{ $match: dateFilter }, 
				{ $group: { _id : "$userName", max: {$max: "$right" }}}, 
				{$sort: {max: -1}}, {$limit: 10}
			]).then((data) => { 
				result.players = data.map((item) => { 
					return {
						name: item._id,
						score: item.max 
					};
				});
			});
			
		return Promise.all([totalGamePlayed, uniquePlayers, players])
			.then(() => {
				return result;
			});
	};
	
	let processRoute = (req, res, period) => {
		
		let date = new Date();
		
		switch (period){
			case "month":
				date.setMonth(date.getMonth() - 1);
				break;
			case "week":
				date = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
				break;
			case "day":
				date = new Date(date.getTime() - (1 * 24 * 60 * 60 * 1000));
				break;
			default:
				date = undefined;
		}
		
		getStatistics(date).then((statistics) => {
			res.render('index', { title: 'Ikea Quiz bot statistics', viewModel: statistics });
		});
	};

module.exports = (server) => {

	
	server.app.get('/month', (req, res, next) => {
		processRoute(req, res, 'month');
	});
	
	server.app.get('/week', (req, res, next) => {
		processRoute(req, res, 'week');
	});
	
	server.app.get('/day', (req, res, next) => {
		processRoute(req, res, 'day');
	});
	
	server.app.get('/', (req, res, next) => {
		processRoute(req, res);
	});

};
