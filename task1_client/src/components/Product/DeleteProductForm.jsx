import React from "react";
import { useEffect, useState } from "react";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import axios from "axios";
import { ErrorComponent } from "../util/utils";
import { BASE_URL } from "../../App";

function DeleteProductForm(props){
    const {Id, Name, Price, callback, dataChange} = props;
    const [id, setId] = useState(Id);
    const [name, setName] = useState(Name);
    const [price, setPrice] = useState(Price);    
    const [errorString, setErrorString] = useState('');
    let openForm = true;

    const queryParameter = {
        id: id
    }
    
    const fetch = `${BASE_URL}/api/Product/deleteProduct/${id}`;
    
    const handleDeleteForm = async() => {
        // add form submission here
        try{
            const response = await axios.delete(fetch);
            if (response.status === 200){
                alert("Product Deleted.");
                // callbacks invoked
                callback();
                dataChange();
            } else{
                setErrorString("Error: Could not complete the operation.");
            }
        }
        catch (error){
            let errorMsg = error?.response?.data?.errors?.Name;
            
            if (errorMsg === undefined || errorMsg === null){
                setErrorString("Undefined Error - Could not complete the operation");
            }
            else {
                setErrorString(errorMsg);
            }
        }
    };

    return(
        <Modal as={Form} onSubmit={handleDeleteForm} open={openForm} size='tiny' onOpen={() => {setErrorString('')}}>                            
            <Header as='h2'>Delete product</Header>
            <Header as='h3'>Are you sure?</Header>                    
            
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='cancel'/>
                <Button color='red' type='submit' icon='times' labelPosition="right" content='delete' />
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString}/> : null}
        </Modal>
    )
}

export default DeleteProductForm;