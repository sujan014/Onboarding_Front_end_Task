import React from "react";
import { useEffect, useState } from "react";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import axios from "axios";
import { ErrorComponent } from "../util/utils";
import { BASE_URL } from "../../App";

function EditCustomerForm(props){
    const {Id, Name, Address, callback, dataChange} = props;
    const [id, setId] = useState(Id);
    const [ipname, setIpname] = useState(Name);
    const [ipaddress, setIpaddress] = useState(Address);
    const [errorString, setErrorString] = useState('');
    let openForm = true;

    const queryParameter = {
        id: id
    };
    
    const fetch = `${BASE_URL}/api/Customer/updateCustomer/${id}`;        

    const handleEditForm = async(event) => {
        event.preventDefault();        
        try{
            const response = await axios.put(fetch,            
                {
                    name: ipname,
                    address: ipaddress
                }
            );                
            alert("Customer Edited.");
            // form close callback
            callback();
            dataChange();
        }
        catch (error){
            let errorMsg = error.response.data.errors.Name;            
            setErrorString(errorMsg);
        }
    };

    return(
        <Modal as={Form} onSubmit={handleEditForm} open={openForm} size="tiny" onOpen={() => setErrorString('')}>
            <Header as='h2' content='Edit customer'/>
            <Modal.Content>
                <Form.Input label='NAME' required type="text" value={ipname} onChange={e => setIpname(e.target.value)} />                        
                <Form.Input label='ADDRESS' required type="text" value={ipaddress} onChange={e => setIpaddress(e.target.value)} />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='Cancel'/>
                <Button color='green' type="submit" icon='check' labelPosition="right" content='Edit'/>
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString}/> : null}
        </Modal>
    )
}

export default EditCustomerForm;