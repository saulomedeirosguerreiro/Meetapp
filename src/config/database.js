module.exports = {
    dialect: 'postgres',
    host: '192.168.99.100',
    database: 'meetapp',
    port: '5433',
    username: 'postgres',
    password: 'docker',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};
