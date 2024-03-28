import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import { ErrorComponent } from "../util/utils";
import "../components.css";
import { BASE_URL } from "../../App";

function DeleteSalesForm(props){
    const {deleteid, callback, dataChange} = props;
    const [errorString, setErrorString] = useState('');
    let openForm = true;
    
    const fetchURL = `${BASE_URL}/api/Sales/deleteSales/${deleteid}`;
    
    const handleDeleteForm = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.delete(fetchURL);
            if (response.status === 200){
            alert("Sales Deleted.");
            // callback invoke
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
    }

    return(
        <Modal as={Form} onSubmit={handleDeleteForm} open={openForm} size='tiny' onOpen={() => {setErrorString('')}}>            
            <Header as='h2'>Delete sales</Header>
            <Header as='h3'>Are you sure?</Header>                    
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='cancel' />
                <Button color='red' type = "submit" icon='times' labelPosition="right" content='delete' />
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}
        </Modal>
    )
}

export default DeleteSalesForm;