import { buildSchema } from 'graphql';

// GraphQL 스키마 정의

interface Test{
    id : string;
    message : string;
    name : string;
    timestamp : string;
    description : string;
}

export const TestSchema = buildSchema(`   
    type Test{
        id : ID!
        message : String
        name : String
        timestamp : String
        description : String
    }

    type Query{
        tests : [Test!]!
        test(id: ID!) : Test!
    }
`)


const tests : Test[]= [
    { id : "1", message: 'This is a JSON response from an authenticated endpoint', name : 'Dench', timestamp : new Date().toISOString(), description : 'This endpoint is used to test authenticated JSON responses in the Dench testing suite' },
    { id : "2", message: 'Another test message', name : 'Dench2', timestamp : new Date().toISOString(), description : 'Another test description' },
];

export const root = {
    tests : () => tests,
    test : ({id} : {id : string}) => {
        console.log("Received test query with id:", id);
        return tests.find(test => test.id === id);
    }
};