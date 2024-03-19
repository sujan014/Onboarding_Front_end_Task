import React from "react";
import { useEffect, useState } from "react";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import axios from "axios";
import { ErrorComponent } from "../util/utils";
import { BASE_URL } from "../../App";

function NewProductForm(props){
    const [ipname, setIpname] = useState('')
    const [ipprice, setIpprice] = useState(0)
    let openForm = true;
    const [errorString, setErrorString] = useState('');

    const handleForm = async (event) => {
        // add form submission here
        event.preventDefault();
        try{            
            const response = await axios.post(`${BASE_URL}/api/Product/createproduct`,
                {
                    name: ipname,
                    price: ipprice
                }
            );                        
            alert("Product Created.");
            // form close callback
            props.callback();
            props.dataChange();
        }
        catch (error){
            let errorMsg = error.response.data.errors.Name;            
            setErrorString(errorMsg);
        }
    }
    
    return(        
        <Modal as={Form} onSubmit={handleForm} open={openForm} size="tiny" onOpen={() => {setErrorString('')}}>
            <Header as="h2">Create product</Header>
            <Modal.Content>
                <Form.Input label="NAME" required type="text" value={ipname} onChange={e => setIpname(e.target.value)} />                    
                <Form.Input label="PRICE" required type ="number" value={ipprice} onChange={e => setIpprice(e.target.value)} />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' type="button" onClick={props.callback} content='cancel' />
                <Button color='green' type="submit" icon="check" labelPosition="right" content='create' />
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}
        </Modal>            
    )
}

export default NewProductForm;