import React from "react";
import { useEffect, useState } from "react";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import axios from "axios";
import { ErrorComponent } from "../util/utils";
import { BASE_URL } from "../../App";
import { getCustomers, getProducts, getStores } from "./SalesUtil";

function NewSalesForm(props){
    const {callback, dataChange} = props;

    const [ipproduct, setIpproduct] = useState('');
    const [ipcustomer, setIpcustomer] = useState('');
    const [ipstore, setIpstore] = useState('');
    const [ipdate, setIpdate] = useState('');
    
    const [productOptions, setProductOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [storeOptions, setStoreOptions] = useState([]);
    
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [storeList, setStoreList] = useState([]);

    let openForm = true;
    const [errorString, setErrorString] = useState('');

    const GetFKeyName = async () => {
        try{
            const pfetch = await getProducts();            
            if (pfetch?.data && pfetch?.data.length > 0){
                const products = pfetch.data.map( item => item.name);
                setProductList(pfetch.data);
                setProductOptions( pfetch.data.map( (item, index) => {
                    return {
                        key: index, 
                        value: item.name, 
                        text: item.name
                    };
                }));
                // set default value 
                setIpproduct(products[0]);
            }
            const cfetch = await getCustomers();
            if (cfetch?.data && cfetch?.data.length > 0){
                const customers = cfetch.data.map( item => item.name);
                setCustomerList(cfetch.data);
                //setAllcustomernames(customers);
                setCustomerOptions( cfetch.data.map( (item, index) => {
                    return {
                        key: index, 
                        value: item.name, 
                        text: item.name
                    };
                }));
                // set default value 
                setIpcustomer(customers[0]);
            }
            const sfetch = await getStores();
            if (sfetch?.data && sfetch?.data.length > 0){
                const stores = sfetch.data.map( item => item.name);
                setStoreList(sfetch.data);
                //setAllstorenames(stores);
                setStoreOptions( sfetch.data.map( (item, index) => {
                    return {
                        key: index, 
                        value: item.name, 
                        text: item.name
                    };
                }));
                // set default value 
                setIpstore(stores[0]);
            }
            // Set default value so as not make empty states                                    
        }
        catch(error){
            if (error === undefined || error === null){
                alert("Error: Cannot load Sales data.");
            }
            else{
                alert(error);
            }
        }
    };
    useEffect( 
        () => {            
            GetFKeyName();
        }, []
    );    

    const handleForm = async (event) => {
        // add form submission here
        event.preventDefault();
        
        // get product ID
        const ipproductId = (productList.find( item => item.name == ipproduct))?.id;
        const ipcustomerId = (customerList.find( item => item.name == ipcustomer))?.id;
        const ipstoreId = (storeList.find( item => item.name == ipstore))?.id;
        
        try{
            const response = await axios.post(`${BASE_URL}/api/Sales/createSales`,
                {
                    productId: ipproductId,
                    customerId: ipcustomerId,
                    storeId: ipstoreId,
                    dateSold: ipdate
                }
            );
            if (response.status === 200){
                alert("Sales Created.");            
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
    }

    return(
        <Modal as={Form} onSubmit={handleForm} open={openForm} size="tiny" onOpen={() => {setErrorString('')}}>
            
            <Header as='h2' content='Create sales' />
            <Modal.Content>
            
            <Form.Input label='Date sold' required type="datetime-local" value={ipdate} onChange={ e => setIpdate(e.target.value) } />
            
            <Form.Select label='Product' required options={ productOptions } value={ipproduct} 
                onChange={(e, data) => setIpproduct(data.value)}                
            />
            <Form.Select label='Customer' required options={ customerOptions } value={ipcustomer} 
                onChange={(e, data) => setIpcustomer(data.value)}
            />

            <Form.Select label='Store' required options={ storeOptions } value={ipstore}  
                onChange={(e, data) => setIpstore(data.value)}                
            />
            </Modal.Content>

            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='Cancel' />
                <Button color='red' type="submit" icon="check" labelPosition="right" content='Create'/>
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}            
        </Modal>
    )
}

export default NewSalesForm;