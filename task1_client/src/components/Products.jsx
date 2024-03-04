import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../App";
import './components.css';
import { ErrorComponent } from "./utils";
import { PaginationRender } from "./PaginationRender";
import {Button, Modal, Form, Header, Icon} from "semantic-ui-react";
import {Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";

function ProductsList(){
    const [products, setProducts] = useState([]);
    const [newproductform, setNewcreateform] = useState(false);
    const [editproductform, setEditcreateform] = useState(false);
    const [deleteproductform, setDeletecreateform] = useState(false);

    const [argid, setArgid] = useState(0);
    const [argname, setArgname] = useState('');
    const [argprice, setArgprice] = useState(0);

    const [dataChanged, setDataChanged] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperPage = 6;         // adjust number of items as per required.

    const NewProductAction = ()=>{
        setNewcreateform(!newproductform);
        console.log(`newcreateform: ${newproductform}`);
    }
    const EditProductAction = ()=>{
        setEditcreateform(!editproductform);
        console.log(`editcreateform: ${editproductform}`);
    }
    const DeleteProductAction = ()=>{
        setDeletecreateform(!deleteproductform);
        console.log(`deletecreateform: ${deleteproductform}`);
    }
    const EditFormArgs = function(id1, name1, price1, FormFunction){
        setArgid(id1);
        setArgname(name1);
        setArgprice(price1);
        FormFunction();     
    }
    // Define a function to handle page changes
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    }

    useEffect(
        () => {
            const fetchProducts = async function(){
                const newProducts = await axios.get(`${BASE_URL}/api/Product`);
                setProducts(newProducts.data);
                console.log("products:");
                console.log(products);
            }
            fetchProducts();
        }
    , [currentPage, dataChanged]);

    const pageCount = Math.ceil(products.length / itemsperPage);
    const indexOfLastRecord = currentPage * itemsperPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsperPage;
    const currentItems = products.slice(indexOfFirstRecord, indexOfLastRecord);
    
    return(
        <div id = "mainblock">
            <Button color="blue" onClick={NewProductAction}>New product</Button>
            <div id="tablediv">
                <Table celled>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Price</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentItems.map((prod) => (
                            <TableRow key={prod.id}>
                                <TableCell>{prod.name}</TableCell>
                                <TableCell>{prod.price}</TableCell>
                                <TableCell>
                                    <Button color='yellow' onClick={() => EditFormArgs(prod.id, prod.name, prod.price, EditProductAction)} icon='edit' labelPosition="left" content='Edit' >
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button color='red' onClick={() => EditFormArgs(prod.id, prod.name, prod.price, DeleteProductAction)} icon='trash' labelPosition="left" content='Delete' >
                                    </Button>
                                </TableCell>
                            </TableRow>                        
                            )
                        )}
                    </TableBody>
                </Table>
                {newproductform ? <NewProductForm callback={NewProductAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {editproductform ? <EditProductForm Id={argid} Name={argname} Price={argprice} callback = {EditProductAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {deleteproductform ? <DeleteProductForm Id={argid} Name={argname} Price={argprice} callback = {DeleteProductAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
            </div>
            <div className="nav_panel">
                <PaginationRender 
                    pageCount={pageCount}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
                <div className="pagenumber">
                    {currentPage}
                </div>
            </div>
        </div>
    )
}

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
    console.log(queryParameter);
    const fetch = `${BASE_URL}/api/Product/updateproduct?id=${id}`;    
    console.log(fetch);
    const handleEditForm = async(event) => {
        event.preventDefault();
        //console.log('ipname: ${ipname}');
        //console.log('ipprice: ${ipprice}');
        try{
            const response = await axios.post(fetch,            
                {
                    name: ipname,
                    price: ipprice
                }
            );        
            //const { data } = response;
            alert(response.status);
            // form close callback
            callback();
            dataChange();
        }
        catch (error){
            let errorMsg = error.message + ".\n" + error.response.data.errors.Name;
            //console.log(errorMsg);            
            setErrorString(errorMsg);
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
    console.log(queryParameter);
    const fetch = `${BASE_URL}/api/Product/deleteproduct?id=${id}`;
    console.log(queryParameter);
    const handleDeleteForm = async() => {
        // add form submission here
        try{
            const response = await axios.post(fetch);
            alert(response.status);
            // callbacks invoked
            callback();
            dataChange();
        }
        catch (error){
            let errorMsg = error.message + ".\n" + error.response.data.errors.Name;
            //console.log(errorMsg);            
            setErrorString(errorMsg);
        }
    };

    return(
        <Modal as='Form' onSubmit={handleDeleteForm} open={openForm} size='tiny' onOpen={() => {setErrorString('')}}>                            
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

function NewProductForm(props){
    const [ipname, setIpname] = useState('')
    const [ipprice, setIpprice] = useState(0)
    let openForm = true;
    const [errorString, setErrorString] = useState('');

    const handleForm = async (event) => {
        // add form submission here
        event.preventDefault();
        try{
            //console.log(`ipname: ${ipname}`);
            //console.log(`ipprice: ${ipprice}`);
            const response = await axios.post(`${BASE_URL}/api/Product/createproduct`,
                {
                    name: ipname,
                    price: ipprice
                }
            );            
            console.log(response);
            alert(response.status);
            // form close callback
            props.callback();
            props.dataChange();
        }
        catch (error){
            let errorMsg = error.message + ".\n" + error.response.data.errors.Name;
            //console.log(errorMsg);            
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
export default ProductsList;