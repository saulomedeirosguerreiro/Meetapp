import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import databaseConfig from '../config/database';
import Subscription from '../app/models/Subscription';

const models = [User, File, Meetup, Subscription];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models.map(model => model.init(this.connection));
        models.map(
            model => model.associate && model.associate(this.connection.models)
        );
    }
}

export default new Database();
