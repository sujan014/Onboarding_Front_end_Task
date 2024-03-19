import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";
import { PaginationRender } from "../Pagination/PaginationRender";
import { BASE_URL } from "../../App";
import '../components.css';
import { RenderNewCustomerForm, RenderEditCustomerForm, RenderDeleteCustomerForm } from "./RenderCustomerForms";
import NewCustomerForm from "./NewCustomerForm";
import DeleteCustomerForm from "./DeleteCustomerForm";
import EditCustomerForm from "./EditCustomerForm";

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
    }
    const EditFormAction = () => {
        setEditform(!editform);        
    }
    const DeleteFormAction = () => {
        setDeleteform(!deleteform);        
    }
    const EditFormArgs = (id1, name1, address1, FormFunction) => {
        setArgid(id1);
        setArgname(name1);
        setArgaddress(address1);
        FormFunction();     
    }
    const fetchCustomers = async () => {
        try{
            const response = await axios.get(`${BASE_URL}/api/Customer`);                        
            setCustomers(response.data);
        }
        catch{
            alert("Error: Cannot fetch Customers.");
        }        
    }    
    // Define a function to handle page changes
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    }

    useEffect( () => {        
        fetchCustomers();
    }, [currentPage, dataChanged]);    

    const pageCount = Math.ceil(customers.length / itemsperPage);
    const indexOfLastRecord = currentPage * itemsperPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsperPage;
    const currentItems = customers.slice(indexOfFirstRecord, indexOfLastRecord);
    
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
            <RenderNewCustomerForm condition={newform} formAction = {NewFormAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
            <RenderEditCustomerForm condition={editform} Id={argid} Name={argname} Address={argaddress} formAction = {EditFormAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
            <RenderDeleteCustomerForm condition={deleteform} Id={argid} Name={argname} Address={argaddress} formAction = {DeleteFormAction} updateChange={() => {setDataChanged(!dataChanged)}} />
            {/* {newform ? <NewCustomerForm callback = {NewFormAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null} */}
            {/* {editform ? <EditCustomerForm Id={argid} Name={argname} Address={argaddress} callback = {EditFormAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null} */}
            {/* {deleteform ? <DeleteCustomerForm Id={argid} Name={argname} Address={argaddress} callback = {DeleteFormAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null } */}
        </div>
    )
}

export default CustomersList;