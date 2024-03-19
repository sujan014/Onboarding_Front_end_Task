import React from "react";
import { useEffect, useState } from "react";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import axios from "axios";
import { ErrorComponent } from "../util/utils";
import { BASE_URL } from "../../App";

function DeleteCustomerForm(props){
    const {Id, Name, Address, callback, dataChange} = props;
    const [id, setId] = useState(Id);
    const [name, setName] = useState(Name);
    const [address, setAddress] = useState(Address);
    const [errorString, setErrorString] = useState('');
    let openForm = true;

    const queryParameter = {
        id: id
    }
    
    const fetch = `${BASE_URL}/api/Customer/deleteCustomer/${id}`;
    
    const handleDeleteForm = async() => {
        try{
            // add form submission here
            const response = await axios.delete(fetch);
            // callbacks invoked
            alert("Customer Deleted.");
            callback();
            dataChange();
        }
        catch (error){
            let errorMsg = error.response.data.errors.Name;
            setErrorString(errorMsg);
        }
    };

    return(
        <Modal as={Form} onSubmit={handleDeleteForm} open={openForm} size='tiny' onOpen={() => {setErrorString('')}}>
            <Header as='h2'>Delete customer </Header>
            <Header as='h3'>Are you sure ?</Header>
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='Cancel'/>
                <Button color='red' type='submit' icon='times' labelPosition="right" content='Delete' />
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString}/> : null}
        </Modal>
    )
}

export default DeleteCustomerForm;