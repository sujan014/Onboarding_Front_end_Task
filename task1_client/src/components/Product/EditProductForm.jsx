import React from "react";
import { useEffect, useState } from "react";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import axios from "axios";
import { ErrorComponent } from "../util/utils";
import { BASE_URL } from "../../App";

function EditProductForm(props){
    const {Id, Name, Price, callback, dataChange} = props;
    const [id, setId] = useState(Id);
    const [ipname, setIpname] = useState(Name);
    const [ipprice, setIpprice] = useState(Price);    
    const [errorString, setErrorString] = useState('');
    let openForm = true;

    const queryParameter = {
        id: id
    };
    
    const fetch = `${BASE_URL}/api/Product/updateProduct/${id}`;    
    
    const handleEditForm = async(event) => {
        event.preventDefault();
        
        try{
            const response = await axios.put(fetch,            
                {
                    name: ipname,
                    price: ipprice
                }
            );        
            if (response.status === 200){
                alert("Product Edited.");
                // form close callback
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
        <Modal as={Form} onSubmit={handleEditForm} open={openForm} size="tiny" onOpen={() => setErrorString('')}>
            <Header as='h2'>Edit customer</Header>
            <Modal.Content>
                <Form.Input label='NAME' required type="text" value={ipname} onChange={e => setIpname(e.target.value)} />                        
                <Form.Input label='PRICE' required type="number" value={ipprice} onChange={e => setIpprice(e.target.value)} />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='cancel' />
                <Button color='green' type="submit" icon='check' labelPosition="right" content='Edit'/>
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString}/> : null}
        </Modal>
    )
}

export default EditProductForm;