import React from "react";
import { useEffect, useState } from "react";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import axios from "axios";
import { ErrorComponent } from "../util/utils";
import { BASE_URL } from "../../App";

function NewCustomerForm(props){
    const {callback, dataChange} = props;

    const [ipname, setIpname] = useState('')
    const [ipaddress, setIpaddress] = useState('')
    let openForm = true;
    const [errorString, setErrorString] = useState('');
    
    const handleForm = async (event) => {
        // add form submission here
        event.preventDefault();        
        try{
            const response = await axios.post(`${BASE_URL}/api/Customer/createCustomer`,
                {
                    name: ipname,
                    address: ipaddress
                }
            );
            if (response.status === 200){
                alert("Customer Created.");
                // form close callback
                callback();
                dataChange();
            } else{
                setErrorString("Error: Could not complete the operation.");
            }
        }
        catch (error){
            let errorMsg = error?.response?.data?.errors?.Name;
            if (errorMsg === undefined){
                setErrorString("Undefined Error - Could not complete the operation");
            }
            else {
                setErrorString(errorMsg);
            }
        }
    }

    return(
        <Modal as={Form} onSubmit={handleForm} open={openForm} size="tiny" onOpen={() => {setErrorString('')}}>
            <Header as="h2">Create customer</Header>
            <Modal.Content>            
                <Form.Input label="NAME" required type="text" value={ipname} onChange={e => setIpname(e.target.value)} />                    
                <Form.Input label="ADDRESS" required type ="text" value={ipaddress} onChange={e => setIpaddress(e.target.value)} />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='cancel' />
                <Button color='green' type="submit" icon="check" labelPosition="right" content='create' />
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}
        </Modal>
    );
}

export default NewCustomerForm;