const express = require ('express');
const { v4: uuidv4 } = require ('uuid');

const app = express();
app.use(express.json());

const customers = [];

function verifyExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers;

    const customer = customers.find((findcpf) => findcpf.cpf === cpf);


    if (!customer){
        return res.status(400).json({error: "Customer not Found!"});
    }
    req.customer = customer;
    return next();
}

app.post("/account", (req, res) => {
    const { cpf, name } = req.body;
    
    const customer = customers.some((customer) => customer.cpf === cpf);

    if (customer){
        return res.status(400).json({error: "Customer Already Exists!"});
    }
    
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return res.status(201).send();

});


app.use(verifyExistsAccountCPF);

app.get("/statement/", (req, res) => {
   const { customer } = req; 
    return res.status(200).json(customer.statement);

});

app.post("/deposit", (req, res) => {
    const { description, amount } = req.body;

    const { customer } = req;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return res.status(201).send(statementOperation);
});

app.listen(3333);  
