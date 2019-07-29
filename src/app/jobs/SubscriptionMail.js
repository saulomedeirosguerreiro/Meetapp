import Mail from '../../lib/Mail';

class SubscriptionMail {
    get key() {
        return 'SubscriptionMail';
    }

    async handle({ data }) {
        const { meetup, user } = data;

        await Mail.sendMail({
            to: `${meetup.user.name} <${meetup.user.email}>`,
            subject: 'Nova inscrição',
            template: 'subscription',
            context: {
                event: meetup.title,
                user: user.name,
            },
        });
    }
}

export default new SubscriptionMail();
