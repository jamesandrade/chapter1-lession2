const express = require ('express');
const { v4: uuidv4 } = require ('uuid');

const app = express();
app.use(express.json());

const custumers = [];


app.post("/account", (req, res) => {
    const { cpf, name } = req.body;
    
    const custumerAlreadyExists = custumers.some((custumer) => custumer.cpf === cpf);
    if (custumerAlreadyExists){
        return res.status(400).json({error: "Custumer Already Exists!"});
    }
    
    custumers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return res.status(201).send();

});

app.get("/statement/", (req, res) =>{
    const { cpf } = req.headers;

    const customer = custumers.find(customer => customer.cpf === cpf);

    if(!customer){
        return res.status(400).json({error: "Customer not Found!"});
    }

    return res.status(200).json(customer.statement);

});

app.listen(3333);  
