import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';

class MeetUpController {
    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            banner_id: Yup.number().required(),
            description: Yup.string().required(),
            location: Yup.string().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        if (isBefore(parseISO(req.body.date), new Date())) {
            return res.status(400).json({ error: 'Meetup date invalid' });
        }

        const meetup = await Meetup.create({
            user_id: req.userId,
            ...req.body,
        });

        return res.json(meetup);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string(),
            banner_id: Yup.number(),
            description: Yup.string(),
            location: Yup.string(),
            date: Yup.date(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const meetup = await Meetup.findByPk(req.params.id);

        if (meetup.user_id !== req.userId) {
            return res.status(401).json({ error: 'Not authorized.' });
        }

        if (req.body.date && isBefore(req.body.date, new Date())) {
            return res.status(400).json({ error: 'Meetup date invalid' });
        }

        if (meetup.past) {
            return res
                .status(400)
                .json({ error: "Can't update past meetups." });
        }

        await meetup.update(req.body);

        return res.json(meetup);
    }

    async index(req, res) {
        const where = {};
        const { page = 1 } = req.query;

        if (req.query.date) {
            const searchDate = parseISO(req.query.date);
            where.date = {
                [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
            };
        }

        where.user_id = req.userId;

        const meetups = await Meetup.findAll({
            where,
            include: [{ model: User, as: 'user' }],
            limit: 20,
            offset: (page - 1) * 20,
        });

        return res.json(meetups);
    }

    async delete(req, res) {
        const meetup = await Meetup.findByPk(req.params.id);

        if (meetup.user_id !== req.userId) {
            return res.status(401).json({ error: 'Not authorized.' });
        }

        if (meetup.past) {
            return res
                .status(400)
                .json({ error: "Can't delete past meetups." });
        }

        await meetup.destroy(req.body);

        return res.send();
    }
}

export default new MeetUpController();
