import * as express from 'express';

import { GameRepository } from '../../storage/chat.repository';

enum Period {
  Month = 'month',
  Week = 'week',
  Day = 'day'
}

function periodToDate(period: Period): Date {
  let date = new Date();

  switch (period) {
    case Period.Month:
      date.setMonth(date.getMonth() - 1);
      break;
    case Period.Week:
      date = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
      break;
    case Period.Day:
      date = new Date(date.getTime() - (1 * 24 * 60 * 60 * 1000));
      break;
    default:
      date = null;
  }

  return date;
}

export class Routes {
  constructor (private gameRepository: GameRepository) { }

  setup(app: express.Express): void {
    const router = express.Router();

    router.get('/month', (req, res, next) => {
      this.processRoute(req, res, Period.Month);
    });

    router.get('/week', (req, res, next) => {
      this.processRoute(req, res, Period.Week);
    });

    router.get('/day', (req, res, next) => {
      this.processRoute(req, res, Period.Day);
    });

    router.get('/', (req, res, next) => {
      this.processRoute(req, res);
    });

    app.use(router);
  }

  private async processRoute(req: express.Request, res: express.Response, period?: Period) {
    const date = periodToDate(period);

    const statistics = await this.gameRepository.getStatistics(date);

    res.render('index', { title: 'Ikea Quiz bot statistics', viewModel: statistics });
  }
}
