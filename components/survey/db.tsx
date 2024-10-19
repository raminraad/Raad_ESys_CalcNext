import sql from 'mssql'

// connection configs
const config = {
    user: 'sa',
    password: '1',
    server: 'DESKTOP-DQ5A7RU',
    database: 'GlobalBizBuilder',
    options: {
        instancename: 'SQLEXPRESS',
        trustedconnection: true,
        trustServerCertificate: true
    },
}

export default async function ExcuteQuery(query, options) {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query(query);
        debugger;
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}