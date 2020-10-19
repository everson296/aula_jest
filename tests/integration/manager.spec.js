// subir o servidor no supertest

// criar uma variável de ambiente para rodar o teste no BD de teste

const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database');
const { cpf } = require('cpf-cnpj-validator');
const truncate = require('./truncate');

describe('MANAGERS', () => {

    afterAll(() => {
        connection.close();
    });

beforeEach( async(done) => {
    await truncate(connection.models);
    done();
});

    it('é possivel possivel cria um novo gerente', async () => {
        const response = await request(app).post('/managers').send({
            name: "Everson Silva de Almeida",
            cpf: cpf.generate(),
            email: "tutinha296@gmail.com",
            cellphone: "55554545645",
            password: "69471358",
        });

        expect(response.ok).toBeTruthy();
        expect(response.body).toHaveProperty("id");

    });

    it('não é possivel cadastrar este gente, CPF já existente', async () => {
        let cpfGerente = cpf.generate();

        let response = await request(app).post('/managers').send({
            name: "Everson Silva de Almeida",
            cpf: cpfGerente,
            email: "tutinha296@gmail.com",
            cellphone: "55554545645",
            password: "69471358",
        });

        response = await request(app).post('/managers').send({
            name: "Fonso henrique",
            cpf: cpfGerente,
            email: "fon296@gmail.com",
            cellphone: "55557575645",
            password: "69471358",
        });

        expect(response.ok).toBeFalsy();
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toEqual("cpf already exists");

    });
});