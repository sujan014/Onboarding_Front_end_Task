import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";
import { PaginationRender } from "../Pagination/PaginationRender";
import "../components.css";
import { BASE_URL } from "../../App";
import DeleteStoreForm from "./DeleteStoreForm";
import EditStoreForm from "./EditStoreForm";
import NewStoreForm from "./NewStoreForm";
import { RenderNewStoreForm, RenderEditStoreForm, RenderDeleteStoreForm } from "./RenderStoreForms";

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

    const NewStoreAction = () => {
        setNewstoreform(!newstoreform);        
    }
    const EditStoreAction = () => {
        setEditstoreform(!editstoreform);        
    }
    const DeleteStoreAction = () => {
        setDeletestoreform(!deletestoreform);        
    }
    const EditFormArgs = (id1, name1, address1, FormFunction) => {
        setArgid(id1);
        setArgname(name1);
        setArgaddress(address1);
        FormFunction();     
    }
    // Define a function to handle page changes
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    }
    const fetchStores = async () => {
        try{
            const newstore = await axios.get(`${BASE_URL}/api/Store`);                
            setStore(newstore.data);            
        }
        catch{
            alert("Error: Cannot fetch Stores.");
        }
    }
    useEffect(
        () => {            
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
                <RenderNewStoreForm condition={newstoreform} formAction={NewStoreAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
                <RenderEditStoreForm condition={editstoreform} Id={argid} Name={argname} Address={argaddress} formAction = {EditStoreAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
                <RenderDeleteStoreForm condition={deletestoreform} Id={argid} Name={argname} Address={argaddress} formAction={DeleteStoreAction} updateChange={() => {setDataChanged(!dataChanged)}}/>

                {/* {newstoreform ? <NewStoreForm callback={NewStoreAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {editstoreform ? <EditStoreForm Id={argid} Name={argname} Address={argaddress} callback = {EditStoreAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {deletestoreform ? <DeleteStoreForm Id={argid} Name={argname} Address={argaddress} callback={DeleteStoreAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null} */}
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

export default StoresList;