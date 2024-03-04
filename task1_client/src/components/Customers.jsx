import React from "react";
import { useEffect, useState } from "react";
import { BASE_URL } from "../App";
import './components.css';
import { ErrorComponent } from "./utils";
import axios from "axios";
import { PaginationRender } from "./PaginationRender";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import {Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";

function CustomersList(){
    const [customers, setCustomers] = useState([]);
    const [newform, setNewform] = useState(false);
    const [editform, setEditform] = useState(false);
    const [deleteform, setDeleteform] = useState(false);
    
    const [argid, setArgid] = useState(0);
    const [argname, setArgname] = useState('');
    const [argaddress, setArgaddress] = useState('');

    const [dataChanged, setDataChanged] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperPage = 6;         // adjust number of items as per required.

    const NewFormAction = () => {
        setNewform(!newform);
        console.log(`newform: ${newform}`);        
    }
    const EditFormAction = function(){
        setEditform(!editform);
        console.log(`editform: ${editform}`);
    }
    const DeleteFormAction = function(){
        setDeleteform(!deleteform);
        console.log(`deleteform: ${deleteform}`);
    }
    const EditFormArgs = function(id1, name1, address1, FormFunction){
        setArgid(id1);
        setArgname(name1);
        setArgaddress(address1);
        FormFunction();     
    }    
    // Define a function to handle page changes
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    }

    useEffect( () => {
        const fetch = async () => {
            const response = await axios.get(`${BASE_URL}/api/Customer`);                        
            setCustomers(response.data)
            //console.log(customers);            
        }
        fetch();
    }, [currentPage, dataChanged]);    

    const pageCount = Math.ceil(customers.length / itemsperPage);
    const indexOfLastRecord = currentPage * itemsperPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsperPage;
    const currentItems = customers.slice(indexOfFirstRecord, indexOfLastRecord);
    console.log('--------------------------');
    console.log(`data-length: ${customers.length} ; pageCount: ${pageCount}`);
    console.log(`currentPage: ${currentPage}`);
    console.log(`indexOfLastRecord: ${indexOfLastRecord}`);
    console.log(`indexOfFirstRecord: ${indexOfFirstRecord}`);
    console.log('current Items:');
    console.log(currentItems);

    return(
        <div id="mainblock">                         
            <Button color='blue' onClick={NewFormAction}>Add Customers</Button>
            <div id="tablediv">
                <Table celled>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Address</TableHeaderCell>
                            <TableHeaderCell>Action</TableHeaderCell>
                            <TableHeaderCell>Action</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>
                                    <Button color="yellow" onClick={ () => EditFormArgs(user.id, user.name, user.address, EditFormAction) } icon="edit" labelPosition="left" content="Edit">                                        
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button color="red" onClick={ () => EditFormArgs(user.id, user.name, user.address, DeleteFormAction) } icon="trash" labelPosition="left" content="Delete">                                    
                                    </Button>
                                </TableCell>
                            </TableRow>                        
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="paginate_panel">
                <PaginationRender 
                    pageCount={pageCount}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
                <div className="pagenumber">
                    {currentPage}
                </div>
            </div>                        
            {newform ? <NewCustomerForm callback = {NewFormAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}            
            {editform ? <EditCustomerForm Id={argid} Name={argname} Address={argaddress} callback = {EditFormAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
            {deleteform ? <DeleteCustomerForm Id={argid} Name={argname} Address={argaddress} callback = {DeleteFormAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null }
        </div>
    )
}

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
    console.log(queryParameter);
    const fetch = `${BASE_URL}/api/Customer/deletecustomer?id=${id}`;
    console.log(queryParameter);
    const handleDeleteForm = async() => {
        try{
            // add form submission here
            const response = await axios.post(fetch);
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
    console.log(queryParameter);
    const fetch = `${BASE_URL}/api/Customer/updatecustomer?id=${id}`;    
    console.log(fetch);

    const handleEditForm = async(event) => {
        event.preventDefault();
        // console.log(`ipname: ${ipname}`);
        // console.log(`ipaddress: ${ipaddress}`);
        try{
            const response = await axios.post(fetch,            
                {
                    name: ipname,
                    address: ipaddress
                }
            );                
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

function NewCustomerForm(props){
    const [ipname, setIpname] = useState('')
    const [ipaddress, setIpaddress] = useState('')
    let openForm = true;
    const [errorString, setErrorString] = useState('');
    //console.log("Add new form HI");

    const handleForm = async (event) => {
        // add form submission here
        event.preventDefault();
        console.log(`ipname: ${ipname}`);
        console.log(`ipaddress: ${ipaddress}`);
        try{
            const response = await axios.post(`${BASE_URL}/api/Customer/createcustomer`,
                {
                    name: ipname,
                    address: ipaddress
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
            <Header as="h2">Create customer</Header>
            <Modal.Content>            
                <Form.Input label="NAME" required type="text" value={ipname} onChange={e => setIpname(e.target.value)} />                    
                <Form.Input label="ADDRESS" required type ="text" value={ipaddress} onChange={e => setIpaddress(e.target.value)} />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' type="button" onClick={props.callback} content='cancel' />
                <Button color='green' type="submit" icon="check" labelPosition="right" content='create' />
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}
        </Modal>
    );
}

export default CustomersList;