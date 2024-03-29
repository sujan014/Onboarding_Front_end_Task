import React from "react";
import { useEffect, useState } from "react";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import axios from "axios";
import { ErrorComponent } from "../util/utils";
import { BASE_URL } from "../../App";
import { getCustomers, getProducts, getStores } from "./SalesUtil";

function EditSalesForm(props){
    const {editid, callback, dataChange} = props;    
    const [errorString, setErrorString] = useState('');
    let openForm = true;

    const [ipproduct, setIpproduct] = useState('')
    const [ipcustomer, setIpcustomer] = useState('')
    const [ipstore, setIpstore] = useState('');
    const [ipdate, setIpdate] = useState('');
    
    const [productOptions, setProductOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [storeOptions, setStoreOptions] = useState([]);
    
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [storeList, setStoreList] = useState([]);    

    const GetFKeyName = async () => {
        try{
            // Fetch products table
            
            const productFetch = await getProducts();
            if (productFetch?.data && productFetch?.data.length){
                const products = productFetch.data.map( item => item.name);
                setProductList(productFetch.data);          // All Products data                
                setProductOptions( productFetch.data.map( (item, index) => {
                    return {
                        key: index, 
                        value: item.name, 
                        text: item.name
                    };
                }));
            }
            // Fetch Customers table            
            const cstomerFetch = await getCustomers();
            if (cstomerFetch?.data && cstomerFetch?.data.length){
                const customers = cstomerFetch.data.map( item => item.name);
                setCustomerList(cstomerFetch.data);          // All Customer data
                setCustomerOptions(cstomerFetch.data.map( (item, index) => {
                    return {
                        key: index, 
                        value: item.name, 
                        text: item.name
                    }
                }));
            }
            // Fetch stores table
            const storeFetch = await getStores();
            if (storeFetch?.data && storeFetch?.data.length){
                const stores = storeFetch.data.map( item => item.name);
                setStoreList(storeFetch.data);          // All Store data
                setStoreOptions(storeFetch.data.map( (item, index) => {
                    return {
                        key: index, 
                        value: item.name, 
                        text: item.name
                    }
                }));       // All store names
            }
            
            // Fetch sales item by ID            
            const fetchSalesById = await axios.get(`${BASE_URL}/api/Sales/${editid}`);
            if (fetchSalesById?.data){
                // get Sales Foreign key IDs by name
                const get_productID = fetchSalesById.data?.productId ? fetchSalesById.data?.productId : 0;
                const get_customerID = fetchSalesById.data?.customerId ? fetchSalesById.data?.customerId : 0;
                const get_storeID = fetchSalesById.data?.storeId ? fetchSalesById.data?.storeId : 0;
                
                const prod_match = productFetch.data.find( item => item.id == get_productID );
                const get_productName = prod_match?.name ? prod_match?.name : "Undefined";
                const cstomer_match = cstomerFetch.data.find( item => item.id == get_customerID );
                const get_customerName = cstomer_match?.name ? cstomer_match?.name : "Undefined";
                const store_match = storeFetch.data.find( item => item.id == get_storeID );
                const get_storeName = store_match?.name ? store_match?.name : "Undefined";
                
                setIpproduct(get_productName);
                setIpcustomer(get_customerName);
                setIpstore(get_storeName);
                setIpdate(fetchSalesById.dateSold);
            }
        }
        catch(error){
            if (error === undefined || error === null){
                alert("Error: Cannot load Sales data.");
            }
            else{
                alert(error);
            }
            //setErrorString("Error: Cannot load Sales data.");
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
            const response = await axios.put(`${BASE_URL}/api/Sales/updateSales/${editid}`,
                {
                    productId: ipproductId,
                    customerId: ipcustomerId,
                    storeId: ipstoreId,
                    dateSold: ipdate
                }
            );
            if (response.status === 200){
                alert("Sales Edited.");            
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
        <Modal as={Form} onSubmit={handleForm} open={openForm} size="tiny" onOpen={() => setErrorString('')}>
            
            <Header as='h2'>Edit sales</Header>
            <Modal.Content>
                <Form.Input label='Edit sales' required type="datetime-local" value={ipdate} onChange={ e => setIpdate(e.target.value) } />
                    
                <Form.Select label='Product' required options={ productOptions } value={ipproduct} 
                    onChange={(e, data) => setIpproduct(data.value)}
                />

                <Form.Select label='Customer' required options={ customerOptions} value={ipcustomer} 
                    onChange={(e, data) => setIpcustomer(data.value)}
                />

                <Form.Select label='Store' required options={ storeOptions} value={ipstore} 
                    onChange={(e, data) => setIpstore(data.value)}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback}  content='cancel'/>
                <Button color='green' type="submit" icon='check' labelPosition="right" content='Edit'/>
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}
        </Modal>
    )
}

export default EditSalesForm;