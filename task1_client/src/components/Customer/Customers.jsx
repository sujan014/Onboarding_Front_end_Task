import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";
import { PaginationRender } from "../Pagination/PaginationRender";
import { BASE_URL } from "../../App";
import '../components.css';
import { RenderNewCustomerForm, RenderEditCustomerForm, RenderDeleteCustomerForm } from "./RenderCustomerForms";
import CustomerTableMap from "./CustomerTableMap";

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
            if (response?.data && response.data.length){
                setCustomers(response.data);
            } else {
                alert("Customer data is empty.");
            }
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
                        {currentItems.map((customer) => {
                            const id = customer?.id ? customer.id : 0;
                            // const name = customer?.name ? customer.name : "";
                            // const address = customer?.address ? customer.address : "";
                            const dateTime = new Date().toLocaleDateString();
                            return (
                                <CustomerTableMap
                                    key={`Customer-${dateTime}-${id}`} 
                                    customer={customer} 
                                    EditFormArgs = {EditFormArgs}
                                    EditFormAction = {EditFormAction}
                                    DeleteFormAction = {DeleteFormAction}
                                />
                                )
                            }                                                        
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
            <RenderNewCustomerForm 
                condition={newform} 
                formAction = {NewFormAction} 
                updateChange={() => {setDataChanged(!dataChanged)}}
            />
            <RenderEditCustomerForm 
                Id={argid} 
                condition={editform}  
                Name={argname} 
                Address={argaddress} 
                formAction = {EditFormAction} 
                updateChange={() => {setDataChanged(!dataChanged)}}
            />
            <RenderDeleteCustomerForm 
                Id={argid} 
                condition={deleteform}  
                Name={argname} 
                Address={argaddress} 
                formAction = {DeleteFormAction} 
                updateChange={() => {setDataChanged(!dataChanged)}} 
            />            
        </div>
    )
}

export default CustomersList;