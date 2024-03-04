import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../App";
import "./components.css";
import { ErrorComponent } from "./utils";
import { PaginationRender } from "./PaginationRender";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import {Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";

function StoresList(){
    const [store, setStore] = useState([]);
    const [newstoreform, setNewstoreform] = useState(false);
    const [editstoreform, setEditstoreform] = useState(false);
    const [deletestoreform, setDeletestoreform] = useState(false);
    
    const [argid, setArgid] = useState(0);
    const [argname, setArgname] = useState('');
    const [argaddress, setArgaddress] = useState('');

    const [dataChanged, setDataChanged] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperPage = 6;         // adjust number of items as per required.

    const NewStoreAction = ()=>{
        setNewstoreform(!newstoreform);
        console.log(`newstoreform: ${newstoreform}`);
    }
    const EditStoreAction = ()=>{
        setEditstoreform(!editstoreform);
        console.log(`editstoreform: ${editstoreform}`);
    }
    const DeleteStoreAction = ()=>{
        setDeletestoreform(!deletestoreform);
        console.log(`deletestoreform: ${deletestoreform}`);
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

    useEffect(
        () => {
            const fetchStores = async function(){
                const newstore = await axios.get(`${BASE_URL}/api/Store`);                
                setStore(newstore.data);
                console.log(`store: ${store}`);
            }
            fetchStores();
        }
    , [currentPage, dataChanged]);

    const pageCount = Math.ceil(store.length / itemsperPage);
    const indexOfLastRecord = currentPage * itemsperPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsperPage;
    const currentItems = store.slice(indexOfFirstRecord, indexOfLastRecord);

    return(
        <div id = "mainblock">
            <Button color='blue' onClick={NewStoreAction}>New Store</Button>
            <div id="tablediv">
                <Table celled>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Address</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.address}</TableCell>
                                <TableCell>
                                    <Button color='yellow' onClick={() => EditFormArgs(item.id, item.name, item.address, EditStoreAction)} icon='edit' labelPosition="left" content='Edit' >
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button color='red' onClick={() => EditFormArgs(item.id, item.name, item.address, DeleteStoreAction)} icon='trash' labelPosition="left" content='Delete' >
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {newstoreform ? <NewStoreForm callback={NewStoreAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {editstoreform ? <EditStoreForm Id={argid} Name={argname} Address={argaddress} callback = {EditStoreAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {deletestoreform ? <DeleteStoreForm Id={argid} Name={argname} Address={argaddress} callback={DeleteStoreAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
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

function DeleteStoreForm(props){
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
    const fetch = `${BASE_URL}/api/Store/deletestore?id=${id}`;
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
            <Header as='h2'>Delete store</Header>
            <Header as='h3'>Are you sure?</Header>
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='cancel' />
                <Button color='red' type='submit' icon='times' labelPosition="right" content='delete' />
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}
        </Modal>
    )
}

function EditStoreForm(props){
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
    const fetch = `${BASE_URL}/api/Store/updatestore?id=${id}`;    
    console.log(fetch);
    const handleEditForm = async(event) => {
        event.preventDefault();
        try{
            //console.log(`ipname: ${ipname}`);
            //console.log(`ipaddress: ${ipaddress}`);
            const response = await axios.post(fetch,            
                {
                    name: ipname,
                    address: ipaddress
                }
            );        
            const { data } = response;
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
            <Header as='h2'>Edit store</Header>
            <Modal.Content>
                <Form.Input label='NAME' required type="text" value={ipname} onChange={e => setIpname(e.target.value)} />
                <Form.Input label='ADDRESS' required type="text" value={ipaddress} onChange={e => setIpaddress(e.target.value)} />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='cancel'/>
                <Button color='green' type="submit" icon='check' labelPosition="right" content='Edit'/>
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}
        </Modal>                
    )
}

function NewStoreForm(props){
    const [ipname, setIpname] = useState('')
    const [ipaddress, setIpaddress] = useState('')
    let openForm = true;
    const [errorString, setErrorString] = useState('');

    const handleForm = async (event) => {
        // add form submission here
        event.preventDefault();
        try{
            //console.log(`ipname: ${ipname}`);
            //console.log(`ipaddress: ${ipaddress}`);
            const response = await axios.post(`${BASE_URL}/api/Store/createstore`,
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
            
            <Header as="h2">Create product</Header>
            <Modal.Content>
                <Form.Input label='NAME' required type="text" value={ipname} onChange={e => setIpname(e.target.value)} />
                <Form.Input label='ADDRESS' required type="text" value={ipaddress} onChange={e => setIpaddress(e.target.value)} />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' type="button" onClick={props.callback} content='cancel' />
                <Button color='green' type="submit" icon="check" labelPosition="right" content='create' />
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}            
        </Modal>
    )
}

export default StoresList;