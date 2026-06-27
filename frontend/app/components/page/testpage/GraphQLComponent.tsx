import { useQuery } from "@tanstack/react-query";
import {useRef} from "react";
import { dench } from "dench-fetch";
import { HTTPCredentials }  from "dench-fetch";
import useRegistLoading from "~/hooks/dev/useRegistLoading";
import type { TestResponse } from "~/routes/testpage";


//query에 변수가 있다면 쿼리명을 반드시 적어야 함, 없으면 생략해도 된다고 함
const query = `
    query GetTest($id : ID!){
        test(id : $id){
            message
            name
            timestamp
            description
        }
    }
`


export default function GraphQLComponent(){
    
    const { data, error, isLoading } = useQuery<TestResponse>({
        queryKey: ["graphqlTest"],
        queryFn: async () => { 
            const response = await fetch("http://localhost:3000/graphql", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({
                    query,
                    variables : {
                        id : "1",
                    }
                })
            }
            )
            const json = await response.json();
            

            console.log("GraphQL Response:", response.status);
            console.log("graphQL JSON", json);



            return json.data.test;
        },
        staleTime: 1000 * 60, // 1 minute
        
    });        

    useRegistLoading("GraphQLComponent", isLoading);


    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {data && (
                <div>
                    <h2>GraphQL Component</h2>
                    <div> name : {data.name}</div>
                    <div> timestamp : {data.timestamp}</div>
                    <div> description : {data.description}</div>
                </div>
            )}
        </>
    )
}